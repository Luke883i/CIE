# F5 · Economic Pulse & Playable Time — normative contract

Version: `CIE-F5-1.0.0`. The world is fictional; neither the economic coefficients nor the institutional procedures are asserted as empirical measurements of actual Europe.

## System boundaries

1. **One canonical world.** `f5Initial` wraps the actual F4 `f4Start` world and carries its immutable ancestry through `s.world`. No second world is generated for the economic phase. The F4 world is not reinterpreted retrospectively.
2. **Human + NPC actions.** One human persona from the five profiles acts once per economic quarter; the other four take bounded deterministic decisions in that same cycle. Costantino cannot command the court or Presidency. P1 after succession participates as a private former office-holder via dialogue/public-report requests, never exercises P2's official authority.
3. **Economic accounting.** The second-phase subledger has five positive-cash accounts totalling 440 fictional units, a signed journal of transfers (from/to/amount/reason/sequence), and matched loan and bond claims (debtor obligation == creditor asset). Debt principal can default, in which case claims remain outstanding; there is no magic write-off. This is NOT yet a complete multi-sector stock-flow consistent macroeconomic model.
4. **Causal link.** The legal outcomes of dossiers A/B and institutional succession influence the initial economic mandate. Quarterly progress depends on governance, trust, opposition, cash availability and seeded shocks. No policy outcome is guaranteed by a single action.
5. **Time.** Simulation time moves only on `f5Play` or `f5FastForward`; accelerated mode explicitly delegates the human role to its policy. Hard limit four economic quarters per request and automatic stop at a recorded critical event. Paused UI does not move when tab closed; no background persistence claim.
6. **Determinism.** All outcome and NPC variance derives from `f3Word(seed, domain, quarter, role)`. No AI-generated decisions, `Math.random`, ambient clock or network fetch in the reducer. User-selected chronological commands are included in replay.
7. **Information.** Observer projections are detached. Event identifiers are renumbered per-observer after filtering so the count of financial-private events is not leaked through visible IDs. The browser owner can still inspect local memory: this is not server secrecy.
8. **Feedback.** Each selection supplies a risk/benefit description before clicking; afterwards indicators and an event diary expose what changed. The initial Atlas is **an original symbolic illustration**, not geographically accurate GIS. Precise European geometry requires F8.

## Runtime DoD F5

- [x] One legal-institutional prologue from F4, with outcomes fed into economics.
- [x] Eight quarterly decisions per single-player campaign with NPC reactions.
- [x] Distinct profiles and legal action sets; formerly empowered P1 cannot use official Presidency power.
- [x] Cash journal conservation, mirrored debt/asset positions, checked replay.
- [x] 1× / 2× / ≤4× fast-forward, explicit human delegation, stop on critical event.
- [x] Desktop/mobile prototype with single designer token system, SVG illustration, keyboard semantic controls, event explanations and replay UI.
- [x] Node regression and 1,000 seeded full campaigns; five-role Chromium test (inlined script limitation).
- [ ] HTTP-hosted browser smoke on deployed origin and verified contrast audit; F8/G12.
- [ ] External human enjoyment studies; F10/G14.
- [ ] Server 24/7 tick authority; F9/G13.

## Anti-deriva / falsifiers

Rejected: treating a UI clock or service-worker timer as 24/7 server persistence; treating a plot as proof of fun; accepting credit creation without counter-liability; overlapping mandates; local replay hash as cryptographic proof; imported V9 content as implemented causal semantics. No cross-role action injection, clock rollback or unlimited fast-forward.
