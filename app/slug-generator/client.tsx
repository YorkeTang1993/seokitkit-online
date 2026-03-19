'use client';

import { useState, useMemo, useCallback } from 'react';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
  'it', 'its', 'not', 'no', 'so', 'if', 'as', 'from', 'into', 'about',
]);

const TRANSLITERATION: Record<string, string> = {
  'a': 'a', 'e': 'e', 'i': 'i', 'o': 'o', 'u': 'u',
  '\u00e0': 'a', '\u00e1': 'a', '\u00e2': 'a', '\u00e3': 'a', '\u00e4': 'a', '\u00e5': 'a',
  '\u00e8': 'e', '\u00e9': 'e', '\u00ea': 'e', '\u00eb': 'e',
  '\u00ec': 'i', '\u00ed': 'i', '\u00ee': 'i', '\u00ef': 'i',
  '\u00f2': 'o', '\u00f3': 'o', '\u00f4': 'o', '\u00f5': 'o', '\u00f6': 'o',
  '\u00f9': 'u', '\u00fa': 'u', '\u00fb': 'u', '\u00fc': 'u',
  '\u00f1': 'n', '\u00e7': 'c', '\u00df': 'ss', '\u00f8': 'o',
  '\u00c0': 'a', '\u00c1': 'a', '\u00c2': 'a', '\u00c3': 'a', '\u00c4': 'a', '\u00c5': 'a',
  '\u00c8': 'e', '\u00c9': 'e', '\u00ca': 'e', '\u00cb': 'e',
  '\u00cc': 'i', '\u00cd': 'i', '\u00ce': 'i', '\u00cf': 'i',
  '\u00d2': 'o', '\u00d3': 'o', '\u00d4': 'o', '\u00d5': 'o', '\u00d6': 'o',
  '\u00d9': 'u', '\u00da': 'u', '\u00db': 'u', '\u00dc': 'u',
  '\u00d1': 'n', '\u00c7': 'c', '\u00d8': 'o',
};

function generateSlug(
  text: string,
  separator: string,
  lowercase: boolean,
  maxLength: number,
  removeStopWords: boolean,
  transliterate: boolean,
): string {
  let result = text;

  if (transliterate) {
    result = result
      .split('')
      .map(ch => TRANSLITERATION[ch] || ch)
      .join('');
  }

  if (lowercase) {
    result = result.toLowerCase();
  }

  // Replace spaces and special chars with separator
  result = result
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, separator)
    .replace(new RegExp(`[${separator}]+`, 'g'), separator)
    .replace(new RegExp(`^${separator === '-' ? '\\-' : separator}|${separator === '-' ? '\\-' : separator}$`, 'g'), '');

  if (removeStopWords) {
    const words = result.split(separator);
    const filtered = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
    result = (filtered.length > 0 ? filtered : words).join(separator);
  }

  if (maxLength > 0 && result.length > maxLength) {
    result = result.substring(0, maxLength);
    // Don't cut in the middle of a word
    const lastSep = result.lastIndexOf(separator);
    if (lastSep > 0) {
      result = result.substring(0, lastSep);
    }
  }

  return result;
}

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(0);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [transliterate, setTransliterate] = useState(true);
  const [batchMode, setBatchMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => {
    if (!input.trim()) return '';
    if (batchMode) {
      return input
        .split('\n')
        .filter(line => line.trim())
        .map(line => generateSlug(line.trim(), separator, lowercase, maxLength, removeStopWords, transliterate))
        .join('\n');
    }
    return generateSlug(input.trim(), separator, lowercase, maxLength, removeStopWords, transliterate);
  }, [input, separator, lowercase, maxLength, removeStopWords, transliterate, batchMode]);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [slug]);

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Separator</label>
          <select
            value={separator}
            onChange={e => setSeparator(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Length (0 = no limit)</label>
          <input
            type="number"
            value={maxLength}
            onChange={e => setMaxLength(parseInt(e.target.value) || 0)}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)} className="rounded" />
            Lowercase
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={removeStopWords} onChange={e => setRemoveStopWords(e.target.checked)} className="rounded" />
            Remove stop words
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={transliterate} onChange={e => setTransliterate(e.target.checked)} className="rounded" />
            Transliterate unicode
          </label>
        </div>
      </div>

      {/* Batch mode toggle */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={batchMode} onChange={e => setBatchMode(e.target.checked)} className="rounded" />
          Batch mode (one title per line)
        </label>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {batchMode ? 'Enter titles (one per line)' : 'Enter text'}
        </label>
        {batchMode ? (
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={"How to Build a Website in 2024\nThe Ultimate Guide to SEO\n10 Tips for Better Content"}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="How to Build a Website in 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>

      {/* Output */}
      {slug && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Generated Slug{batchMode ? 's' : ''}</label>
            <button onClick={copyOutput} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap break-all min-h-[48px]">
            {slug}
          </pre>
          {!batchMode && (
            <p className="text-xs text-gray-500 mt-1">
              Full URL preview: https://example.com/{slug}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
