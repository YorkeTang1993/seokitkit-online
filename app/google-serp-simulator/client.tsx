'use client';

import { useState, useCallback } from 'react';

export default function ToolClient() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [showDate, setShowDate] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [showSitelinks, setShowSitelinks] = useState(false);
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  const truncate = (text: string, max: number) =>
    text.length > max ? text.substring(0, max) + '...' : text;

  const displayUrl = url || 'https://example.com/page';
  const displayTitle = title || 'Your Page Title Will Appear Here';
  const displayDesc = description || 'Your meta description will appear here. Write a compelling description to encourage clicks from search results.';

  const breadcrumbUrl = (() => {
    try {
      const parsed = new URL(displayUrl);
      const parts = parsed.pathname.split('/').filter(Boolean);
      return `${parsed.hostname}${parts.length > 0 ? ' > ' + parts.join(' > ') : ''}`;
    } catch {
      return displayUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    }
  })();

  const titleColor = title.length > 60 ? 'text-red-500' : title.length > 50 ? 'text-yellow-600' : 'text-green-600';
  const descColor = description.length > 160 ? 'text-red-500' : description.length > 150 ? 'text-yellow-600' : 'text-green-600';

  const copyMeta = useCallback(() => {
    const lines = [
      `<title>${title}</title>`,
      `<meta name="description" content="${description}" />`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [title, description]);

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Title Tag</label>
            <span className={`text-sm ${titleColor}`}>{title.length}/60</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Your Page Title | Brand Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {title.length > 60 && (
            <p className="text-xs text-red-500 mt-1">Title may be truncated in search results.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/your-page"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Meta Description</label>
            <span className={`text-sm ${descColor}`}>{description.length}/160</span>
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Write a compelling meta description for your page..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {description.length > 160 && (
            <p className="text-xs text-red-500 mt-1">Description may be truncated in search results.</p>
          )}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={showDate} onChange={e => setShowDate(e.target.checked)} className="rounded" />
          Show date
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={showFaq} onChange={e => setShowFaq(e.target.checked)} className="rounded" />
          Show FAQ snippet
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={showSitelinks} onChange={e => setShowSitelinks(e.target.checked)} className="rounded" />
          Show sitelinks
        </label>
      </div>

      {/* Desktop / Mobile tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('desktop')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${view === 'desktop' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Desktop
        </button>
        <button
          onClick={() => setView('mobile')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${view === 'mobile' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Mobile
        </button>
      </div>

      {/* SERP Preview */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide">Google Search Preview ({view})</p>
        <div className={view === 'mobile' ? 'max-w-[360px]' : 'max-w-[600px]'}>
          {/* URL breadcrumb */}
          <div className="flex items-center gap-1 mb-1">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs text-gray-500">
                {(() => {
                  try {
                    return new URL(displayUrl).hostname.charAt(0).toUpperCase();
                  } catch {
                    return 'E';
                  }
                })()}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-800 leading-tight">{(() => { try { return new URL(displayUrl).hostname; } catch { return 'example.com'; } })()}</p>
              <p className="text-xs text-gray-500 leading-tight">{breadcrumbUrl}</p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl leading-snug text-[#1a0dab] hover:underline cursor-pointer mb-0.5" style={{ fontFamily: 'arial, sans-serif' }}>
            {truncate(displayTitle, view === 'mobile' ? 55 : 60)}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'arial, sans-serif' }}>
            {showDate && <span className="text-gray-500">Mar 19, 2026 — </span>}
            {truncate(displayDesc, view === 'mobile' ? 120 : 160)}
          </p>

          {/* FAQ snippet */}
          {showFaq && (
            <div className="mt-2 border-t border-gray-100 pt-2">
              <div className="flex items-center gap-1 text-sm text-gray-700 py-1 cursor-pointer hover:bg-gray-50 rounded">
                <span className="text-gray-400">&#9654;</span>
                <span>What is this page about?</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-700 py-1 cursor-pointer hover:bg-gray-50 rounded">
                <span className="text-gray-400">&#9654;</span>
                <span>How does it work?</span>
              </div>
            </div>
          )}

          {/* Sitelinks */}
          {showSitelinks && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3">
              {['About Us', 'Features', 'Pricing', 'Contact'].map(link => (
                <a key={link} className="text-sm text-[#1a0dab] hover:underline cursor-pointer py-0.5">{link}</a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Copy button */}
      <div className="flex justify-end">
        <button onClick={copyMeta} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {copied ? 'Copied!' : 'Copy Meta Tags'}
        </button>
      </div>
    </div>
  );
}
