# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Make horizontally scrollable regions, like `<pre>` tags for code blocks, keyboard accessible by adding `tabindex="0"`.
- When rendering key-value pair grids (like terminology or feature lists), use semantic `<dl>`, `<dt>`, and `<dd>` elements instead of generic `<div>` or headings to improve accessibility and semantic meaning.
