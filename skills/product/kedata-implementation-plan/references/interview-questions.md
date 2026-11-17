# Detailed interview questions by step

Use these starter questions and grill follow-ups for each step. Keep the full methodology in SKILL.md.

### Step 1: Domain 1 — Architecture Decision (Codebase Topology)
**Goal:** decide how the codebase is organized BEFORE any task is sized. This is the most expensive decision to reverse — lock it now.

Starter questions:
- What is the team size that will build and maintain this? (the #1 split trigger)
- Will there ever be mobile clients, a public API, or independent scaling needs?
- What is the deployment topology today — one service or many?

**The decision rule (present it, grill it, then decide):**
* **Choose monolith** when: 1-2 engineers, no mobile clients, no public API, no independent scaling need, deployment is a single unit. Inside the monolith, still extract a clean service layer (backend service / frontend app / shared contracts) so a future split doesn't require a rewrite.
* **Choose separate FE/BE** when: ≥3 engineers working in parallel, mobile clients will consume the API, a public API is planned, or FE/BE need independent scaling/deployment. Contract-first becomes mandatory: the API contract is the FIRST deliverable.
* **Split triggers (decision criteria):** mobile API clients, public API, >2 engineers, independent scaling, independent release cadence. If none of these exist today, start monolith — splitting later on a clean service layer is cheaper than two codebases from day one.

Grill follow-ups:
- "If monolith: where does the service layer live? What would force a split later?"
- "If separate: what is the contract-first deliverable? How are shared types kept in sync?"
- "Monorepo vs polyrepo: do FE and BE share types? How coupled is release?"
- "What is the cost of each choice — starting split vs migrating later?"
- "Who deploys what? Single service or multiple?"

**Bedrock signal:** §1 records the topology decision (monolith vs separate) WITH its rationale and the split-trigger criteria — no "TBD". §2 records the repo/workspace layout (monorepo vs polyrepo, folder structure).

### Step 2: Domain 2 — Deployment Platform & Operations Decision
**Goal:** decide WHERE the product runs — VM + Docker Compose vs serverless Cloud Run — and understand the constraints before any task is sized. This decision is as expensive to reverse as codebase topology: it changes the Dockerfile vs docker-compose surface, statelessness rules, background-job handling, cost model, and ops burden.

Starter questions:
- Where is this product expected to run — a VM you manage (Docker Compose) or managed serverless (Cloud Run)?
- Are there background jobs, cron, websockets, or long-running processes? (the #1 platform decider)
- Is there state that must live on the host — local files, volumes, side services (analytics, DB on the same box)?
- Who operates it — is there an ops person, or does it need to be managed for the team?

**The decision rule (present it, grill it, then decide):**
* **Choose VM + Docker Compose** when: background workers/cron/websockets are core, state must persist on the host, side services (analytics, DB, workers) are co-located, you want full control of the runtime and fixed predictable cost, or the team is comfortable owning patching/backups/uptime. Docker Compose handles the whole stack in one file; the VM is the single unit.
* **Choose Cloud Run (serverless)** when: the app is request/response HTTP, stateless by design, wants autoscaling to zero (cost saving), and the team wants managed patching/uptime without VPS ops. A single Dockerfile per service is enough; no VM to maintain.
* **Constraints to grill before choosing Cloud Run:**
  - **Statelessness** — no local file storage (use GCS); the filesystem is ephemeral.
  - **Request timeout** — Cloud Run caps request duration (default 5m, max ~60m). Long-running work needs background jobs elsewhere (Cloud Tasks, Scheduler, a worker).
  - **Background jobs / cron / websockets** — NOT a natural fit: cron needs Cloud Scheduler hitting an endpoint; long jobs need workers; websockets have concurrency/connection limits.
  - **Memory/CPU limits** — heavy tasks need bigger instances or a worker; cost scales with allocation.
  - **Cold starts** — autoscale-to-zero means cold-start latency on first request (mitigate with min-instances > 0, at a cost).
  - **Port & entrypoint** — service must listen on `$PORT`; one container per service (no multi-process like a VM).
  - **Cost model** — pay-per-request/CPU/memory vs fixed monthly VM. For steady high traffic, a VM can be cheaper; for spiky traffic, Cloud Run wins.
* **Hybrid is allowed but must be explicit:** e.g., app on Cloud Run + a small VM for workers/cron. Adds an ops surface — only choose it when there is a concrete need, and record the reason.

Grill follow-ups:
- "What runs beyond request/response — cron, queues, websockets, file processing? (this decides the platform)"
- "If serverless: where do background jobs live — Cloud Scheduler hitting an endpoint, Cloud Tasks, or a worker service?"
- "If VM: who patches the OS, runs backups, owns uptime? What's the acceptable downtime window?"
- "What's the cost model expectation — pay-per-use autoscaling or fixed monthly VPS?"
- "Where are the users — does region/latency constrain the host (e.g., users in Indonesia → asia-southeast2)?"
- "Does the product need co-located services (analytics like Plausible CE, a DB) on the same host?"
- "What's the CI/CD — deploy on push, on tag, manual? One pipeline or per service?"

**Bedrock signal:** §3 records the platform decision (VM + Docker Compose / Cloud Run / hybrid) WITH its rationale, the constraint implications (statelessness, background jobs, timeouts) and how each is handled, the service/region/domain list, and the CI/CD approach — no "TBD".

### Step 3: Domain 3 — Supporting Architecture Decisions
**Goal:** lock the supporting architecture so engineering doesn't improvise it.

Starter questions:
- Backend framework: confirm from PRD §7 (e.g., Go + Gin / FastAPI / Express). Migration tooling? Who owns schema changes?
- Frontend framework: confirm from PRD §7 (e.g., Nuxt 3 / React + TanStack Start).
- Database: confirm from PRD §7.
- Auth: JWT access/refresh? Where do tokens live (httpOnly cookie vs header)?
- File storage: GCS, local, or direct-to-cloud upload? (from PRD §12 integrations)
- Testing strategy: unit / integration / E2E split per layer?

Grill follow-ups:
- "Confirm each framework from PRD §7 — if the PRD left a layer open, decide it NOW and record it here; do not leave it for engineering to guess."
- "What migration workflow — migration files, down migrations, who runs them?"
- "Where does secrets management live — Secret Manager, env, .env.example?"
- "Caching: what needs it (Redis, CDN, ISR)? What's cache invalidation?"
- "Is there a background-job / worker need, or is everything request/response?" (cross-check with the §3 platform decision)
- "What's the feature-flag approach for half-shipped features?"

**Bedrock signal:** §4 records every supporting decision with a one-line rationale — including the Backend and Frontend framework rows, which must be confirmed (from PRD §7 or decided here), never blank.

### Step 4: Domain 4 — Task Breakdown
**Goal:** turn every PRD feature into an ordered, owner-assigned task with acceptance criteria.

Starter questions:
- List every task from PRD §8 features (+ §9 endpoints, §10 entities). No judging yet.
- For each task: description, owner (BE / FE / shared), effort (S/M/L), priority, milestone.
- Map each FE task to design-brief screens/components (§5/§6) and mockups.

Grill follow-ups:
- "What's the smallest slice that delivers end-to-end value? (that's task #1)"
- "Which tasks are blockers for others?"
- "Cut 50% — which tasks survive? (what's truly in the first milestone)"
- "Which tasks have acceptance criteria that the PRD already defines? Which need new ACs?"
- "Are there shared/contract tasks (types, API client, design tokens) before BE or FE tasks?"

**Bedrock signal:** §5 lists every task with owner, effort, priority, milestone, and acceptance criteria — and every PRD feature maps to at least one task (no orphan features).

### Step 5: Domain 5 — Dependency Order & Milestones
**Goal:** an executable sequence, not a flat list.

Starter questions:
- What's the critical path — which task must finish before anything else can start?
- Which tasks can run in parallel (BE and FE on the same feature, once the contract exists)?
- Map tasks to PRD §13 milestones.

Grill follow-ups:
- "What has the most unknowns — should it move earlier to de-risk?"
- "What's the definition of done for the FIRST milestone?"
- "Which tasks are safe to parallelize across 2+ people?"
- "What would a demo look like at the end of each milestone?"

**Bedrock signal:** §9 orders tasks with no circular dependencies, milestone mapping, and a defined first-milestone DoD; §10 defines per-task and global Definition of Done.

### Step 6: Domain 6 — API Contract & Data Model Seeds
**Goal:** the plan carries the exact endpoints and entities that will seed the contract docs.

Starter questions:
- From PRD §9: list every endpoint with method, path, auth, description.
- From PRD §10: list every entity with fields, types, indexes.
- Flag which endpoints/entities are needed for the FIRST milestone.

Grill follow-ups:
- "Which endpoints have ambiguous request/response shapes? (needs contract work first)"
- "Which entities need migrations in the first milestone?"
- "What's the API response envelope?" (Kedata: `{ "data": {}, "message": "", "error": "" }` under `/api/v1/`)
- "Which endpoints are blocked by third-party integrations (auth, email, storage)?"

**Bedrock signal:** §6 and §7 reproduce the full endpoint and entity lists from the PRD, with first-milestone items flagged.

### Step 7: Domain 7 — Env Vars & Config
**Goal:** every env var, per environment, before engineering starts.

Starter questions:
- From PRD §12: list every env var.
- For each: which environments need it (dev/staging/prod)? Secrets or non-secrets?

Grill follow-ups:
- "Which vars differ per environment? What's in `.env.example`?"
- "How are secrets provisioned in production?" (cross-check with the §3 platform decision: Secret Manager for Cloud Run vs `.env` file / docker secrets on a VM)
- "Which vars are needed for the first milestone to run locally?"

**Bedrock signal:** §8 lists every env var with environment matrix and secrets handling.

### Step 8: Domain 8 — Risks & Rollout
**Goal:** what breaks, what's the rollout order, and how do we roll back.

Starter questions:
- From PRD §15: carry the top risks.
- What are implementation-specific risks (migrations, integration timing, third-party limits, platform constraints)?

Grill follow-ups:
- "What breaks first if we ship? What's the rollback plan?"
- "Is there a feature-flag or phased rollout for the riskiest tasks?"
- "What's the acceptance bar before production deploy?"

**Bedrock signal:** §11 lists risks with mitigations, a rollout order, and a rollback plan.

### Step 9: Draft & Self-Check
* Fill every section of the template below from the PRD extraction + interview answers — no empty placeholders; "N/A" with a one-line reason where a section doesn't apply.
* Save to: **`docs/IMPLEMENTATION_PLAN.md`** (default). EXCEPTION — if the team already uses root `IMPLEMENTATION_PLAN.md`, update that file in place; never create a second copy.
* Set §12 Document Info: status `Draft`, version `0.1`, source PRD version + design brief version, owner.
* Run the implementation plan self-check — ALL must pass before presenting:
  - [ ] All 12 sections filled (or explicitly "N/A" with reason)
  - [ ] §1 architecture decision is LOCKED (monolith vs separate FE/BE) with rationale — no "TBD"
  - [ ] §3 deployment platform is LOCKED (VM + Docker Compose / Cloud Run / hybrid) with rationale — no "TBD"
  - [ ] §3 constraint implications addressed: statelessness, background jobs/cron, timeouts, secrets, cost model (each decided or explicitly "N/A" with reason)
  - [ ] Every PRD feature (§8) maps to at least one task in §5 (no orphan features)
  - [ ] Every task has owner (BE/FE/shared), effort (S/M/L), priority, milestone, and acceptance criteria
  - [ ] §4 records every supporting decision (backend framework, frontend framework, secrets, caching, background jobs, feature flags) — decided or explicitly "N/A" with reason; framework rows never blank
  - [ ] Every PRD endpoint (§9) appears in §6
  - [ ] Every PRD entity (§10) appears in §7
  - [ ] Every env var from PRD §12 appears in §8
  - [ ] §9 dependency order is executable — no circular dependencies
  - [ ] First-milestone DoD defined in §9
  - [ ] No engineering detail omitted that blocks a task (contract shapes, migration needs, integration keys)
  - [ ] §12 lists source docs + any open questions

### Step 10: Review & Sign-Off
* Present the plan with a tight summary: the architecture and deployment decisions and why, the task count per milestone, the riskiest tasks, and the open questions.
* **Do not proceed to implementation until the user approves it.** On approval, update §12: status `Approved`, version `1.0`, approver + date.
* Hand off: "Implementation plan approved. Next: draft the contracts — `/kedata-contracts`, then `/kedata-test-plan`. The architecture, deployment platform, and task order are locked — engineering can start with the first-milestone tasks once contracts + test plan are approved."
