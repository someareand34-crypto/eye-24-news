/**
 * Facebook Graph API Auto-Poster
 * Posts approved news articles directly to the official Facebook Page
 */

export async function postToFacebook(news, settings = {}) {
  const token = settings.FACEBOOK_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = settings.FACEBOOK_PAGE_ID || process.env.FACEBOOK_PAGE_ID;

  if (!token || !pageId) {
    console.warn('[Facebook AutoPost] Page Token or Page ID missing. Simulating successful post log.');
    return {
      success: true,
      simulated: true,
      message: 'Facebook Token/Page ID not configured; post simulated successfully.',
      postId: 'simulated_fb_' + Date.now(),
    };
  }

  try {
    const postMessage = `🔴 ব্রেকিং নিউজ | Eye 24\n\n${news.title_bn}\n\n${
      news.description_bn ? news.description_bn.substring(0, 200) + '...' : ''
    }\n\n🔗 বিস্তারিত পড়তে ক্লিক করুন: https://eye24.vercel.app/news/${news._id}\n\n#Eye24 #BreakingNews #BanglaNews #Viral`;

    const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: postMessage,
        link: `https://eye24.vercel.app/news/${news._id}`,
        access_token: token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Facebook AutoPost] Graph API Error:', data);
      return { success: false, error: data.error?.message || 'Facebook API error' };
    }

    return { success: true, postId: data.id };
  } catch (err) {
    console.error('[Facebook AutoPost] Network error:', err);
    return { success: false, error: err.message };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { news, settings } = req.body || {};
  if (!news) {
    return res.status(400).json({ error: 'News payload required' });
  }

  const result = await postToFacebook(news, settings);
  return res.status(result.success ? 200 : 500).json(result);
}
