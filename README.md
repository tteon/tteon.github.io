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

Current sync policy has both local and remote guardrails:

- `scripts/sync.mjs` can mirror selected docs into this repo
- `scripts/docs-contract.mjs` is the single mirror contract used by sync and
  drift checks
- `.github/workflows/auto-sync-mirrored-docs.yml` refreshes mirrors on a daily
  schedule and can be triggered by `tteon/seocho` through `repository_dispatch`
- mirrored pages should say `Source mirrored from ...`
- if you improve a mirrored page here, check whether the same contract change
  belongs in the main repo too

## Hosting Boundaries

`seocho.blog` currently deploys as a static GitHub Pages site. Treat it as a
fast public docs and product surface, not as a hosted SEOCHO runtime.

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

GitHub Pages is not a hard constraint. If the site needs server-side previews,
webhooks, protected routes, edge functions, analytics routing, or richer
deployment controls, keep the Astro output static and move the deployment target
to a platform such as Cloudflare Pages, Netlify, Vercel, or OpenAI Sites. Keep
`seocho.blog` as the canonical domain and keep the same validation gates before
cutover.

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
4. If Astro content cache looks stale, stop the dev server and run a clean
   rebuild:
   ```bash
   npm run rebuild
   ```
   CI and deploy use `npm run build:ci`, which clears `dist/` and `.astro/`
   before building. During local development, do not delete `.astro/` while
   `npm run dev` is running; it can briefly break Astro's generated content
   imports.
5. Run doc quality and built-link checks:
   ```bash
   npm run check:sync
   bash scripts/check-doc-quality.sh
   bash scripts/check-built-links.sh
   ```
