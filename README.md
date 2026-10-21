# CIE — Costantino I d'Europa · F5 Economic Pulse

An **actually playable single-player vertical slice** (not the completed CIE 1.0): five player personas, autonomous institutional decisions and fictional court procedures, an eight-quarter economic pulse, journal-balanced transfers and paired credit claims, simulated opposition and seedable shocks, replay, and explicit acceleration 1/2/4 quarters with critical-event stop.

**Run locally:** Node 22+, optional Python 3 for static server.

```bash
npm run verify:f5
npm run serve
# open http://localhost:8080/web/f5.html
```

Legacy F2, F3, F4 rulesets remain separately playable. F5 preserves one world from F4, then adds the deterministic quarterly economic layer. JavaScript frontend stays offline; no AI or server clock is used to change game truth. The symbolic SVG atlas is illustration, **not accurate European geographic data**. The F5 contract, audit, DS and release trajectory are under `docs/` and `design/`.

**Do not mistake** local time skip for 24/7 OGame-style persistence; the authoritative asynchronous server is targeted for F9 and is explicitly a global release gate. Neither simulation diversity nor pretty UI proves actual fun: human playtests are required at F10.
