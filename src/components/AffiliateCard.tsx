import React from 'react';
import { ShoppingCart, Star, ExternalLink, BookOpen, Tag } from 'lucide-react';
import { NewsItem } from '../types';
import { storage } from '../lib/storage';

interface AffiliateCardProps {
  product: NewsItem;
  className?: string;
}

export const AffiliateCard: React.FC<AffiliateCardProps> = ({ product, className = '' }) => {
  const isRokomari = product.type === 'affiliate_rokomari';
  const isDaraz = product.type === 'affiliate_daraz';

  const handleClick = () => {
    if (isDaraz) {
      storage.incrementClick('daraz');
    } else if (isRokomari) {
      storage.incrementClick('rokomari');
    }
  };

  const toBnNum = (n?: number) => {
    if (n === undefined || n === null) return '';
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n
      .toString()
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] ?? d)
      .join('');
  };

  const discount = product.discount || (product.oldPrice && product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 40);

  return (
    <div
      className={`group flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-red-600/70 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Product Image Container with Badges */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-950 p-3 flex items-center justify-center">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80'}
          alt={product.title_bn}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Discount Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="bg-red-600 text-white font-black text-[11px] px-2 py-0.5 rounded shadow">
            {toBnNum(discount)}% ছাড়!
          </span>
        </div>

        {/* Store Indicator Badge */}
        <div className="absolute top-2 right-2">
          {isRokomari ? (
            <span className="bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow">
              <BookOpen className="w-3 h-3" />
              রকমারি
            </span>
          ) : (
            <span className="bg-orange-600 text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow">
              <Tag className="w-3 h-3" />
              দারাজ
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating & Orders */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 mb-1.5">
            <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-gray-800 dark:text-zinc-200">{toBnNum(product.rating || 4.8)}</span>
            </div>
            {product.ordersCount ? (
              <span className="text-[11px] text-gray-400 dark:text-zinc-500">
                {toBnNum(product.ordersCount)}+ অর্ডার
              </span>
            ) : null}
          </div>

          {/* Title 2 lines max */}
          <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100 group-hover:text-red-600 line-clamp-2 leading-snug mb-2 transition-colors">
            {product.title_bn}
          </h4>

          {/* Author if Rokomari */}
          {product.author && (
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2 truncate font-medium">লেখক: {product.author}</p>
          )}
        </div>

        <div>
          {/* Price & Discount Section */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              ৳{toBnNum(product.price || 490)}
            </span>
            {product.oldPrice && (
              <del className="text-xs text-gray-400 dark:text-zinc-500 line-through">
                ৳{toBnNum(product.oldPrice)}
              </del>
            )}
            <span className="text-xs text-red-600 dark:text-red-400 font-bold">
              -{toBnNum(discount)}%
            </span>
          </div>

          {/* Buy Button (Opens affiliate link in new tab) */}
          <a
            href={product.affiliateLink || 'https://www.daraz.com.bd'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs sm:text-sm py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/20 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>🛒 কিনুন</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
};
