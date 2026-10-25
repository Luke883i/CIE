# Interaction bible: non un'unica GUI per tutti

## Modalità del prodotto

1. **Prima partita / Guided Crisis**: 1 scenario Golden, 1 ruolo, 4 trimestri introduttivi, ordini consigliati ma non forzati, obiettivo+stato+CTA, reveal solo se necessario.
2. **Campagna Solo**: 16 trimestri, un umano e quattro NPC, regolazione della granularità (assistita/standard/esperta) senza creare bonus segreti.
3. **Same-World Multiplayer async**: cinque umani in ruoli distinti, finestra di pianificazione, lock, doppia conferma, tick autorevole; NPC supplenti espliciti per ruoli vacanti.
4. **Scenario Workshop**: filtro di ricette, anteprima raggiungibilità, validatore, autoraggio e publishing controllato; non inventare garantite meccaniche.
5. **Replay & Counterfactual Lab**: audit eventi e alternative *sintetiche* dall'identico snapshot, senza spacciare controfattuali per effetti reali.
6. **Spectator / Journalist**: proiezione pubblica limitata, nessuna informazione privata, timeline politica, non influenza il mondo.

## Layout default: 3 livelli, massimo

**Focus** (in viewport): fantasia in una riga; missione personale e collettiva; 1 scena; 2 indicatori strettamente legati al traguardo; CTA `Approva il piano trimestrale`/`Mantieni e avanza`.

**Portfolio** (se aperto): 3 priorità visibili, ordini attuali, massimo 2–4 modifiche, costi noti, veto e scadenze. 12 ambiti in clustering, non 12 pannelli.

**Intelligence** (opt-in): atlante, gruppo colpito, contratti, prove, geopolitica e ledger, filtri per ruolo.

**Receipt** dopo commit: tre righe a colpo d'occhio (chi ha vinto qualcosa, chi si è opposto, cosa succede dopo) + dettagli causal trace espandibili.

## Workflows per ruolo

Coordinatore: War room -> portafoglio ordini -> briefing diplomazia -> commit -> retroscena.
Finanziatore: Fondo -> esposizioni -> investimenti/ritiri -> liquidità -> conseguenze.
Parlamentare: Assemblea -> progetti -> emendamenti -> voti e rinvii -> coalizioni.
Presidente: Palazzo -> atti in scadenza -> mandato -> firma/rinvio -> memoria costituzionale.
Giudice: Camera di consiglio -> competenza -> prova -> rimedio -> sentenza motivata; nessuna CTA a vendere il giudizio.

## Visibilità necessaria per la UX

Separare `KNOWN`, `ESTIMATE`, `RUMOUR`, `HIDDEN`, `PENDING`. Un'anteprima di costo legale/finanziario può essere certa; la risposta di un alleato no. Mantenere sempre `CIE: universo alternativo, regole sintetiche` nelle info di gioco.

## Accessibility

Tastiera, target minimo 24 CSS px secondo WCAG 2.2 AA ove applicabile, focus non oscurato, colori ridondati da testo/forme, riduzione movimento, screen reader survey, leggibilità a 390 e 320 px, localizzazione IT/EN successiva. Test automatico non certifica la conformità.

## Design Blueprint Bluiette

Deep #061A3F, royal #0D428C, electric #2278CC, sky #4FC0EA, ice #F2F9FF, plum #7550C3 per rivalità, ember #FC9E5B per rischio, mint #50D4B0 per eventi riusciti. Gradiente autorevole blu scuro -> elettrico, singolo glow sulla CTA; cards quasi neutre; non più di una regione visiva saliente per viewport.
