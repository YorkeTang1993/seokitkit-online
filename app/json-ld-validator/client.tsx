'use client';

import { useState, useCallback } from 'react';

interface ValidationResult {
  type: 'error' | 'warning';
  message: string;
}

const SCHEMA_REQUIRED_FIELDS: Record<string, string[]> = {
  Article: ['headline', 'author', 'datePublished', 'image'],
  NewsArticle: ['headline', 'author', 'datePublished', 'image'],
  BlogPosting: ['headline', 'author', 'datePublished'],
  Product: ['name', 'image', 'offers'],
  FAQPage: ['mainEntity'],
  LocalBusiness: ['name', 'address'],
  Organization: ['name', 'url'],
  Person: ['name'],
  Event: ['name', 'startDate', 'location'],
  Recipe: ['name', 'image', 'recipeIngredient', 'recipeInstructions'],
  HowTo: ['name', 'step'],
  BreadcrumbList: ['itemListElement'],
  VideoObject: ['name', 'description', 'thumbnailUrl', 'uploadDate'],
  WebSite: ['name', 'url'],
  WebPage: ['name'],
  Review: ['itemReviewed', 'author', 'reviewRating'],
  Course: ['name', 'description', 'provider'],
  SoftwareApplication: ['name', 'operatingSystem', 'applicationCategory'],
  JobPosting: ['title', 'description', 'datePosted', 'hiringOrganization'],
};

