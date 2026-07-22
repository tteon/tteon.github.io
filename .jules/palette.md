# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- For UX and accessibility tasks in this repository, ensure scrollable regions like `<pre>` code blocks are keyboard accessible by adding `tabindex="0"`.
- Use semantic list tags (`<dl>`, `<dt>`, `<dd>`) for key-value pair grids instead of generic `<div>`/`<span>` containers, as it is valid HTML5 to wrap `<dt>` and `<dd>` pairs inside a `<div>` that is a direct child of the `<dl>` allowing you to preserve existing CSS grid styling classes without breaking semantics.
