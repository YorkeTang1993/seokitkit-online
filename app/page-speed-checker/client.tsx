'use client';

import { useState, useCallback } from 'react';

interface Metric {
  name: string;
  label: string;
  value: number;
  unit: string;
  good: number;
  poor: number;
}

function scoreColor(score: number) {
  if (score >= 90) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

function scoreBg(score: number) {
  if (score >= 90) return 'bg-green-100 border-green-300';
  if (score >= 50) return 'bg-yellow-100 border-yellow-300';
  return 'bg-red-100 border-red-300';
}

function metricColor(value: number, good: number, poor: number) {
  if (value <= good) return 'text-green-600';
  if (value <= poor) return 'text-yellow-600';
  return 'text-red-600';
}

function metricBadge(value: number, good: number, poor: number) {
  if (value <= good) return 'bg-green-100 text-green-800';
  if (value <= poor) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function metricLabel(value: number, good: number, poor: number) {
  if (value <= good) return 'Good';
  if (value <= poor) return 'Needs Improvement';
  return 'Poor';
}

export default function ToolClient() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; metrics: Metric[]; suggestions: string[] } | null>(null);
  const [error, setError] = useState('');

  const analyze = useCallback(() => {
    setError('');
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL.');
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    setLoading(true);

    // Simulate analysis with realistic timing
    const start = performance.now();

    fetch(parsed.toString(), { mode: 'no-cors', cache: 'no-store' })
      .then(() => {
        const elapsed = performance.now() - start;
        generateResults(elapsed);
      })
      .catch(() => {
        // Even if fetch fails due to CORS, we still measure the time
        const elapsed = performance.now() - start;
        generateResults(elapsed);
      });

    function generateResults(responseTime: number) {
      // Generate realistic metrics based on response time
      const baseMs = Math.max(200, responseTime);
      const jitter = () => 0.7 + Math.random() * 0.6;

      const fcp = Math.round(baseMs * 1.2 * jitter());
      const lcp = Math.round(baseMs * 2.5 * jitter());
      const tti = Math.round(baseMs * 3.0 * jitter());
      const cls = Math.round(Math.random() * 25) / 100;
      const tbt = Math.round(baseMs * 0.8 * jitter());
      const si = Math.round(baseMs * 2.0 * jitter());

      const metrics: Metric[] = [
        { name: 'FCP', label: 'First Contentful Paint', value: fcp, unit: 'ms', good: 1800, poor: 3000 },
        { name: 'LCP', label: 'Largest Contentful Paint', value: lcp, unit: 'ms', good: 2500, poor: 4000 },
        { name: 'TTI', label: 'Time to Interactive', value: tti, unit: 'ms', good: 3800, poor: 7300 },
        { name: 'TBT', label: 'Total Blocking Time', value: tbt, unit: 'ms', good: 200, poor: 600 },
        { name: 'CLS', label: 'Cumulative Layout Shift', value: cls, unit: '', good: 0.1, poor: 0.25 },
        { name: 'SI', label: 'Speed Index', value: si, unit: 'ms', good: 3400, poor: 5800 },
      ];

      // Calculate overall score (0-100)
      let score = 100;
      for (const m of metrics) {
        if (m.value > m.poor) score -= 15;
        else if (m.value > m.good) score -= 7;
      }
      score = Math.max(0, Math.min(100, score + Math.round(Math.random() * 10 - 5)));

      // Generate suggestions
      const suggestions: string[] = [];
      if (lcp > 2500) suggestions.push('Optimize Largest Contentful Paint: Compress images, use next-gen formats (WebP/AVIF), and implement lazy loading.');
      if (fcp > 1800) suggestions.push('Reduce First Contentful Paint: Minimize render-blocking CSS/JS, inline critical CSS, and use font-display: swap.');
      if (tbt > 200) suggestions.push('Reduce Total Blocking Time: Split large JavaScript bundles, defer non-critical scripts, and use web workers for heavy computation.');
      if (cls > 0.1) suggestions.push('Improve Cumulative Layout Shift: Set explicit width/height on images and ads, avoid inserting content above existing content.');
      if (tti > 3800) suggestions.push('Improve Time to Interactive: Reduce JavaScript execution time, minimize main thread work, and use code splitting.');
      suggestions.push('Enable text compression (gzip/brotli) for HTML, CSS, and JavaScript files.');
      suggestions.push('Leverage browser caching by setting appropriate Cache-Control headers.');
      if (si > 3400) suggestions.push('Improve Speed Index: Optimize server response time and ensure above-the-fold content loads quickly.');

      setResult({ score, metrics, suggestions });
      setLoading(false);
    }
  }, [url]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="https://example.com"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={analyze}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 text-sm">Analyzing page speed...</span>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className={`text-center p-6 rounded-xl border-2 ${scoreBg(result.score)}`}>
            <div className={`text-6xl font-bold ${scoreColor(result.score)}`}>{result.score}</div>
            <div className="text-gray-600 mt-1 text-sm font-medium">Performance Score</div>
            <div className={`text-sm mt-1 ${scoreColor(result.score)} font-medium`}>
              {result.score >= 90 ? 'Good' : result.score >= 50 ? 'Needs Improvement' : 'Poor'}
            </div>
          </div>

          {/* Metrics Grid */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Core Web Vitals & Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.metrics.map(m => (
                <div key={m.name} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">{m.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${metricBadge(m.value, m.good, m.poor)}`}>
                      {metricLabel(m.value, m.good, m.poor)}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${metricColor(m.value, m.good, m.poor)}`}>
                    {m.name === 'CLS' ? m.value.toFixed(2) : `${m.value}`}
                    <span className="text-sm font-normal text-gray-500 ml-1">{m.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Optimization Suggestions</h3>
            <div className="space-y-2">
              {result.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-yellow-500 mt-0.5">&#9888;</span>
                  <span className="text-sm text-gray-700">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Note: This is a simulated analysis based on response time measurement. For production audits, use Google PageSpeed Insights or Lighthouse.
          </p>
        </div>
      )}
    </div>
  );
}
