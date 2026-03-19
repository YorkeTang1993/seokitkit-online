import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import { tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${SITE_NAME}. ${siteConfig.tagline}`,
  alternates: { canonical: `${BASE_URL}/about` },
};

export default function AboutPage() {
  const { categories } = siteConfig;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About {SITE_NAME}</h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          {SITE_NAME} is a collection of {siteConfig.tagline} Every tool runs entirely in your
          browser — no data is ever sent to our servers.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Our Mission</h2>
        <p>
          We believe essential tools should be free and accessible to everyone. Whether you need to format code,
          convert data, or perform quick calculations, {SITE_NAME} provides simple, no-nonsense tools that
          get the job done without requiring signups, subscriptions, or data collection.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2">
          {categories.map(cat => {
            const catTools = tools.filter(t => t.category === cat.id);
            if (catTools.length === 0) return null;
            return (
              <li key={cat.id}>
                <strong>{cat.label}</strong> — {catTools.map(t => t.name).join(', ')}
              </li>
            );
          })}
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Privacy First</h2>
        <p>
          All processing happens locally in your browser using JavaScript. Your data never leaves your device.
          We don&apos;t store, log, or transmit any input you provide to our tools. Read our{' '}
          <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> for more details.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Built With</h2>
        <p>
          {SITE_NAME} is built with Next.js and Tailwind CSS, deployed on Vercel for maximum speed and reliability.
          All pages are statically generated for instant loading times.
        </p>
      </div>
    </div>
  );
}
