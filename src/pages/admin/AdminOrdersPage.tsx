import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Eye, Filter, RefreshCw } from 'lucide-react';
import { getOrders } from '../../lib/storage';
import { OrderRecord, OrderStatus } from '../../types/order';

const ALL_STATUSES: Array<'All' | OrderStatus> = [
  'All',
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

export const AdminOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const activeStatusFilter = (searchParams.get('status') || 'All') as 'All' | OrderStatus;

  const loadOrders = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusTab = (status: 'All' | OrderStatus) => {
    if (status === 'All') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending Confirmation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Awaiting Payment':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Preparing':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Ready for Collection':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Out for Delivery':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (activeStatusFilter !== 'All' && order.status !== activeStatusFilter) {
        return false;
      }

      // 2. Search Query (order reference, customer name, phone, email)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesRef = order.orderReference.toLowerCase().includes(query);
        const matchesName = order.customer.fullName.toLowerCase().includes(query);
        const matchesPhone = order.customer.contactNumber.toLowerCase().includes(query);
        const matchesEmail = order.customer.email.toLowerCase().includes(query);

        if (!matchesRef && !matchesName && !matchesPhone && !matchesEmail) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeStatusFilter, searchQuery]);

  // Counts per status
  const statusCounts = useMemo(() => {
    const counts: { [key: string]: number } = { All: orders.length };
    ALL_STATUSES.forEach((st) => {
      if (st !== 'All') {
        counts[st] = orders.filter((o) => o.status === st).length;
      }
    });
    return counts;
  }, [orders]);

  return (
    <div className="space-y-6 animate-soft-in">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-tight">
            Order Requests Management
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Review customer submissions, verify stock, manage payments and fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F2] text-charcoal font-semibold text-xs px-3.5 py-2 rounded-xl border border-[#DED7CE] shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Search & Status Filter Tabs Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order reference, customer name, phone number, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider flex items-center gap-1 mr-1 flex-shrink-0">
            <Filter className="w-3 h-3 text-brand-600" />
            Status:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {ALL_STATUSES.map((status) => {
              const isSelected = activeStatusFilter === status;
              const count = statusCounts[status] || 0;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusTab(status)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs font-bold'
                      : 'bg-[#FAF7F2] text-charcoal hover:bg-[#E9E0D4] border border-[#DED7CE]'
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-charcoal-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft overflow-hidden">
        <div className="p-4 border-b border-[#DED7CE] bg-[#FAF7F2]/50 flex items-center justify-between text-xs text-charcoal-muted">
          <div>
            Showing <strong>{filteredOrders.length}</strong> of {orders.length} orders
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-brand-600 underline font-semibold"
            >
              Clear search
            </button>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-charcoal">No matching orders found</p>
            <p className="text-xs text-charcoal-muted">
              Try adjusting your search keywords or switching the status filter tab.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#DED7CE] text-charcoal-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Order Amount</th>
                  <th className="py-3.5 px-4">Delivery</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED7CE]/70 text-charcoal">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Order Reference */}
                    <td className="py-4 px-4 font-mono font-bold text-brand-600 whitespace-nowrap">
                      <Link to={`/business/orders/${order.id}`} className="hover:underline">
                        {order.orderReference}
                      </Link>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-charcoal-muted whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-SG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4 font-semibold text-charcoal whitespace-nowrap">
                      {order.customer.fullName}
                      <span className="block text-[10px] text-charcoal-muted font-normal">
                        {order.customer.customerType === 'new' ? 'New Customer' : 'Existing Customer'}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-charcoal font-medium">{order.customer.contactNumber}</div>
                      <div className="text-[10px] text-brand-600 font-semibold">
                        {order.customer.preferredContact}
                      </div>
                    </td>

                    {/* Products */}
                    <td className="py-4 px-4 min-w-[12rem]">
                      <div className="font-semibold text-charcoal">{order.totalItemCount} units total</div>
                      <div className="text-[11px] text-charcoal-muted line-clamp-1">
                        {order.items.map((i) => `${i.productName} (×${i.quantity})`).join(', ')}
                      </div>
                    </td>

                    {/* Order Amount */}
                    <td className="py-4 px-4 font-serif font-bold text-charcoal whitespace-nowrap">
                      SGD {order.pricing?.estimatedTotal ? order.pricing.estimatedTotal.toFixed(2) : '—'}
                    </td>

                    {/* Delivery Method */}
                    <td className="py-4 px-4 whitespace-nowrap text-[11px]">
                      {order.delivery.deliveryMethod === 'self_collection' ? (
                        <span className="text-sage-800 font-medium">Self-collection @ Novena</span>
                      ) : order.delivery.deliveryMethod === 'same_day' ? (
                        <span className="text-orange-700 font-semibold">Same-day Delivery</span>
                      ) : (
                        <span className="text-charcoal font-medium">Standard Delivery</span>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-4 whitespace-nowrap text-[11px] uppercase font-semibold text-charcoal-muted">
                      {order.paymentPreference === 'paynow' ? 'PayNow' : 'Bank Transfer'}
                    </td>

                    {/* Order Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/business/orders/${order.id}`}
                        className="inline-flex items-center gap-1 bg-[#FAF7F2] hover:bg-[#F4EFE7] text-charcoal font-semibold text-xs px-3 py-1.5 rounded-lg border border-[#DED7CE] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-charcoal-muted" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
