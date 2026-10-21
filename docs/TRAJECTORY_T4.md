# CIE · T4 semantic convergence to publishable game

Reference base before F4: `main@8d429c18225361dd5e82ce1a32b94c417b1e3f04` (F3 merged). F4 must be merged only after CI and independent review on one frozen commit SHA.

## Entire PR sequence
| Semantic PR | Runnable vertical slice | Status |
|---|---|---|
| F1 | Shared world and information perspectives | merged |
| F2 | Single-player NPC automation and replay | merged |
| F3 | Mandates, 21 organizations, succession, 2 connected dossiers | merged |
| F4 | Three-seat fictional court, standing, discovery, recusal, hearing, majority, remedy | code complete, PR review pending |
| F5 | Stock-flow capital/debt/budget, double-entry sectors and shocks | not implemented |
| F6 | V9 graph: provenance of 1,037 cases, 37 curated executable chains, >=1,027 parameterized executable paths, T0–T5 and counterfactual falsifiers | not implemented |
| F7 | Repeated games, autonomous bargaining, coalition/veto/exit, succession robustness | not implemented |
| F8 | Offline Europe cartography and navigable institutional/reticular atlas, accessible experience | not implemented |
| F9 | 16-quarter complete 5-role campaigns, saves/migrations, endings, shipped release and distribution | not implemented |

## Engineering DAG
`F1→F2→F3→{F4,F5,F8}`; `{F4,F5}→F6→F7`; `{F7,F8}→F9`. No slice is a pure scaffold. Each adds executable mechanics, tests, falsifiers, actor-specific UX and durable proof.

## Comparative complexity (not time estimates)
Original remaining after F3: F4 13 + F5 21 + F6 21 + F7 13 + F8 13 + F9 21 = **102** relative units. After local F4 completion: **89** units (F5+F6+F7+F8+F9). Critical parallel path after F4 still **76** (F5 21 + F6 21 + F7 13 + F9 21). Single developer serial basis 89, before integration/QA contingency. F5 is the new bottleneck; F8 can progress in parallel if contracts frozen.

## Global DoD (conjunction, all non-compensable)
G01 unique canonical world, G02 deterministic replay, G03 five complete 16-quarter solo campaigns, G04 institutional/legal procedural validity within declared fictional world, G05 knowledge and view confidentiality, G06 reconciled sectoral stock-flow, G07 traceable executable V9 content (not just JSON imports), G08 feedback loops/typed reticular causality, G09 strategic adversarial agents and successor continuity, G10 navigable accessible offline European atlas, G11 full E2E/regression/falsification and balance audit, G12 reproducible publishable production build/security/licensing.

## F5 mandatory vertical demo
Starting from a financially constrained initiative: Parliament, Treasury, lender, supplier, workers and taxpayers hold distinguishable accounts. A loan funds implementation; interest and contingent guarantee may move risk to the public sector; default must not disappear from the balance sheet; citizens may react strategically. Actions must drive visibly different solvency and social consequences without fiat scores. Replay and reconciliation remain exact. F4's legal judgment must be able to suspend or reverse the economic execution *in the same canonical world*. No schema-only completion.
