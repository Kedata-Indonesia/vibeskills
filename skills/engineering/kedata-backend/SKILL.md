---
name: kedata-backend
description: "Use this skill when writing, refactoring, or reviewing Kedata backend code. Reads the stack and endpoint/data decisions from the approved artifacts (implementation plan + PRD), then enforces the house standards: Swagger/OpenAPI, activity logging, clean architecture, error handling, validation, testing, and deployment-aware decisions per the plan's platform choice."
version: 1.1.0
author: Kedata Indonesia
---

# Skill: Kedata Backend Engineering

## Purpose
Enforce Kedata's backend engineering standards: clean architecture (handler → service → repository → DB), the two mandatory standards (**Swagger/OpenAPI** and **Activity Log / Audit Service**), database-first design, robust error handling, and deployment-aware decisions following the implementation plan's platform choice (VM + Docker Compose vs serverless Cloud Run). The stack and scope are **read from the approved artifacts** — this skill never decides them.

## When to Use
* User command: `/kedata-backend`
* Autonomous trigger: When writing, refactoring, or reviewing backend code in a Kedata repo; when designing API endpoints, database schemas, or services.

## Prerequisites & Context Gathering
Before writing code, the agent MUST read the approved artifacts IN ORDER. Do not guess conventions, API shapes, stack, or scope — everything needed was decided upstream:
1. **`IMPLEMENTATION_PLAN.md`** — check `docs/` first, then root. §1 architecture (monolith vs split — where does the backend service live?), §3 deployment platform (VM vs Cloud Run — this skill's deployment rules follow it), §4 stack (backend framework, DB, auth, storage), §6 API endpoints (the exact list to build), §7 data model (the exact entities), §8 env vars, §10 DoD. **If missing, STOP — backend work requires the approved implementation plan.**
2. **`PRD.md`** — check `docs/` first, then root. §7 tech stack, §9 API overview (the *why* behind the endpoints), §10 data model, §18 edge cases — for context, not re-interview.
3. **Existing repo docs (optional hints only):** `DATA_CATALOG.md`, `API_CONTRACTS.md`, `ARCHITECTURE.md`, `DEVELOPMENT_PLAN.md` — reuse what exists from prior iterations; never a requirement.

**Stack discipline — READ, never decide:** the backend framework, DB, auth, and storage come from plan §4 / PRD §7. Do NOT default to a stack. If the artifacts don't specify it, STOP and escalate: "The stack was not locked in the implementation plan. Decide it there first (PRD §7 → plan §4)."

**Database before API:** design or update `DATA_CATALOG.md` before writing endpoints. No endpoint without an approved schema. `API_CONTRACTS.md` is the source of truth for request/response shapes and status codes — update it as you implement.

Ask the user for clarification IF:
* A schema change has no migration plan.
* The endpoint conflicts with an existing contract.
* The task touches an area the plan doesn't cover (→ escalate the plan, don't improvise).

## Execution Workflow

### Step 1: Identify the Chosen Stack
The stack comes from **plan §4 / PRD §7** — read it, don't pick it. The house reference patterns below are for whichever stack was chosen (they are guidance per language, NOT defaults):

**Go + Gin** — Go 1.23+, Gin, PostgreSQL/MongoDB/MySQL, sqlx/pgx/GORM, golang-migrate/goose, JWT (access + refresh), Swaggo (`/swagger`), go test + testify, deployment per plan §3.

**Python + FastAPI** — Python 3.11+, FastAPI, PostgreSQL/MongoDB, SQLAlchemy/beanie, JWT, auto docs (`/docs`), pytest, deployment per plan §3.

**Node.js + Express** — Node 20+, Express, PostgreSQL/MongoDB, Prisma/TypeORM/Mongoose, JWT, swagger-jsdoc + swagger-ui-express, Jest/Vitest, deployment per plan §3.

