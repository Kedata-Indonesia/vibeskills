---
name: kedata-design-frontend
description: "Use when building or reviewing public pages or app screens from DESIGN_BRIEF.md with anti-slop art direction. Do NOT use for backend work."
version: 2.1.0
author: Kedata Indonesia (adapted from Leonxlnx / tasteskill.dev, MIT)
metadata:
  author: Kedata Indonesia <infra@kedata.online>
  tags:
    - design
    - frontend
---

# Kedata Design Frontend

A page built by a model usually looks like the average of every page the model has seen: a centred
headline over three lines, a little label above it, a row of icon cards, a soft gradient, a few thin
rules and a monospace caption. Nothing in it is wrong and nothing in it was decided.

This skill replaces those defaults with decisions, in four ways:

1. **A script deals the directions, you choose among them.** Asked to invent a look, a model picks
   the category default every time. `scripts/draw.mjs` deals three of twenty researched directions;
   you choose the one that carries the subject's idea, and the script then deals its type system,
   palette, hero and section compositions from a library distilled from 247 real sites.
2. **The idea comes from the subject.** In the study, what separated the best sites from the forgettable
   ones was a concept taken from the thing itself, not the styling.
3. **A house style with no ornaments,** measured in a real browser by `scripts/inspect.mjs`, so the
   rules are checked rather than hoped for.
4. **You look at what you made.** Screenshots at three widths, a juror's rubric, fix, look again.

One warning learned in testing. Taking the ornaments away is only half the job; a page that has lost its
labels, rules and cards and gained nothing in their place reads as thin, and blind jurors rightly prefer
a richer page with tells over an empty page without them. The other half is substance: type set
larger, whole fields of colour, real pictures of this subject's world (found or drawn), and every
section carrying its full content. The skill is built to give you that; do not trade it for restraint.

In the commands below `<skill>` is this skill's folder. Run them from the project's root, so the
working files land in `.taste-skill/` there. The scripts need Node 22+ and an installed Chrome, Edge
or Chromium, and install nothing. `assets.mjs` also needs network access; it uses no API keys.

## Purpose

Provide Kedata's frontend design craft — art direction, layout, typography, motion, and anti-slop UI — built on the approved `DESIGN_BRIEF.md`, with the taste-skill gate.

## When to Use
* User command: `/kedata-design-frontend`
* When the user says "build the UI", "design the page", "make it look designed", "this looks generic", or when `DESIGN_BRIEF.md` is approved and the visuals are next. Also for app screens: dashboards, admin, settings, inboxes.

## Kedata context: the brief is the contract, this skill is the craft

This is the **visual-craft layer** of the Kedata pipeline. On a Kedata project it runs after
`/kedata-design-brief` and before `/kedata-frontend-react` or `/kedata-frontend-nuxt`.

| Artifact | Role here |
| --- | --- |
| `docs/DESIGN_BRIEF.md` (or root `DESIGN_BRIEF.md`) | **The contract.** Brand personality, tokens (§3), breakpoints (§4), screens (§5), components (§6), states (§8), layouts (§9), dark mode (§10), deliverables (§11). An approved brief wins every conflict. |
| `docs/PRD.md` | What the page must say. Read it for content, never re-invent product facts. |
| `docs/IMPLEMENTATION_PLAN.md` | Stack, routing and task scope. Use the stack it locked; do not migrate frameworks here. |
| This skill | The art direction, the house rules, the gate, and the look-and-fix loop. |

**Read the brief first (mandatory).** Check `docs/DESIGN_BRIEF.md`, then root `DESIGN_BRIEF.md`.
- If it exists and is `Approved`: take the palette, typefaces and screen list from it, and pass
  `--keep palette,type` to the draw so the dealt direction never overrides approved brand values.
- If it exists but is `Draft`: say so once, proceed, and list every design decision you made that
  the brief has not yet signed off in your final report.
- If it does not exist: build from the PRD and tell the user a design brief is missing (offer
  `/kedata-design-brief` before the UI ships). Never silently invent a brand.

