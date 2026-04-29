# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
- To prevent Cross-Site Scripting (XSS) vulnerabilities in Astro components, avoid using the `set:html` directive for rendering code blocks or content that can be represented with standard HTML tags; standard Astro/JSX rendering provides automatic character escaping.
