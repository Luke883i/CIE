# AC-03: proof, counterexamples and epistemic status

## Registered primary falsifiers

1. Unauthorized role attempts operator commit → HTTP 403, state unchanged.
2. A valid judge-only stay is sent by Costantino → NO_COMPETENCE, state unchanged.
3. Duplicate submission key with different payload → IDEMPOTENCY_CONFLICT; no extra order.
4. Five role requests arrive through two SQLite connections / two OS server processes → only one persisted world revision.
5. Two operator commit attempts with same key arrive concurrently → exactly one applied and one duplicate; no extra ledger rows or money.
6. Kill process with SIGKILL before SQLite COMMIT → restart sees original PLANNING, no receipt; safe retry succeeds.
7. Kill process after COMMIT, before response → restart sees COMMITTED, retry returns original receipt; no second application.
8. Operator revokes FINANZIATORE after a prior credit order → submitted order becomes HOLD, no loan, token denied.
9. Judge stay and financier credit compete with project execution → energy suspended, unrelated port proceeds, money conserved.
10. Actor can observe finance or court privateNote from another actor's HTTP/JSON/comic → prohibited; role-specific projections only.
11. Browser runtime changes visible page without mutating server via inspection → browser bridge reads scoped views; no client world memory.
12. HTTP static handler exposes source/DB file via path traversal → fixed allowlist yields 404.

## Observations

- `npm test`: 13 tests passing, including both real SIGKILL variants.
- 400 independently bootstrapped SQLite worlds across four strategy classes; 400 durable replay checks and 400 idempotent retry checks; `proofs/ac03-audit.json` contains exact counts.
- `scripts/multiprocess_e2e.py`: two independent Node server processes, five orders, two concurrent operator commits, exactly one applied. Actual HTTP via Python urllib.
- Chromium UI: two viewport sizes, five role logins each, no JS errors, no horizontal overflow in those sizes; actual Node HTTP via test-only bridge, **not native Chromium same-origin HTTP navigation**.
- Frozen AC-02: 1,000 canonical worlds, 1,000 replays, 480 order permutations, 5,000 observer projections all passed the targeted retrospective audit.
- Frozen AC-01: graph + 400-mutation control-plane audit passes; release still BLOCK.

## Red results kept visible

**FAIL/ENVIRONMENT:** Native Chromium `page.goto(http://127.0.0.1:...)` returned `ERR_BLOCKED_BY_ADMINISTRATOR`. `proofs/browser_http_report.json` intentionally records `pass:false`. Node/Python HTTP separately works; this is not evidence that Chromium native HTTP or deployment works.

**OPEN PRODUCT:** TLS, secure session lifecycle, rate limiting, credential rotation, multi-tenancy, 16-quarter campaign, persistent server tick, cross-region consensus, real user tests, accessibility, actual comics asset pipeline, independent penetration test and release supply-chain clearance.

**Not proven:** production browser identity isolation, comprehensive noninterference, 24/7 availability, power-loss durability, production-grade cryptographic state authenticity, no vulnerabilities, fun, balance, any product gate certified.
