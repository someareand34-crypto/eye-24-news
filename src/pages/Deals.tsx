import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Sparkles, Filter } from 'lucide-react';
import { AffiliateCard } from '../components/AffiliateCard';
import { AdBanner } from '../components/AdBanner';
import { NewsItem } from '../types';
import { storage } from '../lib/storage';

export const Deals: React.FC = () => {
  const [products, setProducts] = useState<NewsItem[]>([]);
  const [storeFilter, setStoreFilter] = useState<'all' | 'daraz' | 'rokomari'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // STRICT RULE: Only published affiliate items appear on public /deals
    const all = storage.getNews();
    const aff = all.filter(
      (n) => (n.type === 'affiliate_daraz' || n.type === 'affiliate_rokomari') && n.status === 'published'
    );
    setProducts(aff);
  }, []);

  const filtered = products.filter((item) => {
    if (storeFilter === 'daraz' && item.type !== 'affiliate_daraz') return false;
    if (storeFilter === 'rokomari' && item.type !== 'affiliate_rokomari') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBn = item.title_bn.toLowerCase().includes(q);
      const matchEn = (item.title_en || '').toLowerCase().includes(q);
      const matchAuthor = (item.author || '').toLowerCase().includes(q);
      if (!matchBn && !matchEn && !matchAuthor) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] text-gray-900 dark:text-zinc-100 py-6 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4">
        {/* Hero Banner for Deals */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-700 via-red-800 to-black text-white p-6 sm:p-10 mb-8 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-xs text-white text-xs font-black px-3 py-1 rounded-full mb-3 shadow">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>প্রতিদিন দুই বেলা সকাল ৮টা ও রাত ৮টায় সিঙ্ক</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2">
              🔥 দারাজ ও রকমারি এক্সক্লুসিভ ডিল হাব
            </h1>
            <p className="text-sm sm:text-base text-red-100 leading-relaxed">
              সেরা গ্যাজেট, স্মার্টওয়াচ ও বেস্টসেলার বইগুলোতে পাচ্ছেন ৩৫% থেকে ৬০% পর্যন্ত সর্বোচ্চ ছাড়। সকল পণ্যের অফিসিয়াল ভেরিফাইড ডিসকাউন্ট ও ক্যাশ অন ডেলিভারি লিংক।
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
          {/* Store Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-zinc-500 flex items-center gap-1 font-bold mr-1">
              <Filter className="w-3.5 h-3.5" /> স্টোর:
            </span>
            <button
              onClick={() => setStoreFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                storeFilter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              সব অফার ({products.length})
            </button>
            <button
              onClick={() => setStoreFilter('daraz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                storeFilter === 'daraz'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              দারাজ বাংলাদেশ
            </button>
            <button
              onClick={() => setStoreFilter('rokomari')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                storeFilter === 'rokomari'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              রকমারি বই
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="পণ্য বা লেখকের নাম খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900/40 rounded-xl p-12 text-center border border-gray-200 dark:border-zinc-800 my-8 shadow-xs">
            <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-gray-800 dark:text-zinc-300 font-bold">কোনো প্রকাশিত পণ্য পাওয়া যায়নি</p>
            <p className="text-gray-500 dark:text-zinc-500 text-xs mt-1">
              এডমিন অনুমোদনের পর নতুন ডিসকাউন্ট অফারগুলো এখানে দৃশ্যমান হবে।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <AffiliateCard key={item._id} product={item} />
            ))}
          </div>
        )}

        {/* AdBanner in Deals Page */}
        <AdBanner format="horizontal" className="my-10" />

        {/* Affiliate Disclosure Section */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 text-xs text-gray-600 dark:text-zinc-400 shadow-xs">
          <h4 className="font-bold text-gray-900 dark:text-white mb-1">অ্যাফিলিয়েট পার্টনারশিপ ডিসক্লোজার</h4>
          <p className="leading-relaxed">
            Eye 24 দারাজ বাংলাদেশ ও রকমারি ডট কমের অনুমোদিত অ্যাফিলিয়েট পার্টনার। আমাদের সাইটে প্রদর্শিত পণ্যগুলোর কেনাকাটা সম্পন্ন হলে আমরা একটি নির্দিষ্ট রেফারেল কমিশন পেয়ে থাকি যা কোনোভাবেই ক্রেতার মূল্যে প্রভাব ফেলে না।
          </p>
        </div>
      </main>
    </div>
  );
};
