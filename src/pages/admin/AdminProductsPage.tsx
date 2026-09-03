import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Boxes, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { getProductInventoryList } from '../../lib/inventory';
import { ProductInventory } from '../../types/inventory';

export const AdminProductsPage: React.FC = () => {
  const [inventoryList, setInventoryList] = useState<ProductInventory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPet, setFilterPet] = useState<'all' | 'dog' | 'cat' | 'both'>('all');

  const loadData = () => {
    setInventoryList(getProductInventoryList());
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStockSummary = (productId: string) => {
    return inventoryList.find((i) => i.productId === productId);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (filterPet !== 'all' && p.petType !== filterPet) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchCategory = p.categoryName.toLowerCase().includes(q);
      return matchName || matchSku || matchCategory;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-soft-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222] tracking-tight">
            Product Catalogue & Stock Status
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6A65] mt-1">
            Overview of all active VETANIC SKUs, formulations, launch pricing, and live warehouse inventory.
          </p>
        </div>

        <Link
          to="/business/inventory"
          className="inline-flex items-center gap-2 bg-[#9E2328] hover:bg-[#841C21] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Boxes className="w-4 h-4" />
          <span>Open Inventory Hub</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DED7CE] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6F6A65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or SKU..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#9E2328]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'dog', 'cat', 'both'] as const).map((pet) => (
            <button
              key={pet}
              type="button"
              onClick={() => setFilterPet(pet)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterPet === pet
                  ? 'bg-[#9E2328] text-white font-bold shadow-xs'
                  : 'bg-[#FAF7F2] text-[#222222] hover:bg-[#E9E0D4] border border-[#DED7CE]'
              }`}
            >
              {pet === 'all' ? 'All Types' : pet === 'both' ? 'Dog + Cat' : pet}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const stock = getStockSummary(prod.id);
          const currentQty = stock ? stock.currentStock : (prod.initialStock ?? 0);
          const isSoldOut = !prod.isAvailable || currentQty === 0;
          const isLowStock = !isSoldOut && currentQty <= (prod.lowStockThreshold || 5);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Image & Pet Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] p-2 flex items-center justify-center flex-shrink-0">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-right space-y-1">
                    <span className="inline-block text-[10px] font-bold bg-[#FAF7F2] border border-[#DED7CE] px-2 py-0.5 rounded-md text-[#6F6A65] uppercase tracking-wider">
                      {prod.petTypeLabel}
                    </span>
                    <div className="font-mono text-[10px] text-[#6F6A65]">{prod.sku}</div>
                  </div>
                </div>

                {/* Product Title & Info */}
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#222222]">{prod.name}</h3>
                  <div className="text-[11px] text-[#6F6A65] mt-0.5">{prod.packageSize}</div>
                </div>

                {/* Pricing & Stock Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DED7CE]/70 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DED7CE]">
                    <span className="text-[10px] text-[#6F6A65] uppercase font-bold block">
                      Launch Price
                    </span>
                    <span className="font-serif font-bold text-[#9E2328] text-sm">
                      SGD {prod.launchPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DED7CE]">
                    <span className="text-[10px] text-[#6F6A65] uppercase font-bold block">
                      Stock Level
                    </span>
                    <div className="flex items-center gap-1 font-bold text-xs mt-0.5">
                      {isSoldOut ? (
                        <span className="text-red-700 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Sold Out
                        </span>
                      ) : isLowStock ? (
                        <span className="text-amber-700 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {currentQty} left
                        </span>
                      ) : (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {currentQty} units
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Links */}
              <div className="p-4 bg-[#FAF7F2] border-t border-[#DED7CE] flex items-center justify-between gap-2">
                <Link
                  to={`/business/inventory/${prod.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#E9E0D4]/60 text-[#222222] text-xs font-bold py-2 px-3 rounded-xl border border-[#DED7CE] transition-colors"
                >
                  <Boxes className="w-3.5 h-3.5 text-[#9E2328]" />
                  <span>Adjust Stock</span>
                </Link>

                <Link
                  to={`/products/${prod.id}`}
                  target="_blank"
                  className="p-2 rounded-xl bg-white hover:bg-[#E9E0D4]/60 text-[#6F6A65] hover:text-[#222222] border border-[#DED7CE] transition-colors"
                  title="View Storefront Detail Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
