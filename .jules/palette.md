# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).

- When refactoring key-value pair grids into semantic `<dl>` lists in Astro components, converting generic heading tags (like `<h3>`) to `<dt>` elements improves the document's heading hierarchy and makes the page outline scannable for screen readers.
- Tailwind CSS's preflight resets remove default margins on `<dd>` elements. This allows refactoring non-semantic tags (like `<div>` and `<span>`) into `<dl>`, `<dt>`, and `<dd>` without altering existing flex/grid visual layouts, making manual Playwright visual testing bypassable for these specific structural semantics changes.
- When refactoring generic containers to semantic description lists (`<dl>`) in this Tailwind/Astro codebase, it is valid HTML5 to wrap `<dt>` and `<dd>` pairs inside a `<div>` that is a direct child of the `<dl>`. However, this `<div>` must strictly contain only `<dt>` and `<dd>` tags.
