---
name: kedata-brainstorm
description: "Use when validating a raw product idea from a business perspective and returning a verdict. Do NOT write the PRD."
version: 1.0.0
author: Kedata Indonesia
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - product
    - ideation
---

# Skill: Kedata Brainstorm — Raw Idea → Validated Idea

## Purpose
Partner with the user to take a **raw idea** and pressure-test it from a **business/product perspective** until it becomes a **mature, feasible idea with a plausible market/user fit**. The output is an optional **`docs/IDEA_BRIEF.md`** — a distillation of the problem, target market, competition, value proposition, business model, feasibility, go-to-market, and the risks that could kill it, closing with an explicit **verdict**.

The differentiator is **the grilling**: this skill does not cheerlead a shiny idea, and it does not fill a template with optimism. It interviews domain by domain, separates what the user **knows** from what they **believe**, challenges every market claim with "what's your evidence?", forces the idea through customer, competitor, economics, and feasibility scrutiny, and surfaces the assumptions that must be true for the idea to work — before a single requirement is written.

**This stage is OPTIONAL.** It exists so a rough idea gets a fair, honest shake before it is committed to a full PRD and build. If the user is **already convinced** the idea is good (validated by their own research, market knowledge, or experience), they may **skip this skill and go straight to `kedata-prd`** — the `IDEA_BRIEF.md` is NOT a prerequisite for the PRD and is NOT a gate in the delivery pipeline. The only thing mandatory is honesty about which of the two paths is being taken.

## When to Use
* User command: `/kedata-brainstorm`
* Autonomous trigger: When the user shares a **raw or early-stage idea** and wants to discuss, explore, or validate it before writing requirements — "I have an idea…", "let's brainstorm", "is this worth building?", "would anyone pay for this?", "help me think through this idea". Run BEFORE `kedata-prd` when the idea is still unshaped.
* **Do NOT use** when a PRD/approved requirements already exist (the idea has already been committed) — that is `kedata-prd` territory.
* **Do NOT use** for incremental features inside an already-defined product — go straight to `kedata-prd`.

## Prerequisites & Context Gathering
Before the interview starts, the agent MUST:
1. **Assume pre-PRD.** There is no mandated upstream artifact. The repo may contain nothing at all. Do NOT expect a PRD, design brief, or contracts — do NOT block on them.
2. **Locate existing artifacts (hints only):**
   * Existing idea brief: check `docs/IDEA_BRIEF.md` first, then root `IDEA_BRIEF.md`. If one exists, **update that same file in place** (bump the version) — do not rewrite from scratch and do not move it.
   * Existing PRD: `docs/PRD.md` then root `PRD.md`. If a PRD already exists, the idea is likely already committed — confirm with the user whether they want to revisit the idea (rare) or proceed to `kedata-prd`. Do not re-litigate a settled product without explicit intent.
   * Any market research, competitor notes, interview transcripts, or user feedback the user already has — ask for them; evidence beats opinion.
3. **Frame the session (2 minutes max):**
   * "I'll grill this idea with you domain by domain — problem, who it's for and how big, what already exists, why you win, how it makes money, whether you can actually build and sell it, and what would kill it. It's a business conversation, not a feature list. At the end you'll get an honest verdict: proceed, pivot, park, or kill."
   * Agree on session budget: full grill (40-60 min) vs focused grill (15-20 min, e.g. gut-check one dimension).
   * State the optionality plainly: *"If you already believe this is solid, we can skip straight to the PRD — but if we brainstorm, I'll push hard on the weak parts."*



> **Interview methodology:** [`references/interview-guide.md`](references/interview-guide.md).
> **Downstream consumers:** [`references/downstream.md`](references/downstream.md).

## Instructions

Keep the interview one domain at a time; work through the steps in order. Detailed starter questions, grill follow-ups, and edge-case probes per step: [`references/interview-questions.md`](references/interview-questions.md).

