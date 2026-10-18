# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- When refactoring layout grids into semantic definition lists, ensure to use `<dl>`, `<dt>`, and `<dd>` correctly. Generic `<div>`, `<span>`, and `<strong>` tags used for key-value structures fail to communicate relationships to screen readers. Grouping `<dt>` and `<dd>` inside a `<div>` under a `<dl>` is valid HTML5 and maintains grid layout styling (like Tailwind CSS) perfectly.
