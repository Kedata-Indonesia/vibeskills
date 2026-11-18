---
name: kedata-implementation-plan
description: "Use when turning the PRD and design brief into an IMPLEMENTATION_PLAN.md with tasks and platform. Do NOT code."
version: 1.4.0
author: Kedata Indonesia
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - product
    - planning
---

# Skill: Kedata Implementation Plan Writer

## Purpose
Produce an **IMPLEMENTATION_PLAN.md** — the closing product-team deliverable that hands the approved PRD + design brief (+ external mockups) to whoever builds the product. The PRD defines *what*; the design brief defines *how it looks*; the implementation plan defines **what to build, in what order, where it runs, and how to know it's done**.

The implementation plan is where **scope gets frozen** and **architecture gets decided**: it locks the codebase topology (monolith vs separate FE/BE), the **deployment platform (VM + Docker Compose vs serverless Cloud Run)** and its constraints, repo layout, and supporting architecture decisions — then breaks the PRD features into ordered tasks with per-task acceptance criteria, dependency order, milestone mapping, env vars, and definition of done. After this document is approved, "what's in" and "where it runs" are settled.

The differentiator is **the grilling**: the agent interviews domain by domain — architecture, deployment, tasks, sequencing, contracts, config, rollout — forcing decisions (especially the architecture and deployment decisions) instead of leaving them open, and recording every assumption and open question.

This skill reads the **PRD first** (mandatory) and the **design brief** (optional but recommended) as its inputs: features, API overview, data model, milestones, env vars, personas, screens, and components are extracted from them, not re-interviewed from scratch. Mockups (external designer output) are referenced, not recreated.

## When to Use
* User command: `/kedata-implementation-plan`
* Autonomous trigger: When the user says "draft the implementation plan", "break down the work", "slice the PRD into tasks", or "prepare the handoff to engineering". Run AFTER the PRD is approved and the design brief (and mockups) exist, BEFORE any code is written.

## Prerequisites & Context Gathering
Before the interview starts, the agent MUST:
1. **Read the PRD first (mandatory input).** Check `docs/PRD.md`, then root `PRD.md`. Extract: features with priorities (§8), API overview (§9), data model (§10), milestones (§13), env vars (§12), acceptance criteria (§5), edge cases (§18). If no PRD exists, STOP and tell the user the PRD must be written first — an implementation plan without a PRD is a guess.
2. **Read the design brief (optional but recommended).** Check `docs/DESIGN_BRIEF.md`, then root `DESIGN_BRIEF.md`. Extract: screens (§5), components (§6), deliverables (§11) — these shape FE task details. If it doesn't exist, note it and proceed with PRD only.
3. **Locate existing artifacts:**
   * Existing implementation plan: check `docs/IMPLEMENTATION_PLAN.md`, then root `IMPLEMENTATION_PLAN.md`. If one exists, **update that same file in place** — do not rewrite from scratch and do not move it. A root `IMPLEMENTATION_PLAN.md` the team has been using stays at root; only new plans default to `docs/IMPLEMENTATION_PLAN.md`.
   * Mockups: if the designer delivered mockups (Figma links, HTML, images), reference them — they are the visual contract for FE tasks.
4. **Frame the interview with the user (2 minutes max):**
   * "I'll interview you on architecture, deployment, task breakdown, sequencing, contracts, config, and rollout. Answer briefly; I'll follow up where I need depth. At the end you'll have an implementation plan ready for engineering."
   * Agree on session budget: full grill (45-60 min) vs focused grill (15-20 min, e.g. first milestone only).



> **Interview methodology:** [`references/interview-guide.md`](references/interview-guide.md).
> **Downstream consumers:** [`references/downstream.md`](references/downstream.md).

## Instructions

Keep the interview one domain at a time; work through the steps in order. Detailed starter questions, grill follow-ups, and edge-case probes per step: [`references/interview-questions.md`](references/interview-questions.md).

