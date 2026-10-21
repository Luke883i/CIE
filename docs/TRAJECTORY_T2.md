# CIE · T2 trajectory after F2

## Stage status

- F1 shared world: GitHub PR #1 merged into `main` at `31eabd3473b3d621eef7634ade48846386d8be5c`.
- F2 autonomous episode: GitHub PR #2 (`semantic/f2-autonomous-world` → `main`) is open as Draft, based on merged F1; head must remain pinned to whichever exact commit is reviewed. Local suite and remote CI passed during this slice. **Not** a full-game release; independent review and merge remain outstanding.
- F3 next: mutable `Person -> Mandate -> Office -> Institution` with vacancy, incompatibility, replacement and persistent references to the same historical act, plus jurisdictions and organizational competition.
- F4 judicial procedure: standing, evidence, hearings, appeals, recusal, collegial court.
- F5 economy: multi-sector double-entry, debt, maturity, liability and contingent guarantees.
- F6 reticular V9: 1,037-dossier provenance, T0–T5, typed hyperedges, 37 curated and >=1,027 executable parameter paths; descriptive records do not count as executable semantics.
- F7 strategic agents: bounded-rational preference models with information sets, offers, veto, reputational and repeated-game dynamics; calibrated diversity, no hidden-state reads.
- F8 UX Atlas: multi-scale Europe GIS, local institutional desk, semantic graph, time slider, accessible keyboard paths.
- F9 Game closure: 16-quarter campaign for five playable roles, endings, save/load, browser QA, distribution, truthful balance and final acceptance.

## Critical dependencies

F1 -> F2 -> F3. F3 forks F4 and F5 and F8. F6 requires F4 & F5. F7 follows F6. F9 follows F7 and F8. No simplification from F2 demo to direct F9 claim.

## Recalculated relative complexity (unvalidated expert plan)

Original remaining F2..F9: 123 units (F2=8,F3=13,F4=13,F5=21,F6=21,F7=13,F8=13,F9=21).
After F2 locally complete, remaining: **115 units**. Critical path from F3 -> F5 -> F6 -> F7 -> F9: **89 units**. This is NOT calendar effort or person-days. F2 should be subtracted only after its own PR merges into base with the reviewed SHA.

## F3 candidate DoD

A player occupies a person with a revocable office mandate; that person can be replaced, disqualified or recused without retroactively rewriting court cases, laws, contracts or prior events. Two distinct institutions continue acting; at least 20 organizations and three jurisdictional scales are present in reproducible seeded worlds. The episode remains playable start-to-terminal as Costantino and as successor official, and the game UI explains how the appointment changed authority. Pre-merge stress: 200 replacements across different seed states, no ghost competence and no change to historical event hashes.

## Global acceptance gate

All 12 invariant release gates remain open at game level: world identity, replay, five full campaigns, institutional validity, knowledge, stock-flow, executable V9, reticular causality, actor strategy, inclusive Atlas, end-to-end QA, reproducible release. Passing F2 is not passing those gates; a local test passing is not CI certification.

## T2 actual-audit recalibration

- Evidence: 370 Node tests; 5,000 complete seeded solo episodes (all roles); 5,000 exact replays; five Chromium journeys. These verify the bounded F2 slice, not the complete institutional or economic model.
- F3 next high-leverage dependency: mutable person-office mandates, appointment/recusal and historical identity, backed by one concrete interactive succession episode.
- F4 and F5 become independent runtime workstreams only after the F3 data contracts are reviewed. F8 navigation may proceed from the same institutional contract.
- Model risk dominates the remaining budget, not JavaScript runtime: reticular V9, institutional authority fidelity, balance of NPCs, and mapping 1,037 dossier lineages onto actual causal mechanics.
- Structural score unchanged: 115 relative units after F2 (89 along critical path). It has not been empirically calibrated into hours or delivery dates.
