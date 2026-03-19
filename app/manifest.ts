import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'ToolBox',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
    ],
  };
}
