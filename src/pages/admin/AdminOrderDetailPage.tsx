import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Mail, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  FileText, 
  Save, 
  User
} from 'lucide-react';
import { getOrderById, updateOrderStatus, updateOrderInternalNotes } from '../../lib/storage';
import { OrderRecord, OrderStatus } from '../../types/order';
import { PRODUCTS } from '../../data/products';
import { InstagramIcon } from '../../components/common/Icons';

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

  useEffect(() => {
    if (id) {
      const found = getOrderById(id);
      if (found) {
        setOrder(found);
        setCurrentStatus(found.status);
        setNotes(found.internalNotes || '');
      }
    }
  }, [id]);

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-[#DED7CE] shadow-soft text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal">Order Request Not Found</h2>
        <p className="text-xs text-charcoal-muted">The specified order reference does not exist.</p>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
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

  // Clean phone number for WhatsApp link (e.g. "+65 9123 4567" -> "6591234567")
  const cleanedPhone = order.customer.contactNumber.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
    `Hello ${order.customer.fullName}! Thank you for your VETANIC Singapore order request (${order.orderReference}). We are reaching out to confirm your items and delivery arrangements.`
  )}`;

  const telegramUrl = order.customer.telegramHandle
    ? `https://t.me/${order.customer.telegramHandle.replace('@', '')}`
    : null;

  const igUrl = order.customer.instagramAccount
    ? `https://instagram.com/${order.customer.instagramAccount.replace('@', '')}`
    : null;

  const mailtoUrl = `mailto:${order.customer.email}?subject=${encodeURIComponent(
    `VETANIC Singapore Order Request Confirmation (${order.orderReference})`
  )}&body=${encodeURIComponent(
    `Dear ${order.customer.fullName},\n\nThank you for choosing VETANIC. We have received your order request (${order.orderReference}).`
  )}`;

  return (
    <div className="space-y-8 animate-soft-in">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 rounded-xl bg-white border border-[#DED7CE] text-charcoal hover:bg-[#FAF7F2] transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-charcoal tracking-tight">
                Order {order.orderReference}
              </h1>
              <span className="text-xs font-mono bg-[#FAF7F2] text-charcoal-muted px-2 py-0.5 rounded-md border border-[#DED7CE]">
                {order.customer.customerType === 'new' ? 'New Customer' : 'Existing Customer'}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
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
          <span className="text-xs font-bold text-charcoal-muted px-2 uppercase">Status:</span>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DED7CE] text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600 cursor-pointer"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Products, Pricing, Customer Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: Products Ordered */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 sm:p-7">
            <h2 className="text-base font-serif font-bold text-charcoal mb-4 flex items-center justify-between">
              <span>Ordered Products ({order.totalItemCount} units)</span>
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
                      <h4 className="text-xs sm:text-sm font-bold text-charcoal truncate">
                        {item.productName}
                      </h4>
                      <div className="text-[11px] text-charcoal-muted">
                        {item.packageSize} • Unit Price: SGD {item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-charcoal-muted font-medium">
                      Qty: <strong className="text-charcoal font-bold">{item.quantity}</strong>
                    </div>
                    <div className="text-sm font-serif font-bold text-charcoal mt-0.5">
                      SGD {(item.unitPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Financial Summary */}
            {order.pricing && (
              <div className="mt-6 pt-5 border-t border-[#DED7CE] space-y-2 text-xs text-charcoal">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal (before discounts):</span>
                  <span>SGD {order.pricing.subtotal.toFixed(2)}</span>
                </div>

                {order.pricing.bundleDiscount > 0 && (
                  <div className="flex justify-between text-brand-600 font-semibold">
                    <span>Mix & Match Bundle Savings:</span>
                    <span>- SGD {order.pricing.bundleDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Product Total (after bundle):</span>
                  <span className="font-semibold">SGD {order.pricing.productTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-charcoal-muted">
                    Delivery ({order.delivery.deliveryMethod === 'self_collection' ? 'Self-collection' : 'Standard Delivery'}):
                  </span>
                  <span>
                    {order.pricing.deliveryFee === 0 ? 'FREE' : `SGD ${order.pricing.deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between font-serif font-bold text-base pt-3 border-t border-[#DED7CE] text-charcoal">
                  <span>Final Estimated Total:</span>
                  <span>SGD {order.pricing.estimatedTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section: Delivery & Fulfillment Arrangements */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 sm:p-7 space-y-4">
            <h2 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Delivery & Fulfillment</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block mb-1">
                  Delivery Method
                </span>
                <span className="font-bold text-charcoal text-sm">
                  {order.delivery.deliveryMethod === 'self_collection'
                    ? 'Self-collection @ Novena MRT'
                    : order.delivery.deliveryMethod === 'same_day'
                    ? 'Same-day Express Delivery'
                    : 'Standard Local Delivery'}
                </span>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block mb-1">
                  Payment Preference
                </span>
                <span className="font-bold text-charcoal text-sm uppercase">
                  {order.paymentPreference === 'paynow' ? 'PayNow (UEN / QR)' : 'Bank Transfer'}
                </span>
              </div>

              {order.delivery.deliveryAddress && (
                <div className="sm:col-span-2 p-4 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE]">
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block mb-1">
                    Shipping Address
                  </span>
                  <p className="font-medium text-charcoal text-xs sm:text-sm">
                    {order.delivery.deliveryAddress}
                  </p>
                  <span className="text-xs text-charcoal-muted mt-1 block">
                    Singapore Postal Code: <strong>{order.delivery.postalCode}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Customer Acknowledgements & Marketing Source */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 sm:p-7 space-y-4">
            <h2 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sage-600" />
              <span>Acknowledgements & Discovery Source</span>
            </h2>

            <div className="space-y-2.5 text-xs text-charcoal">
              <div className="flex items-center gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Stock availability confirmation acknowledged</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pet allergy responsibility acknowledged</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#DED7CE]/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Dietary wellness supplement scope acknowledged</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DED7CE]/70 text-xs">
              <span className="text-charcoal-muted">How did you hear about us:</span>{' '}
              <strong className="text-charcoal">{order.referralSource}</strong>
              {order.otherReferralSource && (
                <span className="text-charcoal-muted ml-1">({order.otherReferralSource})</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Customer Contact & Internal Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Details & 1-Click Contact Actions */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 space-y-5">
            <h2 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <span>Customer Details</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Name</span>
                <span className="font-bold text-charcoal text-sm">{order.customer.fullName}</span>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Email</span>
                <a href={`mailto:${order.customer.email}`} className="font-medium text-brand-600 hover:underline">
                  {order.customer.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Phone / Mobile</span>
                <span className="font-medium text-charcoal">{order.customer.contactNumber}</span>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Preferred Contact Channel</span>
                <span className="inline-flex items-center gap-1 font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200 mt-0.5">
                  {order.customer.preferredContact}
                </span>
              </div>

              {order.customer.telegramHandle && (
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Telegram</span>
                  <span className="font-medium text-charcoal">{order.customer.telegramHandle}</span>
                </div>
              )}

              {order.customer.instagramAccount && (
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Instagram</span>
                  <span className="font-medium text-charcoal">{order.customer.instagramAccount}</span>
                </div>
              )}
            </div>

            {/* Direct Contact Action Triggers */}
            <div className="pt-4 border-t border-[#DED7CE] space-y-2">
              <span className="text-[10px] text-charcoal-muted uppercase font-bold block mb-1">
                Quick Contact Actions
              </span>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact via WhatsApp</span>
              </a>

              {telegramUrl && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Open Telegram Chat</span>
                </a>
              )}

              {igUrl && (
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#E1306C] hover:bg-[#C1275B] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>View Instagram Profile</span>
                </a>
              )}

              <a
                href={mailtoUrl}
                className="w-full flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#F4EFE7] text-charcoal font-semibold text-xs py-2.5 px-4 rounded-xl border border-[#DED7CE] transition-colors"
              >
                <Mail className="w-4 h-4 text-charcoal-muted" />
                <span>Send Email</span>
              </a>
            </div>
          </div>

          {/* Internal Business Notes Editor (Confidential) */}
          <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Internal Business Notes</span>
              </h2>
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase">
                Confidential
              </span>
            </div>

            <p className="text-[11px] text-charcoal-muted">
              Private notes for the VETANIC Singapore fulfillment team. Never visible to the customer.
            </p>

            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Stock confirmed with warehouse. Customer requested evening delivery slot. PayNow received."
              className="w-full text-xs p-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 resize-none"
            />

            <button
              type="button"
              onClick={handleSaveNotes}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
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
