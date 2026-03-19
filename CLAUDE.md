# CLAUDE.md

## Project: ToolBox Online

SEO-driven free online tools website targeting overseas (English-speaking) users. Revenue model: Google AdSense.

## Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
- Deployed on Vercel: https://toolbox-online-psi.vercel.app
- Google Analytics: G-H3PQ0MMZQY

## Project Structure
```
toolbox-online/
├── app/                    # Next.js app directory
│   ├── [tool-slug]/        # Each tool: page.tsx (server) + client.tsx (client)
│   ├── about/              # About page
│   ├── privacy-policy/     # Privacy Policy page
│   ├── layout.tsx          # Root layout with Header/Footer/GA
│   ├── page.tsx            # Homepage (tool grid by category)
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── robots.ts           # Robots.txt
├── components/             # Header, Footer, ToolLayout, ToolCard, GoogleAnalytics
├── lib/
│   ├── tools.ts            # Tool registry (single source of truth)
│   └── seo.ts              # SEO helpers, JSON-LD, BASE_URL
└── public/                 # Static assets
```

## Key Patterns

### Adding a New Tool
1. Add entry to `lib/tools.ts` (slug, name, title, description, keywords, category, relatedSlugs, howToUse, faq)
2. Create `app/[slug]/page.tsx` — server component with metadata + JSON-LD (copy existing pattern)
3. Create `app/[slug]/client.tsx` — client component with `'use client'` directive
4. Tool auto-appears on homepage, sitemap, related tools links

### SEO Checklist (every page)
- Title tag matching target keyword
- Meta description with keyword
- Canonical URL
- OpenGraph + Twitter Card
- Schema.org JSON-LD (WebApplication + FAQPage)
- H1 matching keyword
- Breadcrumb navigation
- How-to-Use section
- FAQ section
- Related Tools internal links

## Commands
```bash
# Dev server
cd toolbox-online && npm run dev

# Build
cd toolbox-online && npm run build

# Or use preview server (from project root)
# Configured in .claude/launch.json as "toolbox-dev"
```

## Current Status
- 18 tools live across 4 categories (Code Tools 6, Converters 6, Calculators 3, Generators 3)
- Google Search Console verified, sitemap submitted
- Waiting for Google indexing (submitted 2026-03-14)
- AdSense not yet applied (need traffic first)

## Important Notes
- All tool processing happens client-side (browser) — no server-side data processing
- SEO-friendliness is top priority for all changes
- Tool selection is data-driven: use SEMrush keyword research to find blue-ocean keywords before building
- BASE_URL is defined in `lib/seo.ts` — update there if domain changes
