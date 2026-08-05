---
name: kedata-backend
description: Use this skill when writing, refactoring, or reviewing Kedata backend code. Covers Swagger/OpenAPI, activity logging, clean architecture, error handling, validation, testing, and deployment-aware decisions.
version: 1.0.0
author: Kedata Indonesia
---

# Skill: Kedata Backend Engineering

## Purpose
Enforce Kedata's backend engineering standards: clean architecture (handler → service → repository → DB), the two mandatory standards (**Swagger/OpenAPI** and **Activity Log / Audit Service**), database-first design, robust error handling, and deployment-aware decisions for GCP Cloud Run.

## When to Use
* User command: `/kedata-backend`
* Autonomous trigger: When writing, refactoring, or reviewing backend code in a Kedata repo; when designing API endpoints, database schemas, or services.

## Prerequisites & Context Gathering
Before writing code, the agent MUST inspect the project:
1. Read the project docs in order:
   * `docs/PRD.md`
   * `docs/DATA_CATALOG.md`
   * `docs/API_CONTRACTS.md`
   * `docs/ARCHITECTURE.md`
   * `docs/DEVELOPMENT_PLAN.md`
2. **Database before API:** design or update `DATA_CATALOG.md` before writing endpoints. No endpoint without an approved schema.
3. Check the API contract — `API_CONTRACTS.md` is the source of truth for request/response shapes and status codes.
4. Identify the stack from `DEVELOPMENT_PLAN.md`. Default is **Go + Gin + PostgreSQL** unless specified.
5. Ask the user for clarification IF:
   * The stack is not defined in `DEVELOPMENT_PLAN.md`.
   * A schema change has no migration plan.
   * The endpoint conflicts with an existing contract.

## Execution Workflow

### Step 1: Supported Tech Stacks

**Stack A: Go + Gin (Default)** — Go 1.23+, Gin, PostgreSQL/MongoDB/MySQL, sqlx/pgx/GORM, golang-migrate/goose, JWT (access + refresh), Swaggo (`/swagger`), go test + testify, GCP Cloud Run/Docker.

**Stack B: Python + FastAPI** — Python 3.11+, FastAPI, PostgreSQL/MongoDB, SQLAlchemy/beanie, JWT, auto docs (`/docs`), pytest, GCP Cloud Run/Docker.

**Stack C: Node.js + Express** — Node 20+, Express, PostgreSQL/MongoDB, Prisma/TypeORM/Mongoose, JWT, swagger-jsdoc + swagger-ui-express, Jest/Vitest, GCP Cloud Run/Docker.

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

### Step 10: Documentation & Definition of Done
* Update `DATA_CATALOG.md` (schemas), `API_CONTRACTS.md` (endpoints), `ARCHITECTURE.md` (infra/deployment), `DEVELOPMENT_PLAN.md` (milestones/conventions); regenerate Swagger after endpoint changes.
* Work from a task issue/MR description; minimal changes; don't refactor unrelated code; write tests alongside code; ensure CI passes before review.

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
