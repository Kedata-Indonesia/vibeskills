# House Prose Rules

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

## AI tells: what makes a document read as machine-written
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
