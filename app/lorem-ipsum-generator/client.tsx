'use client';

import { useState, useCallback } from 'react';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum', 'suspendisse', 'potenti', 'nullam', 'ac', 'tortor',
  'vitae', 'purus', 'faucibus', 'ornare', 'eget', 'nunc', 'lobortis', 'mattis', 'aliquam',
  'faucibus', 'purus', 'lacus', 'vel', 'facilisis', 'volutpat', 'consequat', 'mauris',
  'nunc', 'congue', 'nisi', 'vitae', 'suscipit', 'tellus', 'pretium', 'aenean', 'pharetra',
  'massa', 'ultricies', 'mi', 'quis', 'hendrerit', 'sagittis', 'eu', 'viverra', 'justo',
  'neque', 'varius', 'dui', 'semper', 'arcu', 'felis', 'bibendum', 'morbi', 'tristique',
  'senectus', 'netus', 'malesuada', 'fames', 'turpis', 'egestas', 'integer', 'feugiat',
  'scelerisque', 'ligula', 'donec', 'blandit', 'cursus', 'risus', 'ultrices', 'posuere',
  'cubilia', 'curae', 'maecenas', 'accumsan', 'lacinia', 'cras', 'fermentum', 'odio',
  'tincidunt', 'diam', 'sollicitudin', 'elementum', 'nibh', 'praesent', 'dignissim',
  'convallis', 'quam', 'urna', 'molestie', 'pellentesque', 'habitant', 'gravida',
  'dictum', 'porta', 'nisl', 'condimentum', 'pulvinar', 'etiam', 'lectus', 'auctor',
];

const CLASSIC_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(minWords = 6, maxWords = 18): string {
  const len = randomInt(minWords, maxWords);
  const words: string[] = [];
  for (let i = 0; i < len; i++) {
    words.push(randomWord());
  }
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(minSentences = 3, maxSentences = 7): string {
  const count = randomInt(minSentences, maxSentences);
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(' ');
}

export default function ToolClient() {
  const [mode, setMode] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let result = '';

    if (mode === 'paragraphs') {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      if (startClassic && paragraphs.length > 0) {
        const rest = paragraphs[0].split('. ').slice(1).join('. ');
        paragraphs[0] = CLASSIC_START + (rest ? '. ' + rest : '.');
      }
      result = paragraphs.join('\n\n');
    } else if (mode === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      if (startClassic && sentences.length > 0) {
        sentences[0] = CLASSIC_START + '.';
      }
      result = sentences.join(' ');
    } else {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(randomWord());
      }
      if (startClassic && words.length >= 5) {
        const classicWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
        for (let i = 0; i < Math.min(5, words.length); i++) {
          words[i] = classicWords[i];
        }
      }
      result = words.join(' ');
    }

    setOutput(result);
  }, [mode, count, startClassic]);

  const copy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0;
  const charCount = output.length;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Output Type</label>
          <select
            value={mode}
            onChange={e => setMode(e.target.value as typeof mode)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of {mode} ({count})
          </label>
          <input
            type="range"
            min={1}
            max={mode === 'words' ? 500 : mode === 'sentences' ? 50 : 20}
            value={count}
            onChange={e => setCount(parseInt(e.target.value))}
            className="w-full mt-2"
          />
        </div>
        <div className="flex items-end gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={startClassic}
              onChange={e => setStartClassic(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Start with &quot;Lorem ipsum...&quot;</span>
          </label>
        </div>
      </div>

      <button onClick={generate} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        Generate
      </button>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex gap-4 text-sm text-gray-500">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
            <button onClick={copy} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
