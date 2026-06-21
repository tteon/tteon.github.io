# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- The HTML `<details>` element inherently conveys its expanded/collapsed state to screen readers. Always add `aria-hidden="true"` to any child decorative icons (like `↓` arrows) inside `<summary>` elements to prevent redundant or confusing screen reader announcements.
