import { connectToDatabase, Settings } from '../../src/lib/mongodb.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const conn = await connectToDatabase();
      if (!conn || !Settings) {
        return res.status(200).json({
          fallback: true,
          message: 'Running in client storage mode',
        });
      }

      const settings = await Settings.findOne({ key: 'global_settings' }).lean();
      return res.status(200).json({
        success: true,
        settings: settings || {},
      });
    }

    if (req.method === 'POST') {
      const payload = req.body || {};

      const conn = await connectToDatabase();
      if (!conn || !Settings) {
        return res.status(200).json({
          success: true,
          savedToDatabase: false,
          message: 'Settings saved in client session (DB unconfigured)',
          settings: payload,
        });
      }

      const updated = await Settings.findOneAndUpdate(
        { key: 'global_settings' },
        { $set: { ...payload, key: 'global_settings' } },
        { upsert: true, new: true }
      ).lean();

      return res.status(200).json({
        success: true,
        savedToDatabase: true,
        message: 'Settings successfully persisted to MongoDB Atlas!',
        settings: updated,
      });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('api/settings/save error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error handling settings',
    });
  }
}
