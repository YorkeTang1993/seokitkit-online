'use client';

import { useState, useCallback } from 'react';

interface HeadingItem {
  level: number;
  text: string;
  tag: string;
}

interface Issue {
  type: 'error' | 'warning';
  message: string;
}

function extractHeadings(html: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    // Strip inner HTML tags to get text only
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    headings.push({ level, text, tag: `H${level}` });
  }
  return headings;
}

function analyzeHeadings(headings: HeadingItem[]): Issue[] {
  const issues: Issue[] = [];

  if (headings.length === 0) {
    issues.push({ type: 'error', message: 'No heading tags found in the HTML. Every page should have at least an H1 tag.' });
    return issues;
  }

  // Check for H1
  const h1s = headings.filter(h => h.level === 1);
  if (h1s.length === 0) {
    issues.push({ type: 'error', message: 'Missing H1 tag. Every page should have exactly one H1 for the main title.' });
  } else if (h1s.length > 1) {
    issues.push({ type: 'warning', message: `Multiple H1 tags found (${h1s.length}). Best practice is to have exactly one H1 per page.` });
  }

  // Check if first heading is H1
  if (headings[0].level !== 1) {
    issues.push({ type: 'warning', message: `First heading is ${headings[0].tag} instead of H1. The first heading on the page should typically be an H1.` });
  }

  // Check for skipped levels
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1].level;
    const curr = headings[i].level;
    if (curr > prev + 1) {
      issues.push({
        type: 'error',
        message: `Skipped heading level: ${headings[i - 1].tag} \u2192 ${headings[i].tag} (heading #${i + 1}: "${headings[i].text.substring(0, 50)}"). Should not skip from H${prev} to H${curr}.`,
      });
    }
  }

  // Check for empty headings
  headings.forEach((h, i) => {
    if (!h.text || h.text.length === 0) {
      issues.push({ type: 'error', message: `Empty ${h.tag} tag at position ${i + 1}. Headings should have descriptive text content.` });
    }
  });

  // Check for long headings
  headings.forEach((h, i) => {
    if (h.text.length > 70) {
      issues.push({ type: 'warning', message: `${h.tag} at position ${i + 1} is ${h.text.length} characters long ("${h.text.substring(0, 50)}..."). Keep headings under 70 characters for best SEO.` });
    }
  });

  // Check for duplicate headings
  const seen = new Map<string, number>();
  headings.forEach((h) => {
    const key = `${h.tag}:${h.text.toLowerCase()}`;
    seen.set(key, (seen.get(key) || 0) + 1);
  });
  seen.forEach((count, key) => {
    if (count > 1) {
      const [tag, text] = key.split(':');
      issues.push({ type: 'warning', message: `Duplicate ${tag}: "${text}" appears ${count} times. Use unique headings for better content structure.` });
    }
  });

  return issues;
}

export default function ToolClient() {
  const [html, setHtml] = useState('');
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = useCallback(() => {
    const extracted = extractHeadings(html);
    setHeadings(extracted);
    setIssues(analyzeHeadings(extracted));
    setHasAnalyzed(true);
  }, [html]);

  const loadExample = () => {
    setHtml(`<h1>Complete Guide to On-Page SEO</h1>
<h2>What is On-Page SEO?</h2>
<p>On-page SEO refers to optimizing individual web pages...</p>
<h2>Key On-Page SEO Factors</h2>
<h3>Title Tags</h3>
<p>Title tags are one of the most important...</p>
<h3>Meta Descriptions</h3>
<p>Meta descriptions provide a summary...</p>
<h4>Writing Effective Meta Descriptions</h4>
<p>To write great meta descriptions...</p>
<h2>Heading Structure</h2>
<h3>Using H1 Tags</h3>
<p>Every page should have one H1...</p>
<h3>H2 and H3 Hierarchy</h3>
<p>Use H2 for main sections and H3 for subsections...</p>
<h2>Conclusion</h2>
<p>On-page SEO is critical for rankings...</p>`);
    setHeadings([]);
    setIssues([]);
    setHasAnalyzed(false);
  };

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const levelColors: Record<number, string> = {
    1: 'bg-blue-100 text-blue-800 border-blue-300',
    2: 'bg-green-100 text-green-800 border-green-300',
    3: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    4: 'bg-orange-100 text-orange-800 border-orange-300',
    5: 'bg-purple-100 text-purple-800 border-purple-300',
    6: 'bg-pink-100 text-pink-800 border-pink-300',
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Paste your HTML content</label>
          <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-800 underline">
            Load example
          </button>
        </div>
        <textarea
          value={html}
          onChange={e => { setHtml(e.target.value); setHasAnalyzed(false); }}
          rows={12}
          placeholder="<h1>Your Page Title</h1>\n<h2>Section One</h2>\n<h3>Subsection</h3>\n..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          spellCheck={false}
        />
      </div>

      <button
        onClick={handleAnalyze}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Analyze Headings
      </button>

      {hasAnalyzed && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{headings.length}</div>
              <div className="text-xs text-gray-500 mt-1">Total Headings</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{headings.filter(h => h.level === 1).length}</div>
              <div className="text-xs text-gray-500 mt-1">H1 Tags</div>
            </div>
            <div className={`border rounded-lg p-4 text-center ${errorCount > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className={`text-2xl font-bold ${errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{errorCount}</div>
              <div className="text-xs text-gray-500 mt-1">Errors</div>
            </div>
            <div className={`border rounded-lg p-4 text-center ${warningCount > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
              <div className={`text-2xl font-bold ${warningCount > 0 ? 'text-yellow-600' : 'text-green-600'}`}>{warningCount}</div>
              <div className="text-xs text-gray-500 mt-1">Warnings</div>
            </div>
          </div>

          {/* Heading Tree */}
          {headings.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Heading Hierarchy</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-1.5">
                {headings.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2"
                    style={{ paddingLeft: `${(h.level - 1) * 24}px` }}
                  >
                    <span className={`shrink-0 px-2 py-0.5 text-xs font-bold rounded border ${levelColors[h.level]}`}>
                      {h.tag}
                    </span>
                    <span className="text-sm text-gray-800 truncate">
                      {h.text || <span className="italic text-gray-400">(empty)</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {issues.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Issues Found</h3>
              <div className="space-y-2">
                {issues.map((issue, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                      issue.type === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                    }`}
                  >
                    <span className="font-bold shrink-0">
                      {issue.type === 'error' ? '\u2716' : '\u26A0'}
                    </span>
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {issues.length === 0 && headings.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              \u2714 No issues found! Your heading structure looks good.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
