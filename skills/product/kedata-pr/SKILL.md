---
name: kedata-pr
description: Use this skill when the user asks to open a pull request, write a PR description, or summarise a branch's changes. Produces the PR body in Kedata's standard template (Summary / Changes / Type / Mandatory checks / Screenshots / Related issues) so reviewers see the same shape every time.
version: 1.0.0
author: Kedata Indonesia
---

# Skill: Kedata Pull Request Writer

## Purpose
Produce a pull request body that matches Kedata's house PR template, so every PR communicates the same information to reviewers: what changed, why, what type of change it is, whether the mandatory checks pass, and which issue it closes. The template encodes Kedata's non-negotiable backend standards (Swagger + Activity Log) directly into the checklist so they can't be skipped.

## When to Use
* User command: `/kedata-pr`
* Autonomous trigger: When the user asks to open a PR, write a PR description, or summarise a branch's changes; when a feature/bugfix branch is ready to merge.

## Prerequisites & Context Gathering
Before drafting the PR body, the agent MUST inspect the environment:
1. Identify the current branch and its diff vs. the base branch (`git log main..HEAD --oneline`, `git diff main...HEAD --stat`).
2. Find the related issue key/number — the branch name usually carries it (e.g. `feature/KEP-123-short-desc`).
3. Read `docs/DEVELOPMENT_PLAN.md` and `BACKEND_STANDARDS.md` if the diff touches backend code.
4. Check whether Swagger docs, activity log calls, tests, lint, and build were actually run.
5. Ask the user for clarification IF:
   * The target base branch is ambiguous (main vs. develop vs. release).
   * The diff spans multiple unrelated features — suggest splitting into separate PRs.
   * There is no issue number to link.

## Execution Workflow

### Step 1: Analyze the Branch
* List the commits and summarize the diff by area (backend / frontend / docs / infra).
* Note any endpoint, schema, or env-var changes.

### Step 2: Draft the PR Body
* Fill the template below with concrete, accurate detail — no placeholder text.
* Keep the Summary to one line; push detail into Changes.

### Step 3: Complete the Mandatory Checks Checklist
* Verify each item against the actual diff (Swagger annotations, `make swagger`, activity logs, secrets, tests, lint, build, docs).
* Leave unchecked items as `[ ]` — do NOT pre-check them.

### Step 4: Hand-Off
* Output the full PR body in a code block for copy-paste (or open the PR via `gh` if requested).
* If any mandatory item is unchecked, tell the user which checks still need attention before merge.

## Constraints & Guardrails
* **DO NOT** invent changes that aren't in the diff.
* **DO NOT** pre-check the mandatory checklist — it must reflect reality.
* **DO NOT** add a Screenshots section when there are no UI changes.
* Keep the Summary short; put the detail in Changes.

## Example Output Structure

## Summary
Add password reset flow for users who forgot their passwords.

## Changes
- New PasswordReset model and repository
- Two new API endpoints: `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`
- SendGrid email integration
- Rate limiting (3 requests/hour per email)

## Type
- [x] Feature
- [ ] Bugfix
- [ ] Refactor
- [ ] Test
- [ ] Documentation
- [ ] DevOps
- [ ] Hotfix

## Mandatory Checks
- [x] Code follows project conventions (`docs/DEVELOPMENT_PLAN.md`)
- [x] Swagger annotations added to all new/modified endpoints
- [x] `make swagger` runs without errors
- [x] `docs/swagger.json` updated and committed
- [x] Activity logs emitted for user actions (auth, CRUD, settings)
- [x] No hardcoded secrets, tokens, or passwords
- [x] No `fmt.Println` / `console.log` debug prints
- [x] Input validation on all endpoints
- [x] Auth middleware on protected routes
- [x] Tests added/updated
- [x] All tests pass (`make test` / `npm run test`)
- [x] Lint passes (`golangci-lint run` / `npm run lint`)
- [x] Build passes (`go build` / `npm run build`)
- [x] `API_CONTRACTS.md` updated (if endpoints changed)
- [x] `DATA_CATALOG.md` updated (if schema changed)

## Screenshots / Demo (if UI changes)
[Add screenshots here]

## Related Issues
Closes #123
