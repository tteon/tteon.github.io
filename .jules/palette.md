# SEOCHO Docs UX & Accessibility Learnings

- Links displaying only a commit hash or non-descriptive short code should include a descriptive `aria-label` (e.g. `aria-label="View commit {hash} on GitHub"`) to improve screen reader experience.
- Any decorative SVGs inside links or buttons must use `aria-hidden="true"` so they do not interrupt or duplicate accessible text.
