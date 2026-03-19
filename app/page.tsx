import type { Metadata } from 'next';
import { tools, categories } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import { BASE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} - Free Online SEO Tools`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: `${SITE_NAME} - Free Online SEO Tools`,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    type: 'website',
  },
};

function generateHomepageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${SITE_NAME} - Free Online SEO Tools`,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BASE_URL}/${tool.slug}`,
        name: tool.name,
      })),
    },
  };
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomepageJsonLd()),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Free Online SEO Tools</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, free, and privacy-friendly SEO tools that work right in your browser. No signup, no data collection.
          </p>
        </div>

        <section className="mb-12 text-gray-600 leading-relaxed max-w-3xl mx-auto text-center">
          <p>
            SEOKit is a suite of free browser-based SEO tools designed for webmasters, content creators, and digital marketers.
            From meta tag generators and schema markup builders to robots.txt creators and hreflang tag tools — every tool
            runs entirely in your browser with zero server uploads. Your data stays private, always.
          </p>
          <p className="mt-3">
            Whether you need to generate Open Graph tags, create XML sitemaps, build .htaccess configurations,
            or set up canonical URLs, our tools are designed to be fast, accurate, and completely free with no signup required.
          </p>
        </section>

        {categories.map(cat => {
          const catTools = tools.filter(t => t.category === cat.id);
          if (catTools.length === 0) return null;
          return (
            <section key={cat.id} id={cat.id} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{cat.label}</h2>
              <p className="text-gray-500 mb-4">{cat.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTools.map(tool => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
