import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Propagate env vars to process.env for api handlers in dev mode
  Object.entries(env).forEach(([k, v]) => {
    if (!process.env[k]) process.env[k] = v;
  });

  return {
    plugins: [
      react(),
      {
        name: 'admin-api-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/')) {
              const urlPath = req.url.split('?')[0];
              const queryStr = req.url.includes('?') ? req.url.split('?')[1] : '';
              const query = Object.fromEntries(new URLSearchParams(queryStr));

              let handlerModule = null;
              if (urlPath === '/api/admin-auth') {
                handlerModule = await import('./api/admin-auth.js');
              } else if (urlPath === '/api/admin-orders') {
                handlerModule = await import('./api/admin-orders.js');
              } else if (urlPath === '/api/admin-inventory') {
                handlerModule = await import('./api/admin-inventory.js');
              } else if (urlPath === '/api/admin-notifications') {
                handlerModule = await import('./api/admin-notifications.js');
              } else if (urlPath === '/api/admin-communications') {
                handlerModule = await import('./api/admin-communications.js');
              }

              if (handlerModule && handlerModule.default) {
                let body: unknown = {};
                if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
                  const buffers: Buffer[] = [];
                  for await (const chunk of req) {
                    buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
                  }
                  const rawBody = Buffer.concat(buffers).toString('utf8');
                  try {
                    body = JSON.parse(rawBody || '{}');
                  } catch {
                    body = rawBody;
                  }
                }

                const mockReq = Object.assign(req, { query, body });
                const mockRes = Object.assign(res, {
                  status(code: number) {
                    res.statusCode = code;
                    return mockRes;
                  },
                  json(data: unknown) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return mockRes;
                  }
                });

                try {
                  await handlerModule.default(mockReq, mockRes);
                  return;
                } catch (handlerErr) {
                  console.error('API Dev Server Error:', handlerErr);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: String(handlerErr) }));
                  return;
                }
              }
            }
            next();
          });
        }
      }
    ],
  };
});
