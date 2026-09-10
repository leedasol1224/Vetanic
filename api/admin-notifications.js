import { verifyAdminSession, getSupabaseAdmin } from './_auth.js';

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

  // 1. Verify admin session server-side
  const authResult = verifyAdminSession(req);
  if (!authResult.isValid) {
    return res.status(401).json({
      success: false,
      error: authResult.error || 'Unauthorized. Admin session required.'
    });
  }

  // 2. Initialize Supabase Admin client with service_role key
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is not configured in Vercel.'
    });
  }

  // --- GET: Fetch admin notifications ---
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    } catch (err) {
      console.error('Supabase admin fetch notifications error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to fetch admin notifications'
      });
    }
  }

  // --- POST: Mark notification read ---
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { action, id } = body || {};

    try {
      if (action === 'mark_all_read') {
        const { error } = await supabaseAdmin
          .from('admin_notifications')
          .update({ read: true })
          .eq('read', false);

        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      if (id) {
        const { error } = await supabaseAdmin
          .from('admin_notifications')
          .update({ read: true })
          .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ success: false, error: 'Notification ID or action is required' });
    } catch (err) {
      console.error('Supabase admin mark notification read error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to update notification'
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
