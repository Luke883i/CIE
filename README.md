# CIE — Costantino I d'Europa | Focus Mode

Deterministic, fictional European political-strategy game; **one decision at a time**. Five roles, same shared world and autonomous NPCs. Focus Mode is the default experience (`/web/` or `/web/f10.html`). Advanced simulation preserved at `/web/f10-expert.html` (a new session, not state-synchronized).

Run using Node 22+ and Python 3:

```bash
npm run serve              # open http://localhost:8080/web/
npm test                   # all earlier tests + Focus
npm run audit:focus        # 1,000 seeded semantic probes
npm run verify:focus       # historical F10 suite + Focus
python scripts/browser_focus_smoke.py  # Chromium/Playwright local visual audit
```

Focus Mode has one first-viewport CTA, up to three hidden optional alternatives, two compact state metrics, a symbolic world stage, and two collapsible deeper areas. All decisions dispatch only canonical F7 commands, with observer-visible consequences and deterministic replays. No generative AI and no server-persistent 24/7 world yet. See `docs/FOCUS_CONTRACT.md`, `docs/FOCUS_AUDIT.md`, `docs/TRAJECTORY_FOCUS.md`.
