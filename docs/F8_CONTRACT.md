# CIE · F8 European Atlas & Design — normative runtime contract

**Contract:** `CIE-F8-ATLAS-1.0.0` · **target base:** GitHub `Luke883i/CIE` `main` `3fa136d2d2366054e780635c0abc7f3095b2c390` · **status:** local implementation, **NOT** a GitHub PR, NOT an independent WCAG certification.

## Product goal and E2E

A person chooses one of five existing F7 roles and a deterministic world seed; after institutional decisions, eight economic quarters remain playable against NPCs. The F8 atlas overlays the existing game with 32 offline country geometries, role-specific navigation, five static scenario institution markers, and illustrative relation arcs. A player can select France on a map and Italy with the keyboard, search a country, zoom/pan, switch the lens, take a strategic decision and export/reimport a replay without creating a separate territorial game state. The legal and financial simulation remains F7.

## Source-of-truth and permissions

1. `src/strategy.mjs` / F7 remains the **single authoritative game state**. F8 has NO reducer, game-state copy or direct transfer API. `src/atlas.mjs::atlasModel` accepts a *detached, role-scoped* `f7Observe(session)` projection. F8 UI stores only lens, country, query, zoom and pan as **ephemeral UI state**.
2. `atlasModel` MUST preserve the observed worldId, must not mutate the observation or session, and MUST reject mismatched roles and unknown territory IDs. Only a selected human player can issue moves through existing F7 actions.
3. Territory selection MUST NOT trigger an economic/legal event or change a ledger/digest; changing the lens MUST NOT recalculate a role's hidden information or present country-level wealth, vote share, case outcomes or political ratings absent from the canonical model.
4. No network or LLM at runtime: `data/europe-32.mjs` ships offline; all original illustration SVGs and design tokens ship with the game. `data/europe-32.geojson` is the canonical geography source; the JS module is an identical materialization.
5. Country boundaries are derived from Natural Earth admin-0 1:110m low-res data clipped to the Europe window, projected in fixed equirectangular viewBox coordinates. 27 EU member states + UK, Norway, Switzerland, Ukraine, Serbia (32). Malta is a non-geometric approximate **cartographic symbol** because the low-res file lacks a polygon. This is **not legal border, topographic, cadastral or geographic precision**; map includes no claimed local socio-economic simulation.
6. The role focus list is scenario NAVIGATION, **not empirical political influence**. Institution pins are stable labels pointing to relevant fictional concepts, not positional observations or invented causal effects.
7. A pan/zoom/layer/keyboard interaction changes visualization only. `aria-pressed` reports the selected lens/country; keyboard list/search controls are alternatives when small SVG targets are difficult.
8. F7 original `/web/f7.html` MUST remain runnable, and F8 `/web/f8.html` MUST complete the same legal/economic game for each role with the same core replay algorithm.

## Browser and usability DoD

- 32 unique geometry paths, 27 EU, 5 non-UE, no external map fetches; selection via click/Enter/Space; arrows change focus; textual select and search usable.
- Lens buttons: territories (EU/non-EU), institutions (five labelled pins), relations (role-specific stylized links); labels disclose synthetic representation.
- Zoom 100–400%, bounded pan, reset; buttons support all operations without mouse dragging; at least 390 px responsive view; visible keyboard focus; reduced-motion CSS.
- Five single-player journeys start to terminal and export/import their F7 replay; every map operation preserves game digest.
- Standalone original SVG illustrations accessible through text alternatives; color does not solely encode selectable state; search and inspector announce selected country.
- `npm run verify:f8` runs Node tests and semantic projection audit, browser script documents its execution route separately.

## Acceptance and open debts

The local gate supports **F8 atlas/navigation DoD**, subject to exact source verification and browser audit. It **does not** assert full WCAG 2.2 AA or screen-reader certification, actual local institutional GIS coordinates, dynamic territorial economy, perfect geopolitical borders, measured game enjoyment, genuine hosted HTTP smoke, or persistence at closed browser. These remain G10/G14/G15 user acceptance and F9/F10/F11 tasks. Claims of full game DoD are prohibited.
