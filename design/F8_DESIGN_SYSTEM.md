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
