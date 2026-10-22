# CIE · One World, Two Goals (RG1)

**You are one of five European fictional roles.** In eight economic quarters, try to deliver a digital pact: progress >=4 and zero defaults. At the same time pursue your own, potentially conflicting role objective. NPCs act autonomously; no generative AI runs the game.

Start: `npm run serve` and open `/web/f10.html` (default `/web/` redirects there). See one CTA, one collective victory rule, one personal goal, and inspect optional details only when needed.

`npm test` · `npm run audit:dual` · `npm run verify:dual` · `python scripts/browser_role_goals_smoke.py`

Full evidence: `docs/ROLE_OBJECTIVES_CONTRACT.md`, `docs/ROLE_OBJECTIVES_AUDIT.md`, `docs/TRAJECTORY_T12.md`. The global 15-gate release DoD is **not** complete. The actual governing engine is unchanged from F7.

---

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

## Game Clarity local study (after PR11)

A read-only presentation refinement clarifies the actual F7 win contract: reach 4 project progress points without defaults in eight economic quarters. Five different role tasks, a 2-metric goal panel, truthful end states and unreachable-goal warnings are shown in Focus Mode. This is a **local, unmerged experiment**. Verify with `npm run verify:goal` and `python scripts/browser_goal_clarity_smoke.py`; do not treat the 40-title desk scouting or synthetic tests as evidence of actual player enjoyment.
