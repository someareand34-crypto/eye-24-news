import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Flame } from 'lucide-react';
import { NewsItem } from '../types';

interface HeroSliderProps {
  heroNews: NewsItem[];
  sideNews?: NewsItem[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ heroNews, sideNews = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!heroNews || heroNews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroNews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroNews]);

  if (!heroNews || heroNews.length === 0) return null;

  const current = heroNews[currentIndex];

  const toBnNum = (n: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n
      .toString()
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] ?? d)
      .join('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
      {/* Main Hero Slider (8 cols) */}
      <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-black border border-gray-200 dark:border-zinc-800 shadow-xl group aspect-[16/10] sm:aspect-[16/9]">
        <img
          src={current.image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'}
          alt={current.title_bn}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
            <Flame className="w-3.5 h-3.5" />
            প্রধান শিরোনাম
          </span>
          <span className="bg-black/70 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-semibold">
            {current.category}
          </span>
        </div>

        {/* Content Box */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-xs text-zinc-300 mb-2">
            <span>{current.source}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-400" />
              আজকের আলোচিত
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              ভাইরাল স্কোর: {toBnNum(current.viralScore || 95)}%
            </span>
          </div>

          <Link to={`/news/${current._id}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white hover:text-red-400 transition-colors leading-tight line-clamp-2 sm:line-clamp-3 mb-3">
              {current.title_bn}
            </h2>
          </Link>

          <p className="hidden sm:block text-zinc-300 text-sm line-clamp-2 max-w-2xl leading-relaxed mb-4">
            {current.description_bn || current.description_en}
          </p>

          <div className="flex items-center justify-between">
            <Link
              to={`/news/${current._id}`}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-red-950"
            >
              পুরো খবর পড়ুন →
            </Link>

            {/* Slider Dots */}
            <div className="flex items-center gap-1.5">
              {heroNews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-red-600' : 'w-2 bg-zinc-500 hover:bg-zinc-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + heroNews.length) % heroNews.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % heroNews.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Side Trending Headlines (4 cols) */}
      <div className="lg:col-span-4 flex flex-col justify-between bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">সর্বশেষ ট্রেন্ডিং</h3>
          </div>
          <span className="text-xs text-red-600 dark:text-red-400 font-bold">লাইভ আপডেট</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-zinc-800/80 my-2">
          {sideNews.slice(0, 3).map((item, idx) => (
            <Link
              key={item._id || idx}
              to={`/news/${item._id}`}
              className="group py-3 block hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500 mb-1">
                <span className="text-red-600 dark:text-red-500 font-bold">{item.category}</span>
                <span>·</span>
                <span className="font-medium text-gray-700 dark:text-zinc-300">{item.source}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-zinc-200 group-hover:text-red-600 leading-snug line-clamp-2">
                {item.title_bn}
              </h4>
            </Link>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
          <span>গ্লোবাল এআই নিউজ এগ্রিগেটর</span>
          <span className="text-gray-400 dark:text-zinc-500 font-mono">15m refresh</span>
        </div>
      </div>
    </div>
  );
};
