# Document-Type Playbooks

Load the playbook that matches the deliverable.

## Tender / proposal (`[O]` — mirrors the buyer's template)
Required shape: understanding of the requirement → proposed solution → capability evidence → team and experience → timeline and milestones → price and commercial terms → risk and compliance.
- Page one answers "can they do this and at what price"; procurement scores before it reads prose.
- Every capability sentence carries proof: a project name, a client, a date, a measurable outcome.
- Mirror the buyer's section names and numbering. Never rename a required section.
- Price tables are exact: no ranges, no "starting from", no placeholders left in the submitted file.

## Report / laporan
Required shape: what was asked → what was done → what was found → what it means → what happens next.
- Findings carry evidence (measurement, screenshot, log line), then interpretation, then recommendation — in that order.
- Separate fact from judgement with explicit language: "measured 3.1s" versus "we judge this too slow for the target".
- Close with decisions needed and owners, not with a summary of the introduction.

## Documentation / README
- First screen: what this is, who it is for, how to run it, where to go next. Installation before architecture.
- Every command is copy-paste runnable and was actually run before being written down.
- State prerequisites and the failure mode when they are missing.

## Client email / cover letter
- First line states the purpose and the ask. No greeting paragraph before the point.
- One screen maximum; details live in the attachment the email names.
- Name the next action, the owner, and the date.

## Executive summary (any document)
- Written last, from the finished document, in ≤ 250 words.
- Contains: the decision required, the three supporting facts, the main risk. No new information.

## Release notes / changelog (`CHANGELOG.md`)
- Group by release, newest first; each entry is a user-visible change, not a commit list.
- Lead with what the reader can now do or must now do; put breaking changes and migration steps first of all.
- One line per change, imperative, no internal jargon; link the issue/PR so a skeptic can verify.
- Never rewrite a shipped release's notes — append the next release on top.

## Handover / onboarding document
- Reader is a new owner who has never seen the project: what it is, who it serves, how it runs, where to look next.
- Point to the sources of truth (`PRD.md`, `IMPLEMENTATION_PLAN.md`, `API_CONTRACTS.md`, `DEPLOYMENT.md`) rather than restating them.
- Include the run/operate path: environments, secrets location, deploy and rollback commands, known risks, and who to ask.
- State the open questions and the next milestone; an onboarding doc that hides the gaps is worse than none.