### Step 2: Project Structure
Follow the house layout for the stack (Go: `cmd/`, `internal/{config,delivery/http,domain,repository,service}`, `pkg/`, `docs/`, `migrations/`; Python: `app/{api,core,db,models,schemas,repositories,services}`, `alembic/`; Node: `src/{config,controllers,middleware,models,repositories,routes,services}`).

**Cross-Stack Rules**
* Handlers/controllers: HTTP concerns only (parse input, call service, return response).
* Services: business logic, validation, state machines.
* Repositories: data access only.
* Models: data structures (DB + request/response DTOs).
* Configuration: loaded from environment variables only.

### Step 3: Architecture Rules
* Clean architecture: handler → service → repository → database.
* Dependency injection: services depend on repository interfaces, not concrete implementations.
* No business logic in handlers or repositories. No raw SQL in handlers.
* Every state-changing action goes through a service. Use transactions for multi-step operations.
* DB schema changes require migrations. Config is validated at startup — fail fast on missing required env vars.

### Step 4: Mandatory Standard 1 — Swagger / OpenAPI
**Every backend must expose interactive Swagger UI at `/swagger` (or `/docs` for FastAPI).**
* Go: `swaggo/gin-swagger`; annotate every handler with godoc comments; run `make swagger` to regenerate `docs/docs.go`, `docs/swagger.json`, `docs/swagger.yaml`; commit generated docs.
* Python: docs auto-generated at `/docs` and `/openapi.json`; protect or disable in production.
* Node: `swagger-jsdoc` + `swagger-ui-express`; spec in JSDoc comments or YAML.

Swagger checklist: UI accessible; every endpoint annotated; request bodies typed; response codes 200, 201, 400, 401, 403, 404, 500; security definitions on auth endpoints; `make swagger` exists; CI validates generation.

### Step 5: Mandatory Standard 2 — Activity Log / Audit Service
**Every backend must implement an async activity log service recording all significant user actions.**

Logged actions: `auth:login/logout/register/password_reset`, `resource:create/update/delete/view`, `export:download`, `settings:update`, `invite:send`, `permission:change`, `integration:connect/disconnect`.

Log schema: `id`, `timestamp`, `user_id`, `user_email`, `user_role`, `action`, `resource_type`, `resource_id`, `description`, `metadata` (before/after, changed_fields), `ip_address`, `user_agent`, `request_id`, `session_id`.

Implementation rules:
* Run logging asynchronously (fire-and-forget); logging failures must NOT fail the main request.
* Capture `request_id`, `ip_address`, `user_agent`; include `before`/`after` metadata for updates.
* Admin endpoints: `GET /api/v1/admin/activity-logs` and `GET /api/v1/admin/activity-logs/summary`.
* Indexes: `(user_id, timestamp DESC)`, `(action, timestamp DESC)`, `(resource_type, resource_id)`.

### Step 6: Database Rules
* Design schema before API; update `DATA_CATALOG.md` first.
* Use migrations — no manual DB edits in production.
* Indexes for query-heavy columns; foreign keys (or app-level constraints for NoSQL).
* Soft deletes preferred on business entities; connection pooling configured.

### Step 7: Auth & Security
* JWT access token (15 min) + refresh token (7 days); refresh tokens rotated and revocable.
* bcrypt cost ≥ 12; never return password hashes in API responses.
* HTTPS only in production; validate/sanitize all input; parameterized queries; CORS to known origins; rate limit auth endpoints; capture IP + user agent for security events.

### Step 8: Code Quality
* Return errors explicitly — never swallow them.
* Centralized domain errors: `ErrNotFound`, `ErrUnauthorized`, `ErrForbidden`, `ErrConflict`, `ErrValidation`; map to HTTP status in handlers.
* Structured logging with request IDs; validate input at handler/entry point.
* Small, focused functions with meaningful names; comments only where behavior is non-obvious.

### Step 9: Testing
* Unit tests for services/utilities; integration tests for repositories; handler/API tests with test HTTP server.
* Target ≥70% coverage for service layer.
* Run before committing: Go `go test ./...` + `go vet ./...`; Python `pytest`; Node `npm test`.

