---
name: kedata-writing
description: Use this skill to write, rewrite, or review any prose a Kedata project publishes — tender proposals, idea and design briefs, reports, documentation, READMEs, and client emails — in Indonesian or English, with every claim sourced or flagged, the house prose rules applied, and a measured pass before delivery. It owns the words; it does not re-interview product scope (kedata-prd owns the PRD) and it does not design screens. Trigger when the user says "write the proposal", "rapikan dokumen ini", "draft the report", "tulis dokumentasi", "translate this for the client", or hands over a document that must survive a skeptical reader.
version: 1.1.0
author: Kedata Indonesia
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - product
    - writing
---

# Skill: Kedata Writing — Documents That Hold Up

## Purpose
Produce prose a stranger can trust: a tender proposal, a brief, a report, a README, a client email. The skill owns **the words**, not the scope — `kedata-prd`, `kedata-design-brief`, and `kedata-implementation-plan` own the artifacts that decisions come from, and this skill reads them as facts.

Three failure modes this skill exists to prevent:

1. **Unsourced claims.** A number with no source, a capability with no proof, a citation that was never read. In a tender this loses the bid; in an internal report it corrupts the decision.
2. **AI-flavoured filler.** Sentences that sound finished but assert nothing — intensifiers, throat-clearing openers, closers that restate the introduction.
3. **Documents that answer the wrong question.** Fluent prose, correct grammar, and the reader still asks "so what?" because the document never decided what it was arguing.

The differentiator is **the frame before the draft and the measurement after it**. The agent grills the reader, the decision, and the evidence *before* writing a paragraph. It then counts sentences, paragraph lengths, and banned phrases *before* calling the draft done.

## When to Use
* User command: `/kedata-writing`
* Autonomous trigger: the user asks for a proposal, report, brief, documentation, README, cover letter, or executive summary. Also when the user asks for a rewrite or polish of one, or when a document must be translated between Indonesian and English for a client. Also when a draft exists and the user asks "apakah ini sudah bagus?" and wants a verdict rather than encouragement.
* Run it **after** the source artifacts exist (PRD, plan, contracts, test results) and **before** the document is sent to a client, a tender portal, or a reviewer.

## Scope Boundaries
| Need | Right skill |
| --- | --- |
| Decide what to build, personas, acceptance criteria | `kedata-prd` |
| Visual identity, tokens, screens | `kedata-design-brief` |
| Task breakdown, architecture, deployment platform | `kedata-implementation-plan` |
| API shapes and data catalog | `kedata-contracts` |
| Test cases and traceability | `kedata-test-plan` |
| Review a code diff | `kedata-review` |
| **Words: proposals, reports, docs, emails, translation** | **this skill** |

If the user asks this skill to change requirements, stop and route to `kedata-change`. Writing never silently redefines scope.

## Prerequisites & Context Gathering
Before writing anything, the agent MUST:

1. **Locate the existing document.** Check `docs/` first, then the repo root, then the path the user gave. If a version exists, **update it in place and bump its version line** — do not fork a second copy.
2. **Read the artifacts that carry the facts.** `docs/PRD.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/TEST_PLAN.md`, `README.md`, deploy notes, and any measurement output. Facts come from files, not from memory of an earlier conversation.
3. **Inventory the evidence you actually have.** Screenshots, live URLs, test results, commit history, metrics, certificates, team CVs. A claim you cannot support gets flagged, not invented.
4. **Confirm the deliverable's hard constraints**: page limit, font and margin rules, required section list, language, submission format (DOCX/PDF/portal field), and deadline. Tender documents are read by a checklist first — a missing required section scores zero regardless of prose quality.

## Instructions
Work in this order; the steps below expand each one.
1. **Frame** the reader, the decision, the thesis, the evidence, the length, and the language (Step 1).
2. **Build the evidence ledger** — every claim gets a source or an open-question flag (Step 2).
3. **Skeleton before prose** — section order and one assertion per section (Step 3).
4. **Draft in four passes**, never one (Step 4).
5. **Apply the house prose rules** (Step 5).
6. **Measure before delivering** with `scripts/prose-check.mjs` (Step 6).
7. **Review mode** when the user hands over an existing document (Step 7).
8. **Deliver and hand off**, then delete the frame comment (Step 8).

## Step 1: Frame the Document (grill before drafting)
One short round of questions, then write the frame down. Six answers are mandatory:

