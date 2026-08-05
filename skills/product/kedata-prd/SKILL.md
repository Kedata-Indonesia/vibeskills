---
name: kedata-prd
description: Use this skill to interview the user deeply and draft a Product Requirements Document in Kedata's house format. The PRD is the first source of truth for the implementation plan, API contracts, data model, review, and PR skills. Trigger when the user says "draft a PRD", "write a product spec", or starts a new product / feature without a PRD on file.
version: 1.2.0
author: Kedata Indonesia
---

# Skill: Kedata PRD Writer

## Purpose
Produce a Product Requirements Document in Kedata's house format through a **structured deep interview**. The PRD is the **first and primary source of truth** for the entire delivery pipeline: `kedata-system` (implementation baseline), `kedata-backend` / `kedata-frontend` (stack standards), `kedata-review` (verification criteria), and `kedata-pr` (PR description). A weak PRD propagates weakness everywhere.

The differentiator of this skill is **the grilling**: the agent does not fill a template from what the user volunteers. It interviews domain by domain, asks follow-ups until answers are specific and decision-ready, surfaces assumptions, forces priorities, and records every open question. The template below is the *output*; the interview is the *method*.

## When to Use
* User command: `/kedata-prd`
* Autonomous trigger: When starting a new product or feature without a PRD on file; when the user says "draft a PRD", "write a product spec", or asks to define requirements before implementation. Run BEFORE writing code, before designing API contracts, and before the implementation plan.

## Prerequisites & Context Gathering
Before the interview starts, the agent MUST:
1. **Locate existing artifacts:**
   * Existing PRD: check `docs/PRD.md` first, then root `PRD.md`. If one exists, interview against the gaps — update it, do not rewrite from scratch.
   * Issue / task description: read the full issue, note its key/number (e.g. `KEP-123`), and copy any existing acceptance criteria.
   * Reference docs: `docs/DEVELOPMENT_PLAN.md`, `docs/API_CONTRACTS.md`, `docs/DATA_CATALOG.md`, `ENVIRONMENT_VARIABLES.md` — reuse conventions, don't reinvent them.
2. **Frame the interview with the user (2 minutes max):**
   * "I'll interview you domain by domain — problem, users, scope, flows, data, API, non-functional, delivery. Answer briefly; I'll follow up where I need depth. At the end you'll have a complete PRD and we'll review it for sign-off."
   * Agree on session budget: full grill (45-60 min) vs focused grill (15-20 min, e.g. single feature).

## Interview Protocol (How to Grill)

**Rules of the interview — apply to every domain:**
1. **One domain at a time.** Ask 3-5 starter questions, wait for answers, then follow up. Never dump the whole questionnaire at once.
2. **Follow up until you hit bedrock.** A "bedrock" answer is specific, quantified, and decision-ready. If an answer is vague ("the user can manage stuff"), grill: *"What exactly can they do? Where does the button live? What happens if they make a mistake?"*
3. **Use the 5 Whys** on problem statements — keep asking *"why is that a problem?"* until you reach the root cause worth building.
4. **Probe boundaries.** For every feature: *"What happens when it's empty? When it fails? When two people do it at once? When input is invalid or malicious?"*
5. **Force priorities.** *"If you had to cut 50% of these features, which survive?"* — this is how MVP is decided, not by listing everything.
6. **Quantify everything.** Users, scale, latency, file sizes, team size, time. Estimates beat absolutes ("~250 users" beats "some users").
7. **Surface the non-obvious.** Ask about non-goals, failure modes, admin needs, and content/ownership rules the user may not think to mention.
8. **Record as you go.** After each domain, write the agreed answers into the draft PRD section immediately — never wait until the end (the user can correct incrementally).
9. **Don't over-grill.** Stop a domain when: answers become repetitive, the user says "I don't know — you decide" (→ record as Open Question in §16), or you have enough for a decision. The user's time is the scarcest resource.
10. **End with the Decisions Record.** Read back every assumption you made and every open question. "I assumed X, recorded as decision. Correct me if wrong."

## Execution Workflow

### Step 1: Domain 1 — Problem & Value
**Goal:** nail the *why* before the *what*.

Starter questions:
- What is the product, in one sentence?
- Who is it for, and what is their situation today (before this product)?
- What is the specific pain or opportunity — what happens today that is slow, manual, or broken?
- How will we know this worked? (success metric — must be measurable)

