# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).
\n- Ensure scrollable regions like `<pre>` code blocks are keyboard accessible by adding `tabindex="0"`.
\n- Fix CI docs sync failures by running `node scripts/sync.mjs` to resolve sync drift, and ensure Node.js versions in `.github/workflows/` match the required version.
