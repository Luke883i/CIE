# CIE T8bis · Remaining path to publishable game

## Baseline

F1–F8 merged to main before F8bis. F8bis is an extra hardening slice, not a substitution for F9–F11. The existing eight-quarter solo game remains fictional and deterministic.

## Dependency order

- **F8bis** — clarity, immediate action, coherent bleuiette design, evidence that advanced UI does not alter the world. DO NOT certify human engagement here.
- **F9 — Persistent Server World** — Postgres append-only world journal, authenticated ownership and observer queries, server-clock scheduler, lease/fencing, idempotent ticks, catch-up on login after browser closure, exactly-once *effective* application with at-least-once delivery, deterministic replay and back-pressure; offline/pause modes may opt out of persistent time. End-to-end browser-closed proof required.
- **F10 — Engagement & Accessibility** — 20 independent human participants across five roles; unsupervised first-task success, time-to-first-action, perceived agency, decision comprehension, choice differentiation, voluntary replay intent, frustration and ethical pacing; compare F8 baseline to F8bis with counterbalanced allocation, fix failures and revalidate. WCAG 2.2 AA/manual keyboard and screen-reader audit.
- **F11 — Publishable Game** — 16-quarter single-player role campaigns, endings, progression, nonpay-to-win cadence, stable save migrations, full story, 500 cross-role full-campaign proofs, production HTTP deployment tests, security, privacy, licenses and source integrity.

## Global release DoD

Conjunctive G01–G15: 1 canonical world; deterministic replay; five 16-quarter campaigns; institutional validity; scoped knowledge; stock-flow conservation; measured executable V9 case mapping; typed reticular feedback; believable NPC strategies; accessible Europe atlas; complete E2E QA; reproducible secure release; server-authoritative 24/7 time where enabled; **external evidence of meaningful enjoyment and agency**; cohesive design and illustrations.

**B01–B10 PASS does not imply G01–G15 PASS.** In particular, no 100k mutation suite can stand in for external human playtesting or reliable browser-closed persistence.

Relative complexity estimates after F8: F9=13 F10=13 F11=21 = **47 relative units**. F8bis hardening adds a separate completed review unit; the 47-unit figure is not calendar time. F9 and F10 partially overlap in investigation, but F10's final tests require F9's durable time behavior.
