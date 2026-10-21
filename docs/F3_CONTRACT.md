# CIE F3 · Institutions, Mandates & Succession (normative contract)

Version `CIE-F3-1.0.0`. This is an alternate, fictional world, not Italian/EU institutional law. Implemented by `src/institutions.mjs`; F2 replay remains valid against **F2 only** (`src/episode.mjs`). F2 JSON cannot migrate into F3 without an explicit future migration contract; F3 rejects it rather than laundering it into new truth.

## Canonical rules

1. **One world** per `(F3_SCENARIO,F3_RULESET,seed)`. Every action targets the same state object. `f3Submit` is a pure transition and rejects unknown fields, unauthorized persons, forged/expired mandates and stale revisions.
2. **Personal continuity.** The controlled identity is `personId`, not office ID. P1 remains the controlled person following succession; P2 is autonomous and cannot be controlled by P1's client. P1 has two meaningful post-mandate actions, each influencing dossier B stakeholder responses.
3. **Institutional continuity.** `REPUBLIC_ITALIA/PRESIDENCY` retains ID. P1's `M-P1` ends at succession revision; P2's `M-P2` begins at exactly that revision. Historical actions preserve their original `personId`/`mandateId` pair.
4. **Meaningful organizations.** 21 active organizations, seven each at REGIONAL/NATIONAL/EUROPEAN levels, each produces a stance on both dossiers; the 21 reactions affect coalition eligibility for parliamentary adoption. The organization model is schematic, not an organization simulator.
5. **Two dossiers.** A passes proposal -> financing -> vote -> presidential act -> review. A is then frozen and succession occurs through an exogenous, deterministic fictional assembly appointment. B repeats those stages. Financing and implementation use **one shared ledger** across both dossiers.
6. **Informational boundary.** Observer-specific events are reindexed; raw event sequences and total event count are not exposed. Private finance belongs only to financier/founder; a new incumbent does not inherit personal facts from P1. Public policy outcomes can indirectly reveal that funds may have been available; perfect noninterference is NOT claimed.
7. **Agency.** Each of the five starting roles makes at least two consequential decisions in the one continuous F3 campaign; four other roles act autonomously at their scheduled stages. Reactions and outcomes depend on the deterministic seed.
8. **Integrity.** The four-account toy ledger conserves 160 synthetic credits; replay rebuilds full authoritative state and checks an FNV-style digest, NOT a cryptographic MAC. No runtime randomness, clock, LLM, network or personal factual allegations.

## Concrete E2E proof

- A signature is attributed to P1 with mandate M-P1.
- System succession ends M-P1 and grants M-P2 (no overlapping office tenure).
- P1 may publish a response or seek a remedy as former holder; neither option confers a valid presidential act.
- The same world's dossier B is signed or returned by P2 using M-P2.
- Organizational reactions, account transfers, judicial checks and event history survive the change.

## F3 DoD / falsifiers

- 21 active organizations spanning 3 territorial tiers; both dossiers have 21 observable causal stance records.
- 5 role flows in Chromium, each with at least 2 decisions, continuous A -> succession -> B.
- 200 distinct seeded succession states plus 5 x 200 full episode/replay/ledger audits.
- Tampered observation cannot mutate world; no ghost competence; forged credentials, stale revisions, unknown input fields, replay mutation and F2 replay are rejected.
- No powers automatically inherited by P1 or transferred into the player's hands when P2 takes office.
- `npm run verify:f3` passes; local Chromium smoke is supplementary and must not be called an HTTP hosting test.

## Debts preventing global DoD

F3 uses a *fictional* deterministic succession; no elections, constitutional challenge, administrative appeals, disqualification adjudication, real collegiality or evidenced case files (F4). Twenty-one schematic organizations do not constitute a validated model of civil society (F7). The toy ledger is not stock-flow macroeconomics (F5). The full V9 corpus is not causalized (F6). Offline JS does not offer secrecy against the browser owner, digest is not cryptographic, and the episode is not a sixteen-quarter game (F9). GIS and inclusive UX remain F8. No independent certification.
