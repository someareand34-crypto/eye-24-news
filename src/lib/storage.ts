import { NewsItem, AppSettings, SystemLog, DashboardStats, KeyUsageInfo } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  newsapi_keys: [
    '5b9c48b2910482910481203948120349',
    '8f4a1029482019482019482019482019',
    '1e9c7820194820194820194820194820',
  ],
  newsapi_active_index: 0,
  gnews_keys: [
    'gnews_primary_key_01',
    'gnews_backup_key_02',
  ],
  gnews_active_index: 0,
  currents_keys: [],
  currents_active_index: 0,
  mediastack_keys: [],
  mediastack_active_index: 0,

  RSS_FEEDS:
    'http://feeds.bbci.co.uk/news/world/rss.xml, http://rss.cnn.com/rss/edition.rss, https://www.aljazeera.com/xml/rss/all.xml, https://feeds.reuters.com/reuters/worldNews',
  GOOGLE_TRANSLATE_API_KEY: '',
  AUTO_TRANSLATE: true,
  FACEBOOK_PAGE_ACCESS_TOKEN: '',
  FACEBOOK_PAGE_ID: '104829104812',
  WHATSAPP_ACCESS_TOKEN: '',
  WHATSAPP_PHONE_NUMBER_ID: '10928472910',
  WHATSAPP_CHANNEL_IDS: '120363028472910@newsletter',
  ADSENSE_CLIENT_ID: 'ca-pub-9842104928104812',
  ADSENSE_SLOT_1: '1234567890',
  ADSENSE_SLOT_2: '2345678901',
  ADSENSE_SLOT_3: '3456789012',
  ADSTERRA_CODE: '<!-- Adsterra Custom Banner 728x90 -->',
  DARAZ_AFFILIATE_ID: 'daraz_eye24_bd',
  DARAZ_API_KEY: '',
  ROKOMARI_AFFILIATE_ID: 'rokomari_eye24',
  ROKOMARI_API_KEY: '',
  FETCH_INTERVAL: '15min',
  VIRAL_FILTER: true,

  api_usage_map: {
    '5b9c48b2910482910481203948120349': {
      key: '5b9c48b2910482910481203948120349',
      service: 'newsapi',
      used: 23,
      max: 100,
      status: 'active',
      lastTested: 'আজ ১০:১৫ AM',
    },
    '8f4a1029482019482019482019482019': {
      key: '8f4a1029482019482019482019482019',
      service: 'newsapi',
      used: 0,
      max: 100,
      status: 'standby',
      lastTested: 'স্ট্যান্ডবাই',
    },
    '1e9c7820194820194820194820194820': {
      key: '1e9c7820194820194820194820194820',
      service: 'newsapi',
      used: 0,
      max: 100,
      status: 'standby',
      lastTested: 'স্ট্যান্ডবাই',
    },
    'gnews_primary_key_01': {
      key: 'gnews_primary_key_01',
      service: 'gnews',
      used: 12,
      max: 100,
      status: 'active',
      lastTested: 'আজ ১০:১৫ AM',
    },
    'gnews_backup_key_02': {
      key: 'gnews_backup_key_02',
      service: 'gnews',
      used: 0,
      max: 100,
      status: 'standby',
      lastTested: 'স্ট্যান্ডবাই',
    },
  },
};

