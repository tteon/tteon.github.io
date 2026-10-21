# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Refactoring key-value pair grids into semantic `<dl>` lists in Astro components improves the document's heading hierarchy and makes the page outline scannable for screen readers. When doing this, convert generic text containers (`<span>`, `<strong>`, etc.) to `<dt>` and `<dd>`, and ensure the direct children of the `<dl>` are only `<dt>`, `<dd>`, or `<div>` wrappers.
