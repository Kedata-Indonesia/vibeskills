---
name: kedata-ponytail-debt
description: "Use when scanning and quantifying tech debt so it can be prioritized and paid down. Do NOT use for security audits."
version: 5.3.3
author: Kedata Indonesia (adapted from DietrichGebert / ponytail, MIT)
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - engineering
    - tech-debt
---

# Kedata Ponytail Debt

* User command: `/kedata-ponytail-debt`

Every deliberate ponytail shortcut is marked with a `shortcut:` comment naming
its ceiling and upgrade path (older code may say `ponytail:`). This collects them into one ledger so a deferral
can't quietly become permanent.

## Purpose

Surface and quantify tech debt in a codebase so it can be prioritized and paid down deliberately.

## Prerequisites

Read the target code and the surrounding module before proposing changes. Have the project's test/lint command available for any change; a read-only report needs neither.

## Kedata context

The ledger is a report, not an artifact: it does not feed `/kedata-contracts` or `/kedata-test-plan`. A shortcut whose ceiling the expected load already crosses is a finding for `/kedata-ponytail-audit`, and fixing it may need `/kedata-change` if an approved artifact moves. Persisted ledgers go to `docs/PONYTAIL_DEBT.md` (root only if the team already keeps it there) and are updated in place.

## Scan

Grep the repo for comment markers, skipping `.git` and everything the
`.gitignore` files ignore (dependencies, build output, caches, in any stack):

`git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?(shortcut|ponytail):'`  (add other comment prefixes if your stack uses them)

If the user names their own marker word (`/kedata-ponytail-debt TODO`), grep for that word instead.

Each hit is one ledger row. The comment prefix keeps prose that merely mentions
the convention out of the ledger. Skip hits that are not a deferral, like a note
about a keyboard shortcut.

## Output

One row per marker, grouped by file:

`<file>:<line>, <what was simplified>. ceiling: <the limit named>. upgrade: <the trigger to revisit>.`

The convention is `shortcut: <ceiling>, <upgrade path>`, so pull the ceiling
and the trigger straight from the comment. Want an owner per row too? add
`git blame -L<line>,<line>`.

Flag the rot risk: any marker comment that names no upgrade path or
trigger gets a `no-trigger` tag, those are the ones that silently rot.

End with `<N> markers, <M> with no trigger.` Nothing found: `No shortcut debt. Clean ledger.`

## Boundaries

Reads and reports only, changes nothing. To persist it, ask and it writes the
ledger to `docs/PONYTAIL_DEBT.md`. One-shot.

## Instructions

1. Run the scan described in **Scan**.
2. Use the debt report format in **Output**.
3. Validate inputs and surface failures — do not swallow errors.

## Examples

Example output row: `| Area | Debt | Cost | Suggested fix |` for each area.

## Related Skills

| Need | Skill |
|---|---|
| the principle behind the ledger | `kedata-ponytail` |
| review that surfaces shortcuts | `kedata-ponytail-review` |

## Limitations

- Scoped to tech-debt discovery and reporting.
- Best-effort guidance: it depends on the inputs above and cannot verify runtime behavior.
- Validate inputs and surface failures — do not swallow errors.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Required artifact missing (PRD / plan / contracts) | Upstream stage not run | Run the upstream skill or `kedata-reverse` first |
| Output conflicts with the approved docs | Docs and work drifted | Run `kedata-change`, then re-run this skill |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via its slash command |