// Initial Seed News
export const INITIAL_NEWS: NewsItem[] = [
  // 1. Published World News
  {
    _id: 'news-pub-1',
    title_bn: 'মধ্যপ্রাচ্যে নতুন ভূ-রাজনৈতিক মোড়: ঐতিহাসিক চুক্তির দ্বারপ্রান্তে বিশ্বশক্তিগুলো',
    title_en: 'Middle East Geopolitical Shift: World Powers on Brink of Historic Agreement',
    description_bn:
      'আন্তর্জাতিক কূটনৈতিক আলোচনার পর মধ্যপ্রাচ্যে নতুন অর্থনৈতিক ও নিরাপত্তা করিডোর গঠনের বিষয়ে ঐক্যমত্যে পৌঁছেছে শীর্ষ দেশগুলো। এতে বিশ্ববাজারে জ্বালানি তেলের দামে বড় পরিবর্তনের ইঙ্গিত দিয়েছেন বিশ্লেষকরা। জাতিসংঘের মধ্যস্থতায় আয়োজিত এই জরুরি সম্মেলনে বৈশ্বিক নিরাপত্তা এবং বাণিজ্যিক নৌপথ সুরক্ষার বিষয়টি অগ্রাধিকার পায়।',
    description_en:
      'Major world leaders agree on historical security framework in the Middle East shaping energy routes.',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    category: 'আন্তর্জাতিক',
    source: 'Reuters / Eye 24 Desk',
    country: 'International',
    viralScore: 98,
    status: 'published',
    type: 'news',
    originalUrl: 'https://reuters.com/world/historic-deal-2026',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    approvedBy: 'admin',
    views: 14200,
    clicks: 0,
    fbPosted: true,
    waPosted: true,
  },
  {
    _id: 'news-pub-2',
    title_bn: 'আইফোন ১৭ প্রো ম্যাক্স আনপ্যাক: ক্যামেরায় যুক্ত হলো নতুন কোয়ান্টাম সেন্সর ও স্যাটেলাইট ভয়েস',
    title_en: 'iPhone 17 Pro Max Unveil: Revolutionary Quantum Sensor and Satellite Voice Calling',
    description_bn:
      'অ্যাপল উন্মোচন করল তাদের বহুল প্রতীক্ষিত ফ্ল্যাগশিপ স্মার্টফোন। নতুন টাইটানিয়াম ফ্রেমে তৈরি এই ডিভাইসে রয়েছে এআই-চালিত জিরো-ল্যাটেন্সি প্রসেসর এবং যেকোনো দুর্গম অঞ্চল থেকে সরাসরি স্যাটেলাইট কলিং সুবিধা। প্রযুক্তিবিদদের মতে, ক্যামেরা সেন্সরের আলো গ্রহণের ক্ষমতা গত বছরের তুলনায় দ্বিগুণ বৃদ্ধি পেয়েছে।',
    description_en:
      'Apple unveils next-generation flagship smartphone with groundbreaking camera and satellite integration.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    category: 'প্রযুক্তি',
    source: 'TechCrunch / Eye 24 Tech',
    country: 'USA',
    viralScore: 95,
    status: 'published',
    type: 'news',
    originalUrl: 'https://techcrunch.com/apple-flagship-reveal',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    approvedBy: 'admin',
    views: 18900,
    clicks: 0,
    fbPosted: true,
    waPosted: true,
  },
  {
    _id: 'news-pub-3',
    title_bn: 'বিশ্বকাপ বাছাইপর্ব: শ্বাসরুদ্ধকর শেষ মুহূর্তে বাংলাদেশের অবিস্মরণীয় জয়',
    title_en: 'World Cup Qualifier: Thrilling Last-Minute Victory Sparks Nationwide Celebration',
    description_bn:
      'ইনজুরি টাইমের ৯৪তম মিনিটে দুর্দান্ত ফ্রি-কিকে গোল করে ইতিহাস গড়ল লাল-সবুজ বাহিনী। ঢাকার জাতীয় স্টেডিয়ামে লাখো দর্শকের উপস্থিতিতে প্রতিপক্ষকে ১-০ গোলে হারিয়ে পয়েন্ট টেবিলের শীর্ষে অবস্থান নিল দল।',
    description_en: 'National football team secures thrilling victory in extra time during qualifiers.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    category: 'খেলা',
    source: 'ESPN Sports / Eye 24',
    country: 'Bangladesh',
    viralScore: 99,
    status: 'published',
    type: 'news',
    originalUrl: 'https://espn.com/football-bangladesh-win',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    approvedBy: 'admin',
    views: 32400,
    clicks: 0,
    fbPosted: true,
    waPosted: true,
  },
  {
    _id: 'news-pub-4',
    title_bn: 'সোনার দাম আন্তর্জাতিক বাজারে রেকর্ড উচ্চতায়, বিশ্ব শেয়ারবাজারে সূচকের ওঠানামা',
    title_en: 'Gold Prices Reach All-Time Record High Amid Global Economic Fluctuations',
    description_bn:
      'মুদ্রাস্ফীতি এবং মার্কিন ফেডারেল রিজার্ভের সুদের হার কমানোর সম্ভাবনায় বিনিয়োগকারীরা ঝুঁকছেন নিরাপদ আশ্রয়ের দিকে। প্রতি আউন্স সোনার দাম নতুন মাইলফলক স্পর্শ করেছে।',
    description_en: 'Gold prices soar to historic record as investors seek safe havens.',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    category: 'অর্থনীতি',
    source: 'Bloomberg / Eye 24 Business',
    country: 'Global',
    viralScore: 89,
    status: 'published',
    type: 'news',
    originalUrl: 'https://bloomberg.com/gold-record-surge',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    approvedBy: 'admin',
    views: 9500,
    clicks: 0,
    fbPosted: true,
    waPosted: false,
  },
  {
    _id: 'news-pub-5',
    title_bn: 'টিকটকে ঝড় তোলা সেই রোবট ডগ এখন ঘরে ঘরে: কেন লাখ লাখ মানুষ কিনছে?',
    title_en: 'Viral Robot Companion Pet Sparks Massive Global Craze Across Social Media',
    description_bn:
      'কৃত্রিম বুদ্ধিমত্তাসম্পন্ন নতুন পোষা রোবট সামাজিক মাধ্যমে কোটি কোটি ভিউ পার করেছে। ব্যবহারকারীর কন্ঠস্বর ও আবেগ শনাক্ত করে প্রতিক্রিয়া দেখাতে সক্ষম এই গ্যাজেট।',
    description_en: 'AI powered robot companion goes viral across global social media networks.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    category: 'ভাইরাল',
    source: 'ViralBuzz / Eye 24',
    country: 'Japan',
    viralScore: 97,
    status: 'published',
    type: 'news',
    originalUrl: 'https://viralbuzz.com/ai-robot-dog-trend',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    approvedBy: 'admin',
    views: 28100,
    clicks: 0,
    fbPosted: true,
    waPosted: true,
  },
  {
    _id: 'news-pub-6',
    title_bn: 'স্বপ্নের পদ্মা রেল সংযোগে চালু হলো নতুন বিরতিহীন সুপারফাস্ট এক্সপ্রেস',
    title_en: 'New Non-stop Superfast Express Train Launched on Padma Rail Link',
    description_bn:
      'দক্ষিণাঞ্চলের সঙ্গে রাজধানীর দূরত্ব কমিয়ে দ্রুততম ভ্রমণের স্বাদ দিতে রেলওয়ে ট্র্যাকে নামল আধুনিক বিলাসবহুল বুলেট-ডিজাইন ট্রেন। এতে যাত্রীদের ভ্রমণ সময় অর্ধেকে নেমে আসবে।',
    description_en: 'New express train inaugurated on major transportation corridor.',
    image: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=1200&q=80',
    category: 'জাতীয়',
    source: 'National Desk / Eye 24',
    country: 'Bangladesh',
    viralScore: 92,
    status: 'published',
    type: 'news',
    originalUrl: 'https://eye24.com/padma-express-launch',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    approvedBy: 'admin',
    views: 22100,
    clicks: 0,
    fbPosted: true,
    waPosted: true,
  },

  // 2. Published Deals (Admin previously approved)
  {
    _id: 'aff-pub-1',
    title_bn: '🔥 ৫৫% ছাড়! T800 Ultra স্মার্টওয়াচ ব্লুটুথ কলিং ও ফিটনেস ট্র্যাকার মাত্র ৳৭৯০',
    title_en: 'T800 Ultra Smartwatch with Bluetooth Calling and Health Tracking',
    description_bn:
      '১.৯৯ ইঞ্চি বড় এইচডি ডিসপ্লে, ওয়্যারলেস চার্জিং, হার্ট রেট ও স্লিপ মনিটরিং সুবিধা সহ ওয়াটারপ্রুফ স্পোর্টস স্মার্টওয়াচ।',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    category: 'প্রযুক্তি',
    source: 'Daraz Bangladesh',
    status: 'published',
    type: 'affiliate_daraz',
    affiliateLink: 'https://www.daraz.com.bd/products/t800-ultra-smartwatch.html?aff=daraz_eye24_bd',
    price: 790,
    oldPrice: 1750,
    discount: 55,
    rating: 4.8,
    ordersCount: 4200,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    approvedBy: 'admin',
    views: 4320,
    clicks: 412,
  },
  {
    _id: 'aff-pub-2',
    title_bn: '📚 বেস্টসেলার! প্যারাডক্সিক্যাল সাজিদ - আরিফ আজাদ | ৩৫% ছাড়ে মাত্র ৳৩২০',
    title_en: 'Paradoxical Sajid - Arif Azad Best Seller Book',
    description_bn:
      'রকমারি ডট কমের সর্বকালের রেকর্ড সৃষ্টিকারী বেস্টসেলার বই। যুক্তি ও প্রমাণের সমন্বয়ে তরুণ প্রজন্মের আত্মজিজ্ঞাসার এক অনন্য উত্তর।',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    category: 'জাতীয়',
    source: 'Rokomari.com',
    status: 'published',
    type: 'affiliate_rokomari',
    affiliateLink: 'https://www.rokomari.com/book/140228/paradoxical-sajid?ref=rokomari_eye24',
    price: 320,
    oldPrice: 490,
    discount: 35,
    rating: 4.9,
    ordersCount: 8900,
    author: 'আরিফ আজাদ',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    approvedBy: 'admin',
    views: 6520,
    clicks: 287,
  },

  // 3. PENDING ITEMS (STRICTLY LOCKED - Waiting for Admin Approval)
  // Pending World News
  {
    _id: 'pend-news-1',
    title_bn: 'সরাসরি বিদ্যুৎ উৎপাদনকারী নতুন সোলার উইন্ডো গ্লাস উদ্ভাবন করলেন বিজ্ঞানীরা',
    title_en: 'Scientists Invent Transparent Solar Windows That Generate Clean Electricity',
    description_bn:
      'ভবনের সাধারণ কাঁচের জানালা দিয়েই এবার উৎপাদিত হবে বাড়ি ও অফিসের যাবতীয় বিদ্যুৎ। বিশেষ ন্যানো-প্রযুক্তির স্বচ্ছ সোলার সেল বাণিজ্যিক উৎপাদনের জন্য অনুমোদন পেয়েছে।',
    description_en: 'Breakthrough transparent solar photovoltaic glass approved for commercial scale production.',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    category: 'প্রযুক্তি',
    source: 'BBC Science / Eye 24 Automated',
    country: 'UK',
    viralScore: 96,
    status: 'pending',
    type: 'news',
    originalUrl: 'https://bbc.com/science-solar-window',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    publishedAt: null,
    approvedBy: '',
    views: 0,
    clicks: 0,
    fbPosted: false,
    waPosted: false,
  },
  {
    _id: 'pend-news-2',
    title_bn: 'এশিয়ার শেয়ার বাজারে ব্যাপক উল্লম্ফন: প্রযুক্তি শেয়ারের দর বৃদ্ধি রেকর্ড সীমায়',
    title_en: 'Asian Tech Stocks Surge to Historic Heights in Morning Trading',
    description_bn:
      'সেমিকন্ডাক্টর ও এআই চিপ রফতানির ইতিবাচক রিপোর্টের পর টোকিও ও হংকং স্টক এক্সচেঞ্জে অভাবনীয় লেনদেন। বিনিয়োগকারীদের আত্মবিশ্বাস বৃদ্ধি পাওয়ায় আন্তর্জাতিক সূচকে সুবাতাস বইছে।',
    description_en: 'Asian stock markets rally strongly driven by high demand for advanced semiconductor chips.',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    category: 'অর্থনীতি',
    source: 'CNN Business / Eye 24 Cron',
    country: 'Japan',
    viralScore: 88,
    status: 'pending',
    type: 'news',
    originalUrl: 'https://cnn.com/asian-stocks-rally',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    publishedAt: null,
    approvedBy: '',
    views: 0,
    clicks: 0,
    fbPosted: false,
    waPosted: false,
  },
  {
    _id: 'pend-news-3',
    title_bn: 'বিয়ের অনুষ্ঠানে বরের জন্য ড্রোন দিয়ে মালা পাঠানোর ভাইরাল ভিডিও সোশ্যাল মিডিয়ায় তোলপাড়',
    title_en: 'Viral Drone Garland Delivery at Wedding Ceremony Amazes Millions Online',
    description_bn:
      'ঐতিহ্যবাহী বিয়ের অনুষ্ঠানে অত্যাধুনিক প্রযুক্তির সংমিশ্রণে তৈরি এই মুহূর্তটি নেটদুনিয়ায় কোটি মানুষের মন জয় করেছে। মুহূর্তেই ভিডিওটি মিলিয়ন ভিউ ছাড়িয়ে ট্রেন্ডিংয়ে শীর্ষস্থানে উঠে আসে।',
    description_en: 'Innovative drone garland exchange during wedding ceremony captivates millions of viewers.',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    category: 'ভাইরাল',
    source: 'Social Buzz / Eye 24',
    country: 'India',
    viralScore: 99,
    status: 'pending',
    type: 'news',
    originalUrl: 'https://instagram.com/drone-wedding-viral',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    publishedAt: null,
    approvedBy: '',
    views: 0,
    clicks: 0,
    fbPosted: false,
    waPosted: false,
  },
  {
    _id: 'pend-news-4',
    title_bn: 'চাঁদের দক্ষিণ মেরুতে তরল পানির নতুন উৎসের সন্ধান পেল রোভার',
    title_en: 'Rover Discovers Water Ice Reservoirs Near Lunar South Pole',
    description_bn:
      'ভবিষ্যতের মানব বসতি এবং রকেট রিফুয়েলিংয়ের জন্য এই আবিষ্কার যুগান্তকারী হিসেবে চিহ্নিত হচ্ছে। মহাকাশ গবেষণা সংস্থার বিজ্ঞানীরা জানিয়েছেন, বরফের এই আস্তরণটি কোটি বছর ধরে সুরক্ষিত।',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    category: 'প্রযুক্তি',
    source: 'NASA Space Desk',
    country: 'International',
    viralScore: 91,
    status: 'pending',
    type: 'news',
    originalUrl: 'https://space.org/lunar-water-find',
    createdAt: new Date(Date.now() - 2400000).toISOString(),
    publishedAt: null,
    approvedBy: '',
    views: 0,
    clicks: 0,
    fbPosted: false,
    waPosted: false,
  },

  // Pending Daraz Deals (Fetched by 8AM/8PM cron - locked until approved)
  {
    _id: 'pend-daraz-1',
    title_bn: '🔥 ৪২% ছাড়! Lenovo LP40 Pro ট্রু ওয়্যারলেস স্টেরিও ইয়ারবাডস মাত্র ৳৮৫০',
    title_en: 'Lenovo LP40 Pro TWS Bluetooth Earbuds with Deep Bass',
    description_bn:
      'টাইপ-সি ফাস্ট চার্জিং, ১৩ মিমি ডায়নামিক ড্রাইভার সহ ক্রিস্টাল ক্লিয়ার বাসের প্রিমিয়াম সাউন্ড কোয়ালিটি।',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    category: 'প্রযুক্তি',
    source: 'Daraz Bangladesh',
    status: 'pending',
    type: 'affiliate_daraz',
    affiliateLink: 'https://www.daraz.com.bd/products/lenovo-lp40-pro.html?aff=daraz_eye24_bd',
    price: 850,
    oldPrice: 1450,
    discount: 42,
    rating: 4.7,
    ordersCount: 3100,
    createdAt: new Date(Date.now() - 3000000).toISOString(),
    publishedAt: null,
    approvedBy: '',
    views: 0,
    clicks: 0,
  },
  {
    _id: 'pend-daraz-2',
    title_bn: '🔥 ৫০% ছাড়! 10000mAh মেটাল সুপারফাস্ট চার্জিং পাওয়ার ব্যাংক মাত্র ৳১,১৯০',
    title_en: '10000mAh Ultra-Slim Fast Charging Power Bank with LED Display',
    description_bn:
      '২২.৫ ওয়াট ফাস্ট চার্জিং আউটপুট, একসাথে ৩টি ডিভাইস চার্জ করার সুবিধা। ভ্রমণ ও নিত্যদিনের ব্যবহারে নিখুঁত সঙ্গী।',
    image: 'https://images.unsplash.com/photo-1609592426815-fcfb036caec7?auto=format&fit=crop&w=600&q=80',
    category: 'প্রযুক্তি',
    source: 'Daraz Bangladesh',
    status: 'pending',
    type: 'affiliate_daraz',
    affiliateLink: 'https://www.daraz.com.bd/products/10000mah-power-bank.html?aff=daraz_eye24_bd',
    price: 1190,
    oldPrice: 2380,
    discount: 50,
    rating: 4.9,
    ordersCount: 1850,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    publishedAt: null,
    approvedBy: '',
    views: 0,
    clicks: 0,
  },

  // Pending Rokomari Deals (Locked until approved)
  {
    _id: 'pend-rokomari-1',
    title_bn: '📚 বেস্টসেলার! রি-ওয়ার্ক (বাংলা অনুবাদ) - জেসন ফ্রাইড | ৪০% ছাড়ে মাত্র ৳২৮০',
    title_en: 'Rework Bengali Edition by Jason Fried',
    description_bn:
      'ব্যবসা ও ক্যারিয়ারে অপ্রচলিত অথচ অত্যন্ত সফল কৌশলের বৈশ্বিক মাস্টারপিস বই। নতুন উদ্যোক্তা ও প্রফেশনালদের জন্য অপরিহার্য।',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    category: 'অর্থনীতি',
    source: 'Rokomari.com',
    status: 'pending',
    type: 'affiliate_rokomari',
    affiliateLink: 'https://www.rokomari.com/book/rework-bangla?ref=rokomari_eye24',
    price: 280,
    oldPrice: 470,
    discount: 40,
    rating: 4.8,
    ordersCount: 3400,
    author: 'জেসন ফ্রাইড',
    createdAt: new Date(Date.now() - 4200000).toISOString(),
    publishedAt: null,
    approvedBy: '',
    views: 0,
    clicks: 0,
  },
  {
    _id: 'pend-rokomari-2',
    title_bn: '📚 বেস্টসেলার! অ্যাটমিক হ্যাবিটস (বাংলা সংস্করণ) - জেমস ক্লিয়ার | ৩৮% ছাড়ে মাত্র ৳৩৫০',
    title_en: 'Atomic Habits Bengali Edition - James Clear',
    description_bn:
      'দৈনন্দিন ক্ষুদ্র অভ্যাস পরিবর্তনের মাধ্যমে জীবনে বিশাল ইতিবাচক পরিবর্তনের বৈজ্ঞানিক কৌশল। রকমারিতে টানা ১ নম্বর স্থানাধিকারী।',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    category: 'জাতীয়',
    source: 'Rokomari.com',
    status: 'pending',
    type: 'affiliate_rokomari',
    affiliateLink: 'https://www.rokomari.com/book/atomic-habits-bangla?ref=rokomari_eye24',
    price: 350,
    oldPrice: 560,
    discount: 38,
    rating: 5.0,
    ordersCount: 9400,
    author: 'জেমস ক্লিয়ার',
    createdAt: new Date(Date.now() - 4800000).toISOString(),
    publishedAt: null,
    approvedBy: '',
    views: 0,
    clicks: 0,
  },
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 60000 * 5).toLocaleTimeString('bn-BD'),
    type: 'cron_news',
    status: 'success',
    message: 'স্বয়ংক্রিয় ক্রন সফলভাবে রান করেছে। ৪টি নতুন আন্তর্জাতিক নিউজ সংগৃহীত হয়েছে (100% Pending Lock: অনুমোদনের অপেক্ষায়)।',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 60000 * 15).toLocaleTimeString('bn-BD'),
    type: 'facebook',
    status: 'success',
    message: 'Facebook Graph API: "মধ্যপ্রাচ্যে নতুন ভূ-রাজনৈতিক মোড়" পোস্টটি ফেসবুক পেজে সফলভাবে পাবলিশ হয়েছে।',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 60000 * 20).toLocaleTimeString('bn-BD'),
    type: 'whatsapp',
    status: 'success',
    message: 'WhatsApp Cloud API: অফিসিয়াল চ্যানেলে ব্রেকিং আপডেট পাঠানো সম্পন্ন হয়েছে (Recipient: 120363028472910)。',
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 60000 * 45).toLocaleTimeString('bn-BD'),
    type: 'cron_affiliate',
    status: 'success',
    message: 'Daraz + Rokomari Affiliate Cron: ৪টি হট ডিল সংগৃহীত হয়েছে (সবগুলো Pending স্টেটে রয়েছে, অনুমোদনের পর লাইভ হবে)।',
  },
];

