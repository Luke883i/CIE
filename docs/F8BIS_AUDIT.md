# F8bis · Adversarial local audit

**Baseline:** merged F8 SHA `839d8ce57d2f29bfd1f0708445fae3e58b4f79e9`. See exact comparison `proofs/F8bis-CTA-comparison.json`.

## Measurable progress

- F8 primary decision container at **Y=1913 px desktop** (1500×960), **Y=3750 px mobile** (390×844); both below initial viewport.
- F8bis primary confirmation CTA at **Y=395 px desktop**, **Y=383 px mobile**; both visible without scrolling. These are DOM placement measurements at first load, not empirical human task-completion measurements.
- Default action needs **one primary CTA click, zero prerequisite configuration interactions**; the user may select among three options or open advanced controls. Former F8 flow presented role, case, V9 approach, counterpart and move before the below-fold choice section. Count measures required UI controls, not mental effort.
- Visual design fully overrides main warm surfaces with Bluiette blue gradients; exact CSS values in `design/BLUELETTE_DESIGN_SYSTEM.md`.

## Reproducible evidence

1. `npm test`: full F1–F8 and F8bis regression.
2. `npm run audit:f8`: 500 world seeds, 12,000 projections, zero atlas authority mutations.
3. `npm run audit:f8bis`: 100,000 typed synthetic semantic observation mutations; see `proofs/F8bis-100k-report.json` and gzipped full corpus. Each has `index`, `seed`, `role`, `phase`, `ended`, constrained choices, computed action commands, and verdict.
4. `python scripts/browser_f8bis_smoke.py`: 5 complete Chromium journeys, including Judge REMEDY, fullscreen and 390px checks, replay roundtrip. The smoke inlines exact ES modules only because this container forbids local HTTP Chromium navigation; production HTTP smoke remains unverified.
5. Cleanroom extraction of final source bundle plus tests to be performed before PR publication.

## Explicit falsify/refine log

- **UI overload:** first meaningful CTA was below several complex panels → move decision first, advanced settings behind opt-in disclosure.
- **NPC omniscience hazard:** do not compute authoritative branch outcome previews → show intent/risk descriptions only, reveal observer-visible deltas after accepting a turn.
- **Judicial illegitimate shortcut:** legacy available list exposed `ACCEPT_OUTCOME` for a tainted panel → decision projection filters it when `court.irregularity=true`, preserving F4 authoritative rejection.
- **Regression in audit harness:** an initial test sent economic command as a simple string to F7 rather than the mandated strategy object → corrected harness, not relaxed engine validation.
- **Mobile reachability:** legacy controls were before the action panel → reorder principal viewport on <=780px, confirmed 390px CTA visible.
- **Aesthetic incoherence:** inherited gold/green role accents conflicted with new design → override original palette systemically while retaining a functional focus-yellow accent.

## Remaining launch blockers

No validated human joy/retention/engagement improvement, no full WCAG/screen-reader certification, no external causal realism of V9, no browser-closed 24/7 scheduler (F9), no 16-quarter release campaign (F11). DoD global **NOT MET**.
