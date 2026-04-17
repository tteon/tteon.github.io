# Palette UX/A11y Journal

- Decorative elements inside links, such as raw text arrows (`→`) and visual icons (SVGs), should have `aria-hidden="true"` so that screen readers skip them instead of announcing them unnecessarily.
- When an interactive element (like a link) primarily displays non-descriptive text, such as a short commit hash (e.g. `#d83j2a`), an `aria-label` should be added to explain the action or destination of the link (e.g. `aria-label="View release details for commit d83j2a"`).
