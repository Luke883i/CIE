# AC-03/N — Normative local contract

## What changes from AC-02

AC-02 worked on one in-browser hotseat world. AC-03 wraps its **unchanged** game kernel in a server-owned SQLite state and binds each role to a separate 256-bit bearer credential. All mutations run in the server process. The client receives only `view(world, role)` projections, never `world`, its `privateNotes` map or operator state. The backend has a fixed origin and a no-external-network default.

## Command lattice

`bootstrap(seed) → open 5 role sessions → 5 typed proposed actions → optional revocation to HOLD → BEGIN IMMEDIATE → guard all submitted → canonical AC-02 commit → append ledger and deduplicated receipt → COMMIT → each role's scoped projection → comic(eventId)`.

AC-03 persists **one canonical quarter** in `PLANNING` or `COMMITTED`. There is no tick scheduler, no second quarter, no resurrection of revoked mandates and no campaign running while all devices are closed.

### Server state invariants

- `worlds.body` is authoritative and `worlds.hash` is a SHA-256 **accidental corruption detector**, not a digital signature or defense against a DB admin.
- `version === world.revision`; revision 0 is planning, 1 is committed. No other revision is valid in this spike.
- `BEGIN IMMEDIATE` and WAL serialize writes across independent SQLite connections and OS processes in the tested local filesystem.
- `requests(role,operation,idempotencyKey)` is UNIQUE. A repeated identical request returns prior payload; conflicting payload with same key returns `IDEMPOTENCY_CONFLICT`.
- Rollback must undo state, ledger and request receipt together. Response loss after commit is resolved by an idempotent retry.
- All five seats must have a valid order (or server-generated HOLD due to revocation) before commit.
- Role tokens may never gain operator privilege; role is derived **only** from the hash of the bearer token, never from a request field.
- Revocation before commit replaces stale role order with `HOLD` and denies further access. Revocation after commit is forbidden in this one-turn model.
- A court stay requires a pre-existing admissible case and targets only its covered proposal. The court cannot veto the whole economy.
- All credits must conserve `TREASURY+FUND+FIRMS=24` in the AC-02 fixture. Credit creates an explicit liability.
- Comic captions derive only from public events whose identifiers are retained in source references.

## API surface (single authoritative Node process per listener)

| Route | Method | Actor | Response |
|---|---|---|---|
| `/api/health` | GET | public | version/service only |
| `/api/view` | GET | player | scoped observer / comics |
| `/api/view` | GET | operator | aggregate readiness, revoked roles, digest; no private notes |
| `/api/order` | POST | player | receipt of submission |
| `/api/revoke` | POST | operator | revocation + forced HOLD |
| `/api/commit` | POST | operator | canonical commit receipt and persisted SHA |
| `/`, `/app.mjs`, `/style.css` | GET | public | immutable-by-route web assets (no directory browsing) |

JSON requests reject non-JSON content types and oversized bodies. All API replies specify `Cache-Control:no-store`; HTML assets declare a restrictive CSP. Native browser delivery still needs an end-to-end deployed environment test.

## Proof boundaries

Tests use SQLite on the local container filesystem. Claims hold only for tested process crashes, local disk semantics, chosen seeds and fixture. There is **no** attested power-loss/faulty-storage durability, N-way distributed consensus, load shedding, token rotation, TLS, network-side DOS protection, authenticated identity provider, social moderation, source-asset licensing clearance, accessibility certification or multiplayer human playtest.
