# CIE Design Language 0.8 · normative UI tokens and interaction patterns

## Design goals

**Warm institutional atlas**: combine legibility and systemic gravitas without impersonating an official institution. The interface should make five elements obvious at a glance: who I am; which world/time I inhabit; where I may navigate; what I may decide; what has changed because I acted. Use dignified, playful, non-coercive presentation (no dark patterns or pay-to-skip pressure).

## Foundations

| Token family | Runtime representation | Semantics |
|---|---|---|
| Navy | `#101f35`, map `#183446` | Stable world backdrop |
| Avorio | `#f3efe7`, `#fffcf7` | Reading surface |
| Teal | `#1b5248`, map-EU `#6e9888` | Active choice, EU status |
| Amber | `#e6b56d`, accent `#c88b3b` | Selection and editorial emphasis |
| Secondary neutral | `#b4aa98` | Non-EU states; not a quality ranking |
| Typography | Georgia/serif editorial; system UI operational | Readability offline, no licensed font load |
| Spacing | 4/8/12/16/24 px grid | Consistent interaction spacing |
| Radius | 7–16 px | Distinct control/card hierarchy |

Read textual selection labels alongside color states. Selected countries use `aria-pressed=true`, amber stroke and a detached details panel, not hue alone. All SVG countries have accessible names and can receive keyboard focus. Provide a `select` alternative and a search field for smaller shapes. All transitions honor `prefers-reduced-motion`.

## Components

`Topbar` role + world heading; `CharacterDesk` selects role & seed; `Atlas` geographical navigational projection; `AtlasLayerTabs`; `GeographyInspector` details + alternate country list; `Timeline`; `CauseAndEffectPanel`; `DiplomacyTable`; `WorldMetrics` aggregate game indicators; `DecisionPanel`; `TimeTransport` skip 1/2/4 quarters; `ReplayTransfer` export/import.

F8 avoids building a second game store: front-end render computes derived UI state from `f7Observe`. No spatial effects or secret counters are generated client-side. Module boundaries separate `atlasModel` from graphics renderer and from F7 reducers.

## Responsive and accessibility

Desktop 3-column desk/map/log; 1080px map/inspector stacks; 780px all sections stack; 390px tested. Focus indicator uses existing global focus style plus white country stroke. Mouse actions have explicit buttons. Tested: Chromium keyboard Enter selection, five end-to-end role journeys, zoom/pan/lens/search/asset rendering. Not yet tested: multiple screen readers, comprehensive WCAG 2.2 AA, gamepad/mobile gestures, cognitive accessibility interviews — required in F10.

## Illustration semantics

Two authored SVG motifs: 'mandate' architecture as continuity of office beyond person and 'diplomacy' multiple actors tied by non-command relationships. They are editorial metaphors, **not factual representations** of European constitutional monuments, parties or court buildings.

## Next UX layer

F9 must add consistent asynchronous progress and notification receipts without dark patterns. F10 requires 20 external playtests, instrumentation and iteration. F11 produces released asset set, licensed inventory, production perf/a11y checks and deployment smoke.


## F8.1 · Editorial usability refinement (2026-10-22)

**New design tokens (live, CSS):** `--cie-paper`, `--cie-surface`, `--cie-navy`, `--cie-teal`, `--cie-gold`, `--cie-focus`, `--cie-shadow`. `web/f8-enhancements.css` is imported directly by `web/f8.css` and is bundled offline. Reduced-motion and increased-contrast variants are declared, not assumed certified.

**Navigation affordances:** persistent four-destination quick route; a command-palette modal opened by Ctrl/⌘+K for 32 locations, three map lenses, and four page destinations; accent-insensitive search with ArrowUp/ArrowDown, Enter and Esc; watchlist of up to five territories in this browser session. Choosing a territory from the palette updates the geographic inspector, never the canonical world. Bookmarks do not persist in saves and have no causal effects. New game explicitly clears the watchlist.

**Control hierarchy:** top-level command-search button is secondary, atlas lenses are exclusive pressed states, country selection remains amber plus text and SVG `aria-pressed`, bookmarks have independent pressed state, all navigation affordances operate without a mouse. Search UI is confined to whitelisted, static `commandCatalog` entries from bundled geography; no generated authority or socio-economic country metrics.

**Proof and honesty:** the palette has no game commands and cannot create a legal/economic act; `src/atlas_ui.mjs` is pure and tested separately. Five end-to-end Chromium role paths exercise palette/bookmark/jump as well as game/replay. Contrast and screen readers require independent F10 verification; this is not a claim of full WCAG conformance.
