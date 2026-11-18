---
name: kedata-ponytail-help
description: "Use when explaining the ponytail principle and routing to the right ponytail skill. Do NOT run the other skills."
version: 5.3.3
author: Kedata Indonesia (adapted from DietrichGebert / ponytail, MIT)
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - engineering
    - reference
---

# Kedata Ponytail Help

* User command: `/kedata-ponytail-help`

Display this reference card when invoked. One-shot, do NOT change mode,
write flag files, or persist anything.

## Purpose

Explain the ponytail principle and point to the right ponytail skill for the task at hand.

## Levels

| Level | Trigger | What changes |
|-------|---------|--------------|
| **Lite** | `/kedata-ponytail lite` | Build what was asked, name the smaller option in one line. |
| **Full** | `/kedata-ponytail` | The smallest complete change, a check where the logic needs one, and a reply that names what was skipped and any risk. Default. |
| **Ultra** | `/kedata-ponytail ultra` | Also questions the request and pushes back before building. |

Level sticks until changed or session end.

## Skills

| Skill | Trigger | What it does |
|-------|---------|--------------|
| **kedata-ponytail** | `/kedata-ponytail` | Lazy mode itself: least new code, clear replies that name skipped work and risks. |
| **kedata-ponytail-review** | `/kedata-ponytail-review` | Lean review of a diff: bugs, security, load, missing tests, speed, what to cut. Pairs with `/kedata-review` (artifact compliance). |
| **kedata-ponytail-audit** | `/kedata-ponytail-audit` | The same lean review for the whole repo, ranked. Pairs with `/kedata-audit` (compliance → tracker issues). |
| **kedata-ponytail-debt** | `/kedata-ponytail-debt` | Harvest `shortcut:` comments into a tracked ledger. |
| **kedata-ponytail-gain** | `/kedata-ponytail-gain` | Measured-impact scoreboard: less code, less cost, more speed. |
| **kedata-ponytail-help** | `/kedata-ponytail-help` | This card. |

## What ponytail never cuts

Validation at trust boundaries, error handling that prevents data loss, security, accessibility, and anything an approved Kedata artifact requires (acceptance criteria, contract shapes, Swagger, activity logging). Shrinking those goes through `/kedata-change`.

## Deactivate

Say "stop ponytail" or "normal mode". Resume anytime with `/kedata-ponytail`.
`/kedata-ponytail off` also works.

## More

Upstream docs + examples: https://github.com/DietrichGebert/ponytail
Source, version and licence for this adaptation: `THIRD_PARTY_NOTICES.md`.

## Prerequisites

Read the target code and the surrounding module before proposing changes. Have the project's test/lint command available for any change; a read-only report needs neither.

## Instructions

1. Match the user's request to the right ponytail skill (audit, debt, gain, review).
2. Use the table in this skill to explain when to run each one.

## Examples

Example: “I want to know what to delete” → run `kedata-ponytail-audit`.

## Related Skills

| Need | Skill |
|---|---|
| the principle it explains | `kedata-ponytail` |
| the scoreboard | `kedata-ponytail-gain` |

## Limitations

- Scoped to explaining and routing the ponytail skills.
- Best-effort guidance: it depends on the inputs above and cannot verify runtime behavior.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Required artifact missing (PRD / plan / contracts) | Upstream stage not run | Run the upstream skill or `kedata-reverse` first |
| Output conflicts with the approved docs | Docs and work drifted | Run `kedata-change`, then re-run this skill |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via its slash command |
