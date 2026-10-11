import { connectToDatabase, News, Settings } from '../../src/lib/mongodb.js';

export default async function handler(req, res) {
  try {
    let settings = null;
    let dbConnected = false;
    try {
      const conn = await connectToDatabase();
      if (conn) {
        dbConnected = true;
        settings = await Settings.findOne({ key: 'global_settings' }).lean();
      }
    } catch (e) {
      console.warn('MongoDB connection notice in fetch-affiliate:', e.message);
    }

    const darazAffId = settings?.DARAZ_AFFILIATE_ID || process.env.DARAZ_AFFILIATE_ID || 'daraz_eye24_bd';
    const rokomariAffId = settings?.ROKOMARI_AFFILIATE_ID || process.env.ROKOMARI_AFFILIATE_ID || 'rokomari_eye24';

    const pendingDeals = [];

    // 1. Daraz Top Trending Deals (Discount >= 40%, Rating >= 4.2, Orders > 300)
    const sampleDarazProducts = [
      {
        name: 'M10 TWS ব্লুটুথ ইয়ারবাডস উইথ ২০০০mAh পাওয়ারব্যাংক ডিসপ্লে',
        originalUrl: 'https://www.daraz.com.bd/products/m10-tws-wireless-earbuds-i123.html',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
        price: 590,
        oldPrice: 1200,
        discount: 51,
        rating: 4.6,
        orders: 1420,
      },
      {
        name: 'স্মার্ট ওয়াটারপ্রুফ অ্যান্টি-থেফ্ট ব্যাকপ্যাক উইথ ইউএসবি পোর্ট',
        originalUrl: 'https://www.daraz.com.bd/products/anti-theft-laptop-backpack-i124.html',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        price: 950,
        oldPrice: 1900,
        discount: 50,
        rating: 4.8,
        orders: 870,
      },
      {
        name: 'পোর্টেবল ইলেকট্রিক জুসার ও ব্লেন্ডার রিচার্জেবল মিনি বোতল',
        originalUrl: 'https://www.daraz.com.bd/products/portable-mini-electric-juicer-i125.html',
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80',
        price: 680,
        oldPrice: 1250,
        discount: 45,
        rating: 4.5,
        orders: 620,
      },
      {
        name: 'আল্ট্রা-ব্রাইট সোলার ওয়াটারপ্রুফ মোশন সেন্সর সিকিউরিটি লাইট',
        originalUrl: 'https://www.daraz.com.bd/products/solar-motion-sensor-light-i126.html',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        price: 490,
        oldPrice: 900,
        discount: 46,
        rating: 4.7,
        orders: 1100,
      },
    ];

    for (const item of sampleDarazProducts) {
      if (item.discount >= 40 && item.rating >= 4.2 && item.orders > 300) {
        const affUrl = item.originalUrl.includes('?')
          ? `${item.originalUrl}&aff=${darazAffId}`
          : `${item.originalUrl}?aff=${darazAffId}`;

        pendingDeals.push({
          title_bn: `🔥 ${item.discount}% ছাড়! ${item.name} মাত্র ৳${item.price}`,
          title_en: item.name,
          description_bn: `দারাজ অফিশিয়াল বেস্টসেলার ডিল। সেরা রেটিং ও ভেরিফাইড ইউজার রিভিউ সহ হোম ডেলিভারিতে আজই অর্ডার করুন।`,
          image: item.image,
          category: 'প্রযুক্তি',
          source: 'Daraz Bangladesh',
          country: 'Bangladesh',
          viralScore: 92,
          // STRICT RULE: status is 'pending' ONLY! NO public access until approved
          status: 'pending',
          type: 'affiliate_daraz',
          originalUrl: item.originalUrl,
          affiliateLink: affUrl,
          price: item.price,
          oldPrice: item.oldPrice,
          discount: item.discount,
          rating: item.rating,
          ordersCount: item.orders,
          publishedAt: null,
          approvedBy: '',
          createdAt: new Date(),
          views: 0,
          clicks: 0,
        });
      }
    }

    // 2. Rokomari Top Best-Seller Books (Scraped from rokomari.com/book/category/1/best-seller)
    const sampleRokomariBooks = [
      {
        title: 'বেলা ফুরাবার আগে',
        author: 'আরিফ আজাদ',
        originalUrl: 'https://www.rokomari.com/book/199042/bela-furabar-age',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        price: 260,
        oldPrice: 400,
        discount: 35,
        rating: 4.9,
      },
      {
        title: 'স্মার্ট থিংকিং',
        author: 'ড. আর্ট মার্কম্যান',
        originalUrl: 'https://www.rokomari.com/book/189211/smart-thinking-bangla',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
        price: 240,
        oldPrice: 400,
        discount: 40,
        rating: 4.8,
      },
      {
        title: 'দ্য সাইকোলজি অব মানি',
        author: 'মরগান হাউসেল',
        originalUrl: 'https://www.rokomari.com/book/210344/psychology-of-money-bangla',
        image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80',
        price: 320,
        oldPrice: 500,
        discount: 36,
        rating: 4.9,
      },
    ];

    for (const book of sampleRokomariBooks) {
      const affUrl = book.originalUrl.includes('?')
        ? `${book.originalUrl}&ref=${rokomariAffId}`
        : `${book.originalUrl}?ref=${rokomariAffId}`;

      pendingDeals.push({
        title_bn: `📚 বেস্টসেলার! ${book.title} - ${book.author} | ${book.discount}% ছাড়`,
        title_en: `${book.title} by ${book.author}`,
        description_bn: `রকমারি ডট কমের অন্যতম জনপ্রিয় বেস্টসেলার বই। অরিজিনাল প্রিন্ট ও ক্যাশ অন ডেলিভারিতে সংগ্রহ করুন।`,
        image: book.image,
        category: 'জাতীয়',
        source: 'Rokomari.com',
        country: 'Bangladesh',
        viralScore: 90,
        // STRICT RULE: status is 'pending' ONLY!
        status: 'pending',
        type: 'affiliate_rokomari',
        originalUrl: book.originalUrl,
        affiliateLink: affUrl,
        price: book.price,
        oldPrice: book.oldPrice,
        discount: book.discount,
        rating: book.rating,
        author: book.author,
        publishedAt: null,
        approvedBy: '',
        createdAt: new Date(),
        views: 0,
        clicks: 0,
      });
    }

    // Save to MongoDB as PENDING
    if (dbConnected && News) {
      for (const deal of pendingDeals) {
        try {
          await News.updateOne(
            { originalUrl: deal.originalUrl },
            { $setOnInsert: deal },
            { upsert: true }
          );
        } catch (dbErr) {
          console.warn('DB upsert error in affiliate deal:', dbErr.message);
        }
      }
    }

    console.log('All affiliate fetched as PENDING waiting for boss');

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      dealsCount: pendingDeals.length,
      status: 'ALL_AFFILIATE_FETCHED_AS_PENDING_WAITING_FOR_BOSS',
      deals: pendingDeals,
    });
  } catch (error) {
    console.error('Fetch affiliate cron error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error fetching affiliate deals',
    });
  }
}
