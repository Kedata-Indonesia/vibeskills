---
name: kedata-changelog
description: "Use when writing or updating CHANGELOG.md from merged PRs, commits, and issues. Do NOT fabricate unreleased or unmerged entries."
version: 1.0.0
author: Kedata Indonesia
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - engineering
    - release
---

# Skill: Kedata Changelog — Releases, Auto-Documented

## Purpose
Keep `CHANGELOG.md` true without anyone hand-writing it. This skill derives entries from what actually merged — PRs/MRs, commits, closed issues, and change requests — groups them under an **Unreleased** section or a released version, and cuts a version at release time. The changelog is a *record of shipped change* for the reader; it is not a commit log and not a marketing page.

## When to Use
* User command: `/kedata-changelog`
* Autonomous trigger: when the user asks for release notes, a changelog, or "what changed since the last release", or asks to cut a version; after a PR merges, add the `Unreleased` entry only on the user's request.
* Run it after merges (`kedata-repo`) and at release; `kedata-change` feeds it the change requests it must note.

## Prerequisites & Context Gathering
Before writing, the agent MUST:
1. **Find the anchor** — the last released version (highest `## [x.y.z]` in `CHANGELOG.md`) or the last `v*` git tag. Everything after it is in scope.
2. **Read the merge record** — `gh pr list --state merged --base <base>` / `glab mr list --state merged`, `git log <tag>..HEAD --merges`, closed issues, and any `docs/CHANGE_REQUEST.md` / `docs/CHANGES.md`.
3. **Classify each entry by user impact** — Added / Changed / Fixed / Deprecated / Removed / Security (Keep a Changelog set), not by commit type.
4. **Confirm the version and date** before cutting a release; an **Unreleased** entry needs no confirmation.

## Instructions

### Step 1: Collect the change set
* List merged PRs/MRs, commits, and closed issues since the anchor. For each: the user-visible effect, the PR/issue number, and the author if the repo credits authors.

### Step 2: Write entries in the reader's language
* One line per user-visible change, imperative, from the reader's point of view ("Add SSO login", not "refactor auth module").
* Skip internal churn (refactors, tests, chores) unless it changes behavior.
* Breaking changes and migrations go **first** in the release, with the exact action the reader must take.
* Link the source (`#123`, `@author`) so a skeptic can verify.

### Step 3: Place them
* Under `## [Unreleased]` when no version is cut; under `## [x.y.z] — YYYY-MM-DD` when releasing.
* Follow [Keep a Changelog](https://keepachangelog.com/): newest release on top; **never rewrite a shipped release's notes** — a correction is a new entry.

### Step 4: Publish and hand off
* Write/update `CHANGELOG.md` (default `docs/CHANGELOG.md` or root; update in place, never fork).
* For client-facing release prose, hand the raw entries to `kedata-writing` (release-notes playbook); the changelog itself stays factual.
* Announce/tag via `kedata-repo` / `kedata-deploy` per the repo convention.

## Constraints & Guardrails
* **DO NOT** fabricate entries — every line traces to a merged PR, commit, or closed issue.
* **DO NOT** rewrite a released section; append a correction instead.
* **DO NOT** log internal churn the reader cannot observe.
* **DO NOT** invent a version number or date — confirm before cutting a release.
* **DO NOT** turn the changelog into marketing; keep it factual and scannable.
* Keep to the Keep a Changelog categories; do not invent new ones.

## Related Skills
| Need | Skill |
|---|---|
| The merge trail that is the source of entries | `kedata-repo` |
| Release prose a client reads | `kedata-writing` |
| Change requests to record | `kedata-change` |
| Issues the release closes | `kedata-track` |
| The release/deploy | `kedata-deploy` |
| Fixes filed from findings | `kedata-audit` |

## Examples
`CHANGELOG.md`:
```
## [Unreleased]
### Added
- SSO login for workspace members (#142)
### Fixed
- Password-reset link no longer expires before the email arrives (#151)

## [1.2.0] — 2026-11-18
### Changed
- **Breaking:** `/api/v1/orders` returns `409` on duplicates (was `400`); clients must handle `409`. (#138)
### Security
- Rotate session tokens on password change (#144)
```
Every line cites a merged PR; internal refactors are absent.

## Limitations
- Records shipped change only; it does not choose the version scheme or package the release.
- Best-effort guidance: it depends on the repo's merge/issue history and cannot verify runtime behavior.
- Without `gh`/`glab` it falls back to `git log`; PR/issue numbers may be unavailable.

## Troubleshooting
| Symptom | Cause | Fix |
|---|---|---|
| No anchor found | No tag and no released section | Start with `## [Unreleased]`; set the baseline at the first release |
| Entries read like a commit list | Classified by commit type | Reclassify by user impact (Added/Changed/Fixed/…) |
| Duplicate entries on re-run | Same PR counted twice | Key each entry by PR/issue number and dedupe |
| `gh`/`glab` not authenticated | CLI not logged in | `gh auth login` / `glab auth login`, or use `git log` |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via `/kedata-changelog` |
