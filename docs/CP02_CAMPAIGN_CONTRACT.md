# CP02 — Campagna giocabile a otto trimestri

## Assunzione falsificabile
Il punto di ingresso canonico `/web/` di CP01 offre un episodio hotseat condiviso **di un turno**. CP02 aggiunge `/web/campaign.html`, **una partita individuale del vero motore F7**: preludio istituzionale, otto trimestri, cinque ruoli selezionabili (uno umano per partita), quattro NPC deterministici, finale e replay. Non è la stessa simulazione condivisa AC03, non c'è multiplayer autenticato e non si afferma che le due economie siano state unificate.

## Non-regressione
`src/strategy.mjs`, `src/economy.mjs`, `src/reticulum.mjs`, `experience/episode.mjs`, `experience/choice_contract.mjs` e la plancia CP01 non devono essere alterati. Solo modulo di presentazione CP02, pagina e asset nuovi, integrazione via link minimo nella homepage, gate CI e test. Nessun secondo reducer autorevole.

## Contratto di turno
1. `f7Observe(session)` pubblica solo fatti autorizzati; `decisionModel` restituisce i piani possibili.
2. Cambiare piano e consultare il tavolo lascia invariato il digest `f7Audit`.
3. `campaignPlay` traduce il piano scelto in un vero comando `f7Play`; un esito non valido non altera la sessione.
4. Un comando valido risolve un atto del preludio **oppure un intero trimestre economico**. Gli NPC evolvono nello stesso tick del mondo F7.
5. Una ricevuta racconta soltanto differenze osservabili fra stato precedente e successivo.
6. `f7Save` / `f7Restore` ricostruiscono esattamente la partita, con verifica del digest.
7. Dopo l'ottavo trimestre non è consentita un'ulteriore azione; viene mostrato il finale canonico e l'esito personale.

## Gate granulari (non compensabili)
| ID | Condizione verificabile | Falsificatore | Evidenza |
|---|---|---|---|
| CP02-L01 | Cinque ruoli selezionabili | Ruolo senza piani legali | Node 5/5 |
| CP02-L02 | Preludio reale F7 | Salto silenzioso al turno 1 | Node prologue acts |
| CP02-L03 | Otto trimestri autentici | Numero diverso da otto | Node + audit |
| CP02-L04 | Un solo reducer | Secondo stato economico autoritativo | Import source review |
| CP02-L05 | Preview pura | Digest mutato con click | Node + browser |
| CP02-L06 | Una CTA principale | Impossibile capire azione | DOM/Chromium |
| CP02-L07 | Conseguenza post-commit | Testo predittivo non supportato | Receipt scope |
| CP02-L08 | Condizione di vittoria esplicita | Manca 4/0 e otto trimestri | Projection/DOM |
| CP02-L09 | Missione personale | Stesso fine per tutti i ruoli | Role objective projection |
| CP02-L10 | Finale bloccante | Nono trimestre possibile | Node |
| CP02-L11 | Replay integro | Digest diverge dopo import | Node + Chromium |
| CP02-L12 | Mobile senza overflow | CTA fuori viewport 390×844 | Chromium |
| CP02-L13 | CP01 invariato | Homepage sostituita o rotta | Git diff & legacy tests |
| CP02-L14 | CI su SHA PR | Check non conclusivo | GitHub Actions |
| CP02-L15 | Limite epistemico visibile | Claim multiplayer o 16 trimestri | Documentazione e footer |

## Catena E2E
`Scelta del ruolo → proiezione F7 → piano legale → CTA → f7Play → eventi/economia → indicatori/cronaca → turno successivo → finale → archivio → replay`. Le prove locali coprono la catena per tutti i ruoli, ma il browser locale usa test con JS incorporati: HTTP esterno, QA WCAG 2.2 AA, sicurezza, prestazioni in produzione e divertimento umano restano **BLOCK**.

## Gate globali
CIE 1.0 continua a richiedere Golden Crisis multiattore, campagna da 16 trimestri, server autorevole, contenuti, sicurezza/licenze, accessibilità e validazione umana. CP02 non certifica nessuno dei 32 gate globali.
