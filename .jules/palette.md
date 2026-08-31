# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Use semantic list tags (`<dl>`, `<dt>`, `<dd>`) for key-value pair grids instead of generic `<div>`/`<span>` containers. Note that wrapping `<dt>` and `<dd>` in a `<div class="something">` directly inside a `<dl>` is valid HTML5 and allows you to preserve flex or grid styling.
- Ensure scrollable code blocks (like `<pre>` elements with `overflow-x-auto`) have `tabindex="0"` applied so they are horizontally scrollable by keyboard-only users.
