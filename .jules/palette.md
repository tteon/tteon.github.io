# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Refactor key-value visual grids into semantic description lists (`<dl>`, `<dt>`, `<dd>`) to provide meaningful structure and context to assistive technologies like screen readers, while relying on Tailwind CSS's Preflight reset to maintain visual layout without default margin issues.
