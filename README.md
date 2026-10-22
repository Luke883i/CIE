# CIE — Costantino I d'Europa · F8 LOCAL

**F8 European Atlas & Design:** fully offline geographic navigation over the existing deterministic F7 five-role single-player institutional/strategic world. **Local pre-PR only:** no remote GitHub action has been performed for F8.

## Play

Requires Node 22+ and Python 3 only for the optional static HTTP server.

```bash
npm run serve
# http://localhost:8080/web/f8.html
npm run verify:f8
python scripts/browser_f8_smoke.py  # optional Chromium smoke, requires Python Playwright and /usr/bin/chromium
```

Experience: choose one of five roles and seed, inspect the real offline geography, switch from countries to scenario institutions or illustrative relationships, search and select a country, zoom/pan, then finish the same two institutional dossiers and eight economic/negotiation quarters. Replay remains F7 versioned and fully deterministic. Older `/web/f7.html` stays runnable.

**F8 geographic navigation never changes world state or invents territorial socioeconomics.** Boundaries are generalized Natural Earth 1:110m; Malta uses a documented approximation. Institution and relationship overlays are navigation aids in a fictional world, not empirical measures of political influence.

## Evidence

- `docs/F8_CONTRACT.md` — game/UI/role/world invariants and local DoD.
- `docs/F8_AUDIT.md` — results and known defects.
- `docs/GEO_SOURCE_POLICY.md` — public-domain geometry provenance, transformations and original illustration manifest.
- `design/F8_DESIGN_SYSTEM.md` — implementation-level design tokens and accessible component contracts.
- `docs/TRAJECTORY_T8.md` — convergent roadmap to F9 server persistency, F10 playtesting, F11 release.
- `proofs/F8-audit.json`, `proofs/F8-browser-report.json`, screenshot PNGs.

**Limits:** no real HTTP-deployment verification (Chromium container blocks localhost), no full WCAG AA certification, no human playtest, no persistent server when browser closed, no localized economic simulation. F8 is not CIE 1.0 and has no production security claim.


### F8.1 · Command palette and territorial watchlist

Open `/web/f8.html`. Use **Ctrl/⌘+K** to find 32 territories, map lenses or jump to decisions, diplomacy and chronicle. Pin up to five places from the inspector. The quick navigation row works with keyboard and mouse; these features change **only UI presentation**, not the F7 save or game digest. The dedicated sources are `src/atlas_ui.mjs`, `tests/f8_ui.test.mjs` and `web/f8-enhancements.css`.
