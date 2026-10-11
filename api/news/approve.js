import { connectToDatabase, News, Settings, AutopostLog } from '../../src/lib/mongodb.js';
import { postToFacebook } from '../autopost/facebook.js';
import { postToWhatsApp } from '../autopost/whatsapp.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { id, ids, action = 'approve', title_bn, category, description_bn } = req.body || {};

    const targetIds = Array.isArray(ids) && ids.length > 0 ? ids : (id ? [id] : []);
    if (targetIds.length === 0) {
      return res.status(400).json({ error: 'News ID or IDs array is required' });
    }

    let settings = null;
    let conn = null;
    try {
      conn = await connectToDatabase();
      if (conn && Settings) {
        settings = await Settings.findOne({ key: 'global_settings' }).lean();
      }
    } catch (e) {
      console.warn('DB connect notice in approve:', e.message);
    }

    // Action: REJECT
    if (action === 'reject') {
      if (conn && News) {
        await News.updateMany({ _id: { $in: targetIds } }, { $set: { status: 'rejected' } });
      }
      return res.status(200).json({
        success: true,
        action: 'rejected',
        count: targetIds.length,
        message: `${targetIds.length} items rejected successfully.`,
      });
    }

    // Action: APPROVE (THE ONLY WAY ITEMS CAN BE PUBLISHED)
    const approvedResults = [];

    for (const currentId of targetIds) {
      const updatePayload = {
        status: 'published',
        publishedAt: new Date(),
        approvedBy: 'admin',
      };
      if (title_bn && targetIds.length === 1) updatePayload.title_bn = title_bn;
      if (category && targetIds.length === 1) updatePayload.category = category;
      if (description_bn && targetIds.length === 1) updatePayload.description_bn = description_bn;

      let targetNews = {
        _id: currentId,
        title_bn: title_bn || 'ব্রেকিং আপডেট',
        description_bn: description_bn || '',
        category: category || 'আন্তর্জাতিক',
        status: 'published',
        publishedAt: new Date(),
        approvedBy: 'admin',
      };

      if (conn && News) {
        const updated = await News.findByIdAndUpdate(currentId, updatePayload, { new: true }).lean();
        if (updated) {
          targetNews = updated;
        }
      }

      // Autopost to Facebook & WhatsApp
      let fbResult = { success: true, simulated: true };
      let waResult = { success: true, simulated: true };

      try {
        fbResult = await postToFacebook(targetNews, settings || {});
      } catch (fbErr) {
        fbResult = { success: false, error: fbErr.message };
      }

      try {
        waResult = await postToWhatsApp(targetNews, settings || {});
      } catch (waErr) {
        waResult = { success: false, error: waErr.message };
      }

      // Log to AutopostLog collection
      if (conn && AutopostLog) {
        try {
          await AutopostLog.create({
            newsId: currentId,
            newsTitle: targetNews.title_bn,
            fbSuccess: fbResult?.success || false,
            fbError: fbResult?.error || '',
            waSuccess: waResult?.success || false,
            waError: waResult?.error || '',
            timestamp: new Date(),
          });
        } catch (logErr) {
          console.warn('Autopost log notice:', logErr.message);
        }
      }

      // Mark flags in News document
      if (conn && News) {
        await News.findByIdAndUpdate(currentId, {
          fbPosted: fbResult?.success || false,
          waPosted: waResult?.success || false,
        });
      }

      approvedResults.push({
        id: currentId,
        news: targetNews,
        facebook: fbResult,
        whatsapp: waResult,
      });
    }

    return res.status(200).json({
      success: true,
      action: 'approved',
      count: approvedResults.length,
      message: `${approvedResults.length} items published & social posted!`,
      results: approvedResults,
    });
  } catch (error) {
    console.error('api/news/approve error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error processing approval',
    });
  }
}
