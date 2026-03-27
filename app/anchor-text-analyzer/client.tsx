'use client';

import { useState, useCallback, useMemo } from 'react';

interface AnchorLink {
  text: string;
  href: string;
  type: 'exact-match' | 'partial-match' | 'branded' | 'naked-url' | 'generic' | 'image' | 'empty';
}

interface AnalysisResult {
  links: AnchorLink[];
  distribution: { type: string; count: number; percentage: number; color: string }[];
  totalLinks: number;
  uniqueAnchors: number;
}

const GENERIC_ANCHORS = [
  'click here', 'here', 'read more', 'learn more', 'more', 'this', 'link',
  'visit', 'website', 'page', 'go', 'see more', 'view', 'details',
  'check it out', 'find out more', 'continue reading', 'source',
];

function classifyAnchor(text: string, href: string): AnchorLink['type'] {
  const trimmed = text.trim();

  if (!trimmed) return 'empty';

  // Image link (contains img tag or [image])
  if (/\[image\]|<img/i.test(trimmed)) return 'image';

  // Naked URL
  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) return 'naked-url';

  // Generic
  if (GENERIC_ANCHORS.some(g => trimmed.toLowerCase() === g)) return 'generic';

  // Branded (contains .com/.org/.net or looks like a brand name - short, capitalized)
  if (/\.(com|org|net|io|co)/i.test(trimmed)) return 'branded';

  // If the href contains most words from the anchor, it's likely exact/partial match
  const words = trimmed.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (words.length > 0) {
    const hrefLower = href.toLowerCase();
    const matchCount = words.filter(w => hrefLower.includes(w)).length;
    if (matchCount / words.length > 0.6) return 'exact-match';
    if (matchCount > 0) return 'partial-match';
  }

  // Default to partial-match for descriptive text
  return 'partial-match';
}

const TYPE_LABELS: Record<string, { label: string; color: string; barColor: string }> = {
  'exact-match': { label: 'Exact Match', color: 'text-red-600', barColor: 'bg-red-500' },
  'partial-match': { label: 'Partial Match', color: 'text-blue-600', barColor: 'bg-blue-500' },
  'branded': { label: 'Branded', color: 'text-purple-600', barColor: 'bg-purple-500' },
  'naked-url': { label: 'Naked URL', color: 'text-green-600', barColor: 'bg-green-500' },
  'generic': { label: 'Generic', color: 'text-yellow-600', barColor: 'bg-yellow-500' },
  'image': { label: 'Image Link', color: 'text-gray-600', barColor: 'bg-gray-500' },
  'empty': { label: 'Empty', color: 'text-gray-400', barColor: 'bg-gray-300' },
};

export default function ToolClient() {
  const [html, setHtml] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(() => {
    if (!html.trim()) return;

    // Parse anchor tags from HTML
    const anchorRegex = /<a\s[^>]*href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
    const links: AnchorLink[] = [];
    let match;

    while ((match = anchorRegex.exec(html)) !== null) {
      const href = match[1];
      let text = match[2];

      // Check if it contains an img tag
      if (/<img/i.test(text)) {
        text = '[image]';
      } else {
        // Strip HTML tags from anchor text
        text = text.replace(/<[^>]+>/g, '').trim();
      }

      links.push({
        text,
        href,
        type: classifyAnchor(text, href),
      });
    }

    // Calculate distribution
    const typeCounts: Record<string, number> = {};
    for (const link of links) {
      typeCounts[link.type] = (typeCounts[link.type] || 0) + 1;
    }

    const distribution = Object.entries(typeCounts)
      .map(([type, count]) => ({
        type,
        count,
        percentage: links.length > 0 ? Math.round((count / links.length) * 100) : 0,
        color: TYPE_LABELS[type]?.barColor || 'bg-gray-400',
      }))
      .sort((a, b) => b.count - a.count);

    const uniqueAnchors = new Set(links.map(l => l.text.toLowerCase())).size;

    setResult({ links, distribution, totalLinks: links.length, uniqueAnchors });
  }, [html]);

  const sampleHtml = `<a href="https://example.com">Example.com</a>
<a href="https://example.com/seo-guide">SEO Guide</a>
<a href="https://example.com/tips">Click here</a>
<a href="https://example.com/blog">Learn more</a>
<a href="https://example.com/tools">Best SEO tools for beginners</a>
<a href="https://example.com">https://example.com</a>
<a href="https://example.com/about">About Example</a>
<a href="https://example.com/contact">Visit website</a>`;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">Paste HTML Content</label>
          <button
            onClick={() => setHtml(sampleHtml)}
            className="text-xs text-blue-600 hover:underline"
          >
            Load Sample
          </button>
        </div>
        <textarea
          value={html}
          onChange={e => setHtml(e.target.value)}
          placeholder='<a href="https://example.com">Anchor Text</a>'
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      <button
        onClick={analyze}
        disabled={!html.trim()}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
      >
        Analyze Anchor Text
      </button>

      {result && result.totalLinks === 0 && (
        <p className="text-yellow-600 text-sm">No anchor tags (&lt;a href=&quot;...&quot;&gt;) found in the HTML.</p>
      )}

      {result && result.totalLinks > 0 && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">{result.totalLinks}</div>
              <div className="text-xs text-blue-600">Total Links</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-700">{result.uniqueAnchors}</div>
              <div className="text-xs text-purple-600">Unique Anchors</div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">{result.distribution.length}</div>
              <div className="text-xs text-green-600">Anchor Types</div>
            </div>
          </div>

          {/* Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Anchor Text Distribution</h3>
            <div className="space-y-3">
              {result.distribution.map(d => (
                <div key={d.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${TYPE_LABELS[d.type]?.color || 'text-gray-600'}`}>
                      {TYPE_LABELS[d.type]?.label || d.type}
                    </span>
                    <span className="text-sm text-gray-500">{d.count} ({d.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${d.color}`} style={{ width: `${d.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Check */}
          {result.distribution.some(d => d.type === 'exact-match' && d.percentage > 30) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm font-medium text-red-700 mb-1">Warning: Over-optimized Anchor Text</div>
              <p className="text-sm text-red-600">
                Your exact-match anchor text ratio is above 30%. This could appear unnatural to search engines and may trigger algorithmic penalties. Consider diversifying your anchor text with branded, generic, and naked URL anchors.
              </p>
            </div>
          )}

          {/* Links Table */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">All Links ({result.totalLinks})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Anchor Text</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">URL</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.links.map((link, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium max-w-xs truncate">{link.text || '(empty)'}</td>
                      <td className="px-3 py-2 font-mono text-xs text-gray-500 max-w-xs truncate">{link.href}</td>
                      <td className="px-3 py-2">
                        <span className={`text-xs font-medium ${TYPE_LABELS[link.type]?.color || 'text-gray-500'}`}>
                          {TYPE_LABELS[link.type]?.label || link.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
