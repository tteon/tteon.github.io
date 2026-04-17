## Accessibility Learnings
- Use `aria-label` for links that only display non-descriptive text like raw commit hashes, to clearly indicate their destination and purpose (e.g. `aria-label="View commit 12345 on GitHub"`).
- Use `aria-hidden="true"` on decorative visual elements such as SVG icons accompanying links or decorative text arrows (`→`) to hide them from screen readers.
