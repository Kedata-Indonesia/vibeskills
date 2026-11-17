## Interview Protocol (How to Grill)

**Rules of the interview — apply to every domain:**
1. **One domain at a time.** Ask 3-5 starter questions, wait for answers, then follow up. Never dump the whole questionnaire at once.
2. **Follow up until you hit bedrock.** A "bedrock" answer is specific, quantified, and decision-ready. "The team will figure it out" is not an answer — every task needs an owner, acceptance criteria, and priority.
3. **Force decisions, don't defer them.** The architecture decision (monolith vs split), the deployment platform (VM vs Cloud Run), the repo layout — these MUST be decided here, not left for engineering to improvise. If the user says "I don't know", present the trade-offs and recommend, then record the decision and its rationale.
4. **Extract, don't reinvent.** The PRD already answers features, API, data, milestones, env vars. Lift them into the plan — do not make the user repeat the product interview.
5. **Trace every task to its source.** Every task must map back to a PRD feature, endpoint, entity, or design-brief screen/component. Untraceable tasks are scope creep.
6. **Quantify everything.** Team size, effort estimates (S/M/L), order, milestone dates. Estimates beat absolutes.
7. **Surface the non-obvious.** Ask about deployment topology, platform constraints (statelessness, timeouts, background jobs), secrets, migrations, rollback, feature flags — things the user may not think to mention but engineering will need.
8. **Record as you go.** After each domain, write the agreed answers into the draft plan section immediately — never wait until the end.
9. **Don't over-grill.** Stop a domain when answers become repetitive or the user says "you decide" (→ record as Open Question in §12).
10. **End with the readback.** "I've locked monolith on Cloud Run, 14 tasks in 4 milestones, env vars X/Y/Z. Correct me if wrong."
