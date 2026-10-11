import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Bell } from 'lucide-react';
import { NewsItem } from '../types';

interface BreakingTickerProps {
  breakingNews: NewsItem[];
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ breakingNews }) => {
  if (!breakingNews || breakingNews.length === 0) return null;

  return (
    <div className="bg-red-600 text-white text-sm font-medium border-b border-red-700 select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-10">
        <div className="flex items-center gap-1.5 bg-black px-3 py-1 font-bold text-xs tracking-wider uppercase flex-shrink-0 rounded-xs">
          <Flame className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span>ব্রেকিং নিউজ</span>
        </div>

        <div className="overflow-hidden relative flex-1 ml-3 h-full flex items-center">
          <div className="animate-ticker whitespace-nowrap flex items-center gap-8 text-xs sm:text-sm">
            {breakingNews.map((item, idx) => (
              <Link
                key={item._id || idx}
                to={`/news/${item._id}`}
                className="hover:underline flex items-center gap-2 transition-colors hover:text-yellow-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300"></span>
                <span>{item.title_bn}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 text-xs text-red-100 flex-shrink-0 pl-3 border-l border-red-500">
          <Bell className="w-3.5 h-3.5" />
          <span>২৪/৭ লাইভ</span>
        </div>
      </div>
    </div>
  );
};
