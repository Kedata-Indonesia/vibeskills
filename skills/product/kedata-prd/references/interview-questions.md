# Detailed interview questions by step

Use these starter questions and grill follow-ups for each step. Keep the full methodology in SKILL.md.

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
- **Edge cases:** "What happens when a user is banned while logged in? While mid-submission? What happens to their content — deleted, orphaned, or hidden?"

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
- "Is there a state machine to document? (e.g., draft → pending → approved → rejected — who can trigger each transition? What are the ILLEGAL transitions and what happens if attempted?)"

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
- **Edge cases:** "What happens to references that point at a deleted or never-created record (broken links, orphans)? Is there validation? Auto-stub? Cleanup job?"

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
- "What request/response shapes and status codes must the API contract pin down?" (the backend documentation will be generated from this)
- **Edge cases:** "What happens on idempotent retries (double-submit, network retry)? Timeouts? Partial failures in multi-step operations (are they transactional)? What's the status code for each failure mode?"

**Bedrock signal:** §9 API overview lists endpoint / method / auth / description for every feature; §12 lists integrations with env vars.

### Step 7: Domain 7 — Edge Cases (Cross-Cutting Sweep)
**Goal:** deliberately break the product before it ships. For EVERY feature, entity, and flow already discussed, run the edge-case checklist below. This is the step that turns a PRD into a spec a reviewer and QA can verify against.

Frame: *"Now the expensive part — let's try to break the product. For each feature we listed, I'll ask a few boundary questions. Answer briefly; where you don't know, we mark it open in the register."*

**The Edge-Case Checklist** — apply to each feature/entity/flow; pick the 3-6 questions that apply (do NOT mechanically ask all 16 for a typo-fix feature):

| # | Category | Probe |
|---|----------|-------|
| 1 | **Empty states** | What does the screen/API show when there is no data? (first-run, zero search results, cleared list, brand-new account) |
| 2 | **Null & missing** | Which fields can be empty or absent? What is the default? Does any logic break on null? |
| 3 | **Duplicates** | What happens on duplicate submissions, titles, emails, or tags? Auto-detect, warn, block, or allow with flag? |
| 4 | **Concurrency** | Two users editing/submitting the same record at once — last-write-wins, optimistic locking, conflict detection with rebase? |
| 5 | **Deletion & cascades** | Delete a parent — what happens to children, related records, history? Hard vs soft delete? Who can delete what? |
| 6 | **Invalid input** | What validation exists — formats, lengths, allowed characters, type coercion? Client-only or server-enforced too? |
| 7 | **Boundary values** | Min/max on numbers, string length limits, pagination caps, upload size limits — what happens exactly AT the limit and PAST it? |
| 8 | **Permissions boundaries** | What happens when a user without role X calls endpoint Y — explicit 403 or silently filtered data? What is public vs private per field? |
| 9 | **Failure & retries** | What happens on timeout or 5xx? Is the operation retried? Are writes idempotent? What error message does the user see? |
| 10 | **Offline / slow network** | Degraded mode, optimistic UI, cached reads? What breaks and what must never break? |
| 11 | **State-machine transitions** | For each status field: which transitions are legal? What is an illegal transition and what happens if attempted (blocked, 409, ignored)? |
| 12 | **Security abuse** | Malicious input — XSS, path traversal, huge payloads, rate-limit bypass, mass assignment. Where are the boundaries? |
| 13 | **Unicode / special chars** | Titles, names, IDs with unicode, emoji, markdown injection, reserved characters in slugs/paths? |
| 14 | **Scale extremes** | What happens at maximum volume (10k records, 5000 graph nodes, 50MB zip)? Degrades gracefully or falls over? |
| 15 | **Cross-entity orphans** | References pointing to deleted/missing records — broken links, dangling FKs. Validation? Auto-stub? Cleanup? |
| 16 | **Time & scheduling** | Timezones, DST, expiry, TTL, scheduled jobs — what happens at boundaries (midnight, year rollover, token expiry mid-action)? |

**Bedrock signal:** every P0 feature/entity has its edge cases recorded — either resolved into acceptance criteria (§5) or the §18 register, or explicitly flagged as an open question (§16). The user should feel mildly exhausted and significantly more confident.

### Step 8: Domain 8 — Non-Functional Requirements
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
- "Which NFRs have an *implementation* note, not just a number?" (e.g., "LCP < 1.5s via SSG + static cache")

**Bedrock signal:** §11 NFRs have targets AND implementation notes, and reference the real deployment target.

### Step 9: Domain 9 — Delivery & Risk
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

### Step 10: Draft & Self-Check
* Fill every section of the template below from the interview answers — no empty placeholders; "N/A" with a one-line reason where a section doesn't apply.
* **Save location rule:** the default is **`docs/PRD.md`** (the Kedata project convention). EXCEPTION — if the user/team has already been using `PRD.md` at the repo root, update that root file in place instead; do not move it and do not create a second copy in `docs/`. Note the final location in §17.
* Set §17 Document Info: status `Draft`, version `0.1`, issue key(s), owner.
* Run the PRD self-check — ALL must pass before presenting:
  - [ ] All 18 sections filled (or explicitly "N/A" with reason)
  - [ ] Every persona in §4 has core needs and role rules
  - [ ] Every user story has acceptance criteria
  - [ ] Every feature row in §8 maps to an endpoint in §9 and an entity in §10 (no orphans); pure-UI features (landing page, empty states) are marked "N/A — UI-only"
  - [ ] Every API endpoint has: method, path under `/api/v1/`, auth flag, description
  - [ ] Every entity has indexed fields defined
  - [ ] Every env var referenced anywhere appears in §12
  - [ ] Response envelope convention noted in §9
  - [ ] §7 tech stack fully confirmed by the user (no unconfirmed defaults)
  - [ ] **§18 edge-case register covers every P0 feature (at minimum); each entry has expected behavior decided OR is flagged open in §16**
  - [ ] §16 Decisions Record lists every assumption made and every open question

### Step 11: Review & Sign-Off
* Present the PRD to the user with a tight summary: what was decided, the 3-5 riskiest assumptions, the most dangerous edge cases, and the open questions.
* **Do not proceed to implementation until the user approves it.** On approval, update §17: status `Approved`, version `1.0`, approver + date.
* Hand off: "PRD approved. Next: draft the design brief (`/kedata-design-brief`, if UI), then the implementation plan, contracts, and test plan — then begin coding per the stack standards. If scope changes later, run `/kedata-change` first."
