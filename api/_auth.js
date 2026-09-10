import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const COOKIE_NAME = 'vetanic_admin_session';
const SESSION_MAX_AGE_SEC = 8 * 3600; // 8 hours

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

/**
 * Sign payload using HMAC-SHA256
 */
export function signToken(payload, secret) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

/**
 * Verify HMAC-SHA256 signed token
 */
export function verifyToken(token, secret) {
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
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Constant-time string comparison
 */
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Parse cookies from request header
 */
export function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      list[name] = decodeURIComponent(val);
    }
  });

  return list;
}

/**
 * Construct Set-Cookie header for HttpOnly secure session
 */
export function buildSessionCookie(token, maxAge = SESSION_MAX_AGE_SEC) {
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const secureFlag = isProduction ? 'Secure;' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; ${secureFlag} SameSite=Strict`;
}

export function buildClearCookie() {
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const secureFlag = isProduction ? 'Secure;' : '';
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; ${secureFlag} SameSite=Strict`;
}

/**
 * Verify admin session from HttpOnly Cookie or Authorization header
 */
export function verifyAdminSession(req) {
  const configuredPassword = process.env.ADMIN_ACCESS_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || configuredPassword;

  if (!configuredPassword || !sessionSecret) {
    return { isValid: false, error: 'Server configuration error: ADMIN_ACCESS_PASSWORD not set.' };
  }

  // 1. Try HttpOnly Cookie
  const cookies = parseCookies(req.headers.cookie || '');
  let token = cookies[COOKIE_NAME];

  // 2. Try Authorization Bearer Header fallback
  if (!token) {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    return { isValid: false, error: 'Authentication required. No session cookie or token provided.' };
  }

  const payload = verifyToken(token, sessionSecret);
  if (!payload) {
    return { isValid: false, error: 'Session expired or invalid. Please sign in again.' };
  }

  return {
    isValid: true,
    user: {
      id: payload.sub || 'admin',
      name: payload.name || 'VETANIC Admin',
      email: payload.email || 'admin@vetanic.sg',
      role: payload.role || 'Owner',
      active: true
    }
  };
}

/**
 * Get server-side Supabase client using privileged SERVICE_ROLE_KEY
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in server environment variables.');
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
