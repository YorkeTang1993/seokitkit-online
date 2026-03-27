'use client';

import { useState, useMemo } from 'react';

export default function ToolClient() {
  const [text, setText] = useState('');
  const [charLimit, setCharLimit] = useState(0);

  const stats = useMemo(() => {
    const total = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/\d/g) || []).length;
    const punctuation = (text.match(/[^\w\s]/g) || []).length;
    const whitespace = (text.match(/\s/g) || []).length;
    const lines = text ? text.split('\n').length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    return { total, noSpaces, letters, digits, punctuation, whitespace, lines, words };
  }, [text]);

  const limitPercent = charLimit > 0 ? Math.min((stats.total / charLimit) * 100, 100) : 0;
  const remaining = charLimit > 0 ? charLimit - stats.total : 0;

  const PRESETS = [
    { label: 'Twitter/X', limit: 280 },
    { label: 'SEO Title', limit: 60 },
    { label: 'Meta Desc', limit: 160 },
    { label: 'SMS', limit: 160 },
    { label: 'Instagram Bio', limit: 150 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter or paste your text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          placeholder="Start typing or paste your text here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Character Limit */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <label className="text-sm font-medium text-gray-700">Character Limit:</label>
          <input
            type="number"
            value={charLimit || ''}
            onChange={e => setCharLimit(parseInt(e.target.value) || 0)}
            placeholder="None"
            min={0}
            className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex gap-1.5">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => setCharLimit(p.limit)}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${charLimit === p.limit ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {charLimit > 0 && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  limitPercent >= 100 ? 'bg-red-500' : limitPercent >= 80 ? 'bg-yellow-500' : 'bg-blue-600'
                }`}
                style={{ width: `${limitPercent}%` }}
              />
            </div>
            <div className={`text-sm ${remaining < 0 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {remaining >= 0 ? `${remaining} characters remaining` : `${Math.abs(remaining)} characters over limit`}
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Characters', value: stats.total, color: 'text-blue-600' },
          { label: 'Without Spaces', value: stats.noSpaces, color: 'text-blue-600' },
          { label: 'Letters', value: stats.letters, color: 'text-green-600' },
          { label: 'Digits', value: stats.digits, color: 'text-purple-600' },
          { label: 'Punctuation', value: stats.punctuation, color: 'text-orange-600' },
          { label: 'Whitespace', value: stats.whitespace, color: 'text-gray-600' },
          { label: 'Lines', value: stats.lines, color: 'text-teal-600' },
          { label: 'Words', value: stats.words, color: 'text-indigo-600' },
        ].map(item => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
