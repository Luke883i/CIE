# CIE — Costantino I d’Europa · F8bis Bluiette

**Playable single-player with a deterministic shared fictional world.** Open `/web/f8.html`: the next meaningful action is now the first visible component, above the atlas. Three decisions, one primary CTA, observer-based feedback, a coherent blue gradient design and optional depth.

**Run** `npm run serve` and open `http://localhost:8080/web/f8.html`.

**Audit** `npm run verify:f8bis` or independently `npm test`, `npm run audit:f8` (atlas) and `npm run audit:f8bis` (100k UI-semantic mutation scenarios, 200 reachable sessions). Optional browser smoke: `python scripts/browser_f8bis_smoke.py` (Chromium + Python Playwright).

F8bis **does not alter** the F7 authoritative engine, the 1,037 V9 source registry, legal rules, NPCs or money ledger. Existing advanced gameplay is still available through disclosure. The 100,000 scenarios are typed UI-semantic projection stress cases, **not 100,000 full campaigns or empirical human playtests**. The full game is not release-ready: F9 persistent server, F10 human engagement testing, F11 16-quarter release remain.

See `docs/F8BIS_CONTRACT.md`, `docs/F8BIS_AUDIT.md`, `docs/F8BIS_TRAJECTORY.md`, `design/BLUELETTE_DESIGN_SYSTEM.md`.
