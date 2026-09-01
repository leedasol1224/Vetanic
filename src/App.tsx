import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StickyOrderBar } from './components/layout/StickyOrderBar';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { AddedNotification } from './components/common/Notification';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrderPage } from './pages/OrderPage';
import { ContactPage } from './pages/ContactPage';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminInventorySalesPage } from './pages/admin/AdminInventorySalesPage';
import { AdminInventoryMovementsPage } from './pages/admin/AdminInventoryMovementsPage';
import { AdminInventoryProductDetailPage } from './pages/admin/AdminInventoryProductDetailPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

// Public Customer Facing Layout
function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#222222]">
      <AnnouncementBar />
      <Navbar />
      
      <Outlet />

      <Footer />

      {/* Persistent customer global widgets */}
      <StickyOrderBar />
      <CartDrawer />
      <ProductDetailModal />
      <AddedNotification />
    </div>
  );
}

function App() {
  return (
    <OrderProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>

          {/* Internal Admin Business Routes (Hidden from customer navigation) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="inventory/sales" element={<AdminInventorySalesPage />} />
            <Route path="inventory/movements" element={<AdminInventoryMovementsPage />} />
            <Route path="inventory/:productId" element={<AdminInventoryProductDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
