# Deploy to GitHub Pages

This is a **Next.js + React** site exported as static HTML for GitHub Pages.

## One-time setup (about 10 minutes)

### 1. Install GitHub CLI (if needed)

```bash
brew install gh
gh auth login
```

Follow the prompts (GitHub.com → HTTPS → login in browser).

### 2. Create the repo and push

From this folder:

```bash
cd "/Users/ryleyjohnson/Desktop/web work/george attla redesign react site"

git init
git add .
git commit -m "George Attla archive — React/Next.js redesign"

gh repo create george-attla-redesign-react-site --public --source=. --remote=origin --push
```

Pick another repo name if you prefer; if the name changes, GitHub Pages URL becomes  
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### 3. Turn on GitHub Pages

```bash
gh api repos/{owner}/{repo}/pages -X POST -f build_type=workflow
```

Or in the browser: **Repo → Settings → Pages → Build and deployment → Source: GitHub Actions**.

### 4. Wait for the workflow

**Actions** tab → “Deploy to GitHub Pages” should go green (~2–3 min first time).

Your site will be at:

`https://YOUR_GITHUB_USERNAME.github.io/george-attla-redesign-react-site/`

## Local development (no GitHub)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production build (same as GitHub)

```bash
NEXT_PUBLIC_BASE_PATH=/george-attla-redesign-react-site npm run build
npx serve out
```

Use your real repo name in `NEXT_PUBLIC_BASE_PATH` when testing the subpath locally.

## What gets uploaded to GitHub

- Source code, content JSON, images in `public/`
- GitHub Actions builds and deploys only the `out/` folder (generated HTML)

**Not** uploaded: `node_modules/`, `.next/` (in `.gitignore`).

## Repo size note

Images are large (~300MB). GitHub allows it, but first push may take a few minutes.
