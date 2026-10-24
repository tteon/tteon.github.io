# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- When refactoring key-value pair grids in Astro components to semantic description lists (`<dl>`), convert generic text containers (`<span>`, `<strong>`) to `<dt>` and `<dd>` pairs wrapped in a `<div>`, avoiding complex blocks that would squash structurally distinct semantic tags.
