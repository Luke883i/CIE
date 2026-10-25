# AC-04 · Translation boundary that refuses to lie

## States compared

| Dimension | Canonical F7 | AC-03 single-turn kernel | Same? |
|---|---|---|---|
| Authority | One human role; all others seeded NPCs | Five real role orders, operator commit | NO |
| Granularity | Institutional prelude + 8 economic quarters | One joint experiment | NO |
| Action schema | Legal choice string or `{move,other,choice,strategy}` | Per-role `{kind,target}` | NO |
| Money | Multiple book sources / transfers / debt | Three abstract accounts and 2 works | NO |
| Legal acts | F3/F4 institution/judicial procedural chain | One admissible interim stay | NO |
| Replay | F7-REPLAY, role/seed/actions/digest | AC-02 resolved plan, events and digest | NO |
| Private information | Role-scoped `f7Observe` | AC03 token scoped `view` | SHARED INTENT, distinct contracts |
| Idempotent server | New AC-04 canonical lane | AC-03 existing authority | PASS_LOCAL in each lane |

## Bridge contract: permitted operations

- `F7 read`: authentic role/campaign token -> validate checksum/replay -> `f7Observe`, plus canonical `gameGoal`/`roleObjective` projections.
- `F7 step`: strict campaign ownership + revision + key -> actual `f7Play` -> replay archive -> atomic WAL transaction + audit.
- `AC03 frozen regression`: separately verify five-human experiment by executing its original source.
- `compare`: structural contracts, provenance and DoDs only; never fictitious cross-world causation.

## Forbidden operation

`requireSharedWorld()` always raises `SEMANTIC_UNIFICATION_NOT_IMPLEMENTED`. No conversion of an AC02 order into F7 is permitted. `sameWorld`, `commonCurrency`, `commonLegalActs`, `sharedCausalHistory` and `losslessCommandTranslation` are all false.

## Necessary new abstraction for a unified CIE game

A **single multi-actor world constitution** must specify an immutable `worldInstanceId` (not seed-derived), membership, epoch, mandates, joint orders, transaction boundaries, canonical priority/legal gates, resource and event ledgers, simultaneous-versus-sequential semantics, opponent policies, NPC substitutability, multi-observer projections and a replay with all five signatures. Build *one* migration to it, rather than multiplying adapters.

## Reproducible falsifier

Attempt to treat AC03 `pending` or an AC02 `kind` as a canonical F7 replay: rejection, no state mutation. Tamper with a persisted F7 snapshot or mismatched schema: rejection. Submit another role's token: rejection. After `SIGKILL` the replay stays byte-authoritative. Importantly, these are local attack cases, not a security audit against determined remote attackers.
