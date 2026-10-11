import { connectToDatabase, News } from '../../src/lib/mongodb.js';

export default async function handler(req, res) {
  try {
    const { status = 'published', category, type, limit = 50, search } = req.query || {};

    const conn = await connectToDatabase();
    if (!conn || !News) {
      return res.status(200).json({
        fallback: true,
        message: 'Database not initialized, client storage active',
        items: [],
      });
    }

    const query = {};
    if (status) query.status = status;
    if (category && category !== 'all') query.category = category;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title_bn: { $regex: search, $options: 'i' } },
        { title_en: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await News.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(parseInt(limit, 10) || 50)
      .lean();

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('api/news/list error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error fetching news list',
    });
  }
}
