# F8bis · Game patterns, human enjoyment hypotheses, and verification plan

## Typical play styles CIE should support

| Type of player | Familiar game pattern | CIE action | Reward / tension loop | Misuse / falsifier |
|---|---|---|---|---|
| Explorer | Geographic discovery / grand strategy | Inspect one real territory, switch lenses, save route | Discovery without losing the thread | No relevant game action visible |
| Negotiator | Social bargaining / tabletop diplomacy | Offer pact or hold public hearing | Trust changes, future obligation, possibility of refusal | Guaranteed acceptance, no tradeoff |
| Institutionalist | Procedure and political intrigue | Exercise one mandate-limited act | Legitimacy, collegiality, change of incumbents | Unilateral fantasy power |
| Strategist | Resource allocation | Choose precaution, cooperation, acceleration | Legible cost/opportunity, deferred feedback | Hidden or meaningless modifiers |
| Casual / mobile | Short episodic play | One safe default + primary CTA | A meaningful step without studying the atlas | Required four hidden dropdowns before first turn |
| Time optimizer | Tycoon / OGame-like queue | Explicit fast-forward & pause on critical event | Agency over cadence | Clock skipping critical dilemmas |

## Motivational research and its limits

**Autonomy**: three distinct decisions whose consequences differ, optional detail, ability to say no. **Competence**: explicit prompt/CTA, immediate visible consequence, progression and explainable simulation. **Relatedness**: distinct NPC voices/relationships, pacts and refusals, persistent obligations. **Curiosity**: geographic discovery and a changing shared world. **Flow**: short game turns plus adjustable time. These are **hypotheses**, not proof that a user will enjoy CIE.

Relevant literature:
- Sailer et al., 2017, *How gamification motivates* (doi:10.1016/j.chb.2016.12.033): different design elements support distinct psychological needs, not automatic enjoyment.
- Rogers, 2017, *The motivational pull of video game feedback, rules, and social interaction* (doi:10.1016/j.chb.2017.03.048).
- Nielsen Norman Group, *Recognition Rather than Recall* (https://www.nngroup.com/articles/recognition-and-recall/): contextual recognition reduces memory burden.
- W3C, *WCAG 2.2* (https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/): target-size, focus and alternatives remain to be audited.

## Mechanistic improvement proxies (testable now)

- Target position: desktop 1913→395px, mobile 3750→383px (initial viewport). Lower means a player can encounter the CTA without initial page scrolling.
- Required predecision settings: original manual flow exposes role/UID/approach/counterpart/move/role-choice; F8bis defaults all except the single commit. Measured interaction count **0 setup clicks + 1 confirmation** for an already selected default role and seed.
- Three canonical preset groups; plans compiled only from observer-accessible legal actions, 100,000 typed semantic scenario mutation proofs plus 200 reachable replay campaigns.
- All detailed panels available on demand; absence of hidden NPC forecasts is a positive guardrail rather than a lack of depth.

## F10 external human falsification (NOT done at F8bis)

Recruit at least 20 independent people across five roles, randomize first contact with baseline F8 or F8bis; compare objective time-to-first-valid-act, proportion completing without instruction, action comprehension, voluntariness of next play, frustration, sense of agency and return intent. Predeclare thresholds; report failures openly; avoid forced engagement or variable-reward dark patterns. Run independent keyboard/screen-reader and mobile usability sessions. Do not infer satisfaction from the 100k synthetic mutations.
