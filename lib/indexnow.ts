import { tools } from './tools';
import { BASE_URL } from './seo';
import { siteConfig } from './site-config';

export const INDEXNOW_KEY = siteConfig.indexNowKey;

export function getAllUrls(): string[] {
  const urls = [
    BASE_URL,
    ...tools.map(tool => `${BASE_URL}/${tool.slug}`),
    `${BASE_URL}/about`,
    `${BASE_URL}/privacy-policy`,
  ];
  return urls;
}

export async function submitToIndexNow(urls: string[]): Promise<{ status: number; message: string }> {
  const body = {
    host: new URL(BASE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    message: response.status === 200 ? 'OK - URLs submitted successfully'
      : response.status === 202 ? 'Accepted - URLs received, will be processed later'
      : `Error - HTTP ${response.status}`,
  };
}
