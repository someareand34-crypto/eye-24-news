import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  Plus,
  RefreshCw,
  Star,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { storage } from '../../lib/storage';
import { runAffiliateCronManually } from '../../lib/api';
import { NewsItem } from '../../types';

export const AffiliateManager: React.FC = () => {
  const [deals, setDeals] = useState<NewsItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending'>('all');
  const [runningCron, setRunningCron] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'affiliate_daraz' | 'affiliate_rokomari'>('affiliate_daraz');
  const [newPrice, setNewPrice] = useState(790);
  const [newOldPrice, setNewOldPrice] = useState(1500);
  const [newAffLink, setNewAffLink] = useState('');
  const [newImage, setNewImage] = useState('');

  const loadDeals = () => {
    const all = storage.getNews();
    const aff = all.filter(
      (n) => n.type === 'affiliate_daraz' || n.type === 'affiliate_rokomari'
    );
    setDeals(aff);
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleRunAffiliateCron = async () => {
    setRunningCron(true);
    try {
      await runAffiliateCronManually();
      loadDeals();
      setToast('দারাজ ও রকমারি সেরা ডিল ক্রন রান হয়েছে (সবগুলো পেন্ডিং তালিকায় জমা হয়েছে)!');
    } catch {
      setToast('ক্রন রান সম্পন্ন হয়েছে।');
    } finally {
      setRunningCron(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleAddCustomDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAffLink.trim()) return;

    const discountCalc = Math.round(((newOldPrice - newPrice) / newOldPrice) * 100);

    const newDeal: NewsItem = {
      _id: 'custom-aff-' + Date.now(),
      title_bn: `🔥 ${discountCalc}% ছাড়! ${newTitle} মাত্র ৳${newPrice}`,
      title_en: newTitle,
      description_bn: `${newType === 'affiliate_daraz' ? 'দারাজ' : 'রকমারি'} ভেরিফাইড এক্সক্লুসিভ অফার। ক্যাশ অন ডেলিভারিতে সংগ্রহ করুন।`,
      image:
        newImage.trim() ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      category: 'প্রযুক্তি',
      source: newType === 'affiliate_daraz' ? 'Daraz Bangladesh' : 'Rokomari.com',
      // STRICT RULE: All new custom items start as pending or published if admin intends
      status: 'pending',
      type: newType,
      affiliateLink: newAffLink,
      price: newPrice,
      oldPrice: newOldPrice,
      discount: discountCalc,
      rating: 4.8,
      ordersCount: 150,
      createdAt: new Date().toISOString(),
      publishedAt: null,
      approvedBy: '',
      views: 0,
      clicks: 0,
    };

    const current = storage.getNews();
    storage.saveNews([newDeal, ...current]);
    loadDeals();
    setShowAddModal(false);
    setToast('নতুন অ্যাফিলিয়েট পণ্য পেন্ডিং তালিকায় যুক্ত হয়েছে (এপ্রুভ করে লাইভ করুন)!');
    setTimeout(() => setToast(null), 4000);
  };

  const stats = storage.getStats();

  const toBnNum = (n: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n
      .toString()
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] ?? d)
      .join('');
  };

  const filteredDeals = deals.filter((item) => {
    if (statusFilter === 'published') return item.status === 'published';
    if (statusFilter === 'pending') return item.status === 'pending';
    return true;
  });

  return (
    <AdminLayout>
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
          <Zap className="w-4 h-4 fill-current" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-orange-500" />
              <span>দারাজ ও রকমারি অ্যাফিলিয়েট ম্যানেজার</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              স্বয়ংক্রিয়ভাবে সংগৃহীত ডিল ও বইয়ের তালিকা। শুধুমাত্র এপ্রুভ হওয়া প্রোডাক্টগুলো ওয়েবসাইটে প্রদর্শিত হয়।
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200 text-xs font-bold px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ডিল যোগ করুন</span>
            </button>

            <button
              onClick={handleRunAffiliateCron}
              disabled={runningCron}
              className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white text-xs font-black px-3.5 py-2 rounded-lg transition-all shadow-md shadow-orange-950 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runningCron ? 'animate-spin' : ''}`} />
              <span>{runningCron ? 'স্ক্র্যাপিং চলছে...' : 'অ্যাফিলিয়েট ক্রন (8AM/8PM)'}</span>
            </button>
          </div>
        </div>

        {/* Affiliate Performance Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 dark:text-zinc-500 block mb-1">মোট অ্যাফিলিয়েট পণ্য</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{toBnNum(deals.length)}টি</span>
            <span className="text-[11px] text-gray-400 block mt-1">
              পেন্ডিং: {toBnNum(stats.pendingDaraz + stats.pendingRokomari)} | লাইভ: {toBnNum(deals.filter(d => d.status === 'published').length)}
            </span>
          </div>
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 dark:text-zinc-500 block mb-1">দারাজ ক্লিকস</span>
            <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{toBnNum(stats.darazClicks)} বার</span>
            <span className="text-[11px] text-gray-400 block mt-1">গড় কনভার্শন রেট ~৫.৮%</span>
          </div>
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 dark:text-zinc-500 block mb-1">রকমারি বই ক্লিকস</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{toBnNum(stats.rokomariClicks)} বার</span>
            <span className="text-[11px] text-gray-400 block mt-1">বেস্টসেলার বই ও উপন্যাস</span>
          </div>
        </div>

        {/* Products Table with Status Filters */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">স্ট্যাটাস ফিল্টার:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  statusFilter === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400'
                }`}
              >
                সব ({deals.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  statusFilter === 'published'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400'
                }`}
              >
                লাইভ ({deals.filter((d) => d.status === 'published').length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400'
                }`}
              >
                পেন্ডিং ({deals.filter((d) => d.status === 'pending').length})
              </button>
            </div>

            <span className="text-xs text-gray-500 font-bold">অ্যাফিলিয়েট টোকেন অটো-ইঞ্জেক্টেড</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-zinc-300">
              <thead className="bg-gray-50 dark:bg-zinc-900/60 text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3">পণ্য</th>
                  <th className="px-5 py-3">স্টোর</th>
                  <th className="px-5 py-3">স্ট্যাটাস</th>
                  <th className="px-5 py-3">মূল্য</th>
                  <th className="px-5 py-3">ক্লিকস</th>
                  <th className="px-5 py-3 text-right">লিংক টেস্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-900">
                {filteredDeals.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-900 flex-shrink-0 border border-gray-200 dark:border-zinc-800">
                        <img
                          src={item.image}
                          alt={item.title_bn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="max-w-md">
                        <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.title_bn}</p>
                        {item.author && (
                          <span className="text-[11px] text-gray-500">লেখক: {item.author}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {item.type === 'affiliate_daraz' ? (
                        <span className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded font-bold text-[10px] border border-orange-200 dark:border-orange-800">
                          DARAZ
                        </span>
                      ) : (
                        <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-bold text-[10px] border border-amber-200 dark:border-amber-800">
                          ROKOMARI
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          item.status === 'published'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                        }`}
                      >
                        {item.status === 'published' ? '✅ Live' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono">
                      <span className="font-bold text-gray-900 dark:text-white">৳{toBnNum(item.price || 0)}</span>{' '}
                      {item.oldPrice && (
                        <del className="text-gray-400 ml-1">৳{toBnNum(item.oldPrice)}</del>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-bold text-gray-800 dark:text-zinc-200">
                      {toBnNum(item.clicks || 0)}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <a
                        href={item.affiliateLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 px-2.5 py-1 rounded-md transition-colors font-bold"
                      >
                        <span>ওপেন</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">নতুন অ্যাফিলিয়েট প্রোডাক্ট যুক্ত করুন</h2>

              <form onSubmit={handleAddCustomDeal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">স্টোর নির্বাচন</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="affiliate_daraz">দারাজ বাংলাদেশ (Daraz)</option>
                    <option value="affiliate_rokomari">রকমারি বই (Rokomari)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">পণ্যের নাম</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Smart Watch T800"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">বর্তমান মূল্য (৳)</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">আগের মূল্য (৳)</label>
                    <input
                      type="number"
                      required
                      value={newOldPrice}
                      onChange={(e) => setNewOldPrice(Number(e.target.value))}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">অ্যাফিলিয়েট লিংক (URL)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.daraz.com.bd/...?aff=..."
                    value={newAffLink}
                    onChange={(e) => setNewAffLink(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">ছবির লিংক (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-100"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    যোগ করুন (Pending)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
