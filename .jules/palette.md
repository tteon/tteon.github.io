# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).

- When refactoring generic key-value pair grids into semantic description lists (`<dl>`), convert generic text containers (like `<div>`, `<span>`, `<strong>`) and generic heading tags (like `<h3>`) to `<dt>` and `<dd>` elements. Wrapping them inside a `<div>` that is a direct child of the `<dl>` is valid HTML5 and preserves Tailwind visual layouts.
