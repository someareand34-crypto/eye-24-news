import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Share2,
  Facebook,
  MessageCircle,
  Copy,
  Clock,
  Eye,
  Check,
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { AffiliateCard } from '../components/AffiliateCard';
import { NewsCard } from '../components/NewsCard';
import { NewsItem } from '../types';
import { getNewsDetail } from '../lib/api';
import { storage } from '../lib/storage';

export const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getNewsDetail(id).then(({ news: item, related: rel }) => {
      setNews(item);
      setRelated(rel.filter((r) => r.status === 'published'));
      setLoading(false);
      window.scrollTo(0, 0);
    });
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toBnNum = (n: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n
      .toString()
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] ?? d)
      .join('');
  };

  const affiliateDeals = storage
    .getNews()
    .filter((n) => (n.type === 'affiliate_daraz' || n.type === 'affiliate_rokomari') && n.status === 'published')
    .slice(0, 3);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-xl mb-6 animate-pulse"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!news || news.status !== 'published') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">সংবাদটি প্রকাশিত নয় বা পাওয়া যায়নি</h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm mb-6">
          এই আইটেমটি এখনও এডমিন কর্তৃক অনুমোদিত হয়নি অথবা মুছে ফেলা হয়েছে।
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(news.title_bn);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] text-gray-900 dark:text-zinc-100 py-6 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500 mb-4">
          <Link to="/" className="hover:text-red-600">প্রচ্ছদ</Link>
          <span>/</span>
          <Link to={`/category/${news.category}`} className="text-red-600 font-bold">
            {news.category}
          </Link>
          <span>/</span>
          <span className="truncate max-w-xs">{news.title_bn}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content (8 cols) */}
          <article className="lg:col-span-8 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            {/* Category & Metadata */}
            <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 dark:text-zinc-400 mb-3">
              <span className="text-red-600 font-black uppercase">{news.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-gray-700 dark:text-zinc-300">উৎস: {news.source}</span>
              <span aria-hidden="true">·</span>
              <span>দেশ: {news.country || 'আন্তর্জাতিক'}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {new Date(news.publishedAt || news.createdAt).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {toBnNum(news.views || 680)} পঠিত
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              {news.title_bn}
            </h1>

            {/* Social Share Bar */}
            <div className="flex items-center justify-between py-3 my-4 border-y border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold mr-1 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> শেয়ার:
                </span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white transition-colors"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white transition-colors"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {news.viralScore && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>ভাইরাল ট্রেন্ড: {toBnNum(news.viralScore)}%</span>
                </div>
              )}
            </div>

            {/* Featured Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 my-6 shadow-md border border-gray-200 dark:border-zinc-800">
              <img
                src={news.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
                alt={news.title_bn}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-3 text-[11px] text-zinc-300 bg-black/75 px-2 py-0.5 rounded font-medium">
                উৎস: {news.source} / Eye 24
              </div>
            </div>

            {/* Body Content */}
            <div className="text-gray-800 dark:text-zinc-200 text-base sm:text-lg leading-relaxed space-y-5 font-normal">
              <p className="font-bold text-gray-900 dark:text-zinc-100 text-lg sm:text-xl border-l-4 border-red-600 pl-4 py-1.5 bg-gray-50 dark:bg-zinc-900/50 rounded-r">
                {news.description_bn || news.description_en}
              </p>

              <p>
                আন্তর্জাতিক কূটনৈতিক ও অর্থনৈতিক মহলে এই ঘটনাটি নিয়ে ব্যাপক আলোচনা শুরু হয়েছে। সংশ্লিষ্ট বিশেষজ্ঞরা মনে করছেন, বর্তমান ভূ-রাজনৈতিক প্রেক্ষাপটে এই সিদ্ধান্তের প্রভাব দীর্ঘমেয়াদে আন্তর্জাতিক বাণিজ্য ও সরবরাহ শৃঙ্খলে দৃশ্যমান পরিবর্তন আনতে পারে।
              </p>

              {/* In-Content AdBanner */}
              <AdBanner format="horizontal" className="my-8" />

              <p>
                বিশেষজ্ঞদের প্রাথমিক মূল্যায়নে উঠে এসেছে যে, সাধারণ জনগণের জীবনযাত্রা এবং দৈনন্দিন বাজার মূল্যেও এর সম্ভাব্য প্রভাব পড়ার যথেষ্ট কারণ রয়েছে। আন্তর্জাতিক নীতি-নির্ধারকরা সার্বিক পরিস্থিতির ওপর গভীর নজর রাখছেন এবং অচিরেই পরবর্তী পদক্ষেপ স্পষ্ট করবেন।
              </p>

              {news.title_en && (
                <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-xs text-gray-600 dark:text-zinc-400">
                  <span className="font-bold text-gray-800 dark:text-zinc-300 block mb-1">Original English Source Wire:</span>
                  <p className="italic font-mono">{news.title_en}</p>
                </div>
              )}
            </div>

            {/* ----------------- AFFILIATE WIDGET: "এই সম্পর্কিত সেরা ডিল" ----------------- */}
            {affiliateDeals.length > 0 && (
              <section className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-md">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      এই সম্পর্কিত সেরা ডিল (দারাজ ও রকমারি)
                    </h3>
                  </div>
                  <Link to="/deals" className="text-xs text-red-600 dark:text-red-400 hover:underline font-bold">
                    সব ডিল দেখুন →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {affiliateDeals.map((prod) => (
                    <AffiliateCard key={prod._id} product={prod} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <AdBanner format="rectangle" />

            {/* Related News List */}
            <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <span>সম্পর্কিত সংবাদ</span>
                <span className="text-xs text-red-600 font-bold">{news.category}</span>
              </h3>

              <div className="space-y-3">
                {related.map((item) => (
                  <NewsCard key={item._id} news={item} variant="compact" />
                ))}
                {related.length === 0 && (
                  <p className="text-xs text-gray-500 py-4 text-center">আর কোনো সম্পর্কিত সংবাদ নেই</p>
                )}
              </div>
            </div>

            {/* WhatsApp Box */}
            <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/40 dark:to-black border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center mx-auto text-white mb-3 shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Eye 24 হোয়াটসঅ্যাপ চ্যানেল</h4>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mb-4">
                সবার আগে ব্রেকিং নিউজ ও ভাইরাল আপডেট সরাসরি হোয়াটসঅ্যাপে পেতে যুক্ত হোন আমাদের চ্যানেলে।
              </p>
              <a
                href="https://whatsapp.com/channel"
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-lg transition-colors shadow-sm"
              >
                হোয়াটসঅ্যাপ চ্যানেলে যুক্ত হোন
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
