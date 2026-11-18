---
name: kedata-track
description: "Use when publishing IMPLEMENTATION_PLAN.md tasks as GitHub/GitLab issues with blocking edges. Do NOT keep a markdown tracker."
version: 1.0.0
author: Kedata Indonesia
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - engineering
    - project-management
---

# Skill: Kedata Track — Plan to Issue Tracker

## Purpose
The implementation plan is the **source of truth for tasks**; the issue tracker is the **source of truth for state**. This skill publishes `IMPLEMENTATION_PLAN.md` §5/§9 tasks as GitHub/GitLab issues — one issue per task, a milestone per stage, area/type labels, ACs in the body, dependency edges, and the DoD — so status lives in the tracker and never drifts in a markdown file. Re-runs reconcile in place; they never duplicate.

## When to Use
* User command: `/kedata-track`
* Autonomous trigger: when the user asks to "create the tickets", "set up the board", "make issues from the plan", or to sync plan changes to GitHub/GitLab.
* Run it after `kedata-implementation-plan` is approved, and re-run it after `kedata-change` updates the plan.

## Prerequisites & Context Gathering
Before publishing, the agent MUST:
1. **Read the plan** — `docs/IMPLEMENTATION_PLAN.md`: §5 tasks (ID, owner, effort, priority, milestone, ACs), §9 dependency order/milestones, §4 stack, §10 DoD.
2. **Read the artifacts the tasks reference** — `PRD.md` (feature context), `API_CONTRACTS.md` / `DATA_CATALOG.md` (per-task scope) — so each issue carries real context, not invented detail.
3. **Detect the platform** — GitHub via `gh`, GitLab via `glab`, or none (print the issue set for manual paste).
4. **Check the existing tracker** — search by the stable marker/label `kedata:<task-id>` before creating anything.
5. **Confirm scope with the user** — issue creation is an external side effect: show the create/update/skip table and get an explicit yes before writing.

## Instructions

### Step 1: Extract tasks
* Build a table: task ID, title, milestone/stage, owner, effort, priority, ACs, dependencies, artifacts touched.
* Flag every task with no ACs or no PRD trace — do not invent them.

### Step 2: Map to the tracker
* **One issue per task.** Body: the task's ACs as checkboxes, links to the artifacts it touches, `Blocked by #n` / `Blocks #n`, and the DoD.
* **Milestones** = plan §9 milestones (or one per stage). **Labels** = area + type + priority (`area:backend`, `type:feature`, `P1`).
* Embed a stable marker as the first line of the body: `<!-- kedata-track: <task-id> -->`, plus a `kedata:<task-id>` label, so re-runs match.

### Step 3: Publish (idempotent)
* **GitHub:** `gh issue create --title ... --body-file ... --milestone ... --label ...`; update with `gh issue edit`; express dependencies as body links (native sub-issues only when the repo supports them).
* **GitLab:** `glab issue create ...`, `glab issue update ...`, milestones via `glab milestone`.
* **None:** output the full issue set (id, title, body, labels, milestone) for manual paste.
* Match by the stable marker first; update in place, never create a duplicate.

### Step 4: Report and hand off
* Summarize created / updated / skipped, and every task flagged for missing ACs.
* Work proceeds against issues; PRs close them via `kedata-repo` (`Closes #n`).
* After a scope change, `kedata-change` updates the plan, then re-run this skill to reconcile.

## Constraints & Guardrails
* **DO NOT** create or maintain a markdown tracker — the plan holds content, the issue tracker holds state.
* **DO NOT** invent tasks, ACs, owners, or dates not in the plan.
* **DO NOT** create, close, or reassign issues without explicit user confirmation.
* **DO NOT** duplicate on re-run — match by the stable marker/label.
* **DO NOT** edit the plan — route scope changes to `kedata-change` first.
* **DO NOT** close issues by hand where a PR already links them; let `Closes #n` do it.
* Keep the task ID stable across re-runs so the marker keeps matching.

## Related Skills
| Need | Skill |
|---|---|
| The plan this skill publishes | `kedata-implementation-plan` |
| PRs/MRs that close issues (`Closes #n`) | `kedata-repo` |
| Scope change → plan update → re-sync | `kedata-change` |
| Repo-wide findings → issues | `kedata-audit` |
| Baseline context | `kedata-system` |

## Examples
A plan task:
```
T3 · Auth: login endpoint · M1 · P1
AC: POST /api/v1/auth/login returns 200 + tokens; 401 on bad creds; 422 on invalid body.
Depends on: T1 (user model)
```
becomes:
```bash
gh issue create \
  --title "T3 · Auth: login endpoint" \
  --body-file /tmp/T3.md \
  --milestone "M1" \
  --label "area:backend,type:feature,P1"
```
where `T3.md` is:
```
<!-- kedata-track: T3 -->
## Acceptance criteria
- [ ] POST /api/v1/auth/login → 200 + access/refresh tokens
- [ ] 401 on invalid credentials
- [ ] 422 on invalid body
Blocked by: #12 (T1)
Contracts: docs/API_CONTRACTS.md §1.1
```
A second run matches `<!-- kedata-track: T3 -->`, updates the body, and creates nothing.

## Limitations
- Publishes to the platform's issue tracker only; it does not schedule sprints or estimate beyond the plan.
- Best-effort guidance: it depends on the plan above and cannot verify runtime behavior.
- It assumes `gh`/`glab` auth is present; a git-only repo yields the issue set for manual paste.

## Troubleshooting
| Symptom | Cause | Fix |
|---|---|---|
| Required artifact missing (plan) | Upstream stage not run | Run `kedata-implementation-plan` or `kedata-reverse` first |
| Duplicate issues on re-run | Marker/label not set | Match on `<!-- kedata-track: <task-id> -->`; edit instead of create |
| `gh`/`glab` not authenticated | CLI not logged in | `gh auth login` / `glab auth login`, then retry |
| Plan changed under the board | Scope changed | Run `kedata-change`, then re-run this skill |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via `/kedata-track` |
