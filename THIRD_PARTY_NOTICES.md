# Third-Party Notices

This repository vendors and adapts third-party work. Each entry records the source, the
licence, and exactly what was changed here.

---

## tasteskill v2 (`design-taste-frontend`)

- **Upstream:** https://github.com/Leonxlnx/taste-skill
- **Docs:** https://www.tasteskill.dev/docs
- **Version vendored:** v2.1.5, commit [`12af471`](https://github.com/Leonxlnx/taste-skill/commit/12af471f627f866411b4bd785b19646d3672784c) (2026-10-25)
- **Licence:** MIT, Copyright (c) 2026 Leonxlnx
- **Vendored into:** `skills/design/kedata-design-frontend/`
- **Skill name:** `design-taste-frontend` → `kedata-design-frontend`

### What was vendored unchanged

Copy of the upstream skill folder:

| Path | Contents |
| --- | --- |
| `references/` | 11 reference documents (copy, type, colour, layout, imagery, motion, scenes, critique, tells, research, app-screens) |
| `scripts/` | `draw.mjs`, `inspect.mjs`, `lint.mjs`, `assets.mjs`, `scenes.mjs`, `lib/` (zero-dependency Chrome DevTools client, in-page probe, rules) |
| `library/` | Direction data: directions, heroes, sections, type systems, palettes, photographs, studied sites, motions, app styles |
| `assets/` | `base.css`, `base.js`, `app.css`, `charts.js`, `scenes/stage.js`, `scenes/stage.css` |
| `evals/` | Test briefs for measuring the skill against a no-skill baseline |

### What was changed in this adaptation

| File | Change |
| --- | --- |
| `SKILL.md` | Frontmatter `name` → `kedata-design-frontend`; description rewritten for Kedata triggers; added "Kedata context" section (DESIGN_BRIEF.md as the contract, precedence rules, artifact handoff); step 6 now takes token names from the brief and builds the brief's §8 states; step 10 reports brief coverage and deviations; file table corrected where upstream referenced a scene library (`library/scenes.json`, `assets/scenes/demo/`) that does not ship in the repo. The run, house rules, laws and special cases are upstream's text. |
| `agents/openai.yaml` | Added, in the house format used by the other Kedata skills. |
| `evals/evals.json` | `skill_name` renamed; `adapted_from` field added. |

### Notes carried over from upstream

- Library photographs are served by Lorem Picsum from Unsplash under the Unsplash licence; they
  are atmosphere placeholders, not the project's own pictures.
- Pictures found by `assets.mjs` keep their own licences (CC0, public domain, CC BY, CC BY-SA by
  default); `--get` records title, creator, licence and source in `assets/credits.json`, and the
  page must carry those credits.
- Fonts referenced by dealt type systems load from Google Fonts and Fontshare; check each face's
  licence for your use.
- The scores in `references/research.md` are model judgements from screenshots, not Awwwards scores.
- Draw history lives in `~/.taste-skill/history.json`; set `TASTE_SKILL_HISTORY` to move it.

### Licence text

```
MIT License

Copyright (c) 2026 Leonxlnx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ponytail

- **Upstream:** https://github.com/DietrichGebert/ponytail
- **Version vendored:** v5.3.3, commit [`7801d06`](https://github.com/DietrichGebert/ponytail/commit/7801d061243d7b753bad0e0b3c057cd250b11755) (2026-10-29)
- **Licence:** MIT, Copyright (c) 2026 DietrichGebert
- **Vendored into:** `skills/engineering/kedata-ponytail*/`

Six markdown-only skills. Upstream names are prefixed `kedata-` so they sit beside the
house skills; each gets a "Kedata context" section and house-format `agents/openai.yaml`.
The benchmark figures and the honesty rule (never claim per-repo savings) are unchanged.

| Upstream | Here | What changed |
| --- | --- | --- |
| `ponytail` | `kedata-ponytail` | Triggers renamed; "Kedata context" added (artifacts stay the contract, house standards are not bloat); "never cut" list extended to approved-artifact requirements. |
| `ponytail-review` | `kedata-ponytail-review` | "Kedata context" pairs it with `kedata-review` (artifact compliance) and routes artifact changes through `kedata-change`. |
| `ponytail-audit` | `kedata-ponytail-audit` | "Kedata context" pairs it with `kedata-audit` (compliance → tracker issues); overlap findings are cited, not repeated. |
| `ponytail-debt` | `kedata-ponytail-debt` | Persisted ledger path set to `docs/PONYTAIL_DEBT.md`; trigger renamed. |
| `ponytail-gain` | `kedata-ponytail-gain` | Scoreboard pointers renamed; benchmark source linked to the vendored commit. |
| `ponytail-help` | `kedata-ponytail-help` | Rewritten for the Kedata command names; dropped upstream's Claude-Code-only band, config-file and plugin-update sections (they configure the upstream plugin, not this adaptation). |

### Licence text

```
MIT License

Copyright (c) 2026 DietrichGebert

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