const LOCAL_STORAGE_KEY_NEWS = 'eye24_news_items';
const LOCAL_STORAGE_KEY_SETTINGS = 'eye24_settings';
const LOCAL_STORAGE_KEY_LOGS = 'eye24_logs';
const LOCAL_STORAGE_KEY_STATS = 'eye24_stats';

class StorageManager {
  private getStorage<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, val: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  getNews(): NewsItem[] {
    const items = this.getStorage<NewsItem[]>(LOCAL_STORAGE_KEY_NEWS, []);
    if (!items || items.length === 0) {
      this.setStorage(LOCAL_STORAGE_KEY_NEWS, INITIAL_NEWS);
      return INITIAL_NEWS;
    }
    return items;
  }

  saveNews(newsList: NewsItem[]): void {
    this.setStorage(LOCAL_STORAGE_KEY_NEWS, newsList);
  }

  getSettings(): AppSettings {
    const s = this.getStorage<AppSettings>(LOCAL_STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...s };
  }

  saveSettings(newSettings: AppSettings): void {
    this.setStorage(LOCAL_STORAGE_KEY_SETTINGS, newSettings);
  }

  getLogs(): SystemLog[] {
    return this.getStorage<SystemLog[]>(LOCAL_STORAGE_KEY_LOGS, INITIAL_LOGS);
  }