**Precedence.** Where a rule below contradicts the approved brief, the **brief wins** — record the
deviation in your report and, if the brand mandates a banned device (its logo sits in a gradient,
its accent is violet), keep the brand asset, say so, and pass `--allow <rule>` to the inspector for
that rule only. Where the brief is silent, this skill decides.

**Output of this stage.** The implemented UI, plus the run's report (direction dealt, idea sentence,
live thing, inspector scores, picture credits, sample content to confirm). Hand off to
`/kedata-frontend-react` · `/kedata-frontend-nuxt` for production wiring, then `/kedata-review`.

## Page or app screen

Decide first which of two kinds of work this is.

- **A page** is read and scrolled: a landing page, a marketing or product site, a portfolio, an
  event, a restaurant, a one-pager. It follows **the run** below.
- **An app screen** is worked in: a dashboard, an admin or analytics view, settings, billing, an inbox
  or queue to work through, a wallet, a list with filters, an editor or builder. It follows
  **`references/app-screens.md`**: its own run, its own draw (`draw.mjs --app`), its own house rules
  (quiet borders, small labels and repeated panels are normal there; gradients, glows, icons in tinted
  squares, rainbow charts and invented vanity numbers are not) and `inspect.mjs --app`. Read that file
  whole before you start; the page run below does not apply.

A product site that shows its app is a page; the interface fragments on it follow the app-screen
rules for their insides. Deal the product's app style once, in its own folder, with the page's colours
and type kept:

```bash
node <skill>/scripts/draw.mjs --app --kind <kind> --brief "<the product>" --keep palette,type --out .taste-skill/app
```

and build every fragment the page shows (the hero's live screen, a feature's crop, a chart) as a real
piece of that app: `assets/app.css` for its panels, tables and controls, `assets/charts.js` for its
charts, real data that adds up, one finding stated, cropped and scaled the way the page's blueprint
treats a picture. A fragment that looks like a working product is the strongest picture a software page
has; grey bars and lorem numbers are the weakest. When a request mixes both (a landing page and the
dashboard behind it), build each with its own run and one shared palette and typeface.


## House rules

These hold on every build, whatever the direction. `inspect.mjs` measures them.

| Rule | Instead |
| --- | --- |
| **Headlines: two lines or fewer, at every width.** Every `h1`–`h6`, and the main line of the first screen whatever its tag. | Cut words. Then widen the measure. Size last. |
| **A clear title on the first screen**, in the page's one `h1`, and a heading on every section. | Say what this is: the name with what it does, the product with what it is for, the event with its date and place. |
| **Equal outer margins; no section huddled on one side** with the other half of the screen empty. | Close every void with something on its far side: the section's picture, a second column, a list, a figure. |
| **No blank stretches** taller than about half a screen. | The normal section gap. A deliberate rest is a placed picture or a field of colour, once per page. |
| **Statements are paragraphs.** An intro sentence or a quotation set large is marked up as `<p>` or `<blockquote>`, stays at statement size (36px or less on desktop, 24px on a phone) and runs to about 25 words, three lines. | Larger than that it is a headline and the two-line rule applies. In blind tests jurors read a 42px sentence over four lines as a four-line headline. |
| **No eyebrows.** No small label above a heading, no pill badge above the headline, no "New ·" chip. | Put the information in the heading or the first sentence, or drop it. |
| **No monospace** outside real code blocks. | The text face. Tabular figures where numbers align. |
| **No index numbering.** No 01 / 02 / 03, no (001), no "Step 2". | Order shown by position, size, or the words. A real `<ol>` if order matters. |
| **No thin rules.** No hairline dividers, no 1px outlined boxes, no grid lines, crosshairs or crop marks. | Space. A step in background tone. A change of scale. A filled shape. |
| **No gradients.** Not as backgrounds, not on buttons, not in text. | Flat colour, or a real photograph. A neutral scrim under text on a photo is the one exception. |
| **No shadows on things at rest.** No glows. | A tone step between surfaces. Shadows only on what truly floats: a menu, a dialog. |
| **No assistant palette.** No yellow-cream ground with terracotta or rust; no violet or indigo. | The dealt palette. |
| **No tiny uppercase letter-spaced labels.** | Sentence case at a readable size. |
| **No icon-topped feature cards, no rows of identical cards.** | The dealt section blueprint. |
| **No glass.** No backdrop blur panels, no floating pill navigation. | A plain bar: wordmark, a few links, one action. |
| **No emoji, no gradient blobs, no decorative shapes, no fake dashboards of grey bars.** | A real picture, a real interface fragment, or nothing. |
| **No styled accent word** in a headline (italic, serif, coloured, underlined). | One face, one colour. The words carry the emphasis. |
| **Two typefaces at most,** usually one. | The dealt type system. |

