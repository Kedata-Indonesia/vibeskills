---
name: kedata-review
description: Use this skill when reviewing a pull request, auditing pending changes, or when the user asks for a code review. Walks through the Kedata code-review checklist (security, correctness, tests, observability, docs) and reports findings in priority order.
version: 1.0.0
author: Kedata Indonesia
---

# Skill: Kedata Code Review

## Purpose
Run a structured code review against Kedata's house checklist. Every PR is checked against the same mandatory gates (Swagger, activity logs, security, testing, docs) so reviewers — human or AI — catch the same class of issues and report findings in a consistent, priority-ordered format.

## When to Use
* User command: `/kedata-review`
* Autonomous trigger: When the user asks to review a pull request, audit pending changes, or requests a code review; before merging any PR into a Kedata repo.

## Prerequisites & Context Gathering
Before reviewing, the agent MUST inspect the changes:
1. Identify the PR/branch under review and its diff vs. the base branch (`git diff main...HEAD`, `gh pr view`).
2. Check for a linked issue and read its acceptance criteria.
3. Determine scope: backend (Go/Python/Node), frontend (React/Nuxt), infra, docs-only.
4. Run the local verification commands where possible: `make test`, `make swagger`, `go build ./...`, `npm run lint`.
5. Ask the user for clarification IF:
   * The base branch is ambiguous.
   * The diff is enormous (>500 lines) — confirm whether to review everything or a subset.
   * The PR type is unclear (feature, hotfix, refactor, docs-only).

## Execution Workflow

### Step 1: Mandatory Checks (Must Pass)
Run the **Mandatory** checklist. Any failure = request changes:

**Backend Standards**
| # | Check | How to Verify |
|---|-------|---------------|
| 1 | Swagger annotations on all new/modified endpoints | Open `/swagger`, verify endpoints appear with correct types |
| 2 | `make swagger` runs without errors | Run locally |
| 3 | `docs/swagger.json` updated and committed | Check git diff includes updated `docs/` files |
| 4 | Activity logs emitted for user actions | Search for `activityLogService.Log` on auth, CRUD, settings |
| 5 | No `fmt.Println` / `console.log` in production code | Global search; use structured logger |

**Security**
| # | Check | How to Verify |
|---|-------|---------------|
| 6 | No hardcoded secrets, tokens, or passwords | Search for `sk-`, `gpat_`, `password =`, `secret =` in diff |
| 7 | No SQL/NoSQL injection | Parameterized queries only — no string concat in DB calls |
| 8 | Input validation on all endpoints | `ShouldBindJSON`, `validate`, or equivalent on every handler |
| 9 | Auth middleware on protected routes | `middleware.Auth()` or equivalent |
| 10 | Sensitive data not logged | Search logs for `password`, `token`, `secret`, `credit_card` |
| 11 | CORS to specific origins | Not `*` in production; check `ALLOWED_ORIGINS` |

**Code Quality**
| # | Check | How to Verify |
|---|-------|---------------|
| 12 | Lint passes | `golangci-lint run` / `npm run lint` / `ruff check` — zero errors |
| 13 | Build passes | `go build ./...` / `npm run build` |
| 14 | No dead code | Unused imports, vars, functions, commented-out blocks |
| 15 | Robust error handling | Every error path returns proper HTTP status + message |
| 16 | No magic numbers/strings | Constants at package level or in config |

**Testing**
| # | Check | How to Verify |
|---|-------|---------------|
| 17 | Unit tests for new logic | Happy path + 2 edge cases per function |
| 18 | All tests pass | `make test` / `npm run test` — 100% |
| 19 | No unexplained test skips | `t.Skip()` / `it.skip()` need TODO comment or linked issue |

### Step 2: Recommended Checks (Should Pass)
Run the **Recommended** checklist. Failures = approve with suggestions:

**Architecture & Design**
| # | Check |
|---|-------|
| 20 | Repository pattern (Handler → Service → Repository → DB) |
| 21 | Single responsibility per function (>50 lines is a red flag) |
| 22 | No circular dependencies |
| 23 | Consistent naming conventions |

**Performance**
| # | Check |
|---|-------|
| 24 | DB queries have indexes (check `DATA_CATALOG.md`) |
| 25 | No N+1 queries |
| 26 | Pagination on list endpoints (default `page=1&size=20`, max `size=100`) |
| 27 | Large operations are async |

**Documentation**
| # | Check |
|---|-------|
| 28 | `API_CONTRACTS.md` updated |
| 29 | `DATA_CATALOG.md` updated |
| 30 | `README.md` updated |
| 31 | PR description is clear |

**Frontend (if applicable)**
| # | Check |
|---|-------|
| 32 | No `any` types in TypeScript |
| 33 | Loading and error states handled |
| 34 | Responsive design checked (375px) |
| 35 | No layout shift |

### Step 3: Language-Specific Deep Checks
Run the deep checklist for the stack in play:
* **Go:** `context.Context` through all layers, `defer` cleanup, `json`/`bson` tags match contracts, `binding` tags on DTOs, `go vet ./...`, `go test -race ./...`.
* **Python:** type hints, `async/await` correct, Pydantic models, specific `except`, `ruff check .`, `mypy .`.
* **Node.js:** `async/await` not callbacks, zod/joi validation, `Promise.all` for parallel ops, eslint, no `var`.

### Step 4: Write the Review
* Use the comment templates below.
* Prefix blocking items `[MUST]`, non-blocking `[SHOULD]`.
* Be specific ("Split `handleUpdate` into `validateUpdate` + `applyUpdate`") and acknowledge good work.

## Constraints & Guardrails
* **DO NOT** approve a PR with any failed mandatory check — request changes.
* **DO NOT** rubber-stamp trivial PRs without running the checklist.
* **DO NOT** comment on style that isn't in the checklist — stay scoped.
* **DO NOT** be vague: every comment names the file/function and gives a concrete fix.
* Keep the review priority-ordered: blockers first, then suggestions.

## Example Output Structure

### Request Changes (mandatory failure)
## ❌ Changes Requested

### Mandatory Checks Failed
- [ ] **Swagger annotations missing** on `POST /auth/reset-password` — add `@Param`, `@Success`, `@Failure`
- [ ] **Activity log not emitted** for password reset completion — add `activityLogService.Log()` call

### Suggestions
- [ ] Use a constant for token expiry instead of magic number `3600`

Please address the mandatory items and re-request review.

### Approve with Suggestions (only recommended failures)
## ✅ Approved with Suggestions

### Mandatory Checks
All passed.

### Suggestions (Non-blocking)
- [ ] Consider index on `user_id` for the new `password_resets` collection
- [ ] `handleResetPassword` is 80 lines — split into 2 functions

Great work! 🎉

### Quick LGTM (trivial)
## ✅ LGTM

Trivial change — all checks pass. Merging.
