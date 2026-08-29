# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Use standard HTML5 `<dl>` tags (with `<dt>` and `<dd>`) for key-value pair grids rather than generic `<div>`/`<span>` tags to improve semantics. (In HTML5 it is valid to wrap `<dt>`/`<dd>` pairs inside a `<div>` direct child of a `<dl>` for layout purposes).
- Ensure horizontal scrolling elements like `<pre class="overflow-x-auto">` have `tabindex="0"` for keyboard accessibility.
