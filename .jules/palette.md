# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- When refactoring generic containers to semantic description lists (`<dl>`) in this Tailwind/Astro codebase, it is valid HTML5 to wrap `<dt>` and `<dd>` pairs inside a `<div>` that is a direct child of the `<dl>`. This allows preserving existing CSS grid styling classes without breaking semantics.
- Tailwind CSS's preflight resets remove default margins on `<dd>` elements. This allows refactoring non-semantic tags (like `<div>` and `<span>`) into `<dl>`, `<dt>`, and `<dd>` without altering existing flex/grid visual layouts.
- For UX and accessibility tasks in this repository, ensure scrollable regions like `<pre>` code blocks are keyboard accessible by adding `tabindex="0"`, and use semantic list tags (`<dl>`, `<dt>`, `<dd>`) for key-value pair grids instead of generic `<div>`/`<span>` containers.
