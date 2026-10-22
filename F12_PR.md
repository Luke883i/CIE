# PR #12 · feat(gameplay): RG1 Two Goals, One World

## Problem and solution

The original gameplay asked the player to fulfil the digital pact, but did not tell each character what their **personal job** in that same world was. The new Focus UI reveals shared win condition (progress >=4 and defaults==0 at Q8), one distinct personal role task, current own-action progress 0/2, personal final requirement and a concise optional tradeoff disclosure. The authoritative F7 simulation is NOT modified. Each role task counts only the human's actual economic commands in the F7 replay and reads only their authorized observation.

## Falsifications

- Node regressions: 1646/1646 PASS.
- `audit:dual`: 1000 unchanged-world projections, 200 complete campaigns, 2140 legal actions, 200 identical replays, zero anomalies. Final outcome quadrants in those campaigns: both 40, global-only 95, personal-only 34, neither 31.
- `audit:goal`: 1000 goal projections, thresholds match `finalOutcome()`.
- `audit:f8`: 12000 geographical projections; `audit:f10`: 100,000 legacy semantic mutations.
- Chromium inlined-source: 5 roles × (1440×900, 390×844) = 10 full campaigns, with first CTA in viewport, dual end, no JS errors, replay import/export.
- Regression and legacy audits run in independent GitHub CI jobs, both required for PR review.

## Explicitly unproven

No human fun, cognitive load or UX comprehension measured. No persistent server clock or complete 16-quarter game. No real-world causal calibration of V9. No production HTTP/browser deployment or independent WCAG audit.

## Reviewer checklist

Check exact SHA; compare Git blob manifest; ensure authoritative `src/strategy.mjs`, `src/economy.mjs`, `src/reticulum.mjs` unchanged; test 5 role endings and dual outcomes; verify no private NPC data surfaced; keep PR Draft until reviewed.
