# UX and Accessibility Learnings for SEOCHO Docs

- Ensure decorative visual elements (like CSS/HTML arrows, e.g., `→`, or purely decorative SVGs inside links/buttons) use `aria-hidden="true"`.
- Ensure links with dynamic, short, or non-descriptive text (like raw commit hashes, e.g., `#{update.hash}`) utilize descriptive `aria-label`s (e.g., `aria-label="View commit ${update.hash} on GitHub"`).

- When refactoring components into semantic description lists (`<dl>`), be aware that a `<dl>` tag can contain `<div>` child tags holding the `<dt>` and `<dd>` components, but it is invalid HTML5 if those inner `<div>`s contain other tag types like `<p>`. If an existing layout includes mixed textual tags (like `<p>` and `<h3>`), avoid converting the parent block to a `<dl>` unless you refactor all text strictly into `<dt>` and `<dd>`.
