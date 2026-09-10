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

  // --- GET: Fetch all orders or a single order ---
  if (req.method === 'GET') {
    const idOrRef = req.query?.id || req.query?.orderReference;

    try {
      if (idOrRef) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrRef);
        let query = supabaseAdmin
          .from('orders')
          .select(`
            *,
            order_items (*)
          `);

        if (isUuid) {
          query = query.or(`id.eq.${idOrRef},order_reference.eq.${idOrRef}`);
        } else {
          query = query.eq('order_reference', idOrRef);
        }

        const { data, error } = await query.maybeSingle();

        if (error) throw error;
        return res.status(200).json({ success: true, data });
      }

      // Fetch all orders
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    } catch (err) {
      console.error('Supabase admin fetch orders error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to fetch orders from database'
      });
    }
  }

  // --- POST: Update order status or internal notes ---
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { action, id, orderReference, status, notes, updates } = body || {};
    const targetId = id || orderReference;

    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Order ID or reference is required' });
    }

    try {
      if (action === 'update_status') {
        const payload = {
          status,
          ...(updates || {})
        };

        const { error } = await supabaseAdmin
          .from('orders')
          .update(payload)
          .or(`id.eq.${targetId},order_reference.eq.${targetId}`);

        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      if (action === 'update_notes') {
        const { error } = await supabaseAdmin
          .from('orders')
          .update({ internal_notes: notes || '' })
          .or(`id.eq.${targetId},order_reference.eq.${targetId}`);

        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ success: false, error: `Unsupported action: ${action}` });
    } catch (err) {
      console.error('Supabase admin update order error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to update order in database'
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
