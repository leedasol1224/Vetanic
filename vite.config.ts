import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'admin-auth-dev-server',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.startsWith('/api/admin-auth')) {
              const configuredPassword = env.ADMIN_ACCESS_PASSWORD || process.env.ADMIN_ACCESS_PASSWORD || 'doridori';
              const sessionSecret = env.ADMIN_SESSION_SECRET || configuredPassword || 'vetanic_dev_secret';

              res.setHeader('Content-Type', 'application/json');

              if (req.method === 'GET') {
                const authHeader = req.headers.authorization || '';
                const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';

                if (!token) {
                  res.statusCode = 401;
                  res.end(JSON.stringify({ valid: false, error: 'No session token provided' }));
                  return;
                }

                try {
                  const parts = token.split('.');
                  if (parts.length === 3) {
                    const [header, body, sig] = parts;
                    const expectedSig = crypto.createHmac('sha256', sessionSecret).update(`${header}.${body}`).digest('base64url');
                    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
                      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
                      if (!payload.exp || payload.exp >= Math.floor(Date.now() / 1000)) {
                        res.statusCode = 200;
                        res.end(JSON.stringify({
                          valid: true,
                          user: {
                            id: payload.sub || 'admin',
                            name: payload.name || 'VETANIC Admin',
                            email: payload.email || 'admin@vetanic.sg',
                            role: payload.role || 'Owner',
                            active: true
                          }
                        }));
                        return;
                      }
                    }
                  }
                } catch {
                  // ignore
                }

                res.statusCode = 401;
                res.end(JSON.stringify({ valid: false, error: 'Session expired or invalid' }));
                return;
              }

              if (req.method === 'POST') {
                let bodyStr = '';
                req.on('data', chunk => { bodyStr += chunk; });
                req.on('end', () => {
                  try {
                    const body = JSON.parse(bodyStr || '{}');
                    const inputPassword = body?.password;

                    if (!inputPassword || typeof inputPassword !== 'string') {
                      res.statusCode = 400;
                      res.end(JSON.stringify({ success: false, error: 'Password is required' }));
                      return;
                    }

                    if (inputPassword.trim() !== configuredPassword.trim()) {
                      res.statusCode = 401;
                      res.end(JSON.stringify({ success: false, error: 'Incorrect password. Access denied.' }));
                      return;
                    }

                    const nowSec = Math.floor(Date.now() / 1000);
                    const expSec = nowSec + 8 * 3600;
                    const tokenPayload = {
                      sub: 'admin',
                      name: 'VETANIC Admin',
                      email: 'admin@vetanic.sg',
                      role: 'Owner',
                      iat: nowSec,
                      exp: expSec
                    };

                    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
                    const payloadB64 = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
                    const signature = crypto.createHmac('sha256', sessionSecret).update(`${header}.${payloadB64}`).digest('base64url');
                    const token = `${header}.${payloadB64}.${signature}`;

                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      success: true,
                      token,
                      user: {
                        id: 'admin',
                        name: 'VETANIC Admin',
                        email: 'admin@vetanic.sg',
                        role: 'Owner',
                        active: true
                      }
                    }));
                  } catch {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ success: false, error: 'Server error parsing request' }));
                  }
                });
                return;
              }

              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }
            next();
          });
        }
      }
    ],
  };
});
