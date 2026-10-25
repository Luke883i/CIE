import json, pathlib
p=pathlib.Path(__file__).parent
r=json.loads((p/'registry.json').read_text())
gates=r['gates'];wps=r['workPackages']
method='''# CIE ICTC repository governance — local convention, NOT an external standard

**Intent -> Contract -> Test -> Closure** is our explicit project-specific expansion of **ICTC**; public research did not establish a unique named ICTC repository-governance standard. Do not present this expansion as ISO, NIST or an externally recognized framework.

We hybridize: OpenSSF repository best practices (branch protection and least-privilege CI), GitHub rulesets, baseline-aware source pinning, versioned semantic DoDs, deterministic falsification, and human-owned residual risk acceptance.

## Control-plane versus game-plane

- The governance scripts **never execute or alter authoritative F7 gameplay**. They observe sources and governance claims.
- AC04 is NOT five humans sharing one canonical F7 world: the global multi-actor gate remains OPEN.
- PASS_LOCAL only validates a scoped, versioned artifact. It cannot make GATE-Gxx green.
- Any changed normative rule, schema, threshold, falsifier or dependency needs a dedicated semantic commit plus refreshed pins, tests and reviewers; never silently edit registry + pins to avoid scrutiny.
- Immutable source graph: `convergence/assurance/holistic_reticulum_ac04.json.gz`, protected locally by SHA-256 and pre-existing AC04 validator. Separate overlay: `governance/registry.json`.
- `governance/contract_pins.json` detects semantic drift against a checked-in baseline but is **not cryptographic attestation against a malicious committer changing both files**; independent review and branch protection are necessary.

## Definition of Done, three levels

**Local:** typed behavior, negative falsifier, deterministic test, attribution to exact file/commit, rights/scope; passing node-specific test. **Intermediate:** seams between producers and consumers proven on one runtime and one revision, including revocation, timeouts, private/public views and recovery. **Global:** all 32 gates independently reviewed and evidenced on a single candidate release, human playtest and rights clearance, operational readiness and named approver.

## Change flow

1. Record new intent and user experience hypothesis; identify role, scenario, sector, phase, potential exploit.
2. Link to existing micro-DoD or open a new one; explicit severity and conflict with existing claims.
3. Amend typed contract & falsifier; run `npm run verify:ictc` and `npm run verify:convergence`.
4. Create an *independent* change-impact analysis: upstream producers, downstream consumers, UI projections, analytics, storyboards, legal permissions.
5. Include an evidence digest, CLI report and proof scope in PR; reviewers challenge the semantic change and epistemic limits.
6. Do not merge without required CI and approved review; set GitHub Ruleset administratively (not feasible by merely adding files).
7. On merge, pin base revision in a follow-up governance migration, invalidate superseded evidence and replan based on measured throughput.

## GitHub hardening to apply administratively

`main` was observed **unprotected** at baseline; propose mandatory PR reviews (prefer two independent reviewers), codeowner ownership after naming real maintainers, require `ictc-governance` + existing CI checks, prevent force-push/deletion, restrict bypass, read-only default GITHUB_TOKEN. This PR adds a CI job and a template but **does not enforce branch rulesets**. Do not invent a real CODEOWNERS owner.

## External methods (references)

- OpenSSF Source Code Management Best Practices: https://best.openssf.org/SCM-BestPractices/
- GitHub Rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
- NIST SSDF SP 800-218: https://csrc.nist.gov/pubs/sp/800/218/final
- SLSA provenance framework: https://slsa.dev/spec/v1.0/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/

## Fail-closed nature and limits

A passing audit means *this pinned governance overlay is structurally consistent*. It does NOT prove runtime behavior, human enjoyment, security of a multiplayer deployment, completeness of discovered needs, signed supply-chain provenance, or release readiness. The 100k mutations target defined detector classes; unmodelled attacks may survive. Schema and gate pins are not a substitute for trusted approvals.
'''
(p/'METHOD.md').write_text(method)
plan=json.loads((p/'proofs/plan.json').read_text()) if (p/'proofs/plan.json').exists() else None
rows='\n'.join(f"| {x['id']} | {x['title']} | {', '.join(x['dependsOn']) or '—'} | {x['weight']} | {', '.join(x['gates'])} | OPEN |" for x in wps)
gates_md='\n'.join(f"| {x['id']} | {x['name']} | OPEN | Independent release-candidate evidence |" for x in gates)
road=f'''# CIE — strict adaptive product roadmap / semantic contract

## Baseline and truth

- Canonical main: `{r['baselineMainSha']}`; inherited AC04 graph 1100 nodes / 2714 edges; 146 base micro-DoD; 32 global gates **OPEN**.
- F7 is a one-human game with NPCs, AC03 a one-quarter five-order experiment. No game engine merger implied.
- No authenticated 16-quarter five-human game; no certified human fun; no independent security or WCAG audit; rights and operations incomplete.

## Dependency DAG: minimum overlay, not a replacement for inherited reticulum

| Packet | Intent / deliverable | Requires | Weighted units | Links to release gate | State |
|---|---|---|---:|---|---|
{rows}

## All non-compensable release gates

| Gate | Required property | State | Closure basis |
|---|---|---|---|
{gates_md}

## Change control and convergence algorithm

The CLI calculates **ready packets** only when all declared prerequisites are integrated and evidenced. The risk priority score is `impact × uncertainty + weight`. A package is not closed because its due date passed, a branch merged or an image was generated.

Weighted open units = sum of package weights not at the evidence-backed INTEGRATED state. Throughput is initially an *assumed scenario*, not measured performance. Formula: `M = ceil(weighted_open_units / measured_verified_units_per_iteration) + integration(6) + human(4) + stabilization(8)`; recalculate only after actual observed cycles. The program length is conditional and can increase when a seam reopens or a missing requirement is discovered.

## Non-regression required in every PR

- Pinned game rules unchanged unless a separately reviewed game-rules migration; crosswalk old/new replay and migration.
- Inherited graph has all 1100 nodes and 2714 edges; existing CI `verify:convergence`, `verify:dual`, `verify:legacy` must continue passing.
- Added semantic change requires a new contract pin and a falsifying test; 100k mutation audit protects declared classes, not the unknown unknowns.
- No structural green implies global green; require named human approval and security/legal/human evidence on same release candidate.
- 30 scenario specifications / 7200 visual contracts are design obligations, not implemented gameplay/media.

## Release rule

`BLOCK` until: every `GATE-G01 ... GATE-G32` has fresh evidence from the *same exact release candidate*, signed/offline-verifiable provenance where required, independently reviewed human studies and operational drill results; owner approval recorded outside these scripts. Any P0 exception or stale evidence blocks release.
'''
(p/'ROADMAP.md').write_text(road)
PR='''## CIE ICTC — Adaptive repository governance, roadmap and 100k semantic-mutation guard

Three semantic commits: (1) baseline & intent; (2) adaptive planner and semantic contract validator; (3) tests/CI/falsification and proof report.

### What is real
- Versioned overlay: 14 minimal work packages, 32 mapped global gates, 1100-node AC04 graph referenced by digest (not duplicated).
- Deterministic dependency planning, risk priority and conditional iteration scenarios.
- 80,000 adversarial registry mutations across 20 classes plus 20,000 benign mutations; assert 0 misses and 0 false positives in the tested set.
- Node tests and Actions CI, read-only permissions, PR template, docs and reproducible local proof.

### What remains BLOCK
- Main's branch protection still needs a repository administrator.
- All 32 global product-release gates remain open.
- The AC03/F7 world merger, 16-quarter multiplayer, human validation, independent security, WCAG, software supply chain attestation are not implemented by this PR.

### Reviewer checklist
- [ ] Compare semantic contract and pins together; reject silent threshold changes.
- [ ] Verify exact source SHA and all relevant CI jobs.
- [ ] Confirm no F7 reducer/economic/official rules files changed.
- [ ] Review 100k audit scope and false-positive control, not just the count.
- [ ] Confirm BLOCK global status and no auto-merging.
- [ ] Appoint owners and activate GitHub rulesets separately.
'''
(p/'PR_BODY.md').write_text(PR)
