# Website Cloner (Cursor)

Reverse-engineer a website into a Next.js + shadcn/ui + Tailwind v4 codebase using Cursor Agent.

## Quick start

```bash
npm install
npm run dev
```

In Cursor Agent chat:

```
/clone-website https://example.com
```

Or: “Clone https://example.com pixel-perfect into this project.”

**Requires:** Node 24+, browser MCP enabled (cursor-ide-browser), and permission to copy the target site.

## Project layout

| Path | Purpose |
|------|---------|
| `src/` | Next.js app — clone output lands here |
| `public/` | Downloaded images, videos, favicons |
| `docs/research/` | Component specs and extraction notes |
| `docs/design-references/` | Screenshots |
| `.cursor/skills/clone-website/` | Full clone pipeline instructions |
| `AGENTS.md` | Project rules for the agent |

## Full site (all pages)

Every URL from the WordPress sitemap is crawled into `src/content/pages/`:

```bash
node scripts/crawl-site.mjs   # Re-fetch all ~66 pages + images
```

Inner pages use the same paths as the live site (e.g. `/youth-sled-dog-program`, `/about-2/credits-2`).

## Commands

```bash
npm run dev        # Dev server (http://localhost:3000)
npm run build      # Production build (homepage + 66 static pages)
npm run check      # lint + typecheck + build
```

## Ethics

Only clone sites you own or have explicit permission to reproduce. Not for impersonation or ToS violations.

Based on [ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) (MIT).
