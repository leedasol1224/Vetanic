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

  // --- GET: Fetch communication logs for an order ---
  if (req.method === 'GET') {
    const orderId = req.query?.orderId;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'orderId parameter is required' });
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('communication_logs')
        .select('*')
        .or(`order_id.eq.${orderId},order_reference.eq.${orderId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    } catch (err) {
      console.error('Supabase admin fetch communication logs error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to fetch communication logs'
      });
    }
  }

  // --- POST: Record communication log ---
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('communication_logs')
        .insert({
          order_id: body.orderId,
          order_reference: body.orderReference,
          template_type: body.templateType,
          channel: body.channel,
          message: body.message,
          admin_user: body.adminUser || 'VETANIC Admin',
          status: body.status || 'Sent'
        })
        .select('*')
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    } catch (err) {
      console.error('Supabase admin save communication log error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to save communication log'
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
