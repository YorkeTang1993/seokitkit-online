'use client';

import { useState, useCallback, useMemo } from 'react';

export default function ToolClient() {
  const [inputUrl, setInputUrl] = useState('https://www.example.com/page/?utm_source=google&utm_medium=cpc');
  const [forceHttps, setForceHttps] = useState(true);
  const [removeTrailingSlash, setRemoveTrailingSlash] = useState(true);
  const [removeWww, setRemoveWww] = useState(true);
  const [removeParams, setRemoveParams] = useState(true);
  const [copied, setCopied] = useState(false);

  const canonicalUrl = useMemo(() => {
    if (!inputUrl.trim()) return '';
    try {
      let url = new URL(inputUrl.trim());
      if (forceHttps && url.protocol === 'http:') {
        url = new URL(url.href.replace('http:', 'https:'));
      }
      if (removeWww && url.hostname.startsWith('www.')) {
        url.hostname = url.hostname.slice(4);
      }
      if (removeParams) {
        url.search = '';
      }
      let result = url.href;
      if (removeTrailingSlash && result.endsWith('/') && url.pathname !== '/') {
        result = result.slice(0, -1);
      }
      return result;
    } catch {
      return inputUrl.trim();
    }
  }, [inputUrl, forceHttps, removeTrailingSlash, removeWww, removeParams]);

  const variations = useMemo(() => {
    if (!canonicalUrl) return [];
    try {
      const url = new URL(canonicalUrl);
      const base = url.origin + url.pathname;
      const vars: string[] = [];

      // HTTP version
      if (url.protocol === 'https:') {
        vars.push(base.replace('https:', 'http:'));
      }
      // www version
      if (!url.hostname.startsWith('www.')) {
        vars.push(base.replace(url.hostname, `www.${url.hostname}`));
      } else {
        vars.push(base.replace(url.hostname, url.hostname.slice(4)));
      }
      // trailing slash
      if (base.endsWith('/')) {
        vars.push(base.slice(0, -1));
      } else if (url.pathname !== '/') {
        vars.push(base + '/');
      }
      // with params
      vars.push(base + '?utm_source=google');
      vars.push(base + '?ref=homepage');
      // http + www
      if (url.protocol === 'https:' && !url.hostname.startsWith('www.')) {
        vars.push(base.replace('https:', 'http:').replace(url.hostname, `www.${url.hostname}`));
      }

      return [...new Set(vars)].filter(v => v !== canonicalUrl);
    } catch {
      return [];
    }
  }, [canonicalUrl]);

  const linkTag = canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}" />` : '';

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(linkTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [linkTag]);

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter URL</label>
        <input
          type="text"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
          placeholder="https://www.example.com/page/?utm_source=google"
          className={`${inputCls} font-mono`}
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Force HTTPS', checked: forceHttps, onChange: setForceHttps },
          { label: 'Remove trailing slash', checked: removeTrailingSlash, onChange: setRemoveTrailingSlash },
          { label: 'Remove www', checked: removeWww, onChange: setRemoveWww },
          { label: 'Remove URL parameters', checked: removeParams, onChange: setRemoveParams },
        ].map(opt => (
          <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={opt.checked}
              onChange={e => opt.onChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Canonical URL Result */}
      {canonicalUrl && (
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <h3 className="text-sm font-medium text-green-800 mb-1">Canonical URL</h3>
          <p className="font-mono text-sm text-green-700 break-all">{canonicalUrl}</p>
        </div>
      )}

      {/* URL Variations */}
      {variations.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">URL Variations (all point to canonical)</h3>
          <div className="space-y-1">
            {variations.map((v, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">&#8627;</span>
                <span className="font-mono text-gray-500 break-all">{v}</span>
                <span className="text-xs text-blue-500 flex-shrink-0">&#8594; canonical</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      {linkTag && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Generated HTML</label>
            <button onClick={copyOutput} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {linkTag}
          </pre>
        </div>
      )}
    </div>
  );
}
