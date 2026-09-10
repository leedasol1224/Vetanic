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

  // --- GET: Fetch inventory movements ---
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('inventory_movements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    } catch (err) {
      console.error('Supabase admin fetch inventory movements error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to fetch inventory movements'
      });
    }
  }

  // --- POST: Save a new inventory movement record ---
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
        .from('inventory_movements')
        .insert({
          product_id: body.productId,
          product_name: body.productName,
          sku: body.sku,
          movement_type: body.movementType,
          quantity_change: body.quantityChange,
          stock_before: body.stockBefore,
          stock_after: body.stockAfter,
          order_id: body.orderId || null,
          order_reference: body.orderReference || null,
          reason: body.reason,
          internal_note: body.internalNote || null,
          admin_user: body.adminUser || 'VETANIC Admin'
        })
        .select('*')
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    } catch (err) {
      console.error('Supabase admin save inventory movement error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to record inventory movement'
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
