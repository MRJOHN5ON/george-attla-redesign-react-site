# George Attla — Making of a Champion

Educational archive about sprint sled dog racer **George Attla** (1958–2011). Rebuilt as a fast, accessible **Next.js / React** site with the original photos, articles, and PDFs preserved.

**Live site:** after deploy, open your GitHub Pages URL (see [DEPLOY.md](./DEPLOY.md)).

## Local preview

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build (same as GitHub Actions)

```bash
npm run build
```

Static files are written to `out/`.

## Project structure

| Path | Purpose |
|------|---------|
| `src/app/` | Pages and routing |
| `src/content/pages/` | Article HTML from the original archive |
| `public/images/` | Photos |
| `public/files/` | PDFs and downloads |
| `src/components/` | Layout, navigation, article UI |

## Deploy

See **[DEPLOY.md](./DEPLOY.md)** for GitHub Pages setup with GitHub Actions.

## Credits

Content © original *Making of a Champion* educational project. Site redesign for preservation and classroom use.
