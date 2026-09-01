import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, MessageSquare, AlertCircle, ArrowRight, Home, Tag } from 'lucide-react';
import { OrderRecord } from '../../types/order';

interface OrderSuccessViewProps {
  order: OrderRecord;
  onReset: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order, onReset }) => {
  const getDeliveryLabel = (method: string) => {
    switch (method) {
      case 'standard':
        return 'Standard Local Delivery';
      case 'self_collection':
        return 'Self-collection @ Novena MRT';
      case 'same_day':
        return 'Same-day Delivery';
      default:
        return method;
    }
  };

  const getPaymentLabel = (method: string) => {
    return method === 'paynow' ? 'PayNow' : 'Bank Transfer';
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DED7CE] shadow-soft-lg text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal tracking-tight">
            Thank you! 🐾
          </h1>
          <p className="text-base text-charcoal font-semibold mt-1">
            Your VETANIC order request has been received.
          </p>
        </div>

        {/* Order Reference Badge & Estimated Total */}
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DED7CE] max-w-md mx-auto space-y-2">
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
              Order Request Reference
            </span>
            <span className="font-mono text-xl font-bold text-brand-600 tracking-wider">
              {order.orderReference}
            </span>
          </div>

          {order.pricing && (
            <div className="pt-2 border-t border-[#DED7CE]/70 flex items-center justify-between px-2">
              <span className="text-xs text-charcoal-muted font-medium">Estimated Total:</span>
              <span className="text-lg font-serif font-bold text-charcoal">
                SGD {order.pricing.estimatedTotal.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Important Confirmation Notice */}
        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] text-left space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>Next Step: Order Confirmation</span>
          </div>
          <p className="text-xs text-charcoal leading-relaxed">
            We will confirm product availability, your final total and delivery arrangements before payment. Please do not make payment until you receive our confirmation.
          </p>
          <div className="pt-2 border-t border-[#DED7CE]/60 flex items-center gap-2 text-xs text-charcoal-muted">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              Our team will reach out via <strong className="underline text-charcoal">{order.customer.preferredContact}</strong> ({order.customer.contactNumber}).
            </span>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="text-left border border-[#DED7CE] rounded-2xl p-5 bg-[#FAF7F2]/50 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
            Order Request Summary
          </h3>

          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="font-medium text-charcoal">
                  {item.productName} ({item.packageSize}) × {item.quantity}
                </span>
                <span className="font-bold text-charcoal">
                  SGD {(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {order.pricing && (
            <div className="pt-3 border-t border-[#DED7CE] space-y-1.5 text-xs text-charcoal">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Subtotal:</span>
                <span>SGD {order.pricing.subtotal.toFixed(2)}</span>
              </div>
              {order.pricing.bundleDiscount > 0 && (
                <div className="flex justify-between text-brand-600 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Mix & Match Discount:</span>
                  </span>
                  <span>- SGD {order.pricing.bundleDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Delivery ({getDeliveryLabel(order.delivery.deliveryMethod)}):</span>
                <span>
                  {order.pricing.deliveryFee === 0 ? 'FREE' : `SGD ${order.pricing.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-[#DED7CE] text-charcoal">
                <span>Estimated Total:</span>
                <span className="font-serif">SGD {order.pricing.estimatedTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[#DED7CE] grid grid-cols-2 gap-2 text-xs text-charcoal-muted">
            <div>
              <span className="font-semibold block text-charcoal">Customer:</span>
              <span>{order.customer.fullName}</span>
            </div>
            <div>
              <span className="font-semibold block text-charcoal">Preferred Channel:</span>
              <span>{order.customer.preferredContact}</span>
            </div>
            <div className="col-span-2 pt-1">
              <span className="font-semibold block text-charcoal">Delivery Arrangement:</span>
              <span>{getDeliveryLabel(order.delivery.deliveryMethod)}</span>
              {order.delivery.deliveryAddress && (
                <div className="text-[11px] text-charcoal-muted mt-0.5">
                  {order.delivery.deliveryAddress} (Postal: {order.delivery.postalCode})
                </div>
              )}
            </div>
            <div className="col-span-2 pt-1">
              <span className="font-semibold block text-charcoal">Payment Method:</span>
              <span>{getPaymentLabel(order.paymentPreference)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/products"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            <span>Continue Exploring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/contact"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#F4EFE7] text-charcoal text-xs font-semibold px-6 py-3 rounded-xl border border-[#DED7CE] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
            <span>Contact Us</span>
          </Link>
          <Link
            to="/"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-charcoal-muted hover:text-charcoal text-xs font-medium px-4 py-3"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
