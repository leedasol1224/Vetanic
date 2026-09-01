import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, MessageSquare, AlertCircle, ArrowRight, Home } from 'lucide-react';
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-200 shadow-soft-lg text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal tracking-tight">
            Thank you! 🐾
          </h1>
          <p className="text-base text-brand-800 font-semibold mt-1">
            We've received your VETANIC order request.
          </p>
        </div>

        {/* Order Reference Badge */}
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-brand-100 max-w-sm mx-auto">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
            Order Request Reference
          </span>
          <span className="font-mono text-xl font-bold text-brand-900 tracking-wider">
            {order.orderReference}
          </span>
        </div>

        {/* Important notice reminder */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-left space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Next Step: Order Confirmation</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            Our team will check product availability and contact you via{' '}
            <strong className="font-bold underline">{order.customer.preferredContact}</strong> ({order.customer.contactNumber}) to confirm your order, final amount, and delivery arrangements.
          </p>
          <div className="pt-2 border-t border-amber-200/60 flex items-center gap-2 text-xs font-bold text-amber-900">
            <Clock className="w-3.5 h-3.5" />
            <span>Please do not make payment until you receive our confirmation.</span>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="text-left border border-gray-100 rounded-2xl p-5 bg-gray-50/60 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
            Order Request Summary
          </h3>

          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="font-medium text-charcoal">
                  {item.productName} ({item.packageSize})
                </span>
                <span className="font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                  Qty: {item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs text-charcoal-muted">
            <div>
              <span className="font-semibold block text-charcoal">Customer:</span>
              <span>{order.customer.fullName}</span>
            </div>
            <div>
              <span className="font-semibold block text-charcoal">Preferred Channel:</span>
              <span>{order.customer.preferredContact}</span>
            </div>
            <div className="col-span-2 pt-1">
              <span className="font-semibold block text-charcoal">Delivery Method:</span>
              <span>{getDeliveryLabel(order.delivery.deliveryMethod)}</span>
              {order.delivery.deliveryAddress && (
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {order.delivery.deliveryAddress} (Postal: {order.delivery.postalCode})
                </div>
              )}
            </div>
            <div className="col-span-2 pt-1">
              <span className="font-semibold block text-charcoal">Payment Preference:</span>
              <span>{getPaymentLabel(order.paymentPreference)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/products"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            <span>Continue Exploring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/contact"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-charcoal text-xs font-semibold px-6 py-3 rounded-xl border border-gray-200 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-700" />
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
