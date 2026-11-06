import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Boxes, 
  AlertTriangle, 
  XCircle, 
  DollarSign, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  X, 
  Check, 
  RefreshCw, 
  FileSpreadsheet, 
  Calendar, 
  Clock, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Edit2, 
  AlertCircle, 
  RotateCcw 
} from 'lucide-react';
import { 
  getProductInventoryList, 
  addStockMovement, 
  updateProductStock,
  updateProductExpiryDate,
  updateProductInventory,
  formatDateDisplay,
  formatDateInput,
  parseCustomDate,
  exportToExcel
} from '../../lib/inventory';
import { ProductInventory, InventoryMovementType, StockStatus, ExpiryStatus } from '../../types/inventory';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const AdminInventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<'All' | StockStatus>('All');
  const [expiryStatusFilter, setExpiryStatusFilter] = useState<'All' | ExpiryStatus>('All');
  const [sortField, setSortField] = useState<'default' | 'name' | 'stock' | 'expiry' | 'updated'>('default');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Inline Quick Editing States
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  const [editingExpiryId, setEditingExpiryId] = useState<string | null>(null);
  const [tempExpiryValue, setTempExpiryValue] = useState<string>('');

  // Full Edit Modal State
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<ProductInventory | null>(null);
  const [editStockQty, setEditStockQty] = useState<number>(0);
  const [editExpiryDate, setEditExpiryDate] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('Inventory audit update');
  const [editSuccessMessage, setEditSuccessMessage] = useState<string | null>(null);

  // Modal State for Manual Stock Adjustment
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState<ProductInventory | null>(null);
  const [adjustType, setAdjustType] = useState<InventoryMovementType>('Stock Received');
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Stock Received');
  const [adjustNote, setAdjustNote] = useState<string>('');
  const [adjustSuccessMessage, setAdjustSuccessMessage] = useState<string | null>(null);

  // Quick toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

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

  const inStockCount = useMemo(() => {
    return inventory.filter((item) => item.stockStatus === 'In Stock').length;
  }, [inventory]);

  const lowStockCount = useMemo(() => {
    return inventory.filter((item) => item.stockStatus === 'Low Stock').length;
  }, [inventory]);

  const outOfStockCount = useMemo(() => {
    return inventory.filter((item) => item.stockStatus === 'Out of Stock').length;
  }, [inventory]);

  const expiryAttentionItems = useMemo(() => {
    return inventory.filter(
      (item) => item.expiryStatus === 'Monitor' || item.expiryStatus === 'Short-Dated' || item.expiryStatus === 'Expired'
    );
  }, [inventory]);

  const estimatedRetailValue = useMemo(() => {
    return inventory.reduce((sum, item) => sum + item.estimatedRetailValue, 0);
  }, [inventory]);

  // Column header sort toggle
  const handleSort = (field: 'name' | 'stock' | 'expiry' | 'updated') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      if (field === 'stock' || field === 'updated') {
        setSortDirection('desc');
      } else {
        setSortDirection('asc');
      }
    }
  };

  // Filtered and Sorted Inventory List
  const filteredAndSortedInventory = useMemo(() => {
    // 1. Filter
    const filtered = inventory.filter((item) => {
      // Search by product name or SKU
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.productName.toLowerCase().includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesCat = item.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCat) return false;
      }

      // Stock status filter
      if (stockStatusFilter !== 'All' && item.stockStatus !== stockStatusFilter) {
        return false;
      }

      // Expiry status filter
      if (expiryStatusFilter !== 'All' && item.expiryStatus !== expiryStatusFilter) {
        return false;
      }

      return true;
    });

    // 2. Sort
    if (sortField === 'default') {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.productName.localeCompare(b.productName);
      } else if (sortField === 'stock') {
        comparison = a.currentStock - b.currentStock;
      } else if (sortField === 'expiry') {
        const da = parseCustomDate(a.expiryDate);
        const db = parseCustomDate(b.expiryDate);
        if (!da && !db) comparison = 0;
        else if (!da) comparison = 1;
        else if (!db) comparison = -1;
        else comparison = da.getTime() - db.getTime();
      } else if (sortField === 'updated') {
        const ta = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const tb = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        comparison = ta - tb;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [inventory, searchQuery, stockStatusFilter, expiryStatusFilter, sortField, sortDirection]);

  // Inline Edit Stock
  const handleStartEditStock = (item: ProductInventory) => {
    setEditingStockId(item.productId);
    setTempStockValue(item.currentStock);
    setEditingExpiryId(null);
  };

  const handleSaveStock = (productId: string) => {
    if (tempStockValue < 0) {
      alert('Stock quantity cannot be negative.');
      return;
    }
    updateProductStock(productId, tempStockValue, 'Admin inline stock update');
    setEditingStockId(null);
    loadData();
    showToast('Stock quantity updated successfully.');
  };

  // Inline Edit Expiry
  const handleStartEditExpiry = (item: ProductInventory) => {
    setEditingExpiryId(item.productId);
    setTempExpiryValue(item.expiryDate && item.expiryDate !== '—' ? formatDateInput(item.expiryDate) : '');
    setEditingStockId(null);
  };

  const handleSaveExpiry = (productId: string) => {
    const formatted = tempExpiryValue ? formatDateDisplay(tempExpiryValue) : '—';
    updateProductExpiryDate(productId, formatted);
    setEditingExpiryId(null);
    loadData();
    showToast('Expiry date updated successfully.');
  };

  // Open Full Edit Modal
  const handleOpenEditModal = (item: ProductInventory) => {
    setSelectedProductForEdit(item);
    setEditStockQty(item.currentStock);
    setEditExpiryDate(item.expiryDate && item.expiryDate !== '—' ? formatDateInput(item.expiryDate) : '');
    setEditReason('Inventory audit update');
    setEditSuccessMessage(null);
  };

  // Save Full Edit Modal
  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForEdit) return;

    if (editStockQty < 0) {
      alert('Stock quantity cannot be negative.');
      return;
    }

    const formattedExpiry = editExpiryDate ? formatDateDisplay(editExpiryDate) : '—';

    updateProductInventory(selectedProductForEdit.productId, {
      currentStock: editStockQty,
      expiryDate: formattedExpiry,
      reason: editReason.trim() || 'Admin manual update'
    });

    setEditSuccessMessage('Inventory details updated successfully!');
    loadData();
    showToast(`Updated ${selectedProductForEdit.productName}`);
    setTimeout(() => {
      setSelectedProductForEdit(null);
      setEditSuccessMessage(null);
    }, 1000);
  };

  // Open Stock Adjustment Modal
  const handleOpenAdjustModal = (item: ProductInventory) => {
    setSelectedProductForAdjust(item);
    setAdjustType('Stock Received');
    setAdjustQty(10);
    setAdjustReason('Stock Received');
    setAdjustNote('');
    setAdjustSuccessMessage(null);
  };

  // Save Stock Adjustment Modal
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

    setAdjustSuccessMessage(`Stock adjusted successfully!`);
    loadData();
    showToast(`Stock updated for ${selectedProductForAdjust.productName}`);
    setTimeout(() => {
      setSelectedProductForAdjust(null);
      setAdjustSuccessMessage(null);
    }, 1000);
  };

  const handleExportSummary = () => {
    exportToExcel('summary');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStockStatusFilter('All');
    setExpiryStatusFilter('All');
    setSortField('default');
    setSortDirection('asc');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || stockStatusFilter !== 'All' || expiryStatusFilter !== 'All' || sortField !== 'default';

  // Badges
  const getStockBadge = (status: StockStatus) => {
    switch (status) {
      case 'In Stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>In Stock</span>
          </span>
        );
      case 'Low Stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Low Stock</span>
          </span>
        );
      case 'Out of Stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span>Out of Stock</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getExpiryBadge = (status: ExpiryStatus | '—', daysRemaining?: number) => {
    switch (status) {
      case 'Normal':
        return (
          <span 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
            title={daysRemaining !== undefined ? `${daysRemaining} days remaining (> 6 months)` : undefined}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Normal</span>
          </span>
        );
      case 'Monitor':
        return (
          <span 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
            title={daysRemaining !== undefined ? `${daysRemaining} days remaining (3–6 months)` : undefined}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Monitor</span>
          </span>
        );
      case 'Short-Dated':
        return (
          <span 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200"
            title={daysRemaining !== undefined ? `${daysRemaining} days remaining (< 3 months)` : undefined}
          >
            <AlertCircle className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
            <span>Short-Dated</span>
          </span>
        );
      case 'Expired':
        return (
          <span 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-900 border border-rose-300"
            title="Expired batch"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" />
            <span>Expired</span>
          </span>
        );
      default:
        return <span className="text-charcoal-muted text-xs font-mono">—</span>;
    }
  };

  const formatLastUpdated = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return '—';
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      const timeStr = d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' });
      if (isToday) {
        return `Today, ${timeStr}`;
      }
      return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}, ${timeStr}`;
    } catch {
      return '—';
    }
  };

  return (
    <div className="space-y-8 animate-soft-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-soft-lg flex items-center gap-2 border border-[#444] animate-soft-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Admin-Only Internal Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-tight">
            Inventory & Expiry Management
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Track confirmed warehouse stock, monitor batch expiry dates, and manage product availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F2] text-charcoal font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-[#DED7CE] shadow-xs transition-colors"
            title="Reload live inventory data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
            title="Download full Excel inventory sheet"
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
          <span className="text-[10px] text-charcoal-muted mt-1">
            {inStockCount} SKUs in stock (&gt;10 units)
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-[11px] font-bold uppercase">Low Stock (1–10)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-900">
            {lowStockCount}
          </div>
          <span className="text-[10px] text-amber-700 font-medium mt-1">Requires reorder attention</span>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-[11px] font-bold uppercase">Out of Stock (0)</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-900">
            {outOfStockCount}
          </div>
          <span className="text-[10px] text-rose-700 font-medium mt-1">Marked Sold Out</span>
        </div>

        {/* Expiry Attention */}
        <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[11px] font-bold uppercase">Expiry Attention</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
            {expiryAttentionItems.length}
          </div>
          <span className="text-[10px] text-charcoal-muted mt-1">
            {expiryAttentionItems.length > 0
              ? `${expiryAttentionItems.length} SKU in Monitor/Short-Dated`
              : 'All batches normal (&gt;6 mos)'}
          </span>
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

      {/* Filter, Search & Sort Control Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>

          {/* Stock Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value as 'All' | StockStatus)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <option value="All">All Stock Statuses</option>
              <option value="In Stock">In Stock (&gt; 10 units)</option>
              <option value="Low Stock">Low Stock (1–10 units)</option>
              <option value="Out of Stock">Out of Stock (0 units)</option>
            </select>
          </div>

          {/* Expiry Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={expiryStatusFilter}
              onChange={(e) => setExpiryStatusFilter(e.target.value as 'All' | ExpiryStatus)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <option value="All">All Expiry Statuses</option>
              <option value="Normal">Normal (&gt; 6 months)</option>
              <option value="Monitor">Monitor (3–6 months)</option>
              <option value="Short-Dated">Short-Dated (&lt; 3 months)</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'default') {
                  setSortField('default');
                  setSortDirection('asc');
                } else {
                  const [f, d] = val.split('-');
                  setSortField(f as any);
                  setSortDirection(d as any);
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <option value="default">Default Order</option>
              <option value="stock-desc">Stock (High to Low)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="expiry-asc">Nearest Expiry Date</option>
              <option value="expiry-desc">Furthest Expiry Date</option>
              <option value="name-asc">Product Name (A–Z)</option>
              <option value="name-desc">Product Name (Z–A)</option>
              <option value="updated-desc">Recently Updated</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Quick Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#DED7CE]/60 text-xs text-charcoal-muted">
            <div className="flex items-center gap-2">
              <span>Filtering active. Showing <strong>{filteredAndSortedInventory.length}</strong> of <strong>{inventory.length}</strong> products.</span>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Admin Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft overflow-hidden">
        <div className="p-4 border-b border-[#DED7CE] bg-[#FAF7F2]/60 flex items-center justify-between text-xs text-charcoal-muted">
          <div>
            Showing <strong>{filteredAndSortedInventory.length}</strong> products
          </div>
          <div className="text-[11px] text-charcoal-muted italic">
            Tip: Click stock quantity or expiry date to edit inline, or use the Edit button.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DED7CE] text-charcoal-muted font-bold uppercase tracking-wider text-[10px]">
                {/* 1. Product Name */}
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-charcoal select-none transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Product Name</span>
                    {sortField === 'name' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-charcoal-muted opacity-40 hover:opacity-100" />
                    )}
                  </div>
                </th>

                {/* 2. Current Stock */}
                <th 
                  className="py-3.5 px-4 text-center cursor-pointer hover:text-charcoal select-none transition-colors"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Current Stock</span>
                    {sortField === 'stock' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-charcoal-muted opacity-40 hover:opacity-100" />
                    )}
                  </div>
                </th>

                {/* 3. Expiry Date */}
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-charcoal select-none transition-colors"
                  onClick={() => handleSort('expiry')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Expiry Date</span>
                    {sortField === 'expiry' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-charcoal-muted opacity-40 hover:opacity-100" />
                    )}
                  </div>
                </th>

                {/* 4. Stock Status */}
                <th className="py-3.5 px-4">
                  <span>Stock Status</span>
                </th>

                {/* 5. Expiry Status */}
                <th className="py-3.5 px-4">
                  <span>Expiry Status</span>
                </th>

                {/* 6. Last Updated */}
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-charcoal select-none transition-colors"
                  onClick={() => handleSort('updated')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Last Updated</span>
                    {sortField === 'updated' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-charcoal-muted opacity-40 hover:opacity-100" />
                    )}
                  </div>
                </th>

                {/* Actions */}
                <th className="py-3.5 px-4 text-right">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#DED7CE]/70 text-charcoal">
              {filteredAndSortedInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-muted">
                    <Boxes className="w-8 h-8 text-charcoal-muted/40 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No products found matching filters</p>
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="text-xs text-brand-600 underline font-bold mt-2"
                    >
                      Clear search and filter criteria
                    </button>
                  </td>
                </tr>
              ) : (
                filteredAndSortedInventory.map((item) => (
                  <tr key={item.productId} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* 1. Product Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-11 h-11 object-contain rounded-xl bg-[#FAF7F2] border border-[#DED7CE] p-1 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/business/doridori/inventory/${item.productId}`}
                            className="font-bold text-charcoal hover:text-brand-600 hover:underline block truncate"
                            title={item.productName}
                          >
                            {item.productName}
                          </Link>
                          <div className="flex items-center gap-2 text-[10px] text-charcoal-muted font-mono mt-0.5">
                            <span>{item.sku}</span>
                            <span>•</span>
                            <span className="font-sans font-medium">{item.categoryName}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Current Stock (Editable Inline) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {editingStockId === item.productId ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={tempStockValue}
                            onChange={(e) => setTempStockValue(Math.max(0, parseInt(e.target.value, 10) || 0))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveStock(item.productId);
                              if (e.key === 'Escape') setEditingStockId(null);
                            }}
                            className="w-16 text-center py-1 px-1 rounded-lg border-2 border-brand-600 text-sm font-bold bg-white shadow-xs focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveStock(item.productId)}
                            className="p-1 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
                            title="Save stock (Enter)"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStockId(null)}
                            className="p-1 bg-gray-200 text-charcoal rounded-md hover:bg-gray-300 transition-colors"
                            title="Cancel (Esc)"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEditStock(item)}
                          className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-bold text-sm bg-white hover:bg-brand-50/70 border border-[#DED7CE] hover:border-brand-300 shadow-xs transition-all"
                          title="Click to edit stock quantity"
                        >
                          <span className={item.currentStock === 0 ? 'text-rose-700' : 'text-charcoal'}>
                            {item.currentStock}
                          </span>
                          <Edit2 className="w-3 h-3 text-charcoal-muted group-hover:text-brand-600 opacity-30 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </td>

                    {/* 3. Expiry Date (Editable Inline) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {editingExpiryId === item.productId ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="date"
                            value={tempExpiryValue}
                            onChange={(e) => setTempExpiryValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveExpiry(item.productId);
                              if (e.key === 'Escape') setEditingExpiryId(null);
                            }}
                            className="py-1 px-2 rounded-lg border-2 border-brand-600 text-xs font-semibold bg-white shadow-xs focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveExpiry(item.productId)}
                            className="p-1 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
                            title="Save expiry date (Enter)"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingExpiryId(null)}
                            className="p-1 bg-gray-200 text-charcoal rounded-md hover:bg-gray-300 transition-colors"
                            title="Cancel (Esc)"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEditExpiry(item)}
                          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal hover:text-brand-600 hover:underline transition-colors"
                          title="Click to edit expiry date"
                        >
                          <Calendar className="w-3.5 h-3.5 text-charcoal-muted group-hover:text-brand-600" />
                          <span>{item.expiryDate || '—'}</span>
                          <Edit2 className="w-2.5 h-2.5 text-charcoal-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </td>

                    {/* 4. Stock Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStockBadge(item.stockStatus)}
                    </td>

                    {/* 5. Expiry Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getExpiryBadge(item.expiryStatus, item.daysToExpiry)}
                    </td>

                    {/* 6. Last Updated */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-charcoal-muted text-[11px]">
                      {formatLastUpdated(item.lastUpdated)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Edit Button (Direct stock & expiry editor) */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="inline-flex items-center gap-1 bg-white hover:bg-brand-50 text-brand-700 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-[#DED7CE] hover:border-brand-300 shadow-xs transition-colors"
                          title="Edit stock and expiry date"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {/* Adjust Stock Button (Movement ledger) */}
                        <button
                          type="button"
                          onClick={() => handleOpenAdjustModal(item)}
                          className="inline-flex items-center gap-1 bg-[#FAF7F2] hover:bg-brand-100 text-charcoal font-semibold text-xs px-2.5 py-1.5 rounded-lg border border-[#DED7CE] transition-colors"
                          title="Record stock movement"
                        >
                          <SlidersHorizontal className="w-3 h-3 text-charcoal-muted" />
                          <span>Adjust</span>
                        </button>

                        {/* Detail View Icon */}
                        <Link
                          to={`/business/doridori/inventory/${item.productId}`}
                          className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E9E0D4] text-charcoal-muted hover:text-charcoal border border-[#DED7CE] transition-colors"
                          title="View product inventory profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Edit Product Inventory Modal */}
      {selectedProductForEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-soft-in">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedProductForEdit(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-soft-lg overflow-hidden border border-[#DED7CE] z-10 p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#DED7CE] pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedProductForEdit.imageUrl}
                  alt={selectedProductForEdit.productName}
                  className="w-10 h-10 object-contain rounded-xl bg-[#FAF7F2] border border-[#DED7CE] p-1"
                />
                <div>
                  <h3 className="text-sm font-bold text-charcoal">
                    {selectedProductForEdit.productName}
                  </h3>
                  <span className="text-[11px] font-mono text-charcoal-muted">
                    SKU: {selectedProductForEdit.sku} • {selectedProductForEdit.categoryName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProductForEdit(null)}
                className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEditModal} className="space-y-4 text-xs">
              {/* Current Stock */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">
                  Current Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={editStockQty}
                  onChange={(e) => setEditStockQty(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] font-mono font-bold text-charcoal text-sm focus:ring-2 focus:ring-brand-600 focus:bg-white"
                  required
                />
                <p className="text-[10px] text-charcoal-muted mt-1">
                  Status will automatically calculate: &gt;10 units (In Stock), 1–10 units (Low Stock), 0 units (Out of Stock).
                </p>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] font-semibold text-charcoal text-xs focus:ring-2 focus:ring-brand-600 focus:bg-white"
                />
                <p className="text-[10px] text-charcoal-muted mt-1">
                  Status will automatically calculate: Normal (&gt;6 mos), Monitor (3–6 mos), Short-Dated (&lt;3 mos), Expired.
                </p>
              </div>

              {/* Reason / Audit Note */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal-muted uppercase mb-1">
                  Audit Reason / Note (Optional)
                </label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="e.g. Warehouse stock count verification / New batch expiry"
                  className="w-full p-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-charcoal focus:ring-2 focus:ring-brand-600 focus:bg-white"
                />
              </div>

              {editSuccessMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center">
                  {editSuccessMessage}
                </div>
              )}

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductForEdit(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-[#DED7CE] font-semibold text-charcoal hover:bg-[#FAF7F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Interactive Movement Modal */}
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
                    SKU: {selectedProductForAdjust.sku} • Current Stock: {selectedProductForAdjust.currentStock}
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