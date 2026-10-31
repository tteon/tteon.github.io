# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Refactoring generic flex/grid layouts into semantic description lists (`<dl>`) with `<dt>` and `<dd>` pairs improves structural meaning for screen readers without breaking visual appearance, as Tailwind's preflight removes default margins on `<dd>`.
