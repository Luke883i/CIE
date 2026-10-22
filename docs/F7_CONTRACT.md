# CIE F7 — Strategic Gameplay · Normative runtime contract

Ruleset `CIE-F7-1.0.0`; source of truth is `src/strategy.mjs`, composed on top of F6, **not a fork of its world**. The game takes place in an alternate fictional Europe. NPCs use deterministic bounded-rational policies, not AI-generated dialogue. All numerical effects are synthetic game rules, not empirical claims about actual political actors.

## Ontology and boundaries

- One original F3–F6 institutional world, one judicial history, one F6 reticular history, one cross-ledger capital bridge. F7 adds a repeat-game relationship ledger and commitments; it MUST NOT rewrite earlier events or invent money.
- Human perspective is a *person*; the counterpart NPC has its own rule-determined reservation threshold and may reject a deal. Role-switching requires a new game instance. No player controls NPC votes.
- Public observation: quarter, progress, support, legitimacy, volatility, bilateral trust and agreements belonging to player. Response policy may use **only** these public indicators, a seeded private NPC disposition (its own property), and bilateral trust. The NPC may not inspect hidden financing, court evidence or other confidential world fields.
- A coalition is a nonbinding contingent commitment with a two-quarter deadline, **not** a guaranteed vote. A commitment is fulfilled if an implementation milestone advances without new default. Otherwise it is recorded as BROKEN; trust, legitimacy and risk respond. Exit is possible at a reputational cost.
- Judicial perspective: may use PUBLIC_HEARING, DECLINE and (where applicable) EXIT_PACT; must NOT sell a judgment or bargain about a verdict. No accepted pact can alter the judicial ruling.
- F7 neither implements multi-player nor the autonomous server clock (F9). `f7FastForward` is explicit local tick advancement and stops at strategic rejection, broken promise or model-critical event.

## Transition and user cycle

`f7Initial` → F3/F4 institutional and judicial story through `f7Play` strings → F6 economic transition → eight quarterly calls to `f7Play({move,other,choice,strategy})`. Every quarter includes a social move, a counterpart, a V9 approach and one economic role action, followed by endogenous response and due-date commitments. The action is atomic: invalid economic/reticular actions cannot commit the preceding negotiation. Player can inspect counterparties, accessible pacts and past strategic outcomes, or test a within-model counterfactual.

Moves: PROPOSE_PACT / DEMAND_CONCESSION / PUBLIC_HEARING / DECLINE / EXIT_PACT. Deal acceptance is not automatic. Bargaining hard can generate higher short-term support but loses trust if refused. Public hearings favor procedural legitimacy at a production cost. Refusing preserves autonomy but forfeits immediate coalition gains. Exit costs reputation.

## Local DoD gates and falsifiers

1. All five human roles reach eight-quarter terminal outcomes with four autonomous F6 NPCs, preserving earlier judicial/institutional state.
2. Independent NPC accept/refuse choice changes with seed, trust, public state and ask; an invented private balance parameter triggers rejection.
3. Successful agreements create an obligation with a due quarter; broken obligations generate observable trust and risk loss. Revocation never erases prior commitments.
4. Judge cannot make outcome-related bargains. Founder cannot promulgate law. No new powers are minted by social trust.
5. No economic balance creation or journal mismatch, 600-unit consolidated ledger preserved in F7 audit.
6. Non-command / stale / illegal other / extra fields are rejected without state modification. Current F7 view detached, other actors' confidential data not included.
7. Node regression plus 150 five-role seeded integration tests, 300+ full audit episodes with replay and 5-role Chromium browser smoke.
8. CI on exactly the published head SHA; code provenance manifest matches local verified source bytes; PR stays Draft; no auto merge.

## Critical epistemic debt

Sociological utility and acceptance thresholds are authored game-design parameters. Tests show diverse behaviors and materially different decisions, but neither player enjoyment, calibration on observed strategic games, nor stable Nash equilibria. Real engagement requires independent human testing (F10). F8 provides accurate Europe atlas and approved/rights-checked illustration assets. F9 provides durable, server-owned async time. F11 closes the 16-quarter campaign and release/security gate. F7 is not the full game DoD.
