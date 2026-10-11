import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Shield, Heart, Radio, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-zinc-400 border-t border-gray-800 dark:border-zinc-800 pt-12 pb-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-red-600 rounded flex items-center justify-center text-white">
                <Eye className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black text-white">Eye <span className="text-red-600">24</span></span>
            </Link>
            <p className="text-xs text-gray-400 dark:text-zinc-400 leading-relaxed mb-4">
              আই ২৪ (Eye 24) একটি পূর্ণাঙ্গ স্বয়ংক্রিয় আন্তর্জাতিক নিউজ পোর্টাল। প্রতি ১৫ মিনিটে বিশ্বসেরা সংবাদমাধ্যম থেকে ভাইরাল সংবাদ সংগৃহীত হয় এবং ১০০% এডমিন অনুমোদনের পর সরাসরি ওয়েবসাইট ও সোশ্যাল মিডিয়ায় প্রচার করা হয়।
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>১০০% এডমিন অ্যাপ্রুভাল লক সক্রিয়</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              সংবাদ বিভাগ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/জাতীয়" className="hover:text-red-400 transition-colors">জাতীয় সংবাদ</Link>
              </li>
              <li>
                <Link to="/category/আন্তর্জাতিক" className="hover:text-red-400 transition-colors">আন্তর্জাতিক বিশ্ব</Link>
              </li>
              <li>
                <Link to="/category/ভাইরাল" className="hover:text-red-400 transition-colors">সোশ্যাল ভাইরাল</Link>
              </li>
              <li>
                <Link to="/category/খেলা" className="hover:text-red-400 transition-colors">খেলাধুলা ও ক্রিকেট</Link>
              </li>
              <li>
                <Link to="/category/প্রযুক্তি" className="hover:text-red-400 transition-colors">বিজ্ঞান ও প্রযুক্তি</Link>
              </li>
              <li>
                <Link to="/category/অর্থনীতি" className="hover:text-red-400 transition-colors">ব্যবসা ও বাণিজ্য</Link>
              </li>
            </ul>
          </div>

          {/* Monetization & Affiliates */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              মনিটাইজেশন ও ডিল
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/deals" className="text-yellow-400 hover:underline flex items-center gap-1 font-bold">
                  🔥 আজকের সেরা ডিল (দারাজ + রকমারি)
                </Link>
              </li>
              <li>
                <a href="https://www.daraz.com.bd" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>দারাজ বাংলাদেশ অনলাইন শপ</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="https://www.rokomari.com" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>রকমারি ডট কম বেস্টসেলার বই</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <span className="text-[11px] text-gray-400 dark:text-zinc-500 block mt-2">
                  আই ২৪-এ প্রদর্শিত পণ্যের লিংকে ক্লিক করে কেনাকাটায় আমরা কমিশন পেয়ে থাকি।
                </span>
              </li>
            </ul>
          </div>

          {/* Admin & Portal System */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              সিস্টেম ও অটোমেশন
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin" className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>এডমিন কন্ট্রোল সেন্টার</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/pending" className="hover:text-white">পেন্ডিং নিউজ মডারেশন</Link>
              </li>
              <li>
                <Link to="/admin/settings" className="hover:text-white">API কি রোটেশন সেটিংস</Link>
              </li>
              <li>
                <Link to="/admin/affiliate" className="hover:text-white">দারাজ ও রকমারি সেলস ট্র্যাকিং</Link>
              </li>
              <li>
                <Link to="/admin/logs" className="hover:text-white">সিস্টেম ক্রন লগ</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-gray-800 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 dark:text-zinc-500 gap-3">
          <div>
            © {new Date().getFullYear()} Eye 24 (eye24.vercel.app). সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by 5x API Key Rotator & Next-Gen AI</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