Grill follow-ups:
- "Why is that a problem?" (repeat until root cause)
- "What does it cost today — time, money, people — when this problem goes unsolved?"
- "If we shipped nothing, what happens in 6 months?"
- "Is the success metric something you already track, or will we need new instrumentation?"
- "What would make you call this project a failure?"

**Bedrock signal:** you can write the Problem Statement and §1 Overview table without any placeholder.

### Step 2: Domain 2 — Users, Personas & Roles
**Goal:** know exactly who uses the system and what each can do.

Starter questions:
- Who are the distinct user groups? (name each persona: public, user, moderator, admin, etc.)
- For each persona: what is their core need — what do they do *most* in the system?
- Are there roles beyond "logged in"? Who moderates, who administers?
- Is there a role hierarchy — does admin inherit moderator powers?

Grill follow-ups:
- "Who creates accounts — self-signup or admin-managed?"
- "What happens when a user misbehaves (spam, abuse)? Who handles it?"
- "Can a user have multiple roles, or exactly one?"
- "Is there a super-admin / seeded account? Who can never be demoted?"
- "What can a persona see but NOT do? (read-only surfaces)"
- "What about anonymous/guest access — what's public?"

**Bedrock signal:** you can write the Personas & Roles table (§4) with core needs per persona and explicit role rules.

### Step 3: Domain 3 — Scope & Features
**Goal:** decide MVP (P0), V1 (P1), V2 (P2) — and what is explicitly NOT built.

Starter questions:
- List the features you know you need. (write them all down first — no judging yet)
- For each: who is it for, and what problem does it solve for them?
- If we must ship in half the time, which features survive?
- What are you explicitly NOT building in v1?

Grill follow-ups:
- "What's the smallest end-to-end slice a user could actually use? (that's your MVP)"
- "Is feature X table-stakes for launch or a differentiator? Does it affect the success metric?"
- "What does the admin need that users don't? (config, moderation, import/export, logs)"
- "What automation is required vs. manual today? (e.g., link validation, duplicate detection)"
- "Does any feature depend on another — what's the dependency chain?"
- "What did I miss that always exists in products like this?" (search, pagination, empty states, notifications)

**Bedrock signal:** §5 features are prioritized, §14 Out of Scope is written, and every feature has a "for whom / solves what".

### Step 4: Domain 4 — User Flows & UX States
**Goal:** every journey mapped start-to-finish, including failure paths.

Starter questions:
- Walk me through the #1 user journey from entry to done. (the "happy path")
- What are the 2-3 next most important journeys?
- Which screens/pages exist? (landing, dashboard, detail, admin…)
- Are there design references (Figma, existing app, prototype) to preserve?

Grill follow-ups:
- "What happens when the user takes the wrong path — error states, retries, empty states?"
- "What happens mid-flow: draft saved? session lost? concurrent edit?"
- "Who sees what on each screen — what's hidden per role?"
- "What notifications exist and who receives them (in-app, email)?"
- "What about the edge cases: duplicates, deleted items, offline, slow network?"
- "Is there a state machine to document? (e.g., draft → pending → approved → rejected — who can trigger each transition?)"

**Bedrock signal:** §6 user flows are mapped with happy path + failure states; §8 features carry notes about states.

### Step 5: Domain 5 — Data & Content Model
**Goal:** the entities, fields, relationships, and indexes that everything else hangs on.

Starter questions:
- What are the core entities? (users, books, registrations, submissions…)
- For each entity: what fields does it need?
- What are the relationships between entities? (one-to-many, many-to-many, self-references)
- Which fields do users search/filter/sort by?

Grill follow-ups:
- "What is the primary key / slug / identifier, and is it user-visible?"
- "Which fields are required vs optional? Which are unique?"
- "Which fields are queried often enough to need an index?"
- "Is there history/audit — do we need append-only revisions of content?"
- "What happens to children when a parent is deleted (cascade, soft delete, orphan)?"
- "Is any data imported from an existing system (Obsidian vault, CSV, legacy DB)? What's the mapping?"
- "What's the content format — markdown, rich text, files? Size limits?"

**Bedrock signal:** §10 data model lists entities with fields, types, required flags, indexes, and relationships — matching the chosen DB (§7).

### Step 6: Domain 6 — API & Integrations
**Goal:** the endpoints and third-party services the system depends on.

