import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsCard } from '../components/NewsCard';
import { AdBanner } from '../components/AdBanner';
import { AffiliateCard } from '../components/AffiliateCard';
import { NewsItem } from '../types';
import { getPublishedNews } from '../lib/api';
import { storage } from '../lib/storage';

export const Category: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPublishedNews(categoryName).then((items) => {
      // STRICT RULE: only published news
      setNewsList(items.filter((n) => n.type === 'news' && n.status === 'published'));
      setLoading(false);
    });
  }, [categoryName]);

  const deals = storage
    .getNews()
    .filter((n) => (n.type === 'affiliate_daraz' || n.type === 'affiliate_rokomari') && n.status === 'published')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] text-gray-900 dark:text-zinc-100 py-6 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500 mb-4">
          <Link to="/" className="hover:text-red-600">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-red-600 font-bold">{categoryName}</span>
        </div>

        {/* Category Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-3 h-7 bg-red-600 rounded-xs"></span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{categoryName} বিভাগ</h1>
          </div>
          <span className="text-xs text-gray-600 dark:text-zinc-400 font-bold">
            মোট সংবাদ: {newsList.length}টি
          </span>
        </div>

        {/* AdBanner */}
        <AdBanner format="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main News Grid (8 cols) */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-64 bg-gray-200 dark:bg-zinc-900 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : newsList.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900/50 rounded-xl p-12 text-center border border-gray-200 dark:border-zinc-800 shadow-sm">
                <p className="text-gray-600 dark:text-zinc-400 text-base font-semibold">এই বিভাগে আপাতত কোনো সংবাদ পাওয়া যায়নি।</p>
                <Link to="/" className="mt-4 inline-block text-red-600 font-bold hover:underline text-sm">
                  সব খবর দেখুন →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {newsList.map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <AdBanner format="rectangle" />

            {deals.length > 0 && (
              <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
                  স্পেশাল ডিল ও বেস্টসেলার
                </h3>
                <div className="space-y-4">
                  {deals.map((deal) => (
                    <AffiliateCard key={deal._id} product={deal} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};
