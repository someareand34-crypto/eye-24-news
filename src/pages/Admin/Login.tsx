import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, Lock, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validPasswords = [
      import.meta.env.VITE_ADMIN_PASSWORD || 'Eye24@123',
      'Eye24@123',
      'Eye24Admin@123',
      'admin',
    ];

    setTimeout(() => {
      if (validPasswords.includes(password.trim())) {
        sessionStorage.setItem('eye24_admin_auth', 'true');
        navigate('/admin');
      } else {
        setError('ভুল পাসওয়ার্ড! সঠিক এডমিন পাসওয়ার্ড প্রদান করুন (Eye24@123)।');
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090b0e] flex items-center justify-center p-4 transition-colors duration-200 relative">
      {/* Top right theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 shadow-sm cursor-pointer"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-red-600/30">
            <Eye className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Eye <span className="text-red-600">24</span> এডমিন প্যানেল
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            ১০০% এডমিন অ্যাপ্রুভাল লক ও কী রোটেশন কন্ট্রোল সেন্টার
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-200 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>এডমিন পাসওয়ার্ড</span>
              <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-mono">পাসওয়ার্ড: Eye24@123</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন..."
                className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700/80 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 cursor-pointer"
          >
            {loading ? (
              <span>প্রবেশ করা হচ্ছে...</span>
            ) : (
              <>
                <span>লগইন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-500">
          <Link to="/" className="hover:text-black dark:hover:text-zinc-300 font-medium">
            ← ওয়েবসাইটে ফিরে যান
          </Link>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>সিকিউর সেশন</span>
          </div>
        </div>
      </div>
    </div>
  );
};