| # | Question | Why it decides the draft |
| --- | --- | --- |
| 1 | **Who reads it, and what decision do they make after reading?** | Sets register, depth, and what must be on page one |
| 2 | **What must be true in their head when they finish?** (one sentence) | This is the thesis; every section must serve it |
| 3 | **What do they already know and already believe?** | Prevents explaining the obvious and skipping the contested |
| 4 | **What is the length and format budget?** (pages, words, sections, template) | Length is a constraint, not a style preference |
| 5 | **Which language and which variant?** (ID formal, EN international, bilingual pair) | Term choice and number formatting follow from this |
| 6 | **What evidence can this document cite?** | Anything outside this list is an assumption or an open question |

Rules for the frame:
- Record it at the top of the working file inside an HTML comment (`<!-- frame: ... -->`) so it travels with the draft, and **delete the comment before delivery**.
- If answer 2 cannot be written in one sentence, the document is not ready to draft — grill until it can.
- If answer 4 conflicts with answer 2 (a 3-page limit for a 12-section argument), say so and propose what to cut. Do not quietly overrun the page limit; a tender that breaks the format is disqualified.

## Step 2: Build the Evidence Ledger
Before prose, build a ledger. Every number, capability, name, date, and certification in the document appears here first.

| Claim | Value | Source | Status |
| --- | --- | --- | --- |
| Implementation duration | 8 weeks | `docs/IMPLEMENTATION_PLAN.md` §13 (4 phases × 2 weeks) | verified |
| Concurrent users supported | 500 | load test 2026-11-12, `reports/loadtest.txt` | verified |
| Team has SIUP + NIB | yes | user statement, 2026-11-14 | verified (statement) |
| Client will provide hosting | assumed | no document | **assumption** |
| ISO 27001 certified | unknown | none | **open — do not claim** |

Status vocabulary, and nothing else:
- `verified` — traceable to a file, a measurement, or an explicit user statement (name the source).
- `assumption` — plausible, unconfirmed, and **visible in the draft as `[ASSUMPTION: what must be confirmed]`**.
- `open` — unknown. Never becomes a sentence; it becomes a question to the user.

**Hard rule:** a claim with no source does not enter the draft. Fabricating a statistic, citation, client reference, certification, or date is the one unrecoverable failure of this skill. It survives spell-check and reads well, then destroys the bid or the report's credibility when someone checks. When the source is missing, the move is always the same: ask, or mark `[ASSUMPTION]`, never invent.

## Step 3: Skeleton Before Prose
Write headings only, one line of intent under each, no sentences yet.

- **Headings sentence case**, max three levels. A fourth level means the argument is not yet organised.
- Each heading carries **one assertion**, not a topic. "Implementation runs in four two-week phases" beats "Implementation Timeline".
- Delete any section that does not serve the thesis from Step 1, even if it is interesting.
- For tender documents, mirror the required section order exactly and number the sections as the template does.
- Estimate the words per section against the page budget now. Sum the estimate; if it exceeds the budget, cut a section rather than compressing every section.

Present the skeleton and the word estimate to the user before drafting prose. A 30-second confirmation here prevents 300 lines of rework.

## Step 4: Four Passes, Never One
Drafting is sequential refinement, not typing. Do not fix wording while the structure is still moving.

1. **Pass 1 — Structure.** Headings and one-line intents. Confirm with the user.
2. **Pass 2 — Paragraphs.** One paragraph per claim. Order inside the paragraph: **claim → evidence → implication**. If a paragraph has two claims, split it.
3. **Pass 3 — Sentences.** One idea per sentence, active voice, actor named, verb carrying the meaning. Target average ≤ 22 words, hard cap 35.
4. **Pass 4 — Words.** Concrete nouns, cut adjectives, delete intensifiers, align terminology to the glossary.

Then measure (Step 6). Measuring earlier is wasted work.

## Step 5: House Prose Rules

| Rule | Standard | Why |
| --- | --- | --- |
| Paragraph | One claim, ≤ 120 words | A reader scanning a proposal reads first sentences only |
| Sentence | Average ≤ 22 words, hard cap 35 | Long sentences hide missing evidence |
| Voice | Active, actor named | "The system rejects invalid input" beats "invalid input is rejected" |
| Claim order | Claim → evidence → implication | The reader decides before the detail arrives |
| Numbers | Digits for all measurements; thousand separator `1.000` (ID) / `1,000` (EN); unit after a space (`8 minggu`, `500 MB`); currency explicit (`IDR 250.000.000`) | Ambiguity in numbers is the fastest way to look careless |
| Dates | `17 November 2026` in prose, ISO `2026-11-17` in machine-readable fields | Consistent, sortable, unambiguous |
| Terminology | One term per concept, listed in a glossary when the document exceeds ~1500 words | Synonyms read as sloppiness and create false distinctions |
| Lists | 3–7 items, parallel grammar, introduced by a colon and a sentence that earns the list | A 12-item list is a document hiding inside a sentence |
| Tables | Comparisons and parameters only, never prose | Tables are scanned; paragraphs are read |
| Headings | Sentence case, no trailing punctuation | House style, and it survives translation |
| Emphasis | Bold for the one thing the reader must not miss per section | If everything is bold, nothing is |
| Forbidden | Emoji, exclamation marks, rhetorical questions, scare quotes in client documents | They read as unserious in a tender or a board report |

