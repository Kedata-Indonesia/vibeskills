---
name: kedata-qa-automation
description: "Use this skill to automate QA for a Kedata project: build contract-valid test data from API_CONTRACTS.md and DATA_CATALOG.md, then run the TEST_PLAN.md scenarios as Playwright E2E and as ego-browser sessions for dogfooding, bug investigation, and logged-in flows. Trigger when the user says \"write the E2E tests\", \"automate QA\", \"dogfood this\", \"investigate this bug in the browser\", or \"generate test data\"."
version: 1.0.0
author: Kedata Indonesia
---

# Skill: Kedata QA Automation

## Purpose
Turn the approved test plan into **running checks**. `kedata-test-plan` says *what* must be true and traces every case to an artifact; this skill makes those cases executable in two ways:

1. **Playwright** — deterministic, headless, CI-gated E2E for the scenarios in `TEST_PLAN.md`.
2. **ego-browser** (ego-lite) — an interactive Chromium the agent drives through the user's real logged-in profile, for dogfooding, bug investigation, and any flow whose value is the real session rather than a repeatable assertion.

The differentiator is **data that matches the contract**. Generated test data is the commonest cause of a "failing" suite that is actually testing nothing: a field the catalog marks required is omitted, an enum gets a value it cannot hold, a foreign key points at a row that was never seeded. Every fixture this skill produces is derived from `DATA_CATALOG.md` and `API_CONTRACTS.md`, and a test that fails on its own data is a broken test, not a broken product.

## When to Use
* User command: `/kedata-qa-automation`
* Autonomous trigger: When the user says "write the E2E tests", "automate QA", "dogfood this", "investigate this bug in the browser", "the test data is wrong", or "generate fixtures". Run AFTER `kedata-test-plan` is approved and the feature under test is implemented.
* **Do NOT use** to decide *what* to test — that is `kedata-test-plan`. This skill consumes its cases; it does not invent scenarios.
* **Do NOT use** to review a diff — that is `kedata-review`. A QA run produces evidence a review can cite.

