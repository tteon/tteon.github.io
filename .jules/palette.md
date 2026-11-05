# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- When refactoring key-value pair grids into semantic `<dl>` lists, convert generic tags (like `<span>` or `<strong>`) to `<dt>` and `<dd>` to improve document hierarchy and page outline scannability for screen readers, ensuring that wrappers directly inside `<dl>` are `<div>` elements.
