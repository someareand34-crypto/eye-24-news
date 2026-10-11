import React, { useState, useEffect } from 'react';
import {
  Key,
  Globe,
  Share2,
  DollarSign,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Play,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { getSettings, saveAppSettings, testKey } from '../../lib/api';
import { AppSettings, KeyUsageInfo } from '../../types';
import { DEFAULT_SETTINGS } from '../../lib/storage';

export const Settings: React.FC = () => {
  const [form, setForm] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    getSettings().then((s) => {
      setForm({
        ...DEFAULT_SETTINGS,
        ...s,
        newsapi_keys: s.newsapi_keys?.length ? s.newsapi_keys : DEFAULT_SETTINGS.newsapi_keys,
        gnews_keys: s.gnews_keys?.length ? s.gnews_keys : DEFAULT_SETTINGS.gnews_keys,
        currents_keys: s.currents_keys || [],
        mediastack_keys: s.mediastack_keys || [],
      });
    });
  }, []);

  const handleChange = (field: keyof AppSettings, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Key Array Handlers (Up to 5)
  const handleKeyArrayChange = (
    field: 'newsapi_keys' | 'gnews_keys' | 'currents_keys' | 'mediastack_keys',
    index: number,
    val: string
  ) => {
    setForm((prev) => {
      const arr = [...(prev[field] || [])];
      arr[index] = val;
      return { ...prev, [field]: arr };
    });
  };

  const handleAddKey = (
    field: 'newsapi_keys' | 'gnews_keys' | 'currents_keys' | 'mediastack_keys'
  ) => {
    setForm((prev) => {
      const current = prev[field] || [];
      if (current.length >= 5) return prev;
      return { ...prev, [field]: [...current, ''] };
    });
  };

  const handleRemoveKey = (
    field: 'newsapi_keys' | 'gnews_keys' | 'currents_keys' | 'mediastack_keys',
    index: number
  ) => {
    setForm((prev) => {
      const current = [...(prev[field] || [])];
      current.splice(index, 1);
      return { ...prev, [field]: current };
    });
  };

  // Test individual Key
  const handleTestKey = async (
    service: any,
    keyVal: string,
    keyIdentifier: string,
    extra: Record<string, string> = {}
  ) => {
    if (!keyVal || !keyVal.trim()) {
      setToast({ type: 'error', message: 'কী খালি রাখা যাবে না।' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setTestingKeyId(keyIdentifier);
    try {
      const res = await testKey(service, keyVal, extra);
      if (res.success) {
        setToast({ type: 'success', message: `✅ ভেরিফাইড: ${res.message}` });
        // Update usage map status
        setForm((prev) => {
          const map = { ...(prev.api_usage_map || {}) };
          map[keyVal] = {
            key: keyVal,
            service,
            used: map[keyVal]?.used || 0,
            max: 100,
            status: 'active',
            lastTested: 'এখনই ভেরিফাইড',
          };
          return { ...prev, api_usage_map: map };
        });
      } else {
        setToast({ type: 'error', message: `❌ টেস্ট ব্যর্থ: ${res.message}` });
      }
    } catch (err: any) {
      setToast({ type: 'error', message: `টেস্ট এরর: ${err.message}` });
    } finally {
      setTestingKeyId(null);
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAppSettings(form);
      setToast({
        type: 'success',
        message: 'সব সেটিংস এবং ৫x কী রোটেশন কনফিগারেশন সফলভাবে ডাটাবেসে সেভ হয়েছে!',
      });
    } catch (err: any) {
      setToast({
        type: 'error',
        message: err.message || 'সেটিংস সেভ করতে সমস্যা হয়েছে',
      });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const usageMap = form.api_usage_map || {};

  // Total daily usage calculation for NewsAPI
  const newsapiTotalUsed = (form.newsapi_keys || []).reduce((acc, k) => {
    return acc + (usageMap[k]?.used || 0);
  }, 0);
  const newsapiTotalMax = (form.newsapi_keys || []).length * 100;

  return (
    <AdminLayout>
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Key className="w-6 h-6 text-red-600" />
              <span>সিস্টেম সেটিংস & মাল্টি-কী রোটেশন (3/4/5x)</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              একটি কী শেষ হলে সিস্টেম স্বয়ংক্রিয়ভাবে পরবর্তী কী-তে সুইচ করবে। মোট ৫০০+ রিকোয়েস্ট/দিন বিনামূল্যে হ্যান্ডেল করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1.5 rounded-lg font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>MongoDB Atlas সিঙ্ক প্রস্তুত</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= SECTION A: NewsAPI.org (Up to 5 Keys) ================= */}
          <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 mb-5 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-600/20 text-red-600 flex items-center justify-center font-black text-sm">
                  A
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900 dark:text-white">
                    Section A - NewsAPI.org (১০০ req/day প্রতিটি) - সর্বোচ্চ ৫টি কী
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">
                    ফ্রী রেজিস্ট্রেশন লিংক:{' '}
                    <a
                      href="https://newsapi.org/register"
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-600 hover:underline font-bold inline-flex items-center gap-1"
                    >
                      newsapi.org/register <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              {/* Add Key Button */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500 font-bold">
                  {form.newsapi_keys.length}/5 কী যুক্ত
                </span>
                <button
                  type="button"
                  onClick={() => handleAddKey('newsapi_keys')}
                  disabled={form.newsapi_keys.length >= 5}
                  className="bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>[+ Add Key]</span>
                </button>
              </div>
            </div>

            {/* Total usage bar */}
            <div className="mb-5 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                <span>আজকের মোট ব্যবহার (Total Daily Pool):</span>
                <span className="font-mono text-red-600 dark:text-red-400">
                  Today {newsapiTotalUsed}/{newsapiTotalMax} req
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      Math.round((newsapiTotalUsed / (newsapiTotalMax || 1)) * 100),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Keys Input List */}
            <div className="space-y-3">
              {form.newsapi_keys.map((k, idx) => {
                const usage = usageMap[k] || {
                  used: idx === 0 ? 23 : 0,
                  max: 100,
                  status: idx === 0 ? 'active' : 'standby',
                };
                const isTesting = testingKeyId === `newsapi_${idx}`;

                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-2 min-w-[130px]">
                      <span className="text-xs font-black text-gray-700 dark:text-zinc-300 font-mono">
                        NEWSAPI_KEY_{idx + 1}:
                      </span>
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-black whitespace-nowrap ${
                          usage.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : usage.status === 'exhausted'
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                        }`}
                      >
                        {usage.status === 'active'
                          ? '✅ Active'
                          : usage.status === 'exhausted'
                          ? '❌ Exhausted'
                          : '💤 Standby'}
                      </span>
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={`Paste NewsAPI Key #${idx + 1}`}
                        value={k}
                        onChange={(e) => handleKeyArrayChange('newsapi_keys', idx, e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Counter */}
                    <div className="text-[11px] font-mono text-gray-500 dark:text-zinc-400 whitespace-nowrap px-1">
                      ({usage.used}/{usage.max})
                    </div>

                    {/* Test & Delete Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTestKey('newsapi', k, `newsapi_${idx}`)}
                        disabled={isTesting}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        <span>Test</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveKey('newsapi_keys', idx)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================= SECTION B: GNews.io (Up to 5 Keys) ================= */}
          <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 mb-5 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-600/20 text-blue-600 flex items-center justify-center font-black text-sm">
                  B
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900 dark:text-white">
                    Section B - GNews.io Keys (১০০ req/day) - সর্বোচ্চ ৫টি কী
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">
                    ফ্রী রেজিস্ট্রেশন:{' '}
                    <a
                      href="https://gnews.io/register"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1"
                    >
                      gnews.io/register <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500 font-bold">
                  {form.gnews_keys.length}/5 কী
                </span>
                <button
                  type="button"
                  onClick={() => handleAddKey('gnews_keys')}
                  disabled={form.gnews_keys.length >= 5}
                  className="bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>[+ Add Key]</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {form.gnews_keys.map((k, idx) => {
                const usage = usageMap[k] || {
                  used: idx === 0 ? 12 : 0,
                  max: 100,
                  status: idx === 0 ? 'active' : 'standby',
                };
                const isTesting = testingKeyId === `gnews_${idx}`;

                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-2 min-w-[130px]">
                      <span className="text-xs font-black text-gray-700 dark:text-zinc-300 font-mono">
                        GNEWS_KEY_{idx + 1}:
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-black ${
                          usage.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                        }`}
                      >
                        {usage.status === 'active' ? '✅ Active' : '💤 Standby'}
                      </span>
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={`GNews API Token #${idx + 1}`}
                        value={k}
                        onChange={(e) => handleKeyArrayChange('gnews_keys', idx, e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="text-[11px] font-mono text-gray-500 dark:text-zinc-400 whitespace-nowrap px-1">
                      ({usage.used}/{usage.max})
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTestKey('gnews', k, `gnews_${idx}`)}
                        disabled={isTesting}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 text-gray-800 dark:text-zinc-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        <span>Test</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveKey('gnews_keys', idx)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================= SECTION C: Currents & Mediastack Backup ================= */}
          <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-zinc-800 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-600/20 text-purple-600 flex items-center justify-center font-black text-sm">
                C
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white">
                  Section C - Currents & Mediastack Backup Keys (Up to 5 each)
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-500">
                  অতিরিক্ত ব্যাকআপ নিউজ এপিআই এবং আরএসএস ফিড
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                    CURRENTS_KEY_1..5 (currentsapi.services)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddKey('currents_keys')}
                    disabled={form.currents_keys.length >= 5}
                    className="text-[11px] font-bold text-red-600 hover:underline"
                  >
                    + Add Currents Key ({form.currents_keys.length}/5)
                  </button>
                </div>
                {form.currents_keys.map((k, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Currents API Key #${idx + 1}`}
                      value={k}
                      onChange={(e) => handleKeyArrayChange('currents_keys', idx, e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveKey('currents_keys', idx)}
                      className="text-red-500 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  RSS_FEEDS (কমা দিয়ে একাধিক RSS ফিড)
                </label>
                <textarea
                  rows={2}
                  value={form.RSS_FEEDS}
                  onChange={(e) => handleChange('RSS_FEEDS', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          </section>

          {/* ================= SECTION D: Translation ================= */}
          <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-zinc-800 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 flex items-center justify-center font-black text-sm">
                D
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white">
                  Section D - Translation (স্বয়ংক্রিয় বাংলা রূপান্তর)
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-500">
                  Google Translate API (optional) + MyMemory Free Fallback
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    GOOGLE_TRANSLATE_API_KEY (ঐচ্ছিক)
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={form.GOOGLE_TRANSLATE_API_KEY}
                    onChange={(e) => handleChange('GOOGLE_TRANSLATE_API_KEY', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-mono"
                  />
                  <span className="text-[11px] text-gray-500 dark:text-zinc-500 mt-1 block">
                    খালি থাকলে স্বয়ংক্রিয়ভাবে ফ্রী MyMemory API (api.mymemory.translated.net) ব্যবহৃত হবে।
                  </span>
                </div>
                <div className="self-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleTestKey('google_translate', form.GOOGLE_TRANSLATE_API_KEY, 'g_trans')
                    }
                    className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 text-xs font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Translate</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">AUTO_TRANSLATE (বাংলা অনুবাদ)</h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                    ইংরেজি হেডলাইন ও সারাংশ স্বয়ংক্রিয়ভাবে বাংলায় রূপান্তরিত হবে
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.AUTO_TRANSLATE}
                    onChange={(e) => handleChange('AUTO_TRANSLATE', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* ================= SECTION E: Auto Social Posting ================= */}
          <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-zinc-800 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-600/20 text-blue-600 flex items-center justify-center font-black text-sm">
                E
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white">
                  Section E - Social Auto Posting (পোস্ট হবে শুধুমাত্র এপ্রুভালের পর)
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-500">
                  Facebook Page Graph API ও WhatsApp Cloud API ইন্টিগ্রেশন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  FACEBOOK_PAGE_ACCESS_TOKEN
                </label>
                <input
                  type="password"
                  placeholder="EAABw..."
                  value={form.FACEBOOK_PAGE_ACCESS_TOKEN}
                  onChange={(e) => handleChange('FACEBOOK_PAGE_ACCESS_TOKEN', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  FACEBOOK_PAGE_ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="104829104812"
                    value={form.FACEBOOK_PAGE_ID}
                    onChange={(e) => handleChange('FACEBOOK_PAGE_ID', e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleTestKey('facebook', form.FACEBOOK_PAGE_ACCESS_TOKEN, 'fb_test', {
                        pageId: form.FACEBOOK_PAGE_ID,
                      })
                    }
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
                  >
                    Test FB
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  WHATSAPP_ACCESS_TOKEN
                </label>
                <input
                  type="password"
                  placeholder="EAAG..."
                  value={form.WHATSAPP_ACCESS_TOKEN}
                  onChange={(e) => handleChange('WHATSAPP_ACCESS_TOKEN', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  WHATSAPP_PHONE_NUMBER_ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="10928472910"
                    value={form.WHATSAPP_PHONE_NUMBER_ID}
                    onChange={(e) => handleChange('WHATSAPP_PHONE_NUMBER_ID', e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleTestKey('whatsapp', form.WHATSAPP_ACCESS_TOKEN, 'wa_test', {
                        phoneId: form.WHATSAPP_PHONE_NUMBER_ID,
                      })
                    }
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
                  >
                    Test WA
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  WHATSAPP_CHANNEL_IDS (হোয়াটসঅ্যাপ চ্যানেল বা গ্রুপ আইডি)
                </label>
                <textarea
                  rows={2}
                  placeholder="120363028472910@newsletter"
                  value={form.WHATSAPP_CHANNEL_IDS}
                  onChange={(e) => handleChange('WHATSAPP_CHANNEL_IDS', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </section>

          {/* ================= SECTION F: Monetization ================= */}
          <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-zinc-800 mb-5">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-black text-sm">
                F
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white">
                  Section F - Monetization (ইনকাম ও কমিশন সেটিংস)
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-500">
                  Google AdSense, Adsterra, দারাজ ও রকমারি অ্যাফিলিয়েট ট্র্যাকিং
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  ADSENSE_CLIENT_ID (ca-pub-xxxxxxxx)
                </label>
                <input
                  type="text"
                  placeholder="ca-pub-9842104928104812"
                  value={form.ADSENSE_CLIENT_ID}
                  onChange={(e) => handleChange('ADSENSE_CLIENT_ID', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  ADSENSE_SLOT_1, SLOT_2, SLOT_3
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Slot 1"
                    value={form.ADSENSE_SLOT_1}
                    onChange={(e) => handleChange('ADSENSE_SLOT_1', e.target.value)}
                    className="bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-2 py-2 text-xs text-gray-900 dark:text-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Slot 2"
                    value={form.ADSENSE_SLOT_2}
                    onChange={(e) => handleChange('ADSENSE_SLOT_2', e.target.value)}
                    className="bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-2 py-2 text-xs text-gray-900 dark:text-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Slot 3"
                    value={form.ADSENSE_SLOT_3}
                    onChange={(e) => handleChange('ADSENSE_SLOT_3', e.target.value)}
                    className="bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-2 py-2 text-xs text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  DARAZ_AFFILIATE_ID
                </label>
                <input
                  type="text"
                  placeholder="daraz_eye24_bd"
                  value={form.DARAZ_AFFILIATE_ID}
                  onChange={(e) => handleChange('DARAZ_AFFILIATE_ID', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  ROKOMARI_AFFILIATE_ID (rokomari.com/affiliate)
                </label>
                <input
                  type="text"
                  placeholder="rokomari_eye24"
                  value={form.ROKOMARI_AFFILIATE_ID}
                  onChange={(e) => handleChange('ROKOMARI_AFFILIATE_ID', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  ADSTERRA_CODE (কাস্টম ব্যানার / স্ক্রিপ্ট)
                </label>
                <textarea
                  rows={2}
                  placeholder="<!-- Adsterra script -->"
                  value={form.ADSTERRA_CODE}
                  onChange={(e) => handleChange('ADSTERRA_CODE', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </section>

          {/* ================= SECTION G: Controls & 100% APPROVAL LOCK ================= */}
          <section className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-zinc-800 mb-5">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-600/20 text-red-600 flex items-center justify-center font-black text-sm">
                G
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white">
                  Section G - Controls & 100% Approval Lock
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-500">
                  ক্রন বিরতি, ভাইরাল ফিল্টারিং এবং ম্যান্ডাটরি অনুমোদন নিরাপত্তা
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    FETCH_INTERVAL (ক্রন এক্সিকিউশন ব্যবধান)
                  </label>
                  <select
                    value={form.FETCH_INTERVAL}
                    onChange={(e) => handleChange('FETCH_INTERVAL', e.target.value as any)}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white font-bold"
                  >
                    <option value="15min">প্রতি ১৫ মিনিটে (রোটেশন সহ রিকমেন্ডেড)</option>
                    <option value="30min">প্রতি ৩০ মিনিটে</option>
                    <option value="1h">প্রতি ১ ঘণ্টায়</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">VIRAL_FILTER</h4>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">উচ্চ ভাইরাল স্কোর ও ব্রেকিং ফিল্টার</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.VIRAL_FILTER}
                      onChange={(e) => handleChange('VIRAL_FILTER', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>

              {/* MANDATORY RED BOX: 100% APPROVAL LOCK (NO AUTO_APPROVE TOGGLE) */}
              <div className="p-4 bg-red-600/10 dark:bg-red-950/60 border-2 border-red-600 rounded-2xl flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 stroke-[2.5]" />
                <div>
                  <h4 className="text-sm font-black text-red-700 dark:text-red-400">
                    🔒 100% Approval Lock - সব এপ্রুভ লাগবে
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-zinc-300 mt-0.5">
                    সিস্টেমে অটো-এপ্রুভ স্থায়ীভাবে নিষ্ক্রিয় রাখা হয়েছে। কোনো খবর বা দারাজ/রকমারি পণ্য এডমিন প্যানেলে Approve বাটনে ক্লিক ছাড়া কখনই লাইভ বা পোস্ট হবে না।
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sticky Save Button */}
          <div className="sticky bottom-4 z-30 bg-white/95 dark:bg-black/90 backdrop-blur-md border border-gray-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-2xl transition-colors">
            <div className="text-xs text-gray-500 dark:text-zinc-400">
              সেভ করার পর Vercel ক্রন ও Rotator স্বয়ংক্রিয়ভাবে নতুন কিগুলো সক্রিয় করবে।
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'সেভ হচ্ছে...' : 'সেটিংস সেভ করুন (Save to DB)'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
