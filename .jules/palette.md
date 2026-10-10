# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- For generic key-value grids (like feature descriptions or stats) in Astro components, prefer semantic `<dl>`, `<dt>`, and `<dd>` elements over `<div>`, `<span>`, and `<strong>`. This improves accessibility by providing proper list semantics for screen readers, and works seamlessly with Tailwind CSS due to its default margin resets.
