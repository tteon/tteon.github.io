# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).

- When refactoring key-value pair grids into semantic lists, convert generic containers to `<dl>`, `<dt>`, and `<dd>` tags to improve document outline for screen readers, but ensure valid HTML5 structure (no direct `<a>` children or complex squashed elements).
