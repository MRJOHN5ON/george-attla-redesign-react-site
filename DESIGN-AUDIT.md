# Executive design audit — George Attla archive

Generated from nav tree + per-page content analysis. **All original page copy and media are preserved**; decisions below are layout and navigation only.

## Layout types

| Layout | Count | Design decision |
|--------|------:|-----------------|
| **article** | 27 | Standard reading column + section sidebar when siblings exist |
| **video-hub** | 12 | Each clip in an `attla-video-chapter` block (heading + intro + embed) |
| **gallery** | 8 | Full-width image grid, captions preserved |
| **chapter** | 8 | Wide TOC, PDF links marked, chapter nav in sidebar |
| **index** | 2 | Youth program + books hub — chapter list styling |
| **winners** | 2 | Year \| winner table (Tok, Fur Rondy) |
| **video-article** | 1 | Single featured video above prose |
| **sparse** | 1 | Hub fallback with child links (`/attlas-racing-career` → redirects) |
| **placeholder** | 2 | Amber notice; timeline-gallery has no real archival body |

## Section decisions (top-level nav)

### Youth Program
- **Hub:** `/youth-sled-dog-program` — index layout, chapter TOC
- **Child:** Frank Attla program page — article
- **Chapters 1–8** — chapter layout, PDF download affordance
- **Decision:** Treat as **manual**; sidebar shows chapter list when on any chapter page

### Champion Mindset
- **Hub:** `/on-mindset-2` — video-article
- **Children:** Not give up, Dog Connection (with Champion Sled Dogs, Lingo)
- **Decision:** Mindset intro banner; dog connection pages get gallery/video as detected

### Meet the Man
- **Hub:** `/meet-the-man` — video-hub (bio + Project Jukebox)
- **Children:** Role Model (gallery), No Stopping George Attla
- **Decision:** Sidebar links between biography and character stories

### Sprint Racing
- **Hub:** `/sprint-racing-2` — article with hero image
- **Attla Racing Career** `/racing-career` — video-hub (village races)
- **Children:** Interviews, Early Career, More Footage — all video-hub
- **Championships:** Fur Rondy, Open North American (winners + video), Tok (winners), Koyukuk, Dogs of Speed
- **Decision:** Racing intro banner; video pages use chapter blocks; winners pages use year table
- **Redirect:** `/attlas-racing-career` → `/racing-career` (empty duplicate on original site)

### AKSHOF · Opus · History · People · About
- Article layout default; hall of fame and books may include PDFs
- **Opus:** `/spirit-of-the-wind-2` redirects to `/spirit-of-the-wind`
- **History:** timeline-gallery flagged placeholder
- **About:** credits may use Themify-heavy layout — processed as article

## Global chrome

- **Breadcrumbs:** Labels from nav tree (not slugified URLs)
- **Sidebar:** “In this section” — siblings or children from nav
- **Search:** Full-text across 66 pages
- **Desktop nav:** 4 primary + Explore mega menu

## Regenerate audit

```bash
npm run audit:pages
```

Output: `src/data/page-audit.json`
