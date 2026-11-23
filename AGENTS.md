# AGENTS.md

Rules for agents working in `tteon.github.io` (personal portfolio & experiment log).

1. Keep content in English by default unless a specific bilingual post is requested.
2. Experiment posts under `src/content/experiments/` MUST include `hypothesis`, `verdict` (`Supported | Refuted | Mixed | Inconclusive`), `keyMetric`, `host`, and explicit scope limits. Never publish an execution failure as `Refuted` or `Supported`.
3. Never add `public/CNAME` — `seocho.blog` is hosted separately in `tteon/seocho-docs`.
4. Always validate before pushing:
   ```bash
   npm run build && npm run check:links
   ```
