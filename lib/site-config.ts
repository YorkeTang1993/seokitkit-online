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
};
