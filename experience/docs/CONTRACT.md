# EX-01 — Bounded Golden Crisis playable episode: Audit 1–3 contract

## Scope and protected baselines
- Base: live GitHub main `29e2b1691bf411f7c84e0552e301fcbe24fdc185`, after PR13/PR14 merged.
- Source of truth for transitions: `convergence/ac03/src/golden_crisis.mjs`, Git blob `91c946bfb3160d5666c24c9b9b8860c3cb20929d` (untouched).
- Source for roles: `convergence/ac03/src/v3_immutable.mjs`, Git blob `14d31ebae228dca2cdf3b11f24f16d470c7bdf2e` (untouched).
- F7 remains canonically independent; EX01 does not pretend to implement the full five-human F7/V3 merge.
- Release status: BLOCK. Every global `GATE-G01` through `GATE-G32` stays OPEN.

## Contract and DoDs, no compensation
| ID | DoD / measurable property | Test / evidence | State |
| --- | --- | --- | --- |
| EX01-01 | A first-time visitor can read premise and explicit goal before decision | HTML semantics + browser smoke | LOCAL_PASS |
| EX01-02 | Exactly five role turns in an episode, no extra user-configuration | Node and browser | LOCAL_PASS |
| EX01-03 | Each role can select only its kernel-authorized action | `episodeView`, `draft`, negative mutation | LOCAL_PASS |
| EX01-04 | Zero action (`HOLD`) remains legal with autonomous maintenance | Replay cases | LOCAL_PASS |
| EX01-05 | Shared resolution occurs after all five intents, not after each | Node phase assertion | LOCAL_PASS |
| EX01-06 | Three causal branches: credit enables both; scarce treasury limits; judicial stay blocks | Deterministic branch tests | LOCAL_PASS |
| EX01-07 | Two projects and treasury visibly compete, end has explainable state | Browser and source receipts | LOCAL_PASS |
| EX01-08 | Every comic caption is traceable to an authorized event ID | 960 synthetic runs + browser | LOCAL_PASS |
| EX01-09 | Zero fictional private notes in public result / graphics / alt | Sentinel tests (not security audit) | LOCAL_PASS |
| EX01-10 | Preview and rejected order never mutate authoritative source | Digest tests | LOCAL_PASS |
| EX01-11 | Replay identical across simulated seeds and all three strategies | 960 runs, replay | LOCAL_PASS |
| EX01-12 | Sum of ledger balances preserved for every run | 960 runs | LOCAL_PASS |
| EX01-13 | EX01 does not modify the existing kernel, F7, ICTC registry or protected source tree | Git blob checks, patch allowlist | LOCAL_PASS |
| EX01-14 | Responsive keyboard-reachable HTML with reduced-motion support | Chromium 1440/390; static accessibility constraints | PARTIAL |
| EX01-15 | Alternate UX representations tested with real humans (n>=30 per candidate) | Pre-registered study, not executed | BLOCK |
| EX01-16 | Independent multiplayer identities and reliable release deployment | External integrated full test, not executed | BLOCK |

## Orthogonal audit crosswalk
- **Audit 1 / product reality:** exactly ONE local episode and TWO actual outcomes (`FULL`, `PARTIAL`), five sequential role choices on a single browser. No 16-quarter shared campaign; no claim of commercial release.
- **Audit 2 / governance & evidence:** exact kernel source pin, evidence trace in every dynamic comic, deterministic replay and negative tests, fail-closed on unauthorized orders. ICTC main registry remains unchanged and global PASS never asserted.
- **Audit 3 / experience emergence:** intentional narrative stakes, choices conflicting over funds and legal competence, side-by-side thematic board and detail, ending and causal memory, optional replay. More complex variants and human comprehension/agency/fun remain open: synthetic mutations do not choose the optimal interface.

## Honest limits
- Browser hotseat stores a full world in JS memory; it **does not protect actual secrets** against a user inspecting the devtools. Full privacy requires the AC03 server and a production identity perimeter.
- Browser smoke uses exact module sources in data URLs because local HTTP browser navigation is restricted in this sandbox. That **does not certify** hosted routing or production deployment.
- Fixed opening seed 41. One crisis, one quarter. Only two projects, three simulated social cohorts. No human playtesting. Narrative panels are typographic comic abstractions, not a complete art pipeline.
- Performance and screen reader tests are not independently certified. EX01 is a **playable vertical slice**, not proof of optimal UX or commercial completeness.

## Manual reproduction
`node --test experience/tests/episode.test.mjs`
`python3 experience/tests/browser_smoke.py`
`python3 -m http.server 8080` then open `http://localhost:8080/experience/web/`.
