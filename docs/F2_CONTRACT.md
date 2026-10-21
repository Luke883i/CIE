# CIE F2 · Autonomous Living World · Normative contract

Version: `CIE-F2-1.0.0` · status: implemented as a bounded fictional game episode; not a representation of EU/Italian law.

## Subsystems

- `World`: one state per `(SCENARIO, RULESET, worldSeed)`; no role-specific world generation.
- `Identity`: personId, actorId, organizationId, officeId represented separately; F3 will introduce mutable mandates, vacancies, succession and organizations (not falsely claimed by F2).
- `Authority`: capability typed by actor and sequential phase. The reducer MUST reject unauthorized, out-of-turn, stale and unrecognized parameters.
- `Economy`: four balances with strictly conserved transfer sum (160 artificial units); no new money. This is NOT a stock-flow-consistent macroeconomic system (F5).
- `Knowledge`: all private financial events hidden from nonparties, with observer-local IDs and no global event-count exposure. Current visible phase/turn remain observable; metadata privacy is not equivalent to network secrecy.
- `NPC`: policy sees a detached role-specific observation and a random word derived only from `(RULESET,seed,turn,actor,decisionKind)`. No Math.random, no LLM, no Date, no external network.
- `Game`: fixed six-phase transition machine, five actors, two choices each; automated NPC advancement with bounded hops; explicit WAIT/delegation on the human decision slot; distinct endings; no requirement to impersonate other actors.
- `Replay`: portable `{schema,seed,humanId,commands,resultDigest}`; reexecution reproduces exact authoritative state. The FNV digest is not cryptographic, not proof against a malicious user, and not adequate for remote multiplayer (F9).

## Observation boundary

`observe` MUST return detached values, scoped balances and known events only. The public phase reflects institutional clock progress. Existence of a confidential fact MUST NOT be emitted via internal event IDs or total log sizes. Field-level leakage via longer-term cross-episode inference remains for audit and future F3/F4 design; no claim of perfect noninterference is made.

## Case and legitimacy

Promulgation causes a standing civic association to file one deterministic admissible fictional challenge. A judicial decision requires the case. This legal pathway is purposely abstract, not a claim that courts automatically review laws in any existing jurisdiction. A judge is modeled as a delegate, not sole president of an actual court. Individual case proofs and collegial procedure are F4.

## DoD acceptance

1. Five profiles may begin a human-only session against exactly four automatic agents.
2. All five human roles get two legal, materially different options in the intended decision window.
3. Every game reaches a terminal outcome in at most 12 scheduled ticks, no manual NPC role switching.
4. All accepted actions pass competence, phase, turn and resource checks.
5. Private funding cannot be observed or enumerated by an unauthorised judge through published event metadata.
6. An observation cannot mutate world state.
7. Account balances reconcile from the transfer log and remain nonnegative and conserved.
8. Replay exactly reproduces the full world for its own `(seed,role,commands)`.
9. Node tests, 5 x 30 seeds, broader Monte Carlo 5 x 1000 seeds, and all-five-role Chromium smoke are generated.
10. CI executed on **the very same PR head SHA** reviewed for merge; no merge before CI and human review.

## Known exclusions

F2 is an episode, NOT a 16-quarter campaign. F3 offices and mandates are static. F4 has no realistic procedure or evidence adjudication. F5 has no debt/guarantees. F6 has no executable 1,037-case V9 reticular coverage. F7 has no bargaining. F8 has no accurate European GIS. F9 has no release readiness or server-secure multiplayer.
