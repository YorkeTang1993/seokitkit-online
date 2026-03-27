'use client';

import { useState, useMemo, useCallback } from 'react';

interface UTMParams {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

const PRESETS: Record<string, Partial<UTMParams>> = {
  email: { source: 'newsletter', medium: 'email', campaign: '' },
  facebook: { source: 'facebook', medium: 'social', campaign: '' },
  twitter: { source: 'twitter', medium: 'social', campaign: '' },
  google_ads: { source: 'google', medium: 'cpc', campaign: '' },
  linkedin: { source: 'linkedin', medium: 'social', campaign: '' },
};

export default function ToolClient() {
  const [params, setParams] = useState<UTMParams>({
    url: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });
  const [copied, setCopied] = useState(false);

  const update = useCallback((field: keyof UTMParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  }, []);

  const loadPreset = useCallback((key: string) => {
    const preset = PRESETS[key];
    setParams(prev => ({ ...prev, ...preset }));
  }, []);

  const generatedUrl = useMemo(() => {
    let base = params.url.trim();
    if (!base) return '';
    if (!base.startsWith('http://') && !base.startsWith('https://')) {
      base = 'https://' + base;
    }
    try {
      const urlObj = new URL(base);
      if (params.source.trim()) urlObj.searchParams.set('utm_source', params.source.trim());
      if (params.medium.trim()) urlObj.searchParams.set('utm_medium', params.medium.trim());
      if (params.campaign.trim()) urlObj.searchParams.set('utm_campaign', params.campaign.trim());
      if (params.term.trim()) urlObj.searchParams.set('utm_term', params.term.trim());
      if (params.content.trim()) urlObj.searchParams.set('utm_content', params.content.trim());
      return urlObj.toString();
    } catch {
      return '';
    }
  }, [params]);

  const isValid = params.url.trim() && params.source.trim() && params.medium.trim() && params.campaign.trim();

  const copy = useCallback(() => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [generatedUrl]);

  const fields: { key: keyof UTMParams; label: string; placeholder: string; required: boolean; help: string }[] = [
    { key: 'url', label: 'Website URL', placeholder: 'https://example.com/landing-page', required: true, help: 'The destination URL for your campaign' },
    { key: 'source', label: 'Campaign Source (utm_source)', placeholder: 'google, newsletter, facebook', required: true, help: 'Identifies which site sent the traffic (e.g., google, newsletter)' },
    { key: 'medium', label: 'Campaign Medium (utm_medium)', placeholder: 'cpc, email, social, banner', required: true, help: 'The marketing medium (e.g., cpc, email, social)' },
    { key: 'campaign', label: 'Campaign Name (utm_campaign)', placeholder: 'spring_sale, product_launch', required: true, help: 'The campaign name to identify this promotion' },
    { key: 'term', label: 'Campaign Term (utm_term)', placeholder: 'running+shoes, seo+tools', required: false, help: 'Identify paid search keywords (optional)' },
    { key: 'content', label: 'Campaign Content (utm_content)', placeholder: 'banner_ad, text_link, button_cta', required: false, help: 'Differentiate ads or links pointing to the same URL (optional)' },
  ];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 self-center">Quick Fill:</span>
        {Object.entries(PRESETS).map(([key]) => (
          <button
            key={key}
            onClick={() => loadPreset(key)}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors capitalize"
          >
            {key.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={params[f.key]}
              onChange={e => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-0.5">{f.help}</p>
          </div>
        ))}
      </div>

      {/* Generated URL */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Generated URL</label>
          <button
            onClick={copy}
            disabled={!generatedUrl}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
        </div>
        <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm break-all min-h-[60px]">
          {generatedUrl ? (
            <span className="text-blue-700">{generatedUrl}</span>
          ) : (
            <span className="text-gray-400">{params.url ? (isValid ? 'Building URL...' : 'Fill in required fields (source, medium, campaign)') : 'Enter a URL to get started'}</span>
          )}
        </div>
      </div>

      {/* Parameter breakdown */}
      {generatedUrl && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Parameter Breakdown</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {[
              { param: 'utm_source', value: params.source },
              { param: 'utm_medium', value: params.medium },
              { param: 'utm_campaign', value: params.campaign },
              { param: 'utm_term', value: params.term },
              { param: 'utm_content', value: params.content },
            ].filter(p => p.value.trim()).map((p, i) => (
              <div key={i} className={`flex justify-between px-4 py-2 text-sm ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                <span className="font-mono text-blue-700">{p.param}</span>
                <span className="font-mono text-gray-800">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
