# F2 audit · 2026-10-21

## Evidence

- Unit/property paths: `npm test` – all assertions passed locally.
- Deterministic broader stress: `npm run audit` – 5,000 terminal episodes, 1,000 seeds per human profile, exactly 5,000 replay matches and conserved ledgers (`proofs/F2-audit.json`).
- Chromium local UI: `python scripts/browser_smoke.py` – five human-role journeys reached a terminal screen, judge's accessible history did not contain private financing, and no JavaScript page errors (`proofs/F2-browser.png`). Browser navigation to HTTP URLs was blocked by the container policy; smoke used browser page content with locally inlined JS/CSS. This is a real Chromium execution, NOT an HTTP-deployment proof.

## Adversarial matrix

| Case | Expected | Local result |
|---|---|---|
| Same seed, alternate perspective | Canonical worldId equal | PASS |
| Tamper detached observation | World unchanged | PASS |
| Financial secret shown to judge in event list | No | PASS |
| Unauthorised promulgation | Rejected | PASS |
| Judge acts before case | Rejected | PASS |
| Stale turn | Rejected | PASS |
| Duplicate financing | Rejected | PASS |
| Extra command fields | Rejected | PASS |
| No-financing enactment | UNFUNDED without new money | PASS |
| Ambitious underfinancing | UNFUNDED, conserved money | PASS |
| Replayed archive altered | Deterministic rejection | PASS (accidental corruption only) |
| Seed varied decisions | At least 3 NPC decision sequences | PASS |
| 5 x 1000 bounded episodes | No deadlocks | PASS |

## Adversarial findings and caveats

1. **Not cryptographically certified**: replay FNV checksum can be recomputed by an adversary. Network multiplayer would require server authority, signatures and audit evidence.
2. **Not private from browser owner**: authoritative state and NPC code are client-side. Privacy is enforced at view API, not against a user inspecting JavaScript memory.
3. **No statistical fairness certification**: endings vary by chosen role and seed; goal quality and role balance remain F7/F9.
4. **Simplified law**: automatic civic filing and a single fictitious judicial delegate are not appropriate as statements of real-world institutional procedure. Replace through F4.
5. **Static institutions**: current identity is typed but vacancy/appointment/succession cannot occur; explicit debt F3.
6. **No global DoD**: socioeconomic model, V9 causal coverage, geo-UX and complete campaign are open.
7. **Remote CI** must be checked after publishing the F2 branch, and results must refer to the same SHA; local results alone are not a remote audit.

Verdict: **F2 bounded-runtime DoD locally PASS; global game DoD NOT MET.**
