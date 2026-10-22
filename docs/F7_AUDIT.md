# CIE F7 adversarial audit — 2026-10-22

## Technical evidence

- Baseline GitHub `main` was `fb0ac0d98ea0739c3dd8828bf300574a9141f332`: PR #6 merged, GitHub Actions success. PRs #1–#5 were already merged and verified.
- `npm test` and `npm run audit:f7` (see `proofs/F7-audit.json`) exercise five actor contexts, all earlier regressions, seeded NPC policy, legal/financial fences, commitments, replay and trust. `python scripts/browser_f7_smoke.py` runs Chromium on inlined unchanged local modules to avoid container localhost browser restrictions; **not a hosted HTTP deploy proof**.
- `F7-audit.json` reports the *actual* number of completed episodes, 8-quarter transitions, NPC accepted/rejected responses, reconciled accounts, fulfilled/broken commitments and replay discrepancies. There are no empirical players in this sample.

## Mutation and negative cases

| Attempt | Required defense | Verification |
|---|---|---|
| A judge tries to bargain an outcome | Rejected before authoritative update | Test F7 |
| Actor selects themself or nonexistent counterpart | Rejected without mutation | Test F7 |
| Command smuggles extra input fields | Rejected without mutation | Test F7 |
| NPC receives a private financial field | Refuse malformed NPC observation | Test F7 |
| Promise becomes due but project stagnates | Mark broken and reduce trust | Audit |
| Player exits an active deal | Explicit terminal EXITED, reputational cost | Test F7 |
| Replay altered after session | Deterministic mismatch rejected | Test F7 + audit |
| 600 units of canonical cash change without journal | Cross-ledger error | Legacy F5/F6 + F7 audit |
| Fast-forward skips a rejected deal | Stop reason STRATEGIC_OR_SYSTEMIC_EVENT | Runtime path |

## Falsifications and refinement

- Initial offer acceptance was about 12.7% over 300 seeded episodes — too many rejections for the default gameplay path. A *game-design* re-tuning reduced the base threshold to 9; this increases the number of bilateral bargains that can be realized, with terms still sometimes rejected and agreements sometimes broken. **This is not evidence of human fun; only a design calibration.**
- NPCs have a bounded public-information utility estimate, deterministic individual preference, and bilateral trust. They do not jointly solve a full information game, estimate real political motives or learn from human users.
- Legal guarantees cannot be purchased or traded by the judge; the Court remains autonomous according to the F4 rules.
- Long-campaign fatigue, emotional salience, non-compulsive time loops, time-to-first-interesting-decision and WCAG 2.2 AA are still not assessed with people.

## Verdict

F7 is eligible for **bounded local DoD** once results and GitHub CI are attached to identical SHA; it is NOT a release, independent security certification, validated political forecasting or V9-causal proof.
