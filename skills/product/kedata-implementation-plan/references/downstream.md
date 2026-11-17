## Downstream Consumers (why the implementation plan is the handoff)
| Plan Section | Feeds | Consumed By |
|--------------|-------|-------------|
| §1 Architecture Decision | Codebase topology, repo setup | Engineering kickoff — determines everything below |
| §2 Repo & Workspace Layout | Folder structure, monorepo config | Engineering setup |
| §3 Deployment Platform & Topology | Dockerfile vs docker-compose, services, regions, domains, CI/CD | DevOps / deployment — platform constraints shape the build |
| §4 Supporting Architecture | DB, auth, storage, testing strategy | Engineering (each stack); `kedata-test-plan` (the §4 testing strategy seeds the plan) |
| §5 Task Breakdown | What to build, in what order | Engineering backlog; review verification |
| §6 API Endpoints | `API_CONTRACTS.md` | Backend engineering; code review |
| §7 Data Model | `DATA_CATALOG.md` | Backend engineering |
| §8 Env Vars & Config | `ENVIRONMENT_VARIABLES.md`, `.env.example` | Engineering setup |
| §3 Deployment Platform & Topology | Dockerfile vs docker-compose, services, regions, domains, CI/CD | `kedata-deploy` — turns the decision into real infra + runbook |
| §9 Dependency Order & Milestones | Execution sequence | Engineering planning |
| §10 Definition of Done | Per-task completion bar | Engineering; code review |
| §11 Risks & Rollout | Rollout order, rollback | Deployment |
| §12 Sign-off status | Readiness gate | Engineering — a Draft plan must not start implementation |
