# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).

- If CI checks fail due to docs sync drift detected by `npm run check:sync`, running `node scripts/sync.mjs` can update the mirrored content. However, if a source file was moved or deleted in the source repository, `sync.mjs` alone will not fix the CI error; you must manually update `fileMappings` and `routeReplacements` in both `scripts/check-doc-sync.mjs` and `scripts/sync.mjs`.