- **Step 1: Domain 1 — The Idea & the Job-to-be-Done** — strip the idea to the problem it actually solves, before any solution pride sets in. Bedrock: you can write the Problem & JTBD section as a concrete job, a named sufferer, and the status-quo cost — with the "why now" stated.
- **Step 2: Domain 2 — Target User & Market** — know exactly who the sharpest first customer is, and how big the prize can plausibly grow. Bedrock: the Target User & Market section names a specific beachhead segment, an order-of-magnitude market size with a source or an explicit "est.", and a willingness-to-pay hypothesis.
- **Step 3: Domain 3 — Existing Alternatives & Competition** — map reality — what the user does today and who else wants the same wallet. Bedrock: the Competitive Landscape section lists real alternatives (including "nothing"), the switching reason, and a stated moat or honest "no moat yet."
- **Step 4: Domain 4 — Value Proposition & Differentiation** — a positioning sharp enough that a stranger repeats it correctly. Bedrock: the Value Proposition section holds one positioning statement, one named wedge benefit, and at least one concrete proof point.
- **Step 5: Domain 5 — Business Model & Unit Economics** — how the idea makes money, and whether the numbers can ever work. Bedrock: the Business Model section names the revenue mechanism, a price, a rough cost-to-serve and CAC direction, and whether the unit economics are plausible, thin, or unknown.
- **Step 6: Domain 6 — Feasibility Assessment** — can this actually be built, operated, and legally sold by this team — ever, and soon? Bedrock: the Feasibility section names the hardest technical piece and its state (known/unknown), the operational and regulatory constraints, and the team gap — with a realistic minimal build scope.
- **Step 7: Domain 7 — Go-to-Market & Distribution** — the path to the first real users — because a great product nobody finds is a failed idea. Bedrock: the Go-to-Market section names a concrete first channel with a cost, a first-100-users plan, and whether growth is paid, looped, or earned.
- **Step 8: Domain 8 — Riskiest Assumptions, Risks & Kill Criteria** — make the make-or-break assumptions explicit and testable — and decide in advance what would kill the idea. Bedrock: the Riskiest Assumptions section lists the one killer assumption plus a cheap test, the top risks with mitigations, and an explicit kill criterion.
- **Step 9: Domain 9 — Verdict & Next Step** — an honest verdict, not a participation trophy. Bedrock: a written verdict with its reasoning, and a single clear next action.
- **Step 10: Draft & Self-Check** — - [ ] All 13 sections filled (or explicitly "N/A" with reason)
- **Step 11: Review & Sign-Off**


## Constraints & Guardrails
* **DO NOT** treat this stage as mandatory — a convinced user may go straight to `kedata-prd`; the `IDEA_BRIEF.md` is not a gate.
* **DO NOT** cheerlead. If the problem isn't real, nobody pays, or it can't be built/sold, say so with the reason (Kill is a valid, valuable outcome).
* **DO NOT** accept market or financial claims as facts — mark every one **Evidence** or **Assumption**, and demand the source or the honest "I don't know".
* **DO NOT** write requirements, user stories, API contracts, or code — those are `kedata-prd` and downstream. This is the business/idea layer only.
* **DO NOT** invent market sizes, competitor facts, or pricing — confirm with the user, cite their source, or label the estimate.
* **DO NOT** dump the full questionnaire at once — one domain, 3-5 questions, follow up, move on.
* **DO NOT** skip the riskiest-assumption and kill-criteria questions — they are the point of validating before building.
* **DO NOT** let the idea skip this check silently *and* skip it loudly — always state which path (brainstorm-then-PRD, or PRD-direct) is being taken.
* **DO NOT** rewrite an existing idea brief from scratch — update in place and bump the version.
* **DO NOT** renumber the 13 sections — the numbering is a stable contract downstream references depend on.

## Examples
A complete idea brief reaches this specificity: a named beachhead segment, order-of-magnitude market numbers tagged as evidence or assumption, real competitors including "do nothing", a one-sentence positioning, a revenue mechanism with a price and a cost direction, a feasibility verdict on the hardest technical piece, a first-channel GTM plan, one killer assumption with a cheap test, a kill criterion, and an explicit verdict. The skeleton below is the **shape** — replace every `[bracket]` and placeholder description with the concrete, confirmed answers. No `[bracket]` may survive in the delivered brief:

> **Full example skeleton:** [`references/idea-brief-template.md`](references/idea-brief-template.md)

## Related Skills

| Need | Skill |
|---|---|
| turn the validated idea into a PRD | `kedata-prd` |

## Limitations

- Scoped to business validation of a raw idea.
- Best-effort guidance: it depends on the inputs above and cannot verify runtime behavior.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Required artifact missing (PRD / plan / contracts) | Upstream stage not run | Run the upstream skill or `kedata-reverse` first |
| Output conflicts with the approved docs | Docs and work drifted | Run `kedata-change`, then re-run this skill |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via its slash command |
