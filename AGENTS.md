# AGENTS.md

Execution rules for coding agents working in `tteon.github.io`.

## 1. Read First

Before editing:

1. `README.md`
2. `astro.config.mjs`
3. `scripts/check-doc-quality.sh`
4. `scripts/check-built-links.sh`
5. `scripts/sync.mjs`

If the change touches mirrored documentation under `src/content/docs/docs/`,
also inspect the matching source material in the main repo at
`/home/hadry/lab/seocho/README.md` or `/home/hadry/lab/seocho/docs/*`.

## 2. Site Contract

- public docs domain is `https://seocho.blog`
- docs home route is `/docs/`, never `/docs/index/`
- internal doc links should stay route-first:
  - `/docs/.../`
  - `/sdk/.../`
  - `/blog/.../`
- prefer clickable markdown links over raw code-form route literals

## 3. Source Of Truth And Sync

This repo is the website presentation layer. The main repository remains the
source of truth for core product and operator contracts.

- main repo path in this workspace: `/home/hadry/lab/seocho`
- mirrored docs usually originate from:
  - `/home/hadry/lab/seocho/README.md`
  - `/home/hadry/lab/seocho/docs/*`
- use `scripts/sync.mjs` only as a local helper
- do not claim that remote automatic sync exists unless there is an actual
  enforced workflow
- mirrored pages must say `Source mirrored from ...`, not `Synced automatically
  from ...`

When the source contract changes:

1. update the mirrored website page
2. update `scripts/sync.mjs` if it injects frontmatter for that page
3. verify route links and build output

## 4. Documentation Rules

- optimize for developer comprehension, not marketing filler
- keep code examples copy-pasteable
- keep endpoint names, SDK calls, and route names consistent with the main repo
- use Mermaid diagrams when a workflow or system path is easier to understand
  visually
- avoid duplicate or conflicting slugs; build warnings about duplicate IDs are
  real defects until explained

## 5. Required Validation

Run these before landing changes:

```bash
bash scripts/check-doc-quality.sh
npm run build
bash scripts/check-built-links.sh
```

What these gates mean:

- `check-doc-quality.sh` rejects stale sync wording and stale doc patterns
- `npm run build` confirms Astro/Starlight output still compiles
- `check-built-links.sh` rejects internal links or assets that do not resolve in
  `dist/`

## 6. Editing Rules

- use ASCII unless the file already needs non-ASCII content
- keep doc navigation intentional and shallow
- when a page references another site page, prefer a real markdown link
- when adding diagrams, keep them readable in both light and dark rendering
- if a mirrored page becomes materially better here, decide whether the main
  repo source should be updated too

## 7. Landing Rules

- default branch is `main`
- validate before push
- if the change affects mirrored docs, confirm the matching main-repo contract
  still agrees
