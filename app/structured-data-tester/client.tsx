'use client';

import { useState, useCallback } from 'react';

interface ValidationResult {
  type: 'error' | 'warning' | 'success';
  message: string;
}

const SCHEMA_REQUIREMENTS: Record<string, { required: string[]; recommended: string[] }> = {
  Article: { required: ['headline', 'author', 'datePublished'], recommended: ['image', 'dateModified', 'publisher', 'description'] },
  NewsArticle: { required: ['headline', 'author', 'datePublished'], recommended: ['image', 'dateModified', 'publisher', 'description'] },
  BlogPosting: { required: ['headline', 'author', 'datePublished'], recommended: ['image', 'dateModified', 'publisher', 'description'] },
  Product: { required: ['name'], recommended: ['image', 'description', 'offers', 'brand', 'sku'] },
  FAQPage: { required: ['mainEntity'], recommended: [] },
  HowTo: { required: ['name', 'step'], recommended: ['description', 'image', 'totalTime'] },
  Recipe: { required: ['name', 'recipeIngredient', 'recipeInstructions'], recommended: ['image', 'author', 'prepTime', 'cookTime', 'nutrition'] },
  Event: { required: ['name', 'startDate', 'location'], recommended: ['description', 'image', 'endDate', 'organizer', 'offers'] },
  LocalBusiness: { required: ['name', 'address'], recommended: ['telephone', 'openingHours', 'image', 'url', 'priceRange'] },
  Organization: { required: ['name'], recommended: ['url', 'logo', 'contactPoint', 'sameAs'] },
  Person: { required: ['name'], recommended: ['url', 'image', 'jobTitle', 'sameAs'] },
  WebSite: { required: ['name', 'url'], recommended: ['potentialAction', 'description'] },
  BreadcrumbList: { required: ['itemListElement'], recommended: [] },
  VideoObject: { required: ['name', 'description', 'thumbnailUrl', 'uploadDate'], recommended: ['duration', 'contentUrl', 'embedUrl'] },
  Review: { required: ['itemReviewed', 'author', 'reviewRating'], recommended: ['datePublished', 'reviewBody'] },
  WebApplication: { required: ['name'], recommended: ['url', 'description', 'applicationCategory', 'offers'] },
};

const SAMPLE = `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Improve SEO in 2024",
  "author": {
    "@type": "Person",
    "name": "Jane Doe"
  },
  "datePublished": "2024-01-15",
  "image": "https://example.com/image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "SEO Blog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}`;

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [validated, setValidated] = useState(false);
  const [detectedType, setDetectedType] = useState('');

  const validate = useCallback(() => {
    const issues: ValidationResult[] = [];
    const text = input.trim();

    if (!text) {
      setResults([{ type: 'error', message: 'Please paste your JSON-LD structured data.' }]);
      setValidated(true);
      setDetectedType('');
      return;
    }

    // Parse JSON
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch (e) {
      const err = e as Error;
      setResults([{ type: 'error', message: `Invalid JSON syntax: ${err.message}` }]);
      setValidated(true);
      setDetectedType('');
      return;
    }

    // Check @context
    if (!data['@context']) {
      issues.push({ type: 'error', message: 'Missing "@context" property. Should be "https://schema.org".' });
    } else if (data['@context'] !== 'https://schema.org' && data['@context'] !== 'http://schema.org') {
      issues.push({ type: 'warning', message: `@context is "${data['@context']}". Recommended: "https://schema.org".` });
    } else {
      issues.push({ type: 'success', message: '@context is correctly set to Schema.org.' });
    }

    // Check @type
    const schemaType = data['@type'] as string;
    if (!schemaType) {
      issues.push({ type: 'error', message: 'Missing "@type" property. Every structured data object needs a Schema.org type.' });
      setResults(issues);
      setValidated(true);
      setDetectedType('Unknown');
      return;
    }

    setDetectedType(schemaType);
    issues.push({ type: 'success', message: `Detected schema type: ${schemaType}` });

    // Check required and recommended fields
    const spec = SCHEMA_REQUIREMENTS[schemaType];
    if (spec) {
      for (const field of spec.required) {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
          issues.push({ type: 'success', message: `Required property "${field}" is present.` });
        } else {
          issues.push({ type: 'error', message: `Missing required property "${field}" for ${schemaType}.` });
        }
      }
      for (const field of spec.recommended) {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
          issues.push({ type: 'success', message: `Recommended property "${field}" is present.` });
        } else {
          issues.push({ type: 'warning', message: `Missing recommended property "${field}" for ${schemaType}.` });
        }
      }
    } else {
      issues.push({ type: 'warning', message: `Schema type "${schemaType}" is not in the common validation list. Basic JSON validation passed.` });
    }

    // Check for common sub-object patterns
    if (data.author && typeof data.author === 'object') {
      const author = data.author as Record<string, unknown>;
      if (!author['@type']) issues.push({ type: 'warning', message: 'Author object should include "@type" (e.g., "Person" or "Organization").' });
      if (!author.name) issues.push({ type: 'warning', message: 'Author object should include "name".' });
    }

    if (data.publisher && typeof data.publisher === 'object') {
      const pub = data.publisher as Record<string, unknown>;
      if (!pub['@type']) issues.push({ type: 'warning', message: 'Publisher object should include "@type" (typically "Organization").' });
      if (!pub.name) issues.push({ type: 'warning', message: 'Publisher object should include "name".' });
    }

    // FAQPage mainEntity validation
    if (schemaType === 'FAQPage' && Array.isArray(data.mainEntity)) {
      (data.mainEntity as Record<string, unknown>[]).forEach((item, i) => {
        if (item['@type'] !== 'Question') {
          issues.push({ type: 'error', message: `FAQ item #${i + 1}: @type should be "Question", found "${item['@type']}".` });
        }
        if (!item.name) {
          issues.push({ type: 'error', message: `FAQ item #${i + 1}: Missing "name" (the question text).` });
        }
        if (!item.acceptedAnswer) {
          issues.push({ type: 'error', message: `FAQ item #${i + 1}: Missing "acceptedAnswer".` });
        }
      });
    }

    setResults(issues);
    setValidated(true);
  }, [input]);

  const errorCount = results.filter(r => r.type === 'error').length;
  const warningCount = results.filter(r => r.type === 'warning').length;
  const successCount = results.filter(r => r.type === 'success').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 self-center">Load Sample:</span>
        <button onClick={() => setInput(SAMPLE)} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          Article
        </button>
        <button onClick={() => setInput(`{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "What is SEO?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "SEO stands for Search Engine Optimization."\n      }\n    }\n  ]\n}`)} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          FAQPage
        </button>
        <button onClick={() => { setInput(''); setResults([]); setValidated(false); setDetectedType(''); }} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          Clear
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paste your JSON-LD structured data</label>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setValidated(false); }}
          rows={14}
          placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button onClick={validate} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        Validate
      </button>

      {validated && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm">
            {detectedType && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">Type: <strong>{detectedType}</strong></span>}
            {errorCount > 0 && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg">Errors: <strong>{errorCount}</strong></span>}
            {warningCount > 0 && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg">Warnings: <strong>{warningCount}</strong></span>}
            {successCount > 0 && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">Passed: <strong>{successCount}</strong></span>}
          </div>

          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm ${
                  r.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                  r.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                  'bg-green-50 text-green-800 border border-green-200'
                }`}
              >
                <span className="font-medium">
                  {r.type === 'error' ? '✕ Error' : r.type === 'warning' ? '⚠ Warning' : '✓ Pass'}:
                </span>{' '}
                {r.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
