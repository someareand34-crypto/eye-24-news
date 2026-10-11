import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

/**
 * Global cache for Mongoose connection across serverless invocations
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/* -------------------- News Schema & Model -------------------- */
const NewsSchema = new mongoose.Schema(
  {
    title_bn: { type: String, required: true },
    title_en: { type: String, default: '' },
    description_bn: { type: String, default: '' },
    description_en: { type: String, default: '' },
    image: { type: String, default: '' },
    category: {
      type: String,
      enum: ['জাতীয়', 'আন্তর্জাতিক', 'ভাইরাল', 'খেলা', 'প্রযুক্তি', 'অর্থনীতি'],
      default: 'আন্তর্জাতিক',
    },
    source: { type: String, default: 'Eye 24' },
    country: { type: String, default: 'Global' },
    viralScore: { type: Number, default: 85 },
    // CORE RULE: 100% Admin approval lock - items are pending until approved by admin
    status: {
      type: String,
      enum: ['pending', 'published', 'rejected'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['news', 'affiliate_daraz', 'affiliate_rokomari'],
      default: 'news',
    },
    originalUrl: { type: String, unique: true, sparse: true },
    affiliateLink: { type: String, default: '' },
    price: { type: Number, default: 0 },
    oldPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    ordersCount: { type: Number, default: 0 },
    author: { type: String, default: '' },
    publishedAt: { type: Date, default: null },
    approvedBy: { type: String, default: '' },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    fbPosted: { type: Boolean, default: false },
    waPosted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const News = mongoose.models.News || mongoose.model('News', NewsSchema);

/* -------------------- Settings Schema & Model -------------------- */
const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global_settings', unique: true },

    // Section A - NewsAPI Keys (Up to 5)
    newsapi_keys: { type: [String], default: [] },
    newsapi_active_index: { type: Number, default: 0 },

    // Section B - GNews Keys (Up to 5)
    gnews_keys: { type: [String], default: [] },
    gnews_active_index: { type: Number, default: 0 },

    // Section C - Currents & Mediastack (Up to 5 each)
    currents_keys: { type: [String], default: [] },
    currents_active_index: { type: Number, default: 0 },
    mediastack_keys: { type: [String], default: [] },
    mediastack_active_index: { type: Number, default: 0 },

    // Legacy fallbacks
    NEWSAPI_KEY: { type: String, default: '' },
    GNEWS_API_KEY: { type: String, default: '' },
    CURRENTS_API_KEY: { type: String, default: '' },
    RSS_FEEDS: {
      type: String,
      default:
        'http://feeds.bbci.co.uk/news/world/rss.xml, http://rss.cnn.com/rss/edition.rss, https://www.aljazeera.com/xml/rss/all.xml, https://feeds.reuters.com/reuters/worldNews',
    },

    // Section D - Translation
    GOOGLE_TRANSLATE_API_KEY: { type: String, default: '' },
    AUTO_TRANSLATE: { type: Boolean, default: true },

    // Section E - Social Auto-Posting
    FACEBOOK_PAGE_ACCESS_TOKEN: { type: String, default: '' },
    FACEBOOK_PAGE_ID: { type: String, default: '' },
    WHATSAPP_ACCESS_TOKEN: { type: String, default: '' },
    WHATSAPP_PHONE_NUMBER_ID: { type: String, default: '' },
    WHATSAPP_CHANNEL_IDS: { type: String, default: '' },

    // Section F - Monetization
    ADSENSE_CLIENT_ID: { type: String, default: 'ca-pub-9842104928104812' },
    ADSENSE_SLOT_1: { type: String, default: '1234567890' },
    ADSENSE_SLOT_2: { type: String, default: '2345678901' },
    ADSENSE_SLOT_3: { type: String, default: '3456789012' },
    ADSTERRA_CODE: { type: String, default: '' },
    DARAZ_AFFILIATE_ID: { type: String, default: 'daraz_eye24_bd' },
    DARAZ_API_KEY: { type: String, default: '' },
    ROKOMARI_AFFILIATE_ID: { type: String, default: 'rokomari_eye24' },
    ROKOMARI_API_KEY: { type: String, default: '' },

    // Section G - Controls
    FETCH_INTERVAL: { type: String, default: '15min' },
    VIRAL_FILTER: { type: Boolean, default: true },

    // Usage Tracking
    api_usage_map: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

/* -------------------- Autopost Log Schema & Model -------------------- */
const AutopostLogSchema = new mongoose.Schema(
  {
    newsId: { type: String, required: true },
    newsTitle: { type: String, default: '' },
    fbSuccess: { type: Boolean, default: false },
    fbError: { type: String, default: '' },
    waSuccess: { type: Boolean, default: false },
    waError: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AutopostLog =
  mongoose.models.AutopostLog || mongoose.model('AutopostLog', AutopostLogSchema);
