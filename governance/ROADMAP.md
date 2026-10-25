# CIE — strict adaptive product roadmap / semantic contract

## Baseline and truth

- Canonical main: `0831c0525d47ed81853441a58e5cf73d2f22d5f1`; inherited AC04 graph 1100 nodes / 2714 edges; 146 base micro-DoD; 32 global gates **OPEN**.
- F7 is a one-human game with NPCs, AC03 a one-quarter five-order experiment. No game engine merger implied.
- No authenticated 16-quarter five-human game; no certified human fun; no independent security or WCAG audit; rights and operations incomplete.

## Dependency DAG: minimum overlay, not a replacement for inherited reticulum

| Packet | Intent / deliverable | Requires | Weighted units | Links to release gate | State |
|---|---|---|---:|---|---|
| ICTC01 | Baseline, scopes and evidence governance | — | 3 | GATE-G32 | OPEN |
| ICTC02 | Five-human constitution, mandates and 0-N orders | ICTC01 | 8 | GATE-G01, GATE-G03, GATE-G04 | OPEN |
| ICTC03 | Twelve domains, scarce stock/flow economy | ICTC02 | 8 | GATE-G06, GATE-G07, GATE-G08 | OPEN |
| ICTC04 | Territories, cohorts and distribution | ICTC03 | 7 | GATE-G09, GATE-G10 | OPEN |
| ICTC05 | Atomic joint transitions and replay | ICTC02, ICTC03 | 8 | GATE-G02, GATE-G05 | OPEN |
| ICTC06 | Persistent server, role privacy and security | ICTC05 | 8 | GATE-G21, GATE-G22 | OPEN |
| ICTC07 | NPC agency, war and regime shifts | ICTC04, ICTC05 | 8 | GATE-G11, GATE-G12 | OPEN |
| ICTC08 | Complete campaigns and differentiated goals | ICTC07 | 8 | GATE-G13, GATE-G14 | OPEN |
| ICTC09 | Scenario and grammar factory | ICTC07, ICTC08 | 6 | GATE-G16, GATE-G17 | OPEN |
| ICTC10 | Narrative provenance and adult graphic art | ICTC04, ICTC06 | 6 | GATE-G15, GATE-G25 | OPEN |
| ICTC11 | Game balance and no dominant strategies | ICTC08, ICTC09 | 9 | GATE-G18, GATE-G26 | OPEN |
| ICTC12 | Turntable UX, tutorial, accessibility and performance | ICTC08, ICTC10 | 7 | GATE-G19, GATE-G20, GATE-G27, GATE-G28 | OPEN |
| ICTC13 | Human playtesting, consent and community safety | ICTC11, ICTC12 | 9 | GATE-G23, GATE-G29 | OPEN |
| ICTC14 | Reproducible release and operation | ICTC06, ICTC09, ICTC13 | 9 | GATE-G24, GATE-G30, GATE-G31 | OPEN |

## All non-compensable release gates

