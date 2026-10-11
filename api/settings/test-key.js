import { testSingleApiKey } from '../../src/lib/apiRotator.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { service, key, extraParams = {} } = req.body || {};

    if (!service || !key) {
      return res.status(400).json({ error: 'Service and key are required' });
    }

    const result = await testSingleApiKey(service, key, extraParams);
    return res.status(200).json(result);
  } catch (error) {
    console.error('api/settings/test-key error:', error);
    return res.status(500).json({
      success: false,
      status: 'invalid',
      message: error.message || 'Key test error',
    });
  }
}
