# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Use `tabindex="0"` for custom `<pre>` blocks inside `.astro` files to ensure they are keyboard focusable, especially if they can scroll horizontally.
- Refactor key-value layouts into semantic HTML `<dl>`, `<dt>`, and `<dd>` where appropriate, rather than using non-semantic `<div>` and text tags, to improve heading hierarchy and screen reader interpretation. Tailwind CSS's default styles often handle `<dd>` reset gracefully.
