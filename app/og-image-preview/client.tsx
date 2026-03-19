'use client';

import { useState } from 'react';

export default function ToolClient() {
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [pageUrl, setPageUrl] = useState('');

  const displayTitle = ogTitle || 'Your Page Title';
  const displayDesc = ogDescription || 'Your page description will appear here when shared on social media.';
  const displayUrl = pageUrl || 'https://example.com';

  const hostname = (() => {
    try {
      return new URL(displayUrl).hostname;
    } catch {
      return 'example.com';
    }
  })();

  const imagePlaceholder = (
    <div className="bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
      <div className="text-center p-4">
        <svg className="w-8 h-8 mx-auto mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        No image
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Input fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">og:title</label>
          <input
            type="text"
            value={ogTitle}
            onChange={e => setOgTitle(e.target.value)}
            placeholder="Your Page Title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
          <input
            type="text"
            value={pageUrl}
            onChange={e => setPageUrl(e.target.value)}
            placeholder="https://example.com/page"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">og:description</label>
          <textarea
            value={ogDescription}
            onChange={e => setOgDescription(e.target.value)}
            placeholder="A compelling description of your page..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">og:image URL</label>
          <input
            type="text"
            value={ogImage}
            onChange={e => setOgImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Preview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facebook */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Facebook</p>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-[500px]">
            <div className="aspect-[1.91/1] overflow-hidden bg-gray-100">
              {ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ogImage} alt="OG preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : imagePlaceholder}
            </div>
            <div className="p-3 bg-[#f2f3f5]">
              <p className="text-xs text-gray-500 uppercase">{hostname}</p>
              <p className="text-base font-semibold text-[#1d2129] leading-tight mt-0.5 line-clamp-2">{displayTitle}</p>
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{displayDesc}</p>
            </div>
          </div>
        </div>

        {/* Twitter/X */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Twitter / X</p>
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white max-w-[500px]">
            <div className="aspect-[2/1] overflow-hidden bg-gray-100">
              {ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ogImage} alt="OG preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : imagePlaceholder}
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-500">{hostname}</p>
              <p className="text-base font-semibold text-gray-900 leading-tight mt-0.5 line-clamp-2">{displayTitle}</p>
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{displayDesc}</p>
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">LinkedIn</p>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-[500px]">
            <div className="aspect-[1.91/1] overflow-hidden bg-gray-100">
              {ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ogImage} alt="OG preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : imagePlaceholder}
            </div>
            <div className="p-3 bg-white">
              <p className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">{displayTitle}</p>
              <p className="text-xs text-gray-500 mt-1">{hostname}</p>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">WhatsApp</p>
          <div className="bg-[#dcf8c6] rounded-lg p-2 max-w-[500px]">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="aspect-[1.91/1] overflow-hidden bg-gray-100">
                {ogImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ogImage} alt="OG preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : imagePlaceholder}
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{displayTitle}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{displayDesc}</p>
                <p className="text-xs text-gray-400 mt-1">{hostname}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
