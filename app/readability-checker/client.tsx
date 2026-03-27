'use client';

import { useState, useMemo } from 'react';

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;

  // Remove trailing 'e' (silent e)
  word = word.replace(/e$/, '');

  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;

  // Handle common patterns
  if (/le$/.test(word) && word.length > 3) count++;
  if (count === 0) count = 1;

  return count;
}

function scoreColor(score: number) {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 30) return 'text-orange-600';
  return 'text-red-600';
}

function scoreBg(score: number) {
  if (score >= 70) return 'bg-green-50 border-green-200';
  if (score >= 50) return 'bg-yellow-50 border-yellow-200';
  if (score >= 30) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
}

function gradeLabel(grade: number): string {
  if (grade <= 5) return '5th Grade';
  if (grade <= 6) return '6th Grade';
  if (grade <= 7) return '7th Grade';
  if (grade <= 8) return '8th Grade';
  if (grade <= 9) return '9th Grade';
  if (grade <= 10) return '10th Grade';
  if (grade <= 12) return '11th-12th Grade';
  if (grade <= 16) return 'College Level';
  return 'Graduate Level';
}

function readingEaseLabel(score: number): string {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
}

function readingEaseDescription(score: number): string {
  if (score >= 90) return 'Understood by an average 11-year-old. Ideal for the widest audience.';
  if (score >= 80) return 'Easy to read for most people. Good for consumer-facing content.';
  if (score >= 70) return 'Fairly easy to read. Appropriate for most web content and blog posts.';
  if (score >= 60) return 'Standard readability. Suitable for general business and news content.';
  if (score >= 50) return 'Fairly difficult to read. May lose some of the general audience.';
  if (score >= 30) return 'Difficult to read. Best suited for academic or professional audiences.';
  return 'Very difficult to read. Typically found in scientific or legal documents.';
}

interface Stats {
  words: number;
  sentences: number;
  syllables: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  hardWords: string[];
  longSentences: number;
}

function analyzeText(text: string): Stats | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Split into sentences
  const sentences = trimmed
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0) return null;

  // Split into words
  const words = trimmed
    .split(/\s+/)
    .map(w => w.replace(/[^a-zA-Z'-]/g, ''))
    .filter(w => w.length > 0);

  if (words.length === 0) return null;

  // Count syllables
  let totalSyllables = 0;
  const hardWords: string[] = [];
  for (const word of words) {
    const s = countSyllables(word);
    totalSyllables += s;
    if (s >= 3 && !hardWords.includes(word.toLowerCase())) {
      hardWords.push(word.toLowerCase());
    }
  }

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = totalSyllables / words.length;

  // Flesch Reading Ease = 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  const fleschReadingEase = Math.max(0, Math.min(100,
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
  ));

  // Flesch-Kincaid Grade Level = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
  const fleschKincaidGrade = Math.max(0,
    0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
  );

  // Count long sentences (>25 words)
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 25).length;

  return {
    words: words.length,
    sentences: sentences.length,
    syllables: totalSyllables,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
    fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
    hardWords: hardWords.slice(0, 20),
    longSentences,
  };
}

export default function ToolClient() {
  const [text, setText] = useState('');

  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">Paste or type your text</label>
          {stats && <span className="text-xs text-gray-400">{stats.words} words</span>}
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your content here to analyze readability. The tool calculates the Flesch Reading Ease score and Flesch-Kincaid Grade Level in real time as you type."
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {stats && (
        <div className="space-y-6">
          {/* Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-6 rounded-xl border-2 text-center ${scoreBg(stats.fleschReadingEase)}`}>
              <div className="text-xs font-medium text-gray-500 mb-1">Flesch Reading Ease</div>
              <div className={`text-5xl font-bold ${scoreColor(stats.fleschReadingEase)}`}>
                {stats.fleschReadingEase}
              </div>
              <div className={`text-sm font-medium mt-1 ${scoreColor(stats.fleschReadingEase)}`}>
                {readingEaseLabel(stats.fleschReadingEase)}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {readingEaseDescription(stats.fleschReadingEase)}
              </div>
            </div>

            <div className="p-6 rounded-xl border-2 bg-blue-50 border-blue-200 text-center">
              <div className="text-xs font-medium text-gray-500 mb-1">Flesch-Kincaid Grade Level</div>
              <div className="text-5xl font-bold text-blue-700">
                {stats.fleschKincaidGrade}
              </div>
              <div className="text-sm font-medium mt-1 text-blue-600">
                {gradeLabel(stats.fleschKincaidGrade)}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                US school grade level needed to understand this text
              </div>
            </div>
          </div>

          {/* Reading Ease Scale */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Reading Ease Scale</h3>
            <div className="relative h-6 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full overflow-hidden">
              <div
                className="absolute top-0 h-full w-1 bg-black rounded"
                style={{ left: `${Math.min(100, stats.fleschReadingEase)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 (Very Hard)</span>
              <span>50</span>
              <span>100 (Very Easy)</span>
            </div>
          </div>

          {/* Statistics Grid */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Text Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Words', value: stats.words },
                { label: 'Sentences', value: stats.sentences },
                { label: 'Syllables', value: stats.syllables },
                { label: 'Avg Words/Sentence', value: stats.avgWordsPerSentence },
                { label: 'Avg Syllables/Word', value: stats.avgSyllablesPerWord },
                { label: 'Long Sentences', value: stats.longSentences, warn: stats.longSentences > 0 },
              ].map((s, i) => (
                <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg text-center">
                  <div className={`text-xl font-bold ${s.warn ? 'text-yellow-600' : 'text-gray-800'}`}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Suggestions</h3>
            <div className="space-y-2">
              {stats.avgWordsPerSentence > 20 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-yellow-500 mt-0.5">&#9888;</span>
                  <span className="text-sm text-gray-700">
                    Average sentence length is {stats.avgWordsPerSentence} words. Aim for 15-20 words per sentence for optimal readability.
                  </span>
                </div>
              )}
              {stats.avgSyllablesPerWord > 1.6 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-yellow-500 mt-0.5">&#9888;</span>
                  <span className="text-sm text-gray-700">
                    Average syllables per word is {stats.avgSyllablesPerWord}. Consider using simpler words where possible.
                  </span>
                </div>
              )}
              {stats.longSentences > 0 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-yellow-500 mt-0.5">&#9888;</span>
                  <span className="text-sm text-gray-700">
                    {stats.longSentences} sentence{stats.longSentences > 1 ? 's' : ''} with more than 25 words. Consider breaking them into shorter sentences.
                  </span>
                </div>
              )}
              {stats.fleschReadingEase >= 60 && stats.avgWordsPerSentence <= 20 && (
                <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  <span className="text-sm text-gray-700">
                    Good readability! Your text is accessible to a general audience.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Hard Words */}
          {stats.hardWords.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Complex Words (3+ syllables) &mdash; {stats.hardWords.length} found
              </h3>
              <div className="flex flex-wrap gap-2">
                {stats.hardWords.map((w, i) => (
                  <span key={i} className="px-2 py-1 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700 font-mono">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!stats && text.trim() && (
        <p className="text-sm text-gray-400">Enter more text to see readability analysis.</p>
      )}
    </div>
  );
}
