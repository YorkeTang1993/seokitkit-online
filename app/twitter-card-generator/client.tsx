'use client';

import { useState, useCallback, useMemo } from 'react';

type CardType = 'summary' | 'summary_large_image';

export default function ToolClient() {
  const [cardType, setCardType] = useState<CardType>('summary_large_image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [site, setSite] = useState('');
  const [creator, setCreator] = useState('');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const lines: string[] = [];
    lines.push('<!-- Twitter Card Meta Tags -->');
    lines.push(`<meta name="twitter:card" content="${cardType}" />`);
    if (title) lines.push(`<meta name="twitter:title" content="${title}" />`);
    if (description) lines.push(`<meta name="twitter:description" content="${description}" />`);
    if (image) lines.push(`<meta name="twitter:image" content="${image}" />`);
    if (site) lines.push(`<meta name="twitter:site" content="${site}" />`);
    if (creator) lines.push(`<meta name="twitter:creator" content="${creator}" />`);
    return lines.join('\n');
  }, [cardType, title, description, image, site, creator]);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const displayTitle = title || 'Your Page Title';
  const displayDesc = description || 'Your page description will appear here...';
  const displaySite = site || '@yoursite';

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
          <div className="flex gap-4">
            {(['summary', 'summary_large_image'] as CardType[]).map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="cardType" value={type} checked={cardType === type} onChange={() => setCardType(type)} className="text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">{type === 'summary' ? 'Summary' : 'Summary Large Image'}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Your page title" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A brief description..." rows={2} className={`${inputCls} resize-none`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/image.jpg" className={`${inputCls} font-mono`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Handle</label>
            <input type="text" value={site} onChange={e => setSite(e.target.value)} placeholder="@yoursite" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Creator Handle</label>
            <input type="text" value={creator} onChange={e => setCreator(e.target.value)} placeholder="@author" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Twitter/X Card Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">X (Twitter) Card Preview</h3>
        <div className="border border-gray-300 rounded-2xl overflow-hidden max-w-lg bg-white">
          {cardType === 'summary_large_image' ? (
            <>
              {image ? (
                <div className="w-full h-60 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  <span className="truncate px-4">{image}</span>
                </div>
              ) : (
                <div className="w-full h-60 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No image - 1200x628px recommended
                </div>
              )}
              <div className="p-3">
                <div className="text-base font-bold text-gray-900 line-clamp-2">{displayTitle}</div>
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">{displayDesc}</div>
                <div className="text-sm text-gray-400 mt-1">{displaySite}</div>
              </div>
            </>
          ) : (
            <div className="flex">
              {image ? (
                <div className="w-32 h-32 bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                  <span className="truncate px-1">IMG</span>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                  144x144
                </div>
              )}
              <div className="p-3 flex flex-col justify-center min-w-0">
                <div className="text-base font-bold text-gray-900 truncate">{displayTitle}</div>
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">{displayDesc}</div>
                <div className="text-sm text-gray-400 mt-1">{displaySite}</div>
              </div>
            </div>
          )}
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
