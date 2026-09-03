import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Boxes, 
  Package, 
  ArrowLeft, 
  ShieldCheck, 
  TrendingUp, 
  History, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminNotificationBell } from '../../components/admin/AdminNotificationBell';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const mainNavItems = [
    { name: 'Dashboard', path: '/business/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Orders', path: '/business/orders', icon: ShoppingBag, exact: false },
    { name: 'Inventory', path: '/business/inventory', icon: Boxes, exact: false },
    { name: 'Products', path: '/business/products', icon: Package, exact: true },
  ];

  const inventorySubNav = [
    { name: 'Overview', path: '/business/inventory', icon: Boxes, exact: true },
    { name: 'Sales by Product', path: '/business/inventory/sales', icon: TrendingUp, exact: true },
    { name: 'Stock Movements', path: '/business/inventory/movements', icon: History, exact: true },
  ];

  const isMainActive = (path: string, exact: boolean) => {
    if (exact) return location.pathname === path || (path === '/business/dashboard' && location.pathname === '/business');
    return location.pathname.startsWith(path);
  };

  const isSubActive = (path: string) => {
    return location.pathname === path;
  };

  const isInventorySection = location.pathname.startsWith('/business/inventory');

  const handleLogout = async () => {
    await logout();
    navigate('/business/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col text-[#222222] font-sans">
      {/* Top Business Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#DED7CE] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Brand + Staff Pill */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/business/dashboard" className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-[#222222] tracking-tight">
                  VETANIC
                </span>
                <span className="inline-flex items-center gap-1 bg-[#9E2328]/10 border border-[#9E2328]/20 text-[#9E2328] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-[#9E2328]" />
                  Business Hub
                </span>
              </Link>
            </div>

            {/* Middle: Main Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isMainActive(item.path, item.exact);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#9E2328] text-white shadow-xs'
                        : 'text-[#6F6A65] hover:text-[#222222] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Notifications, Admin Profile, Logout, Store Link */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <AdminNotificationBell />

              {/* Admin Staff Badge */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DED7CE] text-xs">
                <div className="w-6 h-6 rounded-lg bg-[#9E2328] text-white flex items-center justify-center font-bold text-[10px]">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="text-left">
                  <div className="font-bold text-[#222222] text-[11px] leading-tight">
                    {user?.name || 'VETANIC Staff'}
                  </div>
                  <div className="text-[9px] text-[#6F6A65] font-semibold uppercase tracking-wider">
                    {user?.role || 'Admin'}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out of Business Hub"
                className="inline-flex items-center gap-1 p-2 rounded-xl text-[#6F6A65] hover:text-[#9E2328] hover:bg-[#FAF7F2] border border-[#DED7CE] transition-colors cursor-pointer text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>

              {/* Return to Store Front */}
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#6F6A65] hover:text-[#9E2328] px-3 py-1.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] hover:bg-[#E9E0D4]/60 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
              </Link>
            </div>
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <div className="md:hidden flex items-center justify-around py-2 border-t border-[#DED7CE]/70">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isMainActive(item.path, item.exact);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    active
                      ? 'text-[#9E2328]'
                      : 'text-[#6F6A65] hover:text-[#222222]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Sub Navigation Bar for Inventory Section */}
          {isInventorySection && (
            <div className="border-t border-[#DED7CE]/70 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-[#6F6A65] tracking-wider mr-2 flex-shrink-0">
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
                          ? 'bg-[#9E2328]/10 text-[#9E2328] border border-[#9E2328]/30 font-bold'
                          : 'text-[#6F6A65] hover:text-[#222222] hover:bg-[#FAF7F2]'
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
      <footer className="bg-white border-t border-[#DED7CE] py-4 text-center text-xs text-[#6F6A65]">
        <span>VETANIC Singapore Internal Business Operations • Enterprise Authenticated</span>
      </footer>
    </div>
  );
};
