import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  Check, 
  X, 
  History, 
  ShoppingBag
} from 'lucide-react';
import { 
  getProductInventory, 
  getInventoryMovements, 
  addStockMovement, 
  updateProductThreshold 
} from '../../lib/inventory';
import { getOrders } from '../../lib/storage';
import { ProductInventory, InventoryMovement, InventoryMovementType } from '../../types/inventory';
import { OrderRecord } from '../../types/order';

export const AdminInventoryProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  const [productInv, setProductInv] = useState<ProductInventory | undefined>(undefined);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Adjust Modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustType, setAdjustType] = useState<InventoryMovementType>('Stock Received');
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Stock Received');
  const [adjustNote, setAdjustNote] = useState<string>('');

  // Threshold Edit
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdVal, setThresholdVal] = useState<number>(5);

  const loadData = () => {
    if (!productId) return;
    const inv = getProductInventory(productId);
    setProductInv(inv);
    if (inv) {
      setThresholdVal(inv.lowStockThreshold);
    }

    const allMovements = getInventoryMovements();
    setMovements(allMovements.filter((m) => m.productId === productId));

    const allOrders = getOrders();
    setOrders(allOrders.filter((o) => o.items.some((i) => i.productId === productId)));
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  if (!productInv) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-[#DED7CE] shadow-soft text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal">Product Not Found</h2>
        <p className="text-xs text-charcoal-muted">The specified product inventory profile does not exist.</p>
        <Link
          to="/admin/inventory"
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory</span>
        </Link>
      </div>
    );
  }

  const handleSaveThreshold = () => {
    updateProductThreshold(productInv.productId, thresholdVal);
    setIsEditingThreshold(false);
    loadData();
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    let change = adjustQty;
    if (adjustType === 'Manual Reduction') {
      change = -adjustQty;
    }

    addStockMovement({
      productId: productInv.productId,
      movementType: adjustType,
      quantityChange: change,
      reason: adjustReason,
      internalNote: adjustNote.trim() || undefined
    });

    setShowAdjustModal(false);
    loadData();
  };

  return (
    <div className="space-y-8 animate-soft-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/inventory"
            className="p-2 rounded-xl bg-white border border-[#DED7CE] text-charcoal hover:bg-[#FAF7F2]"
            title="Back to Inventory Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-charcoal tracking-tight">
                {productInv.productName}
              </h1>
              <span className="font-mono text-xs bg-[#FAF7F2] text-charcoal px-2.5 py-0.5 rounded-md border border-[#DED7CE] font-bold">
                {productInv.sku}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Category: {productInv.categoryName} • Regular Price: SGD {productInv.regularPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setAdjustType('Stock Received');
            setAdjustQty(10);
            setAdjustReason('Stock Received');
            setAdjustNote('');
            setShowAdjustModal(true);
          }}
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Adjust Stock</span>
        </button>
      </div>

      {/* Snapshot KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft">
          <span className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">Current Stock</span>
          <div className="text-3xl font-serif font-bold text-charcoal">{productInv.currentStock}</div>
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-1 ${
              productInv.stockStatus === 'Out of Stock'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : productInv.stockStatus === 'Low Stock'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {productInv.stockStatus}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft">
          <span className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">Units Sold</span>
          <div className="text-3xl font-serif font-bold text-brand-700">{productInv.unitsSold}</div>
          <span className="text-[10px] text-charcoal-muted mt-1 block">From paid orders</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft">
          <span className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">Low Stock Threshold</span>
          {isEditingThreshold ? (
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                min="0"
                value={thresholdVal}
                onChange={(e) => setThresholdVal(Number(e.target.value))}
                className="w-16 py-1 px-1.5 rounded-lg border border-brand-600 text-xs font-bold"
              />
              <button
                type="button"
                onClick={handleSaveThreshold}
                className="p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-baseline justify-between mt-1">
              <div className="text-3xl font-serif font-bold text-charcoal">{productInv.lowStockThreshold}</div>
              <button
                type="button"
                onClick={() => setIsEditingThreshold(true)}
                className="text-[10px] font-bold text-brand-600 hover:underline"
              >
                Edit
              </button>
            </div>
          )}
          <span className="text-[10px] text-charcoal-muted mt-1 block">Triggers low stock alert</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft">
          <span className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">Est. Inventory Value</span>
          <div className="text-2xl font-serif font-bold text-charcoal truncate">
            SGD {productInv.estimatedRetailValue.toFixed(2)}
          </div>
          <span className="text-[10px] text-charcoal-muted mt-1 block">At regular retail price</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Movement History for this product */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#DED7CE] shadow-soft space-y-4">
          <h2 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
            <History className="w-4 h-4 text-brand-600" />
            <span>Stock Movements Ledger ({movements.length})</span>
          </h2>

          {movements.length === 0 ? (
            <p className="text-xs text-charcoal-muted">No movement records found for this product.</p>
          ) : (
            <div className="space-y-2.5">
              {movements.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE]/70 text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal">{m.movementType}</span>
                      <span className="text-[10px] text-charcoal-muted">
                        {new Date(m.createdAt).toLocaleDateString('en-SG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="text-[11px] text-charcoal-muted mt-0.5">{m.reason}</div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono font-bold text-sm ${
                        m.quantityChange > 0 ? 'text-emerald-700' : 'text-brand-700'
                      }`}
                    >
                      {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                    </div>
                    <span className="text-[10px] text-charcoal-muted font-mono">
                      {m.stockBefore} → {m.stockAfter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Orders containing this product */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#DED7CE] shadow-soft space-y-4">
          <h2 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-brand-600" />
            <span>Recent Orders ({orders.length})</span>
          </h2>

          {orders.length === 0 ? (
            <p className="text-xs text-charcoal-muted">No customer orders recorded for this product yet.</p>
          ) : (
            <div className="space-y-2.5">
              {orders.slice(0, 5).map((ord) => {
                const line = ord.items.find((i) => i.productId === productId);
                return (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE]/70 text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="font-mono font-bold text-brand-600 hover:underline"
                      >
                        {ord.orderReference}
                      </Link>
                      <div className="text-[11px] text-charcoal">{ord.customer.fullName}</div>
                      <span className="text-[10px] text-charcoal-muted">{ord.status}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-charcoal block">Qty: {line?.quantity}</span>
                      <span className="text-[10px] text-charcoal-muted">
                        SGD {((line?.quantity || 0) * (line?.unitPrice || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Adjust Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-soft-in">
          <div className="fixed inset-0" onClick={() => setShowAdjustModal(false)} aria-hidden="true" />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-soft-lg border border-[#DED7CE] z-10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DED7CE] pb-3">
              <h3 className="text-sm font-bold text-charcoal">Adjust Stock for {productInv.productName}</h3>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="p-1 rounded-full text-charcoal-muted hover:bg-[#FAF7F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">
                  Adjustment Type
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => {
                    const t = e.target.value as InventoryMovementType;
                    setAdjustType(t);
                    setAdjustReason(t);
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] font-semibold"
                >
                  <option value="Stock Received">Stock Received (+)</option>
                  <option value="Manual Addition">Manual Addition (+)</option>
                  <option value="Manual Reduction">Manual Reduction (-)</option>
                  <option value="Stock Correction">Stock Correction (Audit)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">
                  Reason <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Received new shipment box"
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">
                  Internal Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-[#DED7CE] font-semibold text-charcoal hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
