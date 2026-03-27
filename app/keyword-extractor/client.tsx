'use client';

import { useState, useMemo } from 'react';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall',
  'can', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we',
  'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their',
  'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'not', 'no', 'nor',
  'if', 'then', 'than', 'too', 'very', 'just', 'about', 'above', 'after', 'again',
  'all', 'also', 'am', 'any', 'because', 'before', 'between', 'both', 'each', 'few',
  'get', 'got', 'here', 'into', 'more', 'most', 'new', 'now', 'off', 'only', 'other',
  'out', 'over', 'own', 'same', 'so', 'some', 'such', 'there', 'through', 'under',
  'up', 'while', 'being', 'during', 'each', 'even', 'much', 'need', 'like', 'make',
  'many', 'well', 'back', 'also', 'use', 'way', 'want', 'say', 'said', 'one', 'two',
]);

type NgramType = 'all' | 'unigram' | 'bigram' | 'trigram';

interface KeywordResult {
  keyword: string;
  count: number;
  density: number;
  type: 'unigram' | 'bigram' | 'trigram';
}

function extractKeywords(text: string): { results: KeywordResult[]; totalWords: number } {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s'-]/g, '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return { results: [], totalWords: 0 };

  const words = cleaned.split(' ').filter(w => w.length > 0);
  const totalWords = words.length;
  const contentWords = words.filter(w => !STOP_WORDS.has(w) && w.length > 1);

  const results: KeywordResult[] = [];

  // Unigrams
  const unigramFreq: Record<string, number> = {};
  contentWords.forEach(w => { unigramFreq[w] = (unigramFreq[w] || 0) + 1; });
  Object.entries(unigramFreq).forEach(([keyword, count]) => {
    results.push({ keyword, count, density: (count / totalWords) * 100, type: 'unigram' });
  });

  // Bigrams (from original words to capture natural phrases)
  if (words.length >= 2) {
    const bigramFreq: Record<string, number> = {};
    for (let i = 0; i < words.length - 1; i++) {
      // Skip if both words are stop words
      if (STOP_WORDS.has(words[i]) && STOP_WORDS.has(words[i + 1])) continue;
      const bigram = `${words[i]} ${words[i + 1]}`;
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    }
    Object.entries(bigramFreq)
      .filter(([, count]) => count >= 2)
      .forEach(([keyword, count]) => {
        results.push({ keyword, count, density: (count / totalWords) * 100, type: 'bigram' });
      });
  }

  // Trigrams
  if (words.length >= 3) {
    const trigramFreq: Record<string, number> = {};
    for (let i = 0; i < words.length - 2; i++) {
      const allStop = [words[i], words[i + 1], words[i + 2]].every(w => STOP_WORDS.has(w));
      if (allStop) continue;
      const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      trigramFreq[trigram] = (trigramFreq[trigram] || 0) + 1;
    }
    Object.entries(trigramFreq)
      .filter(([, count]) => count >= 2)
      .forEach(([keyword, count]) => {
        results.push({ keyword, count, density: (count / totalWords) * 100, type: 'trigram' });
      });
  }

  results.sort((a, b) => b.count - a.count);
  return { results, totalWords };
}

export default function ToolClient() {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<NgramType>('all');

  const { results, totalWords } = useMemo(() => extractKeywords(text), [text]);

  const filtered = useMemo(() => {
    if (filter === 'all') return results.slice(0, 50);
    return results.filter(r => r.type === filter).slice(0, 50);
  }, [results, filter]);

  const unigramCount = results.filter(r => r.type === 'unigram').length;
  const bigramCount = results.filter(r => r.type === 'bigram').length;
  const trigramCount = results.filter(r => r.type === 'trigram').length;

  const densityColor = (d: number) => {
    if (d >= 3) return 'text-red-600';
    if (d >= 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter or paste your text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
          placeholder="Paste your article, blog post, or any text here to extract keywords..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stats */}
      {totalWords > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalWords}</div>
            <div className="text-xs text-gray-500 mt-1">Total Words</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{unigramCount}</div>
            <div className="text-xs text-gray-500 mt-1">Unique Keywords</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{bigramCount}</div>
            <div className="text-xs text-gray-500 mt-1">2-Word Phrases</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{trigramCount}</div>
            <div className="text-xs text-gray-500 mt-1">3-Word Phrases</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {results.length > 0 && (
        <div className="flex gap-2">
          {([
            ['all', 'All'],
            ['unigram', '1-Word'],
            ['bigram', '2-Word'],
            ['trigram', '3-Word'],
          ] as [NgramType, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${
                filter === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Results Table */}
      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-600">#</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Keyword / Phrase</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600">Count</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600">Density</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-400">{i + 1}</td>
                  <td className="py-2 px-3 font-medium text-gray-800">{r.keyword}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{r.count}</td>
                  <td className={`py-2 px-3 text-right font-medium ${densityColor(r.density)}`}>
                    {r.density.toFixed(2)}%
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      r.type === 'unigram' ? 'bg-blue-100 text-blue-700' :
                      r.type === 'bigram' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {r.type === 'unigram' ? '1-word' : r.type === 'bigram' ? '2-word' : '3-word'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {text.trim() && filtered.length === 0 && (
        <p className="text-sm text-gray-500">No keywords found for the selected filter. Try a different filter or add more text.</p>
      )}
    </div>
  );
}
