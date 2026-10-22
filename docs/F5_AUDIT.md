# CIE F5 independent-ish local engineering audit (not third-party certification)

The supplied evidence is generated from the exact local source of this candidate PR. Final remote claims require a CI run on the published head SHA.

- `npm run verify:f5`: Node regression + seeded audit; 1,055 tests PASS.
- `proofs/F5-audit.json`: 1,000 complete campaigns, all five roles/200 seeds each, 1,000 replay matches, no ledger reconciliation failures, 1,000 distinct user-policy vs NPC-policy state trajectories. Outcomes distributed over durable, fragile, stalled; NOT empirical balance/engagement data.
- `python scripts/browser_f5_smoke.py`: five Chromium role journeys, 8-quarter endings, export/import replay and no JS errors. **Module inlining** due container's localhost policy, not a proof of deployed HTTP app.
- `src/time_contract.mjs`: bounded, version-leased pure due-window algorithm for future server, not the server itself.

### Known open defects / debt

- Current F5 subledger is not a complete macroeconomic SFC system; prices, stocks, full interest, accounting sectors/guarantees and insolvency resolution require F6.
- F5 is an eight-quarter economic phase appended to a fictional two-dossier F4 prologue, not the final interconnected 16-quarter campaign.
- NPC heuristics are demonstrably variable but have not been evaluated for human strategic believability or fairness.
- No real 24/7 persistent world service, no real-world geospatial GIS, no independent security or usability audits.
- F5 lives entirely client-side; no protection from the local owner reading hidden state. The replay checksum is noncryptographic.
- User tests required before G14; playing data statistically in silico does not certify fun.
