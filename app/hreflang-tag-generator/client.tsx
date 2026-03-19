'use client';

import { useState, useCallback, useMemo } from 'react';

interface HreflangEntry {
  language: string;
  region: string;
  url: string;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
];

const REGIONS = [
  { code: '', name: '(none)' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'ES', name: 'Spain' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
  { code: 'PT', name: 'Portugal' },
  { code: 'CN', name: 'China' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'RU', name: 'Russia' },
  { code: 'IN', name: 'India' },
];

export default function ToolClient() {
  const [entries, setEntries] = useState<HreflangEntry[]>([
    { language: 'en', region: 'US', url: 'https://example.com/en-us/' },
    { language: 'es', region: 'ES', url: 'https://example.com/es/' },
    { language: 'fr', region: 'FR', url: 'https://example.com/fr/' },
  ]);
  const [xDefaultUrl, setXDefaultUrl] = useState('https://example.com/');
  const [outputFormat, setOutputFormat] = useState<'html' | 'xml'>('html');
  const [copied, setCopied] = useState(false);

  const getHreflangCode = useCallback((entry: HreflangEntry) => {
    return entry.region ? `${entry.language}-${entry.region}` : entry.language;
  }, []);

  const htmlOutput = useMemo(() => {
    const lines: string[] = [];
    for (const entry of entries) {
      if (!entry.url) continue;
      lines.push(`<link rel="alternate" hreflang="${getHreflangCode(entry)}" href="${entry.url}" />`);
    }
    if (xDefaultUrl) {
      lines.push(`<link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`);
    }
    return lines.join('\n');
  }, [entries, xDefaultUrl, getHreflangCode]);

  const xmlOutput = useMemo(() => {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    lines.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

    // For each URL, create a <url> block with all hreflang alternates
    for (const entry of entries) {
      if (!entry.url) continue;
      lines.push('  <url>');
      lines.push(`    <loc>${entry.url}</loc>`);
      for (const alt of entries) {
        if (!alt.url) continue;
        lines.push(`    <xhtml:link rel="alternate" hreflang="${getHreflangCode(alt)}" href="${alt.url}" />`);
      }
      if (xDefaultUrl) {
        lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`);
      }
      lines.push('  </url>');
    }
    lines.push('</urlset>');
    return lines.join('\n');
  }, [entries, xDefaultUrl, getHreflangCode]);

  const currentOutput = outputFormat === 'html' ? htmlOutput : xmlOutput;

  const addEntry = useCallback(() => {
    setEntries(prev => [...prev, { language: 'en', region: '', url: '' }]);
  }, []);

  const removeEntry = useCallback((index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateEntry = useCallback((index: number, field: keyof HreflangEntry, value: string) => {
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  }, []);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(currentOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [currentOutput]);

  const inputCls = 'px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 border border-gray-200 rounded-lg p-3">
            <select value={entry.language} onChange={e => updateEntry(i, 'language', e.target.value)} className={inputCls}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name} ({l.code})</option>)}
            </select>
            <select value={entry.region} onChange={e => updateEntry(i, 'region', e.target.value)} className={inputCls}>
              {REGIONS.map(r => <option key={r.code} value={r.code}>{r.name}{r.code ? ` (${r.code})` : ''}</option>)}
            </select>
            <input type="text" value={entry.url} onChange={e => updateEntry(i, 'url', e.target.value)} placeholder="https://example.com/lang/" className={`flex-1 min-w-[200px] ${inputCls} font-mono`} />
            <span className="text-xs text-gray-400 font-mono">{getHreflangCode(entry)}</span>
            {entries.length > 1 && (
              <button onClick={() => removeEntry(i)} className="text-red-500 hover:text-red-700 text-sm">x</button>
            )}
          </div>
        ))}
        <button onClick={addEntry} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add Language</button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">x-default URL (fallback page)</label>
        <input type="text" value={xDefaultUrl} onChange={e => setXDefaultUrl(e.target.value)} placeholder="https://example.com/" className={`w-full ${inputCls} font-mono`} />
      </div>

      {/* Output Format Tabs */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-1">
            <button onClick={() => setOutputFormat('html')} className={`px-3 py-1.5 text-sm rounded-t-lg ${outputFormat === 'html' ? 'bg-gray-50 border border-b-0 border-gray-300 font-medium text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>HTML Link Tags</button>
            <button onClick={() => setOutputFormat('xml')} className={`px-3 py-1.5 text-sm rounded-t-lg ${outputFormat === 'xml' ? 'bg-gray-50 border border-b-0 border-gray-300 font-medium text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>XML Sitemap</button>
          </div>
          <button onClick={copyOutput} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-x-auto min-h-[200px]">
          {currentOutput}
        </pre>
      </div>
    </div>
  );
}
