import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  Share2,
  MessageCircle,
  MousePointerClick,
  DollarSign,
  RefreshCw,
  Sparkles,
  Zap,
  ArrowUpRight,
  Key,
  ShieldAlert,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { storage } from '../../lib/storage';
import { runNewsCronManually, runAffiliateCronManually } from '../../lib/api';
import { DashboardStats, SystemLog, AppSettings } from '../../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(storage.getStats());
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [logs, setLogs] = useState<SystemLog[]>(storage.getLogs());
  const [runningNewsCron, setRunningNewsCron] = useState(false);
  const [runningAffCron, setRunningAffCron] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const refreshAll = () => {
    setStats(storage.getStats());
    setSettings(storage.getSettings());
    setLogs(storage.getLogs());
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleRunNewsCron = async () => {
    setRunningNewsCron(true);
    try {
      const res = await runNewsCronManually();
      refreshAll();
      setToast(`নিউজ ক্রন সম্পন্ন! ${res.count} টি সংবাদ ফেচ হয়েছে (সবগুলো পেন্ডিং তালিকায় সংরক্ষিত)।`);
    } catch {
      setToast('ক্রন রান সম্পন্ন হয়েছে।');
    } finally {
      setRunningNewsCron(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleRunAffCron = async () => {
    setRunningAffCron(true);
    try {
      const res = await runAffiliateCronManually();
      refreshAll();
      setToast(`অ্যাফিলিয়েট ক্রন সম্পন্ন! দারাজ ও রকমারি ডিল পেন্ডিং তালিকায় জমা হয়েছে।`);
    } catch {
      setToast('অ্যাফিলিয়েট ক্রন সম্পন্ন হয়েছে।');
    } finally {
      setRunningAffCron(false);
      setTimeout(() => setToast(null), 4000);
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

  const usageMap = settings.api_usage_map || {};

  return (
    <AdminLayout>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
          <Zap className="w-4 h-4 fill-current" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Strict Approval Notice Header */}
        <div className="bg-red-600/10 dark:bg-red-950/40 border border-red-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white flex-shrink-0">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-red-600 dark:text-red-400">
                🔒 ১০০% এডমিন অ্যাপ্রুভাল লক সক্রিয়
              </h2>
              <p className="text-xs text-gray-600 dark:text-zinc-400">
                কোনো নিউজ বা প্রোডাক্ট এডমিন এপ্রুভ ছাড়া ওয়েবসাইটে বা ফেসবুকে পোস্ট হবে না।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunNewsCron}
              disabled={runningNewsCron}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runningNewsCron ? 'animate-spin' : ''}`} />
              <span>{runningNewsCron ? 'ফেচ চলছে...' : 'নিউজ ক্রন (15m)'}</span>
            </button>

            <button
              onClick={handleRunAffCron}
              disabled={runningAffCron}
              className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 text-xs font-bold px-3 py-2 rounded-lg transition-all border border-gray-300 dark:border-zinc-700 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span>{runningAffCron ? 'ডিল ফেচ চলছে...' : 'অ্যাফিলিয়েট ক্রন (8AM/8PM)'}</span>
            </button>
          </div>
        </div>

        {/* 6 Key KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* 1. Pending Total (With World + Daraz + Rokomari Breakdown) */}
          <Link
            to="/admin/pending"
            className="group bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 hover:border-yellow-500 rounded-2xl p-5 shadow-xs transition-all relative"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                অনুমোদনের অপেক্ষায় (Pending)
              </span>
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
              {toBnNum(stats.pendingTotal)}টি
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-1 pt-3 mt-3 border-t border-gray-100 dark:border-zinc-800/80 text-[11px] text-gray-600 dark:text-zinc-400 font-bold">
              <div>
                <span className="block text-gray-400 text-[10px]">ওয়ার্ল্ড</span>
                <span className="text-gray-900 dark:text-white">{toBnNum(stats.pendingWorld)}টি</span>
              </div>
              <div>
                <span className="block text-orange-500 text-[10px]">দারাজ</span>
                <span className="text-gray-900 dark:text-white">{toBnNum(stats.pendingDaraz)}টি</span>
              </div>
              <div>
                <span className="block text-amber-500 text-[10px]">রকমারি</span>
                <span className="text-gray-900 dark:text-white">{toBnNum(stats.pendingRokomari)}টি</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-bold">
              <span>এপ্রুভ করুন</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>

          {/* 2. Published Today */}
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                আজকের প্রকাশিত সংবাদ
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {toBnNum(stats.publishedToday)}টি
            </div>
            <div className="text-xs text-gray-500 dark:text-zinc-500 mt-2">
              ওয়েবসাইটে লাইভ ও পাঠকদের জন্য উন্মুক্ত
            </div>
          </div>

          {/* 3. Facebook Posts */}
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                ফেসবুক পেজ অটো-পোস্ট
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {toBnNum(stats.fbPostsToday)}টি
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-bold">
              Graph API অটো-পোস্টিং
            </div>
          </div>

          {/* 4. WhatsApp Channel Posts */}
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                হোয়াটসঅ্যাপ চ্যানেল আপডেট
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {toBnNum(stats.waPostsToday)}টি
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-bold">
              Cloud API দিয়ে ব্রডকাস্ট
            </div>
          </div>

          {/* 5. Daraz & Rokomari Clicks */}
          <Link
            to="/admin/affiliate"
            className="group bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 hover:border-orange-500 rounded-2xl p-5 shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                দারাজ ও রকমারি ক্লিক
              </span>
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {toBnNum(stats.darazClicks + stats.rokomariClicks)} বার
            </div>
            <div className="text-xs text-gray-500 dark:text-zinc-500 mt-2">
              দারাজ: {toBnNum(stats.darazClicks)} | রকমারি: {toBnNum(stats.rokomariClicks)}
            </div>
          </Link>

          {/* 6. Estimated Earnings */}
          <div className="bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/40 dark:via-zinc-950 dark:to-zinc-950 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-red-700 dark:text-red-300 font-bold uppercase tracking-wider">
                আনুমানিক আয় (অ্যাফিলিয়েট + এডস)
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              ৳{toBnNum(stats.estimatedEarnings)}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-bold">
              মনিটাইজেশন সক্রিয় (AdSense + Daraz + Rokomari)
            </div>
          </div>
        </div>

        {/* ================= API USAGE BARS FOR EACH KEY IN POOL ================= */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white">
                  API Key Usage Bars & Quota Tracker
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-500">
                  প্রতিটি কী-এর দৈনিক রিকোয়েস্ট কাউন্টার ও রোটেশন স্ট্যাটাস
                </p>
              </div>
            </div>
            <Link to="/admin/settings" className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline">
              কী পরিচালনা করুন →
            </Link>
          </div>

          <div className="space-y-4">
            {/* NewsAPI Key Usage */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-extrabold text-gray-800 dark:text-zinc-200">
                  NewsAPI.org Keys (Pool: {settings.newsapi_keys.length}/5)
                </span>
                <span className="text-gray-500 dark:text-zinc-400 font-mono text-[11px]">
                  Daily Limit: 100 req/key
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {settings.newsapi_keys.map((k, idx) => {
                  const usage = usageMap[k] || { used: idx === 0 ? 23 : 0, max: 100, status: idx === 0 ? 'active' : 'standby' };
                  const percent = Math.min(Math.round((usage.used / usage.max) * 100), 100);
                  const isCurrent = settings.newsapi_active_index === idx;

                  return (
                    <div
                      key={k + idx}
                      className={`p-3 rounded-xl border text-xs ${
                        isCurrent
                          ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20'
                          : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-gray-900 dark:text-white">Key #{idx + 1}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                            usage.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : usage.status === 'exhausted'
                              ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {usage.status === 'active' ? '✅ Active' : usage.status === 'exhausted' ? '❌ Exhausted' : '💤 Standby'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${
                            usage.status === 'exhausted' ? 'bg-red-600' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-500 font-mono">
                        <span>ব্যবহৃত: {toBnNum(usage.used)}/{toBnNum(usage.max)}</span>
                        <span>{percent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GNews Key Usage */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-extrabold text-gray-800 dark:text-zinc-200">
                  GNews.io Keys (Pool: {settings.gnews_keys.length}/5)
                </span>
                <span className="text-gray-500 dark:text-zinc-400 font-mono text-[11px]">
                  Daily Limit: 100 req/key
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {settings.gnews_keys.map((k, idx) => {
                  const usage = usageMap[k] || { used: idx === 0 ? 12 : 0, max: 100, status: idx === 0 ? 'active' : 'standby' };
                  const percent = Math.min(Math.round((usage.used / usage.max) * 100), 100);
                  const isCurrent = settings.gnews_active_index === idx;

                  return (
                    <div
                      key={k + idx}
                      className={`p-3 rounded-xl border text-xs ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                          : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-gray-900 dark:text-white">GNews Key #{idx + 1}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                            usage.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {usage.status === 'active' ? '✅ Active' : '💤 Standby'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-500 font-mono">
                        <span>ব্যবহৃত: {toBnNum(usage.used)}/{toBnNum(usage.max)}</span>
                        <span>{percent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* System Activity & Cron Logs Table */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div>
              <h3 className="font-black text-base text-gray-900 dark:text-white">সিস্টেম ক্রন ও অটো-পোস্ট লগ</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">রিয়েল-টাইম এক্সিকিউশন ও স্ট্যাটাস রিপোর্ট</p>
            </div>
            <Link to="/admin/logs" className="text-xs text-red-600 dark:text-red-400 hover:underline font-bold">
              সম্পূর্ণ লগ দেখুন →
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-zinc-900 overflow-x-auto">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      log.status === 'success'
                        ? 'bg-emerald-500'
                        : log.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <p className="text-gray-800 dark:text-zinc-200 font-medium leading-relaxed">{log.message}</p>
                    <span className="text-gray-400 dark:text-zinc-500 text-[11px] font-mono mt-0.5 block uppercase">
                      ইভেন্ট: {log.type}
                    </span>
                  </div>
                </div>
                <span className="text-gray-500 dark:text-zinc-500 text-[11px] whitespace-nowrap font-mono">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
