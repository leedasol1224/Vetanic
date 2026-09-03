import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Boxes, 
  TrendingUp, 
  AlertTriangle, 
  XCircle, 
  DollarSign, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  X, 
  Check, 
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { 
  getProductInventoryList, 
  addStockMovement, 
  updateProductThreshold, 
  exportToExcel
} from '../../lib/inventory';
import { ProductInventory, InventoryMovementType, StockStatus } from '../../types/inventory';

export const AdminInventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | StockStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modal State for Manual Stock Adjustment
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState<ProductInventory | null>(null);
  const [adjustType, setAdjustType] = useState<InventoryMovementType>('Stock Received');
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Stock Received');
  const [adjustNote, setAdjustNote] = useState<string>('');
  const [adjustSuccessMessage, setAdjustSuccessMessage] = useState<string | null>(null);

  // Quick Threshold Edit State
  const [editingThresholdProductId, setEditingThresholdProductId] = useState<string | null>(null);
  const [tempThresholdValue, setTempThresholdValue] = useState<number>(5);

  const loadData = () => {
    setInventory(getProductInventoryList());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Summary Metrics
  const totalUnitsInStock = useMemo(() => {
    return inventory.reduce((sum, item) => sum + item.currentStock, 0);
  }, [inventory]);

  const totalUnitsSold = useMemo(() => {
    return inventory.reduce((sum, item) => sum + item.unitsSold, 0);
  }, [inventory]);

  const lowStockCount = useMemo(() => {
    return inventory.filter((item) => item.stockStatus === 'Low Stock').length;
  }, [inventory]);

  const outOfStockCount = useMemo(() => {
    return inventory.filter((item) => item.stockStatus === 'Out of Stock').length;
  }, [inventory]);

  const estimatedRetailValue = useMemo(() => {
    return inventory.reduce((sum, item) => sum + item.estimatedRetailValue, 0);
  }, [inventory]);

  // Categories list
  const uniqueCategories = useMemo(() => {
    const set = new Set(inventory.map((i) => i.categoryName));
    return ['All', ...Array.from(set)];
  }, [inventory]);

  // Filtered List
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== 'All' && item.stockStatus !== statusFilter) {
        return false;
      }
      // 2. Category Filter
      if (categoryFilter !== 'All' && item.categoryName !== categoryFilter) {
        return false;
      }
      // 3. Search Query (Product name, SKU, Category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.productName.toLowerCase().includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesCat = item.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCat) return false;
      }
      return true;
    });
  }, [inventory, statusFilter, categoryFilter, searchQuery]);

  const handleOpenAdjustModal = (item: ProductInventory) => {
    setSelectedProductForAdjust(item);
    setAdjustType('Stock Received');
    setAdjustQty(10);
    setAdjustReason('Stock Received');
    setAdjustNote('');
    setAdjustSuccessMessage(null);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForAdjust) return;

    if (!adjustReason.trim()) {
      alert('Please provide a reason for the stock adjustment.');
      return;
    }

    if (adjustQty <= 0) {
      alert('Adjustment quantity must be greater than 0.');
      return;
    }

    // Determine sign based on type
    let change = adjustQty;
    if (adjustType === 'Manual Reduction') {
      change = -adjustQty;
    }

    addStockMovement({
      productId: selectedProductForAdjust.productId,
      movementType: adjustType,
      quantityChange: change,
      reason: adjustReason,
      internalNote: adjustNote.trim() || undefined
    });

    setAdjustSuccessMessage(`Stock updated successfully!`);
    loadData();
    setTimeout(() => {
      setSelectedProductForAdjust(null);
      setAdjustSuccessMessage(null);
    }, 1200);
  };

  const handleSaveThreshold = (productId: string) => {
    updateProductThreshold(productId, tempThresholdValue);
    setEditingThresholdProductId(null);
    loadData();
  };

  const handleExportSummary = () => {
    exportToExcel('summary');
  };

  return (
    <div className="space-y-8 animate-soft-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-tight">
            Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Real-time stock ledger, movement tracking, and sales synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F2] text-charcoal font-semibold text-xs px-3.5 py-2 rounded-xl border border-[#DED7CE] shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* 5 Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Stock */}
        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[11px] font-bold uppercase">Total in Stock</span>
            <Boxes className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
            {totalUnitsInStock}
          </div>
          <span className="text-[10px] text-charcoal-muted mt-1">Available across 10 SKUs</span>
        </div>

        {/* Units Sold */}
        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[11px] font-bold uppercase">Units Sold</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
            {totalUnitsSold}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1">Paid / completed orders</span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-[11px] font-bold uppercase">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-900">
            {lowStockCount}
          </div>
          <span className="text-[10px] text-amber-700 font-medium mt-1">≤ threshold alert</span>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-[11px] font-bold uppercase">Out of Stock</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-900">
            {outOfStockCount}
          </div>
          <span className="text-[10px] text-rose-700 font-medium mt-1">Marked Sold Out</span>
        </div>

        {/* Estimated Retail Value */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[11px] font-bold uppercase">Est. Retail Value</span>
            <DollarSign className="w-4 h-4 text-sage-600" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-charcoal truncate">
            SGD {estimatedRetailValue.toFixed(2)}
          </div>
          <span className="text-[10px] text-charcoal-muted mt-1">Current stock × regular price</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, SKU, or category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | StockStatus)}
              className="w-full py-2 px-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <option value="All">All Stock Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft overflow-hidden">
        <div className="p-4 border-b border-[#DED7CE] bg-[#FAF7F2]/50 flex items-center justify-between text-xs text-charcoal-muted">
          <div>
            Showing <strong>{filteredInventory.length}</strong> products
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-brand-600 underline font-semibold">
              Clear search
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DED7CE] text-charcoal-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Initial</th>
                <th className="py-3.5 px-4 text-center">Added</th>
                <th className="py-3.5 px-4 text-center">Sold</th>
                <th className="py-3.5 px-4 text-center font-bold text-charcoal">Current Stock</th>
                <th className="py-3.5 px-4 text-center">Threshold</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DED7CE]/70 text-charcoal">
              {filteredInventory.map((item) => (
                <tr key={item.productId} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  {/* Product Image & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-11 h-11 object-contain rounded-xl bg-[#FAF7F2] border border-[#DED7CE] p-1 flex-shrink-0"
                      />
                      <div>
                        <Link
                          to={`/business/inventory/${item.productId}`}
                          className="font-bold text-charcoal hover:text-brand-600 hover:underline block"
                        >
                          {item.productName}
                        </Link>
                        <span className="text-[10px] text-charcoal-muted font-serif">
                          SGD {item.regularPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-charcoal-muted whitespace-nowrap">
                    {item.sku}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-[11px] font-medium text-charcoal whitespace-nowrap">
                    {item.categoryName}
                  </td>

                  {/* Initial Stock */}
                  <td className="py-3.5 px-4 text-center font-semibold text-charcoal-muted">
                    {item.initialStock}
                  </td>

                  {/* Stock Added */}
                  <td className="py-3.5 px-4 text-center font-semibold text-emerald-700">
                    +{item.stockAdded}
                  </td>

                  {/* Units Sold */}
                  <td className="py-3.5 px-4 text-center font-semibold text-brand-700">
                    {item.unitsSold > 0 ? `-${item.unitsSold}` : '0'}
                  </td>

                  {/* Current Stock (Highlighted) */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-xl font-mono font-bold text-sm ${
                        item.stockStatus === 'Out of Stock'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.stockStatus === 'Low Stock'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {item.currentStock}
                    </span>
                  </td>

                  {/* Low Stock Threshold */}
                  <td className="py-3.5 px-4 text-center">
                    {editingThresholdProductId === item.productId ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={tempThresholdValue}
                          onChange={(e) => setTempThresholdValue(Number(e.target.value))}
                          className="w-12 text-center py-1 px-1 rounded-lg border border-brand-600 text-xs font-bold"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveThreshold(item.productId)}
                          className="p-1 bg-brand-600 text-white rounded hover:bg-brand-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingThresholdProductId(item.productId);
                          setTempThresholdValue(item.lowStockThreshold);
                        }}
                        className="text-xs font-semibold text-charcoal-muted hover:text-brand-600 underline underline-offset-2"
                        title="Click to edit threshold"
                      >
                        {item.lowStockThreshold}
                      </button>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.stockStatus === 'Out of Stock'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : item.stockStatus === 'Low Stock'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {item.stockStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenAdjustModal(item)}
                        className="inline-flex items-center gap-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-brand-200 transition-colors"
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        <span>Adjust Stock</span>
                      </button>

                      <Link
                        to={`/business/inventory/${item.productId}`}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E9E0D4] text-charcoal-muted hover:text-charcoal border border-[#DED7CE] transition-colors"
                        title="View product inventory profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Interactive Modal */}
      {selectedProductForAdjust && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-soft-in">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedProductForAdjust(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-soft-lg overflow-hidden border border-[#DED7CE] z-10 p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#DED7CE] pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedProductForAdjust.imageUrl}
                  alt={selectedProductForAdjust.productName}
                  className="w-10 h-10 object-contain rounded-xl bg-[#FAF7F2] border border-[#DED7CE] p-1"
                />
                <div>
                  <h3 className="text-sm font-bold text-charcoal">
                    {selectedProductForAdjust.productName}
                  </h3>
                  <span className="text-[11px] font-mono text-charcoal-muted">
                    SKU: {selectedProductForAdjust.sku} • Current: {selectedProductForAdjust.currentStock}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProductForAdjust(null)}
                className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Adjust Form */}
            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              {/* Adjustment Type */}
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
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] font-semibold text-charcoal focus:ring-2 focus:ring-brand-600"
                >
                  <option value="Stock Received">Stock Received (+)</option>
                  <option value="Manual Addition">Manual Addition (+)</option>
                  <option value="Manual Reduction">Manual Reduction (-)</option>
                  <option value="Stock Correction">Stock Correction (Audit)</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">
                  Quantity ({adjustType === 'Manual Reduction' ? 'Units to Deduct' : 'Units to Add'})
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] font-bold text-charcoal text-sm focus:ring-2 focus:ring-brand-600"
                  required
                />
              </div>

              {/* Required Reason */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">
                  Reason <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Additional shipment from Korea warehouse / Damaged box in transit"
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] font-medium text-charcoal focus:ring-2 focus:ring-brand-600"
                  required
                />
              </div>

              {/* Optional Internal Note */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">
                  Internal Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="Additional audit notes for team records..."
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-charcoal focus:ring-2 focus:ring-brand-600 resize-none"
                />
              </div>

              {adjustSuccessMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center">
                  {adjustSuccessMessage}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductForAdjust(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-[#DED7CE] font-semibold text-charcoal hover:bg-[#FAF7F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-xs"
                >
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
