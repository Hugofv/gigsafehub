import { config } from '../config';

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
] as const;

/** Extract host from base URL (e.g. gigsafeafehub.com from https://gigsafehub.com) */
function getHost(baseUrl: string): string {
  try {
    const url = new URL(baseUrl);
    return url.hostname;
  } catch {
    return baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}

/**
 * Submit URLs to IndexNow (Bing, Yandex, etc.) for fast indexing.
 * Uses POST with JSON body for bulk submission (up to 10,000 URLs).
 */
export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  statusCode?: number;
  endpoint?: string;
  error?: string;
}> {
  const key = config.indexNow.key;
  const baseUrl = config.baseUrl;

  if (!key) {
    return { success: false, error: 'INDEXNOW_KEY is not configured' };
  }

  if (urls.length === 0) {
    return { success: false, error: 'No URLs to submit' };
  }

  // Ensure URLs are absolute and use production domain
  const base = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  const absoluteUrls = urls.map((u) => (u.startsWith('http') ? u : `${base.replace(/\/$/, '')}${u.startsWith('/') ? '' : '/'}${u}`));

  const host = getHost(base);
  const keyLocation = `${base.replace(/\/$/, '')}/${key}.txt`;

  const body = {
    host,
    key,
    keyLocation,
    urlList: absoluteUrls,
  };

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        return { success: true, statusCode: res.status, endpoint };
      }

      const text = await res.text();
      console.warn(`IndexNow ${endpoint} returned ${res.status}: ${text}`);
      // Try next endpoint
    } catch (err) {
      console.warn(`IndexNow request to ${endpoint} failed:`, err);
    }
  }

  return {
    success: false,
    error: 'All IndexNow endpoints failed',
  };
}
