import { connectToDatabase, News } from '../../src/lib/mongodb.js';

export default async function handler(req, res) {
  try {
    const { id } = req.query || {};
    if (!id) {
      return res.status(400).json({ error: 'News ID is required' });
    }

    const conn = await connectToDatabase();
    if (!conn || !News) {
      return res.status(200).json({
        fallback: true,
        message: 'Database not initialized, client storage active',
      });
    }

    const news = await News.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    // Also get related news
    const related = await News.find({
      category: news.category,
      _id: { $ne: news._id },
      status: 'published',
    })
      .limit(4)
      .lean();

    return res.status(200).json({
      success: true,
      news,
      related,
    });
  } catch (error) {
    console.error('api/news/detail error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error fetching news detail',
    });
  }
}
