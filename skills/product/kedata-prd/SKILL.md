---
name: kedata-prd
description: Use this skill to draft a Product Requirements Document in Kedata's house format — the source of truth that feeds the implementation plan, API contracts, data model, review, and PR skills. Trigger when the user says "draft a PRD", "write a product spec", or starts a new product / feature without a PRD on file.
version: 1.1.0
author: Kedata Indonesia
---

# Skill: Kedata PRD Writer

## Purpose
Produce a Product Requirements Document in Kedata's house format. The PRD is the **first and primary source of truth** for the entire delivery pipeline: it defines what will be built, for whom, why, and what "done" means — before any code exists. Downstream skills consume it directly: `kedata-system` (implementation baseline), `kedata-backend` / `kedata-frontend` (stack standards), `kedata-review` (verification criteria), and `kedata-pr` (PR description). A weak PRD propagates weakness everywhere; this skill exists so that never happens.

## When to Use
* User command: `/kedata-prd`
* Autonomous trigger: When starting a new product or feature without a PRD on file; when the user says "draft a PRD", "write a product spec", or asks to define requirements before implementation. Run BEFORE writing code, before designing API contracts, and before the implementation plan.

## Prerequisites & Context Gathering
Before drafting, the agent MUST gather context:
1. **Locate existing artifacts:**
   * Existing PRD: check `docs/PRD.md` first, then root `PRD.md`. If one exists, update it — do not rewrite from scratch.
   * Issue / task description: read the full issue, note its key/number (e.g. `KEP-123`), and copy its acceptance criteria if any.
   * Reference docs: `docs/DEVELOPMENT_PLAN.md`, `docs/API_CONTRACTS.md`, `docs/DATA_CATALOG.md`, `ENVIRONMENT_VARIABLES.md` — reuse existing conventions instead of inventing new ones.
2. **Identify stakeholders and metrics:** who is the target user, what problem are we solving, and how will success be measured (SMART metric).
3. Ask the user for clarification IF:
   * The target users or the problem being solved are unclear.
   * The success metric is undefined or not measurable.
   * There are design/mockups (Figma) that should be linked.
   * The intended scope (MVP vs V1 vs V2) is ambiguous.
   * The tech stack conflicts with the repo's existing conventions.

## Execution Workflow

### Step 1: Discovery & Analysis
* Interview the user (or read the issue/task) to fill the Overview table: What / Who / Why / Success Metric.
* Write user stories in the `As a [user], I want [feature], so that [benefit]` format — **each story must carry acceptance criteria** (checkbox list defining "done" for that story).
* Map user flows from start to finish; note wireframe/Figma links or describe key screens.

### Step 2: Interactive Grilling / Drafting
* **Confirm the tech stack row by row.** Use Kedata defaults unless the user overrides them: Backend Go + Gin, Frontend Nuxt 3 + TypeScript, Database MongoDB Atlas, Auth JWT (access 15m / refresh 7d), Deployment GCP Cloud Run (asia-southeast2) + Cloudflare. Record the chosen stack in §4 — it is the tiebreaker that resolves conflicts between `kedata-system` and `kedata-backend` conventions.
* Break features into MVP (P0), V1 (P1), and V2 (P2) with priority, BE/FE flags, and notes.
* Draft the API overview (§6) and data model (§7) BEFORE endpoints are coded — these two sections are the seed for `docs/API_CONTRACTS.md` and `docs/DATA_CATALOG.md`.
* Fill non-functional requirements, third-party integrations with env vars, milestones, out-of-scope, and risks & mitigations.

### Step 3: Artifact Generation
* Fill every section of the template below — no empty placeholders. If a section doesn't apply, write "N/A" with a one-line reason.
* Save the output to: **`docs/PRD.md`** (preferred — this is what `kedata-backend` reads). If the repo has no `docs/` directory, save to root `PRD.md` and note the location in the Document Info section.
* Set §14 Document Info: status `Draft`, version `0.1`, issue key(s), owner.

### Step 4: Verification & Sign-Off
Run the PRD self-check — all of these MUST pass before presenting:
- [ ] All 14 sections filled (or explicitly "N/A" with reason)
- [ ] Every user story has acceptance criteria
- [ ] Every feature row in §5 maps to an API endpoint in §6 and a collection/table in §7 (no orphans)
- [ ] Every API endpoint has: method, path under `/api/v1/`, auth flag, description
- [ ] Every collection/table has indexed fields defined
- [ ] Every env var referenced anywhere appears in §9 (or the §4 stack rows)
- [ ] Response envelope convention noted in §6: `{ "data": {}, "message": "", "error": "" }`
- [ ] §4 tech stack is fully confirmed by the user (no unconfirmed defaults silently assumed)

Present the PRD to the user. **Do not proceed to implementation until the user approves it.** On approval, update §14: status `Approved`, version `1.0`, approver + date.
Hand off: "PRD approved. Next: run `/kedata-system`, then `/kedata-backend` or `/kedata-frontend` to implement."

