# AC-02: contratto eseguibile, dalla transazione alla scena

## Ipotesi

Cinque giocatori con poteri diversi possono presentare decisioni contemporanee sullo stesso mondo fittizio. La Corte ha competenza su un fascicolo energetico ammissibile, il Tesoro finanzia opere gia` autorizzate, il finanziatore puo` erogare credito, Parlamento e Presidenza hanno atti separati. La risoluzione non deve dipendere da chi clicca prima.

## Ordine dei passaggi (normativo nel prototipo)

`PLANNING[revision=0] → role orders → canonical role plan → judicial stay → parliamentary inquiry and presidential convocation → bridge credit → deterministic priority energy-before-port → account transfers → cohort impacts → public event receipts → observer projections → comic frames → replay`.

`draft` non applica effetti: conserva un ordine per ruolo, vincolato a potere e revisione. I ruoli non presenti vengono impostati a HOLD (esplicito nella UI).

`commit` ordina canonicamente gli ordini, li applica a una **copia** dello stato e non pubblica un risultato parziale. Le due opere costano 5 ciascuna, il Tesoro inizia con 7 e il fondo privato con 8. Senza credito e senza stay una sola opera viene eseguita; con stay energia viene sospesa senza bloccare il porto; con credito ponte il saldo totale rimane 24 e la passivita` di 5 e` registrata. Le risorse sono fittizie, la priorita` e` una regola arbitraria dichiarata, non una simulazione di reali emergenze.

## Esempio osservato e dipendenze

- `GIUDICE STAY(P-ENERGY)` → `COURT_INTERIM_STAY` → `EXECUTION_BLOCKED` per l'energia.
- `FINANZIATORE OFFER_CREDIT` → `PUBLIC_CREDIT` e trasferimento `FUND → TREASURY` di 5.
- `COSTANTINO EXECUTE(P-ENERGY)` → ordine legalmente presentato ma sospeso; NPC manutenzione porta avanti il porto.
- `P-PORT` eseguito → `PORT_WORKERS +3` con `sourceEventIds` e frame del fumetto.
- `PARLAMENTARE INQUIRE` e `PRESIDENTE CONVENE` producono atti separati senza auto-autorizzazione.

## Regole che l'auditor deve negare

1. Cambiare l'ordine di invio non cambia il digest canonico (480 permutazioni verificate).
2. Un comando giuridicamente invalido/stale non altera il mondo.
3. Nessuna transazione genera denaro o spende un saldo negativo.
4. Il commit con chiave duplicata restituisce la ricevuta precedente; con chiave diversa rifiuta.
5. I ruoli non osservano le note private altrui nei campi o nel testo dei comics, incluso alt.
6. Ogni frame ha almeno un evento pubblico come fonte.
7. Le sole operazioni di consultazione non cambiano digest.
8. La riproduzione produce lo stesso stato, e un mondo alterato genera errore di replay.

## Confine della garanzia

Questo programma gira **in un solo processo** e non risolve realmente concorrenza multi-processo né segreti in client non fidati. L'impronta interna e` FNV-1a a 32 bit, utile per regressione, **non** firma o autenticazione crittografica. Le attestazioni dei file di distribuzione usano SHA-256 esterno. Il modello non e` un collegamento transazionale al motore canonico F7/V3 ma un nuovo microkernel isolato con tassonomie V3 importate e congelate. Vietata promozione dei gate globali.