| Gate | Required property | State | Closure basis |
|---|---|---|---|
| GATE-G01 | One canonical authoritative world | OPEN | Independent release-candidate evidence |
| GATE-G02 | Ruleset-versioned deterministic replay | OPEN | Independent release-candidate evidence |
| GATE-G03 | Five role-bound authorities | OPEN | Independent release-candidate evidence |
| GATE-G04 | 0-N orders and delegation | OPEN | Independent release-candidate evidence |
| GATE-G05 | Atomic turn and idempotency | OPEN | Independent release-candidate evidence |
| GATE-G06 | Twelve durable domains | OPEN | Independent release-candidate evidence |
| GATE-G07 | Stock/flow material engine | OPEN | Independent release-candidate evidence |
| GATE-G08 | Reconciled assets liabilities and cash | OPEN | Independent release-candidate evidence |
| GATE-G09 | Territories with observed effects | OPEN | Independent release-candidate evidence |
| GATE-G10 | Cohorts and distributive impacts | OPEN | Independent release-candidate evidence |
| GATE-G11 | Autonomous strategic NPC | OPEN | Independent release-candidate evidence |
| GATE-G12 | War/peace/regime transitions | OPEN | Independent release-candidate evidence |
| GATE-G13 | 16 quarter campaigns | OPEN | Independent release-candidate evidence |
| GATE-G14 | Personal-world-legacy outcomes | OPEN | Independent release-candidate evidence |
| GATE-G15 | Evidence-backed narrative scenes | OPEN | Independent release-candidate evidence |
| GATE-G16 | At least 12 playable distinct scenarios | OPEN | Independent release-candidate evidence |
| GATE-G17 | Scenario reachability and validity | OPEN | Independent release-candidate evidence |
| GATE-G18 | No trivial dominant policy | OPEN | Independent release-candidate evidence |
| GATE-G19 | Progressively disclosed context-first UX | OPEN | Independent release-candidate evidence |
| GATE-G20 | Independent accessibility audit | OPEN | Independent release-candidate evidence |
| GATE-G21 | Durable server/asynchronous tick | OPEN | Independent release-candidate evidence |
| GATE-G22 | Authentication privacy and security | OPEN | Independent release-candidate evidence |
| GATE-G23 | Human-verified engagement and enjoyment | OPEN | Independent release-candidate evidence |
| GATE-G24 | License/deploy/rollback/runbook | OPEN | Independent release-candidate evidence |
| GATE-G25 | Game identity, reasons to play and differentiated emotional payoff | OPEN | Independent release-candidate evidence |
| GATE-G26 | Five-role competitive balance and no universal strategy exploit | OPEN | Independent release-candidate evidence |
| GATE-G27 | Comprehensible re-entry, tutorial, goals and impossible-victory warnings | OPEN | Independent release-candidate evidence |
| GATE-G28 | Cross-browser performance, low-end fallback and resource budgets | OPEN | Independent release-candidate evidence |
| GATE-G29 | Consent, moderation, player safety, age rating and social abuse | OPEN | Independent release-candidate evidence |
| GATE-G30 | Complete source/build/asset supply-chain traceability and legal release rights | OPEN | Independent release-candidate evidence |
| GATE-G31 | Operational resilience, incident handling, backups, support and end-of-service | OPEN | Independent release-candidate evidence |
| GATE-G32 | Open-world completeness governance and fresh adversarial independent sign-off | OPEN | Independent release-candidate evidence |

## Change control and convergence algorithm

The CLI calculates **ready packets** only when all declared prerequisites are integrated and evidenced. The risk priority score is `impact × uncertainty + weight`. A package is not closed because its due date passed, a branch merged or an image was generated.

Weighted open units = sum of package weights not at the evidence-backed INTEGRATED state. Throughput is initially an *assumed scenario*, not measured performance. Formula: `M = ceil(weighted_open_units / measured_verified_units_per_iteration) + integration(6) + human(4) + stabilization(8)`; recalculate only after actual observed cycles. The program length is conditional and can increase when a seam reopens or a missing requirement is discovered.

## Non-regression required in every PR

- Pinned game rules unchanged unless a separately reviewed game-rules migration; crosswalk old/new replay and migration.
- Inherited graph has all 1100 nodes and 2714 edges; existing CI `verify:convergence`, `verify:dual`, `verify:legacy` must continue passing.
- Added semantic change requires a new contract pin and a falsifying test; 100k mutation audit protects declared classes, not the unknown unknowns.
- No structural green implies global green; require named human approval and security/legal/human evidence on same release candidate.
- 30 scenario specifications / 7200 visual contracts are design obligations, not implemented gameplay/media.

## Release rule

`BLOCK` until: every `GATE-G01 ... GATE-G32` has fresh evidence from the *same exact release candidate*, signed/offline-verifiable provenance where required, independently reviewed human studies and operational drill results; owner approval recorded outside these scripts. Any P0 exception or stale evidence blocks release.

**No ghost-proof progress:** the official planner performs `readAssets:true`; a nonexistent or stale evidence artifact blocks readiness. Only `simulation:true` may bypass disk evidence, and its output is clearly labeled hypothetical.
