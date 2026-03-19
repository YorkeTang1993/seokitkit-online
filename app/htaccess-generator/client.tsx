'use client';

import { useState, useCallback, useMemo } from 'react';

interface Redirect {
  type: '301' | '302';
  from: string;
  to: string;
}

export default function ToolClient() {
  const [forceHttps, setForceHttps] = useState(true);
  const [removeWww, setRemoveWww] = useState(true);
  const [gzip, setGzip] = useState(true);
  const [caching, setCaching] = useState(true);
  const [blockIps, setBlockIps] = useState(false);
  const [ips, setIps] = useState('');
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [customErrors, setCustomErrors] = useState(false);
  const [error404, setError404] = useState('/404.html');
  const [error500, setError500] = useState('/500.html');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const sections: string[] = [];

    if (forceHttps) {
      sections.push(`# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`);
    }

    if (removeWww) {
      sections.push(`# Remove www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]`);
    }

    if (redirects.length > 0) {
      const lines = ['# Redirects'];
      for (const r of redirects) {
        if (r.from && r.to) {
          lines.push(`Redirect ${r.type} ${r.from} ${r.to}`);
        }
      }
      sections.push(lines.join('\n'));
    }

    if (gzip) {
      sections.push(`# GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE text/javascript application/javascript application/json
  AddOutputFilterByType DEFLATE application/xml application/xhtml+xml
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>`);
    }

    if (caching) {
      sections.push(`# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>`);
    }

    if (blockIps && ips.trim()) {
      const ipList = ips.split('\n').map(ip => ip.trim()).filter(Boolean);
      if (ipList.length > 0) {
        const lines = ['# Block IPs', '<RequireAll>', '  Require all granted'];
        for (const ip of ipList) {
          lines.push(`  Require not ip ${ip}`);
        }
        lines.push('</RequireAll>');
        sections.push(lines.join('\n'));
      }
    }

    if (customErrors) {
      const lines = ['# Custom Error Pages'];
      if (error404) lines.push(`ErrorDocument 404 ${error404}`);
      if (error500) lines.push(`ErrorDocument 500 ${error500}`);
      sections.push(lines.join('\n'));
    }

    return sections.join('\n\n');
  }, [forceHttps, removeWww, gzip, caching, blockIps, ips, redirects, customErrors, error404, error500]);

  const addRedirect = useCallback(() => {
    setRedirects(prev => [...prev, { type: '301', from: '', to: '' }]);
  }, []);

  const removeRedirect = useCallback((index: number) => {
    setRedirects(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateRedirect = useCallback((index: number, field: keyof Redirect, value: string) => {
    setRedirects(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  }, []);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`} onClick={() => onChange(!checked)}>
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Force HTTPS" checked={forceHttps} onChange={setForceHttps} />
          <Toggle label="Remove www" checked={removeWww} onChange={setRemoveWww} />
          <Toggle label="GZIP Compression" checked={gzip} onChange={setGzip} />
          <Toggle label="Browser Caching" checked={caching} onChange={setCaching} />
          <Toggle label="Block IPs" checked={blockIps} onChange={setBlockIps} />
          <Toggle label="Custom Error Pages" checked={customErrors} onChange={setCustomErrors} />
        </div>

        {/* Redirects */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Redirects</h3>
            <button onClick={addRedirect} className="text-sm text-blue-600 hover:text-blue-800">+ Add Redirect</button>
          </div>
          {redirects.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <select value={r.type} onChange={e => updateRedirect(i, 'type', e.target.value)} className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="301">301</option>
                <option value="302">302</option>
              </select>
              <input type="text" value={r.from} onChange={e => updateRedirect(i, 'from', e.target.value)} placeholder="/old-page" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <span className="text-gray-400 text-sm">to</span>
              <input type="text" value={r.to} onChange={e => updateRedirect(i, 'to', e.target.value)} placeholder="/new-page" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <button onClick={() => removeRedirect(i)} className="text-red-500 hover:text-red-700 text-xs">x</button>
            </div>
          ))}
          {redirects.length === 0 && <p className="text-sm text-gray-400">No redirects added yet.</p>}
        </div>

        {/* Block IPs */}
        {blockIps && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IPs to Block (one per line)</label>
            <textarea value={ips} onChange={e => setIps(e.target.value)} placeholder="192.168.1.1&#10;10.0.0.0/8" rows={3} className={`${inputCls} font-mono resize-none`} />
          </div>
        )}

        {/* Custom Errors */}
        {customErrors && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">404 Error Page</label>
              <input type="text" value={error404} onChange={e => setError404(e.target.value)} className={`${inputCls} font-mono`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">500 Error Page</label>
              <input type="text" value={error500} onChange={e => setError500(e.target.value)} className={`${inputCls} font-mono`} />
            </div>
          </div>
        )}
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Generated .htaccess</label>
          <button onClick={copyOutput} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-x-auto min-h-[200px]">
          {output}
        </pre>
      </div>
    </div>
  );
}
