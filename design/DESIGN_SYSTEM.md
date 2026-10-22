# CIE Visual Constitution — DS 0.5

Design intent: a tactile, contemporary institutional atlas that encourages inquiry, not an aggressive military game. All illustrations in F5 are hand-authored SVG vectors stored as code and editable, with clear statement that the geography is symbolic and not GIS. No externally sourced copyrighted textures/fonts required.

### Tokens
Base surfaces: `#f3efe7` parchment and `#fffcf7` white. Authority: `#101f35` navy / `#1c3547` slate. Accent: `#c88b3b` amber; systemic signal: `#237f74` teal, risk `#a95449` brick red, muted `#75808b`. Typography: Georgia serif display; system UI sans text; proportional tabular data. Spacing: 4px unit, 8/12/16/24/32px rhythm. Radius: 7px input, 10/14px cards. Responsive breakpoints: 1120px and 780px. Avoid color-only cues for risk; pair with explicit text labels.

### UX North Star
Three questions above the fold: (1) What happened in the world? (2) What can I do? (3) What should I watch? Three perspectives: cartographic, institutional and causal. Current atlas covers illustration only; F8 replaces with real geographical features and multi-scale navigation. Keep the visual hierarchy and semantic projection contracts while changing map renderer.

### Interaction rules
One main human decision per economic quarter; two contrasting consequences; separate explicit delegation; 1/2/4 quarters skip but stop on critical; visible mode label Local vs Persistent; no fake real-time progress. Replay available by keyboard. Reduced-motion system setting respected. `aria-live` only on concise feedback; no excessive alerts. Illustrations never contain required information absent from text.

### Publishable targets
WCAG 2.2 AA tested via automated and manual assessment, zoom 200%, contrast checks, target size, keyboard-only, focus visible and not obscured. Performance budget for F8: mobile p75 interaction latency under 200ms on target devices, cartographic interaction measurable; use real performance samples before declaring PASS. Avoid externally hosted fonts/tracking scripts. Keep authored SVG/vector icons under version control and record licenses for any later imagery.
