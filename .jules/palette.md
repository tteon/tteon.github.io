# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- Ensure scrollable code blocks (<pre>) have tabindex="0" to be keyboard accessible.
- Use semantic <dl>, <dt>, and <dd> tags for key-value pair grids instead of generic <div> or <span> containers.
