# CIE — Costantino I d'Europa

An offline, deterministic, fictional political-institutional strategy prototype. **The latest playable vertical slice is F4 — Judicial Chain & Remedies.** It preserves independently replayable historical episodes F3, F2 and F1. This is **not** a completed published European political game.

## Play F4

Requires Node 22+ and Python 3 for serving local assets.

```bash
npm run serve
# visit http://localhost:8080/web/f4.html
```

Select Costantino, Financier, Parliamentarian, former President P1, or Court President (Chair). In one world, two connected dossiers cross institutions and the P1→P2 succession. If a law is promulgated, a fictional constitutional complaint triggers discovery, challenge to a conflicted judge, hearing, three-seat deliberation, procedural review and binding game consequences. The user controls one person; the others operate automatically.

## Verify

```bash
npm run verify:f4
python scripts/browser_f4_smoke.py # optional Chromium+Playwright
```

`web/f4.html` is the new UI; `web/f3.html` and `web/index.html` remain previous scenarios. Replay export/import is deterministic but has a non-cryptographic checksum, not a multiplayer security guarantee. F4 is fictional: no implication of faithful Italian or EU constitutional adjudication, and no generative AI, networking or unseeded entropy in the game engine.

Full contracts: `docs/F4_CONTRACT.md`, `docs/F4_AUDIT.md`, `docs/TRAJECTORY_T4.md`. **No merge until CI on reviewed same SHA and human approval.**
