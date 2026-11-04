# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- When refactoring key-value pair grids into semantic <dl> lists, generic text containers (like <span>, <strong>) can be converted to <dt> and <dd> elements while retaining a <div> wrapper direct child of the <dl>. This improves the document's heading hierarchy and makes the page outline scannable for screen readers.
