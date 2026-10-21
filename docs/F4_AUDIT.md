# F4 adversarial audit · 2026-10-21

## Actual commands
```
npm run verify:f4
python scripts/browser_f4_smoke.py
```

## Verified locally
- Node combined suite: **794/794** (F1, F2, F3, F4), including 214 F4-specific tests.
- F3 historical regression: 1,000 campaigns, 1,000 exact replays, 42,000 organizational responses, no anomaly.
- F4: 1,000 deterministic episodes, 1,000 exact replays, **1,105** recorded court cases, zero ledger anomalies. Outcomes and appeal coverage in `proofs/F4-audit.json`.
- Remedial cases: **125** irregular panel compositions were vacated and reheard; 160 valid-case review requests denied for lack of defect; 820 accepted uncontested dispositions.
- Chromium: five human-role journeys reached terminal state; judge's private financing exposure only after admissible disclosure; no JavaScript page errors; one F4 courtroom screenshot.

## Negative/abuse tests and evidence
| Falsifier | Result |
|---|---|
| Court chair can act before docket | Rejected |
| Illegitimate applicant passes standing | Rejected |
| Wrong time/jurisdiction accepted | Rejected |
| Stale case clock accepted | Rejected |
| Judicial mandate revoked but power retained | Rejected |
| Mutated observation alters world | Rejected |
| Private raw receipt exposed to non-party before admission | Rejected |
| Unresolved conflicted member leads to legally final judgment | Rejected; rehearing required |
| Majority bypass via chair recommendation | Audit requires two majority votes |
| Verdict exists without petition/hearing/ballots/reasons | Rejected by audit |
| F3 history altered after P1→P2 | Not observed |
| F4 replay changes after save/load | Not observed |

## Epistemic status
- **Supported:** deterministic F4 judicial gameplay and local invariants for the specified model under tested seeds; browser interaction under inlined modules; preserved F3 legacy tests.
- **Uncertain:** diversity of strategies under broad behavioral calibration; cross-browser support; persistence under upgraded rulesets.
- **Unsupported:** external forensic certificate, actual court procedure fidelity, online security/secrecy, global game DoD, full V9 runtime coverage.
- **Debt-blocked:** HTTP-served browser smoke and production build/deployment, economic macro validation, stakeholder/legal-source calibration.

GitHub CI must pass the *published commit* before PR is considered ready for review. No claim about remote CI is supported by this local document alone.
