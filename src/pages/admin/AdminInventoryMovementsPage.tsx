import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  FileSpreadsheet, 
  RefreshCw
} from 'lucide-react';
import { getInventoryMovements, exportToExcel } from '../../lib/inventory';
import { InventoryMovement, InventoryMovementType } from '../../types/inventory';
import { PRODUCTS } from '../../data/products';

const ALL_MOVEMENT_TYPES: Array<'All' | InventoryMovementType> = [
  'All',
  'Initial Stock',
  'Stock Received',
  'Sale',
  'Cancellation Restock',
  'Manual Addition',
  'Manual Reduction',
  'Stock Correction'
];

export const AdminInventoryMovementsPage: React.FC = () => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [selectedType, setSelectedType] = useState<'All' | InventoryMovementType>('All');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadMovements = () => {
    setMovements(getInventoryMovements());
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const getMovementBadge = (type: InventoryMovementType) => {
    switch (type) {
      case 'Initial Stock':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Stock Received':
      case 'Manual Addition':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Sale':
        return 'bg-brand-50 text-brand-700 border-brand-200';
      case 'Cancellation Restock':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Manual Reduction':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Stock Correction':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filtered movements
  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      // 1. Type filter
      if (selectedType !== 'All' && m.movementType !== selectedType) {
        return false;
      }
      // 2. Product filter
      if (selectedProduct !== 'All' && m.productId !== selectedProduct) {
        return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesProd = m.productName.toLowerCase().includes(q);
        const matchesSku = m.sku.toLowerCase().includes(q);
        const matchesReason = m.reason.toLowerCase().includes(q);
        const matchesRef = m.orderReference?.toLowerCase().includes(q);
        const matchesNote = m.internalNote?.toLowerCase().includes(q);
        if (!matchesProd && !matchesSku && !matchesReason && !matchesRef && !matchesNote) {
          return false;
        }
      }
      return true;
    });
  }, [movements, selectedType, selectedProduct, searchQuery]);

  const handleExport = () => {
    exportToExcel('movements');
  };

  return (
    <div className="space-y-6 animate-soft-in">
      {/* Top Header */}
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
              Stock Movement History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Auditable transaction ledger for every stock intake, sale deduction, restock and adjustment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadMovements}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F2] text-charcoal font-semibold text-xs px-3.5 py-2 rounded-xl border border-[#DED7CE] shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Movements to Excel</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, SKU, order ref, or reason..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>

          {/* Product Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs font-semibold text-charcoal focus:ring-2 focus:ring-brand-600"
            >
              <option value="All">All Products</option>
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          {/* Movement Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'All' | InventoryMovementType)}
              className="w-full py-2 px-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs font-semibold text-charcoal focus:ring-2 focus:ring-brand-600"
            >
              {ALL_MOVEMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Movement Types' : t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Movements Ledger Table */}
      <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft overflow-hidden">
        <div className="p-4 border-b border-[#DED7CE] bg-[#FAF7F2]/50 flex items-center justify-between text-xs text-charcoal-muted">
          <div>
            Showing <strong>{filteredMovements.length}</strong> ledger records
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-brand-600 underline font-semibold">
              Clear search
            </button>
          )}
        </div>

        {filteredMovements.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-semibold text-charcoal">No matching stock movements found</p>
            <p className="text-xs text-charcoal-muted">Try clearing the search query or selecting a different filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#DED7CE] text-charcoal-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Date / Time</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Movement Type</th>
                  <th className="py-3.5 px-4 text-center">Change</th>
                  <th className="py-3.5 px-4 text-center">Stock Progression</th>
                  <th className="py-3.5 px-4">Order / Reference</th>
                  <th className="py-3.5 px-4">Reason & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED7CE]/70 text-charcoal">
                {filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Date / Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-charcoal-muted">
                      <div className="font-semibold text-charcoal">
                        {new Date(m.createdAt).toLocaleDateString('en-SG', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-[10px]">
                        {new Date(m.createdAt).toLocaleTimeString('en-SG', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/admin/inventory/${m.productId}`}
                        className="font-bold text-charcoal hover:text-brand-600 hover:underline block"
                      >
                        {m.productName}
                      </Link>
                      <span className="text-[10px] font-mono text-charcoal-muted">{m.sku}</span>
                    </td>

                    {/* Movement Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getMovementBadge(
                          m.movementType
                        )}`}
                      >
                        {m.movementType}
                      </span>
                    </td>

                    {/* Quantity Change */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`font-bold font-mono text-sm ${
                          m.quantityChange > 0
                            ? 'text-emerald-700'
                            : m.quantityChange < 0
                            ? 'text-brand-700'
                            : 'text-charcoal'
                        }`}
                      >
                        {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                      </span>
                    </td>

                    {/* Stock Progression */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-charcoal-muted whitespace-nowrap">
                      <span>{m.stockBefore}</span>
                      <span className="mx-1 text-gray-300">→</span>
                      <strong className="text-charcoal font-bold">{m.stockAfter}</strong>
                    </td>

                    {/* Reference */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {m.orderReference ? (
                        <Link
                          to={`/admin/orders/${m.orderId || m.orderReference}`}
                          className="font-mono font-bold text-brand-600 hover:underline"
                        >
                          {m.orderReference}
                        </Link>
                      ) : (
                        <span className="text-charcoal-muted">—</span>
                      )}
                    </td>

                    {/* Reason & Notes */}
                    <td className="py-3.5 px-4 min-w-[14rem]">
                      <div className="font-medium text-charcoal">{m.reason}</div>
                      {m.internalNote && (
                        <div className="text-[11px] text-charcoal-muted italic mt-0.5">
                          "{m.internalNote}"
                        </div>
                      )}
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
