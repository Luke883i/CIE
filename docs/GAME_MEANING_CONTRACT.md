# CIE · Game meaning & victory clarity · Local hardening contract

Base: GitHub `Luke883i/CIE`, merge PR #11 `178789e21bf7548352b58088e39ab881a0a58d2a`. The five modified incumbent files matched the remote tree's Git blob SHA before mutation. No remote branch, commit, PR, or merge is authorized or performed by this local hardening.

## Player contract

**What?** A deterministic fictional strategic game in an alternative Europe about carrying a digital infrastructure pact across institutions, private capital, parliamentary choice, judicial review, strategic bargaining and eight economic quarters.

**Who?** A person in one of five roles, each with different powers. Others are autonomous; the player never controls every institution.

**What is the objective?** The existing engine's `DURABLE_PROGRESS` outcome: progress >= 4 AND defaults == 0 after eight economic turns. Goal milestones are **synthetic rules of this game**, not real-world estimates of EU success, public support or economic growth.

**How does one play?** Read role task, choose one legally available next act, inspect observer-scoped consequences; optional details remain collapsed.

**What can go wrong?** Defaults irreversibly block `DURABLE_PROGRESS`; at least 3 progress points can still yield `FRAGILE_PROGRESS`. Lower progress with default yields `DEBT_CRISIS`; otherwise `STALLED_REFORM`.

**What remains hidden?** Other actors' private preferences and confidential facts, and any actual causal claim about Europe's institutions.

## Mechanical DoDs

| ID | Gate | Automated falsifier / proof |
|---|---|---|
| GC01 | Game explains itself on initial view | Chromium heading + genre text visible in first viewport |
| GC02 | Target and time are explicit | literal `4`, `0` and `8 quarters`, tied to `finalOutcome()` source |
| GC03 | Score metrics are semantically ordered | exactly two prime metrics: `progress` and `defaults`, each labelled and explained |
| GC04 | Five roles mean different tasks | scoped player goals in institutional and economic phases |
| GC05 | 4 endings are distinct | `DURABLE_PROGRESS`, `FRAGILE_PROGRESS`, `DEBT_CRISIS`, `STALLED_REFORM` truth labels |
| GC06 | Do not promise a recoverable win after default | status explicitly declassifies strong win when defaults>0 |
| GC07 | Local navigation cannot create game effects | 1,000 sampled projections leave the F7 digest unchanged |
| GC08 | All commands pass original authority | Focus dispatcher untouched; test of 50 full campaigns and replay |
| GC09 | Native disclosure and one CTA stay usable | 10 Chromium role×viewport full runs, no horizontal overflow or JS page errors |
| GC10 | Legacy scenarios remain valid | `npm test` including F1–F10/F11 regression |

## Open gates — require humans, cannot be certified synthetically

| ID | Experiment | Pre-registered target, not an observed result |
|---|---|---|
| GH01 | Show screen to a newcomer for 10 s; ask 'what game is this?' | >= 80% independently describe the premise |
| GH02 | Ask 'how do you win or lose?' without hints | >= 80% identify progress and default constraints |
| GH03 | Ask what the current role can control | >= 80% distinguish own competence and NPC independence |
| GH04 | Record time to first valid action | median <= 30 seconds |
| GH05 | Record cognitive effort 1-5 after first chapter | median <= 3/5 |
| GH06 | Ask who benefited and what changed | >= 70% name one evidence-grounded consequence |
| GH07 | Assess freedom and desire to continue without coercion | median >= 4/5 voluntary-engagement item |

At least 20 unaffiliated participants across the five roles, balanced new/expert, across mobile and desktop; A/B test with PR11 if possible. Report actual denominators and adverse outcomes. A synthetic mutation does **not** establish actual comprehension, pleasure or engagement.

## Source anchors

- `src/economy.mjs:finalOutcome()` determines strong/fragile/crisis/stalled endings. No new synthetic win rule is introduced.
- `src/game_goal.mjs` derives the UI goal only from `f7Observe()` information.
- `src/focus_ux.mjs` composes the goal with F11 decisions; `focusCommand()` retains the existing reducer.
- `web/f10.html`, `web/focus.mjs`, `web/focus.css` display the game premise, role, two result metrics and dynamic stakes.
- `tests/goal_clarity.test.mjs`, `scripts/audit_game_goal.mjs`, `scripts/browser_goal_clarity_smoke.py` are reproducible falsification surfaces.

## External design research

40 comparative desk-study titles and 32 potential cognitive failure classes are included separately. Sources include official pages by Subset Games, Torpor Games, Dinosaur Polo Club, Eremite Games, Factorio and others; the study is **not hands-on**. Practitioner heuristics by Nielsen Norman Group (recognition vs recall; match with the real world; progressive disclosure) support the design hypotheses but cannot substitute for player testing.
