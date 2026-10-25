# Dal ferro alle astrazioni UX composite: 19 livelli, 26 bridge

Non esiste un unico `frontend -> backend`. Il mondo ha quattro filiere concorrenti: **ordine / transazione**, **materialità / società**, **conoscenza / narrativa**, **visibilità / fruizione**; diritto, sicurezza, qualità umana e release governance sono vincoli trasversali.

## Le quattro catene essenziali

**Ferro e autorità:** browser/sessione -> identità -> ordine tipizzato -> mandato competente -> commit atomico -> log e replay. Un ordine non può diventare vero tramite una preview, un fumetto, un timeout o il client più rapido.

**Materialità e società:** evento canonico -> stock/flussi -> grafo causale tipizzato -> gruppi territoriali e reazioni autonome -> nuove risorse/scarsità/obblighi. Le conserve e le attribuzioni devono essere verificabili, non soltanto visivamente convincenti.

**Conoscenza e dramma:** eventi + gruppo/personaggio + versione + diritto di sapere -> proiezione conoscibile -> scena narrativa -> famiglia visuale. Chi non può conoscere un ordine segreto non deve scoprirlo da vignette, alt text, latenza, replay o accessibilità.

**Interazione umana:** testo orientato a scopo -> CTA legale -> anteprima di trade-off autorizzata -> conferma -> effetto osservato -> feedback multimodale -> studio umano. Densità visiva ridotta NON significa causalità spiegata.

## 19 contratti di responsabilità

La tabella normativa con input/output, invariante, falsificatore e DoD per ogni livello è `registry/layers.json`. Gli obblighi fra livelli sono `registry/bridges.json`. Ogni bridge resta `MISSING` finché un caso positivo, negativo, boundary e role-scoped non dimostra che il consumatore non può accettare dati falsi o obsoleti.

## Una Golden Crisis attraversa tutti i livelli

1. Il giocatore usa una UI di Costantino per pianificare il rinforzo della rete portuale durante guerra fra alleati.
2. L'ordine conserva `actor`, `mandate`, `worldRev`, `time`, `intensity`, `expectedResources` e `idempotencyKey`.
3. Il finanziatore presenta una condizione di credito e il Parlamento può rifiutare lo stanziamento; la Corte può sospendere un atto ammissibile senza poter disporre arbitrariamente del budget.
4. Cinque ordini concorrenti vengono risolti una volta sola, secondo un ordine di precedenza definito dal ruleset, non dalla latenza del browser.
5. Le risorse effettive, i porti e i gruppi materialmente esposti si aggiornano; NPC e coalizioni possono reagire.
6. Il log produce ricevute con differenze di stato e provenienza. Il filtro per ruolo limita le informazioni a ciò che è legittimamente visibile.
7. La stessa risoluzione genera: tableau fronti per Costantino; esposizione per finanziatore; iter legislativo per parlamentare; continuità istituzionale per presidente; fascicolo per giudice.
8. Fumetto e infografica citano cambiamenti osservabili, non eventi sintetizzati arbitrariamente per impressionare il giocatore.
9. L'esperimento umano deve stabilire se le cinque persone capiscono l'azione, percepiscono agency e desiderano rigiocare; il modello non può auto-certificarlo.

## Tre bridge da falsificare per primi

`BR-04?` non è una scorciatoia: gli ID esatti e gli estremi sono nella registry. Scegliere i passaggi **autorità→commit**, **commit→event log/risorse**, **proiezione→visual** e associare rispettivamente `CJ-02`, `CJ-04`, `CJ-05`. Non concludere che un test unitario del produttore provi il comportamento del consumatore.

## Zoom semantico e ontologia delle viste

La stessa entity deve mantenere ID e significato attraverso `<world-state> -> <region> -> <port> -> <group> -> <person> -> <comic-scene>`. Il cambio lente non modifica il mondo. La visualizzazione deve distinguere dato noto, stima modellata, intenzione NPC ignota, risultato differito e allegoria artistica. Regola anti-falso: se non vi è una prova geolocalizzata, vietare la precisione cartografica territoriale.
