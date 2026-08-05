# my-skills

A collection of modular, markdown-based agent skills compatible with the
[`skills`](https://www.npmjs.com/package/skills) ecosystem (mattpocock/skills).

## Install

```bash
# from GitHub (after you push this repo)
npx skills@latest add <your-github-username>/my-skills

# or locally, for testing before you push
npx skills@latest add /path/to/my-skills
```

## Available Skills

| Skill | Category | Description |
| ----- | -------- | ----------- |
| `example-skill` | engineering | STUB — replace with your skill's one-liner |

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

1. Create `skills/<category>/<skill-name>/SKILL.md` (copy the stub's structure).
2. Fill in `name` and `description` in the frontmatter — these are **required**.
3. Test locally:
   ```bash
   npx skills@latest add /path/to/my-skills
   ```
4. Commit and push — the GitHub install works with zero extra config.

## Development

```bash
git init && git add . && git commit -m "Initial skill stub"
# create a GitHub repo named `my-skills`, then:
git remote add origin git@github.com:<your-github-username>/my-skills.git
git push -u origin main
```
