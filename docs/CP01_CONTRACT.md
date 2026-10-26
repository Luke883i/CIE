# CP01 · Contratto di convergenza verso un unico tavolo

## Invariante di base

Il tavolo CP01 usa `experience/episode.mjs` (EX01) e `experience/choice_contract.mjs` (EX02): non implementa un terzo reducer. Il source of truth resta il mondo della Golden Crisis AC03, il cui perimetro è **un episodio hotseat, cinque ruoli, un trimestre**. La campagna F7, la persistenza multiutente, i sedici trimestri e la pubblicazione commerciale restano aperti.

## 18 DoD granulari non compensabili

| Id | Requisito | Falsificatore | Prova attesa |
|---|---|---|---|
| CP-L01 | Una sola URL d'ingresso `/web/` | redirect verso F10 | ispezione HTML |
| CP-L02 | Undici homepage legacy/laboratorio mantenute | pagina eliminata | census e diff |
| CP-L03 | Decisione autorizzata per ruolo | giudice ordina porto | suite cinque ruoli |
| CP-L04 | Spiegazione potere/costo/incertezza | preview insicura | `choiceMeaning` |
| CP-L05 | Vista pura: nessuna mutazione osservando | hash differente | 15k proiezioni |
| CP-L06 | Carte e pannelli progressivi | opzioni avanzate aperte inizialmente | Chromium |
| CP-L07 | Tavolo ha due opere e costo corretto | terzo progetto o dati inventati | test projection |
| CP-L08 | Un'azione primaria visibile al primo viewport mobile | CTA sotto lo schermo | Chromium 390×844 |
| CP-L09 | Cinque ordini conducono a finale | turno bloccato | Chromium desktop/mobile |
| CP-L10 | Replay identico e provato | mismatch digest | 1000 episodi + browser |
| CP-L11 | Testi narrativi con ID sorgente | comic senza eventi | tests/canonical + browser |
| CP-L12 | Non vengono mostrati fatti riservati | sentinella in testi | scope test e code review |
| CP-L13 | Nessun overflow orizzontale sui due viewport | scrollWidth > innerWidth | Chromium |
| CP-L14 | Navigazione tastiera e dettagli nativi | focus irraggiungibile | smoke + futuro audit manuale |
| CP-L15 | 100 giochi campionati per primitive | duplicati / sovrapromesse | benchmarkAudit() |
| CP-L16 | Catena di provenienza e SBOM parziale | dipendenza senza stato licenza | manifest e registry |
| CP-L17 | Fonte e test integrate in CI | PR senza workflow | GitHub Actions |
| CP-L18 | Release BLOCK e limiti non nascosti | claim game-ready | check contratto |

## Giunzioni E2E

- **Input:** osserver/role/choices EX01 → modello puro CP01 → card EX02 → ordine validato EX01.
- **Causalità:** ordini di cinque ruoli → commit AC03 → ricevuta → stato dei due progetti.
- **Narrativa:** eventi del receipt → captions dei fumetti solo con `sourceEventIds` presenti.
- **Grafica:** stato dei due progetti → tavolo simbolico e carte → scelta di pannello, senza modificare stato.
- **Governance:** catalogo 100 giochi → 18 primitive astratte → token UI INK & BLEU → DoD → test → release BLOCK.

## Debiti aperti

- L'ideale di esperienza di gioco non è dimostrato da simulazioni; servono sessioni indipendenti, comprensione, agency, frustrazione e ritorno volontario.
- Nessuna certificazione WCAG 2.2 AA, sicurezza contro devtools, autorizzazione server, mobile hardware, localizzazione, licenze complete dei contenuti storici o distribuzione commerciale.
- Browser smoke utilizza sorgenti esatti incorporati per restrizioni ambientali; non certifica hosting HTTP.

Fonti metodologiche: https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/ ; https://www.nngroup.com/articles/progressive-disclosure/ ; https://www.w3.org/TR/WCAG22/ .