Three places keep their own conventions and are left alone by the inspector: real code in
`<pre>`/`<code>` (monospace is correct there), real tables and form fields (they may have lines), and
a real interface fragment whose root carries the attribute `data-ui` (the product's own borders and
menus; see `references/imagery.md` §7).

Why these, honestly. Some are what the study measured: among the 247 sites, those the panel scored
7.5 or higher used icon feature cards 1% of the time against 28% for sites under 6.5, pill badges 14%
against 34%, gradients 22% against 52%, shadows 24% against 48%, tiny tracked caps 16% against 57%.
Others are the owner's taste and go against current gallery fashion: monospace labels, index numbers
and hairline grids are actually *more* common on award sites than on weak ones, which is exactly why
generators imitate them and why they now read as costume. They are banned here without exception.
`references/tells.md` keeps the dated registry.

Removing ornament leaves space. Never fill it with another ornament. Fill it with scale (make the main
thing larger), with the full content, with a picture made for this subject, or with a field of flat
colour. Leave it empty on purpose once per page at most.



## Files

| File | Read it when |
| --- | --- |
| `references/app-screens.md` | Any dashboard, admin, settings or other app screen: its own run, rules, tokens and checks. |
| `references/copy.md` | Writing the argument and the copy deck (steps 2 and 5). The two-line arithmetic. |
| `references/type.md` | Setting type: scales, tracking, measure, loading fonts, pairing. |
| `references/colour.md` | Applying the palette: roles, proportions, tone steps, dark pages, contrast. |
| `references/layout.md` | Grid, margins, rhythm, section variety, navigation, footer, the phone composition. |
| `references/imagery.md` | Choosing, finding, crediting, cropping and treating pictures; what to do with none. |
| `references/motion.md` | Step 9. Budget, tokens, recipes, reduced motion. |
| `references/scenes.md` | Step 6, when the sheet deals scroll scenes: putting one on a page, filling, fitting, the phone, checking, the catalogue. |
| `references/critique.md` | Step 8. How to look, how to score, what to fix first. |
| `references/tells.md` | The dated registry of generated-page tells and what each is replaced by. |
| `references/research.md` | The study: method, numbers, what the best and worst sites do. Cite it, do not guess. |
| `scripts/draw.mjs` | Deals and reprints the direction; `--photos`, `--site <id>` for more references; `--app` deals an app style instead. |
| `scripts/assets.mjs` | Step 6: searches open collections for real pictures of the subject's world; `--get` downloads with the credit, `--credits` prints them. |
| `scripts/lint.mjs` · `scripts/inspect.mjs` | The gate. |
| `scripts/scenes.mjs` | The gate for scroll scenes: each scene at 0-100% of its hold, desktop, phone, reduced motion. |
| `assets/base.css` · `assets/base.js` | An optional neutral foundation to build on. |
| `assets/scenes/` | The scroll-scene stage (`stage.js`, `stage.css`). Per-scene files and demos ship with a scene library; `draw.mjs --list scenes` prints "No scene library yet." until one exists. |
| `assets/app.css` · `assets/charts.js` | For app screens: a neutral shell, panels, tables and controls, and small SVG charts drawn to the app rules. |
| `library/` | **Intended non-standard dir** (bundled data the draw reads, not prose). Allow it in scans with `SKILLEVALUATOR_SCHEMA_ALLOWED_DIRS=library`. The data the draw reads: directions, heroes, sections, type systems, palettes, photographs, studied sites, motions, and the app styles, shells and screen patterns (`app.json`). Scroll scenes (`scenes.json`) are not in this library yet; the draw deals none until it exists. Do not read it whole; use the script. |
| `evals/evals.json` | Test briefs for measuring this skill against a no-skill baseline. |
| `THIRD_PARTY_NOTICES.md` (repo root) | Upstream source, licence and the changes made in this adaptation. |