## Prerequisites & Context Gathering
Before writing a test or opening a browser, the agent MUST:
1. **Read `TEST_PLAN.md` (mandatory).** `docs/` first, then root. Extract: §3 the traceability matrix (which case proves which AC), §4 the cases (ID, preconditions, steps, input, expected result), §6 fixtures, §7 which suite runs where. **If missing, STOP** — there is nothing to automate; hand off to `/kedata-test-plan`.
2. **Read the contracts (mandatory for any data).** `API_CONTRACTS.md` — request and response shapes, required fields, enums, status codes. `DATA_CATALOG.md` — entity fields, types, nullability, uniqueness, foreign keys. A fixture that contradicts either is a bug in the fixture.
3. **Read `ENVIRONMENT_VARIABLES.md`.** Test environment config comes from it. Never hardcode a URL, port, or credential that the catalog already names.
4. **Read `DESIGN_BRIEF.md` §5 and §8 (for UI flows).** Screen paths and the empty, error, and loading states are what the E2E asserts against.
5. **Locate existing tests.** `tests/e2e/` (or the path the repo already uses). If a suite exists, extend it in place — never create a second E2E tree.
6. **Check the toolchain.** `npx playwright --version` for the scripted suite. `ego-browser skill` for the interactive one — if `ego-browser` is not on `PATH`, follow [its install guide](https://github.com/citrolabs/ego-lite/blob/main/skills/ego-browser/references/install.md) and stop until the user has installed ego lite. Do not fall back to driving the user's daily browser.

## Interview Protocol (How to Grill)
1. **One flow at a time.** Confirm which `TEST_PLAN.md` cases this run covers before writing any of them.
2. **Trace every test.** Each spec names the case ID it implements (`AC3`, `§18 #7`). A test with no case ID is either attached to one or deleted.
3. **Extract the data, don't invent it.** Field names, enums, and limits come from the catalog. Ask only when the catalog is silent.
4. **Decide the runner per case.** Repeatable and assertable → Playwright. Needs the user's real login, or is an investigation rather than a check → ego-browser. Say which and why.
5. **Name the evidence.** Every run must say where its log and screenshots land before it runs.

## Execution Workflow

### Step 1: Build Contract-Valid Test Data
**Goal:** fixtures that cannot drift from the catalog.
* For each entity the cases touch, derive a fixture set from `DATA_CATALOG.md`: one **valid**, one **boundary** (min/max length, zero, empty collection, last-item), one **invalid per constraint** (missing required field, bad enum, duplicate unique key, dangling foreign key).
* Cross-check every field against `API_CONTRACTS.md`: the fixture's shape must be a legal request body, and the invalid fixtures must be the ones that produce the contract's documented error statuses.
* Respect foreign keys: seed the referenced row first. A fixture whose parent does not exist is not a test, it is a setup bug.
* Auth fixtures per persona from `PRD.md` §4, so RBAC cases log in as the right role.
* **No real PII.** Use obviously fake values (`qa-user-001@example.test`). Never copy production data into a fixture.
* Put shared data in `tests/e2e/fixtures/` and reset state per test (transaction rollback or an isolated test database), so order never matters.
**Bedrock signal:** every fixture field traces to a catalog column, and every invalid fixture traces to a documented error status.

### Step 2: Write the Playwright Suite
**Goal:** the `TEST_PLAN.md` E2E cases, runnable in CI.
* One spec file per feature, named for the feature. Each test's title carries its case ID: `test('AC3: member sees only their own orders', ...)`.
* Drive the UI the way a user does — role selectors and labels, not CSS structure — so a restyle does not break the suite. `kedata-design-frontend` may change markup; the test should not care.
* Assert the **expected result from the case**, not a coincidence of the current UI: the status code or the visible outcome, the empty state from `DESIGN_BRIEF.md` §8, the 403 for the disallowed role.
* Cover the failure path the plan names (invalid input, permission denied, empty state), not only the happy path.
* Retries hide flakes; do not add retries to make a red test green. Fix the data or the wait.
**Bedrock signal:** every E2E case in the plan's smoke suite has a spec, and each spec names its case ID.

### Step 3: Run ego-browser for Session and Investigation Work
**Goal:** the flows Playwright cannot or should not own.
* Before any browser task, run `ego-browser skill` and follow its output. It prints the usage guide for the installed ego lite version. The guide ends with a line beginning `[ego-browser:skill] end of guide`; if that line is absent the output was truncated — save it to a file and read it in parts.
* Use it for: dogfooding a flow end to end in the user's real session, reproducing a reported bug against the logged-in app, and checking a fix live before the Playwright spec is written.
* Keep Playwright and ego-browser apart. Scripted assertions belong in Playwright, where CI can run them headless. ego-browser is for the session context Playwright does not have.
* When ego-browser reproduces a bug, capture the screenshot and the steps, then write the Playwright spec that fails on it. The investigation finds it; the spec keeps it fixed.
**Bedrock signal:** every ego-browser session ends with a note of what was checked and where its screenshot went.

### Step 4: Capture Evidence
**Goal:** output that `kedata-audit` and `kedata-review` can cite.
* Playwright: `playwright.config` sets `outputDir` to `test-results/` and retains screenshots and traces **on failure**. That directory is gitignored; CI uploads it as an artifact.
* ego-browser: save screenshots under `test-results/ego/` with the case ID or bug reference in the filename.
* Write a one-line-per-case result summary to `test-results/qa-report.md`: `case ID | runner | pass/fail | evidence path`. This is the file a review reads; do not make anyone re-run the suite to learn what happened.
* Never commit `test-results/`. Evidence lives in CI artifacts, not in git.
**Bedrock signal:** a failing run leaves a screenshot and a report row; a passing run leaves a report row.

### Step 5: Report
* State which plan cases ran, which runner each used, and the pass/fail count.
* For every failure: the case ID, the expected result from the plan, the actual result, and the evidence path. Say whether it looks like a product bug or a fixture bug, and why.
* Name the cases in the plan's smoke suite that this run did **not** cover.
* Hand off: product bugs go to the tracker (a review or `kedata-audit` can file them); a fixture that contradicts the catalog is fixed here, in this skill.

## Constraints & Guardrails
* **DO NOT** invent test data. Every field comes from `DATA_CATALOG.md` or `API_CONTRACTS.md`. Where they are silent, ask — do not guess a plausible value.
* **DO NOT** invent scenarios. Cases come from `TEST_PLAN.md`. A flow worth testing that has no case is a gap in the plan: flag it for `/kedata-test-plan`, do not smuggle it in here.
* **DO NOT** let a fixture contradict the contract to make a test pass. If the valid fixture is rejected, the product is wrong, not the fixture.
* **DO NOT** use real PII or production data in fixtures.
* **DO NOT** drive the user's everyday browser, and do not clear cookies, cache, or storage without reading ego-browser's clearing-state guidance first — some clears reach the whole profile.
* **DO NOT** retry a failing test to turn it green.
* **DO NOT** commit `test-results/` or any captured session data.
* **DO NOT** vendor ego-browser. It is a bootstrap skill that defers to the installed ego lite app (`ego-browser skill` prints the current guide), so vendoring it would only freeze a stale copy. Reference it: `npx skills add citrolabs/ego-lite`.

## Evidence a Consumer Can Trust
| Output | Where | Consumed by |
|--------|-------|-------------|
| Playwright specs | `tests/e2e/` | CI, `kedata-review` (does the diff keep the suite green) |
| Failure screenshots + traces | `test-results/` (gitignored, CI artifact) | `kedata-review`, `kedata-audit` |
| Run summary | `test-results/qa-report.md` | `kedata-review`, `kedata-audit` |
| ego-browser screenshots | `test-results/ego/` | bug investigation, dogfooding notes |
