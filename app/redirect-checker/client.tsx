'use client';

import { useState } from 'react';

const STATUS_CODES = [
  { code: '200', name: 'OK', type: 'success', description: 'The request was successful. The page loaded correctly.' },
  { code: '301', name: 'Moved Permanently', type: 'redirect', description: 'The URL has permanently moved to a new location. Search engines transfer link equity to the new URL.' },
  { code: '302', name: 'Found (Temporary)', type: 'redirect', description: 'The URL has temporarily moved. Search engines may not transfer link equity to the new URL.' },
  { code: '303', name: 'See Other', type: 'redirect', description: 'The response can be found at a different URL using a GET request.' },
  { code: '307', name: 'Temporary Redirect', type: 'redirect', description: 'Similar to 302 but preserves the HTTP method. The client should use the same method for the redirected request.' },
  { code: '308', name: 'Permanent Redirect', type: 'redirect', description: 'Similar to 301 but preserves the HTTP method. The client should use the same method for future requests.' },
  { code: '404', name: 'Not Found', type: 'error', description: 'The requested page does not exist. This can hurt SEO if many pages return 404.' },
  { code: '410', name: 'Gone', type: 'error', description: 'The page has been permanently removed. Tells search engines to remove it from their index.' },
  { code: '500', name: 'Internal Server Error', type: 'error', description: 'The server encountered an error. Frequent 500 errors can negatively impact SEO.' },
  { code: '503', name: 'Service Unavailable', type: 'error', description: 'The server is temporarily unavailable. Google will retry later without removing the page from its index.' },
];

const EXAMPLE_CHAINS = [
  {
    name: 'Clean Redirect (Good)',
    steps: [
      { url: 'http://example.com/old-page', status: '301', label: '301 Permanent' },
      { url: 'https://example.com/new-page', status: '200', label: '200 OK' },
    ],
    verdict: 'good',
    explanation: 'A single 301 redirect is the ideal scenario. Link equity is passed efficiently to the new URL.',
  },
  {
    name: 'Redirect Chain (Bad)',
    steps: [
      { url: 'http://example.com/page', status: '301', label: '301' },
      { url: 'http://www.example.com/page', status: '301', label: '301' },
      { url: 'https://www.example.com/page', status: '301', label: '301' },
      { url: 'https://example.com/page', status: '200', label: '200 OK' },
    ],
    verdict: 'bad',
    explanation: 'Three redirects in a chain. Each hop loses ~15% link equity and adds latency. Fix by redirecting directly to the final URL.',
  },
  {
    name: 'Redirect Loop (Critical)',
    steps: [
      { url: 'https://example.com/page-a', status: '302', label: '302' },
      { url: 'https://example.com/page-b', status: '302', label: '302' },
      { url: 'https://example.com/page-a', status: '302', label: 'LOOP!' },
    ],
    verdict: 'critical',
    explanation: 'A redirect loop causes the page to be completely inaccessible. Browsers show an ERR_TOO_MANY_REDIRECTS error.',
  },
];

export default function ToolClient() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'redirect' | 'error'>('all');

  const filteredCodes = filterType === 'all'
    ? STATUS_CODES
    : STATUS_CODES.filter(c => c.type === filterType);

  const example = EXAMPLE_CHAINS[selectedExample];

  const verdictColor = {
    good: 'text-green-600 bg-green-50 border-green-200',
    bad: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    critical: 'text-red-600 bg-red-50 border-red-200',
  }[example.verdict];

  return (
    <div className="space-y-8">
      {/* Interactive Redirect Chain Examples */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Redirect Chain Examples</h3>
        <div className="flex gap-2 mb-4">
          {EXAMPLE_CHAINS.map((ex, i) => (
            <button
              key={i}
              onClick={() => setSelectedExample(i)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${selectedExample === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {ex.name}
            </button>
          ))}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex flex-col gap-2">
            {example.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-16 text-center px-2 py-1 rounded text-xs font-bold ${
                  step.status === '200' ? 'bg-green-100 text-green-700' :
                  step.status === '301' ? 'bg-blue-100 text-blue-700' :
                  step.status === '302' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {step.label}
                </div>
                {i < example.steps.length - 1 && (
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                )}
                <span className="text-sm font-mono text-gray-600 truncate">{step.url}</span>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-3 rounded-lg border ${verdictColor}`}>
            <p className="text-sm">{example.explanation}</p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Redirect Best Practices for SEO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">Do</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li>Use 301 redirects for permanent URL changes</li>
              <li>Redirect directly to the final destination URL</li>
              <li>Update internal links to point to the new URL</li>
              <li>Update your sitemap after implementing redirects</li>
              <li>Use 302 only for genuinely temporary changes</li>
            </ul>
          </div>
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h4 className="font-medium text-red-800 mb-2">Don&apos;t</h4>
            <ul className="space-y-1 text-sm text-red-700">
              <li>Create redirect chains (A to B to C)</li>
              <li>Use 302 redirects for permanent moves</li>
              <li>Redirect to pages that return 404 errors</li>
              <li>Create redirect loops (A to B to A)</li>
              <li>Redirect all pages to the homepage (soft 404)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* HTTP Status Code Reference */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">HTTP Status Code Reference</h3>
          <div className="flex gap-1">
            {(['all', 'redirect', 'error'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1 text-sm rounded-lg ${filterType === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {f === 'all' ? 'All' : f === 'redirect' ? 'Redirects' : 'Errors'}
              </button>
            ))}
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 font-medium text-gray-700">Code</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredCodes.map(c => (
                <tr key={c.code} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      c.type === 'success' ? 'bg-green-100 text-green-700' :
                      c.type === 'redirect' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {c.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
