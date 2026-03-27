'use client';

import { useState, useCallback } from 'react';

interface Header {
  name: string;
  value: string;
  category: string;
  description: string;
}

function generateHeaders(url: string): Header[] {
  const parsed = (() => {
    try { return new URL(url); } catch { return null; }
  })();
  if (!parsed) return [];

  const isHttps = parsed.protocol === 'https:';
  const domain = parsed.hostname;
  const path = parsed.pathname;
  const ext = path.split('.').pop()?.toLowerCase() || '';
  const isHtml = !ext || ['html', 'htm', 'php', 'asp', 'aspx', 'jsp'].includes(ext);
  const now = new Date();

  const headers: Header[] = [
    { name: 'HTTP/1.1', value: '200 OK', category: 'General', description: 'The request was successful. The server returned the requested resource.' },
    { name: 'Date', value: now.toUTCString(), category: 'General', description: 'The date and time the response was sent by the server.' },
    { name: 'Content-Type', value: isHtml ? 'text/html; charset=UTF-8' : ext === 'json' ? 'application/json' : ext === 'css' ? 'text/css' : ext === 'js' ? 'application/javascript' : 'text/html; charset=UTF-8', category: 'General', description: 'The MIME type of the response body. Tells the browser how to interpret the content.' },
    { name: 'Server', value: 'nginx/1.24.0', category: 'General', description: 'The web server software. Sometimes hidden for security reasons.' },
    { name: 'Content-Length', value: String(Math.floor(Math.random() * 50000) + 5000), category: 'General', description: 'The size of the response body in bytes.' },
    { name: 'Connection', value: 'keep-alive', category: 'General', description: 'Whether the network connection stays open after the current transaction.' },
  ];

  // Caching
  headers.push(
    { name: 'Cache-Control', value: isHtml ? 'no-cache, must-revalidate' : 'public, max-age=31536000, immutable', category: 'Caching', description: 'Directives for caching mechanisms. Controls how and for how long the response is cached.' },
    { name: 'ETag', value: `"${Math.random().toString(36).slice(2, 14)}"`, category: 'Caching', description: 'A unique identifier for a specific version of the resource. Used for cache validation.' },
    { name: 'Vary', value: 'Accept-Encoding', category: 'Caching', description: 'Tells caches which request headers to consider when deciding if a cached response can be used.' },
  );

  if (!isHtml) {
    headers.push({ name: 'Expires', value: new Date(now.getTime() + 365 * 24 * 3600 * 1000).toUTCString(), category: 'Caching', description: 'The date after which the response is considered stale. Superseded by Cache-Control max-age.' });
  }

  // Security
  headers.push(
    { name: 'X-Content-Type-Options', value: 'nosniff', category: 'Security', description: 'Prevents browsers from MIME-sniffing the content-type. Reduces exposure to drive-by download attacks.' },
    { name: 'X-Frame-Options', value: 'SAMEORIGIN', category: 'Security', description: 'Controls whether the page can be displayed in an iframe. SAMEORIGIN allows framing by the same origin only.' },
    { name: 'X-XSS-Protection', value: '1; mode=block', category: 'Security', description: 'Enables the browser\'s built-in XSS filter. Blocks the page if an attack is detected.' },
    { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin', category: 'Security', description: 'Controls how much referrer information is sent with requests. Balances privacy and functionality.' },
  );

  if (isHttps) {
    headers.push(
      { name: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload', category: 'Security', description: 'Forces HTTPS for the domain and all subdomains. The preload directive requests inclusion in browser HSTS preload lists.' },
      { name: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'", category: 'Security', description: 'Defines content sources the browser should allow. Protects against XSS and data injection attacks.' },
    );
  }

  // SEO
  headers.push(
    { name: 'X-Robots-Tag', value: 'index, follow', category: 'SEO', description: 'Provides indexing directives to search engines at the HTTP level. Similar to the meta robots tag.' },
    { name: 'Link', value: `<${url}>; rel="canonical"`, category: 'SEO', description: 'Specifies the canonical URL for this resource. Helps prevent duplicate content issues.' },
  );

  // Compression
  headers.push(
    { name: 'Content-Encoding', value: 'gzip', category: 'Performance', description: 'The compression algorithm used on the response body. Reduces transfer size for faster loading.' },
    { name: 'Transfer-Encoding', value: 'chunked', category: 'Performance', description: 'The form of encoding used to transfer the response body. Chunked allows streaming responses.' },
  );

  // CORS
  headers.push(
    { name: 'Access-Control-Allow-Origin', value: `https://${domain}`, category: 'CORS', description: 'Specifies which origins can access the resource. Controls cross-origin resource sharing.' },
  );

  return headers;
}

export default function ToolClient() {
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<Header[]>([]);
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  const check = useCallback(() => {
    let normalizedUrl = url.trim();
    if (!normalizedUrl) return;
    if (!normalizedUrl.startsWith('http')) normalizedUrl = 'https://' + normalizedUrl;
    const result = generateHeaders(normalizedUrl);
    setHeaders(result);
    setChecked(true);
  }, [url]);

  const copyAll = useCallback(() => {
    const text = headers.map(h => `${h.name}: ${h.value}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [headers]);

  const categories = [...new Set(headers.map(h => h.category))];

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="https://example.com"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button onClick={check} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
          Check Headers
        </button>
      </div>

      {checked && headers.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Simulated HTTP response headers for educational reference</p>
            <button onClick={copyAll} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>

          {categories.map(cat => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">{cat}</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {headers.filter(h => h.category === cat).map((h, i) => (
                  <div key={i} className={`p-3 ${i > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50`}>
                    <div className="flex flex-wrap gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold text-blue-700">{h.name}:</span>
                      <span className="font-mono text-sm text-gray-800 break-all">{h.value}</span>
                    </div>
                    <p className="text-xs text-gray-500">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
