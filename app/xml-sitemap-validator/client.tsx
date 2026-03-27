'use client';

import { useState, useCallback } from 'react';

interface ValidationResult {
  type: 'error' | 'warning' | 'success';
  message: string;
}

const SAMPLE_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

const VALID_CHANGEFREQ = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [urlCount, setUrlCount] = useState(0);
  const [validated, setValidated] = useState(false);

  const validate = useCallback(() => {
    const issues: ValidationResult[] = [];
    const text = input.trim();

    if (!text) {
      setResults([{ type: 'error', message: 'Please paste your XML sitemap content.' }]);
      setValidated(true);
      setUrlCount(0);
      return;
    }

    // Check XML declaration
    if (!text.startsWith('<?xml')) {
      issues.push({ type: 'warning', message: 'Missing XML declaration (<?xml version="1.0" encoding="UTF-8"?>). Recommended for proper XML parsing.' });
    }

    // Check urlset root element
    if (!text.includes('<urlset')) {
      issues.push({ type: 'error', message: 'Missing <urlset> root element. A valid sitemap must have <urlset> as the root element.' });
    }

    // Check xmlns namespace
    if (!text.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') && !text.includes("xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'")) {
      issues.push({ type: 'warning', message: 'Missing or incorrect xmlns namespace. Should be "http://www.sitemaps.org/schemas/sitemap/0.9".' });
    }

    // Check closing urlset
    if (text.includes('<urlset') && !text.includes('</urlset>')) {
      issues.push({ type: 'error', message: 'Missing closing </urlset> tag.' });
    }

    // Extract and validate URLs
    const urlBlocks = text.match(/<url>[\s\S]*?<\/url>/g) || [];
    setUrlCount(urlBlocks.length);

    if (urlBlocks.length === 0) {
      issues.push({ type: 'error', message: 'No <url> entries found in the sitemap.' });
    }

    if (urlBlocks.length > 50000) {
      issues.push({ type: 'error', message: `Sitemap contains ${urlBlocks.length} URLs. Maximum allowed is 50,000 per sitemap file.` });
    }

    urlBlocks.forEach((block, index) => {
      const num = index + 1;

      // Check <loc>
      const locMatch = block.match(/<loc>(.*?)<\/loc>/);
      if (!locMatch) {
        issues.push({ type: 'error', message: `URL #${num}: Missing required <loc> tag.` });
      } else {
        const loc = locMatch[1].trim();
        if (!loc.startsWith('http://') && !loc.startsWith('https://')) {
          issues.push({ type: 'error', message: `URL #${num}: <loc> must be a full URL starting with http:// or https://. Found: "${loc}"` });
        }
        if (loc.includes(' ')) {
          issues.push({ type: 'error', message: `URL #${num}: <loc> contains spaces. URLs must be properly encoded.` });
        }
        if (loc.includes('&') && !loc.includes('&amp;')) {
          issues.push({ type: 'warning', message: `URL #${num}: <loc> contains unescaped "&". Use "&amp;" in XML.` });
        }
      }

      // Check <lastmod>
      const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/);
      if (lastmodMatch) {
        const date = lastmodMatch[1].trim();
        const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)?)?$/;
        if (!dateRegex.test(date)) {
          issues.push({ type: 'error', message: `URL #${num}: Invalid <lastmod> date format "${date}". Use W3C Datetime format (YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+00:00).` });
        }
      }

      // Check <changefreq>
      const freqMatch = block.match(/<changefreq>(.*?)<\/changefreq>/);
      if (freqMatch) {
        const freq = freqMatch[1].trim().toLowerCase();
        if (!VALID_CHANGEFREQ.includes(freq)) {
          issues.push({ type: 'error', message: `URL #${num}: Invalid <changefreq> value "${freq}". Must be one of: ${VALID_CHANGEFREQ.join(', ')}.` });
        }
      }

      // Check <priority>
      const priorityMatch = block.match(/<priority>(.*?)<\/priority>/);
      if (priorityMatch) {
        const p = parseFloat(priorityMatch[1].trim());
        if (isNaN(p) || p < 0 || p > 1) {
          issues.push({ type: 'error', message: `URL #${num}: Invalid <priority> value "${priorityMatch[1].trim()}". Must be between 0.0 and 1.0.` });
        }
      }
    });

    // Check for basic XML well-formedness
    const openTags = (text.match(/<(?!\/|!|\?)[a-zA-Z][^>]*[^/]>/g) || []).length;
    const closeTags = (text.match(/<\/[a-zA-Z][^>]*>/g) || []).length;
    if (Math.abs(openTags - closeTags) > 2) {
      issues.push({ type: 'warning', message: 'Possible mismatched open/close tags detected. Check your XML structure carefully.' });
    }

    if (issues.length === 0) {
      issues.push({ type: 'success', message: `Sitemap is valid! Found ${urlBlocks.length} URL(s) with no errors.` });
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
        <button onClick={() => setInput(SAMPLE_SITEMAP)} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          Valid Sitemap
        </button>
        <button onClick={() => { setInput(''); setResults([]); setValidated(false); setUrlCount(0); }} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          Clear
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paste your XML sitemap</label>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setValidated(false); }}
          rows={14}
          placeholder="Paste your sitemap.xml content here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button onClick={validate} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        Validate Sitemap
      </button>

      {validated && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-gray-100 rounded-lg">URLs found: <strong>{urlCount}</strong></span>
            {errorCount > 0 && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg">Errors: <strong>{errorCount}</strong></span>}
            {warningCount > 0 && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg">Warnings: <strong>{warningCount}</strong></span>}
            {successCount > 0 && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">Valid</span>}
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
