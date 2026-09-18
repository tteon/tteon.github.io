# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Use `tabindex="0"` on horizontally scrollable `<pre>` elements so they can be accessed via keyboard.
- Refactor generic non-semantic grid elements (e.g., `<div>` mapping key-value data) to semantic description lists (`<dl>`) with `<dt>` and `<dd>` components to improve document scannability for assistive technologies. Because Tailwind resets default `<dd>` margins, this does not alter visual flex/grid layouts.
