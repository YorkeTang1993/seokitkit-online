'use client';

import { useState, useCallback, useMemo } from 'react';

function charColor(len: number, min: number, max: number) {
  if (len === 0) return 'text-gray-400';
  if (len < min) return 'text-yellow-600';
  if (len <= max) return 'text-green-600';
  return 'text-red-600';
}

export default function ToolClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const lines: string[] = [];
    lines.push('<!-- Basic Meta Tags -->');
    if (title) lines.push(`<title>${title}</title>`);
    if (description) lines.push(`<meta name="description" content="${description}" />`);
    if (keywords) lines.push(`<meta name="keywords" content="${keywords}" />`);
    lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    lines.push('<meta charset="UTF-8" />');
    if (url) lines.push(`<link rel="canonical" href="${url}" />`);
    lines.push('');
    lines.push('<!-- Open Graph Tags -->');
    if (title) lines.push(`<meta property="og:title" content="${title}" />`);
    if (description) lines.push(`<meta property="og:description" content="${description}" />`);
    if (url) lines.push(`<meta property="og:url" content="${url}" />`);
    lines.push('<meta property="og:type" content="website" />');
    if (ogImage) lines.push(`<meta property="og:image" content="${ogImage}" />`);
    lines.push('');
    lines.push('<!-- Twitter Card Tags -->');
    lines.push(`<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}" />`);
    if (title) lines.push(`<meta name="twitter:title" content="${title}" />`);
    if (description) lines.push(`<meta name="twitter:description" content="${description}" />`);
    if (ogImage) lines.push(`<meta name="twitter:image" content="${ogImage}" />`);
    if (twitterHandle) lines.push(`<meta name="twitter:site" content="${twitterHandle}" />`);
    return lines.join('\n');
  }, [title, description, url, keywords, ogImage, twitterHandle]);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const displayUrl = url || 'https://example.com/page';
  const displayTitle = title || 'Your Page Title';
  const displayDesc = description || 'Your meta description will appear here. It should be 150-160 characters to display fully in search results.';

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Page Title</label>
            <span className={`text-xs font-mono ${charColor(title.length, 50, 60)}`}>{title.length}/60</span>
          </div>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Page Title" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Meta Description</label>
            <span className={`text-xs font-mono ${charColor(description.length, 150, 160)}`}>{description.length}/160</span>
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A compelling description of your page content..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma separated)</label>
            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="keyword1, keyword2, keyword3" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
            <input type="text" value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Handle</label>
            <input type="text" value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)} placeholder="@yourhandle" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      {/* Google SERP Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Google SERP Preview</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-white max-w-2xl">
          <div className="text-sm text-green-700 truncate">{displayUrl}</div>
          <div className="text-xl text-blue-700 hover:underline cursor-pointer truncate">{displayTitle}</div>
          <div className="text-sm text-gray-600 line-clamp-2">{displayDesc}</div>
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
        <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-x-auto min-h-[200px]">
          {output}
        </pre>
      </div>
    </div>
  );
}
