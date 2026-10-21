# CIE — Costantino I d'Europa · F2

A deterministic, fictional political-institutional **single-player episode** with one shared world and five playable perspectives. Choose Costantino, financier, parliamentarian, head of state or judge; the other four roles operate autonomously using only their own authorised observations. Every role has two contextual options and reaches a bounded final outcome. This is a real playable vertical slice, not a finished European political simulator.

## Run

Requires Node 22+ (Python 3 for the optional local static server).

```bash
npm test                  # Node regression + 150 seed/role journeys
npm run audit             # 5000 autonomous episodes and replay; overwrites proofs/F2-audit.json
npm run verify            # regression plus audit
npm run serve             # open http://localhost:8080/web/ in a browser
```

Open `/web/`, select a character and seed, press **Genera mondo**, make your decision, and inspect the NPC actions and outcome. Export/import a JSON replay. Offline runtime has no LLM calls or network APIs.

Contracts: `docs/F2_CONTRACT.md`; audit: `docs/F2_AUDIT.md`; trajectory: `docs/TRAJECTORY_T2.md`; proofs: `proofs/F2-audit.json`, `proofs/F2-browser.png`. `src/world.mjs` remains legacy F1 compatibility; `src/episode.mjs` is the F2 authoritative engine. No new GitHub PR should be merged until the published SHA passes CI and review.
