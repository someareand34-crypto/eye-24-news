import React, { useState } from 'react';
import { ListOrdered, Trash2, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { storage } from '../../lib/storage';
import { SystemLog } from '../../types';

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>(storage.getLogs());
  const [filterType, setFilterType] = useState<string>('all');

  const refreshLogs = () => {
    setLogs(storage.getLogs());
  };

  const handleClearLogs = () => {
    if (window.confirm('আপনি কি সমস্ত সিস্টেম লগ মুছে ফেলতে চান?')) {
      storage.addLog({
        type: 'system',
        status: 'info',
        message: 'লগ ডাটাবেস নতুনভাবে রিসেট করা হয়েছে।',
      });
      setLogs(storage.getLogs());
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'all') return true;
    return log.type === filterType;
  });

  const getStatusIcon = (status: SystemLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ListOrdered className="w-6 h-6 text-red-600" />
              <span>সিস্টেম অটোমেশন ও অডিট লগ</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              স্বয়ংক্রিয় ক্রন এক্সিকিউশন, ৫x রোটেশন ইভেন্ট, ফেসবুক ও হোয়াটসঅ্যাপ পাবলিশিং অডিট
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshLogs}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-zinc-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>রিফ্রেশ</span>
            </button>

            <button
              onClick={handleClearLogs}
              className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/80 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 dark:border-red-900/50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>লগ মুছুন</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { label: 'সব লগ', value: 'all' },
            { label: 'নিউজ ক্রন (15m)', value: 'cron_news' },
            { label: 'অ্যাফিলিয়েট ক্রন', value: 'cron_affiliate' },
            { label: 'Facebook Graph API', value: 'facebook' },
            { label: 'WhatsApp Cloud API', value: 'whatsapp' },
            { label: 'অনুমোদন ইভেন্ট', value: 'approval' },
            { label: 'সিস্টেম', value: 'system' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterType(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab.value
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-gray-200 dark:border-zinc-800 shadow-xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Log Entries Container */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="divide-y divide-gray-100 dark:divide-zinc-900">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(log.status)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider font-mono">
                        [{log.type}]
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          log.status === 'success'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                            : log.status === 'warning'
                            ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">{log.message}</p>
                  </div>
                </div>

                <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                  {log.timestamp}
                </span>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="p-12 text-center text-xs text-gray-400 dark:text-zinc-500">
                এই ক্যাটাগরিতে কোনো লগ পাওয়া যায়নি।
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
