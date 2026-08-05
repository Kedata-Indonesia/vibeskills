---
name: kedata-system
description: Kedata's baseline AI development rules. Manually invoke (/kedata-system) at the start of any session inside a Kedata repo so the assistant reads the project docs, follows house conventions, and produces production-ready code.
version: 1.0.0
author: Kedata Indonesia
---

# Skill: Kedata System — Baseline Development Rules

## Purpose
Load the baseline operating rules for any AI-assisted development session inside a Kedata repo: identity and default stack, the mandatory read-before-you-code discipline, the plan → confirm → code → test → verify workflow, house code-quality standards, environment variable handling, deployment awareness (GCP Cloud Run + Cloudflare), and git/PR conventions. Run this skill at session start so every subsequent task inherits the house rules.

## When to Use
* User command: `/kedata-system`
* Autonomous trigger: At the start of any session inside a Kedata repo (detected via AGENTS.md, .cursorrules, or repo naming), before any other task; also after switching repos mid-session.

## Prerequisites & Context Gathering
Before writing any code, the agent MUST read the relevant project documentation. Do not guess conventions, API shapes, or folder structures.

**Mandatory reading checklist (in order):**
1. **Issue / Task Description** — What needs to be built? Acceptance criteria?
2. **`docs/DEVELOPMENT_PLAN.md`** — Coding conventions, folder structure, tech decisions
3. **`BACKEND_STANDARDS.md`** — **Mandatory:** Swagger/OpenAPI + Activity Log service for every backend
4. **`docs/API_CONTRACTS.md`** — If building/modifying an API endpoint
5. **`docs/DATA_CATALOG.md`** — If touching database models or queries
6. **`docs/ARCHITECTURE.md`** — If adding new services, middleware, or infrastructure
7. **`docs/STATE_MANAGEMENT.md`** — If modifying frontend state
8. **`docs/COMPONENT_SPECS.md`** — If building/modifying UI components
9. **`docs/API_INTEGRATION.md`** — If calling backend from frontend

If a document doesn't exist yet, **create it first** before writing code.

Confirm with the user before coding: which repo (be-xxx / fe-xxx)? which scope (BE / FE / Mobile / Infra)? is there an existing API contract or data model? are there design/mockups?

## Execution Workflow

### Step 1: Understand the Task
When given a GitHub issue or task, read the full issue first:
1. Check the issue type: Feature / Bug / Refactor / Hotfix
2. Read all acceptance criteria
3. Check linked issues (parent/child)
4. Check for an existing PR or branch
5. Read QA comments if the issue was previously failed

**Bug fixes:** reproduce the bug before fixing; write a failing test first (TDD); verify the fix resolves the exact scenario; check for regressions.
**Features:** break into smaller PRs if >500 lines changed; update docs alongside code; add analytics/events if user-facing.

### Step 2: Read Project Docs
```bash
cat docs/DEVELOPMENT_PLAN.md
cat docs/API_CONTRACTS.md | grep -A 20 "auth"
cat docs/DATA_CATALOG.md | grep -A 20 "password"
```

### Step 3: Plan the Implementation
Write a brief plan before coding, then **wait for user confirmation**:
- Files to create / files to modify
- API endpoints
- DB changes (collections, indexes)
- Env vars
- Step-by-step order
- Risks

For non-trivial changes (>50 lines), generate `implementation_plan.md` with the same structure (Files to Create / Files to Modify / API Endpoints / DB Changes / Step-by-Step Order / Risks), then wait for confirmation before writing code.

### Step 4: Choose a Development Mode
* **Planning Mode** — starting a new feature/module, designing API contracts, DB schema, or architecture: generate `implementation_plan.md` → review with user → write tests first (TDD).
* **Fast Mode** — typo fixes, small UI tweaks, single-function refactors, config updates: make change directly → run tests → commit.

### Step 5: Write Code
Follow conventions from `docs/DEVELOPMENT_PLAN.md`. House patterns:

**Backend (Go):**
```go
// Error handling
if err != nil {
    logger.Error("failed to create password reset", zap.Error(err))
    return nil, httperr.InternalServerError("failed to process request")
}

// Repository pattern — no DB calls in handlers
func (r *PasswordResetRepository) Create(ctx context.Context, pr *models.PasswordReset) error {
    _, err := r.collection.InsertOne(ctx, pr)
    return err
}
```

**Frontend (Nuxt/Vue):** composables for API calls (`usePasswordReset`), `<script setup lang="ts">` components with explicit `loading`/`error` state.

### Step 6: Write Tests
* Backend: `make test` or `go test ./internal/... -v -count=1`; coverage with `-coverprofile`.
* Frontend: `npm run test`; coverage `npm run test:coverage`.

### Step 7: Update Documentation
After implementing, update the relevant docs: `API_CONTRACTS.md` (endpoints), `DATA_CATALOG.md` (collections/fields), `COMPONENT_SPECS.md` (components), `ENVIRONMENT_VARIABLES.md` (env vars, both `.env` and `.env.example`).

### Step 8: Review Before Accepting (Human Verification)
Before the user accepts any changes, provide a Changes Summary (What changed / Why / Risks & Gotchas / Verification checklist) and **do not proceed until the user confirms**.

