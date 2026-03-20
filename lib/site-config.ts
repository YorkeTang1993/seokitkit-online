// ============================================================
// Site Configuration — THE ONLY FILE YOU NEED TO EDIT PER SITE
// ============================================================

export const siteConfig = {
  // --- Brand ---
  name: 'SEOKit',
  description: 'Free online SEO tools. Meta tag generators, schema markup builders, robots.txt creators, and more to boost your search rankings.',
  domain: 'https://seokitkit-online.vercel.app',
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
  googleAnalyticsId: '',
  googleVerification: 'DI6KZUqbTSEGZtlPln1ft456fUG3aIMIcPeGK9tlvMg',
  indexNowKey: '',

  // --- About page tagline ---
  tagline: 'free, fast, and privacy-friendly SEO tools that work right in your browser.',
};
