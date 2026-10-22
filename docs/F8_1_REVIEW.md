# CIE F8.1 — reviewer checklist

Base expected `main`: `3fa136d2d2366054e780635c0abc7f3095b2c390`.

**Proposed semantic change:** F8 geography UI + refinements under the same F7 world truth. A 32-territory offline Natural Earth map with explicit proxy label, three thematic lenses, keyboard country control, role-limited projection, world-immutable bookmarks, Ctrl/Cmd+K command palette, quick-navigation bar, contextual inspector, editorial design system and original SVG motifs.

**Core invariant:** UI interactions MUST NOT call `f7Play`, `f7FastForward` or any canonical reducer, and may only display data from the authorized F7 view + static geography. They MUST NOT fabricate territorial economy, observed influence or local election results.

**Evidence:** 1,613 Node tests PASS; 500 worlds/12,000 role-scoped projections with unchanged digest; five completed Chromium journeys across five roles, including palette/bookmarks/replay; HTTP byte-for-byte asset routes. Chromium hosted HTTP navigation still unverified due local policy; independent WCAG and human engagement still open.

**Merge gates:** CI on reviewed HEAD SHA, check native app `/web/f8.html` with Node 22 + `npm run serve`, review geo source/rights, check CSS import availability and responsive experience. Preserve F7 path. No squash/force-push without renewed SHA review.

**Deferred:** true dynamic geopolitical/EU legal validity, local economic indicators, F9 server-persistent clock, F10 human test/independent accessibility, F11 release readiness.
