# Example skeleton

# Implementation Plan: [Project Name] (KEP-123)

**Status:** Draft · **Version:** 0.1 · **Source PRD:** [PRD v1.0, docs/PRD.md] · **Source Brief:** [Design Brief v1.0, docs/DESIGN_BRIEF.md]

## 1. Architecture Decision
| Decision | Choice | Rationale | Split Trigger (if monolith) |
|----------|--------|-----------|------------------------------|
| Codebase topology | Monolith | 2 engineers, no mobile clients, single deploy | Mobile client / public API / >2 engineers / independent scaling |

**Decision record:** "Start monolith with a clean service layer (backend service, frontend app, shared contracts). Split only when a concrete trigger appears — migrating later is cheaper than two codebases from day one."

## 2. Repo & Workspace Layout
```
project-root/
├── backend/          # service layer
├── frontend/         # app
├── shared/           # types, contracts
└── docs/
```
Monorepo vs polyrepo: [monorepo — shared types, single CI].

## 3. Deployment Platform & Topology
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Platform | [VM + Docker Compose / Cloud Run / hybrid] | [why] |
| Constraint: statelessness | [No local FS — GCS for files] | [platform rule] |
| Constraint: background jobs | [Cloud Scheduler → endpoint / worker service / none] | [decided] |
| Constraint: request timeout | [Within Cloud Run 60m cap / VM no cap] | [decided] |
| Services | [1 (app) / app + worker] | — |
| Region | asia-southeast2 | Users in Indonesia |
| Domain | app.kedata.id | Cloudflare |
| CI/CD | [push → build → deploy / manual] | — |

## 4. Supporting Architecture
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend framework | Go + Gin | PRD §7 |
| Frontend framework | Nuxt 3 + TypeScript (strict) | PRD §7 |
| Database | MongoDB Atlas | PRD §7 |
| Migrations | [golang-migrate / prisma migrate] | — |
| Auth | JWT access 15m / refresh 7d | PRD §7 |
| File storage | GCS | PRD §12 |
| Secrets management | [Secret Manager / .env] | — |
| Caching | [Redis / CDN / ISR / none] | — |
| Background jobs | [worker / none — request-response only] | — |
| Feature flags | [flag library / env-based / none] | — |
| Testing | unit + integration + E2E | per task |

## 5. Task Breakdown
| # | Task | Owner | Effort | Priority | Milestone | Acceptance Criteria |
|---|------|-------|--------|----------|-----------|---------------------|
| 1 | [Auth: register/login/refresh] | BE | M | P0 | M1 | PRD §5 AC1-AC3 + Swagger docs |

## 6. API Endpoints (seeded from PRD §9)
| Endpoint | Method | Auth | Milestone | Notes |
|----------|--------|------|-----------|-------|
| `/api/v1/auth/login` | POST | No | M1 | — |

## 7. Data Model (seeded from PRD §10)
| Entity | Fields | Indexes | Milestone |
|--------|--------|---------|-----------|
| `users` | email, password_hash, role | email unique | M1 |

## 8. Env Vars & Config (from PRD §12)
| Var | Dev | Staging | Prod | Secret? |
|-----|-----|---------|------|---------|
| `MONGODB_URI` | `<local-db-uri>` | `<staging-db-uri>` | `<prod-db-uri>` | Yes |

## 9. Dependency Order & Milestones
```
M1: T1 (auth BE) → T2 (auth FE) → T3 (shared types)
M2: ...
```
**First-milestone DoD:** [all M1 tasks done, contract docs updated, deployable to staging].

## 10. Definition of Done
Per task: [ACs pass, tests added, docs updated, Swagger regenerated where backend]. Global: [all milestones shipped, staging verified].

## 11. Risks & Rollout
| Risk | Mitigation | Rollout |
|------|------------|---------|
| [Migration breaks data] | [Backup + down migrations] | [Phased: staging → canary → prod] |

## 12. Document Info & Sign-off
| Field | Value |
|-------|-------|
| Status | Draft / Approved |
| Version | 0.1 → 1.0 |
| Source PRD | [version + location] |
| Source Design Brief | [version + location] |
| Author / Owner | [Name] |
| Approver + date | [Name, date] |
| Open questions | Q1 … / Q2 … |
| File location | `docs/IMPLEMENTATION_PLAN.md` |
