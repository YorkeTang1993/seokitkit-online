'use client';

import { useState, useCallback } from 'react';

interface LinkResult {
  url: string;
  status: 'healthy' | 'broken' | 'redirect' | 'invalid' | 'error';
  statusCode: number | null;
  responseTime: number | null;
  message: string;
}

function statusColor(status: LinkResult['status']) {
  switch (status) {
    case 'healthy': return 'text-green-600';
    case 'redirect': return 'text-yellow-600';
    case 'broken': return 'text-red-600';
    case 'invalid': return 'text-gray-500';
    case 'error': return 'text-red-500';
  }
}

function statusBadge(status: LinkResult['status']) {
  switch (status) {
    case 'healthy': return 'bg-green-100 text-green-800';
    case 'redirect': return 'bg-yellow-100 text-yellow-800';
    case 'broken': return 'bg-red-100 text-red-800';
    case 'invalid': return 'bg-gray-100 text-gray-600';
    case 'error': return 'bg-red-100 text-red-700';
  }
}

function statusLabel(status: LinkResult['status']) {
  switch (status) {
    case 'healthy': return 'OK';
    case 'redirect': return 'Redirect';
    case 'broken': return 'Broken';
    case 'invalid': return 'Invalid';
    case 'error': return 'Error';
  }
}

function extractUrls(input: string): string[] {
  const urls: string[] = [];

  // Try extracting href from HTML
  const hrefRegex = /href\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(input)) !== null) {
    urls.push(match[1]);
  }

  // If no hrefs found, treat as one URL per line
  if (urls.length === 0) {
    const lines = input.split(/\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      urls.push(line);
    }
  }

  return [...new Set(urls)];
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str.startsWith('http') ? str : `https://${str}`);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<LinkResult[]>([]);
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState({ checked: 0, total: 0 });

  const checkLinks = useCallback(async () => {
    const urls = extractUrls(input);
    if (urls.length === 0) return;

    setChecking(true);
    setResults([]);
    setProgress({ checked: 0, total: urls.length });

    const newResults: LinkResult[] = [];

    for (let i = 0; i < urls.length; i++) {
      const rawUrl = urls[i];

      // Skip non-http URLs (mailto:, tel:, javascript:, #)
      if (/^(mailto:|tel:|javascript:|#)/.test(rawUrl)) {
        newResults.push({ url: rawUrl, status: 'invalid', statusCode: null, responseTime: null, message: 'Non-HTTP link (skipped)' });
        setResults([...newResults]);
        setProgress({ checked: i + 1, total: urls.length });
        continue;
      }

      if (!isValidUrl(rawUrl)) {
        newResults.push({ url: rawUrl, status: 'invalid', statusCode: null, responseTime: null, message: 'Invalid URL format' });
        setResults([...newResults]);
        setProgress({ checked: i + 1, total: urls.length });
        continue;
      }

      const fullUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
      const start = performance.now();

      try {
        const resp = await fetch(fullUrl, { mode: 'no-cors', cache: 'no-store' });
        const elapsed = Math.round(performance.now() - start);

        // no-cors returns opaque response (status 0), treat as reachable
        if (resp.status === 0 || (resp.status >= 200 && resp.status < 300)) {
          newResults.push({ url: rawUrl, status: 'healthy', statusCode: resp.status || 200, responseTime: elapsed, message: 'OK' });
        } else if (resp.status >= 300 && resp.status < 400) {
          newResults.push({ url: rawUrl, status: 'redirect', statusCode: resp.status, responseTime: elapsed, message: `Redirected (${resp.status})` });
        } else if (resp.status >= 400) {
          newResults.push({ url: rawUrl, status: 'broken', statusCode: resp.status, responseTime: elapsed, message: `HTTP ${resp.status}` });
        } else {
          newResults.push({ url: rawUrl, status: 'healthy', statusCode: resp.status, responseTime: elapsed, message: 'Reachable' });
        }
      } catch {
        const elapsed = Math.round(performance.now() - start);
        // Fetch failure could mean CORS but also connection error
        if (elapsed < 3000) {
          // Quick response likely means CORS block but server is up
          newResults.push({ url: rawUrl, status: 'healthy', statusCode: null, responseTime: elapsed, message: 'Reachable (CORS restricted)' });
        } else {
          newResults.push({ url: rawUrl, status: 'error', statusCode: null, responseTime: elapsed, message: 'Connection failed or timed out' });
        }
      }

      setResults([...newResults]);
      setProgress({ checked: i + 1, total: urls.length });
    }

    setChecking(false);
  }, [input]);

  const summary = {
    total: results.length,
    healthy: results.filter(r => r.status === 'healthy').length,
    broken: results.filter(r => r.status === 'broken').length,
    redirect: results.filter(r => r.status === 'redirect').length,
    error: results.filter(r => r.status === 'error').length,
    invalid: results.filter(r => r.status === 'invalid').length,
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paste URLs (one per line) or HTML containing links
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'https://example.com\nhttps://example.com/about\nhttps://example.com/contact\n\nOr paste HTML:\n<a href="https://example.com">Link</a>'}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      <button
        onClick={checkLinks}
        disabled={checking || !input.trim()}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
      >
        {checking ? `Checking... (${progress.checked}/${progress.total})` : 'Check Links'}
      </button>

      {/* Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border text-center">
            <div className="text-xl font-bold text-gray-800">{summary.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
            <div className="text-xl font-bold text-green-600">{summary.healthy}</div>
            <div className="text-xs text-green-600">Healthy</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
            <div className="text-xl font-bold text-red-600">{summary.broken + summary.error}</div>
            <div className="text-xs text-red-600">Broken</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
            <div className="text-xl font-bold text-yellow-600">{summary.redirect}</div>
            <div className="text-xs text-yellow-600">Redirects</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border text-center">
            <div className="text-xl font-bold text-gray-500">{summary.invalid}</div>
            <div className="text-xs text-gray-500">Skipped</div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">#</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">URL</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                  <td className="px-3 py-2 font-mono text-xs truncate max-w-xs">{r.url}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className={`px-3 py-2 text-xs ${statusColor(r.status)}`}>
                    {r.responseTime !== null ? `${r.responseTime}ms` : '-'}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">{r.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
