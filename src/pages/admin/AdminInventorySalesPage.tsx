import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  FileSpreadsheet, 
  ArrowLeft
} from 'lucide-react';
import { getOrders } from '../../lib/storage';
import { getProductSalesSummary, exportToExcel } from '../../lib/inventory';
import { OrderRecord } from '../../types/order';

export const AdminInventorySalesPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [datePreset, setDatePreset] = useState<'all' | 'today' | '7days' | 'month' | 'custom'>('all');
  const [customFromDate, setCustomFromDate] = useState<string>('');
  const [customToDate, setCustomToDate] = useState<string>('');

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  // Compute date range based on preset
  const activeDateRange = useMemo(() => {
    const now = new Date();
    if (datePreset === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      return { fromDate: start, toDate: undefined, label: 'Today' };
    }
    if (datePreset === '7days') {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      return { fromDate: start, toDate: undefined, label: 'Last 7 Days' };
    }
    if (datePreset === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      return { fromDate: start, toDate: undefined, label: 'This Month' };
    }
    if (datePreset === 'custom' && (customFromDate || customToDate)) {
      return {
        fromDate: customFromDate ? new Date(customFromDate).toISOString() : undefined,
        toDate: customToDate ? new Date(customToDate + 'T23:59:59').toISOString() : undefined,
        label: 'Custom Range'
      };
    }
    return { fromDate: undefined, toDate: undefined, label: 'All Time' };
  }, [datePreset, customFromDate, customToDate]);

  // Product sales summary
  const salesSummary = useMemo(() => {
    return getProductSalesSummary(orders, {
      fromDate: activeDateRange.fromDate,
      toDate: activeDateRange.toDate
    });
  }, [orders, activeDateRange]);

  // Totals
  const totalUnitsSold = useMemo(() => {
    return salesSummary.reduce((sum, item) => sum + item.unitsSold, 0);
  }, [salesSummary]);

  const totalGrossSales = useMemo(() => {
    return salesSummary.reduce((sum, item) => sum + item.grossSales, 0);
  }, [salesSummary]);

  // Ranked Products
  const sortedBySales = useMemo(() => {
    return [...salesSummary].sort((a, b) => b.unitsSold - a.unitsSold);
  }, [salesSummary]);

  const bestSellers = useMemo(() => sortedBySales.slice(0, 3), [sortedBySales]);
  const slowMovers = useMemo(() => {
    return [...salesSummary].sort((a, b) => a.unitsSold - b.unitsSold).slice(0, 3);
  }, [salesSummary]);

  const handleExport = () => {
    exportToExcel('sales', {
      orders,
      dateRangeName: activeDateRange.label.replace(/\s+/g, '_'),
      fromDate: activeDateRange.fromDate,
      toDate: activeDateRange.toDate
    });
  };

  return (
    <div className="space-y-8 animate-soft-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/inventory"
              className="p-1.5 rounded-lg bg-white border border-[#DED7CE] text-charcoal hover:bg-[#FAF7F2]"
              title="Back to Inventory Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-tight">
              Sales by Product
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Aggregated units sold and gross product revenue from paid customer orders.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all active:scale-[0.98]"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Sales to Excel</span>
        </button>
      </div>

      {/* Date Range Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider flex items-center gap-1 mr-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              Period:
            </span>
            {(['all', 'today', '7days', 'month', 'custom'] as const).map((preset) => {
              const labelMap: Record<string, string> = {
                all: 'All Time',
                today: 'Today',
                '7days': 'Last 7 Days',
                month: 'This Month',
                custom: 'Custom Range'
              };
              const isSelected = datePreset === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDatePreset(preset)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-charcoal hover:bg-[#E9E0D4] border border-[#DED7CE]'
                  }`}
                >
                  {labelMap[preset]}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-charcoal font-semibold">
            Filtered Period: <span className="text-brand-600 font-bold">{activeDateRange.label}</span>
          </div>
        </div>

        {/* Custom Range Inputs */}
        {datePreset === 'custom' && (
          <div className="flex items-center gap-3 pt-2 border-t border-[#DED7CE]/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-charcoal-muted font-medium">From:</span>
              <input
                type="date"
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                className="py-1 px-2.5 rounded-lg border border-[#DED7CE] bg-[#FAF7F2] text-xs font-semibold"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-charcoal-muted font-medium">To:</span>
              <input
                type="date"
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                className="py-1 px-2.5 rounded-lg border border-[#DED7CE] bg-[#FAF7F2] text-xs font-semibold"
              />
            </div>
          </div>
        )}
      </div>

      {/* Analytical Highlight Cards: Best Sellers & Slow Movers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white rounded-3xl p-6 border border-[#DED7CE] shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-[#DED7CE] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold text-charcoal">Best Selling Products</h3>
                <span className="text-[10px] text-charcoal-muted">Highest units sold in period</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Top Demand
            </span>
          </div>

          <div className="space-y-2.5">
            {bestSellers.map((item, idx) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE]/70 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 font-bold text-[10px] flex items-center justify-center border border-brand-200 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-charcoal block truncate">{item.productName}</span>
                    <span className="text-[10px] text-charcoal-muted font-mono">{item.sku}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-brand-600">{item.unitsSold} sold</div>
                  <span className="text-[10px] text-charcoal-muted font-serif">
                    SGD {item.grossSales.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Moving Products */}
        <div className="bg-white rounded-3xl p-6 border border-[#DED7CE] shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-[#DED7CE] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold text-charcoal">Slow Moving Products</h3>
                <span className="text-[10px] text-charcoal-muted">Lowest units sold in period</span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Low Movement
            </span>
          </div>

          <div className="space-y-2.5">
            {slowMovers.map((item, idx) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE]/70 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-charcoal/10 text-charcoal font-bold text-[10px] flex items-center justify-center border border-charcoal/20 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-charcoal block truncate">{item.productName}</span>
                    <span className="text-[10px] text-charcoal-muted font-mono">{item.sku}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-charcoal">{item.unitsSold} sold</div>
                  <span className="text-[10px] text-charcoal-muted">
                    Stock: {item.currentStock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Sales Table */}
      <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft overflow-hidden">
        <div className="p-5 border-b border-[#DED7CE] bg-[#FAF7F2]/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-charcoal">
              Product Sales Breakdown
            </h2>
            <p className="text-xs text-charcoal-muted">
              Total Units Sold: <strong>{totalUnitsSold}</strong> • Total Revenue: <strong>SGD {totalGrossSales.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DED7CE] text-charcoal-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center font-bold text-charcoal">Units Sold</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4 text-right">Gross Sales</th>
                <th className="py-3.5 px-4 text-right">Avg Selling Price</th>
                <th className="py-3.5 px-4 text-center">Current Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DED7CE]/70 text-charcoal">
              {salesSummary.map((item) => (
                <tr key={item.productId} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-charcoal">
                    <Link
                      to={`/admin/inventory/${item.productId}`}
                      className="hover:text-brand-600 hover:underline"
                    >
                      {item.productName}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted whitespace-nowrap">
                    {item.sku}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-charcoal whitespace-nowrap">
                    {item.categoryName}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-brand-700 text-sm">
                    {item.unitsSold}
                  </td>
                  <td className="py-3.5 px-4 text-center text-charcoal-muted font-semibold">
                    {item.orderCount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-serif font-bold text-charcoal">
                    SGD {item.grossSales.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-charcoal-muted font-serif">
                    SGD {item.avgSellingPrice.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold">
                    {item.currentStock}
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
