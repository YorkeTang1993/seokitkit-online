import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools';
import { generateToolJsonLd, generateFAQJsonLd, generateBreadcrumbJsonLd, BASE_URL } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import ToolClient from './client';

const tool = getToolBySlug('open-graph-generator')!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.join(', '),
  alternates: { canonical: `${BASE_URL}/${tool.slug}` },
  openGraph: { title: tool.title, description: tool.description, url: `${BASE_URL}/${tool.slug}`, type: 'website' },
};

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, BASE_URL);
  const faqJsonLd = tool.faq.length > 0 ? generateFAQJsonLd(tool.faq) : null;
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: BASE_URL },
    { name: tool.name, url: `${BASE_URL}/${tool.slug}` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ToolLayout tool={tool}>
        <ToolClient />
      </ToolLayout>
    </>
  );
}
