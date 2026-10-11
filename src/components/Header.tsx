import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Eye, Menu, X, Shield, ShoppingBag, Globe, Share2, Sun, Moon } from 'lucide-react';
import { BreakingTicker } from './BreakingTicker';
import { NewsItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  breakingNews?: NewsItem[];
}

export const Header: React.FC<HeaderProps> = ({ breakingNews = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bengaliDate, setBengaliDate] = useState('');
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const now = new Date();
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const months = [
      'জানুয়ারি',
      'ফেব্রুয়ারি',
      'মার্চ',
      'এপ্রিল',
      'মে',
      'জুন',
      'জুলাই',
      'আগস্ট',
      'সেপ্টেম্বর',
      'অক্টোবর',
      'নভেম্বর',
      'ডিসেম্বর',
    ];

    const toBnNum = (n: number) => {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return n
        .toString()
        .split('')
        .map((d) => bnDigits[parseInt(d, 10)] ?? d)
        .join('');
    };

    const dayName = days[now.getDay()];
    const dateNum = toBnNum(now.getDate());
    const monthName = months[now.getMonth()];
    const yearNum = toBnNum(now.getFullYear());

    setBengaliDate(`${dayName}, ${dateNum} ${monthName} ${yearNum}`);
  }, []);

  const navLinks = [
    { label: 'প্রচ্ছদ', path: '/' },
    { label: 'জাতীয়', path: '/category/জাতীয়' },
    { label: 'আন্তর্জাতিক', path: '/category/আন্তর্জাতিক' },
    { label: 'ভাইরাল', path: '/category/ভাইরাল' },
    { label: 'খেলা', path: '/category/খেলা' },
    { label: 'প্রযুক্তি', path: '/category/প্রযুক্তি' },
    { label: '🔥 সেরা ডিল', path: '/deals', highlight: true },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white dark:bg-black text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-200">
      {/* Top Meta Bar */}
      <div className="border-b border-gray-100 dark:border-zinc-800/80 bg-gray-50 dark:bg-zinc-950 text-xs text-gray-500 dark:text-zinc-400 py-1.5 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 dark:text-zinc-300 font-semibold">{bengaliDate || 'রবিবার, ঢাকা সংস্করণ'}</span>
            <span className="hidden sm:inline text-gray-300 dark:text-zinc-700">|</span>
            <span className="hidden sm:inline text-gray-500 dark:text-zinc-400">২৪ ঘণ্টা লাইভ আন্তর্জাতিক নিউজ ডেস্ক</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-red-500 text-gray-700 dark:text-zinc-200 transition-all cursor-pointer shadow-xs"
              title={theme === 'dark' ? 'হোয়াইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-[11px] hidden sm:inline">হোয়াইট</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[11px] hidden sm:inline">ডার্ক</span>
                </>
              )}
            </button>

            <span className="text-gray-300 dark:text-zinc-700">|</span>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ফেসবুক</span>
            </a>

            <span className="text-gray-300 dark:text-zinc-700">|</span>

            <Link
              to="/admin"
              className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 transition-colors font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>এডমিন প্যানেল</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Logo & Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Eye className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1 leading-none">
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Eye</span>
              <span className="text-2xl font-black text-red-600 tracking-tight">24</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 uppercase tracking-widest font-bold mt-0.5">
              গ্লোবাল অটোমেটেড নিউজ পোর্টাল
            </p>
          </div>
        </Link>

        {/* Desktop Quick Tagline */}
        <div className="hidden lg:flex items-center gap-3 bg-gray-50 dark:bg-zinc-900/90 border border-gray-200 dark:border-zinc-800 rounded-lg px-3.5 py-1.5 transition-colors">
          <Globe className="w-4 h-4 text-red-600 animate-spin" style={{ animationDuration: '14s' }} />
          <div className="text-xs">
            <span className="text-gray-800 dark:text-zinc-200 font-bold">১০০% ভেরিফাইড আন্তর্জাতিক সংবাদ</span>
            <span className="text-gray-500 dark:text-zinc-400 block text-[11px]">প্রতি ১৫ মিনিটে ৫টি এপিআই রোটেশন + বাংলা অনুবাদ</span>
          </div>
        </div>

        {/* Action button & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/deals"
            className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-sm shadow-red-600/30"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>দারাজ ও রকমারি ডিল</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <nav className="hidden md:block bg-gray-50/80 dark:bg-zinc-950/90 border-t border-gray-200 dark:border-zinc-800/90">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2.5 text-sm font-bold transition-all relative ${
                    link.highlight
                      ? 'text-red-600 hover:text-red-700 font-extrabold'
                      : active
                      ? 'text-red-600 dark:text-red-500'
                      : 'text-gray-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-red-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">লাইভ আপডেট</span>
          </div>
        </div>
      </nav>

      {/* Breaking News Ticker directly below navigation */}
      <BreakingTicker breakingNews={breakingNews} />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 py-3 px-4 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200 dark:border-zinc-800">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg font-bold"
              >
                <Shield className="w-4 h-4" />
                <span>এডমিন লগইন / সেটিংস</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
