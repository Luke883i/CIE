# CIE T5 · Recalculated game-to-release convergence

Current base SHA for F5: `751151a54fecf1e3402e817f546d91cc4cf5336d` (F4 merged). F5 is an incremental runtime PR; the exact reviewed F5 head SHA and CI status shall be recorded after publication.

## Release identity

**CIE 1.0: A Living Europe — single-player, fictional, 16-quarter persistent campaign.** Five role-specific player journeys, one shared deterministic state, an institutional/economic causal engine, responsive GIS atlas, NPC strategies, save/load, optional real-time asynchronous mode on a server, explicit single-player fast-forward and accessible controls. Server mode requires an authoritative server; local/offline can remain available without persistence promises.

## 11 semantic runtime PRs (original F1–F4 unchanged)

| PR | Increment | Dependency | Runtime acceptance |
|---|---|---|---|
| F1 | One world, five partial views | — | Shared history & authority proof (merged) |
| F2 | Autonomous single player | F1 | Four NPCs and replay (merged) |
| F3 | Persons/mandates/organizations | F2 | Succession changes legitimate power (merged) |
| F4 | Collegial justice and remedy | F3 | Complete fictional judicial chain (merged) |
| **F5** | **Economic Pulse + time UX alpha** | F4 | **8 quarters, dual-entry bounded claims, fast-forward, five-role playout, designed prototype** |
| F6 | **Reticular V9 and full economy** | F5 | V9 T0–T5 graph and provenance, observed losses/second-order effects, complete stock-flow accounting |
| F7 | **Strategy + engagement engine** | F6 | Repeated bargaining, coalition offers, NPC bounded rationality, personal stakes, legible dilemma loop |
| F8 | **European Atlas / design system** | F5/F7 | True Europe geometries, map/graph/time navigation, illustrated UI tokens, keyboard/mobile audits |
| F9 | **Durable asynchronous clock** | F7 | Authoritative server event/tick service; due-work queue, atomic version lease, server clock, catch-up, isolation |
| F10 | **Human playtesting and pacing closure** | F8/F9 | Meaningful choices proven in studies, tutorial, time control, fatigue/dark-pattern review, accessibility |
| F11 | **Publishable game closure** | F10 | 16-quarter campaigns, final endings, release gates, rollback, backups, deployment smoke |

Dependencies: F6 after F5; F7 after F6; F8 after F5 and F7; F9 after F7; F10 after F8/F9; F11 after F10. F8 visual exploration and server contracts may proceed earlier as nonmerged research branches if they do not modify canonical rules; no merge without each runtime gate.

## Remainder (comparative complexity units, NOT time estimate)

F6=21, F7=13, F8=13, F9=13, F10=13, F11=21 => **94 units** after F5 technical DoD. F5 added 21 units already completed locally. Sequential one-FTE baseline 94; parallel critical chain F6→F7→F9→F10→F11 = 81 (F8 must complete before F10 and may be parallel to F9). These are subjective sizing tokens, not calibrated person-days.

## New split: server-time vs accelerated-time

- **Fast-forward mode (implemented F5):** user explicitly delegates choices and advances logical time; max 4 quarters, stops at crises. Reducer never reads wall clock. Recorded as commands in replay.
- **Persistent/asynchronous mode (F9):** server monotonic source of time and transactions, durable relational storage, job due-times and idempotency keys, snapshot/event projection, atomic compare-and-swap over world revision, burst catch-up with bounded quota. Never rely on untrusted client Date or browser timer. Jobs must be recoverable after crash/restart; no double-credit, repeated policy effects or same tick execution twice. Notifications optional, user-controlled and non-manipulative.
- **UX scheduling:** choose manual vs persistent worlds only at scenario creation; they cannot silently share divergent authority; a spectator does not obtain private ledger facts.

## Product/engagement standard (F10)

User tests are REQUIRED, not simulated by Monte Carlo: preregister ≥20 voluntary external testers spanning five role journeys, including keyboard/mobile testing. Targets, subject to iteration: ≥80% independently finish tutorial and one episode within 20 min; median clarity of choices ≥4/5; median perceived agency ≥4/5; ≥70% identify one consequence they caused; ≥70% can pause/fast-forward and resume without coaching; conduct interview on fatigue/replay intention. Do not claim entertainment until evidence. No FOMO, compulsion timer, pay-to-win, or misleading urgency. Report sample sizes, exclusions, distributions, and qualitative failure cases; accessibility objective WCAG 2.2 AA.

## Fifteen conjunctive global DoD gates

G01 one canonical world, G02 deterministic replay, G03 five 16-quarter campaigns, G04 lawful fictional institutional process, G05 observation privacy, G06 full sector stock-flow and debt reconciliation, G07 >=99% V9 parametric executable paths with provenance and 37 deep reviewed causal cases (1,037 source units), G08 reticular feedback and counterfactual tests, G09 NPC strategic game with varied plausible outcomes, G10 accurate accessible European atlas, G11 500 complete campaign E2E + 10k mutated transitions, G12 security/build/provenance/production deploy, **G13 recoverable 24/7 server authority and idempotent asynchronous ticks**, **G14 human playtesting and pacing outcomes**, **G15 complete maintainable design system, original/license-safe illustration assets and responsive UI**. Every gate must PASS. F5 cannot inherit a G06 PASS from a bounded subledger, G10 from schematic SVG, G14 from deterministic tests or G13 from local fast-forward.

## Release criteria and Git safety

Each PR runnable and user-observable, validated from clean checkout, stable SHA pinned; no automatic merge on author claim. CI suites split unit/property, browser, economic accounting, replay, and security. Enable required check + review for main. F11 includes infrastructure, rollback verification, support and disclosure text, no unsafe analytics by default. World state migrations are versioned by ruleset. No LLM may alter authoritative state.
