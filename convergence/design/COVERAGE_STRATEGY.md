# Strategia di copertura: dalla matrice al campionamento avversariale

## Universo di prova dichiarato e non dichiarato

La prova locale AC-01 delimita **tre regimi di riferimento, cinque ruoli, quattro fasi, cinque lenti, tre modalità di accesso e tre stati di conoscenza**. Il prodotto V4/V5 progetta 30 scenari autoriali e moltissime ricette strutturalmente ammissibili; questo NON significa che sia già possibile verificarne 30, né che ogni combinazione sia materialmente realizzabile.

Le 2.700 celle di `registry/coverage_pairwise.json` costituiscono un *piano*, non un registro di risultati. Il set cover greedy seleziona 26 vettori su cui tutte le 218 coppie in scope sono rappresentate almeno una volta, come controllato indipendentemente dall'auditor. La copertura pairwise non garantisce assenza di difetti che richiedano tre+ dimensioni, ordine temporale specifico o azioni illegali.

## Perciò si usano quattro strati di coverage

1. **Copertura locale per contratto:** positivo, negativo, confine, ruolo, secret sentinel, migrazione del ruleset.
2. **Copertura delle coppie:** pianificazione sintetica su fattori ruolo/regime/fase/vista/access/knowledge, poi reale esecuzione sui 26 vettori in un runtime comune.
3. **Giunzioni avversariali:** 24 CJ che colpiscono simultaneità, collusione, legalità, segreti, crediti, comic e rollback. Ogni CJ deve essere avviata da una *conseguenza indesiderata misurabile*.
4. **Campagne/umani:** percorso completo di 16 trimestri × cinque ruoli e prove con partecipanti reali; uno stream relativo a agency e divertimento, uno a precisione/affidabilità e uno a disabilità e utenti vulnerabili.

## Contratti di evidenza

Una ricevuta utilizzabile per un PASS comprende: `claimId, rulesetSha, buildSha, sourceHash, seed, worldId, quarter, actor, observerRole, input, outputDigest, expected, falsifier, environment, testCodeSha, artifactLocation, independentReviewer, consentBasisIfHuman, timestamp`. I campi non applicabili vanno esplicitati e motivati, non cancellati.

La riproducibilità delle azioni algoritmiche non dimostra le proprietà psicologiche dei giocatori. Un test grafico automatizzato non dimostra conformità WCAG AA. Una chiusura di un caso narrativo non dimostra diritti sull'illustrazione o sulla voce registrata.

## DoD del piano di coverage (non esecuzione)

- Universi e assi nominati; denominator calcolato; vettori ripetibili con seed e hash.
- Le coppie sono verificate indipendentemente e nessun `executed` viene inventato.
- Ogni CJ ha almeno tre layer, micro-DoD, E2E, gate globali e caso avversariale concreto.
- Scenari in sviluppo e scenari progettati rimangono categorie distinte.

**Stato attuale:** copertura del piano PASS; esecuzione in un unico runtime 0; validazione umana 0; release BLOCK.
