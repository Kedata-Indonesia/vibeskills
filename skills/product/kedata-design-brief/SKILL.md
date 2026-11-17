---
name: kedata-design-brief
description: "Use when drafting DESIGN_BRIEF.md: brand, tokens, screens, components, and states. Do NOT use for engineering detail."
version: 1.3.0
author: Kedata Indonesia
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - product
    - design
---

# Skill: Kedata Design Brief Writer

## Purpose
Produce a **DESIGN_BRIEF.md** — the visual/UX companion to the PRD. The PRD answers *"what should we build?"*; the design brief answers *"what should it look like, feel like, and read like?"* It is a distilled context document: personas in design terms, visual identity and design tokens, screen inventory, component inventory, error/empty/loading states, key layouts, and dark mode — **no engineering detail**. This document is the input that mockup design (LLM or human designer) consumes to produce consistent, on-brand UI.

The differentiator is **the grilling**: the agent does not invent a visual identity or copy the first palette that comes to mind. It interviews domain by domain — brand personality, tokens, voice, screens, components, states, layouts — until every visual decision is specific, justified, and captured as a table the mockup generator can follow exactly.

This skill reads the **PRD first** (`docs/PRD.md`, then root `PRD.md`) as its mandatory input: personas, flows, features, and screen hints are extracted from it, not re-interviewed from scratch. A design brief without a PRD is an orphan — if no PRD exists, the skill falls back to interviewing the minimum product fundamentals it needs for design, and flags that the PRD should be written.

## When to Use
* User command: `/kedata-design-brief`
* Autonomous trigger: When starting UI/UX mockup design; when the user says "design the UI", "make a design brief", "prepare design context", or asks an LLM to generate mockups. Run AFTER the PRD is approved, BEFORE mockup design.

## Prerequisites & Context Gathering
Before the interview starts, the agent MUST:
1. **Read the PRD first (mandatory input).** Check `docs/PRD.md`, then root `PRD.md`. The PRD provides: product identity, personas & roles, user flows, features (incl. MVP/V1/V2), and edge cases. The design brief **extracts** from it — do not re-interview the user for product fundamentals that the PRD already answers.
   * If no PRD exists: interview the minimum product fundamentals needed for design (one-sentence product, personas, top 3 flows, feature list) and add a note in §12: "Design brief created without a PRD — product fundamentals to be confirmed."
2. **Locate existing artifacts:**
   * Existing design brief: check `docs/DESIGN_BRIEF.md` first, then root `DESIGN_BRIEF.md`. If one exists, **update that same file in place** — do not rewrite from scratch and do not move it. A root `DESIGN_BRIEF.md` the team has been using stays at root; only new briefs default to `docs/DESIGN_BRIEF.md`.
   * Design references: Figma files, prototypes, existing app, brand guidelines, moodboards — preserve them, don't invent over them.
3. **Frame the interview with the user (2 minutes max):**
   * "I'll interview you on design — brand personality, tokens, voice, screens, components, states, layouts, dark mode. Answer briefly; I'll follow up where I need depth. At the end you'll have a DESIGN_BRIEF.md ready for mockup design."
   * Agree on session budget: full grill (30-45 min) vs focused grill (15-20 min, e.g. only public screens).


> **Interview methodology:** [`references/interview-guide.md`](references/interview-guide.md).