## Requirements

Node 22 or newer and an installed Chrome, Edge or Chromium for `inspect.mjs` (it drives the browser
over the DevTools protocol with Node's built-in WebSocket; nothing is installed). `draw.mjs`,
`lint.mjs` and `assets.mjs` run on Node 18+; `assets.mjs` needs network access and no API keys. Set
`CHROME_PATH` if the browser is somewhere unusual. The draw history lives in
`~/.taste-skill/history.json` (set `TASTE_SKILL_HISTORY` to move it); delete it to reset.

## Instructions

Do these steps in order; steps 1–5 decide whether the page is any good. Full step detail: [`references/design-run.md`](references/design-run.md); craft laws and special cases: [`references/laws-of-craft.md`](references/laws-of-craft.md), [`references/special-cases.md`](references/special-cases.md).

1. **1. Read the brief and the project** — Find out what is real: the subject, the audience, the one thing the page must get someone to do, the stack, any existing brand (colours, fonts, logo), and above all **what imagery truly exists**: the project's own photographs or product ...
2. **2. Write the argument** — Before any design, list the page as claims with their proof, one line per section, the way `references/copy.md` §1 shows.
3. **3. Draw the direction** — ```bash node <skill>/scripts/draw.mjs --sector <sector> --brief "<one line about the subject>" \ --sections <roles in the order of your argument> [--tone <tone>] [--have <assets>] [--keep palette,type] \ --options 3 ``` This deals three ...
4. **4. Find the idea** — The direction is a way of composing.
5. **5. Write the words** — Write the whole page as a copy deck (plain text) before markup, following `references/copy.md`: - **Every headline fits in two lines or fewer at every width.** Do the arithmetic in copy.md §2 before committing to a sentence: about 32 cha...
6. **6. Build it, still** — Build the page with motion switched off in your head; a page that needs animation to look finished is not finished.
7. **7. Gate** — ```bash node <skill>/scripts/lint.mjs <source files or folder> node <skill>/scripts/inspect.mjs <url or path/to/index.html> node <skill>/scripts/scenes.mjs <url or path/to/index.html> # when the page has scroll scenes ``` `scenes.mjs` ph...
8. **8. Look** — Passing the gate means nothing banned was measured.
9. **9. Move** — Now build the motion layer.
10. **10. Report** — Do not report until all of these are true; each one was skipped in a test run that came out badly: - `inspect.mjs` shows **0 FAIL** at 1440, 768 and 390, on the final version of the page.


## Examples

Example: user asks for a landing page → read `DESIGN_BRIEF.md`, state the visual argument, propose two directions, build one, run the taste-skill gate at 1440 / 768 / 390px, then report.

## Limitations

- Scoped to frontend design craft built on the approved DESIGN_BRIEF.md.
- Best-effort guidance: it depends on the inputs above and cannot verify runtime behavior.
- Visual work must follow the approved DESIGN_BRIEF.md; taste-skill never overrides it.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Required artifact missing (PRD / plan / contracts) | Upstream stage not run | Run the upstream skill or `kedata-reverse` first |
| Output conflicts with the approved docs | Docs and work drifted | Run `kedata-change`, then re-run this skill |
| Skill did not trigger | Abstract or overlapping description | Invoke it explicitly via its slash command |
| Gate fails at a breakpoint | Layout not responsive | Fix at 390 / 768 / 1440px before reporting |