Starter questions:
- Which resources need API endpoints? (map from entities/features)
- Which actions exist per resource? (CRUD + verbs like verify/reject/approve)
- Which endpoints require auth? Which require a specific role?
- Which third-party services are involved? (auth provider, email, storage, analytics, payment…)

Grill follow-ups:
- "What's the response envelope and base path convention?" (Kedata: `{ "data": {}, "message": "", "error": "" }` under `/api/v1/`)
- "Which endpoints need pagination, sorting, filtering?"
- "Which external services have env vars we must document?" (→ §12)
- "Any webhooks, background jobs, or async processing?"
- "Are there rate limits or abuse concerns on any endpoint?"
- "What does the API contract need that Swagger must document?" (→ feeds `kedata-backend`)

**Bedrock signal:** §9 API overview lists endpoint / method / auth / description for every feature; §12 lists integrations with env vars.

### Step 7: Domain 7 — Non-Functional Requirements
**Goal:** performance, security, responsive, availability targets — with implementation notes.

Starter questions:
- What are the performance expectations (page load, API latency, search)?
- What security concerns are top of mind? (auth, XSS, uploads, rate limits, secrets)
- What devices/viewports must work? (mobile-first? desktop-only admin?)
- What availability/scale targets exist? (uptime, concurrent users, data volume)

Grill follow-ups:
- "What's the expected scale in 6-12 months — users, records, file sizes?" (drives indexes & caching)
- "Which pages are public vs behind auth — what must be SEO-visible?"
- "Any compliance requirements (data retention, privacy, GDPR/Indonesia PDP)?"
- "What's the hosting reality — cloud, VPS, region? Latency constraints?"
- "What happens on a bad day — backup, restore, rollback plan?"
- "Which NFRs have an *implementation* note, not just a number?" (e.g., "LCP < 1.5s via SSG + static cache" — see the reference PRD pattern)

**Bedrock signal:** §11 NFRs have targets AND implementation notes, and reference the real deployment target.

### Step 8: Domain 8 — Delivery & Risk
**Goal:** milestones, team, and the risks worth writing down.

Starter questions:
- What are the milestones, in order, with rough timeframes?
- Who is available to build and review this? (affects scope realism)
- What keeps you up at night about this project?

Grill follow-ups:
- "Which milestone has the most unknowns — should it move earlier?"
- "What existing systems will this touch (and possibly break)?"
- "What are the top 3 risks — impact and likelihood — and what mitigates each?"
- "What's the definition of done for the FIRST milestone?"
- "What would make you kill this project early?"

**Bedrock signal:** §13 milestones are ordered with deliverables; §15 risks have mitigations; the failure criteria from Domain 1 is honored.

### Step 9: Draft & Self-Check
* Fill every section of the template below from the interview answers — no empty placeholders; "N/A" with a one-line reason where a section doesn't apply.
* Save to: **`docs/PRD.md`** (preferred — what `kedata-backend` reads). If no `docs/` dir, save to root `PRD.md` and note the location in §17.
* Set §17 Document Info: status `Draft`, version `0.1`, issue key(s), owner.
* Run the PRD self-check — ALL must pass before presenting:
  - [ ] All 17 sections filled (or explicitly "N/A" with reason)
  - [ ] Every persona in §4 has core needs and role rules
  - [ ] Every user story has acceptance criteria
  - [ ] Every feature row in §8 maps to an endpoint in §9 and an entity in §10 (no orphans)
  - [ ] Every API endpoint has: method, path under `/api/v1/`, auth flag, description
  - [ ] Every entity has indexed fields defined
  - [ ] Every env var referenced anywhere appears in §12
  - [ ] Response envelope convention noted in §9
  - [ ] §7 tech stack fully confirmed by the user (no unconfirmed defaults)
  - [ ] §16 Decisions Record lists every assumption made and every open question

### Step 10: Review & Sign-Off
* Present the PRD to the user with a tight summary: what was decided, the 3-5 riskiest assumptions, and the open questions.
* **Do not proceed to implementation until the user approves it.** On approval, update §17: status `Approved`, version `1.0`, approver + date.
* Hand off: "PRD approved. Next: run `/kedata-system`, then `/kedata-backend` or `/kedata-frontend` to implement."

