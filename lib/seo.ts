import { Tool } from './tools';
import { siteConfig } from './site-config';

export function generateToolJsonLd(tool: Tool, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `${baseUrl}/${tool.slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateFAQJsonLd(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateHowToJsonLd(tool: Tool, baseUrl: string) {
  // Split howToUse into sentences as steps
  const sentences = tool.howToUse
    .split(/\.(?:\s|$)/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use ${tool.name}`,
    description: `Step-by-step guide to using the free online ${tool.name} tool.`,
    totalTime: 'PT1M',
    tool: {
      '@type': 'HowToTool',
      name: 'Web Browser',
    },
    step: sentences.map((sentence, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Step ${i + 1}`,
      text: sentence.endsWith('.') ? sentence : `${sentence}.`,
      url: `${baseUrl}/${tool.slug}`,
    })),
  };
}

export function generateWebSiteJsonLd(baseUrl: string, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export const BASE_URL = siteConfig.domain;
export const SITE_NAME = siteConfig.name;
export const SITE_DESCRIPTION = siteConfig.description;