- **Step 1: Domain 1 — Architecture Decision (Codebase Topology)** — decide how the codebase is organized BEFORE any task is sized. This is the most expensive decision to reverse — lock it now. Bedrock: §1 records the topology decision (monolith vs separate) WITH its rationale and the split-trigger criteria — no "TBD". §2 records the repo/workspace layout (monorepo vs polyrepo, folder structure).
- **Step 2: Domain 2 — Deployment Platform & Operations Decision** — decide WHERE the product runs — VM + Docker Compose vs serverless Cloud Run — and understand the constraints before any task is sized. This decision is as expensive to reverse as codebase topology: it changes the Dockerfile vs docker-compose surface, statelessness rules, background-job handling, cost model, and ops burden. Bedrock: §3 records the platform decision (VM + Docker Compose / Cloud Run / hybrid) WITH its rationale, the constraint implications (statelessness, background jobs, timeouts) and how each is handled, the service/region/domain list, and the CI/CD approach — no "TBD".
- **Step 3: Domain 3 — Supporting Architecture Decisions** — lock the supporting architecture so engineering doesn't improvise it. Bedrock: §4 records every supporting decision with a one-line rationale — including the Backend and Frontend framework rows, which must be confirmed (from PRD §7 or decided here), never blank.
- **Step 3b: Decision Records (ADRs)** — for each load-bearing decision (§1 topology, §3 platform, §4 stack/data store/auth) write `docs/decisions/ADR-####.md` from [`references/adr-template.md`](references/adr-template.md), and link it from the plan section that records the decision. ADRs are **append-only** — never rewrite one; a changed decision gets a new ADR that supersedes the old (`Supersedes: ADR-####`). This is the durable answer to "why did we choose this?" that the plan's one-liners cannot carry.
- **Step 4: Domain 4 — Task Breakdown** — turn every PRD feature into an ordered, owner-assigned task with acceptance criteria. Bedrock: §5 lists every task with owner, effort, priority, milestone, and acceptance criteria — and every PRD feature maps to at least one task (no orphan features).
- **Step 5: Domain 5 — Dependency Order & Milestones** — an executable sequence, not a flat list. Bedrock: §9 orders tasks with no circular dependencies, milestone mapping, and a defined first-milestone DoD; §10 defines per-task and global Definition of Done.
- **Step 6: Domain 6 — API Contract & Data Model Seeds** — the plan carries the exact endpoints and entities that will seed the contract docs. Bedrock: §6 and §7 reproduce the full endpoint and entity lists from the PRD, with first-milestone items flagged.
- **Step 7: Domain 7 — Env Vars & Config** — every env var, per environment, before engineering starts. Bedrock: §8 lists every env var with environment matrix and secrets handling.
- **Step 8: Domain 8 — Risks & Rollout** — what breaks, what's the rollout order, and how do we roll back. Bedrock: §11 lists risks with mitigations, a rollout order, and a rollback plan.
- **Step 9: Draft & Self-Check** — - [ ] All 12 sections filled (or explicitly "N/A" with reason)
- **Step 10: Review & Sign-Off**
- **Hand off:** an approved plan → `kedata-contracts` (then `kedata-test-plan`). Publish the tasks to the tracker with `kedata-track`. ADRs live in `docs/decisions/` and are changed only by appending a superseding ADR via `kedata-change`.


## Constraints & Guardrails

* **Define error handling and validation per task** — every task specifies the happy path, the failure path, and how invalid input is rejected.
* **DO NOT** write code or implement tasks — this skill produces the plan, not the build.
* **DO NOT** leave the architecture decision open — monolith vs separate FE/BE MUST be decided with rationale in §1.
* **DO NOT** leave the deployment platform decision open — VM + Docker Compose vs Cloud Run MUST be decided with rationale in §3, including how the platform's constraints (statelessness, background jobs, timeouts) are handled.
* **DO NOT** rewrite an ADR in place — append a new one that supersedes it (`Supersedes: ADR-####`) and mark the old `Superseded by ADR-####`; the history is the point.
* **DO NOT** invent tasks without a PRD/brief/mockup source — untraceable tasks are scope creep.
* **DO NOT** re-interview product fundamentals that the PRD already answers — extract, don't reinvent.
* **DO NOT** skip the design brief if it exists — FE tasks need its screens/components.
* **DO NOT** leave env vars, endpoints, or entities out — engineering will hit them in the first week.
* **DO NOT** rewrite an existing plan from scratch — update in place and bump the version.
* **DO NOT** renumber the 12 sections — the numbering is a stable contract downstream references depend on.

## Examples
A complete implementation plan reaches this specificity: a locked architecture decision with rationale and split triggers, a locked deployment platform with constraint handling, a task list where every task has owner/effort/priority/AC, an executable dependency order, and full endpoint/entity/env-var lists seeded from the PRD. The skeleton below is the **shape** — replace every `[bracket]` and placeholder description with the concrete, confirmed answers. No `[bracket]` may survive in the delivered plan:

> **Full example skeleton:** [`references/implementation-plan-template.md`](references/implementation-plan-template.md)
>
> **Decision records:** [`references/adr-template.md`](references/adr-template.md) → `docs/decisions/ADR-####.md` (one per §1/§3/§4 decision).

## Limitations

- Scoped to the product-to-engineering plan.
- Best-effort guidance: it depends on the inputs above and cannot verify runtime behavior.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Required artifact missing (PRD / plan / contracts) | Upstream stage not run | Run the upstream skill or `kedata-reverse` first |
| Output conflicts with the approved docs | Docs and work drifted | Run `kedata-change`, then re-run this skill |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via its slash command |
