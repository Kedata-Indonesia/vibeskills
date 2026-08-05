# kedata-skills

A collection of modular, markdown-based agent skills encoding Kedata Indonesia's
engineering discipline — readable for every AI coding assistant (Claude, Cursor,
Kimi, Hermes, etc.) via the [`skills`](https://www.npmjs.com/package/skills)
ecosystem (mattpocock/skills).

## Install

```bash
# from GitHub
npx skills@latest add canggihpw/kedata-skills

# or locally, for testing before you push
npx skills@latest add /path/to/kedata-skills
```

## Available Skills

| Skill | Category | Description |
| ----- | -------- | ----------- |
| `kedata-system` | engineering | Baseline AI development rules: read docs first, plan → confirm → code → test → verify, house conventions, deployment awareness |
| `kedata-ask` | engineering | Where is this codebase? Inspects artifacts, maps the pipeline stage, and tells you the next step + which skill to run |
| `kedata-contracts` | product | Draft API_CONTRACTS.md + DATA_CATALOG.md + ENVIRONMENT_VARIABLES.md from the approved plan — contract-first for split FE/BE |
| `kedata-review` | engineering | Code review checklist: mandatory + recommended checks, security, testing, docs, review comment templates |
| `kedata-backend-go` | backend | Backend standards for Go + Gin: swaggo Swagger, activity log, clean architecture, httperr errors, testing |
| `kedata-backend-python` | backend | Backend standards for Python + FastAPI: auto docs, activity log, pydantic, pytest |
| `kedata-backend-node` | backend | Backend standards for Node + Express: swagger-jsdoc, activity log, zod, Jest/Vitest |
| `kedata-backend-rust` | backend | Backend standards for Rust (Axum optional): utoipa docs, activity log, thiserror, cargo test |
| `kedata-frontend-react` | frontend | Frontend standards for React 19 + TanStack Start: Router/Query, Zustand, react-hook-form + zod, Vitest |
| `kedata-frontend-nuxt` | frontend | Frontend standards for Vue 3 + Nuxt 3: pages/, Pinia, vee-validate + zod, $fetch composables |
| `kedata-prd` | product | Interview-driven PRD: 9 grilling domains + edge-case sweep, 18-section house template, sign-off gate |
| `kedata-design-brief` | product | Interview-driven DESIGN_BRIEF.md: brand identity, design tokens, screens, components, states — the input for mockup design |
| `kedata-implementation-plan` | product | Product→engineering handoff: locks architecture (monolith vs split), task breakdown with ACs, dependency order, definition of done |
| `kedata-repo` | engineering | GitHub/GitLab communication: draft + open PR/MR in the house template, link issues, gather repo context via gh/glab + helper script |

## Suggested Session Flow

For a new feature, run skills in order:

0. **Don't know where the codebase is?** Start with `/kedata-ask` — it inspects the artifacts and tells you the current stage + next step + which skill to run.
1. `/kedata-prd` — draft the PRD before coding
2. `/kedata-design-brief` — draft the DESIGN_BRIEF.md (feeds mockup design via LLM)
3. *(designer creates mockups — external)*
4. `/kedata-implementation-plan` — lock architecture + break the work into tasks
5. `/kedata-contracts` — draft API_CONTRACTS.md + DATA_CATALOG.md + ENVIRONMENT_VARIABLES.md (contract-first when FE/BE split)
6. `/kedata-backend-go` · `/kedata-backend-python` · `/kedata-backend-node` · `/kedata-backend-rust` — implement per the chosen backend stack (plan §4)
7. `/kedata-frontend-react` or `/kedata-frontend-nuxt` — implement per the chosen frontend stack (plan §4)
8. `/kedata-review` — review the PR before merging
9. `/kedata-repo` — open the PR/MR with the house template (GitHub `gh` / GitLab `glab`)

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
   npx skills@latest add /path/to/kedata-skills
   ```
4. Commit and push — the GitHub install works with zero extra config.

## Development

```bash
git add . && git commit -m "Adapt Kedata skills to registry format"
git push -u origin main
```
