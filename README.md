# vibeskills

A collection of modular, markdown-based agent skills encoding Kedata Indonesia's
engineering discipline — readable for every AI coding assistant (Claude, Cursor,
Kimi, Hermes, etc.) via the [`skills`](https://www.npmjs.com/package/skills)
ecosystem.

## Install

```bash
# from GitHub
npx skills@latest add Kedata-Indonesia/vibeskills

# or locally, for testing before you push
npx skills@latest add /path/to/vibeskills
```

## Available Skills

| Skill | Category | Description |
| ----- | -------- | ----------- |
| `kedata-brainstorm` | product | Raw idea → validated idea: business grill on problem, market, competition, value prop, business model, feasibility, GTM, kill criteria. Optional, before `kedata-prd` |
| `kedata-system` | engineering | Baseline AI development rules: read docs first, plan → confirm → code → test → verify, house conventions, deployment awareness |
| `kedata-ask` | engineering | Where is this codebase? Inspects artifacts, maps the pipeline stage, and tells you the next step + which skill to run |
| `kedata-contracts` | product | Draft API_CONTRACTS.md + DATA_CATALOG.md + ENVIRONMENT_VARIABLES.md from the approved plan — contract-first for split FE/BE |
| `kedata-test-plan` | engineering | Turn PRD acceptance criteria + edge cases + contracts into a traceable TEST_PLAN.md (cases, fixtures, environments, exit criteria) |
| `kedata-qa-automation` | engineering | Automate the test plan: contract-valid fixtures from the catalog, Playwright E2E for its scenarios, ego-browser for logged-in dogfooding and bug investigation |
| `kedata-deploy` | engineering | Turn the plan's platform decision (§3) into real deploy artifacts + DEPLOYMENT.md — Dockerfile, compose/Cloud Run, CI/CD, secrets, migrations, rollout/rollback |
| `kedata-change` | engineering | Change control: classify a scope/spec change and cascade the edits through PRD → brief → plan → contracts → test plan with version bumps |
| `kedata-reverse` | engineering | Brownfield onboarding: reverse-engineer PRD, contracts, and a baseline plan from existing code so the pipeline can run |
| `kedata-audit` | engineering | Repo-wide codebase audit → prioritized, deduplicated GitHub/GitLab issues (bugs, security, tech debt, test gaps) + AUDIT_REPORT.md |
| `kedata-review` | engineering | Code review checklist: mandatory + recommended checks, security, testing, docs, review comment templates |
| `kedata-ponytail` | engineering | Lazy senior dev mode: the smallest complete change, levels lite/full/ultra. Cross-cutting discipline, active for the session. Adapted from ponytail |
| `kedata-ponytail-review` | engineering | Lean review of one diff: correctness, safety, load, missing tests, speed, and lines that earn their place. Pairs with `kedata-review` |
| `kedata-ponytail-audit` | engineering | Lean repo audit: bugs, risk, load, and what to delete, merge or split. Report only. Pairs with `kedata-audit` |
| `kedata-ponytail-debt` | engineering | Harvest `shortcut:` comments into a debt ledger with ceilings and upgrade triggers |
| `kedata-ponytail-gain` | engineering | Ponytail's measured benchmark scoreboard (code, cost, speed). Never a per-repo savings claim |
| `kedata-ponytail-help` | engineering | Reference card for the ponytail levels, the six skills, and what lean mode never cuts |
| `kedata-backend-go` | backend | Backend standards for Go + Gin: swaggo Swagger, activity log, clean architecture, httperr errors, testing |
| `kedata-backend-python` | backend | Backend standards for Python + FastAPI: auto docs, activity log, pydantic, pytest |
| `kedata-backend-node` | backend | Backend standards for Node + Express: swagger-jsdoc, activity log, zod, Jest/Vitest |
| `kedata-backend-rust` | backend | Backend standards for Rust (Axum optional): utoipa docs, activity log, thiserror, cargo test |
| `kedata-frontend-react` | frontend | Frontend standards for React 19 + TanStack Start: Router/Query, Zustand, react-hook-form + zod, Vitest |
| `kedata-frontend-nuxt` | frontend | Frontend standards for Vue 3 + Nuxt 3: pages/, Pinia, vee-validate + zod, $fetch composables |
| `kedata-prd` | product | Interview-driven PRD: 9 grilling domains + edge-case sweep, 18-section house template, sign-off gate |
| `kedata-design-brief` | product | Interview-driven DESIGN_BRIEF.md: brand identity, design tokens, screens, components, states — the input for mockup design |
| `kedata-design-frontend` | design | Anti-slop art direction for pages and app screens: reads DESIGN_BRIEF.md, deals one of 20 researched directions from a bundled library, enforces the house rules with a real-browser inspector, then looks at its own screenshots and fixes. Adapted from tasteskill v2 |
| `kedata-implementation-plan` | product | Product→engineering handoff: locks architecture (monolith vs split), task breakdown with ACs, dependency order, definition of done |
| `kedata-repo` | engineering | GitHub/GitLab communication: draft + open PR/MR in the house template, link issues, gather repo context via gh/glab + helper script |

## Companion Skills

Some Kedata skills pair with craft depth they do not carry themselves. The approved Kedata
artifact is always the contract: a companion supplies craft, never requirements.

**Vendored — `kedata-design-frontend`** is an adaptation of
[taste-skill](https://www.tasteskill.dev/) v2 (`design-taste-frontend`, MIT), held in
`skills/design/kedata-design-frontend/` so the whole collection installs in one command. It pairs
with `kedata-design-brief` (which writes the contract) and `kedata-frontend-*` (which implements
it). Upstream source, version, licence and the list of changes made here are recorded in
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md). It needs Node 22+ and an installed
Chrome/Edge/Chromium for the `inspect.mjs` gate. To follow upstream instead, install it directly
and disable the vendored copy:

```bash
npx skills add Leonxlnx/taste-skill
```

**Referenced — `kedata-backend-rust` → [rust-expert-best-practices-code-review](https://github.com/wispbit-ai/skills)** —
idiomatic-Rust rules (type safety, error handling, API design, quality, performance) for writing,
refactoring, and reviewing Rust. It is not vendored, so it stays current with upstream; the
approved plan/contracts stay the source of truth.

```bash
npx skills add https://github.com/wispbit-ai/skills --skill rust-expert-best-practices-code-review
```

**Referenced — ego-browser (ego-lite) → [citrolabs/ego-lite](https://github.com/citrolabs/ego-lite)** —
the browser `kedata-qa-automation` drives for logged-in dogfooding and bug investigation. It is a
bootstrap skill that prints the guide for the installed ego lite app at runtime, so vendoring it
would freeze a stale copy. Referenced, not vendored.

```bash
npx skills add citrolabs/ego-lite
```

**Vendored — the `kedata-ponytail*` family** is an adaptation of
[ponytail](https://github.com/DietrichGebert/ponytail) v5.3.3 (MIT), six markdown-only skills in
`skills/engineering/`. `kedata-ponytail` is a cross-cutting discipline (smallest complete change,
levels lite/full/ultra) that runs alongside any stage; `kedata-ponytail-review` and
`kedata-ponytail-audit` are the lean lens that pairs with `kedata-review` and `kedata-audit`.
Lean never overrides an approved artifact — shrinking one goes through `kedata-change`.
Source, version, licence and the per-skill changes are in
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

## Suggested Session Flow

For a new feature, run skills in order:

0. **Don't know where the codebase is?** Start with `/kedata-ask` — it inspects the artifacts and tells you the current stage + next step + which skill to run.
0.2 *(brownfield only)* `/kedata-reverse` — inherited a codebase with no docs? Reverse-engineer the PRD, contracts, and a baseline plan from the code so the pipeline can run. Skip if artifacts already exist.
0.5 *(optional)* `/kedata-brainstorm` — have a raw idea? Grill it from a business perspective (problem, market, competition, economics, feasibility, GTM) → `docs/IDEA_BRIEF.md`. **Skip it if you're already convinced the idea is sound** and go straight to the PRD.
1. `/kedata-prd` — draft the PRD before coding (bring `docs/IDEA_BRIEF.md` as context if you brainstormed)
2. `/kedata-design-brief` — draft the DESIGN_BRIEF.md (feeds mockup design via LLM)
3. *(optional)* `/kedata-design-frontend` — build the visuals with the anti-slop art direction: it reads DESIGN_BRIEF.md as the contract, deals a researched direction, builds, gates the result in a real browser, then fixes what it sees. Use it instead of — or to review — external designer mockups.
3b. *(alternative)* designer creates mockups — external
4. `/kedata-implementation-plan` — lock architecture + deployment platform + break the work into tasks
5. `/kedata-contracts` — draft API_CONTRACTS.md + DATA_CATALOG.md + ENVIRONMENT_VARIABLES.md (contract-first when FE/BE split)
5.5 `/kedata-test-plan` — turn PRD acceptance criteria + edge cases into a traceable TEST_PLAN.md
5.6 `/kedata-qa-automation` — make the plan executable: contract-valid fixtures, Playwright E2E for the scenarios, ego-browser for logged-in dogfooding and bug investigation
6. `/kedata-backend-go` · `/kedata-backend-python` · `/kedata-backend-node` · `/kedata-backend-rust` — implement per the chosen backend stack (plan §4)
7. `/kedata-frontend-react` or `/kedata-frontend-nuxt` — implement per the chosen frontend stack (plan §4)
8. `/kedata-deploy` — turn plan §3 into Dockerfile/compose/CI + a DEPLOYMENT.md runbook (rollout + rollback)
9. `/kedata-review` — review the PR before merging
10. `/kedata-repo` — open the PR/MR with the house template (GitHub `gh` / GitLab `glab`)

**Anytime:** `/kedata-change` — when requirements move, cascade the change through the artifacts (PRD → brief → plan → contracts → test plan) before work resumes.
**Anytime:** `/kedata-audit` — proactively scan the whole repo and file prioritized, deduplicated issues to the tracker (bugs, security, tech debt, test gaps).
**Anytime:** `/kedata-ponytail` — lean mode for the session (lite/full/ultra). `/kedata-ponytail-review` and `/kedata-ponytail-audit` are the lean lens beside `kedata-review` and `kedata-audit`; `/kedata-ponytail-debt` lists deferred shortcuts. Lean never overrides an approved artifact.

## Skill Format

The `npx skills` CLI discovers skills by scanning the repo tree for
`SKILL.md` files. The canonical layout is:

```
skills/
├── backend/                # language-specific backend skills
│   └── kedata-backend-go/
│       ├── SKILL.md              # REQUIRED — the skill itself
│       └── agents/
│           └── openai.yaml       # optional — display metadata
├── frontend/               # language-specific frontend skills
├── design/                 # visual craft skills (design-frontend: art direction + gate)
├── engineering/            # cross-cutting engineering skills (system, review, repo)
└── product/                # artifact-producing skills (prd, design-brief, implementation-plan, contracts)
```

**Category depth rule:** the CLI supports exactly two levels under `skills/` — `skills/<category>/<skill-name>/SKILL.md`. Do NOT nest deeper (e.g. `skills/engineering/backend/…`): skills at a shallower level make the scanner stop descending, and deeper skills are silently skipped during discovery.

**Frontmatter requirements** (enforced by the CLI — a skill missing these is
skipped, and a repo with zero valid skills fails to install):

```yaml
---
name: my-skill              # required, string
description: Use when ...   # required, string
version: 1.0.0              # optional
author: You                 # optional
---
```

## Adding a New Skill

1. Create `skills/<category>/<skill-name>/SKILL.md`.
2. Fill in `name` and `description` in the frontmatter — these are **required**.
3. Test locally:
   ```bash
   npx skills@latest add /path/to/vibeskills
   ```
4. Commit and push — the GitHub install works with zero extra config.

## Development

```bash
git add . && git commit -m "Adapt Kedata skills to registry format"
git push -u origin main
```