### Step 10: Deployment Awareness (per plan §3)
Follow the **deployment platform decision in the implementation plan §3** — this overrides any generic default:

**If Cloud Run (serverless):**
* Stateless — no local file storage (use GCS); filesystem is ephemeral.
* Listen on `$PORT`; one container per service; keep request duration within the Cloud Run cap (default 5m, max ~60m) — long work goes to background jobs.
* Use Secret Manager for secrets; connection pooling configured for the DB (warm pool, bounded).
* Health check endpoint for the platform probe; `--min-instances 0` to save cost (accept cold starts).

**If VM + Docker Compose:**
* One `docker-compose.yml` for the whole stack (app + any side services).
* Migrations run as part of deploy (or a one-shot container); backups owned by the team.
* Region near users for latency; fixed monthly cost.

**Cloudflare:** single-level subdomains only (`api.kedata.id` ✓, `api.app.kedata.id` ✗); SSL mode **Full**.

### Step 11: Documentation & Definition of Done
* Update `DATA_CATALOG.md` (schemas), `API_CONTRACTS.md` (endpoints), `ARCHITECTURE.md` (infra/deployment), `DEVELOPMENT_PLAN.md` (milestones/conventions); regenerate Swagger after endpoint changes.
* Work from the task in the implementation plan; minimal changes; don't refactor unrelated code; write tests alongside code; ensure CI passes before review.

**Self-check — ALL must pass before presenting:**
- [ ] Stack read from plan §4 / PRD §7 (no assumed default)
- [ ] Every endpoint built matches plan §6 / PRD §9
- [ ] Every entity matches plan §7 / PRD §10; `DATA_CATALOG.md` updated first for new schema
- [ ] Swagger annotations on every new/modified endpoint; `make swagger` runs; `docs/swagger.json` committed
- [ ] Activity log emitted for every state-changing action
- [ ] No raw errors to clients; domain errors mapped to HTTP status codes
- [ ] Migrations added for schema changes
- [ ] Tests added/updated; ≥70% coverage on service layer
- [ ] Deployment follows plan §3 (stateless rules for Cloud Run / compose stack for VM)
- [ ] `API_CONTRACTS.md` updated

**Definition of Done:**
- [ ] Feature implemented per API contract
- [ ] Swagger annotations/spec updated and generated
- [ ] Activity log entries added for state-changing actions
- [ ] Tests added/updated
- [ ] Migrations added for schema changes
- [ ] Lint and type checks pass
- [ ] Documentation updated
- [ ] Deployed to staging and verified

## Constraints & Guardrails
* **DO NOT** decide or improvise the stack — read it from plan §4 / PRD §7; if missing, STOP and escalate to the product team.
* **DO NOT** write an endpoint before the schema is approved (`DATA_CATALOG.md` first).
* **DO NOT** skip Swagger annotations or activity logging — both are mandatory.
* **DO NOT** return raw errors or password hashes to clients.
* **DO NOT** put business logic in handlers or repositories.
* **DO NOT** hardcode secrets; use env vars / Secret Manager.
* **DO NOT** do blocking work in async handlers; keep functions small and focused.
* Ask clarifying questions when requirements are ambiguous; propose simpler solutions before complex ones; explain trade-offs.

## Example Output Structure
Activity log entry (the shape every service must emit):
```json
{
  "id": "uuid",
  "timestamp": "2026-07-02T06:49:43Z",
  "user_id": "user-123",
  "action": "resource:update",
  "resource_type": "registration",
  "resource_id": "reg-456",
  "metadata": { "before": { "status": "diajukan" }, "after": { "status": "diverifikasi" }, "changed_fields": ["status"] },
  "ip_address": "192.168.1.1",
  "request_id": "req-abc-123"
}
```
Error handling pattern:
```go
if err != nil {
    logger.Error("failed to create password reset", zap.Error(err))
    return nil, httperr.InternalServerError("failed to process request")
}
```