## Companion Skill — kedata-design-frontend (visual-craft layer)
This brief defines the *contract* (12 sections, tokens, screens, sign-off). **`kedata-design-frontend`**
(adapted from [tasteskill.dev](https://www.tasteskill.dev/), vendored in this collection under
`skills/frontend/`, MIT — see `THIRD_PARTY_NOTICES.md`) supplies the *craft* — the anti-slop art
direction (typography, spacing, color, motion, banned patterns) that stops the mockups and
UI from looking generated. Use it **alongside** this skill, never instead of it.

* **Already installed** with this collection — no separate install. It needs Node 22+ and an
  installed Chrome/Edge/Chromium for its `inspect.mjs` gate.
* **Load it** before drafting §1 Product Identity and §3 Visual Identity & Tokens so the
  brand personality and palette are *decided*, not defaulted; load it again when §11
  mockups are produced.
  * The direction draw (`node <skill>/scripts/draw.mjs …`) deals 3 researched directions
    (type system, palette, hero, section compositions) instead of the model's default template.
  * App screens (dashboards, admin, settings) follow its `references/app-screens.md` route.
* **Boundary & precedence:** this brief is the source of truth. Pass `--keep palette,type`
  to the draw so it adopts the brief's brand values instead of overriding them;
  where a craft rule conflicts with the approved brief, the **brief wins** — record
  the deviation as an Open Question in §12 (and, if the brand mandates a banned device,
  note it in §11 so the FE run can justify it).


## Instructions

Keep the interview one domain at a time; work through the steps in order. Detailed starter questions, grill follow-ups, and edge-case probes per step: [`references/interview-questions.md`](references/interview-questions.md).

- **Step 1: Domain 1 — Product Identity & Brand Personality** — define the feeling the design must convey. Bedrock: you can write §1 Product Identity (with the three brand adjectives and their why) without a placeholder adjective.
- **Step 2: Domain 2 — Visual Identity & Design Tokens** — the exact tokens (colors, type, spacing, logo) a mockup generator can follow. Bedrock: §3 token tables are fully populated with light+dark values, pixel sizes, and one-line rationales.
- **Step 3: Domain 3 — Voice & Tone (Microcopy)** — the copy principles the mockups must render. Bedrock: §3.6 Voice & Tone table has 3-4 principles, each with do/don't examples in the UI language.
- **Step 4: Domain 4 — Screen Inventory** — every unique screen that needs a mockup, grouped by persona. Bedrock: §2 lists every PRD persona in design terms; §5 lists every screen grouped by persona, each with a one-line description of its key elements; §7 maps every PRD flow to screens.
- **Step 5: Domain 5 — Component Inventory** — the reusable components and their states. Bedrock: §6 lists each component with content, states, and mobile vs desktop behavior.
- **Step 6: Domain 6 — Error, Empty & Loading States** — every key screen's three non-happy states. Bedrock: §8 covers empty, error, and loading for every screen in §5 — no screen left without its non-happy states.
- **Step 7: Domain 7 — Key Layout Patterns** — the layout skeletons for the most important screens, mobile + desktop. Bedrock: §4 breakpoints are defined (375px base, 1440px desktop minimum); §9 defines the layout skeleton for the top screens at mobile and desktop using those breakpoints.
- **Step 8: Domain 8 — Dark Mode** — decide dark mode: required, default, and token mapping. Bedrock: §10 states dark mode requirement and token mappings — or is explicitly "N/A" with a reason.
- **Step 9: Domain 9 — Design Deliverables** — what mockup design produces, in what order, and what "done" means. Bedrock: §11 lists deliverables with order, variant count, and acceptance criteria.
- **Step 10: Draft & Self-Check** — - [ ] All 12 sections filled (or explicitly "N/A" with reason)
- **Step 11: Review & Sign-Off**


## Downstream Consumers (why the design brief is the input to design)
| Brief Section | Feeds | Consumed By |
|---------------|-------|-------------|
| §1 Product Identity | Brand consistency | Mockup design; frontend implementation |
| §2 User Personas (Design View) | Who sees what per role | Mockup design (screen grouping); frontend RBAC-aware UI |
| §3 Visual Identity & Tokens | Exact colors/type/spacing | Mockup design; frontend design tokens |
| §3.6 Voice & Tone | UI copy | Mockup design; content writing |
| §4 Responsive Breakpoints | Layout rules | Mockup design; frontend implementation |
| §5 Screen Inventory | Which mockups to build | Mockup design (the screen list) |
| §6 Component Inventory | Reusable UI blocks | Mockup design; component library |
| §7 User Flows (with Screen References) | Navigation & journey order | Mockup design (flow screens); frontend routing |
| §8 Error/Empty/Loading States | Non-happy-path visuals | Mockup design; frontend implementation; `kedata-test-plan` (state coverage cases) |
| §9 Key Layout Patterns | Page skeletons | Mockup design |
| §10 Dark Mode | Token variants | Mockup design; frontend implementation |
| §11 Deliverables | Mockup scope & order | Mockup design (definition of done); `kedata-implementation-plan` (FE task scope) |
| §12 Sign-off status | Readiness gate | Mockup design — a Draft brief must not drive mockups |

## Constraints & Guardrails
* **DO NOT** design mockups or write implementation code — this skill produces the brief, not the visuals.
* **DO NOT** include engineering detail (DB schema, API contracts, algorithms, NFR numbers) — the brief is visual/UX only.
* **DO NOT** re-interview product fundamentals that the PRD already answers — extract, don't reinvent.
* **DO NOT** invent a palette, typeface, or brand personality — confirm each with the user and record the *why*.
* **DO NOT** accept vague visual answers ("modern and clean") — grill to tokens: hex, px, weight, exact copy.
* **DO NOT** leave any screen without its empty/error/loading states — visuals are decided by their states.
* **DO NOT** skip dark mode — decide it or mark it "N/A" with a reason.
* **DO NOT** rewrite an existing brief from scratch — update in place and bump the version.
* **DO NOT** renumber the 12 sections — the numbering is a stable contract mockup design depends on.
* **DO NOT** let `kedata-design-frontend` override the brief — it supplies craft direction; the approved brief supplies the contract and wins on any conflict (log the deviation in §12).

## Examples
A complete design brief reaches this specificity: a named brand personality with a *why*, token tables with light+dark hex values and rationales, a screen inventory grouped by persona, a component inventory with states, and error/empty/loading coverage for every screen. The skeleton below is the **shape** — replace every `[bracket]` and placeholder description with the concrete, confirmed answers. No `[bracket]` may survive in the delivered brief:

> **Full example skeleton:** [`references/design-brief-template.md`](references/design-brief-template.md)

## Limitations

- Scoped to drafting the visual/UX DESIGN_BRIEF.md.
- Best-effort guidance: it depends on the inputs above and cannot verify runtime behavior.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Required artifact missing (PRD / plan / contracts) | Upstream stage not run | Run the upstream skill or `kedata-reverse` first |
| Output conflicts with the approved docs | Docs and work drifted | Run `kedata-change`, then re-run this skill |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via its slash command |
