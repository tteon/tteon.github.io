# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Refactored a generic grid inside `LettaHero.astro` into a semantic `<dl>` description list structure, verifying that `<dt>` and `<dd>` pairs can validly be wrapped in `<div>` elements in HTML5 to preserve Tailwind CSS grid layouts.
- Applied `tabindex="0"` to a scrollable `<pre>` block in `index.astro` to ensure keyboard accessibility.