const SCHEMA_RECOMMENDED_FIELDS: Record<string, string[]> = {
  Article: ['publisher', 'dateModified', 'description', 'mainEntityOfPage'],
  Product: ['description', 'brand', 'sku', 'review', 'aggregateRating'],
  FAQPage: [],
  LocalBusiness: ['telephone', 'openingHoursSpecification', 'image', 'priceRange'],
  Event: ['endDate', 'description', 'image', 'organizer', 'offers'],
  Recipe: ['description', 'prepTime', 'cookTime', 'nutrition'],
  VideoObject: ['contentUrl', 'duration', 'embedUrl'],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateJsonLd(input: string): { results: ValidationResult[]; parsed: Record<string, any> | null } {
  const results: ValidationResult[] = [];

  if (!input.trim()) {
    results.push({ type: 'error', message: 'Input is empty. Please paste your JSON-LD code.' });
    return { results, parsed: null };
  }

  // Try to parse JSON
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    results.push({ type: 'error', message: `Invalid JSON syntax: ${msg}` });
    return { results, parsed: null };
  }

  // Handle arrays (multiple JSON-LD blocks)
  const items = Array.isArray(parsed) ? parsed : [parsed];

  items.forEach((item, idx) => {
    const prefix = items.length > 1 ? `[Item ${idx + 1}] ` : '';
    const obj = item as Record<string, unknown>;

    // Check @context
    if (!obj['@context']) {
      results.push({ type: 'error', message: `${prefix}Missing @context. Expected "https://schema.org" or "http://schema.org".` });
    } else {
      const ctx = String(obj['@context']);
      if (!ctx.includes('schema.org')) {
        results.push({ type: 'warning', message: `${prefix}@context is "${ctx}". Expected "https://schema.org".` });
      } else if (ctx === 'http://schema.org') {
        results.push({ type: 'warning', message: `${prefix}@context uses HTTP. Recommend using "https://schema.org" instead.` });
      }
    }

    // Check @type
    if (!obj['@type']) {
      results.push({ type: 'error', message: `${prefix}Missing @type. Every JSON-LD block must have a @type (e.g., "Article", "Product").` });
    } else {
      const schemaType = String(obj['@type']);

      // Check required fields
      const requiredFields = SCHEMA_REQUIRED_FIELDS[schemaType];
      if (requiredFields) {
        requiredFields.forEach(field => {
          if (!(field in obj) || obj[field] === '' || obj[field] === null || obj[field] === undefined) {
            results.push({ type: 'error', message: `${prefix}Missing required field "${field}" for type "${schemaType}".` });
          }
        });
      } else {
        results.push({ type: 'warning', message: `${prefix}Schema type "${schemaType}" is not in our validation database. Basic checks only.` });
      }

      // Check recommended fields
      const recommendedFields = SCHEMA_RECOMMENDED_FIELDS[schemaType];
      if (recommendedFields) {
        recommendedFields.forEach(field => {
          if (!(field in obj)) {
            results.push({ type: 'warning', message: `${prefix}Recommended field "${field}" is missing for type "${schemaType}".` });
          }
        });
      }

      // Validate specific field formats
      if (obj['datePublished'] && typeof obj['datePublished'] === 'string') {
        if (!/^\d{4}-\d{2}-\d{2}/.test(obj['datePublished'] as string)) {
          results.push({ type: 'error', message: `${prefix}"datePublished" should be in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss).` });
        }
      }
      if (obj['dateModified'] && typeof obj['dateModified'] === 'string') {
        if (!/^\d{4}-\d{2}-\d{2}/.test(obj['dateModified'] as string)) {
          results.push({ type: 'error', message: `${prefix}"dateModified" should be in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss).` });
        }
      }
      if (obj['startDate'] && typeof obj['startDate'] === 'string') {
        if (!/^\d{4}-\d{2}-\d{2}/.test(obj['startDate'] as string)) {
          results.push({ type: 'error', message: `${prefix}"startDate" should be in ISO 8601 format.` });
        }
      }
      if (obj['url'] && typeof obj['url'] === 'string') {
        if (!/^https?:\/\//.test(obj['url'] as string)) {
          results.push({ type: 'warning', message: `${prefix}"url" should start with http:// or https://.` });
        }
      }
      if (obj['image']) {
        const img = obj['image'];
        if (typeof img === 'string' && !/^https?:\/\//.test(img)) {
          results.push({ type: 'warning', message: `${prefix}"image" URL should start with https://.` });
        }
      }

      // Check FAQPage mainEntity structure
      if (schemaType === 'FAQPage' && Array.isArray(obj['mainEntity'])) {
        (obj['mainEntity'] as Record<string, unknown>[]).forEach((faqItem, faqIdx) => {
          if (faqItem['@type'] !== 'Question') {
            results.push({ type: 'error', message: `${prefix}FAQ item ${faqIdx + 1}: @type should be "Question", found "${faqItem['@type']}".` });
          }
          if (!faqItem['name']) {
            results.push({ type: 'error', message: `${prefix}FAQ item ${faqIdx + 1}: Missing "name" (the question text).` });
          }
          if (!faqItem['acceptedAnswer']) {
            results.push({ type: 'error', message: `${prefix}FAQ item ${faqIdx + 1}: Missing "acceptedAnswer".` });
          } else {
            const answer = faqItem['acceptedAnswer'] as Record<string, unknown>;
            if (answer['@type'] !== 'Answer') {
              results.push({ type: 'error', message: `${prefix}FAQ item ${faqIdx + 1}: acceptedAnswer @type should be "Answer".` });
            }
            if (!answer['text']) {
              results.push({ type: 'error', message: `${prefix}FAQ item ${faqIdx + 1}: acceptedAnswer missing "text".` });
            }
          }
        });
      }

      // Check Product offers
      if (schemaType === 'Product' && obj['offers']) {
        const offers = obj['offers'] as Record<string, unknown>;
        if (!offers['@type']) {
          results.push({ type: 'warning', message: `${prefix}offers should have @type "Offer" or "AggregateOffer".` });
        }
        if (!offers['price'] && offers['@type'] !== 'AggregateOffer') {
          results.push({ type: 'warning', message: `${prefix}offers is missing "price".` });
        }
        if (!offers['priceCurrency']) {
          results.push({ type: 'warning', message: `${prefix}offers is missing "priceCurrency" (e.g., "USD").` });
        }
      }
    }
  });

  if (results.length === 0) {
    results.push({ type: 'warning', message: 'No issues found! Your JSON-LD looks valid.' });
  }

  return { results, parsed };
}

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ValidationResult[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsed, setParsed] = useState<Record<string, any> | null>(null);
  const [hasValidated, setHasValidated] = useState(false);

  const handleValidate = useCallback(() => {
    const { results: r, parsed: p } = validateJsonLd(input);
    setResults(r);
    setParsed(p);
    setHasValidated(true);
  }, [input]);

  const loadExample = () => {
    const example = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Optimize Your Website for SEO",
      "author": { "@type": "Person", "name": "John Doe" },
      "datePublished": "2026-01-15",
      "image": "https://example.com/seo-guide.jpg",
      "publisher": { "@type": "Organization", "name": "SEO Blog", "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" } },
      "description": "A comprehensive guide to optimizing your website for search engines."
    }, null, 2);
    setInput(example);
    setResults([]);
    setParsed(null);
    setHasValidated(false);
  };

  const errorCount = results.filter(r => r.type === 'error').length;
  const warningCount = results.filter(r => r.type === 'warning').length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Paste your JSON-LD code</label>
          <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-800 underline">
            Load example
          </button>
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setHasValidated(false); }}
          rows={14}
          placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Your Article Title",\n  ...\n}'}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          spellCheck={false}
        />
      </div>

      <button
        onClick={handleValidate}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Validate JSON-LD
      </button>

      {hasValidated && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex gap-4">
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${errorCount > 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {errorCount} Error{errorCount !== 1 ? 's' : ''}
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${warningCount > 0 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {warningCount} Warning{warningCount !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                  r.type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                }`}
              >
                <span className="font-bold shrink-0">
                  {r.type === 'error' ? '\u2716' : '\u26A0'}
                </span>
                <span>{r.message}</span>
              </div>
            ))}
          </div>

          {/* Parsed Preview */}
          {parsed && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Parsed Structure</h3>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs font-mono overflow-auto max-h-64">
                {JSON.stringify(parsed, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
