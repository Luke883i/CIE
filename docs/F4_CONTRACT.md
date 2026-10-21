# CIE F4 — Judicial Chain & Remedies · Normative Runtime Contract

Version `CIE-F4-1.0.0` · parent `CIE-F3-1.0.0` · scenario `EUROPA-ALTERNATIVA-REMEDIES`.

## Foundational assertion
A court must be an institution with procedures, evidence, panel independence and remedies, not an arbitrary `STRIKE` button. F4 uses exactly the *same* world record established by F3 (people, mandates, institutions, financial subledger, events, dossiers and historical signatures) with an additional judicial substate. It does not create alternative histories per observer. F3 and F2 remain versioned, directly executable historical scenarios.

## Closed-world pipeline and authority
1. A fictional duly promulgated dossier is reviewable during its corresponding `A_REVIEW`/`B_REVIEW` procedural window; a dossier not promulgated is routed to F3's express inadmissibility handling.
2. `CIVIC_ASSOCIATION` alone can initiate a constitutional challenge in this bounded ruleset; incorrect claimant, dossier, deadline or already-filed case is rejected deterministically by `f4PetitionCheck`.
3. Case is registered `CASE-A`/`CASE-B` with standing `ACCEPTED`, fixed claim `PROPORTIONALITY`, fixed first evidence `ENACTED_TEXT`, three-seat panel.
4. A chair holding an *active* judicial mandate chooses between admitting documentary financing evidence and restricting to the public legislative record. Admission creates a public receipt reference but the amount remains sealed to the court and the contractual parties; it must never leak by view enumeration before admission.
5. An independent deterministic assignment gives one panel seat a possible conflict. Chair may recuse and install a case-specific alternate `P-J4`; retaining the conflicted member marks the proceeding tainted and makes unremedied closure impossible.
6. Chair chooses the focus of an adversarial hearing (`HEAR_RIGHTS` or `HEAR_FEASIBILITY`). Both sides' hearing is a stipulated in-game procedure, not a recreation of real litigation.
7. Chair recommendation is one input. A panel of **three** assigned members casts deterministic votes derived from recorded case inputs and seed. Only a majority, not chair fiat, produces a provisional result. The roster, quorum, ballots, decision and evidence are recorded.
8. Remedial review may vacate an irregular panel and rehear once using a different seat; no infinite proceedings. A legally tainted provisional disposition cannot be simply accepted as valid (`REMEDY_REQUIRED`). If no defect is present, optional review is denied without overturning the decision.
9. Final decision is adapted to the F3 policy implementation reducer. Prior economic transfers, mandates, attribution of presidential acts and the other dossier are retained. This adapter still emits legacy F3 `COURT_REVIEW`; F4's distinct `JUDGMENT_REASONS` event is the authoritative record of panel facts for the F4 ruleset.
10. Chronology and underlying finances persist through presidential succession. The former President cannot issue the successor's acts.

## Invariants (all non-compensable)
- J01 One worldId and event stream per `(scenario, ruleset, seed)`; no alternate world by role.
- J02 No court action absent docket, mandate, phase, matching caseId or judicial clock.
- J03 Court roster contains three distinct people and at most one chair; case-specific alternate never grants the former chair wider powers.
- J04 Mandatory standing, phase and duplicate petition rejection.
- J05 Private evidence never appears in unauthorized `knownEvents`; court may disclose proof references but not private raw amounts.
- J06 Every final judgment has `CASE_FILED → HEARING_HELD → COLLEGIAL_VOTE → JUDGMENT_REASONS` in order with same case reference.
- J07 Every majority decision reflects at least two votes and a quorum of three.
- J08 An unresolved conflict blocks finality; remedial vacancy and alternate assignment recorded.
- J09 Mandates and historical presidential signatures stay valid across P1→P2 succession.
- J10 Account balances are conserved and reconciled by the underlying F3 double-entry transfer mini-ledger (NOT macro SFC).
- J11 All NPC policies depend only on detached observations, world seed and fixed ruleset; no internet/LLM, wallclock or Math.random.
- J12 Tampered archives, unknown actions, revoked authority and stale judicial clocks are rejected; digest is a replay checksum, not a cryptographic signature.

## DoD local
- 5 playable perspectives, including Court President (chair), and autonomous NPC counterparts.
- Two connected F3 dossiers and the P1/P2 presidential succession remain playable.
- Court President has at least 4 meaningfully distinct procedural decisions per admitted dossier.
- At least 200 unique seed-role property cases with replay, competence, confidentiality and ledger audits.
- At least 1,000 terminal multi-role F4 episodes with independent replay; at least one irregular-panel remand exercised.
- Chromium end-to-end for five human roles, including view of a judicial process and no page errors.
- GitHub CI green on published and reviewed exact head SHA; no auto-merge, no silent force-push.

## Explicit limits and debt
This is a **fictional, bounded judicial game mechanic**. The panel size, standing rule, evidence rights, voting model, filing timetable, and legal remedy cannot be presented as faithful to actual Italian or EU law. F3 state shapes remain custom, not a production-grade generic graph. Members other than chair are deterministic panel agents without independent full game careers. Offline client state is inspectable by the browser owner. 1,037 V9 dossiers are *not* executed by the new F4 engine. F5 stock-flow economics, F6 typed reticulum, F7 strategic calibration, F8 European map and F9 full 16-quarter campaign remain open.
