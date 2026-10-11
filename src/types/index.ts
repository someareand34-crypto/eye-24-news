export type NewsCategory = 'জাতীয়' | 'আন্তর্জাতিক' | 'ভাইরাল' | 'খেলা' | 'প্রযুক্তি' | 'অর্থনীতি';

export type NewsStatus = 'pending' | 'published' | 'rejected';

export type NewsType = 'news' | 'affiliate_daraz' | 'affiliate_rokomari';

export interface NewsItem {
  _id: string;
  title_bn: string;
  title_en?: string;
  description_bn?: string;
  description_en?: string;
  image?: string;
  category: NewsCategory;
  source: string;
  country?: string;
  viralScore?: number;
  status: NewsStatus;
  type: NewsType;
  originalUrl?: string;
  affiliateLink?: string;
  price?: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  ordersCount?: number;
  author?: string;
  createdAt: string;
  publishedAt?: string | null;
  approvedBy?: string;
  views?: number;
  clicks?: number;
  fbPosted?: boolean;
  waPosted?: boolean;
}

export interface KeyUsageInfo {
  key: string;
  service: string;
  used: number;
  max: number;
  status: 'active' | 'standby' | 'exhausted';
  lastTested?: string;
}

export interface AppSettings {
  // Section A - NewsAPI.org (Up to 5 keys)
  newsapi_keys: string[];
  newsapi_active_index: number;

  // Section B - GNews.io (Up to 5 keys)
  gnews_keys: string[];
  gnews_active_index: number;

  // Section C - Currents & Mediastack (Up to 5 keys each)
  currents_keys: string[];
  currents_active_index: number;
  mediastack_keys: string[];
  mediastack_active_index: number;

  // Legacy fallback strings
  NEWSAPI_KEY?: string;
  GNEWS_API_KEY?: string;
  CURRENTS_API_KEY?: string;
  RSS_FEEDS: string;

  // Section D - Translation
  GOOGLE_TRANSLATE_API_KEY: string;
  AUTO_TRANSLATE: boolean;

  // Section E - Social Auto-Posting
  FACEBOOK_PAGE_ACCESS_TOKEN: string;
  FACEBOOK_PAGE_ID: string;
  WHATSAPP_ACCESS_TOKEN: string;
  WHATSAPP_PHONE_NUMBER_ID: string;
  WHATSAPP_CHANNEL_IDS: string;

  // Section F - Monetization
  ADSENSE_CLIENT_ID: string;
  ADSENSE_SLOT_1: string;
  ADSENSE_SLOT_2: string;
  ADSENSE_SLOT_3: string;
  ADSTERRA_CODE: string;
  DARAZ_AFFILIATE_ID: string;
  DARAZ_API_KEY: string;
  ROKOMARI_AFFILIATE_ID: string;
  ROKOMARI_API_KEY: string;

  // Section G - Controls
  FETCH_INTERVAL: '15min' | '30min' | '1h';
  VIRAL_FILTER: boolean;
  // Note: NO AUTO_APPROVE! 100% Admin approval lock is mandatory.

  // Real-time API key usage tracking
  api_usage_map?: Record<string, KeyUsageInfo>;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'cron_news' | 'cron_affiliate' | 'facebook' | 'whatsapp' | 'system' | 'approval';
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  details?: Record<string, any>;
}

export interface DashboardStats {
  pendingTotal: number;
  pendingWorld: number;
  pendingDaraz: number;
  pendingRokomari: number;
  publishedToday: number;
  totalPublished: number;
  fbPostsToday: number;
  waPostsToday: number;
  darazClicks: number;
  rokomariClicks: number;
  estimatedEarnings: number;
}
