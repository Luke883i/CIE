# CIE convergence · two actual runtime lanes · release BLOCK

This directory adds the AC-03 shared experimental Golden Crisis and the AC-04 **separate** durable canonical F7 lane to the real GitHub repo without replacing `src/strategy.mjs`, the F7 economy, legal reducers, the web root, or the existing releases. It imports canonical F7 directly from the same `main` tree. **This is source/contract transplantation, not a five-human lossless semantic unification.**

## Actual runtime integration

| Lane | Software runnable | What it proves locally | What it does NOT prove |
|---|---|---|---|
| `ac03` | Node+SQLite five-role single shared experimental quarter, REST, order and commit, INK & BLEU UI | 5 role projections, legal/financial collision, crash/idempotency tests | 16 quarters; F7-equivalent canon; production auth/TLS |
| `ac04` | Canonical F7 read-only scoped views + idempotent SQLite steps, REST and UI | Provenance-preserved F7 replay per role, durable local steps | Same shared world for five humans; multiplayer game |
| `assurance` | 1,100-node inherited semantic graph, 2,714 edges, 146 micro-DoD, 49 AC03+AC04 local DoDs and fail-closed checker | Traceability, integrity and explicit BLOCK | Human playtesting, completed runtime, security certification |

## Verify locally

`npm run verify:convergence` runs 30 tests and the fail-closed structural assurance checker. Legacy regression is independent: `npm run verify:dual` and `npm run verify:legacy`. `npm run verify:convergence:deep` combines all. Source pins require canonical source exactly equal to the original main baseline.

`node convergence/ac04/scripts/bootstrap.mjs local.sqlite PRIVATE.json 41` creates five **independent** local F7 campaigns. `CIE_AC04_DB=local.sqlite node convergence/ac04/server/http.mjs` binds loopback. Never publish the generated tokens.

`node convergence/ac03/scripts/bootstrap.mjs local03.sqlite PRIVATE03.json 41` creates one experimental shared world. It is **not** the F7 world; do not mix tokens, database schemas, replay or balances. Both interfaces are local experiment consoles, not hardened internet services.

## Required next gates

G01 unified multi-actor canonical state; G02 replay; G03 distinct mandates; G05 joint atomic orders; G07 material/social propagation; G13 full 16-quarter campaigns; G17 server-scoped secrets; G19 accessible and comprehensible UI; G32 reviewed assurance; independent human playtesting. All **32 global gates OPEN** and release BLOCK.

See `migration_manifest.json` for per-artifact provenance and the unchanged archived bundle SHA-256. Bundle binary snapshots, native images, and historical logs remain external evidence, not source-integrated deliverables. Their absence is tracked as an equivalence gap rather than concealed.
