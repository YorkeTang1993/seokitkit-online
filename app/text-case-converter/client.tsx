'use client';

import { useState, useCallback } from 'react';

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

function toSentenceCase(str: string): string {
  return str.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

function splitWords(str: string): string[] {
  // Handle camelCase, PascalCase, snake_case, kebab-case, and regular spaces
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')     // camelCase split
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // ABCDef -> ABC Def
    .replace(/[_-]+/g, ' ')                     // snake_case / kebab-case
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(w => w.length > 0);
}

function toCamelCase(str: string): string {
  const words = splitWords(str);
  if (words.length === 0) return '';
  return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function toPascalCase(str: string): string {
  return splitWords(str).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function toSnakeCase(str: string): string {
  return splitWords(str).map(w => w.toLowerCase()).join('_');
}

function toKebabCase(str: string): string {
  return splitWords(str).map(w => w.toLowerCase()).join('-');
}

function toConstantCase(str: string): string {
  return splitWords(str).map(w => w.toUpperCase()).join('_');
}

function toDotCase(str: string): string {
  return splitWords(str).map(w => w.toLowerCase()).join('.');
}

interface ConversionOption {
  label: string;
  fn: (s: string) => string;
  example: string;
}

const conversions: ConversionOption[] = [
  { label: 'UPPERCASE', fn: (s) => s.toUpperCase(), example: 'HELLO WORLD' },
  { label: 'lowercase', fn: (s) => s.toLowerCase(), example: 'hello world' },
  { label: 'Title Case', fn: toTitleCase, example: 'Hello World' },
  { label: 'Sentence case', fn: toSentenceCase, example: 'Hello world. This is text.' },
  { label: 'camelCase', fn: toCamelCase, example: 'helloWorld' },
  { label: 'PascalCase', fn: toPascalCase, example: 'HelloWorld' },
  { label: 'snake_case', fn: toSnakeCase, example: 'hello_world' },
  { label: 'kebab-case', fn: toKebabCase, example: 'hello-world' },
  { label: 'CONSTANT_CASE', fn: toConstantCase, example: 'HELLO_WORLD' },
  { label: 'dot.case', fn: toDotCase, example: 'hello.world' },
];

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeConversion, setActiveConversion] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback((conv: ConversionOption) => {
    setOutput(conv.fn(input));
    setActiveConversion(conv.label);
    setCopied(false);
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
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

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter your text</label>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setOutput(''); setActiveConversion(''); }}
          rows={6}
          placeholder="Type or paste your text here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Conversion Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Convert to:</label>
        <div className="flex flex-wrap gap-2">
          {conversions.map((conv) => (
            <button
              key={conv.label}
              onClick={() => handleConvert(conv)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                activeConversion === conv.label
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              title={`Example: ${conv.example}`}
            >
              {conv.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Result ({activeConversion})
            </label>
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Conversion Reference */}
      {!output && input && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview all conversions</h3>
          <div className="grid gap-2">
            {conversions.map((conv) => (
              <div key={conv.label} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm">
                <span className="w-32 shrink-0 font-medium text-gray-600">{conv.label}</span>
                <span className="text-gray-800 font-mono truncate">{conv.fn(input)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
