# CIE T6 · Reticular convergence after F5

## Baseline: source of truth
PRs #1–#5 are merged into GitHub `main` at `f3583ce6ef2adf4a5275fbe552bbdf77fbbce171`. F6 is a new vertical PR built directly on this SHA, not on old F5 branch. No automatic merge.

## Runtime semantic PR chain toward CIE 1.0

| Slice | Runtime contract / playable acceptance | Relative complexity | State |
| --- | --- | ---: | --- |
| F1 Shared World | One state, five scoped roles | — | merged |
| F2 Autonomous Episode | Five human roles with four NPC each; deterministic replay | — | merged |
| F3 Institutions & Succession | P1→P2 person/mandate split; two dossiers | — | merged |
| F4 Judicial Remedies | Facts, panel majority, conflict challenge, remedy | — | merged |
| F5 Economic Pulse & Time | Eight economic quarters, five role choices, bounded fast-forward | — | merged |
| **F6 V9 Reticular + Cross-book** | **1,037 provenance units, five runtime domain archetypes, T0–T5 play, cross-book cash bridge, counterfactual** | **21** | candidate PR |
| F7 Strategic Gameplay | Intentional dilemmas, offers, credible threats, veto, negotiated bargains, non-trivial NPC utility, scenario constraints, balance proof | 13 | next |
| F8 European Atlas & Design | Authentic European polygons, semantic/geo/time perspective, responsive illustrations/tokens, keyboard navigation | 13 | after F7 |
| F9 Asynchronous Server Clock | Server-owned durable worlds, monotonic due-queue, CAS ticks, crash recovery, isolation, idempotent processing and server-side secrets | 13 | after F7 |
| F10 Human Engagement / Accessibility | ≥20 human testers with preregistered methodology; teaching, tension, consequence legibility, pacing, non-compulsion, WCAG 2.2 AA verified | 13 | after F8/F9 |
| F11 Game Closure & Shipping | 5 roles × 16-quarter full campaigns, 500 seed-role journeys, 10k mutated transitions, restore/migrations, staging HTTP smoke, deployment, source/licensing and rollback | 21 | after F10 |

### Reticulum, dependence & gates

F1→F2→F3→F4→F5→F6→F7. F8 and F9 are parallel after F7; F10 waits for both; F11 waits for F10. After F6 accepted, **73 relative complexity units remain serially**, and **60 on the nominal parallel critical path** (`F7→max(F8,F9)→F10→F11`). Such units are sizing assumptions, NOT calendar dates, team capacity or empirical duration.

### Global DoD vT6 · 15 conjunctive gates (no compensating average)

- G01 world canonical identity; G02 deterministic, versioned replay and rule migration.
- G03 five user-playable 16-quarter campaigns with genuine role differences; G04 authorized legal processes and remedies, even following succession.
- G05 information boundaries and no role-visibility leaks; G06 sector-level stock-flow consistency and credit/default/guarantee reconciliation with no duplicate money.
- G07 ALL 1,037 V9 origin records preserve provenance; ≥99% have runnable **parametric paths** with explicit domain mapping; 37 hand-reviewed chains remain a *future requirement*. Distinguish source import from substantive mechanistic coverage.
- G08 tested mediated effects, bounded T3→T1 and T4→T0 feedback, counterfactuals and hard-stop gates; G09 non-trivial NPC agency and strategic dilemmas.
- G10 accurate multilingual/accessible Europe atlas in desktop and mobile; G11 500 full browser+engine campaigns and 10k seed mutations, no fatal or untriaged blocker.
- G12 verifiable production deployment, legal/license inventory, reproducible builds and rollback; G13 server-based asynchronous 24/7 world clock with idempotence/catchup and authorization.
- G14 real human playtests (≥20 spanning roles), ≥80% self-serve tutorial/episode, median clarity/agency ≥4/5, ≥70% consequence comprehension and time-control success (planning thresholds, not actual outcomes).
- G15 coherent design system, licensed original illustrations, accessible interactions, legibility and responsive qualitative QA.

### Gate ledger after F6 (not global PASS)

F6 advances G06 (explicit capital bridge), G07 (source-to-case mapped runtime), G08 (six-phase synthetic causal kernel). It **does not** close G06 macro, G07 validated case semantics, G08 real causal evidence, G14 enjoyment, G13 server. F7 is next because the synthesis now needs credible strategic opposition, not a more elaborate UI before interesting choices exist.

### Merge / anti-deriva policy

Every semantic PR must change runnable game behavior, produce reproducible positive and adversarial proofs, declare open gates, and receive clean-checkout CI on the *same head SHA* reviewed. Keep F1–F5 regressions. No PR docs-only, no fake 99% semantic certification, no main force-push. Require review and status checks before merge; main currently lacks protection.
