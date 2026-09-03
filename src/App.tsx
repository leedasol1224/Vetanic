import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
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

import { BusinessLoginPage } from './pages/admin/BusinessLoginPage';
import { BusinessAuthGuard } from './components/admin/BusinessAuthGuard';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminInventorySalesPage } from './pages/admin/AdminInventorySalesPage';
import { AdminInventoryMovementsPage } from './pages/admin/AdminInventoryMovementsPage';
import { AdminInventoryProductDetailPage } from './pages/admin/AdminInventoryProductDetailPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';

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
    <AuthProvider>
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

            {/* Public Business Login Page */}
            <Route path="/business/login" element={<BusinessLoginPage />} />

            {/* Protected Internal Business Console (Authentication Required) */}
            <Route
              path="/business"
              element={
                <BusinessAuthGuard>
                  <AdminLayout />
                </BusinessAuthGuard>
              }
            >
              <Route index element={<Navigate to="/business/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="inventory/sales" element={<AdminInventorySalesPage />} />
              <Route path="inventory/movements" element={<AdminInventoryMovementsPage />} />
              <Route path="inventory/:productId" element={<AdminInventoryProductDetailPage />} />
              <Route path="products" element={<AdminProductsPage />} />
            </Route>

            {/* Legacy Admin URLs Auto-Redirect to Business Console */}
            <Route path="/admin/*" element={<Navigate to="/business/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/business/dashboard" replace />} />
          </Routes>
        </Router>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
