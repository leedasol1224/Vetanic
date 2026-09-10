import crypto from 'crypto';

/**
 * Helper to encode Base64 URL safe strings
 */
function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

/**
 * Sign a payload with HMAC-SHA256
 */
function signToken(payload, secret) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 signed token
 */
function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');

  try {
    const sigBuffer = Buffer.from(sig);
    const expectedSigBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length !== expectedSigBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Run comparison against self to maintain constant time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  // Set CORS and security headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const configuredPassword = process.env.ADMIN_ACCESS_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || configuredPassword || 'vetanic_internal_secret_salt_2026';

  if (!configuredPassword) {
    console.error('CRITICAL: ADMIN_ACCESS_PASSWORD environment variable is not configured on the server.');
    return res.status(500).json({
      success: false,
      error: 'Admin access password is not configured on the server environment. Please set ADMIN_ACCESS_PASSWORD in Vercel settings.'
    });
  }

  // --- GET: Verify existing session token ---
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';

    if (!token) {
      return res.status(401).json({ valid: false, error: 'No session token provided' });
    }

    const payload = verifyToken(token, sessionSecret);
    if (!payload) {
      return res.status(401).json({ valid: false, error: 'Session expired or invalid' });
    }

    return res.status(200).json({
      valid: true,
      user: {
        id: payload.sub || 'admin',
        name: payload.name || 'VETANIC Admin',
        email: payload.email || 'admin@vetanic.sg',
        role: payload.role || 'Owner',
        active: true
      }
    });
  }

  // --- POST: Authenticate password ---
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const inputPassword = body?.password;

    if (!inputPassword || typeof inputPassword !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }

    const isValid = safeCompare(inputPassword.trim(), configuredPassword.trim());

    if (!isValid) {
      // Intentional micro-delay to deter brute-force attempts
      await new Promise((resolve) => setTimeout(resolve, 400));
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Access denied.'
      });
    }

    // 8-hour session lifetime (28,800 seconds)
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = nowSec + 8 * 3600;

    const tokenPayload = {
      sub: 'admin',
      name: 'VETANIC Admin',
      email: process.env.ADMIN_AUTH_EMAIL || 'vetanicsg@gmail.com',
      role: 'Owner',
      iat: nowSec,
      exp: expSec
    };

    const sessionToken = signToken(tokenPayload, sessionSecret);

    // If Supabase Auth credentials are provided on server, authenticate to obtain JWT for Supabase RLS
    let supabaseSession = null;
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const adminAuthEmail = process.env.ADMIN_AUTH_EMAIL || 'vetanicsg@gmail.com';
    const adminAuthPassword = process.env.ADMIN_AUTH_PASSWORD || configuredPassword;

    if (supabaseUrl && supabaseAnonKey && adminAuthEmail && adminAuthPassword) {
      try {
        const authRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey
          },
          body: JSON.stringify({
            email: adminAuthEmail,
            password: adminAuthPassword
          })
        });

        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.access_token && authData.refresh_token) {
            supabaseSession = {
              access_token: authData.access_token,
              refresh_token: authData.refresh_token,
              expires_in: authData.expires_in,
              token_type: authData.token_type,
              user: authData.user
            };
          }
        }
      } catch (sbErr) {
        console.warn('Optional Supabase Auth server sign-in skipped:', sbErr);
      }
    }

    return res.status(200).json({
      success: true,
      token: sessionToken,
      supabaseSession,
      user: {
        id: 'admin',
        name: 'VETANIC Admin',
        email: process.env.ADMIN_AUTH_EMAIL || 'vetanicsg@gmail.com',
        role: 'Owner',
        active: true
      }
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
