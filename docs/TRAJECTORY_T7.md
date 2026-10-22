# CIE trajectory T7 — merge audit and publishable-game convergence

## Verified source lineage

| PR | Functionality | GitHub merge SHA | Status |
|--|--|--|--|
| #1 F1 | One living world | 31eabd3473b3d621eef7634ade48846386d8be5c | merged |
| #2 F2 | Autonomous NPC episode | bc082be817a7269746e4cfd4f45e76fcba588db5 | merged |
| #3 F3 | Institutions and succession | 8d429c18225361dd5e82ce1a32b94c417b1e3f04 | merged |
| #4 F4 | Court, evidence, remedies | 751151a54fecf1e3402e817f546d91cc4cf5336d | merged |
| #5 F5 | Economic pulse / playable time | f3583ce6ef2adf4a5275fbe552bbdf77fbbce171 | merged |
| #6 F6 | V9 reticular cases / economic bridge | fb0ac0d98ea0739c3dd8828bf300574a9141f332 | merged |
| #7 F7 | Bargaining/coalitions/trust | TBD head SHA | Draft candidate |

## Next vertical slices (all executable, not scaffolding)

- **F8 European Atlas & Design (13 comparative units):** accurate polygon geometry of European countries, pan/zoom and semantic relationship overlays; accessible institutional dossiers; responsive typography/iconography, downloadable/offline map asset policy, original/rights-cleared illustration kit; role-specific navigation and 5 full browser journeys. Needs a11y test and source/license manifest. The atlas reads canonical world; it must not create separate territorial truth.
- **F9 Persistent World & Async Server (13):** authoritative HTTP API, PostgreSQL transactions or documented persistence equivalent, schema/ruleset version, server-owned clock/UTC deadlines, crash-safe work queue, compare-and-swap world version, idempotency key, bounded catch-up, offline UI poll, scheduler start/stop, role authorization and secure hidden-state filtering. Proof: browser closed, scheduler advances one world exactly once across crash/restart and clock skew; no client double tick. OGame-like asynchronous mode needs a real deployed worker, not a browser timer.
- **F10 Playtesting, Engagement & Accessibility (13):** preregistered external playtest (at least 20 humans across five roles) with informed consent, tutorial completion ≥80%, median agency/clarity ≥4/5, consequence comprehension ≥70%, no coercive countdown monetization, actionable iteration and second validation; WCAG 2.2 AA measured keyboard/screen reader/color contrast; boredom/pace/dropout tracked. *No user testing can be inferred from synthetic agent replay.*
- **F11 Game Closure & Publish (21):** make F3–F7 persistently playable as a coherent 16-quarter campaign, 5 roles each with multiple decision beats, recoverable autosave, asynchronous catch-up, distinct win/fail narratives, irreversible legal and financial costs, 500 completed role-seed campaigns and 10,000 mutated transitions, staged HTTP/browser QA, rollback and license/source inventory. Release only if ALL global gates are green.

Dependencies: merged F6 → F7; F7 → (F8 || F9); (F8 AND F9) → F10 → F11. Remaining after merge acceptance of F7: 60 nominal serial comparative units, 47 nominal parallel critical units. Baseline before F7 merge: 73 units (F7=13). These are **ordinal planning weights**, not schedule, price or labor estimates.

## Global DoD — 15 noncompensable release gates

G01 single canonical world; G02 exact versioned deterministic replay/migrations; G03 5 playable 16-quarter human campaigns; G04 jurisdiction and remedy legality within fictional rules; G05 no private info leaks at service boundary; G06 sector, stocks, flows, debts, guarantees reconciled; G07 full provenance for 1,037 V9 dossiers, ≥99% typed runnable parametric paths, 37 curated independently reviewed semantic chains; G08 traced T0–T5 feedback and causality explicitly synthetic; G09 strategic NPCs/coalitions/exit without magic authority; G10 accurate responsive and keyboard/screen-reader accessible European Atlas; G11 comprehensive QA in real hosted HTTP and restart paths; G12 reproducible release, licenses, security and rollback; G13 always-on server clock with exactly-once effect and bounded catch-up; G14 external playtest and enjoyment thresholds; G15 approved coherent design system and illustrations.

**Progress is not a sum of passes:** a PR can close its local DoD yet leave global gates blocked. Major debts: NPC game-theoretic strategy may be simplistic; source V9 is not validated causally; cash model fictional; no GIS; no durable worker; no human study; CI is not independent certification.

## Anti-entropy Git rule

One semantic PR = one executable vertical slice, its e2e path, falsifier evidence, updated gates, no PR docs-only. Pin review to same head SHA with green GitHub CI, rebuild after changes, no auto-merge. Protect `main` in repository settings (currently unprotected). Remote release not claimed from localhost-inlined Chromium smoke.
