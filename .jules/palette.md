# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Ensure scrollable regions like `<pre>` code blocks are keyboard accessible by adding `tabindex="0"`.
- Use semantic list tags (`<dl>`, `<dt>`, `<dd>`) for key-value pair grids instead of generic `<div>`/`<span>` containers. It is valid HTML5 to wrap `<dt>` and `<dd>` pairs inside a `<div>` that is a direct child of the `<dl>`.
