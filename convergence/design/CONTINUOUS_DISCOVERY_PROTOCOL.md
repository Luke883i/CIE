# Protocollo operativo di scoperta e assurance — processo, non manuale di produzione

## Una iterazione di discovery ha otto passaggi

1. **Congela la tesi**: versione delle regole, ruoli, 12 scenari di release selezionati, significato delle metriche, piattaforme e fasce di età. Esclusioni motivate via ADR; tutto il resto OPEN.
2. **Elicita in parallelo**: estrai bisogni da *regole*, *real game/telemetria con consenso*, *indagine con persone*, *sistema/operazioni*, *abuso*, *arte/narrazione*, *normativa/diritti*. L'invenzione di un solo modello non basta.
3. **Inversione del punto di vista**: prova la richiesta da ruolo attivo, avversario, NPC, spettatore, minore, giocatore assistivo, moderatore, revisore, incident responder e proprietario del servizio.
4. **Cerca giunzioni**: metti in collisione almeno tre micro-DoD (es. ordine offline × mandato revocato × UI stale). Cerca effetti che non appartengono a nessun requisito preso da solo.
5. **Triage**: `NUOVO_DOD`, `RAFFORZA_DOD`, `GIUNZIONE_E2E`, `ESCLUSIONE_APPROVATA`, `DUPLICATO_GROUNDED`. Non consentire categoria `IGNORA`.
6. **Scrivi falsificatori prima dei test**: caso positivo, negativo, confine, osservatore, scenario seed e risultato atteso. Il PASS non può essere assegnato dal solo autore.
7. **Esegui e conserva evidenze**: SHA commit, ruleset, input, seed, replay, ricevuta, screenshot/scena, hash output, ambiente, tester/reviewer e autorizzazione al trattamento dati. Prove ottenute su release diverse non si sommano.
8. **Riapri su ogni modifica**: cambiando qualsiasi DoD, generare blast radius dal reticolo (`impact.py`), invalidare evidenze downstream, testare di nuovo e pubblicare baseline nuova solo con approvazione esterna al proponente.

## Criterio di saturazione relativo (NON assoluto)

Un ciclo di discovery può concludersi come `SCOPED_EXHAUSTION_CANDIDATE` solo quando due round consecutivi con reviewer *differenti* non producono nuove criticità P0/P1, gli scenari fuori campione non generano giunzioni non classificate, tutte le exclusions hanno un decisore, la copertura combinatoria pianificata coincide con quella eseguita, e nessuna prova è stale sul release candidate. Richiede persone esterne; oggi **NON raggiunto**.

## Classi distinte di PASS

- **Local contract**: comportamento osservabile + falso positivo attaccato + prova attuale.
- **E2E intermediate**: stessi ID mondo/quarter/release per i DoD coinvolti; non è il prodotto di PASS unitari isolati.
- **Global**: ogni catena necessaria, compatibilità dei ruoli, gioco completo, sicurezza, accessibilità e prove umane su stessa candidata release.
- **Process**: auditor trova alterazioni e conserva BLOCK dove necessario. Non promuove la categoria precedente.

## Anti-Goodhart

Non aumentare il numero dei requisiti come obiettivo. Non scegliere mutazioni facili per esibire il 100%. Non utilizzare 2.000 variazioni dello stesso assert per chiamarle prospettive nuove. Privilegiare violazioni non intercettate e meccaniche dominanti; registrare i fallimenti come risultati, non rimuoverli dal report.
