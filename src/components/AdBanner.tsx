import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { storage } from '../lib/storage';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  format = 'horizontal',
  className = '',
}) => {
  const settings = storage.getSettings();
  const clientId = settings.ADSENSE_CLIENT_ID || 'ca-pub-9842104928104812';
  const slotId = slot || settings.ADSENSE_SLOT_1 || '1234567890';

  if (format === 'rectangle') {
    return (
      <aside
        className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-between text-center relative overflow-hidden group shadow-sm transition-colors ${className}`}
        aria-label="বিজ্ঞাপন"
      >
        <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-zinc-500 self-end font-bold">
          বিজ্ঞাপন · AD
        </span>

        <div className="my-3 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 flex items-center justify-center text-red-600 mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">দারাজ ও রকমারি স্পেশাল সেল</h4>
          <p className="text-xs text-gray-600 dark:text-zinc-400 max-w-xs leading-relaxed">
            স্মার্টফোন, গ্যাজেট ও বেস্টসেলার বইয়ে চলছে ৬০% পর্যন্ত বিশাল ছাড়!
          </p>
        </div>

        <a
          href="https://www.daraz.com.bd"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <span>অফার দেখুন</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="hidden" data-ad-client={clientId} data-ad-slot={slotId} />
      </aside>
    );
  }

  // Horizontal Leaderboard Banner
  return (
    <aside
      className={`my-8 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-xs transition-colors ${className}`}
      aria-label="বিজ্ঞাপন"
    >
      <div className="absolute top-1.5 right-3 text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
        বিজ্ঞাপন / SPONSORED
      </div>

      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center text-white flex-shrink-0 font-extrabold text-lg shadow-sm">
          Eye24
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              সীমিত সময়ের ধামাকা ডিল! দারাজে ৫০%+ ছাড়
            </h4>
            <span className="hidden sm:inline bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800">
              হট ডিল
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
            অরিজিনাল ইলেকট্রনিক্স ও লাইফস্টাইল পণ্য ক্যাশ অন ডেলিভারিতে অর্ডার করুন সরাসরি।
          </p>
        </div>
      </div>

      <a
        href="https://www.daraz.com.bd"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all flex-shrink-0 shadow-sm cursor-pointer"
      >
        <span>এখনই কিনুন</span>
        <ExternalLink className="w-4 h-4" />
      </a>

      <div className="hidden" data-ad-client={clientId} data-ad-slot={slotId} />
    </aside>
  );
};