### Step 9: Verify Before Submitting
**Backend:**
```bash
make test          # all tests pass
golangci-lint run  # lint passes
go build ./...     # compiles
make swagger       # swagger docs generate without errors
```
- [ ] Every new endpoint has Swagger annotations
- [ ] `make swagger` runs without errors; `docs/swagger.json` updated and committed
- [ ] Activity logs emitted for user actions (login, CRUD, settings changes)
- [ ] Admin can query logs via `GET /admin/activity-logs`

**Frontend:**
```bash
npm run test       # all tests pass
npm run lint       # lint passes
npm run build      # builds without errors
```
- [ ] Layout described (or ASCII wireframe provided)
- [ ] Responsive breakpoints tested (1920px, 768px, 375px)
- [ ] Hover/focus/active states described
- [ ] Dark theme compatibility verified

## Code Quality Standards

### Backend (Go)
1. **Error handling:** never return raw errors to clients; use `httperr` for standardized responses; log with context (`zap`).
2. **Database:** repository pattern; always use `context.Context` for timeouts; index queried fields; transactions for multi-document operations.
3. **API design:** base path `/api/v1/`; plural nouns (`/users`); consistent response shape `{ "data": {}, "message": "", "error": "" }`.
4. **Swagger:** annotate all handlers with swaggo comments; regenerate with `make swagger`.

### Frontend (Nuxt/Vue)
1. **TypeScript:** strict mode; no `any`; type all props, emits, composable returns.
2. **State:** Pinia for global state; `ref`/`computed` for local; URL query params for shareable filters.
3. **API:** `$fetch` via composables (not raw fetch in components); explicit loading/error states; interceptors for auth token injection.
4. **Components:** `<script setup lang="ts">`, props interface + withDefaults, emit types, slot docs.
5. **Styling:** Tailwind utility classes; design tokens in `tailwind.config.ts`; dark theme default.

## Environment Variables
Always check before using an env var: is it in `.env`? in `.env.example`? documented in `ENVIRONMENT_VARIABLES.md`?

**Rules:** add new env vars to BOTH `.env` and `.env.example`; update `ENVIRONMENT_VARIABLES.md` at project root; never commit `.env` — only `.env.example`; use Secret Manager for production secrets (GCP).

## Deployment Awareness
* **Docker:** multi-stage builds (builder → runtime); pinned versions (`node:20-alpine`, `golang:1.25-alpine`); correct ports (BE: 8080, FE: 3000); include `ca-certificates` for HTTPS.
* **Cloud Run:** stateless services — no local file storage; Cloud Storage for files; Secret Manager for secrets; region `asia-southeast2` (Jakarta); `--min-instances 0` to save cost (accept cold starts).
* **Cloudflare:** domain mapping via Cloudflare Workers; single-level subdomains only (`app.kedata.id` ✓, `api.app.kedata.id` ✗); SSL mode **Full**.

## Git & GitHub
* **Branches:** `feature/123-password-reset`, `bugfix/456-login-crash`, `hotfix/auth-down`, `docs/api-contracts`, `refactor/user-service`.
* **Commits:** conventional commits, e.g. `feat(auth): add password reset endpoints (#123)` with a bullet body and `Fixes #123`.
* **PRs:** use the PR template (Summary / Changes / Type / Checklist / Related Issues); link the issue with `Closes #123`.

## Constraints & Guardrails
* **DO NOT** write code before reading the relevant project docs.
* **DO NOT** skip `BACKEND_STANDARDS.md` requirements (Swagger + Activity Log) on any backend.
* **DO NOT** return raw errors to clients or log sensitive data (emails, tokens, passwords).
* **DO NOT** hardcode secrets — use env vars or Secret Manager.
* **DO NOT** use string concatenation in DB queries (SQL/NoSQL injection).
* **DO NOT** commit `.env`; add new env vars to both `.env` and `.env.example`.
* **DO NOT** proceed past the implementation plan or changes summary without user confirmation.
* **DO NOT** use unsupported multi-level subdomains (`api.app.kedata.id`) for Cloudflare mappings.
* Keep responses dense; ask before assuming; propose options; flag risks; show your work.

## Example Output Structure
Implementation plan artifact (`implementation_plan.md`):
```markdown
## Implementation Plan for #123
### Files to Create
- internal/models/password_reset.go
- internal/repository/password_reset_repository.go
- internal/service/password_reset_service.go
- internal/api/password_reset_handler.go
### Files to Modify
- internal/routes/routes.go
- cmd/server/main.go
### API Endpoints
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password
### DB Changes
- New collection: password_resets
### Env Vars
- SENDGRID_API_KEY
- PASSWORD_RESET_EXPIRY=3600
```

Changes summary (before accepting work):
```markdown
## Changes Summary
### What changed
- Added PasswordResetService with token generation
- Added 2 endpoints: POST /auth/forgot-password and POST /auth/reset-password
- Added password_resets collection with TTL index
### Why
- Users need a way to recover forgotten passwords
### Risks / Gotchas
- Token is hashed before storage (not plain text)
- Rate limit: 3 requests/hour per email
### Verification
- [ ] make test passes
- [ ] make swagger passes
- [ ] Swagger UI shows new endpoints
```
