import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Sparkles, ShoppingBag, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { HeroSlider } from '../components/HeroSlider';
import { NewsCard } from '../components/NewsCard';
import { AffiliateCard } from '../components/AffiliateCard';
import { AdBanner } from '../components/AdBanner';
import { CategoryFilter } from '../components/CategoryFilter';
import { NewsItem } from '../types';
import { getPublishedNews, runNewsCronManually } from '../lib/api';

export const Home: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    // STRICT RULE: only published news
    const items = await getPublishedNews();
    setNewsList(items.filter((i) => i.status === 'published'));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await runNewsCronManually();
      await loadData();
      setRefreshToast(`ক্রন সম্পন্ন! ${res.count} টি নতুন সংবাদ সংগৃহীত (পেন্ডিং তালিকায় জমা হয়েছে)।`);
      setTimeout(() => setRefreshToast(null), 4000);
    } catch {
      setRefreshToast('আপডেট সম্পন্ন হয়েছে।');
      setTimeout(() => setRefreshToast(null), 3000);
    } finally {
      setRefreshing(false);
    }
  };

  // Only published items
  const pureNews = newsList.filter((n) => n.type === 'news' && n.status === 'published');
  const affiliateProducts = newsList.filter(
    (n) => (n.type === 'affiliate_daraz' || n.type === 'affiliate_rokomari') && n.status === 'published'
  );

  // Hero news (top 3 published)
  const heroItems = pureNews.slice(0, 3);
  const sideTrending = pureNews.slice(3, 6);

  // Filtered by Category
  const filteredNews =
    selectedCategory === 'all'
      ? pureNews
      : pureNews.filter((n) => n.category === selectedCategory);

  const latestCards = filteredNews.slice(0, 12);
  const firstBatch = latestCards.slice(0, 6);
  const secondBatch = latestCards.slice(6, 12);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] text-gray-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Toast Notification */}
      {refreshToast && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-2xl shadow-red-900/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Zap className="w-4 h-4 fill-current" />
          <span>{refreshToast}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
              বিশ্ব সংবাদ অটোমেশন ডেস্ক
            </span>
            <span className="text-xs text-gray-500 dark:text-zinc-500 hidden md:inline">
              (প্রতি ১৫ মিনিটে ৫টি কী রোটেশন + বাংলা অনুবাদ)
            </span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
            <span>{refreshing ? 'সংবাদ ফেচ হচ্ছে...' : 'এখনই রিফ্রেশ করুন'}</span>
          </button>
        </div>

        {/* Hero Slider Section (Published Only) */}
        {heroItems.length > 0 && <HeroSlider heroNews={heroItems} sideNews={sideTrending} />}

        {/* Top AdBanner */}
        <AdBanner format="horizontal" />

        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-600" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">সর্বশেষ সংবাদ</h2>
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* News Grid (First 6 Cards) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-gray-200 dark:bg-zinc-900/60 rounded-xl p-4 h-80 animate-pulse border border-gray-200 dark:border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            {firstBatch.map((item) => (
              <NewsCard key={item._id} news={item} />
            ))}
          </div>
        )}

        {/* In-Feed Mid AdBanner (After 6 cards) */}
        <AdBanner format="horizontal" className="my-8" />

        {/* News Grid (Cards 7 to 12) */}
        {secondBatch.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            {secondBatch.map((item) => (
              <NewsCard key={item._id} news={item} />
            ))}
          </div>
        )}

        {/* -------------------- SECTION: 🔥 আজকের সেরা ডিল (Published Deals Only) -------------------- */}
        {affiliateProducts.length > 0 && (
          <section className="my-14 bg-gradient-to-b from-white via-gray-50 to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-900/90 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-lg transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                    দারাজ ও রকমারি স্পেশাল
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
                  🔥 আজকের সেরা ডিল (৫০%+ পর্যন্ত ছাড়)
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  প্রতিদিন সকাল ৮টা ও রাত ৮টায় সংগৃহীত এবং এডমিন ভেরিফাইড সেরা অফার
                </p>
              </div>

              <Link
                to="/deals"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-600 dark:text-red-500 hover:text-red-700 group"
              >
                <span>সব ডিল দেখুন ({affiliateProducts.length}টি)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {affiliateProducts.slice(0, 4).map((product) => (
                <AffiliateCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Category Sections: বিজ্ঞান ও প্রযুক্তি */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-zinc-800 pb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-5 bg-red-600 rounded-xs"></span>
              বিজ্ঞান ও প্রযুক্তি
            </h3>
            <Link to="/category/প্রযুক্তি" className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline">
              আরও দেখুন →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pureNews
              .filter((n) => n.category === 'প্রযুক্তি')
              .slice(0, 2)
              .map((item) => (
                <NewsCard key={item._id} news={item} variant="horizontal" />
              ))}
          </div>
        </section>
      </main>
    </div>
  );
};
