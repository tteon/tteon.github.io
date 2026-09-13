# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- When refactoring key-value pair grids into semantic `<dl>` lists in Astro components, converting generic heading tags (like `<h3>`) to `<dt>` elements improves the document's heading hierarchy and makes the page outline more scannable for screen readers.
