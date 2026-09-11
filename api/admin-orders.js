import { verifyAdminSession, getSupabaseAdmin } from "./_auth.js";

const CANONICAL_STATUS_MAP = {
  "pending_confirmation": "pending_confirmation",
  "confirmed": "confirmed",
  "awaiting_payment": "awaiting_payment",
  "paid": "paid",
  "preparing": "preparing",
  "out_for_delivery": "out_for_delivery",
  "completed": "completed",
  "cancelled": "cancelled",
  "Pending Confirmation": "pending_confirmation",
  "Confirmed": "confirmed",
  "Awaiting Payment": "awaiting_payment",
  "Paid": "paid",
  "Preparing": "preparing",
  "Out for Delivery": "out_for_delivery",
  "Completed": "completed",
  "Cancelled": "cancelled"
};

function toCanonicalStatus(status) {
  if (!status) return "pending_confirmation";
  const clean = String(status).trim();
  if (CANONICAL_STATUS_MAP[clean]) {
    return CANONICAL_STATUS_MAP[clean];
  }
  const snake = clean.toLowerCase().replace(/[\s-]+/g, "_");
  return CANONICAL_STATUS_MAP[snake] || "pending_confirmation";
}

function isUuid(val) {
  return typeof val === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim());
}

export default async function handler(req, res) {
  // Set CORS and security headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. Verify admin session server-side
  const authResult = verifyAdminSession(req);
  if (!authResult.isValid) {
    return res.status(401).json({
      success: false,
      error: authResult.error || "Unauthorized. Admin session required."
    });
  }

  // 2. Initialize Supabase Admin client with service_role key
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({
      success: false,
      error: "Server configuration error: SUPABASE_SERVICE_ROLE_KEY is not configured in Vercel."
    });
  }

  // --- GET: Fetch all orders or a single order ---
  if (req.method === "GET") {
    const idOrRef = req.query?.id || req.query?.orderReference;

    try {
      if (idOrRef) {
        let query = supabaseAdmin
          .from("orders")
          .select(`
            *,
            order_items (*)
          `);

        if (isUuid(idOrRef)) {
          query = query.eq("id", idOrRef.trim());
        } else {
          query = query.eq("order_reference", idOrRef.trim());
        }

        const { data, error } = await query.maybeSingle();

        if (error) throw error;
        return res.status(200).json({ success: true, data });
      }

      // Fetch all orders
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    } catch (err) {
      console.error("Supabase admin fetch orders error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to fetch orders from database"
      });
    }
  }

  // --- POST / DELETE: Update order status, internal notes, or bulk delete ---
  if (req.method === "POST" || req.method === "DELETE") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { action, id, orderReference, status, notes, updates, orderIds, restoreInventory } = body || {};

    try {
      // --- ACTION: BULK DELETE ---
      if (action === "bulk_delete" || req.method === "DELETE") {
        const rawIds = Array.isArray(orderIds) ? orderIds : (id || orderReference ? [id || orderReference] : []);
        const targetIds = rawIds.filter(Boolean).map(x => String(x).trim());

        if (targetIds.length === 0) {
          return res.status(400).json({ success: false, error: "No order IDs or references provided for deletion" });
        }

        const uuidList = targetIds.filter(isUuid);
        const refList = targetIds.filter(x => !isUuid(x));

        // Fetch targeted orders to check inventory deduction status and retrieve exact UUIDs & references
        let fetchQuery = supabaseAdmin.from("orders").select("id, order_reference, customer_name, inventory_deducted, inventory_restored, order_items (*)");
        if (uuidList.length > 0 && refList.length > 0) {
          fetchQuery = fetchQuery.or(`id.in.(${uuidList.join(",")}),order_reference.in.(${refList.join(",")})`);
        } else if (uuidList.length > 0) {
          fetchQuery = fetchQuery.in("id", uuidList);
        } else {
          fetchQuery = fetchQuery.in("order_reference", refList);
        }

        const { data: matchedOrders, error: fetchErr } = await fetchQuery;
        if (fetchErr) throw fetchErr;

        const allOrderUuids = (matchedOrders || []).map(o => o.id);
        const allOrderRefs = (matchedOrders || []).map(o => o.order_reference);

        // Safely restore stock if inventory was deducted and restoration is requested
        let restoredCount = 0;
        if (restoreInventory !== false && matchedOrders && matchedOrders.length > 0) {
          for (const ord of matchedOrders) {
            if (ord.inventory_deducted && !ord.inventory_restored && Array.isArray(ord.order_items)) {
              for (const item of ord.order_items) {
                try {
                  await supabaseAdmin.from("inventory_movements").insert({
                    product_id: item.product_id,
                    product_name: item.product_name,
                    sku: item.product_id,
                    movement_type: "Cancellation Restock",
                    quantity_change: item.quantity,
                    stock_before: 0,
                    stock_after: item.quantity,
                    order_id: ord.id,
                    order_reference: ord.order_reference,
                    reason: `Restocked before deleting order ${ord.order_reference}`,
                    internal_note: `Bulk deleted by admin session`,
                    admin_user: authResult.user?.name || "VETANIC Admin"
                  });
                  restoredCount += 1;
                } catch (stockErr) {
                  console.warn("Stock restoration notice during deletion:", stockErr);
                }
              }
            }
          }
        }

        // 1. Delete associated communication logs
        if (allOrderUuids.length > 0) {
          await supabaseAdmin.from("communication_logs").delete().in("order_id", allOrderUuids);
        }
        if (allOrderRefs.length > 0) {
          await supabaseAdmin.from("communication_logs").delete().in("order_reference", allOrderRefs);
        }

        // 2. Delete associated admin notifications
        if (allOrderUuids.length > 0) {
          await supabaseAdmin.from("admin_notifications").delete().in("order_id", allOrderUuids);
        }
        if (allOrderRefs.length > 0) {
          await supabaseAdmin.from("admin_notifications").delete().in("order_reference", allOrderRefs);
        }

        // 3. Delete associated order items
        if (allOrderUuids.length > 0) {
          await supabaseAdmin.from("order_items").delete().in("order_id", allOrderUuids);
        }

        // 4. Delete the orders
        let deleteQuery = supabaseAdmin.from("orders").delete();
        if (allOrderUuids.length > 0) {
          deleteQuery = deleteQuery.in("id", allOrderUuids);
        } else if (allOrderRefs.length > 0) {
          deleteQuery = deleteQuery.in("order_reference", allOrderRefs);
        }
        const { error: deleteErr } = await deleteQuery;
        if (deleteErr) throw deleteErr;

        return res.status(200).json({
          success: true,
          deletedCount: targetIds.length,
          restoredCount
        });
      }

      // --- ACTION: UPDATE STATUS ---
      if (action === "update_status") {
        const targetId = (id || orderReference || "").trim();
        if (!targetId) {
          return res.status(400).json({ success: false, error: "Order ID or reference is required" });
        }

        const canonicalStatus = toCanonicalStatus(status);
        const payload = {
          status: canonicalStatus,
          ...(updates || {})
        };

        // Ensure update overrides any status field in updates with canonical
        payload.status = canonicalStatus;

        let updateQuery = supabaseAdmin.from("orders").update(payload);
        if (isUuid(targetId)) {
          updateQuery = updateQuery.eq("id", targetId);
        } else {
          updateQuery = updateQuery.eq("order_reference", targetId);
        }

        const { error: updateErr } = await updateQuery;
        if (updateErr) throw updateErr;

        return res.status(200).json({
          success: true,
          status: canonicalStatus
        });
      }

      // --- ACTION: UPDATE NOTES ---
      if (action === "update_notes") {
        const targetId = (id || orderReference || "").trim();
        if (!targetId) {
          return res.status(400).json({ success: false, error: "Order ID or reference is required" });
        }

        let updateQuery = supabaseAdmin.from("orders").update({ internal_notes: notes || "" });
        if (isUuid(targetId)) {
          updateQuery = updateQuery.eq("id", targetId);
        } else {
          updateQuery = updateQuery.eq("order_reference", targetId);
        }

        const { error: updateErr } = await updateQuery;
        if (updateErr) throw updateErr;

        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ success: false, error: `Unsupported action: ${action}` });
    } catch (err) {
      console.error("Supabase admin order action error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to execute order operation in database"
      });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
