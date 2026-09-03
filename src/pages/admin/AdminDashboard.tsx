import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  CreditCard, 
  Package, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowRight,
  Eye,
  AlertCircle,
  Boxes,
  AlertTriangle
} from 'lucide-react';
import { getOrders } from '../../lib/storage';
import { getProductInventoryList } from '../../lib/inventory';
import { OrderRecord, OrderStatus } from '../../types/order';
import { ProductInventory } from '../../types/inventory';

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inventory, setInventory] = useState<ProductInventory[]>([]);

  useEffect(() => {
    setOrders(getOrders());
    setInventory(getProductInventoryList());
  }, []);

  // Compute metrics
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const todayOrders = orders.filter((o) => new Date(o.createdAt).getTime() >= startOfToday);
  const pendingConfirmation = orders.filter((o) => o.status === 'Pending Confirmation');
  const awaitingPayment = orders.filter((o) => o.status === 'Awaiting Payment');
  const paidOrders = orders.filter((o) => o.status === 'Paid');
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');
  const completedOrders = orders.filter((o) => o.status === 'Completed');

  const totalOrdersCount = orders.length;
  const estimatedTotalSales = orders.reduce((sum, o) => sum + (o.pricing?.estimatedTotal || 0), 0);
  const averageOrderValue = totalOrdersCount > 0 ? estimatedTotalSales / totalOrdersCount : 0;

  // Inventory Low Stock alerts
  const lowStockItems = useMemo(() => {
    return inventory.filter((item) => item.stockStatus === 'Low Stock');
  }, [inventory]);

  const outOfStockItems = useMemo(() => {
    return inventory.filter((item) => item.stockStatus === 'Out of Stock');
  }, [inventory]);

  const totalStockUnits = useMemo(() => {
    return inventory.reduce((sum, i) => sum + i.currentStock, 0);
  }, [inventory]);

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

  return (
    <div className="space-y-8 animate-soft-in">
      {/* Top Welcome & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-tight">
            Business Overview
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Real-time summary of Singapore order requests, fulfillment operations and inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/business/inventory"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-charcoal font-bold text-xs px-4 py-2.5 rounded-xl border border-[#DED7CE] shadow-xs transition-all"
          >
            <Boxes className="w-4 h-4 text-brand-600" />
            <span>Inventory ({totalStockUnits} in stock)</span>
          </Link>

          <Link
            to="/business/orders"
            className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Orders ({totalOrdersCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Low Stock Prominent Alerts (if any) */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="p-4 sm:p-5 bg-amber-50/80 rounded-3xl border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Stock Attention Needed
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                {lowStockItems.length > 0 && (
                  <span>
                    Low Stock: {lowStockItems.map((i) => `${i.productName} (${i.currentStock} left)`).join(', ')}
                  </span>
                )}
                {lowStockItems.length > 0 && outOfStockItems.length > 0 && ' • '}
                {outOfStockItems.length > 0 && (
                  <span>
                    Out of Stock: {outOfStockItems.map((i) => i.productName).join(', ')}
                  </span>
                )}
              </p>
            </div>
          </div>

          <Link
            to="/business/inventory"
            className="inline-flex items-center gap-1.5 bg-amber-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-950 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>View Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Highlights: 3 Major Business Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-[#DED7CE] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
              Estimated Total Sales
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
              SGD {estimatedTotalSales.toFixed(2)}
            </div>
            <span className="text-[11px] text-brand-600 font-semibold mt-1 block">
              Across all {totalOrdersCount} submissions
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#DED7CE] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
              Average Order Value (AOV)
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
              SGD {averageOrderValue.toFixed(2)}
            </div>
            <span className="text-[11px] text-sage-700 font-semibold mt-1 block">
              Per customer request
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sage-50 border border-sage-200 flex items-center justify-center text-sage-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#DED7CE] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
              Total Order Requests
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
              {totalOrdersCount}
            </div>
            <span className="text-[11px] text-charcoal-muted font-medium mt-1 block">
              {todayOrders.length} received today
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] flex items-center justify-center text-charcoal">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Operational Pipeline Metrics (6 Workflow States) */}
      <div>
        <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
          Fulfillment Pipeline
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Today's Orders */}
          <Link
            to="/business/orders"
            className="bg-white p-4 rounded-2xl border border-[#DED7CE] hover:border-brand-300 shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-charcoal-muted mb-2">
              <span className="text-[11px] font-bold uppercase">Today's</span>
              <Clock className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <div className="text-xl font-bold text-charcoal">{todayOrders.length}</div>
            <span className="text-[10px] text-charcoal-muted">New requests</span>
          </Link>

          {/* Pending Confirmation */}
          <Link
            to="/business/orders?status=Pending%20Confirmation"
            className="bg-white p-4 rounded-2xl border border-[#DED7CE] hover:border-amber-300 shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-amber-800 mb-2">
              <span className="text-[11px] font-bold uppercase">Pending</span>
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-bold text-amber-900">{pendingConfirmation.length}</div>
            <span className="text-[10px] text-amber-700 font-medium">Verify stock</span>
          </Link>

          {/* Awaiting Payment */}
          <Link
            to="/business/orders?status=Awaiting%20Payment"
            className="bg-white p-4 rounded-2xl border border-[#DED7CE] hover:border-purple-300 shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-purple-800 mb-2">
              <span className="text-[11px] font-bold uppercase">Awaiting Pay</span>
              <CreditCard className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-purple-900">{awaitingPayment.length}</div>
            <span className="text-[10px] text-purple-700 font-medium">PayNow sent</span>
          </Link>

          {/* Paid Orders */}
          <Link
            to="/business/orders?status=Paid"
            className="bg-white p-4 rounded-2xl border border-[#DED7CE] hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-[11px] font-bold uppercase">Paid</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-900">{paidOrders.length}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Ready to pack</span>
          </Link>

          {/* Orders to Prepare */}
          <Link
            to="/business/orders?status=Preparing"
            className="bg-white p-4 rounded-2xl border border-[#DED7CE] hover:border-orange-300 shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-orange-800 mb-2">
              <span className="text-[11px] font-bold uppercase">Preparing</span>
              <Package className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <div className="text-xl font-bold text-orange-900">{preparingOrders.length}</div>
            <span className="text-[10px] text-orange-700 font-medium">Packing items</span>
          </Link>

          {/* Completed Orders */}
          <Link
            to="/business/orders?status=Completed"
            className="bg-white p-4 rounded-2xl border border-[#DED7CE] hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-charcoal-muted mb-2">
              <span className="text-[11px] font-bold uppercase">Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-charcoal">{completedOrders.length}</div>
            <span className="text-[10px] text-charcoal-muted">Delivered</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders Overview Table */}
      <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft overflow-hidden">
        <div className="p-6 border-b border-[#DED7CE] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-charcoal">
              Recent Order Requests
            </h2>
            <p className="text-xs text-charcoal-muted">Latest customer submissions received</p>
          </div>

          <Link
            to="/business/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DED7CE] text-charcoal-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Order Ref</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Items</th>
                <th className="py-3.5 px-6">Total Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DED7CE]/70 text-charcoal">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-brand-600">
                    <Link to={`/business/orders/${order.id}`} className="hover:underline">
                      {order.orderReference}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-charcoal-muted whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-SG', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-charcoal">{order.customer.fullName}</div>
                    <div className="text-[11px] text-charcoal-muted">
                      {order.customer.preferredContact}: {order.customer.contactNumber}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-charcoal">{order.totalItemCount} units</span>
                    <div className="text-[11px] text-charcoal-muted truncate max-w-[12rem]">
                      {order.items.map((i) => `${i.productName} (×${i.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-serif font-bold text-charcoal">
                    SGD {order.pricing?.estimatedTotal ? order.pricing.estimatedTotal.toFixed(2) : '—'}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/business/orders/${order.id}`}
                      className="inline-flex items-center gap-1 bg-[#FAF7F2] hover:bg-[#F4EFE7] text-charcoal font-semibold text-xs px-3 py-1.5 rounded-lg border border-[#DED7CE] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-charcoal-muted" />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
