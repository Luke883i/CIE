# CIE T8 — main audit and convergence to publishable game

## Merge truth

PRs F1–F7 merged in `Luke883i/CIE`. Verified GitHub main at `3fa136d2d2366054e780635c0abc7f3095b2c390`, CI success, zero open PRs as of 2026-10-22. F8 is **local only** pending owner inspection: no remote branch, commit or PR. Ten key F7 baseline Git blob SHAs matched GitHub exactly at the checked main SHA.

## Remaining semantic runtime slices

| Slice | Hard runtime deliverable | Test/falsification | Relative weight |
|---|---|---|---:|
| **F8 European Atlas & Design** | Offline 32-geography SVG, map/role/relations/institution navigation, 5 role-complete journeys and design assets | Map cannot alter economic state; inaccessible geometry has text alternative | 13 |
| **F9 Persistent World** | Authoritative server-owned clock and events in durable storage, crash-safe async execution with pause & consent controls; client may close | Two workers compete for same tick; browser clock tampering; crash recovery; same tick effect once | 13 |
| **F10 Human Engagement & Accessibility** | At least 20 consented playtesters across five roles; tutorial/clarity/agency/retention; screen reader & keyboard passes and visual iteration | Fail if boredom, invisibility of effects, cognitively inaccessible/false agency, unsuccessful tutorial | 13 |
| **F11 Publishable Single-player Campaign** | Single consistent 16-quarter world, complete onboarding/campaign/ending, versioned persistence, observability, deployment and rollback | 500 role-seed campaigns, 10,000 mutations, HTTP/browser deploy, privacy/security/license gates | 21 |

**Relative weight after F7 merge**: 60; after F8 accepted/merged: 47. Because F10 depends on F8 and F9, and F11 on F10, critical path F9→F10→F11 is 47 after F8. Nominal comparative weights are neither engineer-days nor a cost estimate.

## Fifteen noncompensable global release gates

G01 one authoritative world; G02 deterministic versioned replay; G03 full five-role 16-quarter campaigns; G04 fictional procedural legitimacy; G05 service-boundary privacy; G06 complete stocks, flows, debt, guarantees; G07 source provenance of all 1,037 V9 cases and high executable semantic coverage, 37 curated semantic checks; G08 causal tracing T0–T5 explicitly synthetic; G09 AI strategic bargaining and promises; G10 accessible accurate continental atlas; G11 actual hosted HTTP browser QA and restart testing; G12 security, provenance, licensing, reproducible release/rollback; G13 server async clock, idempotence and bounded catch-up; G14 external human playtesting demonstrating comprehension and agency; G15 coherent accessible visual design & illustrations.

**No gate can be declared PASS just because a PR merged.** F8 advances G10 and G15 but does not prove full accessibility, deployed browser E2E, human enjoyment or Europe-wide local causal fidelity.

## Anti-drift, vertical PR contract

Every upcoming PR contains runnable feature + E2E evidence + source provenance + falsifiers + rolling DoD. Pin the reviewed head SHA with green CI and compare exact local source hashes with remote blob hashes; merge only upon explicit review. F8 may be published only after owner authorization. No staged scaffold becomes an accepted slice without observed runtime behavior. `main` branch protection remains a recommended pre-publish action.
