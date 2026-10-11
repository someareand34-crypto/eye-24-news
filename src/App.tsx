import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { NewsDetail } from './pages/NewsDetail';
import { Category } from './pages/Category';
import { Deals } from './pages/Deals';
import { Login } from './pages/Admin/Login';
import { Dashboard } from './pages/Admin/Dashboard';
import { PendingNews } from './pages/Admin/PendingNews';
import { Settings } from './pages/Admin/Settings';
import { AffiliateManager } from './pages/Admin/AffiliateManager';
import { Logs } from './pages/Admin/Logs';
import { storage } from './lib/storage';
import { NewsItem } from './types';

// Protected Admin Route wrapper
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = sessionStorage.getItem('eye24_admin_auth') === 'true';
  // Allow direct access or redirect to login
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// Main Layout to conditionally render Header/Footer on public pages
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const all = storage.getNews();
    const published = all.filter((n) => n.status === 'published' && n.type === 'news');
    setBreakingNews(published.slice(0, 5));
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Header breakingNews={breakingNews} />}

      <div className="flex-1">
        <Routes>
          {/* Public News & Deals Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/deals" element={<Deals />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/pending"
            element={
              <ProtectedAdminRoute>
                <PendingNews />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedAdminRoute>
                <Settings />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/affiliate"
            element={
              <ProtectedAdminRoute>
                <AffiliateManager />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedAdminRoute>
                <Logs />
              </ProtectedAdminRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAdmin && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
