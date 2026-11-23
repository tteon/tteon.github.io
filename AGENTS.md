# AGENTS.md

Rules for agents working in `tteon.github.io` (personal portfolio & experiment log).

1. Keep content in English by default unless a specific bilingual post is requested.
2. Follow the **`experiment-storytelling`** skill contract (`~/.agents/skills/experiment-storytelling/SKILL.md`):
   - Every experiment post under `src/content/experiments/` MUST include `hypothesis`, `falsification`, `verdict` (`Supported | Refuted | Mixed | Inconclusive`), `keyMetric`, `host`, `environment` manifest fields, and a 6-stage narrative (`Motivation -> Hypothesis & Setup -> Environment -> Visual Evidence & Tables -> Mechanism Breakdown -> Scope Limits & Next Experiment`).
   - Never publish an execution failure as `Refuted` or `Supported` (always `Inconclusive`).
   - Every quantitative experiment post MUST include at least one publication-grade `figures4papers`-styled figure under `public/figures/` generated via `pubfig.py` from verified raw artifacts (visually inspected before committing).
3. Never add `public/CNAME` — `seocho.blog` is hosted separately in `tteon/seocho-docs`.
4. Always validate before pushing:
   ```bash
   npm run build && npm run check:links
   ```
