'use client';

import { useState, useCallback, useMemo } from 'react';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const CHANGEFREQS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
const PRIORITIES = ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1', '0.0'];

function newUrl(): SitemapUrl {
  return { loc: '', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.5' };
}

export default function ToolClient() {
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { loc: 'https://example.com/', lastmod: '2026-03-19', changefreq: 'daily', priority: '1.0' },
    { loc: 'https://example.com/about', lastmod: '2026-03-15', changefreq: 'monthly', priority: '0.8' },
  ]);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    for (const u of urls) {
      if (!u.loc.trim()) continue;
      lines.push('  <url>');
      lines.push(`    <loc>${u.loc.trim()}</loc>`);
      if (u.lastmod) lines.push(`    <lastmod>${u.lastmod}</lastmod>`);
      lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
      lines.push(`    <priority>${u.priority}</priority>`);
      lines.push('  </url>');
    }
    lines.push('</urlset>');
    return lines.join('\n');
  }, [urls]);

  const addUrl = useCallback(() => {
    setUrls(prev => [...prev, newUrl()]);
  }, []);

  const removeUrl = useCallback((index: number) => {
    setUrls(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateUrl = useCallback((index: number, field: keyof SitemapUrl, value: string) => {
    setUrls(prev => prev.map((u, i) => i === index ? { ...u, [field]: value } : u));
  }, []);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const inputCls = 'px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {urls.map((u, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">URL #{i + 1}</span>
              {urls.length > 1 && (
                <button onClick={() => removeUrl(i)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input type="text" value={u.loc} onChange={e => updateUrl(i, 'loc', e.target.value)} placeholder="https://example.com/page" className={`w-full ${inputCls} font-mono`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Modified</label>
                <input type="date" value={u.lastmod} onChange={e => updateUrl(i, 'lastmod', e.target.value)} className={`w-full ${inputCls}`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Frequency</label>
                <select value={u.changefreq} onChange={e => updateUrl(i, 'changefreq', e.target.value)} className={`w-full ${inputCls}`}>
                  {CHANGEFREQS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={u.priority} onChange={e => updateUrl(i, 'priority', e.target.value)} className={`w-full ${inputCls}`}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addUrl} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add URL</button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Generated XML Sitemap</label>
          <button onClick={copyOutput} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-x-auto min-h-[200px]">
          {output}
        </pre>
      </div>
    </div>
  );
}
