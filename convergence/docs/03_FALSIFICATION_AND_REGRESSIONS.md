# AC-04 · Preregistered checks and evidence

## Local acceptance gates

1. Pin seven authoritative F7-related source files to the verified GitHub main tree using Git blob SHA-1; never pass on file name alone.
2. Execute canonical CIE Node regression suite unchanged: original tests must pass.
3. Build durable SQLite campaigns for all five roles, verify each step against the in-memory pure F7 engine, and replay from stored action archive.
4. Verify duplicate key, changed-payload collision, stale revision, illegitimate order, unauthorized role, and tampered snapshot fail-closed.
5. Kill actual Node processes before and after SQLite COMMIT; recovered state must be 0/1 canonical transition respectively.
6. Start two independent local HTTP processes sharing one SQLite file; advance five **distinct** campaigns, verify scoped reads and per-campaign idempotency.
7. Unzip frozen AC03 and run original `verify_ac03.py` without changing original archive bytes.
8. Verify extended assurance graph retains every AC03 node and edge, no orphan edges and release BLOCK.
9. Extract final AC04 ZIP to an empty folder; verify exact manifest; re-run the relevant AC04 tests and source pin checks.

## Meaningfully falsified or blocked

- An early AC04 rejected request left a SQL transaction open: **fixed** by explicit transaction lifecycle; permanent test verifies rollback.
- First AC04 assurance graph used the wrong global gate identifier namespace: **fixed** to `GATE-Gxx`; dangling-edge checker refuses it.
- Expanded 24-seed scenario audit **timed out**. This is NOT a pass. Reduced stress coverage must be treated as sample evidence; persistence replay after each transition is expensive, and performance requires redesign/profiling.
- Native Chromium HTTP, TLS/IdP, 16-quarter world, common ledger, multiplayer role coexistence, security penetration and human enjoyment are NOT passed.

## Evidence levels

`actual Node/SQLite`, `native Python HTTP`, `frozen baseline regression` and `structural reticulum` are distinct forms of proof. A reader can inspect raw logs and machine-readable outputs under `proofs/`. A local bridge test does not make this a production-ready remote multiplayer game.
