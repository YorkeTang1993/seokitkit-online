'use client';

import { useState, useCallback, useMemo } from 'react';

interface Rule {
  type: 'allow' | 'disallow';
  path: string;
}

interface UserAgentBlock {
  agent: string;
  rules: Rule[];
}

const COMMON_AGENTS = ['*', 'Googlebot', 'Bingbot', 'Yandex', 'DuckDuckBot', 'Baiduspider', 'Slurp', 'facebot', 'ia_archiver'];

const PRESETS: Record<string, UserAgentBlock[]> = {
  allowAll: [{ agent: '*', rules: [{ type: 'allow', path: '/' }] }],
  blockAll: [{ agent: '*', rules: [{ type: 'disallow', path: '/' }] }],
  blockFolders: [
    {
      agent: '*',
      rules: [
        { type: 'disallow', path: '/admin/' },
        { type: 'disallow', path: '/private/' },
        { type: 'disallow', path: '/tmp/' },
        { type: 'allow', path: '/' },
      ],
    },
  ],
};

export default function ToolClient() {
  const [blocks, setBlocks] = useState<UserAgentBlock[]>([
    { agent: '*', rules: [{ type: 'allow', path: '/' }] },
  ]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const lines: string[] = [];
    for (const block of blocks) {
      lines.push(`User-agent: ${block.agent}`);
      for (const rule of block.rules) {
        lines.push(`${rule.type === 'allow' ? 'Allow' : 'Disallow'}: ${rule.path}`);
      }
      if (crawlDelay) {
        lines.push(`Crawl-delay: ${crawlDelay}`);
      }
      lines.push('');
    }
    if (sitemapUrl.trim()) {
      lines.push(`Sitemap: ${sitemapUrl.trim()}`);
      lines.push('');
    }
    return lines.join('\n');
  }, [blocks, sitemapUrl, crawlDelay]);

  const addBlock = useCallback(() => {
    setBlocks(prev => [...prev, { agent: '*', rules: [{ type: 'disallow', path: '' }] }]);
  }, []);

  const removeBlock = useCallback((index: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateAgent = useCallback((blockIndex: number, agent: string) => {
    setBlocks(prev => prev.map((b, i) => i === blockIndex ? { ...b, agent } : b));
  }, []);

  const addRule = useCallback((blockIndex: number) => {
    setBlocks(prev =>
      prev.map((b, i) =>
        i === blockIndex ? { ...b, rules: [...b.rules, { type: 'disallow', path: '' }] } : b
      )
    );
  }, []);

  const removeRule = useCallback((blockIndex: number, ruleIndex: number) => {
    setBlocks(prev =>
      prev.map((b, i) =>
        i === blockIndex ? { ...b, rules: b.rules.filter((_, ri) => ri !== ruleIndex) } : b
      )
    );
  }, []);

  const updateRule = useCallback((blockIndex: number, ruleIndex: number, field: 'type' | 'path', value: string) => {
    setBlocks(prev =>
      prev.map((b, i) =>
        i === blockIndex
          ? {
              ...b,
              rules: b.rules.map((r, ri) =>
                ri === ruleIndex ? { ...r, [field]: value } : r
              ),
            }
          : b
      )
    );
  }, []);

  const loadPreset = useCallback((key: string) => {
    setBlocks(JSON.parse(JSON.stringify(PRESETS[key])));
  }, []);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 self-center">Presets:</span>
        <button onClick={() => loadPreset('allowAll')} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Allow All</button>
        <button onClick={() => loadPreset('blockAll')} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Block All</button>
        <button onClick={() => loadPreset('blockFolders')} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Block Specific Folders</button>
      </div>

      {/* User Agent Blocks */}
      <div className="space-y-4">
        {blocks.map((block, bi) => (
          <div key={bi} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">User-agent:</label>
              <select
                value={COMMON_AGENTS.includes(block.agent) ? block.agent : '__custom__'}
                onChange={e => {
                  if (e.target.value !== '__custom__') updateAgent(bi, e.target.value);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {COMMON_AGENTS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
                <option value="__custom__">Custom...</option>
              </select>
              {!COMMON_AGENTS.includes(block.agent) && (
                <input
                  type="text"
                  value={block.agent}
                  onChange={e => updateAgent(bi, e.target.value)}
                  placeholder="Custom user agent"
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
              {blocks.length > 1 && (
                <button onClick={() => removeBlock(bi)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
              )}
            </div>

            {/* Rules */}
            <div className="space-y-2 pl-4">
              {block.rules.map((rule, ri) => (
                <div key={ri} className="flex items-center gap-2">
                  <select
                    value={rule.type}
                    onChange={e => updateRule(bi, ri, 'type', e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="allow">Allow</option>
                    <option value="disallow">Disallow</option>
                  </select>
                  <input
                    type="text"
                    value={rule.path}
                    onChange={e => updateRule(bi, ri, 'path', e.target.value)}
                    placeholder="/path/"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {block.rules.length > 1 && (
                    <button onClick={() => removeRule(bi, ri)} className="text-red-400 hover:text-red-600 text-xs">x</button>
                  )}
                </div>
              ))}
              <button onClick={() => addRule(bi)} className="text-sm text-blue-600 hover:text-blue-800">+ Add Rule</button>
            </div>
          </div>
        ))}
        <button onClick={addBlock} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Add User Agent</button>
      </div>

      {/* Sitemap & Crawl Delay */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sitemap URL</label>
          <input
            type="text"
            value={sitemapUrl}
            onChange={e => setSitemapUrl(e.target.value)}
            placeholder="https://example.com/sitemap.xml"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crawl Delay (seconds)</label>
          <input
            type="number"
            value={crawlDelay}
            onChange={e => setCrawlDelay(e.target.value)}
            placeholder="10"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Generated robots.txt</label>
          <button onClick={copyOutput} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-x-auto min-h-[120px]">
          {output}
        </pre>
      </div>
    </div>
  );
}