## Downstream Consumers (why the PRD is the first source)
| PRD Section | Feeds | Consumed By |
|-------------|-------|-------------|
| §2 User Stories & Acceptance Criteria | Verification criteria | `kedata-system` (task understanding), `kedata-review` (testing/acceptance) |
| §4 Tech Stack | Architecture decisions | `kedata-backend`, `kedata-frontend`, `kedata-system` |
| §5 Core Features | Implementation plan | `kedata-system` (planning mode) |
| §6 API Overview | `docs/API_CONTRACTS.md` | `kedata-backend`, `kedata-review` |
| §7 Data Model | `docs/DATA_CATALOG.md` | `kedata-backend` |
| §9 Integrations & Env Vars | `ENVIRONMENT_VARIABLES.md`, `.env.example` | `kedata-backend`, `kedata-system` |
| §14 Sign-off status | Readiness gate | All downstream skills — Draft PRD must never be implemented |

## Constraints & Guardrails
* **DO NOT** write code, design API contracts, or start the implementation plan while the PRD status is `Draft` — the PRD is a requirements artifact and must be approved first.
* **DO NOT** leave template sections empty; state "N/A" with a reason.
* **DO NOT** invent a tech stack, acceptance criteria, or success metrics — confirm each with the user.
* **DO NOT** let the code drift from the PRD: if scope changes during implementation, update the PRD FIRST, then the implementation plan.
* **DO NOT** rewrite an existing PRD from scratch — update it and bump the version.
* **DO NOT** use free-form prose where a table works — the PRD must stay scannable (tables, bullets, explicit priorities).
* **DO NOT** renumber the 14 sections — the numbering is a stable contract that downstream references depend on.

## Example Output Structure
A fully-filled, realistic example (compact). Use this as the quality bar:

# PRD: Registration Verification Portal (KEP-123)

