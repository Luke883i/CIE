# CIE · Bluiette Design System v1.0

## Product direction

**Clarity before complexity.** The interface exposes a single affirmative action, three legible strategies, and immediately visible outcome feedback. Geography and V9 causal detail remain discoverable rather than requiring attention before the next move. The role/seed/dossier setup stays available without dominating first-time play.

## Palette

| Token | Value | Usage |
|---|---|---|
| Bleu Nuit | `#0D3679` | primary decision header |
| Bleu Royal | `#1464C0` | action stage |
| Bleu Ciel | `#389BEA` | luminous gradient endpoint |
| Glace | `#C7F8FF` | primary CTA gradient |
| Paper Blue | `#F2F9FF` | first-page background |
| Deep Ink | `#14345F` | text on pale panels |
| Hairline | `#C9DEF1` | borders and separators |
| Focus Yellow | `#FFDC6F` | high-visibility focus (a functional exception to monochrome blue) |

All colors are defined in CSS tokens inside `web/f8bis.css`; screens are reproducible offline with no external fonts. Gradient contrast depends on actual combinations: visual automated verification and human contrast audit remain open in F10.

## Component anatomy

- **Decision Hero**: eyebrow (active turn), role, question, 3 plan cards, 1 primary CTA, optional 'personalizza' disclosure, observer-derived consequence summary. Inherits current F7 engine phase.
- **Strategy Cards**: active radio semantics and Left/Right keyboard navigation, no hidden NPC calculation or forecast; tagged intent (control/equilibrium/slancio).
- **Bluiette Button**: large bright touch target (min-height 54–58px), clear outcome verb and arrow.
- **Progressive disclosure**: V9 deep causal chain, negotiation manual controls and detailed action buttons live in `<details>`; advanced users keep full functionality.
- **Atlas**: unchanged read-only 32-jurisdiction geometry, searchable, keyboard-navigable, three lenses, no invented country-level simulation.
- **Live Feedback**: post-action observer-only delta on known public game counters, announced with `role=status` and `aria-live=polite`.

## Accessibility & responsive

Focus-visible 3px outline on interactive controls; reduced-motion media query; 390px viewport no overflow; radio-plan arrow keys; document order puts hero before atlas; on narrow screens the center content precedes configuration to prioritize actions. Semantic labels should be localized to Italian without abbreviation-only choices.

**Not yet certified:** full WCAG 2.2 AA, assistive-technology audit, contrast matrix at every state, and external player clarity. Gate G10/G14/G15 remain open until F10.
