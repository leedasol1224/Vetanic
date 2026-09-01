import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItemCount, openCartDrawer } = useOrder();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Order', path: '/order' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#DED7CE] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex flex-col group py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-charcoal group-hover:text-brand-600 transition-colors">
                VETANIC
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-brand-600 mb-1" />
            </div>
            <span className="text-[10px] tracking-wider text-charcoal-muted uppercase font-medium">
              by Nongshim Banryodaum
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive(link.path)
                    ? 'text-brand-600 font-bold'
                    : 'text-charcoal-muted hover:text-brand-600'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Cart Drawer Trigger ("Your Order · X items") */}
          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                Your Order{totalItemCount > 0 ? ` · ${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'}` : ''}
              </span>
            </button>
          </div>

          {/* Mobile Menu & Cart Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative p-2 text-charcoal hover:bg-[#E9E0D4] rounded-full transition-colors"
              aria-label="Open Cart Drawer"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF7F2]">
                  {totalItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal hover:bg-[#E9E0D4] focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#DED7CE] px-4 pt-3 pb-6 space-y-3 animate-soft-in">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-brand-50 text-brand-600 font-bold'
                    : 'text-charcoal hover:bg-[#E9E0D4]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
