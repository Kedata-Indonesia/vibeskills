---
name: kedata-ponytail-gain
description: "Use when reporting the gain of a simplification: what was removed and the code/token delta. Do NOT guess — measure."
version: 5.3.3
author: Kedata Indonesia (adapted from DietrichGebert / ponytail, MIT)
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - engineering
    - metrics
---

# Kedata Ponytail Gain

* User command: `/kedata-ponytail-gain`

Display this scoreboard when invoked. One-shot: do NOT change mode, write flag
files, or persist anything.

The figures are the published agentic benchmark of Ponytail 5: headless Claude
Code (Opus 5.5, default effort) on 39 tasks (feature tickets in a real FastAPI +
React repo, bug fixes, security and privacy cases, small apps), 5 runs each,
against the same agent without the skill. 18 of the tasks have hidden checks
for correctness and safety. Each figure is the geometric mean of the per-task
medians. They are measured, not computed from the current repo.
Source: [benchmarks/results/2026-10-07-agentic.md](https://github.com/DietrichGebert/ponytail/blob/7801d06/benchmarks/results/2026-10-07-agentic.md) and the [README](https://github.com/DietrichGebert/ponytail).

## Purpose

Report the gain from simplifying: what was removed, the code/token delta, and the maintenance saved.

## Scoreboard

Render plain ASCII bars. The bar length shows ponytail as a share of the
no-skill baseline; the label carries the exact figure:

```
  ponytail gain           benchmark · 39 tasks × 5 runs · Opus 5.5

  no-skill        ████████████████████  100%
  Lines of code   █████████···········   47%   ▼ 53%
  Output tokens   ███████████·········   55%   ▼ 45%
  Cost            ███████████████·····   74%   ▼ 26%
  Time            ████████████········   59%   ▼ 41%
  Hidden checks passed   97%  (no-skill 96%)
  Tests where the logic needs one   98%  (no-skill 68%)

  This repo:  /kedata-ponytail-debt  (shortcuts you deferred)
              /kedata-ponytail-audit (what's still cuttable)
```

## Honesty boundary

These are benchmark averages, not this repo. NEVER print a per-repo savings
number ("you saved X lines/tokens here"): the unbuilt version was never
written, so there is no real baseline to subtract from in a live repo. The
only real per-repo figures come from `/kedata-ponytail-debt` (a counted ledger), and
this card points there instead of inventing one.

## Boundaries

One-shot display. Edits nothing, changes no mode.

## Prerequisites

Read the target code and the surrounding module before proposing changes. Have the project's test/lint command available for any change; a read-only report needs neither.

## Instructions

1. Measure the target before and after the simplification.
2. Validate inputs and surface failures — do not swallow errors.
3. Run the delta report in the format this skill defines.

## Examples

Example: “removed 3 wrappers, −180 LOC, −2 dependencies; no behavior change.”

## Related Skills

| Need | Skill |
|---|---|
| the principle it measures | `kedata-ponytail` |
| the reference card | `kedata-ponytail-help` |

## Limitations

- Scoped to reporting the gain of a simplification.
- Best-effort guidance: it depends on the inputs above and cannot verify runtime behavior.
- Validate inputs and surface failures — do not swallow errors.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Required artifact missing (PRD / plan / contracts) | Upstream stage not run | Run the upstream skill or `kedata-reverse` first |
| Output conflicts with the approved docs | Docs and work drifted | Run `kedata-change`, then re-run this skill |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via its slash command |
