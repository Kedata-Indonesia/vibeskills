# Detailed interview questions by step

Use these starter questions and grill follow-ups for each step. Keep the full methodology in SKILL.md.

### Step 1: Domain 1 — Product Identity & Brand Personality
**Goal:** define the feeling the design must convey.

Starter questions:
- From the PRD: what is the product in one sentence? (confirm, don't re-ask)
- Extract the PRD personas into §2 (design view: who they are, what they see) — this is the grouping source for Domain 4.
- What three adjectives describe the brand personality? (e.g., calm, trustworthy, scholarly)
- If this product were a place, what would it be? (e.g., "a well-lit reading room — not a SaaS dashboard")
- Who is the design for — what does the audience expect visually?

Grill follow-ups:
- "What must the design NEVER look like? (a brand we must not resemble)"
- "Does the personality change per surface — public landing vs admin panel?"
- "Which existing products or designs do you admire? What specifically about them?"
- "What feeling should a first-time visitor have in 5 seconds?"

**Bedrock signal:** you can write §1 Product Identity (with the three brand adjectives and their why) without a placeholder adjective.

### Step 2: Domain 2 — Visual Identity & Design Tokens
**Goal:** the exact tokens (colors, type, spacing, logo) a mockup generator can follow.

Starter questions:
- Base palette: background, surface, text, muted text, accent, success/warning/error — light mode first.
- Typography: which families for display/heading/body/UI/caption? (body font for reading-heavy products should be a readable serif or screen-optimized serif)
- Spacing: what's the base grid unit (typically 4px)? Max content width? Sidebar width?
- Logo: wordmark, icon, favicon, social preview?

Grill follow-ups:
- "Why these colors?" (rationale for every token)
- "What are the dark-mode variants of each token — same hue family, lightened accents?"
- "Are the fonts actually available — Google Fonts, licensed, or self-hosted?"
- "What's the smallest readable size for body and for UI text?"
- "Do tokens map to CSS custom properties (`--color-bg`, `--space-md`)?"
- "Are there secondary/accessory colors (genre colors, category badges) — how many, and are they distinguishable in graph/badges?"

**Bedrock signal:** §3 token tables are fully populated with light+dark values, pixel sizes, and one-line rationales.

### Step 3: Domain 3 — Voice & Tone (Microcopy)
**Goal:** the copy principles the mockups must render.

Starter questions:
- What language is the UI? (e.g., Bahasa Indonesia)
- Formal or warm? Technical or plain? Selling or inviting?
- Show me a button, an empty state, and a success message — what would they say?

Grill follow-ups:
- "Give me do/don't pairs for 3-4 principles." (e.g., warm not formal, clear not technical)
- "What's the voice for errors — apologetic, direct, helpful?"
- "Are contributions framed as invitations or tasks?" (community products differ here)
- "Any terms that are banned or mandated?" (product-specific vocabulary)

**Bedrock signal:** §3.6 Voice & Tone table has 3-4 principles, each with do/don't examples in the UI language.

### Step 4: Domain 4 — Screen Inventory
**Goal:** every unique screen that needs a mockup, grouped by persona.

Starter questions:
- From the PRD: which screens exist? (extract from flows + features)
- Group them: public, user, moderator, admin — the personas from §2 are the grouping keys.
- For each: name, path, and its key elements.
- Map every PRD flow to its screens into §7 (Flow → steps/screens → notes) — no orphan flows.

Grill follow-ups:
- "Which screens did the PRD imply but not name? (empty shelves, search results, error page)"
- "What are the 3 screens that MUST be perfect at launch?"
- "Which screens share a layout skeleton? (list pages, detail pages, forms)"
- "What is the empty/loading state of each screen?" (handled in Domain 6, but note them now)

**Bedrock signal:** §2 lists every PRD persona in design terms; §5 lists every screen grouped by persona, each with a one-line description of its key elements; §7 maps every PRD flow to screens.

### Step 5: Domain 5 — Component Inventory
**Goal:** the reusable components and their states.

Starter questions:
- Which components appear on 3+ screens? (cards, nav, buttons, badges, tables, toasts…)
- For each component: what content does it hold?
- What are its states: default, hover, active, disabled, loading?

Grill follow-ups:
- "What's the card's content in each context — grid vs list vs shelf?"
- "How does the nav adapt: mobile bottom bar vs desktop top bar?"
- "Which components are complex enough to need their own mockup? (editor, graph, data table)"
- "What does the component look like with no data?"

**Bedrock signal:** §6 lists each component with content, states, and mobile vs desktop behavior.

### Step 6: Domain 6 — Error, Empty & Loading States
**Goal:** every key screen's three non-happy states.

Starter questions:
- Empty states: what does first-run / zero-results / cleared-list look like per screen? (illustration + copy?)
- Error states: network failure, validation failure, not-found — what's shown?
- Loading: skeleton screens, spinners, or progress bars — which for which surface?

Grill follow-ups:
- "What's the tone of the empty-state copy — encouraging, playful, neutral?"
- "Is there a CTA in the empty state? (e.g., 'Belum ada buku di rak' + 'Mulai Baca')"
- "How long is loading before a skeleton appears? What happens on timeout?"
- "What's the global 404 / offline experience?"

**Bedrock signal:** §8 covers empty, error, and loading for every screen in §5 — no screen left without its non-happy states.

### Step 7: Domain 7 — Key Layout Patterns
**Goal:** the layout skeletons for the most important screens, mobile + desktop.

Starter questions:
- Mobile-first: what does the #1 screen look like at 375px? At 1440px?
- Reading-focused pages: body max-width, sidebar presence, sticky elements?
- Admin/dense pages: table density, multi-panel?

Grill follow-ups:
- "Which pages are reading-focused (need 65ch body, quiet chrome) vs functional?"
- "Nav at each breakpoint: bottom tab bar (mobile), top nav (desktop)?"
- "What's sticky on desktop: sidebar, table of contents, action bar?"
- "Which layouts are shared skeletons across screens?"

**Bedrock signal:** §4 breakpoints are defined (375px base, 1440px desktop minimum); §9 defines the layout skeleton for the top screens at mobile and desktop using those breakpoints.

### Step 8: Domain 8 — Dark Mode
**Goal:** decide dark mode: required, default, and token mapping.

Starter questions:
- Is dark mode required? Default, toggle, or system-following?
- Which surfaces flip vs stay constant? (background, surface, text, accent)
- Are accent colors lightened in dark mode for contrast?

Grill follow-ups:
- "Does the reading experience differ in dark mode — same serif, same line-height?"
- "How do images/covers behave in dark mode? (no dark filter needed?)"
- "What's the contrast target for body text in dark?" (WCAG AA)
- "Is dark mode in scope for the first mockup pass or later?"

**Bedrock signal:** §10 states dark mode requirement and token mappings — or is explicitly "N/A" with a reason.

### Step 9: Domain 9 — Design Deliverables
**Goal:** what mockup design produces, in what order, and what "done" means.

Starter questions:
- What should mockup design produce — HTML mockups, Figma, both?
- Which screens first, and how many variants per screen?
- Who reviews the mockups, and what's the acceptance bar?

Grill follow-ups:
- "What tool will consume the brief — an LLM prompt, a designer, both?"
- "What's the definition of done for the mockup phase?"
- "Which deliverables must be committed to the repo vs scratch?"

**Bedrock signal:** §11 lists deliverables with order, variant count, and acceptance criteria.

### Step 10: Draft & Self-Check
* Fill every section of the template below from the PRD extraction + interview answers — no empty placeholders; "N/A" with a one-line reason where a section doesn't apply.
* Save to: **`docs/DESIGN_BRIEF.md`** (default). EXCEPTION — if the team already uses root `DESIGN_BRIEF.md`, update that file in place; never create a second copy.
* Set §12 Document Info: status `Draft`, version `0.1`, source PRD version, owner.
* Run the design brief self-check — ALL must pass before presenting:
  - [ ] All 12 sections filled (or explicitly "N/A" with reason)
  - [ ] §1 product identity has no placeholder adjectives ("modern and clean" is NOT a decision)
  - [ ] §2 lists every persona from the PRD in design terms (who they are, what they see)
  - [ ] Every persona in the PRD has screens in §5
  - [ ] §7 maps every PRD flow to screens in §5 (no orphan flows)
  - [ ] Every component in §6 has states listed
  - [ ] Every screen in §5 has empty/error/loading coverage in §8 (or is marked N/A)
  - [ ] Every color token has light AND dark variants (unless dark mode is N/A)
  - [ ] Typography has exact sizes, weights, line-heights — no "big title"
  - [ ] Breakpoints defined in §4; layouts for mobile (375px) AND desktop (1440px) in §9
  - [ ] No engineering detail leaked (no DB schema, API contracts, or algorithms)
  - [ ] §12 lists source PRD + any open design questions
  - [ ] If `kedata-design-frontend` was used: its dealt direction is reflected in §1/§3/§9, any `--keep palette,type` brand values were preserved, and every deviation is logged in §12

### Step 11: Review & Sign-Off
* Present the brief with a tight summary: the visual identity decided, the screens covered, the riskiest assumptions (e.g., dark mode scope, font availability), and open questions.
* **Do not proceed to mockup design until the user approves it.** On approval, update §12: status `Approved`, version `1.0`, approver + date.
* Hand off: "Design brief approved. Feed it as context for mockup design — start with the launch-critical screens from §11 — then hand it to `/kedata-implementation-plan` (FE task scope)."
