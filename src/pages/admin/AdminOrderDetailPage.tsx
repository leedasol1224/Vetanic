import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  FileText, 
  Save, 
  User, 
  CheckCircle2
} from 'lucide-react';
import { getOrderById, updateOrderStatus, updateOrderInternalNotes } from '../../lib/storage';
import { OrderRecord, OrderStatus } from '../../types/order';
import { PRODUCTS } from '../../data/products';
import { CustomerResponseSection } from '../../components/admin/CustomerResponseSection';

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'Pending Confirmation',
  'Confirmed',
  'Awaiting Payment',
  'Paid',
  'Preparing',
  'Ready for Collection',
  'Out for Delivery',
  'Completed',
  'Cancelled'
];

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<OrderRecord | undefined>(undefined);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('Pending Confirmation');
  const [notes, setNotes] = useState('');
  const [saveNotesSuccess, setSaveNotesSuccess] = useState(false);
  const [saveStatusSuccess, setSaveStatusSuccess] = useState(false);

  const loadOrder = () => {
    if (id) {
      const found = getOrderById(id);
      if (found) {
        setOrder(found);
        setCurrentStatus(found.status);
        setNotes(found.internalNotes || '');
      }
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-[#DED7CE] shadow-soft text-center space-y-4">
        <h2 className="text-xl font-bold text-[#222222]">Order Request Not Found</h2>
        <p className="text-xs text-[#6F6A65]">The requested order reference could not be located.</p>
        <Link
          to="/business/orders"
          className="inline-flex items-center gap-2 bg-[#9E2328] text-white font-bold text-xs px-5 py-2.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    updateOrderStatus(order.id, newStatus);
    setSaveStatusSuccess(true);
    loadOrder();
    setTimeout(() => setSaveStatusSuccess(false), 2000);
  };

  const handleSaveNotes = () => {
    updateOrderInternalNotes(order.id, notes);
    setSaveNotesSuccess(true);
    setTimeout(() => setSaveNotesSuccess(false), 2000);
  };

  // Helper for product images
  const getProductImage = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    return prod ? prod.imageUrl : '/images/products/fresh-omega-3-mini.png';
  };

  return (
    <div className="space-y-8 animate-soft-in">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/business/orders"
            className="p-2 rounded-xl bg-white border border-[#DED7CE] text-[#222222] hover:bg-[#FAF7F2] transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-[#222222] tracking-tight">
                Order {order.orderReference}
              </h1>
              <span className="text-xs font-mono bg-[#FAF7F2] text-[#6F6A65] px-2 py-0.5 rounded-md border border-[#DED7CE]">
                {order.customer.customerType === 'new' ? 'New Customer' : 'Existing Customer'}
              </span>
            </div>
            <p className="text-xs text-[#6F6A65] mt-0.5">
              Submitted on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-SG', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Status Dropdown Controller */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#DED7CE] shadow-xs">
          <span className="text-xs font-bold text-[#6F6A65] px-2 uppercase">Status:</span>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DED7CE] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#9E2328] cursor-pointer"
          >
            {ORDER_STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {saveStatusSuccess && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
              Updated!
            </span>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Ordered Products, Customer Response Section, Delivery Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: Customer Response Engine */}
          <CustomerResponseSection order={order} />

          {/* Section: Ordered Products Breakdown */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 sm:p-7">
            <h2 className="text-base font-serif font-bold text-[#222222] mb-4 flex items-center justify-between">
              <span>Ordered Products ({order.totalItemCount} units)</span>
              <span className="text-xs font-normal text-[#6F6A65]">
                {order.items.length} unique {order.items.length === 1 ? 'item' : 'items'}
              </span>
            </h2>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE]/80"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={getProductImage(item.productId)}
                      alt={item.productName}
                      className="w-14 h-14 object-contain rounded-xl bg-white border border-[#DED7CE] p-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#222222] truncate">
                        {item.productName}
                      </h4>
                      <div className="text-[11px] text-[#6F6A65]">
                        {item.packageSize} • Unit Price: SGD {item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-[#6F6A65] font-medium">
                      Qty: <strong className="text-[#222222] font-bold">{item.quantity}</strong>
                    </div>
                    <div className="text-sm font-serif font-bold text-[#222222] mt-0.5">
                      SGD {(item.unitPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Financial Summary */}
            {order.pricing && (
              <div className="mt-6 pt-5 border-t border-[#DED7CE] space-y-2 text-xs text-[#222222]">
                <div className="flex justify-between">
                  <span className="text-[#6F6A65]">Subtotal (regular):</span>
                  <span>SGD {order.pricing.subtotal.toFixed(2)}</span>
                </div>

                {order.pricing.bundleDiscount > 0 && (
                  <div className="flex justify-between text-[#9E2328] font-semibold">
                    <span>Mix & Match Bundle Savings:</span>
                    <span>- SGD {order.pricing.bundleDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-[#6F6A65]">Product Total:</span>
                  <span className="font-semibold">SGD {order.pricing.productTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6F6A65]">
                    Delivery ({order.delivery.deliveryMethod === 'self_collection' ? 'Self-collection' : 'Standard Delivery'}):
                  </span>
                  <span>
                    {order.pricing.deliveryFee === 0 ? 'FREE' : `SGD ${order.pricing.deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between font-serif font-bold text-base pt-3 border-t border-[#DED7CE] text-[#222222]">
                  <span>Final Total:</span>
                  <span className="text-[#9E2328]">SGD {order.pricing.estimatedTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section: Delivery & Fulfillment Arrangements */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 sm:p-7 space-y-4">
            <h2 className="text-base font-serif font-bold text-[#222222] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9E2328]" />
              <span>Delivery & Fulfillment Arrangements</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                <span className="text-[10px] text-[#6F6A65] uppercase font-bold block mb-1">
                  Delivery Method
                </span>
                <span className="font-bold text-[#222222] text-sm">
                  {order.delivery.deliveryMethod === 'self_collection'
                    ? 'Self-collection @ Novena MRT'
                    : order.delivery.deliveryMethod === 'same_day'
                    ? 'Same-day Express Delivery'
                    : 'Standard Local Delivery'}
                </span>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                <span className="text-[10px] text-[#6F6A65] uppercase font-bold block mb-1">
                  Payment Preference
                </span>
                <span className="font-bold text-[#222222] text-sm uppercase">
                  {order.paymentPreference === 'paynow' ? 'PayNow (UEN / QR)' : 'Bank Transfer'}
                </span>
              </div>

              {order.delivery.deliveryAddress && (
                <div className="sm:col-span-2 p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                  <span className="text-[10px] text-[#6F6A65] uppercase font-bold block mb-1">
                    Shipping Address
                  </span>
                  <p className="font-medium text-[#222222] text-xs sm:text-sm">
                    {order.delivery.deliveryAddress}
                  </p>
                  <span className="text-xs text-[#6F6A65] mt-1 block">
                    Singapore Postal Code: <strong>{order.delivery.postalCode}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Customer Details & Internal Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 space-y-5">
            <h2 className="text-base font-serif font-bold text-[#222222] flex items-center gap-2">
              <User className="w-4 h-4 text-[#9E2328]" />
              <span>Customer Information</span>
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] text-[#6F6A65] uppercase font-bold block">Name</span>
                <span className="font-bold text-[#222222] text-sm">{order.customer.fullName}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#6F6A65] uppercase font-bold block">Email</span>
                <a href={`mailto:${order.customer.email}`} className="font-medium text-[#9E2328] hover:underline">
                  {order.customer.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] text-[#6F6A65] uppercase font-bold block">Phone / Mobile</span>
                <span className="font-medium text-[#222222]">{order.customer.contactNumber}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#6F6A65] uppercase font-bold block">Preferred Contact Channel</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#9E2328] bg-[#9E2328]/10 px-2.5 py-1 rounded-lg border border-[#9E2328]/20 mt-0.5">
                  {order.customer.preferredContact}
                </span>
              </div>

              {order.customer.telegramHandle && (
                <div>
                  <span className="text-[10px] text-[#6F6A65] uppercase font-bold block">Telegram</span>
                  <span className="font-medium text-[#222222]">{order.customer.telegramHandle}</span>
                </div>
              )}

              {order.customer.instagramAccount && (
                <div>
                  <span className="text-[10px] text-[#6F6A65] uppercase font-bold block">Instagram</span>
                  <span className="font-medium text-[#222222]">{order.customer.instagramAccount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Acknowledgements & Marketing Source */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 space-y-4">
            <h2 className="text-base font-serif font-bold text-[#222222] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Customer Verification</span>
            </h2>

            <div className="space-y-2 text-xs text-[#222222]">
              <div className="flex items-center gap-2 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Stock confirmation acknowledged</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Pet allergy responsibility acknowledged</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Wellness supplement scope acknowledged</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DED7CE]/70 text-xs">
              <span className="text-[#6F6A65]">Marketing source:</span>{' '}
              <strong className="text-[#222222]">{order.referralSource}</strong>
              {order.otherReferralSource && (
                <span className="text-[#6F6A65] ml-1">({order.otherReferralSource})</span>
              )}
            </div>
          </div>

          {/* Internal Business Notes Editor (Confidential) */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-[#222222] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#9E2328]" />
                <span>Internal Business Notes</span>
              </h2>
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase">
                Confidential
              </span>
            </div>

            <p className="text-[11px] text-[#6F6A65]">
              Private notes for the VETANIC team. Never visible to the customer.
            </p>

            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Stock confirmed with warehouse. Customer requested evening delivery slot. PayNow received."
              className="w-full text-xs p-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#9E2328] focus:border-[#9E2328] resize-none"
            />

            <button
              type="button"
              onClick={handleSaveNotes}
              className="w-full flex items-center justify-center gap-2 bg-[#9E2328] hover:bg-[#841C21] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saveNotesSuccess ? 'Notes Saved!' : 'Save Internal Notes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
