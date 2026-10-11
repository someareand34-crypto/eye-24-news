import { KeyUsageInfo } from '../types';

/**
 * Service daily quota limits
 */
export const SERVICE_QUOTAS: Record<string, number> = {
  newsapi: 100,
  gnews: 100,
  currents: 600,
  mediastack: 500,
};

/**
 * Test a single API key to see if it's active, rate limited, or invalid
 */
export async function testSingleApiKey(
  service: 'newsapi' | 'gnews' | 'currents' | 'mediastack' | 'google_translate' | 'facebook' | 'whatsapp',
  key: string,
  extraParams: Record<string, string> = {}
): Promise<{ success: boolean; status: 'active' | 'exhausted' | 'invalid'; message: string; httpStatus?: number }> {
  if (!key || !key.trim()) {
    return { success: false, status: 'invalid', message: 'API Key is empty' };
  }

  const cleanKey = key.trim();

  try {
    if (service === 'newsapi') {
      const url = `https://newsapi.org/v2/top-headlines?category=general&pageSize=1&apiKey=${cleanKey}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (res.status === 200 && data.status === 'ok') {
        return { success: true, status: 'active', message: 'NewsAPI key is active and responding (200 OK).' };
      }
      if (res.status === 429 || data.code === 'rateLimited' || data.code === 'apiKeyExhausted') {
        return { success: false, status: 'exhausted', message: `Daily quota exhausted (429): ${data.message || 'Rate limit'}` };
      }
      return { success: false, status: 'invalid', message: data.message || `Invalid key (HTTP ${res.status})` };
    }

    if (service === 'gnews') {
      const url = `https://gnews.io/api/v4/top-headlines?max=1&token=${cleanKey}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (res.status === 200) {
        return { success: true, status: 'active', message: 'GNews key is verified and operational (200 OK).' };
      }
      if (res.status === 429 || (data.errors && JSON.stringify(data.errors).toLowerCase().includes('limit'))) {
        return { success: false, status: 'exhausted', message: 'GNews daily quota reached (429).' };
      }
      return { success: false, status: 'invalid', message: data.errors?.[0] || `HTTP ${res.status}` };
    }

    if (service === 'currents') {
      const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${cleanKey}&page_size=1`;
      const res = await fetch(url);
      if (res.ok) {
        return { success: true, status: 'active', message: 'Currents API key verified successfully.' };
      }
      if (res.status === 429) {
        return { success: false, status: 'exhausted', message: 'Currents API rate limit reached.' };
      }
      return { success: false, status: 'invalid', message: `HTTP ${res.status}` };
    }

    if (service === 'mediastack') {
      const url = `http://api.mediastack.com/v1/news?access_key=${cleanKey}&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        return { success: true, status: 'active', message: 'Mediastack API key is active.' };
      }
      if (res.status === 429) {
        return { success: false, status: 'exhausted', message: 'Mediastack quota exhausted.' };
      }
      return { success: false, status: 'invalid', message: `HTTP ${res.status}` };
    }

    if (service === 'google_translate') {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${cleanKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'Hello', target: 'bn', format: 'text' }),
      });
      if (res.ok) {
        return { success: true, status: 'active', message: 'Google Cloud Translation API is active and functional.' };
      }
      return { success: false, status: 'invalid', message: `Translation API returned status ${res.status}` };
    }

    if (service === 'facebook') {
      const pageId = extraParams.pageId;
      if (!pageId) {
        return { success: false, status: 'invalid', message: 'Facebook Page ID required to test token.' };
      }
      const url = `https://graph.facebook.com/v19.0/${pageId}?access_token=${cleanKey}&fields=id,name`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.id) {
        return { success: true, status: 'active', message: `Facebook Page verified: "${data.name}" (${data.id})` };
      }
      return { success: false, status: 'invalid', message: data.error?.message || `FB error ${res.status}` };
    }

    if (service === 'whatsapp') {
      const phoneId = extraParams.phoneId;
      if (!phoneId) {
        return { success: false, status: 'invalid', message: 'WhatsApp Phone Number ID required.' };
      }
      const url = `https://graph.facebook.com/v19.0/${phoneId}?access_token=${cleanKey}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        return { success: true, status: 'active', message: 'WhatsApp Cloud API credentials verified.' };
      }
      return { success: false, status: 'invalid', message: data.error?.message || `WA error ${res.status}` };
    }

    return { success: true, status: 'active', message: 'Key saved.' };
  } catch (err: any) {
    return { success: false, status: 'invalid', message: `Network/CORS check: ${err.message}` };
  }
}

/**
 * Intelligent Round-Robin and Failover Key Rotator
 * Searches keys in settings, finds the first non-exhausted key, and updates active index.
 */
export async function getWorkingKey(
  service: 'newsapi' | 'gnews' | 'currents' | 'mediastack',
  keysArray: string[] = [],
  currentIndex: number = 0,
  usageMap: Record<string, KeyUsageInfo> = {}
): Promise<{ key: string | null; newIndex: number; updatedUsageMap: Record<string, KeyUsageInfo> }> {
  const validKeys = keysArray.filter((k) => k && k.trim().length > 4);

  if (validKeys.length === 0) {
    return { key: null, newIndex: 0, updatedUsageMap: usageMap };
  }

  const maxQuota = SERVICE_QUOTAS[service] || 100;
  const newMap = { ...usageMap };

  // Cycle through keys starting from current index
  for (let i = 0; i < validKeys.length; i++) {
    const idx = (currentIndex + i) % validKeys.length;
    const testKey = validKeys[idx].trim();
    const existingUsage = newMap[testKey] || {
      key: testKey,
      service,
      used: 0,
      max: maxQuota,
      status: 'active',
    };

    // If already marked exhausted today
    if (existingUsage.status === 'exhausted' || existingUsage.used >= maxQuota) {
      existingUsage.status = 'exhausted';
      newMap[testKey] = existingUsage;
      continue;
    }

    // Found active candidate
    existingUsage.status = 'active';
    existingUsage.used += 1;
    newMap[testKey] = existingUsage;

    return {
      key: testKey,
      newIndex: idx,
      updatedUsageMap: newMap,
    };
  }

  // All keys in the pool are exhausted! Fallback to RSS
  return {
    key: null,
    newIndex: 0,
    updatedUsageMap: newMap,
  };
}
