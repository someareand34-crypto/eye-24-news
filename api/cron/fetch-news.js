import Parser from 'rss-parser';
import { connectToDatabase, News, Settings } from '../../src/lib/mongodb.js';
import { translateText } from '../../src/lib/translate.js';
import { getWorkingKey } from '../../src/lib/apiRotator.js';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Eye24Bot/2.0',
  },
});

export default async function handler(req, res) {
  try {
    // 1. Connect to MongoDB and fetch active settings
    let dbConnected = false;
    let settings = null;
    try {
      const conn = await connectToDatabase();
      if (conn) {
        dbConnected = true;
        settings = await Settings.findOne({ key: 'global_settings' }).lean();
      }
    } catch (dbErr) {
      console.warn('MongoDB connection notice in fetch-news:', dbErr.message);
    }

    // Keys array with up to 5 keys per service
    const newsapiKeys = settings?.newsapi_keys?.length
      ? settings.newsapi_keys
      : (process.env.NEWSAPI_KEY ? [process.env.NEWSAPI_KEY] : []);
    const gnewsKeys = settings?.gnews_keys?.length
      ? settings.gnews_keys
      : (process.env.GNEWS_API_KEY ? [process.env.GNEWS_API_KEY] : []);

    const usageMap = settings?.api_usage_map || {};

    // Intelligent Rotator: pick active working key
    const newsapiRotator = await getWorkingKey(
      'newsapi',
      newsapiKeys,
      settings?.newsapi_active_index || 0,
      usageMap
    );
    const gnewsRotator = await getWorkingKey(
      'gnews',
      gnewsKeys,
      settings?.gnews_active_index || 0,
      newsapiRotator.updatedUsageMap
    );

    const activeNewsApiKey = newsapiRotator.key;
    const activeGNewsKey = gnewsRotator.key;
    const googleTranslateKey = settings?.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY;

    const rawArticles = [];

    // 2. Fetch from NewsAPI (50 headlines across key countries us, gb, in, ae, jp, de)
    if (activeNewsApiKey) {
      const countries = ['us', 'gb', 'in', 'ae', 'jp', 'de'];
      for (const c of countries) {
        try {
          const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=${c}&pageSize=10&apiKey=${activeNewsApiKey}`
          );
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.articles)) {
              data.articles.forEach((art) => {
                if (art.title && art.url) {
                  rawArticles.push({
                    title_en: art.title,
                    description_en: art.description || '',
                    image:
                      art.urlToImage ||
                      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
                    source: art.source?.name || 'NewsAPI',
                    originalUrl: art.url,
                    category: mapCategory(art.title + ' ' + (art.description || '')),
                    country: c.toUpperCase(),
                    viralScore: Math.floor(Math.random() * 45) + 55, // 50-100
                  });
                }
              });
            }
          }
        } catch (err) {
          console.warn(`NewsAPI country ${c} fetch error:`, err.message);
        }
      }
    }

    // 3. Fetch from GNews (up to 50 breaking stories)
    if (activeGNewsKey) {
      try {
        const response = await fetch(
          `https://gnews.io/api/v4/top-headlines?token=${activeGNewsKey}&lang=en&max=50`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.articles)) {
            data.articles.forEach((art) => {
              if (art.title && art.url) {
                rawArticles.push({
                  title_en: art.title,
                  description_en: art.description || '',
                  image:
                    art.image ||
                    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
                  source: art.source?.name || 'GNews',
                  originalUrl: art.url,
                  category: mapCategory(art.title + ' ' + (art.description || '')),
                  country: 'GLOBAL',
                  viralScore: Math.floor(Math.random() * 45) + 55,
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn('GNews fetch error:', err.message);
      }
    }

    // 4. RSS Feed Ingestion (BBC, CNN, Reuters, Al Jazeera)
    const rssUrls = [
      'http://feeds.bbci.co.uk/news/world/rss.xml',
      'http://rss.cnn.com/rss/edition.rss',
      'https://www.aljazeera.com/xml/rss/all.xml',
      'https://feeds.reuters.com/reuters/worldNews',
    ];

    for (const rssUrl of rssUrls) {
      try {
        const feed = await parser.parseURL(rssUrl);
        if (feed && Array.isArray(feed.items)) {
          feed.items.slice(0, 10).forEach((item) => {
            if (item.title && item.link) {
              rawArticles.push({
                title_en: item.title,
                description_en: item.contentSnippet || item.content || '',
                image:
                  item.enclosure?.url ||
                  'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
                source: feed.title || 'Global Wire',
                originalUrl: item.link,
                category: mapCategory(item.title + ' ' + (item.contentSnippet || '')),
                country: 'International',
                viralScore: Math.floor(Math.random() * 45) + 55,
              });
            }
          });
        }
      } catch (rssErr) {
        console.warn(`RSS parse notice for ${rssUrl}:`, rssErr.message);
      }
    }

    // Deduplicate by URL
    const seen = new Set();
    const uniqueArticles = [];
    for (const item of rawArticles) {
      if (item.originalUrl && !seen.has(item.originalUrl)) {
        seen.add(item.originalUrl);
        uniqueArticles.push(item);
      }
    }

    // 5. Translate top unique articles to Bangla & Save as PENDING ONLY
    const processedPending = [];
    const limitToProcess = Math.min(uniqueArticles.length, 15);

    for (let i = 0; i < limitToProcess; i++) {
      const art = uniqueArticles[i];
      let title_bn = await translateText(art.title_en, 'bn', 'en', googleTranslateKey);
      let desc_bn = art.description_en
        ? await translateText(art.description_en.slice(0, 380), 'bn', 'en', googleTranslateKey)
        : '';

      if (!title_bn) {
        title_bn = art.title_en;
      }

      // CORE RULE: status is 'pending' ALWAYS. publishedAt is null.
      const newsDoc = {
        title_bn,
        title_en: art.title_en,
        description_bn: desc_bn || title_bn,
        description_en: art.description_en,
        image: art.image,
        category: art.category,
        source: art.source,
        country: art.country,
        viralScore: art.viralScore,
        status: 'pending', // 100% Admin approval lock
        type: 'news',
        originalUrl: art.originalUrl,
        publishedAt: null, // NOT live
        approvedBy: '',
        createdAt: new Date(),
        views: 0,
        clicks: 0,
        fbPosted: false,
        waPosted: false,
      };

      processedPending.push(newsDoc);

      if (dbConnected && News) {
        try {
          await News.updateOne(
            { originalUrl: art.originalUrl },
            { $setOnInsert: newsDoc },
            { upsert: true }
          );
        } catch (dbSaveErr) {
          console.warn('DB upsert notice:', dbSaveErr.message);
        }
      }
    }

    // Save updated rotator index and usage map back to Settings
    if (dbConnected && Settings) {
      try {
        await Settings.updateOne(
          { key: 'global_settings' },
          {
            $set: {
              newsapi_active_index: newsapiRotator.newIndex,
              gnews_active_index: gnewsRotator.newIndex,
              api_usage_map: gnewsRotator.updatedUsageMap,
            },
          }
        );
      } catch (settingsErr) {
        console.warn('Settings update notice:', settingsErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      activeNewsApiKey: activeNewsApiKey ? `***${activeNewsApiKey.slice(-4)}` : 'none (RSS used)',
      activeGNewsKey: activeGNewsKey ? `***${activeGNewsKey.slice(-4)}` : 'none',
      fetchedCount: uniqueArticles.length,
      pendingCount: processedPending.length,
      status: 'ALL_PENDING_AWAITING_ADMIN_APPROVAL',
      items: processedPending,
    });
  } catch (error) {
    console.error('Fetch news cron error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error in fetch-news cron',
    });
  }
}

function mapCategory(text) {
  const lower = (text || '').toLowerCase();
  if (/cricket|football|fifa|messi|ronaldo|goal|sport|tennis|olympic|champions/i.test(lower)) {
    return 'খেলা';
  }
  if (/tech|ai|apple|google|iphone|software|robot|nasa|space|chip|gadget|elon|meta/i.test(lower)) {
    return 'প্রযুক্তি';
  }
  if (/economy|market|bank|inflation|gold|oil|rupee|taka|dollar|stock|trade|business|invest/i.test(lower)) {
    return 'অর্থনীতি';
  }
  if (/viral|tiktok|video|shocking|trend|internet|bizarre|miracle|wild/i.test(lower)) {
    return 'ভাইরাল';
  }
  if (/bangladesh|dhaka|padma|chittagong|bengal/i.test(lower)) {
    return 'জাতীয়';
  }
  return 'আন্তর্জাতিক';
}
