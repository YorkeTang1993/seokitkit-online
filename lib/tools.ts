export interface FAQ {
  question: string;
  answer: string;
}

export interface Tool {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string[];
  category: 'generator' | 'validator' | 'checker' | 'utility';
  categoryLabel: string;
  relatedSlugs: string[];
  faq: FAQ[];
  howToUse: string;
  whatIs: string;
  useCases: string[];
  howItWorks: string;
}

export const tools: Tool[] = [
  // ---- Generators ----
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    title: 'Robots.txt Generator | Free Online Tool - SEOKit',
    description: 'Free robots.txt generator. Create custom robots.txt files for your website with an easy visual editor. Control search engine crawling instantly.',
    keywords: ['robots.txt generator', 'robots txt generator', 'generate robots.txt', 'robots txt file generator', 'create robots txt'],
    category: 'generator',
    categoryLabel: 'Generators',
    relatedSlugs: ['sitemap-generator', 'htaccess-generator', 'canonical-url-generator'],
    howToUse: 'Select a user agent from the dropdown (e.g., Googlebot, Bingbot, or * for all bots). Add Allow or Disallow rules with the paths you want to control. Enter your sitemap URL and optionally set a crawl delay. The robots.txt code is generated in real time. Click Copy to copy the output and paste it into your website root directory.',
    whatIs: 'A robots.txt generator is a tool that helps you create a robots.txt file for your website. The robots.txt file tells search engine crawlers which pages or sections of your site should or should not be crawled. It is placed in the root directory of your website and is one of the first files search engines look at when visiting your site.',
    useCases: [
      'Block search engines from crawling admin or private pages',
      'Allow specific bots to access your site while blocking others',
      'Point search engines to your XML sitemap location',
      'Prevent duplicate content issues by blocking parameter URLs',
      'Control crawl budget for large websites',
    ],
    howItWorks: 'The tool provides a visual interface to define user-agent directives, allow/disallow rules, sitemap references, and crawl-delay values. As you configure the settings, the tool generates valid robots.txt syntax in real time that you can copy and upload to your web server.',
    faq: [
      { question: 'Where do I put the robots.txt file?', answer: 'The robots.txt file must be placed in the root directory of your website (e.g., https://example.com/robots.txt). It must be accessible at that exact URL for search engines to find it.' },
      { question: 'Does robots.txt block pages from appearing in search results?', answer: 'No, robots.txt only controls crawling, not indexing. To prevent pages from appearing in search results, use a "noindex" meta tag or X-Robots-Tag HTTP header instead.' },
      { question: 'What does the * user-agent mean?', answer: 'The asterisk (*) is a wildcard that applies the rules to all search engine crawlers. You can also specify individual bots like Googlebot or Bingbot for bot-specific rules.' },
      { question: 'Can I test my robots.txt file?', answer: 'Yes, Google Search Console has a robots.txt Tester tool where you can test whether specific URLs are blocked or allowed by your robots.txt file.' },
    ],
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    title: 'Meta Tag Generator | Free SEO Tool - SEOKit',
    description: 'Free meta tag generator for SEO. Create optimized title tags, meta descriptions, Open Graph and Twitter Card tags. Preview how your page looks in search results.',
    keywords: ['meta tag generator', 'seo meta tag generator', 'meta tags generator', 'html meta tag generator', 'meta description generator'],
    category: 'generator',
    categoryLabel: 'Generators',
    relatedSlugs: ['open-graph-generator', 'twitter-card-generator', 'schema-markup-generator'],
    howToUse: 'Enter your page title (recommended 50-60 characters) and meta description (recommended 150-160 characters). Add your page URL, keywords, and optionally an OG image URL and Twitter handle. The tool shows character counters with color indicators and a live Google SERP preview. Click Copy HTML to get all the generated meta tags.',
    whatIs: 'A meta tag generator is a tool that creates HTML meta tags for your web pages. Meta tags provide metadata about your page to search engines and social media platforms, including the page title, description, Open Graph tags for Facebook/LinkedIn sharing, and Twitter Card tags.',
    useCases: [
      'Create SEO-optimized title tags and meta descriptions',
      'Generate Open Graph tags for better social media sharing',
      'Preview how your page will appear in Google search results',
      'Create Twitter Card meta tags for X sharing',
      'Ensure meta tags are the optimal length for search engines',
    ],
    howItWorks: 'Enter your page details into the form fields. The tool validates character lengths, generates all necessary HTML meta tags (basic, Open Graph, and Twitter Card), and provides a real-time Google SERP preview showing exactly how your page will appear in search results.',
    faq: [
      { question: 'What is the ideal title tag length?', answer: 'Google typically displays the first 50-60 characters of a title tag. Titles longer than 60 characters may be truncated in search results. Aim for 50-60 characters to ensure your full title is visible.' },
      { question: 'What is the ideal meta description length?', answer: 'Google typically shows 150-160 characters of a meta description. While longer descriptions won\'t hurt your SEO, they may be truncated in search results. Aim for 150-160 characters.' },
      { question: 'Do meta keywords still matter for SEO?', answer: 'Google has officially stated that they do not use the meta keywords tag as a ranking signal. However, some other search engines may still consider them. Including relevant keywords is optional but generally not harmful.' },
      { question: 'How do I add meta tags to my website?', answer: 'Copy the generated HTML code and paste it inside the <head> section of your HTML page. If you use a CMS like WordPress, you can use an SEO plugin like Yoast or Rank Math to manage meta tags.' },
    ],
  },
  {
    slug: 'schema-markup-generator',
    name: 'Schema Markup Generator',
    title: 'Schema Markup Generator | JSON-LD Tool - SEOKit',
    description: 'Free schema markup generator. Create JSON-LD structured data for articles, products, FAQs, local business, and more. Boost your rich snippets in search results.',
    keywords: ['schema markup generator', 'json-ld generator', 'structured data generator', 'schema.org generator', 'rich snippet generator'],
    category: 'generator',
    categoryLabel: 'Generators',
    relatedSlugs: ['meta-tag-generator', 'open-graph-generator', 'sitemap-generator'],
    howToUse: 'Select a schema type from the dropdown (Article, Product, FAQ, LocalBusiness, Organization, Person, Event, Recipe, HowTo, or BreadcrumbList). Fill in the form fields that appear for your chosen type. The JSON-LD code is generated in real time with syntax highlighting. Click Copy to copy the structured data and add it to your page.',
    whatIs: 'A schema markup generator creates JSON-LD structured data code that helps search engines understand the content on your web pages. Schema markup can enable rich snippets in search results such as star ratings, FAQ dropdowns, recipe cards, and event listings, which can significantly improve click-through rates.',
    useCases: [
      'Add Article schema for blog posts and news articles',
      'Create Product schema with pricing and availability for e-commerce',
      'Generate FAQ schema to display expandable Q&A in search results',
      'Add LocalBusiness schema for local SEO',
      'Create Event schema for upcoming events',
    ],
    howItWorks: 'Choose your schema type and fill in the relevant fields. The tool generates valid JSON-LD code following Schema.org specifications. The generated code can be placed in a <script type="application/ld+json"> tag on your web page for search engines to read.',
    faq: [
      { question: 'What is JSON-LD?', answer: 'JSON-LD (JavaScript Object Notation for Linked Data) is the recommended format by Google for adding structured data to web pages. It uses a script tag in the HTML head and does not affect the visual appearance of your page.' },
      { question: 'Does schema markup improve SEO rankings?', answer: 'Schema markup does not directly improve rankings, but it can lead to rich snippets in search results that increase click-through rates. Higher CTR can indirectly improve rankings over time.' },
      { question: 'How do I test my schema markup?', answer: 'Use Google\'s Rich Results Test (search.google.com/test/rich-results) or the Schema Markup Validator (validator.schema.org) to test and validate your structured data.' },
      { question: 'Where do I add JSON-LD to my page?', answer: 'Place the JSON-LD code inside a <script type="application/ld+json"> tag in the <head> section of your HTML page. You can also place it in the <body>, but the <head> is preferred.' },
    ],
  },
  {
    slug: 'open-graph-generator',
    name: 'Open Graph Generator',
    title: 'Open Graph Generator | OG Tag Creator - SEOKit',
    description: 'Free Open Graph meta tag generator. Create og:title, og:description, og:image tags for perfect social media sharing previews on Facebook, LinkedIn, and more.',
    keywords: ['open graph generator', 'og tag generator', 'open graph meta tag generator', 'facebook open graph generator', 'og meta tags generator'],
    category: 'generator',
    categoryLabel: 'Generators',
    relatedSlugs: ['twitter-card-generator', 'meta-tag-generator', 'schema-markup-generator'],
    howToUse: 'Enter your Open Graph title, description, image URL, page URL, content type, and site name. The tool shows a live Facebook-style sharing preview so you can see exactly how your content will appear when shared. Click Copy HTML to get the OG meta tags for your page.',
    whatIs: 'An Open Graph generator creates og: meta tags that control how your content appears when shared on social media platforms like Facebook, LinkedIn, Pinterest, and others. These tags define the title, description, image, and other properties of your shared content.',
    useCases: [
      'Control how your blog posts appear when shared on Facebook',
      'Create engaging social media previews for product pages',
      'Ensure consistent branding across social media shares',
      'Set custom images for social sharing instead of random page images',
      'Optimize LinkedIn post previews for professional content',
    ],
    howItWorks: 'Fill in the Open Graph properties and the tool generates the HTML meta tags with the og: prefix. These tags are placed in the <head> section of your HTML. When someone shares your URL on social media, the platform reads these tags to display a rich preview card.',
    faq: [
      { question: 'What is Open Graph protocol?', answer: 'Open Graph is a protocol created by Facebook that lets you control how your web pages are represented when shared on social media. It uses meta tags with the "og:" prefix to define title, description, image, and other properties.' },
      { question: 'What is the recommended OG image size?', answer: 'The recommended Open Graph image size is 1200x630 pixels. This works well across Facebook, LinkedIn, and other platforms. The minimum recommended size is 600x315 pixels.' },
      { question: 'Do I need both Open Graph and Twitter Card tags?', answer: 'Twitter can fall back to Open Graph tags if Twitter Card tags are not present. However, for optimal control over both platforms, it is best to include both OG and Twitter Card meta tags.' },
      { question: 'How do I debug Open Graph tags?', answer: 'Use the Facebook Sharing Debugger (developers.facebook.com/tools/debug/) to see how Facebook reads your OG tags. For LinkedIn, use the LinkedIn Post Inspector (linkedin.com/post-inspector/).' },
    ],
  },
  {
    slug: 'twitter-card-generator',
    name: 'Twitter Card Generator',
    title: 'Twitter Card Generator | Free Meta Tag Tool - SEOKit',
    description: 'Free Twitter Card generator. Create summary, summary_large_image, and player card meta tags. Preview how your content will appear when shared on X (Twitter).',
    keywords: ['twitter card generator', 'twitter meta tag generator', 'twitter card meta tags', 'x card generator', 'twitter card validator'],
    category: 'generator',
    categoryLabel: 'Generators',
    relatedSlugs: ['open-graph-generator', 'meta-tag-generator', 'schema-markup-generator'],
    howToUse: 'Select your card type (summary or summary_large_image). Enter the title, description, image URL, site handle (@yoursite), and creator handle (@author). The tool shows a live Twitter/X-style card preview. Click Copy HTML to get the Twitter Card meta tags.',
    whatIs: 'A Twitter Card generator creates twitter: meta tags that control how your content appears when shared on X (formerly Twitter). Twitter Cards enable rich media previews with images, titles, and descriptions instead of plain text links.',
    useCases: [
      'Create summary cards for blog posts and articles',
      'Generate large image cards for visual content',
      'Ensure your brand looks professional when content is shared on X',
      'Preview exactly how your content will appear on X before publishing',
      'Control the image, title, and description shown in X shares',
    ],
    howItWorks: 'Choose your card type and fill in the details. The tool generates HTML meta tags with the twitter: prefix. Place these in your page\'s <head> section. When someone shares your URL on X, the platform reads these tags to create a rich preview card.',
    faq: [
      { question: 'What is the difference between summary and summary_large_image?', answer: 'The "summary" card shows a small square thumbnail to the left of the title and description. The "summary_large_image" card shows a large image above the title and description, taking up more visual space in the feed.' },
      { question: 'What size should Twitter Card images be?', answer: 'For summary cards, use images at least 144x144 pixels (up to 4096x4096). For summary_large_image cards, use images at least 300x157 pixels, with a recommended size of 1200x628 pixels.' },
      { question: 'How do I validate my Twitter Cards?', answer: 'You can use the Twitter Card Validator (cards-dev.twitter.com/validator) to preview how your card will look. Note that Twitter may cache cards, so changes might take time to appear.' },
      { question: 'Will Twitter use Open Graph tags as fallback?', answer: 'Yes, if Twitter Card tags are not present, Twitter will fall back to using Open Graph tags (og:title, og:description, og:image) to generate the preview card.' },
    ],
  },
  {
    slug: 'sitemap-generator',
    name: 'XML Sitemap Generator',
    title: 'XML Sitemap Generator | Free Online Tool - SEOKit',
    description: 'Free XML sitemap generator. Create sitemaps for your website by entering URLs manually. Set priority, change frequency, and last modified date for each URL.',
    keywords: ['sitemap generator', 'xml sitemap generator', 'sitemap xml generator', 'create sitemap', 'sitemap creator'],
    category: 'generator',
    categoryLabel: 'Generators',
    relatedSlugs: ['robots-txt-generator', 'canonical-url-generator', 'meta-tag-generator'],
    howToUse: 'Add your website URLs one by one using the Add URL button. For each URL, set the priority (0.0 to 1.0), change frequency (daily, weekly, monthly, etc.), and last modified date. The XML sitemap code updates in real time. Click Copy to copy the sitemap and save it as sitemap.xml in your website root.',
    whatIs: 'An XML sitemap generator creates a sitemap.xml file that lists all the important URLs on your website. Search engines like Google, Bing, and Yahoo use sitemaps to discover and crawl your pages more efficiently. A well-structured sitemap helps ensure all your important pages are indexed.',
    useCases: [
      'Create a sitemap for a new website to help search engines discover pages',
      'Generate sitemaps for small to medium websites',
      'Set crawl priorities to tell search engines which pages are most important',
      'Include last modified dates to help search engines find updated content',
      'Submit your sitemap to Google Search Console and Bing Webmaster Tools',
    ],
    howItWorks: 'Enter your website URLs and configure the optional settings for each (priority, change frequency, last modified date). The tool generates valid XML following the Sitemaps.org protocol. Copy the output and save it as sitemap.xml in your website root directory, then submit it to search engines.',
    faq: [
      { question: 'Where do I put my sitemap.xml file?', answer: 'Place your sitemap.xml file in the root directory of your website (e.g., https://example.com/sitemap.xml). You should also reference it in your robots.txt file with a Sitemap: directive.' },
      { question: 'How many URLs can a sitemap have?', answer: 'A single sitemap can contain up to 50,000 URLs and must be no larger than 50MB uncompressed. If you have more URLs, you can create a sitemap index file that references multiple sitemaps.' },
      { question: 'What does priority mean in a sitemap?', answer: 'Priority is a value from 0.0 to 1.0 that indicates the relative importance of a URL compared to other URLs on your site. Note that Google has stated they largely ignore the priority value.' },
      { question: 'How do I submit my sitemap to Google?', answer: 'Go to Google Search Console, select your property, navigate to Sitemaps in the left menu, enter your sitemap URL, and click Submit. You can also add a Sitemap directive to your robots.txt file.' },
    ],
  },
  {
    slug: 'htaccess-generator',
    name: '.htaccess Generator',
    title: '.htaccess Generator | Free Apache Config Tool - SEOKit',
    description: 'Free .htaccess file generator. Create redirect rules, enable GZIP compression, set cache headers, block IPs, and configure Apache server easily.',
    keywords: ['htaccess generator', '.htaccess generator', 'htaccess redirect generator', 'htaccess file generator', 'apache htaccess generator'],
    category: 'generator',
    categoryLabel: 'Generators',
    relatedSlugs: ['robots-txt-generator', 'canonical-url-generator', 'redirect-checker'],
    howToUse: 'Toggle the sections you need: Force HTTPS, Remove WWW, 301/302 redirects, GZIP compression, browser caching, block IPs, and custom error pages. Configure the details for each section. The .htaccess code is generated with comments explaining each rule. Click Copy to get the code and paste it into your .htaccess file.',
    whatIs: 'An .htaccess generator creates configuration directives for Apache web servers. The .htaccess file controls URL redirects, security settings, caching, compression, and other server-level behaviors. It is commonly used for SEO-related server configurations like HTTPS redirects and URL canonicalization.',
    useCases: [
      'Force HTTPS and remove or add www prefix for canonical URLs',
      'Set up 301 redirects for URL changes or site migrations',
      'Enable GZIP compression to improve page speed',
      'Configure browser caching headers for faster load times',
      'Block malicious IPs and bots from accessing your site',
    ],
    howItWorks: 'Toggle the features you need and configure the details. The tool generates valid Apache .htaccess directives with explanatory comments. Each section uses proper Apache mod_rewrite, mod_deflate, or mod_expires directives. Upload the file to your website root directory.',
    faq: [
      { question: 'What is an .htaccess file?', answer: '.htaccess (hypertext access) is a configuration file used by Apache web servers. It allows you to make configuration changes on a per-directory basis without modifying the main server configuration.' },
      { question: 'Does .htaccess work with Nginx?', answer: 'No, .htaccess files are specific to Apache web servers. If you use Nginx, you need to configure equivalent rules in your Nginx server block configuration file.' },
      { question: 'Can .htaccess affect site speed?', answer: 'The .htaccess file itself adds a small amount of overhead since Apache checks for it on every request. However, the configurations it enables (caching, compression) typically far outweigh this overhead.' },
      { question: 'How do I upload the .htaccess file?', answer: 'Use an FTP client or your hosting file manager to upload the .htaccess file to your website root directory. Make sure the filename starts with a dot (.) and has no file extension.' },
    ],
  },
  {
    slug: 'hreflang-tag-generator',
    name: 'Hreflang Tag Generator',
    title: 'Hreflang Tag Generator | Multilingual SEO Tool - SEOKit',
    description: 'Free hreflang tag generator for multilingual websites. Create hreflang tags to tell search engines which language version to show users in different regions.',
    keywords: ['hreflang tag generator', 'hreflang generator', 'hreflang tags generator', 'generate hreflang tags', 'multilingual seo tool'],
    category: 'generator',
    categoryLabel: 'Generators',
    relatedSlugs: ['meta-tag-generator', 'sitemap-generator', 'canonical-url-generator'],
    howToUse: 'Add rows for each language/region version of your page. Select the language and optionally the region from the dropdowns, then enter the URL for that version. Set an x-default URL for users whose language is not covered. Switch between HTML link tags and XML sitemap format using the output tabs. Click Copy to copy the generated code.',
    whatIs: 'A hreflang tag generator creates hreflang annotations that tell search engines which language and regional version of a page to serve to users in different locations. This prevents duplicate content issues across multilingual websites and ensures users see content in their preferred language.',
    useCases: [
      'Set up hreflang tags for multilingual websites',
      'Prevent duplicate content issues across language versions',
      'Tell Google which regional page to show in local search results',
      'Generate hreflang tags for both HTML and XML sitemap formats',
      'Set up x-default for a fallback language page',
    ],
    howItWorks: 'Define each language/region version of your page with its URL. The tool generates hreflang link tags in HTML format (for the <head> section) and XML sitemap format. Each tag specifies the language (and optionally region) code following ISO 639-1 and ISO 3166-1 standards.',
    faq: [
      { question: 'What is hreflang?', answer: 'Hreflang is an HTML attribute that tells search engines the language and geographic targeting of a page. It helps search engines serve the correct language version of a page to users in different countries or regions.' },
      { question: 'What is x-default hreflang?', answer: 'The x-default hreflang value specifies the default page to show when no other language/region matches the user. It is typically set to your main language page or a language selector page.' },
      { question: 'Do I need hreflang for same-language different-region pages?', answer: 'Yes, if you have separate pages for the same language but different regions (e.g., en-US and en-GB), hreflang tags help search engines serve the correct regional version.' },
      { question: 'Can I use hreflang in both HTML and XML sitemap?', answer: 'Yes, but you should use only one method. Do not implement hreflang in both HTML link tags and XML sitemap simultaneously, as this can cause conflicts. Choose the method that works best for your website.' },
    ],
  },

  // ---- Checker ----
  {
    slug: 'redirect-checker',
    name: 'Redirect Chain Checker',
    title: 'Redirect Chain Checker | HTTP Status Tool - SEOKit',
    description: 'Free redirect chain checker. Trace the full redirect path of any URL. See all 301, 302 redirects and final destination. Identify redirect loops and chains.',
    keywords: ['redirect checker', 'redirect chain checker', '301 redirect checker', 'url redirect checker', 'http redirect checker'],
    category: 'checker',
    categoryLabel: 'Checkers',
    relatedSlugs: ['htaccess-generator', 'canonical-url-generator', 'robots-txt-generator'],
    howToUse: 'Explore the HTTP status code reference to understand different redirect types (301, 302, 307, 308) and error codes (404, 500). View the interactive redirect chain diagram to see how redirects work. Study the best practices section to learn how to optimize your redirect strategy for SEO.',
    whatIs: 'A redirect chain checker helps you understand HTTP redirects and status codes. Redirects tell browsers and search engines that a page has moved to a new URL. Understanding redirect chains is critical for SEO because excessive redirects slow down page loading and can dilute link equity.',
    useCases: [
      'Learn about different HTTP redirect types (301, 302, 307, 308)',
      'Understand how redirect chains affect SEO performance',
      'Reference HTTP status codes and their meanings',
      'Plan redirect strategies for site migrations',
      'Identify common redirect problems and how to fix them',
    ],
    howItWorks: 'This educational tool provides a comprehensive reference for HTTP status codes and redirect types. It includes interactive examples showing how redirect chains work, a status code lookup table, and best practices for implementing redirects correctly for SEO.',
    faq: [
      { question: 'What is the difference between a 301 and 302 redirect?', answer: 'A 301 redirect indicates a permanent move and passes most link equity to the new URL. A 302 redirect indicates a temporary move and may not pass link equity. Use 301 for permanent URL changes and 302 for temporary situations.' },
      { question: 'What is a redirect chain?', answer: 'A redirect chain occurs when one URL redirects to another, which then redirects to another, and so on. For example: URL A -> URL B -> URL C. Each hop adds latency and can reduce link equity. Best practice is to redirect directly to the final destination.' },
      { question: 'How many redirects are too many?', answer: 'Google can follow up to 10 redirects in a chain, but best practice is to keep it to 1-2 redirects maximum. Each additional redirect adds load time and can reduce the link equity passed to the final URL.' },
      { question: 'What is a redirect loop?', answer: 'A redirect loop occurs when URL A redirects to URL B, which redirects back to URL A, creating an infinite loop. This results in an error and the page cannot be loaded. Redirect loops are usually caused by misconfigured server rules.' },
    ],
  },

  // ---- Utility ----
  {
    slug: 'canonical-url-generator',
    name: 'Canonical URL Generator',
    title: 'Canonical URL Generator | Duplicate Content Fix - SEOKit',
    description: 'Free canonical URL generator. Create rel=canonical link tags to prevent duplicate content issues. Handle URL parameters, trailing slashes, and protocol variations.',
    keywords: ['canonical url generator', 'canonical tag generator', 'rel canonical generator', 'canonical link generator', 'duplicate content fix'],
    category: 'utility',
    categoryLabel: 'Utilities',
    relatedSlugs: ['meta-tag-generator', 'robots-txt-generator', 'htaccess-generator'],
    howToUse: 'Enter your page URL in the input field. Toggle the options to force HTTPS, remove trailing slashes, remove www prefix, and remove URL parameters. The tool shows the canonical URL transformation in real time and lists all URL variations that would resolve to the canonical. Click Copy to copy the rel="canonical" link tag.',
    whatIs: 'A canonical URL generator creates rel="canonical" link tags that tell search engines which version of a URL is the preferred one. This prevents duplicate content issues when the same content is accessible through multiple URLs (with or without www, trailing slashes, URL parameters, etc.).',
    useCases: [
      'Fix duplicate content caused by URL parameters (e.g., ?utm_source=...)',
      'Consolidate www and non-www versions of your pages',
      'Handle trailing slash variations in URLs',
      'Ensure HTTPS versions are preferred over HTTP',
      'Prevent content duplication from session IDs or sorting parameters',
    ],
    howItWorks: 'Enter a URL and configure normalization options. The tool cleans the URL by applying your chosen rules (force HTTPS, remove www, remove trailing slash, strip parameters) and generates the canonical link tag. It also shows all URL variations that would point to the same canonical URL.',
    faq: [
      { question: 'What is a canonical URL?', answer: 'A canonical URL is the preferred version of a web page URL when multiple URLs lead to the same or similar content. The rel="canonical" tag tells search engines which URL to index and rank, consolidating link equity to that single URL.' },
      { question: 'Do I need canonical tags on every page?', answer: 'It is best practice to include a self-referencing canonical tag on every page, even if there are no duplicate versions. This helps prevent any unexpected duplicate content issues from URL parameters or other variations.' },
      { question: 'Can canonical tags point to different domains?', answer: 'Yes, canonical tags can point to URLs on different domains (cross-domain canonicals). This is useful when you syndicate content or have the same content on multiple domains and want to consolidate ranking signals to one domain.' },
      { question: 'What happens if I set the wrong canonical URL?', answer: 'Setting the wrong canonical URL can cause search engines to ignore your preferred page and index the wrong version instead. This can lead to lost rankings and traffic. Always verify your canonical tags are pointing to the correct URLs.' },
    ],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}

export function getToolsByCategory(category: Tool['category']): Tool[] {
  return tools.filter(t => t.category === category);
}

export function getRelatedTools(slugOrTool: string | Tool): Tool[] {
  const tool = typeof slugOrTool === 'string' ? tools.find(t => t.slug === slugOrTool) : slugOrTool;
  if (!tool) return [];
  return tool.relatedSlugs
    .map(slug => tools.find(t => t.slug === slug))
    .filter((t): t is Tool => t !== undefined);
}

import { siteConfig } from './site-config';
export const categories = siteConfig.categories;