## Downstream Consumers (why the PRD is the first source)
| PRD Section | Feeds | Consumed By |
|-------------|-------|-------------|
| §5 User Stories & Acceptance Criteria | Verification criteria | `kedata-system` (task understanding), `kedata-review` (testing/acceptance) |
| §4 Personas & Roles | Auth + RBAC design | `kedata-backend`, `kedata-frontend` |
| §7 Tech Stack | Architecture decisions | `kedata-backend`, `kedata-frontend`, `kedata-system` |
| §8 Core Features | Implementation plan | `kedata-system` (planning mode) |
| §9 API Overview | `docs/API_CONTRACTS.md` | `kedata-backend`, `kedata-review` |
| §10 Data Model | `docs/DATA_CATALOG.md` | `kedata-backend` |
| §11 NFRs | Performance/security targets | `kedata-backend`, `kedata-review` |
| §12 Integrations & Env Vars | `ENVIRONMENT_VARIABLES.md`, `.env.example` | `kedata-backend`, `kedata-system` |
| §16 Decisions Record | Future change requests | All — prevents re-litigating settled decisions |
| §17 Sign-off status | Readiness gate | All downstream skills — a Draft PRD must never be implemented |

## Constraints & Guardrails
* **DO NOT** write code, design API contracts, or start the implementation plan while the PRD status is `Draft` — requirements must be approved first.
* **DO NOT** accept vague answers — grill until they are specific and quantified. Vague in, vague product.
* **DO NOT** dump the full questionnaire at once — one domain, 3-5 questions, follow up, move on.
* **DO NOT** invent a tech stack, acceptance criteria, or success metrics — confirm each with the user.
* **DO NOT** leave assumptions silent — every assumption you make goes into §16 Decisions Record.
* **DO NOT** let the code drift from the PRD: if scope changes during implementation, update the PRD FIRST, then the implementation plan.
* **DO NOT** rewrite an existing PRD from scratch — interview against the gaps and bump the version.
* **DO NOT** renumber the 17 sections — the numbering is a stable contract downstream references depend on.

## Example Output Structure
The reference PRD that defines "complete" for Kedata is the Nalarela PRD (`rangkuman-buku-prod/docs/PRD.md`). Study its depth: personas, numbered FRs (FR1.1, FR2.2…), NFRs with implementation notes, entity schema, milestones mapped to features, and a Decisions Record. Your output should reach similar specificity for the interviewed product. The house skeleton:

# PRD: [Project Name] (KEP-123)
**Status:** Draft · **Version:** 0.1 · **Owner:** [Name] · **Issue:** [key]

## 1. Overview
| Item | Detail |
|------|--------|
| **What** | One-sentence description |
| **Who** | Target users |
| **Why** | Problem being solved |
| **Success Metric** | Measurable success signal |

## 2. Problem Statement
What happens today that is slow/manual/broken — with the cost of leaving it unsolved.

## 3. Goals & Non-Goals
- **Goals:** pillar- or area-organized outcomes
- **Non-Goals:** explicitly NOT building in v1

## 4. User Personas & Roles
| Persona | Description | Core Needs | Role rules |

## 5. User Stories & Acceptance Criteria
- [ ] As a **[persona]**, I want **[feature]**, so that **[benefit]**
  - [ ] AC1 … / AC2 … / AC3 …

## 6. User Flows
Happy path diagrams + failure/edge paths; state transitions per entity.

## 7. Tech Stack
| Layer | Technology | Version | Confirmed |

## 8. Core Features (MVP / V1 / V2)
| # | Feature | Priority | BE | FE | Notes |

## 9. API Overview
Response envelope `{ "data": {}, "message": "", "error": "" }` under `/api/v1/`.
| Endpoint | Method | Auth | Description |

## 10. Data Model
*(Collection for MongoDB, Table for SQL — match §7.)*
| Entity | Field | Type | Required | Indexed | Description |

## 11. Non-Functional Requirements
| Requirement | Target | Implementation |

## 12. Third-Party Integrations & Env Vars
| Service | Purpose | Env Vars |

## 13. Milestones & Timeline
| Phase | Features | Target | Deliverable |

## 14. Out of Scope
Explicitly excluded items (with reasons).

## 15. Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |

## 16. Decisions Record
Every assumption (A1, A2…) and open question (Q1, Q2…) from the interview, with resolution status.

## 17. Document Info & Sign-off
| Field | Value |
|-------|-------|
| Status | Draft / Approved |
| Version | 0.1 → 1.0 |
| Author / Owner | [Name] |
| Issue key(s) | KEP-123 |
| Approver + date | [Name, date] |
| PRD file location | `docs/PRD.md` |
