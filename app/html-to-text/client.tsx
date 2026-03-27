'use client';

import { useState, useCallback, useMemo } from 'react';

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
  '&apos;': "'", '&nbsp;': ' ', '&ndash;': '\u2013', '&mdash;': '\u2014',
  '&lsquo;': '\u2018', '&rsquo;': '\u2019', '&ldquo;': '\u201C', '&rdquo;': '\u201D',
  '&bull;': '\u2022', '&hellip;': '\u2026', '&copy;': '\u00A9', '&reg;': '\u00AE',
  '&trade;': '\u2122', '&times;': '\u00D7', '&divide;': '\u00F7',
};

function htmlToText(html: string, preserveLinks: boolean): string {
  if (!html.trim()) return '';

  let result = html;

  // Remove <script> and <style> blocks entirely
  result = result.replace(/<script[\s\S]*?<\/script>/gi, '');
  result = result.replace(/<style[\s\S]*?<\/style>/gi, '');
  result = result.replace(/<!--[\s\S]*?-->/g, '');

  // Convert <br> to newlines
  result = result.replace(/<br\s*\/?>/gi, '\n');

  // Convert block elements to newlines
  result = result.replace(/<\/(p|div|section|article|aside|header|footer|main|nav|blockquote|figure|figcaption)>/gi, '\n\n');
  result = result.replace(/<\/(h[1-6])>/gi, '\n\n');
  result = result.replace(/<\/(li|tr|dt|dd)>/gi, '\n');
  result = result.replace(/<\/(td|th)>/gi, '\t');
  result = result.replace(/<(hr)\s*\/?>/gi, '\n---\n');

  // Handle list items with bullet points
  result = result.replace(/<li[^>]*>/gi, '  \u2022 ');

  // Optionally preserve link URLs
  if (preserveLinks) {
    result = result.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, '$2 [$1]');
  }

  // Handle images - show alt text
  result = result.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi, '[Image: $1]');
  result = result.replace(/<img[^>]*>/gi, '');

  // Strip all remaining HTML tags
  result = result.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  Object.entries(HTML_ENTITIES).forEach(([entity, char]) => {
    result = result.replace(new RegExp(entity, 'g'), char);
  });
  // Decode numeric entities
  result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)));
  result = result.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  // Clean up whitespace
  result = result.replace(/[ \t]+/g, ' ');           // collapse horizontal whitespace
  result = result.replace(/\n /g, '\n');              // remove leading spaces after newlines
  result = result.replace(/ \n/g, '\n');              // remove trailing spaces before newlines
  result = result.replace(/\n{3,}/g, '\n\n');         // max 2 consecutive newlines
  result = result.trim();

  return result;
}

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [preserveLinks, setPreserveLinks] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => htmlToText(input, preserveLinks), [input, preserveLinks]);

  const wordCount = useMemo(() => {
    if (!output.trim()) return 0;
    return output.trim().split(/\s+/).length;
  }, [output]);

  const charCount = output.length;

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = output;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const loadExample = () => {
    setInput(`<!DOCTYPE html>
<html>
<head><title>Sample Page</title></head>
<body>
  <h1>Welcome to Our Website</h1>
  <p>This is a <strong>sample HTML page</strong> with various elements.</p>
  <h2>Features</h2>
  <ul>
    <li>Fast &amp; reliable performance</li>
    <li>Easy to use interface</li>
    <li>Free &mdash; no registration required</li>
  </ul>
  <p>Visit our <a href="https://example.com/docs">documentation</a> for more info.</p>
  <h2>About Us</h2>
  <p>We build tools that help developers &amp; content creators work more efficiently.</p>
  <img src="photo.jpg" alt="Team photo" />
  <hr />
  <footer><p>&copy; 2026 Example Company. All rights reserved.</p></footer>
</body>
</html>`);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Paste your HTML code</label>
          <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-800 underline">
            Load example
          </button>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={10}
          placeholder="<h1>Hello World</h1>\n<p>Paste your HTML here...</p>"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          spellCheck={false}
        />
      </div>

      {/* Options */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={preserveLinks}
            onChange={e => setPreserveLinks(e.target.checked)}
            className="rounded border-gray-300"
          />
          Preserve link URLs
        </label>
      </div>

      {/* Stats */}
      {output && (
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <span className="text-gray-500">Words: </span>
            <span className="font-medium text-gray-800">{wordCount}</span>
          </div>
          <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <span className="text-gray-500">Characters: </span>
            <span className="font-medium text-gray-800">{charCount}</span>
          </div>
        </div>
      )}

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Plain text output</label>
          {output && (
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <textarea
          value={output}
          readOnly
          rows={10}
          placeholder="Plain text will appear here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
