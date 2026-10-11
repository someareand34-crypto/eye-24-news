import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, TrendingUp } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'standard' | 'horizontal' | 'compact';
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, variant = 'standard' }) => {
  const formatTime = (dateStr?: string | null) => {
    if (!dateStr) return 'কিছুক্ষণ আগে';
    try {
      const date = new Date(dateStr);
      const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMin < 60) {
        return `${toBnNum(Math.max(diffMin, 1))} মিনিট আগে`;
      }
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) {
        return `${toBnNum(diffHours)} ঘণ্টা আগে`;
      }
      return `${toBnNum(Math.floor(diffHours / 24))} দিন আগে`;
    } catch {
      return 'কিছুক্ষণ আগে';
    }
  };

  const toBnNum = (n: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n
      .toString()
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] ?? d)
      .join('');
  };

  if (variant === 'compact') {
    return (
      <Link
        to={`/news/${news._id}`}
        className="group flex gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900/80 transition-colors border-b border-gray-100 dark:border-zinc-900 last:border-0"
      >
        <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-zinc-800">
          <img
            src={news.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80'}
            alt={news.title_bn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-200 group-hover:text-red-600 dark:group-hover:text-red-500 line-clamp-2 leading-snug">
            {news.title_bn}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-500 mt-1">
            <span className="text-red-600 dark:text-red-400 font-bold">{news.category}</span>
            <span aria-hidden="true">·</span>
            <span>{formatTime(news.publishedAt || news.createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/news/${news._id}`}
        className="group grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 hover:border-red-500/50 hover:shadow-lg transition-all duration-300"
      >
        <div className="md:col-span-5 h-48 md:h-full rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <img
            src={news.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80'}
            alt={news.title_bn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="md:col-span-7 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400 mb-2">
              <span className="text-red-600 font-bold uppercase tracking-wide">{news.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-gray-700 dark:text-zinc-300">{news.source}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                {formatTime(news.publishedAt || news.createdAt)}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 leading-snug line-clamp-2 mb-2 transition-colors">
              {news.title_bn}
            </h3>
            <p className="text-gray-600 dark:text-zinc-400 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
              {news.description_bn || news.description_en}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-500 pt-3 border-t border-gray-100 dark:border-zinc-800/80 mt-3">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              ভাইরাল স্কোর: {toBnNum(news.viralScore || 90)}%
            </span>
            <span className="flex items-center gap-1 text-gray-500 dark:text-zinc-400">
              <Eye className="w-3.5 h-3.5" />
              {toBnNum(news.views || 450)} বার পঠিত
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Standard Card
  return (
    <article className="group flex flex-col bg-white dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800/80 rounded-xl overflow-hidden hover:border-red-500/60 hover:shadow-xl dark:hover:border-zinc-700 transition-all duration-300 flex-1">
      <Link to={`/news/${news._id}`} className="block relative aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <img
          src={news.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80'}
          alt={news.title_bn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
          {news.category}
        </div>
        {news.viralScore && news.viralScore >= 95 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1 shadow animate-pulse">
            <TrendingUp className="w-3 h-3" />
            টপ ভাইরাল
          </div>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500 mb-2">
            <span className="text-gray-700 dark:text-zinc-300 font-semibold">{news.source}</span>
            <span aria-hidden="true">·</span>
            <span>{formatTime(news.publishedAt || news.createdAt)}</span>
          </div>

          <Link to={`/news/${news._id}`}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 leading-snug line-clamp-2 transition-colors mb-2">
              {news.title_bn}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {news.description_bn || news.description_en}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-500 pt-3 border-t border-gray-100 dark:border-zinc-800/80">
          <span className="text-gray-600 dark:text-zinc-400 font-medium">দেশ: {news.country || 'আন্তর্জাতিক'}</span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-zinc-400">
            <Eye className="w-3.5 h-3.5" />
            {toBnNum(news.views || 320)}
          </span>
        </div>
      </div>
    </article>
  );
};
