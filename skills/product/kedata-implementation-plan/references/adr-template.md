# ADR-#### — [Short decision title]

**Status:** Proposed | Accepted | Superseded by ADR-####
**Date:** YYYY-MM-DD
**Decision owner:** [name / role]
**Source:** IMPLEMENTATION_PLAN.md §[1|3|4] · PRD §[n]

## Context
What forces this decision now: the requirement, constraint, or risk. State the load-bearing facts a reader needs to judge the choice, with links to the artifacts (`docs/PRD.md`, `docs/IMPLEMENTATION_PLAN.md`).

## Decision
One sentence in the active voice: "We will …". Be specific enough that a later reader can tell whether it was followed.

## Why
The rationale, tied to the context. Name the constraint that wins if two options are otherwise close.

## Alternatives considered
| Option | Why not (or why deferred) |
|---|---|
| [option A] | [reason] |
| [option B] | [reason] |

## Consequences
- **Positive:** what this makes easy.
- **Negative / cost:** what it makes harder, and the accepted trade-off.
- **Triggers to revisit:** the condition under which this decision should be reopened (e.g., scale, team split, vendor change).

## Links
- Plan section that records it: `IMPLEMENTATION_PLAN.md §[n]`
- Related ADRs: Supersedes `ADR-####` · Superseded by `ADR-####`
- Contracts / code touched: `docs/API_CONTRACTS.md §[n]`, `docs/DATA_CATALOG.md §[n]`

## Guidance
- **One decision per ADR.** If the "Decision" paragraph needs "and", split it.
- **Append-only.** Never edit an accepted ADR's Decision/Why. A change of mind creates a new ADR that sets `Supersedes: ADR-####`, and the old one becomes `Superseded by ADR-####`.
- **Load-bearing only.** Write an ADR when the decision is expensive to reverse or easy to violate: topology (§1), deployment platform (§3), stack/data store/auth (§4). Routine choices stay in the plan's tables.
- **Number sequentially**, zero-padded to four digits: `ADR-0001`, `ADR-0002`, …
