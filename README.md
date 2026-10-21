# CIE — Costantino I d'Europa

**F3 · Living Institutions (Draft).** A deterministic offline playable episode with one canonical fictional European world, five human entry roles, autonomous NPCs, two causally connected dossiers and succession of the president of a fictional republic. The player follows an individual: P1 remains P1 after losing office, while P2 assumes the presidency without inheriting P1 private information. 21 organizations participate through stances in 3 jurisdiction levels. **Not the 16-quarter public release.**

## Run

Node.js 22+ and Python 3 for a static server:

```bash
npm test                 # F1, F2 and F3 regression/property tests
npm run audit:f3         # 1000 completed F3 careers + replay + conservation
npm run verify:f3        # above tests and audit
npm run serve            # http://localhost:8080/web/f3.html
```

`/web/f3.html` is the new playable vertical slice; `/web/index.html` remains the immutable F2-compatible game. `python scripts/browser_f3_smoke.py` runs a Chromium smoke when Python Playwright and Chromium are installed; local HTTP routing may be blocked in some runners and this script tests inlined production source (not a hosting deployment).

Documentation: `docs/F3_CONTRACT.md`, `docs/F3_AUDIT.md`, `docs/TRAJECTORY_T3.md` and prior F2 contracts. Proofs under `proofs/` regenerate with the documented scripts. The browser owner can inspect the entire fictional state; no cryptographic or multiplayer secrecy claims.

The V9 dataset is not yet integrated into this new engine: F6 must turn source lineage into actual reticular mechanisms and falsifiable gameplay. No legal accuracy or external social prediction is claimed.
