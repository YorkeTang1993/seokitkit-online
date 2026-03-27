import Link from 'next/link';
import { Tool } from '@/lib/tools';
import { getRelatedTools } from '@/lib/tools';
import { generateBreadcrumbJsonLd, generateHowToJsonLd, BASE_URL } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

function WhatIsSection({ tool }: { tool: Tool }) {
  if (!tool.whatIs) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-3">What is {tool.name}?</h2>
      <div className="text-gray-600 leading-relaxed whitespace-pre-line">{tool.whatIs}</div>
    </section>
  );
}

function UseCasesSection({ tool }: { tool: Tool }) {
  if (!tool.useCases || tool.useCases.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-3">Common Use Cases</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        {tool.useCases.map((useCase, i) => (
          <li key={i}>{useCase}</li>
        ))}
      </ul>
    </section>
  );
}

function HowItWorksSection({ tool }: { tool: Tool }) {
  if (!tool.howItWorks) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-3">How {tool.name} Works</h2>
      <div className="text-gray-600 leading-relaxed whitespace-pre-line">{tool.howItWorks}</div>
    </section>
  );
}

function FAQSection({ faq }: { faq: { question: string; answer: string }[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faq.map((item, i) => (
          <details key={i} className="group border border-gray-200 rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:text-blue-600">
              {item.question}
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-gray-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function RelatedTools({ tool }: { tool: Tool }) {
  const related = getRelatedTools(tool.slug);
  if (related.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map(t => (
          <Link
            key={t.slug}
            href={`/${t.slug}`}
            className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900">{t.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{t.description.slice(0, 80)}...</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ExploreMoreTools() {
  const networkTools = siteConfig.networkTools;
  if (!networkTools || networkTools.length === 0) return null;
  const shuffled = [...networkTools].sort(() => 0.5 - Math.random()).slice(0, 6);
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Free Tools</h2>
      <p className="text-gray-500 text-sm mb-4">Discover more tools from our network — all free, browser-based, and privacy-first.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shuffled.map(t => (
          <a
            key={t.url}
            href={t.url}
            className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900">{t.name}</h3>
            <p className="text-xs text-purple-600 mt-1">{t.site}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function ToolLayout({
  tool,
  children,
}: {
  tool: Tool;
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: BASE_URL },
    { name: tool.categoryLabel, url: `${BASE_URL}/#${tool.category}` },
    { name: tool.name, url: `${BASE_URL}/${tool.slug}` },
  ]);
  const howToJsonLd = generateHowToJsonLd(tool, BASE_URL);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToJsonLd),
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/#${tool.category}`} className="hover:text-blue-600">{tool.categoryLabel}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{tool.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.title}</h1>
      <p className="text-gray-600 mb-8">{tool.description}</p>

      {children}

      <WhatIsSection tool={tool} />

      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-3">How to Use {tool.name}</h2>
        <p className="text-gray-600 leading-relaxed">{tool.howToUse}</p>
      </section>

      <HowItWorksSection tool={tool} />
      <UseCasesSection tool={tool} />
      <FAQSection faq={tool.faq} />
      <RelatedTools tool={tool} />
      <ExploreMoreTools />
    </div>
  );
}
