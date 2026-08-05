---
name: kedata-prd
description: Use this skill to draft a Product Requirements Document in Kedata's house format. Trigger when the user says "draft a PRD", "write a product spec", or starts a new product / feature without a PRD on file. Output should fill the template sections rather than free-form prose.
version: 1.0.0
author: Kedata Indonesia
---

# Skill: Kedata PRD Writer

## Purpose
Produce a Product Requirements Document in Kedata's house format — a single source of truth that the AI and the team use as the blueprint for implementation. The PRD captures the what, who, why, user stories, flows, tech stack, features, API overview, data model, non-functional requirements, integrations, milestones, and risks BEFORE any code is written.

## When to Use
* User command: `/kedata-prd`
* Autonomous trigger: When starting a new product or feature without a PRD on file; when the user says "draft a PRD", "write a product spec", or asks to define requirements before implementation.

## Prerequisites & Context Gathering
Before drafting, the agent MUST gather context:
1. Check for an existing PRD (`PRD.md` or `docs/PRD.md`) — if one exists, update it rather than rewriting.
2. Check `docs/DEVELOPMENT_PLAN.md`, `docs/API_CONTRACTS.md`, `docs/DATA_CATALOG.md` for existing conventions to reference.
3. Ask the user for clarification IF:
   * The target users and the problem being solved are unclear.
   * The success metric is undefined.
   * There are design/mockups (Figma) that should be linked.
   * The intended scope (MVP vs V1 vs V2) is ambiguous.

## Execution Workflow

### Step 1: Discovery & Analysis
* Interview the user (or read the issue/task) to fill the Overview table: What / Who / Why / Success Metric.
* Write user stories in the `As a [user], I want [feature], so that [benefit]` format.
* Map user flows from start to finish and note wireframe/Figma links.

### Step 2: Interactive Grilling / Drafting
* Confirm the tech stack row by row (backend, frontend, mobile, database, auth, deployment, file storage, email, AI/ML).
* Break features into MVP (P0), V1 (P1), and V2 (P2) with priority, BE/FE flags, and notes.
* Draft the API overview (endpoint, method, auth, description) and data model (collection, field, type, required, indexed, description) BEFORE endpoints are coded.
* Fill non-functional requirements, third-party integrations (with env vars), milestones, and risks & mitigations.

### Step 3: Artifact Generation
* Fill every section of the template below — no empty placeholders.
* Save the output to: `PRD.md` (or `docs/PRD.md` if the repo uses a `docs/` convention).

### Step 4: Verification & Hand-Off
* Validate that all 11 template sections are filled and consistent (features match API overview, data model matches features).
* Hand off with the immediate next step: "Review the PRD, then I can draft the implementation plan or begin the backend skeleton."

## Constraints & Guardrails
* **DO NOT** write code while drafting the PRD — the PRD is a requirements artifact, not an implementation.
* **DO NOT** leave template sections empty; if a section doesn't apply, state "N/A" with a reason.
* **DO NOT** invent a tech stack — confirm each layer with the user.
* Keep the document scannable: tables, short bullets, and explicit priorities over prose.

## Example Output Structure

# PRD: [Project Name]

## 1. Overview
| Item | Detail |
|------|--------|
| **What** | One-sentence description of the app |
| **Who** | Target users (e.g., "legal drafters at BK DPR RI") |
| **Why** | Problem being solved |
| **Success Metric** | How do we know this is working? |

## 2. User Stories
- [ ] As a **registered user**, I want to **reset my password via email**, so that I can regain access if I forget it

## 3. User Flows
```
[Login Page] → [Dashboard] → [Project List] → [Project Detail]
```
Wireframe / Design: Figma link or key-screen descriptions

## 4. Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | [Go/Gin, Python/FastAPI, Node/Express] | |
| Frontend | [Nuxt 3, Next.js, React/Vite] | |

## 5. Core Features
### MVP (Must Have)
| # | Feature | Priority | BE | FE | Notes |

### V1 (Should Have) / V2 (Nice to Have)

## 6. API Overview
| Endpoint | Method | Auth | Description |

## 7. Data Model
### Collection: `users`
| Field | Type | Required | Indexed | Description |

**Indexes:** `{ owner_id: 1, created_at: -1 }` — for listing user's projects

## 8. Non-Functional Requirements
| Requirement | Target |

## 9. Third-Party Integrations
| Service | Purpose | Env Vars |

## 10. Milestones & Timeline
| Phase | Features | Target | Deliverable |

## 11. Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
