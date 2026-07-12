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
- main repo source of truth: `https://github.com/tteon/seocho`
- core source docs usually come from `seocho/README.md` and `seocho/docs/*`

Current sync policy is local-helper based, not remote auto-sync:

- `scripts/sync.mjs` can mirror selected docs into this repo
- mirrored pages should say `Source mirrored from ...`
- if you improve a mirrored page here, check whether the same contract change
  belongs in the main repo too

## GitHub Pages Boundaries

`seocho.blog` is a static GitHub Pages site. Treat it as a fast public docs and
product surface, not as a hosted SEOCHO runtime.

Good fits:

- Starlight docs, static search, sidebars, and content collections
- build-time generated pages from repo-root docs
- static examples, diagrams, screenshots, and release notes
- links to GitHub issues, PRs, releases, actions, and Discord announcements

Avoid:

- server-side secrets, OAuth callbacks, webhooks, or private context graph data
- runtime demos that imply a live backend exists on the docs host
- auto-posting or community workflows that should live in GitHub Actions or
  Knowledge OS
- docs pages that are only useful to maintainers on a first read

Docs UX policy:

- `/docs/` should answer "what should I read next?" before it lists files
- sidebar groups should follow user jobs: start, build, operate, contribute
- the first code path should be the lightest useful path (`Seocho.local(...)`)
- internal migration and governance docs should stay discoverable but out of
  the first-read path

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
   npm run check:sync
   bash scripts/check-doc-quality.sh
   bash scripts/check-built-links.sh
   ```
