// ============================================================
// Site Configuration — THE ONLY FILE YOU NEED TO EDIT PER SITE
// ============================================================

export const siteConfig = {
  // --- Brand ---
  name: 'SEOKit',
  description: 'Free online SEO tools. Meta tag generators, schema markup builders, robots.txt creators, and more to boost your search rankings.',
  domain: 'https://seokit.site',
  email: 'contact@seokitkit.online',

  // Header brand display: renders as "{text}{accent}{suffix}"
  brand: {
    text: 'SEO',
    accent: 'Kit',
    suffix: '',
  },

  // --- Categories ---
  categories: [
    { id: 'generator', label: 'Generators', description: 'Generate SEO tags, configs, and markup' },
    { id: 'validator', label: 'Validators', description: 'Validate and check SEO elements' },
    { id: 'checker', label: 'Checkers', description: 'Check redirects, links, and status codes' },
    { id: 'utility', label: 'Utilities', description: 'SEO utilities and helpers' },
  ] as const,

  // --- SEO & Verification ---
  googleAnalyticsId: 'G-ZYPR9NKQT9',
  googleVerification: 'o2SQXAa4hamUGVAMEFboPJ6Bg7rWWYigqltPtyXkmaI',
  indexNowKey: '',

  // --- Sister Sites (cross-linking network) ---
  sisterSites: [
    { name: 'ToolBox Online', url: 'https://toolboxhq.site', desc: 'General Tools' },
    { name: 'DevToolKit', url: 'https://devutil.site', desc: 'Developer Tools' },
    { name: 'CalcHub', url: 'https://calcbox.site', desc: 'Calculators' },
    { name: 'ImageToolKit', url: 'https://imgtoolkit.site', desc: 'Image Tools' },
    { name: 'CSSKit', url: 'https://csskit.site', desc: 'CSS Tools' },
    { name: 'SEOKit', url: 'https://seokit.site', desc: 'SEO Tools' },
  ],

  // --- About page tagline ---
  tagline: 'free, fast, and privacy-friendly SEO tools that work right in your browser.',

  // --- Network Tools (cross-site tool links from OTHER sites) ---
  networkTools: [
    { name: 'JSON Formatter', url: 'https://toolboxhq.site/json-escape', site: 'ToolBox Online' },
    { name: 'Hex to RGB', url: 'https://toolboxhq.site/hex-to-rgb', site: 'ToolBox Online' },
    { name: 'JWT Decoder', url: 'https://devutil.site/jwt-decoder', site: 'DevToolKit' },
    { name: 'UUID Generator', url: 'https://devutil.site/uuid-generator', site: 'DevToolKit' },
    { name: 'eBay Fee Calculator', url: 'https://calcbox.site/ebay-fee-calculator', site: 'CalcHub' },
    { name: 'Compound Interest Calculator', url: 'https://calcbox.site/compound-interest-calculator', site: 'CalcHub' },
    { name: 'Image Resizer', url: 'https://imgtoolkit.site/image-resizer', site: 'ImageToolKit' },
    { name: 'PNG to JPG', url: 'https://imgtoolkit.site/png-to-jpg-converter', site: 'ImageToolKit' },
    { name: 'CSS Gradient Generator', url: 'https://csskit.site/css-gradient-generator', site: 'CSSKit' },
    { name: 'CSS Grid Generator', url: 'https://csskit.site/css-grid-generator', site: 'CSSKit' },
  ],
};
