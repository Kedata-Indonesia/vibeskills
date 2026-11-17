## Downstream Consumers (why the PRD is the first source)
| PRD Section | Feeds | Consumed By |
|-------------|-------|-------------|
| §5 User Stories & Acceptance Criteria | Verification criteria | Implementation planning; `kedata-test-plan` (each AC → ≥1 test case); code review (testing/acceptance) |
| §4 Personas & Roles | Auth + RBAC design | Backend & frontend engineering; `kedata-test-plan` (RBAC matrix) |
| §7 Tech Stack | Architecture decisions | Backend & frontend engineering |
| §8 Core Features | Implementation plan | Implementation planning |
| §9 API Overview | `docs/API_CONTRACTS.md` | Backend engineering; code review |
| §10 Data Model | `docs/DATA_CATALOG.md` | Backend engineering |
| §11 NFRs | Performance/security targets | Backend engineering; code review |
| §12 Integrations & Env Vars | `ENVIRONMENT_VARIABLES.md`, `.env.example` | Backend engineering; project setup |
| **§18 Edge Cases register** | **Test plan seed, boundary/negative test cases** | **`kedata-test-plan` (§3 traceability matrix); code review (testing checks); QA** |
| §16 Decisions Record | Future change requests | All downstream work — prevents re-litigating settled decisions |
| §17 Sign-off status | Readiness gate | All downstream work — a Draft PRD must never be implemented |
