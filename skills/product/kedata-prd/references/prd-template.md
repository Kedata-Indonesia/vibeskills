# Example skeleton

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
Happy path diagrams + failure/edge paths; state transitions per entity (including illegal transitions).

## 7. Tech Stack
| Layer | Technology | Version | Confirmed |

## 8. Core Features (MVP / V1 / V2)
| # | Feature | For Whom / Solves What | Priority | BE | FE | Notes |

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
| PRD file location | `docs/PRD.md` (or root `PRD.md` if that's the existing convention) |

## 18. Edge Cases Register
The output of the Step 7 sweep — one row per (feature/entity, edge case). This is the seed for the test plan and the code review testing checks.

| Feature / Entity | Edge Case | Expected Behavior | Status |
|------------------|-----------|-------------------|--------|
| Submission form | Duplicate title submitted | Warn contributor, flag for moderator | Decided |
| Parent record delete | Record referenced by 3 related records | Block delete; show referencing records (or soft-delete + mark broken) | Open → Q7 |
| Edit (regular user) | Content changed since base revision | Prompt rebase: reload diff, apply onto latest | Decided |
