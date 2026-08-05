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
| `kedata-backend` | engineering | Backend standards: Swagger/OpenAPI, Activity Log, clean architecture, error handling, testing, GCP Cloud Run |
| `kedata-frontend` | engineering | Frontend standards: React + TanStack Start / Vue + Nuxt 3, React→Vue conversion, state, forms, API integration, security |
| `kedata-review` | engineering | Code review checklist: mandatory + recommended checks, security, testing, docs, review comment templates |
| `kedata-prd` | product | Draft a Product Requirements Document in Kedata's house format (11 sections, before any code) |
| `kedata-pr` | product | Write a pull request description in Kedata's standard template (Summary / Changes / Type / Mandatory checks) |

## Suggested Session Flow

For a new feature, run skills in order:

1. `/kedata-system` — load baseline rules at session start
2. `/kedata-prd` — draft the PRD before coding
3. `/kedata-backend` or `/kedata-frontend` — implement per stack standards
4. `/kedata-review` — review the PR before merging
5. `/kedata-pr` — open the PR with the house template

## Skill Format

The `npx skills` CLI discovers skills by scanning the repo tree for
`SKILL.md` files. The canonical layout is:

```
skills/
└── <category>/
    └── <skill-name>/
        ├── SKILL.md              # REQUIRED — the skill itself
        └── agents/
            └── openai.yaml       # optional — display metadata
```

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
