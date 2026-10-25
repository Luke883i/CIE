# Runtime × semantics × evidence × release gate

| Dimension | Implementation | Falsifier | Measurable DoD | Status | Release gate |
|---|---|---|---|---|---|
| Canonical rules | `src/strategy.mjs` imported by `convergence/ac04/src` | Git blob drift | 7/7 SHA identical; replay tests pass | PASS_LOCAL | G01–G02 OPEN |
| 5 role data scopes | AC03 SQLite authority | Unauthorized role read | Cross-role requests rejected; no forbidden sentinel in role views | PASS_LOCAL | G03, G17 OPEN |
| Durable idempotency | SQLite WAL ledger and idempotency | Duplicate requests, process crash | 1 effect / unique key, correct after kill and reopen | PASS_LOCAL | G05 OPEN |
| Shared 5-human world | AC03 one-quarter only | Compare F7 and AC03 schema/history | `sameWorld=false` and translation denied | BLOCK | G01, G03 OPEN |
| 16-quarter campaigns | Neither AC03 nor F7 | Run 5-human 16-quarter world | All 5 roles 16 quarters, determinism | BLOCK | G13 OPEN |
| UX per-role | AC03/04 experimental web desks | Role misinformation, keyboard/accessibility | Local web HTTP and independent human evaluation | PARTIAL | G19 OPEN |
| INK & BLEU style | `design/INK_BLEU_CANON.md`, CSS copies | Render mismatch across modes | Cross-mode image regression and human readability | DESIGN_ONLY | G19 OPEN |
| 30 curated scenarios | `design/SCENARIO_ATLAS_30.md` | Generator cannot execute scenario | 30 scenario E2E proofs on same engine | DESIGN_ONLY | G12 OPEN |
| Narrative provenance | AC03 event sourced comic panels | Comic reveals private facts | Every panel has permitted event refs | PASS_LOCAL | G15–G17 OPEN |
| Requirements completeness | `assurance/holistic_reticulum_ac04.json` | Remove node/edge/falsifier | 146/146 linked, 32 release gates, invalid mutation rejected | STRUCTURAL_PASS | G32 OPEN |
| Supply chain | Partial SPDX inventory | Unknown license or nonreproducible asset | Approved full dependency/art inventory and rights | BLOCK | G29 OPEN |
| External validation | Nothing in this PR | Comprehension, fun, a11y failure | Human/independent results on actual release build | BLOCK | G19/G31 OPEN |

**Statuses are not interchangeable:** PASS_LOCAL tests are not release proofs; BLOCK cannot be offset by any other status.
