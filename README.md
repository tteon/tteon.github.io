# SEOCHO Website (tteon.github.io)

This repository hosts the official documentation and landing page for the [SEOCHO](https://github.com/tteon/seocho) project.

## Tech Stack
- **Framework**: [Astro](https://astro.build)
- **Docs Theme**: [Starlight](https://starlight.astro.build)
- **Styling**: Tailwind CSS + Custom Dark Theme
- **Deployment**: Automatic via GitHub Actions to GitHub Pages.

## Source Of Truth

This repository is the website presentation layer.

- public domain: `https://seocho.blog`
- main repo source of truth: `/home/hadry/lab/seocho`
- core source docs usually come from `/home/hadry/lab/seocho/README.md` and
  `/home/hadry/lab/seocho/docs/*`

Current sync policy is local-helper based, not remote auto-sync:

- `scripts/sync.mjs` can mirror selected docs into this repo
- mirrored pages should say `Source mirrored from ...`
- if you improve a mirrored page here, check whether the same contract change
  belongs in the main repo too

Read [AGENTS.md](AGENTS.md) before making doc or site changes.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Run doc quality and built-link checks:
   ```bash
   bash scripts/check-doc-quality.sh
   bash scripts/check-built-links.sh
   ```