### AI tells: what makes a document read as machine-written
A fluent draft can still fail the "written by a person" test. The list below comes from blader/humanizer (MIT) and Wikipedia's "Signs of AI writing", cut down to the patterns that survive in Kedata documents. The script enforces the first group; the second group is judgement.

**Hard gate (the script fails the file):**

| Pattern | Before | After |
| --- | --- | --- |
| Significance inflation | "The dashboard plays a crucial role in the transformation journey" | "The dashboard shows 12 indicators the board reviews monthly" |
| Weasel attribution | "Industry experts agree that adoption is rising" | "Adoption rose 22% between January and June (usage logs, `reports/usage.csv`)" |
| Filler and hedging | "It is important to note that in order to meet the deadline" | "To meet the deadline" |
| Signposting | "Let's dive into the implementation timeline" | "Implementation runs in four phases." |
| Chatbot artifacts | "I hope this helps. Let me know if you need anything else." | Delete both sentences |
| Copula avoidance | "The module serves as the single entry point" | "The module is the single entry point" |
| Negative parallelism | "It is not only faster but also cheaper" | "It is faster and cheaper" |
| Indonesian tells | "Di era digital ini, solusi kami sangat krusial bagi mitra" | "Solusi ini memotong waktu rekonsiliasi dari 3 hari menjadi 4 jam" |

**Judgement calls (warnings by default, failures under `--strict`):**

| Signal | Rule |
| --- | --- |
| AI vocabulary | claim, showcase, delve, intricate, tapestry, pivotal, robust, comprehensive, holistic, leverage, enhance, foster, garner, vibrant, profound |
| Soft connectives | furthermore, moreover, additionally, "selain itu," as a default opener |
| Intensifiers | very, really, highly, extremely, sangat, berbagai |
| Adjective where a number belongs | "memadai", "optimal", "cepat" — replace with the threshold the reader can check |
| Bold-label bullets | "**Speed:** the system is fast" — write a sentence instead |
| Em-dash density | more than 8 per 1000 words reads as machine rhythm |
| Curly quotes | straight quotes in source markdown; smart quotes come from the editor, not the author |

Repair, do not just delete: a removed claim leaves a gap. Ask what fact was meant to fill it, then write that fact.

Heading case is a human check, not a script check: headings in prose documents are sentence case, while SKILL.md files in this registry use title case by house convention.

## Step 6: Measure Before Delivering
Run the bundled checker on the finished file:

```bash
node scripts/prose-check.mjs docs/PROPOSAL.md            # internal draft: warnings only
node scripts/prose-check.mjs docs/PROPOSAL.md --strict   # client-facing: warnings fail
node scripts/prose-check.mjs docs/*.md --json
```

It reports words, sentences, average sentence length, sentences over the cap, paragraphs over the limit, banned phrases with line numbers, AI vocabulary, punctuation signals, and `[ASSUMPTION` markers still in the text. Exit code 1 means a gate failed — fix the text, not the thresholds.

Thresholds (override only with a written reason in the delivery note):
- average sentence ≤ 22 words
- no sentence > 35 words
- no paragraph > 120 words
- zero banned phrases
- zero unresolved `[ASSUMPTION` markers
- zero em-dash warnings in a client-facing file (run it with `--strict`)

Then run the human gates, which no script can do:
- [ ] Every number in the draft appears in the evidence ledger.
- [ ] Every `[ASSUMPTION]` is resolved, approved by the user, or removed.
- [ ] Read the first sentence of every paragraph aloud, in sequence — do they alone tell the story?
- [ ] **Skeptical-reader test:** name the three attacks a hostile reviewer would make (price, capability, risk) and confirm the document answers each where that reviewer will look.
- [ ] The document fits the page/format budget when rendered, not just in the word count. Render it.
- [ ] Language check: Indonesian is formal and consistent (`Anda`, not mixed `kamu`), English has no untranslated Indonesian terms except deliberate product names listed in the glossary.

## Step 7: Review Mode (existing document)
When the user hands over a document instead of asking for one, the deliverable is a **verdict**, not a rewrite.

Report as a table, worst first, and stop there:

| Location | Problem | Fix |
| --- | --- | --- |
| §3 p.2 | Claims "seamless integration" with no integration named | Name the systems and the protocol, or delete the sentence |
| §5 table | Duration 8 weeks contradicts §2's 12-week phase plan | Use the plan's figure and cite it |
| p.1 | Opens with market-size paragraph; the reader is a procurement officer scoring capability | Move capability evidence to page one |

