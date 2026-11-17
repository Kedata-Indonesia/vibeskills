## Interview Protocol (How to Grill)

**Rules of the interview — apply to every domain:**
1. **One domain at a time.** Ask 3-5 starter questions, wait for answers, then follow up. Never dump the whole questionnaire at once.
2. **Follow up until you hit bedrock.** A "bedrock" answer is specific and usable as-is by a mockup generator: hex values, pixel sizes, exact copy. Vague answers ("modern and clean") are not design decisions — grill: *"What exactly does that mean here — colors, spacing, type? Give me an example screen that feels right."*
3. **Extract, don't reinvent.** If the PRD already defines personas, flows, or features, lift them into design terms — do not make the user repeat the product interview.
4. **Justify every visual decision.** The brief's tables must carry *why* (e.g., "warm paper background because white causes eye strain during long reading"). An LLM mockup generator follows tokens better when it understands the rationale.
5. **Probe states, not just the happy screen.** For every screen and component: empty state, error state, loading state, dark mode variant. Visuals are decided by their states, not their happy path.
6. **Quantify everything.** Pixels, px sizes, breakpoints, hex codes, weights. "Big title" is not a token; `36px / 1.2 / 700` is.
7. **Force priorities.** *"If mockup time only covered 5 screens, which ones?"* — the answer defines the launch-critical visuals.
8. **Record as you go.** After each domain, write the agreed answers into the draft brief section immediately — never wait until the end.
9. **Don't over-grill.** Stop a domain when answers become repetitive or the user says "you decide" (→ record as Open Question in §12). The user's time is the scarcest resource.
10. **End with the readback.** "I've captured palette X, type scale Y, screens A/B/C. Correct me if wrong."