  addLog(log: Omit<SystemLog, 'id' | 'timestamp'>): void {
    const logs = this.getLogs();
    const newLog: SystemLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('bn-BD'),
      ...log,
    };
    this.setStorage(LOCAL_STORAGE_KEY_LOGS, [newLog, ...logs].slice(0, 50));
  }

  getStats(): DashboardStats {
    const all = this.getNews();
    const pendingItems = all.filter((n) => n.status === 'pending');
    const published = all.filter((n) => n.status === 'published' && n.type === 'news').length;

    const pendingWorld = pendingItems.filter((n) => n.type === 'news').length;
    const pendingDaraz = pendingItems.filter((n) => n.type === 'affiliate_daraz').length;
    const pendingRokomari = pendingItems.filter((n) => n.type === 'affiliate_rokomari').length;

    const baseStats = this.getStorage<DashboardStats>(LOCAL_STORAGE_KEY_STATS, {
      pendingTotal: pendingItems.length,
      pendingWorld,
      pendingDaraz,
      pendingRokomari,
      publishedToday: published,
      totalPublished: published,
      fbPostsToday: 14,
      waPostsToday: 9,
      darazClicks: 412,
      rokomariClicks: 287,
      estimatedEarnings: 3450,
    });

    baseStats.pendingTotal = pendingItems.length;
    baseStats.pendingWorld = pendingWorld;
    baseStats.pendingDaraz = pendingDaraz;
    baseStats.pendingRokomari = pendingRokomari;
    baseStats.publishedToday = published;
    return baseStats;
  }

  incrementClick(type: 'daraz' | 'rokomari'): void {
    const stats = this.getStats();
    if (type === 'daraz') {
      stats.darazClicks += 1;
      stats.estimatedEarnings += 12;
    } else {
      stats.rokomariClicks += 1;
      stats.estimatedEarnings += 18;
    }
    this.setStorage(LOCAL_STORAGE_KEY_STATS, stats);
  }
}

export const storage = new StorageManager();
