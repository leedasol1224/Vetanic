import { signToken, safeCompare, buildSessionCookie, buildClearCookie, verifyAdminSession } from './_auth.js';

export default async function handler(req, res) {
  // Set CORS and security headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const configuredPassword = process.env.ADMIN_ACCESS_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || configuredPassword;

  if (!configuredPassword) {
    console.error('CRITICAL: ADMIN_ACCESS_PASSWORD environment variable is not configured on Vercel.');
    return res.status(500).json({
      success: false,
      error: 'ADMIN_ACCESS_PASSWORD is not configured in Vercel environment variables.'
    });
  }

  // --- GET: Verify current session (via HttpOnly Cookie or Bearer header) ---
  if (req.method === 'GET') {
    const authResult = verifyAdminSession(req);

    if (!authResult.isValid) {
      return res.status(401).json({
        valid: false,
        error: authResult.error || 'Unauthorized'
      });
    }

    return res.status(200).json({
      valid: true,
      user: authResult.user
    });
  }

  // --- POST: Login or Logout ---
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    // Action: Logout
    if (body?.action === 'logout' || req.query?.action === 'logout') {
      res.setHeader('Set-Cookie', buildClearCookie());
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    }

    // Action: Login with single shared password
    const inputPassword = body?.password;

    if (!inputPassword || typeof inputPassword !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }

    const isValid = safeCompare(inputPassword.trim(), configuredPassword.trim());

    if (!isValid) {
      // Micro-delay to deter brute-force attempts
      await new Promise((resolve) => setTimeout(resolve, 400));
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Access denied.'
      });
    }

    // Generate signed HMAC token with 8-hour expiry
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

    const sessionToken = signToken(tokenPayload, sessionSecret);

    // Attach HttpOnly, Secure, SameSite=Strict cookie
    res.setHeader('Set-Cookie', buildSessionCookie(sessionToken));

    return res.status(200).json({
      success: true,
      token: sessionToken,
      user: {
        id: 'admin',
        name: 'VETANIC Admin',
        email: 'admin@vetanic.sg',
        role: 'Owner',
        active: true
      }
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
