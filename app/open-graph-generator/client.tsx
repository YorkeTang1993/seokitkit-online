'use client';

import { useState, useCallback, useMemo } from 'react';

const OG_TYPES = ['website', 'article', 'product', 'video.other', 'music.song', 'profile'];

export default function ToolClient() {
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogSiteName, setOgSiteName] = useState('');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const lines: string[] = [];
    lines.push('<!-- Open Graph Meta Tags -->');
    if (ogTitle) lines.push(`<meta property="og:title" content="${ogTitle}" />`);
    if (ogDescription) lines.push(`<meta property="og:description" content="${ogDescription}" />`);
    if (ogImage) lines.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogUrl) lines.push(`<meta property="og:url" content="${ogUrl}" />`);
    lines.push(`<meta property="og:type" content="${ogType}" />`);
    if (ogSiteName) lines.push(`<meta property="og:site_name" content="${ogSiteName}" />`);
    return lines.join('\n');
  }, [ogTitle, ogDescription, ogImage, ogUrl, ogType, ogSiteName]);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const displayTitle = ogTitle || 'Your Page Title';
  const displayDesc = ogDescription || 'Your page description will appear here when shared on social media.';
  const displayDomain = ogUrl ? (() => { try { return new URL(ogUrl).hostname; } catch { return 'example.com'; } })() : 'example.com';

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
          <input type="text" value={ogTitle} onChange={e => setOgTitle(e.target.value)} placeholder="Your page title" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
          <textarea value={ogDescription} onChange={e => setOgDescription(e.target.value)} placeholder="A brief description of your page..." rows={3} className={`${inputCls} resize-none`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
            <input type="text" value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://example.com/image.jpg" className={`${inputCls} font-mono`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
            <input type="text" value={ogUrl} onChange={e => setOgUrl(e.target.value)} placeholder="https://example.com/page" className={`${inputCls} font-mono`} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OG Type</label>
            <select value={ogType} onChange={e => setOgType(e.target.value)} className={inputCls}>
              {OG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input type="text" value={ogSiteName} onChange={e => setOgSiteName(e.target.value)} placeholder="Your Site Name" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Facebook Share Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Facebook Share Preview</h3>
        <div className="border border-gray-300 rounded-lg overflow-hidden max-w-lg bg-white">
          {ogImage ? (
            <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              <span className="truncate px-4">{ogImage}</span>
            </div>
          ) : (
            <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              No image set - 1200x630px recommended
            </div>
          )}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 uppercase tracking-wide">{displayDomain}</div>
            <div className="text-base font-semibold text-gray-900 mt-1 line-clamp-2">{displayTitle}</div>
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">{displayDesc}</div>
          </div>
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Generated HTML</label>
          <button onClick={copyOutput} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
        </div>
        <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-x-auto min-h-[120px]">
          {output}
        </pre>
      </div>
    </div>
  );
}
