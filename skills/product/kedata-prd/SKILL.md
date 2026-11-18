---
name: kedata-prd
description: "Use when drafting a PRD through a deep interview: requirements, edge cases, and sign-off. Do NOT start coding first."
version: 1.6.0
author: Kedata Indonesia
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - product
    - requirements
---

# Skill: Kedata PRD Writer

## Purpose
Produce a Product Requirements Document in Kedata's house format through a **structured deep interview**. The PRD is the **first and primary source of truth** for the entire delivery pipeline: implementation planning, backend and frontend engineering, code review, and pull request descriptions. A weak PRD propagates weakness everywhere.

This skill stands alone — it does not depend on any other skill being installed. All house conventions it relies on are embedded below (tech stack defaults, response envelope, API base path, file conventions), so a fresh install works end-to-end.

The differentiator of this skill is **the grilling**: the agent does not fill a template from what the user volunteers. It interviews domain by domain, asks follow-ups until answers are specific and decision-ready, surfaces assumptions, forces priorities, systematically breaks the product with **edge-case probing**, and records every open question. The template below is the *output*; the interview is the *method*.

## When to Use
* User command: `/kedata-prd`
* Autonomous trigger: When starting a new product or feature without a PRD on file; when the user says "draft a PRD", "write a product spec", or asks to define requirements before implementation. Run BEFORE writing code, before designing API contracts, and before the implementation plan.

## Prerequisites & Context Gathering
Before the interview starts, the agent MUST:
1. **Assume PRD-first.** The PRD is the FIRST artifact of the delivery pipeline. The repo contains either an existing PRD or nothing at all. Downstream docs (`docs/API_CONTRACTS.md`, `docs/DATA_CATALOG.md`, `ENVIRONMENT_VARIABLES.md`) are outputs of later steps — do NOT expect them, do NOT wait for them, do NOT block the interview on them. The PRD defines the conventions that those docs will later be generated from.
2. **Locate existing artifacts:**
   * Existing PRD: check `docs/PRD.md` first, then root `PRD.md`. If one exists, **update that same file in place** — do not rewrite from scratch and do not move it. A root `PRD.md` the team has been using stays at root; only new PRDs default to `docs/PRD.md`. If no PRD exists, this is a greenfield draft — the interview below is the source of everything.
   * Issue / task description: read the full issue, note its key/number (e.g. `KEP-123`), and copy any existing acceptance criteria. If no issue exists, the interview extracts the requirements directly from the user.
   * Optional hints only: if any downstream doc happens to exist from a prior iteration, skim it to reuse conventions — but treat it as a hint, never a requirement.
3. **Frame the interview with the user (2 minutes max):**
   * "I'll interview you domain by domain — problem, users, scope, flows, data, API, edge cases, non-functional, delivery. Answer briefly; I'll follow up where I need depth. At the end you'll have a complete PRD and we'll review it for sign-off."
   * Agree on session budget: full grill (45-60 min) vs focused grill (15-20 min, e.g. single feature).



> **Interview methodology:** [`references/interview-guide.md`](references/interview-guide.md).
> **Downstream consumers:** [`references/downstream.md`](references/downstream.md).

## Instructions

Keep the interview one domain at a time; work through the steps in order. Detailed starter questions, grill follow-ups, and edge-case probes per step: [`references/interview-questions.md`](references/interview-questions.md).

