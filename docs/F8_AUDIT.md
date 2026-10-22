# CIE · F8 pre-PR technical audit

**Audit date**: 2026-10-22. **Candidate state:** verified F8 source candidate; remote PR status tracked separately on GitHub. **Verified base**: `Luke883i/CIE` main `3fa136d2d2366054e780635c0abc7f3095b2c390` (merged PR #7, CI success). Ten essential F7 source Git blob hashes were compared to that main tree and matched exactly.

## Direct reproducible tests

| Claim | Evidence | Status |
|---|---|---|
| All previous engine tests preserved | `npm run verify:f8` includes all F1–F8 test files: **1,509/1,509** passed | PASS in local Node 22 |
| Offline European coverage | 32 unique Natural Earth-derived regions: 27 EU, 5 partners; Malta approximation explicitly flagged | PASS data/contract |
| Same authoritative world | 500 seeded worlds (100 per human role), 12,000 role/lens/country projections, 500 unchanged authoritative digests | PASS in local projection audit |
| No country-level inferred cash/politics | No injected local finance, votes or judicial outcomes; each of 12,000 projections checked | PASS in scoped audit |
| Browser E2E | Five complete F7 journeys in F8 Chromium UI including institutional phase, strategic decisions, end, replay export/import | PASS local inlined smoke |
| Keyboard/text accessibility | 32 SVG paths with labels, tab focus and Enter selection, alternative country select/search, layer buttons, zoom and pan buttons | PASS exercised behaviors, not WCAG certification |
| Offline HTTP paths | 10 local HTTP asset routes all 200 and byte-for-byte equal to working files | PASS asset routing only |
| Genuine production hosted browser | Browser navigation to localhost blocked by environment, so test inlines otherwise unchanged source modules | NOT VERIFIED |
| Real players' engagement | No external human playtesting | NOT VERIFIED |
| Complete WCAG 2.2 AA, screen readers, contrast | Partial implementation and programmatic/manual visual checks only | NOT CERTIFIED |
| Local territorial cause-effect | F7 does not model regional stocks; atlas refuses to synthesize them | INTENTIONALLY ABSENT |

## Falsify → refine evidence

1. First data import assumed `iso_a3='FRA'` and failed because the fixture labels France `-99` (same issue for Norway). Corrected mapping by explicit country name, retained immutable 32-country register.
2. The first browser test caught an initialization-order error (`atlasLens` read before its declaration), corrected by postponing `initAtlas();render()` until all map state is declared.
3. The first institutions lens changed only explanatory text. Added five explicitly fictional institutional navigation pins and tested them in Chromium.
4. Initial desktop had excessive empty sea space from inspector/map height mismatch. Rebalanced map rendering; tested mobile 390×844 and desktop 1700×1000.
5. Accessibility needed no-mouse navigation: added country focus/Enter/arrows and explicit directional pan/zoom/reset controls, plus textual search/list alternative. Browser audit confirmed they do not change game digest.
6. Original SVG illustration did not appear in the inlined Chromium smoke due to its artificial `about:blank` origin. Smoke now embeds the exact SVG file bytes into the test HTML; runtime HTML retains the ordinary local relative file path, verified via HTTP asset smoke.

## Highest remaining risks

**R1**: 1:110m geography is generalized, clipped and may have disputed-border portrayals; not a precise authoritative GIS representation. **R2**: location of the five scenario institution pins is illustrative, not actual institutional coordinates. **R3**: no genuine country-level local economic model. **R4**: screen readers and independent accessibility audit have not been carried out. **R5**: no browser-closed persistent advancement (F9). **R6**: no validated enjoyment or external playtest (F10). **R7**: eight-quarter demo, not final sixteen-quarter campaign (F11). **R8**: project application license and production deployment not selected (F11). **R9**: `main` branch was still unprotected during the base check. **R10**: full external source/V9 causal validation remains out of scope for the F8 atlas.

**Epistemic verdict**: F8 bounded local functional DoD **PASS within stated test scope**. Global publishable-game DoD **FAIL (not yet met)**. No independent certification, no remote PR, no production HTTP verification.

## F8.1 adversarial re-audit (after refined interaction layer)

- Regression: `npm test` includes 104 new UX model assertions plus prior 1,509 = **1,613 Node PASS**. The scope includes 100 world-digest-preservation checks, catalog constraints, accent-insensitive input and bookmark validation.
- `npm run audit:f8` produces the same 500 worlds, 12,000 projections, 500 preserved digests and zero anomalous synthetic territorial statistics.
- Chromium: five roles complete the full F7 episode, and on each role the browser smoke invokes Ctrl+K, filters Germany, enters selection, adds/retrieves bookmarks, changes lens via palette, jumps to decision and confirms unchanged canonical world digest.
- Falsified defect: importing the enhancement CSS at the end of the original stylesheet violates CSS `@import` placement; moved import to header and updated browser harness to include the exact offline layer.
- **Outstanding**: no independent WCAG audit or user engagement study; tests use inlined modules to bypass container Chromium localhost limitation. No server-persistent world. No network/principal secrecy. No authenticated deployment.
