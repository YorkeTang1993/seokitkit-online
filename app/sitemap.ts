import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';
import { BASE_URL } from '@/lib/seo';

// Use build time as a stable date — only changes on deploy, not per-request
const BUILD_DATE = new Date('2026-03-18');

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map(tool => ({
    url: `${BASE_URL}/${tool.slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...toolPages,
    {
      url: `${BASE_URL}/about`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];
}
