# CIE — Costantino I d'Europa · F6 Reticular V9

A deterministic fictional political game with five perspectives on the same world, a court, institutions, economy, real cross-book cash transfer and source-linked V9 T0–T5 dynamics. **Playable alpha, not the finished European game or an empirical causal model.**

## Play

- Node.js 22+ for verification; Python 3 for optional local static server.
- `npm run serve` then open **http://localhost:8080/web/f6.html**.
- Choose a role and V9 case. Original V9 source registry comprises 1,037 UID records; 37 are curated source cases, but only five generic runtime domain mechanisms are implemented. Select one of three strategy styles, then a role-specific decision each quarter; NPCs progress autonomously. Use 1/2/4-quarter fast-forward, replay export/import and view the case-specific T0–T5 synthetic chain.
- Offline UI requires no model API or internet calls; it still exposes local game state to its owner.

## Verify

```bash
npm test                         # all legacy + F6 regression tests
npm run audit:f6                 # reproducible F6 seeded episodes
npm run verify:f6                # tests + audit
python scripts/browser_f6_smoke.py # optional local Chromium + Playwright
```

## Contracts and evidential limits

- `docs/F6_CONTRACT.md`: state semantics and non-compensable rights gates.
- `docs/F6_AUDIT.md`: proof and adversarial debt.
- `docs/TRAJECTORY_T6.md`: F7–F11 to publishable-game DoD.
- `data/v9-provenance.json`: SHA-256 of original source corpus and inventory.
- `proofs/F6-audit.json`, `proofs/F6-browser-report.json`: reproducible model-only evidence.

Source data from user's V9 bundle; all in-world actions are **fictional**. 1,037 imported source records do not equate to 1,037 validated mechanisms. F6 does not establish real-world causal effects, macroeconomic validity, independent legal compliance, true multiplayer secrecy, or verified human engagement.