**Status:** Draft · **Version:** 0.1 · **Owner:** Product · **Issue:** [KEP-123](https://jira.kedata.id/browse/KEP-123)

## 1. Overview
| Item | Detail |
|------|--------|
| **What** | A portal for legal drafters to submit and track registration verifications |
| **Who** | Legal drafters at BK DPR RI (≈ 250 users); admins at Kedata |
| **Why** | Manual email-based verification causes 2-3 day delays and lost requests |
| **Success Metric** | Verification turnaround < 24h; ≥ 90% of submissions tracked online by week 4 |

## 2. User Stories & Acceptance Criteria
- [ ] As a **registered user**, I want to **submit a registration**, so that I can get it verified without emailing admins
  - [ ] AC1: Form validates all required fields (NIK, document type, file upload ≤ 10MB)
  - [ ] AC2: Submission status is `diajukan` on creation and visible in the list
  - [ ] AC3: Admin receives an in-app notification within 5 minutes
- [ ] As an **admin**, I want to **verify or reject registrations**, so that only valid submissions pass
  - [ ] AC1: Admin sees the document preview and changes the status to `diverifikasi` / `ditolak` with a reason
  - [ ] AC2: Status change is recorded in the activity log (resource:update)
  - [ ] AC3: The submitter is notified of the outcome

## 3. User Flows & Design
```
[Login] → [Dashboard] → [Registrations] → [Submit / Detail]
     ↓                          ↓
[Verify] ← [Admin Inbox] ← [Reject with reason]
```
**Design:** Figma link `https://figma.com/file/xxxxx` (or describe key screens: dashboard stats cards, submission form, verification detail page).

## 4. Tech Stack
| Layer | Technology | Version | Confirmed |
|-------|-----------|---------|-----------|
| Backend | Go + Gin | 1.25 | ✅ |
| Frontend | Nuxt 3 + TypeScript (strict) | 3.x | ✅ |
| Mobile | None (N/A) | — | ✅ |
| Database | MongoDB Atlas | 7.0 | ✅ |
| Auth | JWT (access 15m / refresh 7d) | — | ✅ |
| Deployment | GCP Cloud Run (asia-southeast2) + Cloudflare | — | ✅ |
| File Storage | GCS | — | ✅ |
| Email | SendGrid | — | ✅ |
| AI/ML | None (N/A) | — | ✅ |

## 5. Core Features
### MVP (Must Have)
| # | Feature | Priority | BE | FE | Notes |
|---|---------|----------|----|----|-------|
| 1 | Auth (register, login, refresh) | P0 | ✅ | ✅ | Email + Google OAuth |
| 2 | Registration CRUD + status flow | P0 | ✅ | ✅ | `diajukan` → `diverifikasi` / `ditolak` |
| 3 | Admin verification inbox | P0 | ✅ | ✅ | List, preview, approve/reject |

### V1 (Should Have)
| # | Feature | Priority | BE | FE | Notes |
|---|---------|----------|----|----|-------|
| 4 | Export registrations to PDF | P1 | ✅ | ✅ | — |

### V2 (Nice to Have)
| # | Feature | Priority | BE | FE | Notes |
|---|---------|----------|----|----|-------|
| 5 | AI document-sanity check | P2 | ✅ | ✅ | Flagged off by default (`VITE_ENABLE_AI_REKOMENDASI=false`) |

## 6. API Overview
Response envelope: `{ "data": {}, "message": "", "error": "" }` — all endpoints under base path `/api/v1/`.

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/auth/register` | POST | No | Create account |
| `/api/v1/auth/login` | POST | No | Login |
| `/api/v1/auth/refresh` | POST | No | Refresh token |
| `/api/v1/auth/me` | GET | Yes | Current user |
| `/api/v1/registrations` | GET | Yes | List registrations (paged) |
| `/api/v1/registrations` | POST | Yes | Submit registration |
| `/api/v1/registrations/:id` | GET | Yes | Get registration |
| `/api/v1/registrations/:id/verify` | POST | Yes (admin) | Verify |
| `/api/v1/registrations/:id/reject` | POST | Yes (admin) | Reject with reason |
| `/api/v1/admin/activity-logs` | GET | Yes (admin) | Audit trail |

## 7. Data Model
*(Use "Collection" for MongoDB, "Table" for SQL — match §4.)*

### Collection: `users`
| Field | Type | Required | Indexed | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Yes | Primary | User ID |
| `email` | string | Yes | Unique | User email |
| `password_hash` | string | Yes | No | Bcrypt (cost ≥ 12) |
| `role` | enum | Yes | No | `admin`, `user` |
| `created_at` / `updated_at` | Date | Yes | No | Timestamps |

### Collection: `registrations`
| Field | Type | Required | Indexed | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Yes | Primary | Registration ID |
| `user_id` | ObjectId | Yes | Compound | Submitter (ref users) |
| `status` | enum | Yes | Yes | `diajukan`, `diverifikasi`, `ditolak` |
| `document_url` | string | Yes | No | GCS object URL |
| `rejection_reason` | string | No | No | Required when `ditolak` |
| `created_at` | Date | Yes | No | Submission date |

**Indexes:** `{ user_id: 1, created_at: -1 }` (list user's submissions), `{ status: 1 }` (admin inbox filter).

## 8. Non-Functional Requirements
| Requirement | Target |
|-------------|--------|
| API response time | < 200ms (p95) |
| Page load time | < 1s (FCP) |
| Uptime | 99.9% |
| Dark theme | Default |
| Mobile responsive | Yes (375px+) |
| Accessibility | WCAG 2.1 AA |
| Upload limit | ≤ 10MB per document |

## 9. Third-Party Integrations & Env Vars
| Service | Purpose | Env Vars |
|---------|---------|----------|
| Google OAuth | Social login | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| SendGrid | Transactional emails | `SENDGRID_API_KEY` |
| MongoDB Atlas | Database | `MONGODB_URI` |
| GCS | Document storage | `GCS_BUCKET`, `GCS_CREDENTIALS` |
| Cloudflare | DNS + SSL | — |
| GCP Cloud Run | Deployment | `PROJECT_ID`, `REGION` |

*All env vars above must later land in `ENVIRONMENT_VARIABLES.md` and `.env.example` (see `kedata-system`).*

## 10. Milestones & Timeline
| Phase | Features | Target | Deliverable |
|-------|----------|--------|-------------|
| Week 1 | PRD + Design + DB schema | Day 7 | Approved PRD, Figma wireframes |
| Week 2 | MVP Backend | Day 14 | Auth + registration APIs with Swagger |
| Week 3 | MVP Frontend | Day 21 | Login + dashboard + submission UI |
| Week 4 | Integration + QA | Day 28 | Deployed to staging |

## 11. Out of Scope
- Mobile app (tracked separately in KEP-456)
- Payment / billing
- Bulk import of registrations
- Public (non-authenticated) submission

## 12. Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| OAuth redirect issues | High | Medium | Test on staging with real domains |
| Large file uploads slow the API | Medium | Medium | Direct-to-GCS upload; size limit |
| Scope creep on verification rules | High | High | Strict MVP gate (§5, §11) |

## 13. Open Questions & Assumptions
- **Q1:** Should rejected registrations be editable and resubmittable? *(assumed yes, pending product answer)*
- **Q2:** Notification channel: in-app only, or also email? *(assumed in-app only for MVP)*
- **A1:** Admin count ≤ 10, no admin RBAC beyond a single `admin` role.

## 14. Document Info & Sign-off
| Field | Value |
|-------|-------|
| Status | Draft / Approved |
| Version | 0.1 → 1.0 |
| Author / Owner | [Name] |
| Issue key(s) | KEP-123 |
| Approver + date | [Name, date] |
| PRD file location | `docs/PRD.md` |
