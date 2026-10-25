## Intent / player-facing effect
Explain role(s), scenario(s), action and player comprehension affected.

## Contract & impact
Link micro-DoD, gate IDs, upstream/downstream seams and negative falsifiers. Explain changes to semantics, thresholds, authority and source pins.

## Evidence
- [ ] Local test output + failing counterexample reproduced before fix
- [ ] `npm run verify:ictc`
- [ ] `npm run verify:convergence`
- [ ] Gameplay regression if core code changed
- [ ] Same commit SHA for screenshots/browser/test assertions
- [ ] Human/a11y/security/rights evidence where relevant (else marked OPEN)

## Governance
- [ ] Baseline and proofs fresh; unknowns remain OPEN
- [ ] New risky interactions included in DAG and mutation classes
- [ ] Independent review planned; no self-certified release
- [ ] User impact, rollback and data migration recorded
