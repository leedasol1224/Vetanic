import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Boxes, ArrowLeft, ShieldCheck, TrendingUp, History } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const mainNavItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, exact: false },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes, exact: false },
  ];

  const inventorySubNav = [
    { name: 'Overview', path: '/admin/inventory', icon: Boxes, exact: true },
    { name: 'Sales by Product', path: '/admin/inventory/sales', icon: TrendingUp, exact: true },
    { name: 'Stock Movements', path: '/admin/inventory/movements', icon: History, exact: true },
  ];

  const isMainActive = (path: string, exact: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const isSubActive = (path: string) => {
    return location.pathname === path;
  };

  const isInventorySection = location.pathname.startsWith('/admin/inventory');

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col text-charcoal font-sans">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#DED7CE] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand + Admin Pill */}
            <div className="flex items-center gap-3">
              <Link to="/admin" className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-charcoal tracking-tight">
                  VETANIC
                </span>
                <span className="inline-flex items-center gap-1 bg-brand-50 border border-brand-200 text-brand-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-brand-600" />
                  Admin
                </span>
              </Link>
            </div>

            {/* Middle: Main Navigation Links */}
            <nav className="flex items-center gap-1.5 sm:gap-3">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isMainActive(item.path, item.exact);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Return to Store Front */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-brand-600 px-3 py-1.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] hover:bg-[#F4EFE7] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Website</span>
                <span className="sm:hidden">Store</span>
              </Link>
            </div>
          </div>

          {/* Sub Navigation Bar for Inventory Section */}
          {isInventorySection && (
            <div className="border-t border-[#DED7CE]/70 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider mr-2 flex-shrink-0">
                Inventory Hub:
              </span>
              <div className="flex items-center gap-1.5">
                {inventorySubNav.map((sub) => {
                  const Icon = sub.icon;
                  const active = isSubActive(sub.path);
                  return (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        active
                          ? 'bg-brand-50 text-brand-600 border border-brand-200 font-bold'
                          : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sub.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Admin Content View */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-[#DED7CE] py-4 text-center text-xs text-charcoal-muted">
        <span>VETANIC Singapore Internal Business Console • Inventory Ledger Integrated</span>
      </footer>
    </div>
  );
};
