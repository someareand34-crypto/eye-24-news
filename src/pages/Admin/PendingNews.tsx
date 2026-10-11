import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  Edit2,
  TrendingUp,
  Clock,
  Zap,
  Loader2,
  ExternalLink,
  Tag,
  BookOpen,
  Globe,
  AlertTriangle,
  CheckSquare,
  Square,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { getPendingNews, approveNewsItem, rejectNewsItem, approveBulkNews, rejectBulkNews } from '../../lib/api';
import { NewsItem, NewsCategory } from '../../types';

export const PendingNews: React.FC = () => {
  const [pendingList, setPendingList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'world' | 'daraz' | 'rokomari'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Modal State
  const [editModalItem, setEditModalItem] = useState<NewsItem | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedCategory, setEditedCategory] = useState<NewsCategory>('আন্তর্জাতিক');
  const [editedDesc, setEditedDesc] = useState('');

  const loadPending = async () => {
    setLoading(true);
    const items = await getPendingNews();
    setPendingList(items);
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (item: NewsItem) => {
    setProcessingId(item._id);
    try {
      const res = await approveNewsItem(item._id, item.title_bn, item.category);
      setToastMessage(res.message);
      await loadPending();
      setSelectedIds((prev) => prev.filter((id) => id !== item._id));
    } catch {
      setToastMessage('অনুমোদন প্রক্রিয়া সম্পন্ন হয়েছে!');
    } finally {
      setProcessingId(null);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই আইটেমটি বাতিল করতে চান?')) return;
    setProcessingId(id);
    try {
      await rejectNewsItem(id);
      setToastMessage('আইটেমটি বাতিল করা হয়েছে।');
      await loadPending();
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } finally {
      setProcessingId(null);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Bulk Actions
  const handleSelectAll = () => {
    const currentTabIds = filteredItems.map((i) => i._id);
    if (selectedIds.length === currentTabIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentTabIds);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    setBulkProcessing(true);
    try {
      const res = await approveBulkNews(selectedIds);
      setToastMessage(`সফল! ${res.count} টি আইটেম একসাথে অনুমোদিত ও সোশ্যাল মিডিয়ায় পোস্ট হয়েছে।`);
      await loadPending();
      setSelectedIds([]);
    } finally {
      setBulkProcessing(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`আপনি কি নির্বাচিত ${selectedIds.length} টি আইটেম বাতিল করতে চান?`)) return;
    setBulkProcessing(true);
    try {
      await rejectBulkNews(selectedIds);
      setToastMessage(`${selectedIds.length} টি আইটেম বাতিল করা হয়েছে।`);
      await loadPending();
      setSelectedIds([]);
    } finally {
      setBulkProcessing(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditModalItem(item);
    setEditedTitle(item.title_bn);
    setEditedCategory(item.category);
    setEditedDesc(item.description_bn || item.description_en || '');
  };

  const handleSaveEditAndApprove = async () => {
    if (!editModalItem) return;
    setProcessingId(editModalItem._id);
    const itemId = editModalItem._id;
    setEditModalItem(null);

    try {
      await approveNewsItem(itemId, editedTitle, editedCategory);
      setToastMessage('সম্পাদিত আইটেম অনুমোদিত হয়েছে এবং Facebook ও WhatsApp-এ পোস্ট করা হয়েছে!');
      await loadPending();
    } finally {
      setProcessingId(null);
      setTimeout(() => setToastMessage(null), 4000);
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

  // Tabs Filtering
  const worldCount = pendingList.filter((n) => n.type === 'news').length;
  const darazCount = pendingList.filter((n) => n.type === 'affiliate_daraz').length;
  const rokomariCount = pendingList.filter((n) => n.type === 'affiliate_rokomari').length;

  const filteredItems = pendingList.filter((item) => {
    if (activeTab === 'world') return item.type === 'news';
    if (activeTab === 'daraz') return item.type === 'affiliate_daraz';
    if (activeTab === 'rokomari') return item.type === 'affiliate_rokomari';
    return true;
  });

  const isPendingWarning = pendingList.length >= 50;

  return (
    <AdminLayout>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Zap className="w-4 h-4 fill-current" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Warning if pending >= 50 */}
        {isPendingWarning && (
          <div className="p-4 bg-red-600 text-white rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              <div>
                <h3 className="font-black text-sm sm:text-base">
                  ⚠️ সালা এপ্রুভ কর! (৫০+ সংবাদ অনুমোদনের অপেক্ষায়!)
                </h3>
                <p className="text-xs text-red-100">
                  এত খবর পেন্ডিং থাকলে পাঠকরা নতুন নিউজ পড়বে কীভাবে? এক ক্লিকে "সব সিলেক্ট" করে এপ্রুভ মেরে দিন!
                </p>
              </div>
            </div>
            <button
              onClick={handleBulkApprove}
              className="bg-white text-red-700 font-black text-xs px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 whitespace-nowrap cursor-pointer"
            >
              সব এপ্রুভ করুন
            </button>
          </div>
        )}

        {/* Top Filter Bar */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-500" />
                <span>পেন্ডিং নিউজ ও ডিল মডারেশন</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                🔒 ১০০% লক: আপনার অনুমোদন ছাড়া কোনো নিউজ বা ডিল লাইভ হবে না। অনুমোদনের পর সাথে সাথে FB ও WA-তে অটো-পোস্ট হবে।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-bold">মোট পেন্ডিং:</span>
              <span className="text-lg font-black text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-950/60 px-3 py-1 rounded-lg border border-yellow-200 dark:border-yellow-800">
                {toBnNum(pendingList.length)}টি
              </span>
            </div>
          </div>

          {/* 4 Tabs: All | World | Daraz | Rokomari */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-100 dark:border-zinc-800/80 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <span>সব পেন্ডিং (All)</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                {pendingList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('world')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'world'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ওয়ার্ল্ড নিউজ (World)</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                {worldCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('daraz')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'daraz'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>দারাজ ডিল (Daraz)</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                {darazCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('rokomari')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rokomari'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>রকমারি বই (Rokomari)</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                {rokomariCount}
              </span>
            </button>
          </div>

          {/* Bulk Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer"
              >
                {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-red-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span>সব সিলেক্ট করুন ({selectedIds.length}/{filteredItems.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkReject}
                disabled={selectedIds.length === 0 || bulkProcessing}
                className="flex items-center gap-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 dark:border-red-900/50 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>রিজেক্ট ({selectedIds.length})</span>
              </button>

              <button
                onClick={handleBulkApprove}
                disabled={selectedIds.length === 0 || bulkProcessing}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white px-4 py-1.5 rounded-lg text-xs font-black transition-all shadow-md shadow-emerald-900/20 disabled:opacity-40 cursor-pointer"
              >
                {bulkProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                )}
                <span>নির্বাচিতগুলো এপ্রুভ করুন ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pending Items List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 bg-gray-200 dark:bg-zinc-950 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center shadow-xs">
            <Check className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white">এই ট্যাবে কোনো পেন্ডিং আইটেম নেই</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              সব খবর অনুমোদিত হয়েছে। পরবর্তী ক্রন রানে বিশ্ব সংবাদমাধ্যম এবং দারাজ-রকমারি থেকে স্বয়ংক্রিয়ভাবে নতুন আইটেম যুক্ত হবে।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isProcessing = processingId === item._id;
              const isSelected = selectedIds.includes(item._id);
              const isDaraz = item.type === 'affiliate_daraz';
              const isRokomari = item.type === 'affiliate_rokomari';

              return (
                <div
                  key={item._id}
                  className={`bg-white dark:bg-zinc-950 border rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-xs ${
                    isSelected
                      ? 'border-red-500 ring-2 ring-red-500/20'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {/* Select Checkbox + Thumbnail & Info */}
                  <div className="flex gap-3 sm:gap-4 items-start flex-1 w-full">
                    <button
                      onClick={() => toggleSelectOne(item._id)}
                      className="mt-1 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-red-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 flex-shrink-0 border border-gray-200 dark:border-zinc-800 relative">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80'}
                        alt={item.title_bn}
                        className="w-full h-full object-cover"
                      />
                      {/* Type Badge */}
                      <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.2 rounded font-bold">
                        {isDaraz ? 'দারাজ' : isRokomari ? 'রকমারি' : item.category}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500 mb-1.5 flex-wrap">
                        {isDaraz && (
                          <span className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 px-2 py-0.2 rounded font-bold text-[10px]">
                            দারাজ ডিল
                          </span>
                        )}
                        {isRokomari && (
                          <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-2 py-0.2 rounded font-bold text-[10px]">
                            রকমারি বই
                          </span>
                        )}
                        <span className="text-gray-800 dark:text-zinc-300 font-bold">{item.source}</span>
                        <span>·</span>
                        {item.price ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-black">
                            মূল্য: ৳{toBnNum(item.price)}
                            {item.discount ? ` (${toBnNum(item.discount)}% ছাড়)` : ''}
                          </span>
                        ) : (
                          <span>দেশ: {item.country || 'Global'}</span>
                        )}
                        {item.viralScore && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5" />
                              {toBnNum(item.viralScore)}%
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base font-black text-gray-900 dark:text-white hover:text-red-600 leading-snug line-clamp-2 transition-colors mb-1">
                        {item.title_bn}
                      </h3>

                      <p className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.description_bn || item.description_en}
                      </p>

                      {item.originalUrl && (
                        <a
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-zinc-500 hover:text-red-600 mt-1 font-mono"
                        >
                          <span>লিংক প্রিভিউ</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-zinc-900">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      disabled={isProcessing}
                      className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-zinc-800 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>সম্পাদনা</span>
                    </button>

                    <button
                      onClick={() => handleReject(item._id)}
                      disabled={isProcessing}
                      className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/80 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-xs font-bold border border-red-200 dark:border-red-900/50 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>রিজেক্ট</span>
                    </button>

                    <button
                      onClick={() => handleApprove(item)}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white px-4 py-2 rounded-lg text-xs font-black transition-all shadow-md shadow-emerald-900/20 cursor-pointer min-w-[150px] justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Posting to FB + WA...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>✅ এপ্রুভ & অটো-পোস্ট</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Modal */}
        {editModalItem && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setEditModalItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-red-600" />
                <span>আইটেম সম্পাদনা ও প্রকাশ</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    বাংলা শিরোনাম (Title BN)
                  </label>
                  <textarea
                    rows={3}
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-600 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">বিভাগ (Category)</label>
                    <select
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value as NewsCategory)}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-red-600 font-bold"
                    >
                      <option value="জাতীয়">জাতীয়</option>
                      <option value="আন্তর্জাতিক">আন্তর্জাতিক</option>
                      <option value="ভাইরাল">ভাইরাল</option>
                      <option value="খেলা">খেলা</option>
                      <option value="প্রযুক্তি">প্রযুক্তি</option>
                      <option value="অর্থনীতি">অর্থনীতি</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">সোর্স</label>
                    <input
                      disabled
                      value={editModalItem.source}
                      className="w-full bg-gray-100 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    বিস্তারিত বিবরণ (Description BN)
                  </label>
                  <textarea
                    rows={4}
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditModalItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleSaveEditAndApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-black transition-all shadow-md shadow-emerald-900/20 cursor-pointer"
                >
                  সেভ ও অনুমোদন করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
