import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Settings,
  ShoppingBag,
  ListOrdered,
  LogOut,
  ExternalLink,
  Eye,
  Sun,
  Moon,
} from 'lucide-react';
import { storage } from '../../lib/storage';
import { useTheme } from '../../context/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const stats = storage.getStats();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    sessionStorage.removeItem('eye24_admin_auth');
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'ড্যাশবোর্ড', path: '/admin', icon: LayoutDashboard },
    {
      label: 'পেন্ডিং নিউজ ও ডিল',
      path: '/admin/pending',
      icon: Clock,
      badge: stats.pendingTotal > 0 ? stats.pendingTotal : undefined,
    },
    { label: '৫x কী রোটেশন & API', path: '/admin/settings', icon: Settings },
    { label: 'অ্যাফিলিয়েট ডিল', path: '/admin/affiliate', icon: ShoppingBag },
    { label: 'সিস্টেম লগ', path: '/admin/logs', icon: ListOrdered },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#090b0e] text-gray-900 dark:text-zinc-100 flex flex-col transition-colors duration-200">
      {/* Top Admin Bar */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 py-3 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white shadow-xs">
                <Eye className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-black text-lg text-gray-900 dark:text-white">
                Eye <span className="text-red-600">24</span>
              </span>
            </Link>
            <span className="hidden sm:inline bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 text-[11px] px-2.5 py-0.5 rounded font-bold">
              🔒 100% Approval Lock Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:border-red-500 transition-colors cursor-pointer"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              <span className="text-[11px] hidden sm:inline">{theme === 'dark' ? 'হোয়াইট' : 'ডার্ক'}</span>
            </button>

            <Link
              to="/"
              target="_blank"
              className="text-xs text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center gap-1 bg-gray-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 transition-colors"
            >
              <span>ওয়েবসাইট দেখুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub Nav Bar */}
      <nav className="bg-white/80 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
};
