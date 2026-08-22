# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Use semantic list tags (`<dl>`, `<dt>`, `<dd>`) for key-value pair grids instead of generic `<div>`/`<span>` containers. `<dt>` and `<dd>` can be wrapped in a `<div>` direct child of `<dl>` to preserve CSS grid styling.
