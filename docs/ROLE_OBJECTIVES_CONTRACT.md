# CIE — Role goals & dual outcomes · semantic slice RG1

Baseline: `Luke883i/CIE` main at `178789e21bf7548352b58088e39ab881a0a58d2a` (merged PR #11), plus the locally verified **Game Clarity** patch not yet merged. Build is additive and the authoritative F7 simulator is unchanged. The five role missions are **fictional game-design victory conditions**, not normative rankings of political behavior.

## Player promise

**One world, two goals:** the Patto digitale can reach `DURABLE_PROGRESS` iff after eight economic quarters `progress>=4` and `defaults===0`. The player's personal assignment is a distinct criterion based on **their own recorded actions** and observer-visible end indicators. Both are visible on the start screen and adjudicated separately at the end.

| Role | Action evidence (at least twice) | End metric | Design tension |
|---|---|---|---|
| Costantino | BUILD_COALITION | support >= 8 | Build coalition vs mobilize the network |
| Financier | KEEP_LIQUIDITY | defaults = 0 | Preserve liquidity vs lend to advance project |
| Parliamentarian | EXAMINE_BUDGET | defaults = 0 | Audit budget vs authorize grant |
| President | HOST_CIVIC_DIALOGUE | legitimacy >= 8 | Dialogue vs report/oversight speed |
| Judge | REVIEW_SAFEGUARDS | resilience >= 8 | Procedural safeguards vs publishing reasons; no court outcome bargain |

Numbers are local targets of the fictional game, not calibrated economic or political measures. Meeting the condition temporarily does not certify final success; final verdict is computed only at episode close. Player moves come only from the actual F7 replay-derived human command stream (noncryptographic digest) (`f7Save(session).commands`); effects from autonomous NPCs **cannot** count as player actions. No additional state machine, score currency, territorial effect, law, hidden NPC read, generative AI or extra control over actors is created.

## Strict verification gates (conjunctive)

| ID | Contract | Mechanical falsifier |
|---|---|---|
| RG01 | Same authoritative F7 engine as merged main | hash of `src/strategy.mjs`, unchanged source |
| RG02 | Global victory truth matches `finalOutcome()` | threshold tests + all full campaigns |
| RG03 | Five unique, playable, role-specific missions | role goal mapping + reachable seeds |
| RG04 | Personal proof comes from own actions | count only `ECONOMIC` `choice` commands |
| RG05 | No NPC secrets or role-scope data leak | role identity, inputs, observer-only projection |
| RG06 | Global and personal verdict independent | four empirical synthetic quadrants exist |
| RG07 | No false final win labels | end comparisons and dual outcome contract |
| RG08 | No false causal guarantee mid-game | `CURRENTLY_MET` vs `COMPLETED` distinction |
| RG09 | One visible first CTA, two prime world metrics | Chromium DOM desktop/mobile |
| RG10 | Personal role command expressed in intelligible Italian | `choiceExplanation` on each economic plan |
| RG11 | Preview, role expansion, territory inspection are pure | 1,000 start-world digest checks + browser |
| RG12 | Save/import replays produce same outcomes | 200 complete-game saves and replay + Chromium |
| RG13 | Old UI/episodes do not regress | `npm test` F1–F11 + `audit:f8` and `audit:f10`; full historic `audit:focus` retained but excluded from per-PR CI due runtime |
| RG14 | Reproducible evidence and manifest | manifest hashes, cleanroom test, CI by exact SHA |

## Open human gates — cannot be called PASS by automation

- HG1: >=20 external participants understand **both** collective and role mission within 20 seconds; minimum 80% for each.
- HG2: >=70% can describe at least one tension between their role and the collective project without prompting.
- HG3: first valid action median <=30 seconds; optional mission expansion does not obscure the CTA.
- HG4: median cognitive effort <=3/5 on a predeclared scale; experience and agency >=4/5.
- HG5: screen-reader, keyboard, touch and independent WCAG 2.2 AA audit completed, including new role mission component.

Targets are preregistration proposals, not measured findings.

## Falsification/qualification

A valid personal completion does **not** imply an ethically desirable decision in real politics or a completed collective reform. A collective success can likewise coexist with an unfulfilled personal mission. Four dual-outcome quadrants are an in-model property, not a proxy for actual enjoyment. Unseen NPC private preferences never enter the role goal projection. The original game remains 8 quarters, not the desired global 16-quarter release; the server persistent clock and human study remain unimplemented.
