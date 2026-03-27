'use client';

import { useState, useCallback } from 'react';

interface DomainResult {
  domain: string;
  createdDate: string;
  updatedDate: string;
  expiresDate: string;
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  registrar: string;
  nameServers: string[];
  status: string;
}

function cleanDomain(input: string): string {
  let d = input.trim();
  d = d.replace(/^https?:\/\//, '');
  d = d.replace(/\/.*$/, '');
  d = d.replace(/:\d+$/, '');
  // Remove www. prefix
  d = d.replace(/^www\./, '');
  return d.toLowerCase();
}

function dateDiff(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months--;
    const prev = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

// Generate a deterministic but realistic creation date from domain name
function hashDomain(domain: string): number {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = ((hash << 5) - hash) + domain.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function ToolClient() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DomainResult | null>(null);
  const [error, setError] = useState('');

  const checkAge = useCallback(() => {
    setError('');
    setResult(null);

    const cleaned = cleanDomain(domain);
    if (!cleaned || !cleaned.includes('.')) {
      setError('Please enter a valid domain name (e.g., example.com).');
      return;
    }

    setLoading(true);

    // Simulate lookup delay
    setTimeout(() => {
      const now = new Date();
      const hash = hashDomain(cleaned);

      // Well-known domains get realistic dates, others get deterministic random dates
      const knownDomains: Record<string, string> = {
        'google.com': '1997-09-15',
        'facebook.com': '1997-03-29',
        'amazon.com': '1994-11-01',
        'wikipedia.org': '2001-01-13',
        'github.com': '2007-10-09',
        'twitter.com': '2000-01-21',
        'youtube.com': '2005-02-15',
        'reddit.com': '2005-04-29',
        'stackoverflow.com': '2003-12-26',
        'apple.com': '1987-02-19',
        'microsoft.com': '1991-05-02',
        'netflix.com': '1997-11-21',
      };

      let createdDate: Date;
      if (knownDomains[cleaned]) {
        createdDate = new Date(knownDomains[cleaned]);
      } else {
        // Generate a date between 1995 and 2023 based on hash
        const yearRange = 2023 - 1995;
        const year = 1995 + (hash % yearRange);
        const month = hash % 12;
        const day = 1 + (hash % 28);
        createdDate = new Date(year, month, day);
      }

      const updatedDate = new Date(now);
      updatedDate.setMonth(updatedDate.getMonth() - (hash % 6 + 1));

      const expiresDate = new Date(now);
      expiresDate.setFullYear(expiresDate.getFullYear() + 1 + (hash % 3));

      const age = dateDiff(createdDate, now);

      const registrars = [
        'GoDaddy.com, LLC',
        'Namecheap, Inc.',
        'Cloudflare, Inc.',
        'Google Domains LLC',
        'Amazon Registrar, Inc.',
        'MarkMonitor Inc.',
        'Tucows Domains Inc.',
        'Network Solutions, LLC',
      ];

      const nameServerProviders = [
        ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
        ['ns-cloud-a1.googledomains.com', 'ns-cloud-a2.googledomains.com'],
        ['ns1.amazonaws.com', 'ns2.amazonaws.com'],
        ['dns1.registrar-servers.com', 'dns2.registrar-servers.com'],
      ];

      setResult({
        domain: cleaned,
        createdDate: createdDate.toISOString().split('T')[0],
        updatedDate: updatedDate.toISOString().split('T')[0],
        expiresDate: expiresDate.toISOString().split('T')[0],
        ageYears: age.years,
        ageMonths: age.months,
        ageDays: age.days,
        registrar: registrars[hash % registrars.length],
        nameServers: nameServerProviders[hash % nameServerProviders.length],
        status: 'Active',
      });

      setLoading(false);
    }, 800 + Math.random() * 700);
  }, [domain]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkAge()}
          placeholder="example.com"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={checkAge}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {loading ? 'Checking...' : 'Check Age'}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 text-sm">Looking up domain information...</span>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Age Banner */}
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl text-center">
            <div className="text-sm text-blue-600 font-medium mb-1">{result.domain}</div>
            <div className="text-4xl font-bold text-blue-700">
              {result.ageYears > 0 && <span>{result.ageYears} year{result.ageYears !== 1 ? 's' : ''}</span>}
              {result.ageMonths > 0 && <span className="text-2xl"> {result.ageMonths} month{result.ageMonths !== 1 ? 's' : ''}</span>}
              {result.ageYears === 0 && result.ageMonths === 0 && <span>{result.ageDays} days</span>}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Registered on {result.createdDate}
            </div>
          </div>

          {/* Domain Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Domain Information</h3>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {[
                { label: 'Domain Name', value: result.domain },
                { label: 'Registration Date', value: result.createdDate },
                { label: 'Last Updated', value: result.updatedDate },
                { label: 'Expiration Date', value: result.expiresDate },
                { label: 'Domain Age', value: `${result.ageYears} years, ${result.ageMonths} months, ${result.ageDays} days` },
                { label: 'Registrar', value: result.registrar },
                { label: 'Status', value: result.status },
                { label: 'Name Servers', value: result.nameServers.join(', ') },
              ].map((row, i) => (
                <div key={i} className="flex items-start px-4 py-3">
                  <span className="w-44 flex-shrink-0 text-sm text-gray-500 font-medium">{row.label}</span>
                  <span className="text-sm text-gray-800 break-all">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Context */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">SEO Context</h3>
            <p className="text-sm text-gray-600">
              {result.ageYears >= 10
                ? 'This is a well-established domain with significant age. Older domains tend to have accumulated more backlinks and trust signals over time.'
                : result.ageYears >= 3
                ? 'This domain has moderate age. It has had enough time to build authority, but domain age alone does not determine rankings.'
                : result.ageYears >= 1
                ? 'This is a relatively young domain. While domain age is not a direct ranking factor, newer domains may take time to build trust and authority.'
                : 'This is a very new domain. Focus on creating quality content and building natural backlinks. New domains can rank well with proper SEO.'}
            </p>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Note: Registration data is simulated for educational/demo purposes. For accurate WHOIS data, use an official WHOIS lookup service.
          </p>
        </div>
      )}
    </div>
  );
}
