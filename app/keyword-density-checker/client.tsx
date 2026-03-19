'use client';

import { useState, useMemo } from 'react';

interface NgramEntry {
  phrase: string;
  count: number;
  density: number;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
  'it', 'its', 'not', 'no', 'so', 'if', 'as', 'from', 'into', 'about',
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'they',
  'them', 'his', 'her', 'their', 'which', 'what', 'who', 'whom',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function getNgrams(words: string[], n: number, filterStopWords: boolean): NgramEntry[] {
  const total = words.length;
  if (total === 0) return [];

  const counts = new Map<string, number>();
  for (let i = 0; i <= words.length - n; i++) {
    const gram = words.slice(i, i + n);
    if (filterStopWords && n === 1 && STOP_WORDS.has(gram[0])) continue;
    const phrase = gram.join(' ');
    counts.set(phrase, (counts.get(phrase) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);
}

export default function ToolClient() {
  const [content, setContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);

  const words = useMemo(() => tokenize(content), [content]);
  const uniqueWords = useMemo(() => new Set(words).size, [words]);
  const charCount = useMemo(() => content.length, [content]);

  const unigrams = useMemo(() => getNgrams(words, 1, true), [words]);
  const bigrams = useMemo(() => getNgrams(words, 2, false), [words]);
  const trigrams = useMemo(() => getNgrams(words, 3, false), [words]);

  const targetAnalysis = useMemo(() => {
    if (!targetKeyword.trim() || words.length === 0) return null;
    const kw = targetKeyword.toLowerCase().trim();
    const kwWords = kw.split(/\s+/);
    let count = 0;

    if (kwWords.length === 1) {
      count = words.filter(w => w === kw).length;
    } else {
      const text = content.toLowerCase();
      let idx = 0;
      while (true) {
        idx = text.indexOf(kw, idx);
        if (idx === -1) break;
        count++;
        idx += 1;
      }
    }

    const density = (count / words.length) * 100;
    let recommendation: string;
    let color: string;
    if (density === 0) {
      recommendation = 'Keyword not found. Consider adding it to your content.';
      color = 'text-red-600';
    } else if (density < 0.5) {
      recommendation = 'Density is low. Consider using the keyword more often.';
      color = 'text-yellow-600';
    } else if (density <= 3) {
      recommendation = 'Density is in the optimal range (1-3%).';
      color = 'text-green-600';
    } else {
      recommendation = 'Density is high. Consider reducing keyword usage to avoid over-optimization.';
      color = 'text-red-600';
    }

    return { count, density, recommendation, color };
  }, [content, targetKeyword, words]);

  const currentNgrams = activeTab === 1 ? unigrams : activeTab === 2 ? bigrams : trigrams;

  return (
    <div className="space-y-6">
      {/* Content input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paste your content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Paste or type your article content here..."
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Target keyword */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target keyword (optional)</label>
        <input
          type="text"
          value={targetKeyword}
          onChange={e => setTargetKeyword(e.target.value)}
          placeholder="e.g., seo tools"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stats */}
      {words.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{words.length}</p>
              <p className="text-sm text-gray-500">Total Words</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{uniqueWords}</p>
              <p className="text-sm text-gray-500">Unique Words</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{charCount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Characters</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{content.split(/[.!?]+/).filter(s => s.trim()).length}</p>
              <p className="text-sm text-gray-500">Sentences</p>
            </div>
          </div>

          {/* Target keyword results */}
          {targetAnalysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Target Keyword: &quot;{targetKeyword}&quot;</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <span className="text-sm text-gray-600">Occurrences: </span>
                  <span className="font-semibold">{targetAnalysis.count}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Density: </span>
                  <span className="font-semibold">{targetAnalysis.density.toFixed(2)}%</span>
                </div>
              </div>
              <p className={`text-sm font-medium ${targetAnalysis.color}`}>{targetAnalysis.recommendation}</p>
            </div>
          )}

          {/* N-gram tabs */}
          <div>
            <div className="flex gap-2 mb-4">
              {([1, 2, 3] as const).map(n => (
                <button
                  key={n}
                  onClick={() => setActiveTab(n)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {n}-Word Phrases
                </button>
              ))}
            </div>

            {/* Frequency table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">#</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">Phrase</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-700">Count</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-700">Density</th>
                  </tr>
                </thead>
                <tbody>
                  {currentNgrams.map((entry, i) => (
                    <tr key={entry.phrase} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-2 font-mono">{entry.phrase}</td>
                      <td className="px-4 py-2 text-right">{entry.count}</td>
                      <td className="px-4 py-2 text-right">{entry.density.toFixed(2)}%</td>
                    </tr>
                  ))}
                  {currentNgrams.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-gray-400">No data yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
