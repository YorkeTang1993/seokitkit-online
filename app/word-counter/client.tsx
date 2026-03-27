'use client';

import { useState, useMemo } from 'react';

export default function ToolClient() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { words: 0, characters: text.length, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: '0 sec', speakingTime: '0 sec' };
    }

    const words = trimmed.split(/\s+/).filter(w => w.length > 0).length;
    const characters = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = (trimmed.match(/[.!?]+(\s|$)/g) || []).length || (trimmed.length > 0 ? 1 : 0);
    const paragraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (trimmed.length > 0 ? 1 : 0);

    const readingMinutes = words / 238;
    const speakingMinutes = words / 150;

    const formatTime = (minutes: number) => {
      if (minutes < 1) return `${Math.ceil(minutes * 60)} sec`;
      const m = Math.floor(minutes);
      const s = Math.round((minutes - m) * 60);
      return s > 0 ? `${m} min ${s} sec` : `${m} min`;
    };

    return {
      words,
      characters,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTime: formatTime(readingMinutes),
      speakingTime: formatTime(speakingMinutes),
    };
  }, [text]);

  const topWords = useMemo(() => {
    if (!text.trim()) return [];
    const wordList = text.toLowerCase().replace(/[^a-zA-Z0-9\s'-]/g, '').split(/\s+/).filter(w => w.length > 2);
    const freq: Record<string, number> = {};
    wordList.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter or paste your text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
          placeholder="Start typing or paste your text here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.characters },
          { label: 'Characters (no spaces)', value: stats.charsNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Reading Time', value: stats.readingTime },
          { label: 'Speaking Time', value: stats.speakingTime },
        ].map(item => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{item.value}</div>
            <div className="text-xs text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Top Words */}
      {topWords.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Top Words (3+ letters)</h3>
          <div className="flex flex-wrap gap-2">
            {topWords.map(([word, count]) => (
              <span key={word} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                <span className="font-medium">{word}</span>{' '}
                <span className="text-gray-500">({count})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
