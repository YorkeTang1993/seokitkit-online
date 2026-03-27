'use client';

import { useState, useCallback } from 'react';

interface ShortenedUrl {
  original: string;
  short: string;
  alias: string;
  created: string;
}

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36).slice(0, 6);
}

export default function ToolClient() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [history, setHistory] = useState<ShortenedUrl[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const shorten = useCallback(() => {
    let normalizedUrl = url.trim();
    if (!normalizedUrl) {
      setError('Please enter a URL.');
      return;
    }
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }

    const alias = customAlias.trim() || generateHash(normalizedUrl + Date.now());
    const shortUrl = `https://short.link/${alias}`;

    const entry: ShortenedUrl = {
      original: normalizedUrl,
      short: shortUrl,
      alias,
      created: new Date().toLocaleString(),
    };

    setHistory(prev => [entry, ...prev]);
    setUrl('');
    setCustomAlias('');
    setError('');
  }, [url, customAlias]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
        <strong>Demo Tool:</strong> This is a client-side demonstration. Generated short links are not persisted to a server and will not redirect. Use a production URL shortener service for real short links.
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Long URL</label>
          <input
            type="text"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && shorten()}
            placeholder="https://example.com/very/long/url/that/needs/shortening?param=value"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom Alias (optional)</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-mono">short.link/</span>
            <input
              type="text"
              value={customAlias}
              onChange={e => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
              placeholder="my-link"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button onClick={shorten} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Shorten URL
        </button>
      </div>

      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Shortened URLs</h3>
          <div className="space-y-3">
            {history.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-sm text-blue-600 font-semibold break-all">{item.short}</div>
                  <button
                    onClick={() => copyToClipboard(item.short)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    {copied === item.short ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="text-xs text-gray-500 font-mono break-all">{item.original}</div>
                <div className="text-xs text-gray-400">Created: {item.created}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
