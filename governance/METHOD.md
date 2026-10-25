# CIE ICTC repository governance — local convention, NOT an external standard

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

**Official planning hardening:** `plan(registry)` validates the bytes of all claimed proof artifacts before promoting downstream readiness; `plan(registry,{simulation:true})` is solely an explicitly labeled hypothetical scenario and can never change gate certification.