- **Step 1: Domain 1 — Problem & Value** — nail the *why* before the *what*. Bedrock: you can write the Problem Statement and §1 Overview table without any placeholder.
- **Step 2: Domain 2 — Users, Personas & Roles** — know exactly who uses the system and what each can do. Bedrock: you can write the Personas & Roles table (§4) with core needs per persona and explicit role rules.
- **Step 3: Domain 3 — Scope & Features** — decide MVP (P0), V1 (P1), V2 (P2) — and what is explicitly NOT built. Bedrock: §5 features are prioritized, §14 Out of Scope is written, and every feature has a "for whom / solves what".
- **Step 4: Domain 4 — User Flows & UX States** — every journey mapped start-to-finish, including failure paths. Bedrock: §6 user flows are mapped with happy path + failure states; §8 features carry notes about states.
- **Step 5: Domain 5 — Data & Content Model** — the entities, fields, relationships, and indexes that everything else hangs on. Bedrock: §10 data model lists entities with fields, types, required flags, indexes, and relationships — matching the chosen DB (§7).
- **Step 6: Domain 6 — API & Integrations** — the endpoints and third-party services the system depends on. Bedrock: §9 API overview lists endpoint / method / auth / description for every feature; §12 lists integrations with env vars.
- **Step 7: Domain 7 — Edge Cases (Cross-Cutting Sweep)** — deliberately break the product before it ships. For EVERY feature, entity, and flow already discussed, run the edge-case checklist below. This is the step that turns a PRD into a spec a reviewer and QA can verify against. Bedrock: every P0 feature/entity has its edge cases recorded — either resolved into acceptance criteria (§5) or the §18 register, or explicitly flagged as an open question (§16). The user should feel mildly exhausted and significantly more confident.
- **Step 8: Domain 8 — Non-Functional Requirements** — performance, security, responsive, availability targets — with implementation notes. Run a light threat-model pass — trust boundaries, the top three abuse cases and their mitigations, and PII handling — and record it in §11. Bedrock: §11 NFRs have targets AND implementation notes, reference the real deployment target, and carry the Security & privacy row.
- **Step 9: Domain 9 — Delivery & Risk** — milestones, team, and the risks worth writing down. Bedrock: §13 milestones are ordered with deliverables; §15 risks have mitigations; the failure criteria from Domain 1 is honored.
- **Step 10: Draft & Self-Check** — - [ ] All 18 sections filled (or explicitly "N/A" with reason)
- **Step 11: Review & Sign-Off**


## Constraints & Guardrails
* **DO NOT** write code, design API contracts, or start the implementation plan while the PRD status is `Draft` — requirements must be approved first.
* **DO NOT** accept vague answers — grill until they are specific and quantified. Vague in, vague product.
* **DO NOT** dump the full questionnaire at once — one domain, 3-5 questions, follow up, move on.
* **DO NOT** skip the edge-case sweep (Step 7) for any P0 feature — "we'll handle it later" is how edge cases become production incidents.
* **DO NOT** invent a tech stack, acceptance criteria, or success metrics — confirm each with the user.
* **DO NOT** leave assumptions silent — every assumption you make goes into §16 Decisions Record.
* **DO NOT** let the code drift from the PRD: if scope changes during implementation, update the PRD FIRST, then the implementation plan.
* **DO NOT** rewrite an existing PRD from scratch — interview against the gaps and bump the version.
* **DO NOT** renumber the 18 sections — the numbering is a stable contract downstream references depend on.

## Examples
A complete PRD reaches this specificity: personas with role rules, numbered functional requirements (FR1.1, FR2.2…), NFRs with implementation notes, an entity schema with indexes, milestones mapped to features, a Decisions Record, and an Edge Cases register. The skeleton below is the **shape** — replace every `[bracket]` and placeholder description with the concrete, confirmed answers from the interview. No `[bracket]` may survive in the delivered PRD:

> **Full example skeleton:** [`references/prd-template.md`](references/prd-template.md)

## Related Skills

| Need | Skill |
|---|---|
| optional idea brief before the PRD | `kedata-brainstorm` |
| visual contract from the PRD | `kedata-design-brief` |
| break the PRD into tasks | `kedata-implementation-plan` |
| requirement changes after approval | `kedata-change` |

## Limitations

- Scoped to drafting the PRD.
- Best-effort guidance: it depends on the inputs above and cannot verify runtime behavior.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Required artifact missing (PRD / plan / contracts) | Upstream stage not run | Run the upstream skill or `kedata-reverse` first |
| Output conflicts with the approved docs | Docs and work drifted | Run `kedata-change`, then re-run this skill |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via its slash command |