Rules for review mode:
- Do not rewrite the document unless the user says "fix it" — silent rewrites destroy the author's ownership and hide the pattern of mistakes.
- Group findings by severity: **blocks credibility**, **blurs the argument**, **style**.
- Quote the offending text verbatim with its location, so the author can act without searching.
- If the same problem appears more than three times, report the pattern once with the count and one example.

## Step 8: Deliver and Hand Off
- Save to `docs/<DOCUMENT>.md` (or the path the user specified) with a version line: `Status: Draft · Version: 0.1 · Owner · Date`.
- Delivery note to the user: what the document argues, the three weakest points, every open question, and every assumption still standing.
- Approved documents get `Status: Approved`, version `1.0`, approver and date. Later edits bump the version and add a one-line change note — never edit an approved document silently.
- If the document lives in a repo and ships as a file (DOCX/PDF), also commit the source markdown so the next revision starts from text, not from a binary.

## Document-Type Playbooks
Pick the playbook for the deliverable — tender/proposal, report, documentation/README, client email, executive summary — from `references/document-type-playbooks.md` and apply its required shape.

## Bilingual Rules (ID ↔ EN)
- Write the document in the language of its **reader**, not the language of the requester.
- Do not translate word-for-word. Re-decide the sentence, keep the fact.
- Keep a glossary of terms that stay in English inside Indonesian documents (product names, protocol names, job titles where the industry uses English) and apply it consistently.
- Numbers, dates, and currency follow the reader's locale (Step 5), even when the source data uses another.
- When producing both versions, deliver them together and state which one is authoritative for the client.

## Constraints & Guardrails
* **DO NOT** invent a statistic, citation, certification, client name, date, or capability. Missing evidence becomes a question or an `[ASSUMPTION]`, never a sentence.
* **DO NOT** write prose before the frame (Step 1) and skeleton (Step 3) are settled with the user.
* **DO NOT** overrun a page or format limit — measure by rendering, and propose cuts instead of shrinking fonts.
* **DO NOT** rewrite a document when the user asked for a review.
* **DO NOT** edit an approved document in place without a version bump and a change note.
* **DO NOT** duplicate the same paragraph across sections with different wording to fill space.
* **DO NOT** use a banned phrase from Step 6, even once, in a client-facing document.
* **DO NOT** ship a client-facing document that fails `--strict`; a warning left in because "it reads fine" is still an AI tell.
* **DO NOT** delete a flagged sentence and leave the paragraph thinner. Replace it with the fact the sentence was standing in for.
* **DO NOT** ship with `[ASSUMPTION` markers unresolved or placeholders (`TBD`, `lorem`, `[name]`) in the delivered file.
* **DO NOT** claim compliance or certification the evidence ledger does not hold.
* **DO NOT** change scope to make the document stronger — route scope changes to `kedata-change` first.

## Examples
A delivered document reaches this shape — every bracket replaced with confirmed content, never shipped as a placeholder:

```
# [Document title — assertion, not topic]
Status: Draft · Version: 0.1 · Owner: [name] · 17 November 2026

## Glossary (documents over ~1500 words)
| Term | Meaning in this document |

## 1. [Section — one assertion]
Claim sentence. Evidence sentence with a source. Implication sentence.

| Parameter | Value | Source |

## 2. [Section]
- Parallel item
- Parallel item

## 3. Risk and open questions
| Risk | Impact | Mitigation | Owner |

## Appendix — Evidence ledger
| Claim | Value | Source | Status |
```

Before delivery, the file passes `node scripts/prose-check.mjs` with exit code 0 and every human gate in Step 6 is ticked.

## Limitations
- Owns prose only: it does not re-interview product scope or design screens — route those to `kedata-prd`, `kedata-design-brief`, or `kedata-change`.
- `scripts/prose-check.mjs` measures sentence/paragraph length and banned patterns; it cannot judge whether a claim is true or a document answers the right question — those stay human gates.
- Best-effort guidance: output quality depends on the source artifacts and evidence supplied; it cannot verify facts it was not given.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `prose-check.mjs` fails on length | Sentence or paragraph over the limit | Split the sentence or paragraph; keep the fact, cut the filler |
| Banned phrase still present | Draft passed before the gate ran | Re-run the gate; replace each flagged phrase with the concrete claim |
| Document answers the wrong question | Frame (Step 1) skipped | Re-run Step 1; write the one-sentence thesis, then re-skeleton |
| Placeholder shipped (`TBD`, `[name]`) | Delivery checklist not ticked | Resolve every open question or mark it `[ASSUMPTION]` before delivery |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via `/kedata-writing` |
