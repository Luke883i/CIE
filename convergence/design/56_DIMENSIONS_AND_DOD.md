# CIE V5.1 - 56 dimensioni e DoD non compensabili

Questo registro definisce condizioni di USCITA, non certifica funzionalita oggi giocabili. Le 24 dimensioni V5 sono state disaggregate in 56 contratti misurabili.

| ID | Dimensione | DoD verificabile | Metodo | Falsificatore | Stato |
|---|---|---|---|---|---|
| A01 | Identita del gioco | Tre frasi di pitch testate; >=80% tester descrive fantasy senza suggerimenti | interviste cieche + studio qualitativo | A01: parliamo di cosa si vuole fare invece che di come appare la UI | DEBT_BLOCKED |
| A02 | Identita di ciascun ruolo | Cinque power-fantasy distinguibili; >=80% riconosce ruolo e potere da una decisione | 5x scenario blind role test | A02: giocare la stessa sequenza con colore diverso | DEBT_BLOCKED |
| A03 | Scopi e conflitti di valori | Obiettivo mondo/personale/eredita coerenti per 5 ruoli; contratti endgame senza shortcut | goal oracle su 5x16Q | A03: successo totale nonostante vincoli non negoziabili | DEBT_BLOCKED |
| A04 | Tensione decisionale | Per ciascun ruolo >=3 dilemmi con due scelte difendibili e costi differenti | strategy exploit search + human interviews | A04: una scelta e universalmente dominante | DEBT_BLOCKED |
| A05 | Costo emotivo non moralista | >=2 finali controversi non moralizzati per ogni ruolo, diari con eventi veri | finale matrix + narrative referee | A05: il testo premia sempre la scelta etica | DEBT_BLOCKED |
| A06 | Pacing e noia | Mediana dei turni senza decisioni significative <=1; boredom <3/5 nel campione | turn telemetry e questionari opt-in | A06: turnover automatico senza tensione | DEBT_BLOCKED |
| A07 | Rigiocabilita e sorpresa | Almeno 3 strategie non equivalenti per ognuno dei 12 scenari release; nessuna strategia vince >=85% cross-seed | Monte Carlo + retest umano | A07: cambiare seed produce la stessa storia | DEBT_BLOCKED |
| B01 | Semantica del trimestre | Un trimestre produce un unico commit di world; tutti gli ordini coerenti con revisione | property tests concurrent resolution | B01: un ruolo avanza il mondo per tutti prima del lock | DEBT_BLOCKED |
| B02 | Grammatica degli ordini | Set di verbi tipizzati con target, intensita, termini, audit per 5 ruoli | schema validation + command fuzzer | B02: ordini generici equivalgono ad autorizzazione universale | DEBT_BLOCKED |
| B03 | Delega e inerzia | Zero ordini legali; politiche vigenti e NPC proseguono; nessuna ricompensa automatica | no-op differential trajectories | B03: fare nulla ferma il mondo | DEBT_BLOCKED |
| B04 | Scarsita e tradeoff | Attenzione + risorse + mantenimento con almeno 2 vincoli attivi in ogni Golden Crisis | budget property + scenario tests | B04: interventi sempre gratuiti | DEBT_BLOCKED |
| B05 | Concorrente e lock | Commit simultaneo o ordinamento dichiarato e deterministico tra 5 attori | permutation tests + idempotency keys | B05: primo click vince per errore di ordering | DEBT_BLOCKED |
| B06 | Preview e incertezza | Preview mostra impatti noti e intervalli non esatti; non espone scelte private NPC | information-flow fuzz | B06: UI rivela la futura decisione avversaria | DEBT_BLOCKED |
| B07 | Esito e attribuzione | Ricevuta per azione con delta, cause, tempi, perdenti e livello di certezza | event proof coverage >=99% turn receipts | B07: feedback scenico non collegato al mondo | DEBT_BLOCKED |
| C01 | Mandati e competenze | Tutte le azioni hanno fonte di potere: no universal command; 100% forbidden rejected | ACL property tests all roles | C01: giudice autorizza credito o Costantino annulla sentenza | DEBT_BLOCKED |
| C02 | Proposta vs esecuzione | Almeno 3 workflow con proposta/autorizzazione/esecuzione in tick distinti | transition state machine tests | C02: una proposta diventa automaticamente legge | DEBT_BLOCKED |
| C03 | Veti e contrappesi | Ogni ruolo puo bloccare almeno un processo ma non puo sequestrare il mondo | reachability & veto conflict fuzzer | C03: blocco permanente senza rimedio | DEBT_BLOCKED |
| C04 | Contenzioso e rimedi | Casistica competente, collegialita, prove e rimedi con audit 100% | judicial reference scenario suite | C04: sentenza politica scritta in anticipo | DEBT_BLOCKED |
| C05 | Mandati nel tempo | Successioni, revoche, incompatibilita e attribuzione per 16 trimestri | mandate overlap and stale tests | C05: poteri continuano dopo la scadenza | DEBT_BLOCKED |
| C06 | Autorita multilivello | Europa, Stato, Regione, privato; delega non equivale a sovranita | cross-jurisdiction forbidden tests | C06: giurisdizione trattata come ruolo decorativo | DEBT_BLOCKED |
| C07 | Informazioni di diritto | Privacy, privilegio, segreto, pubblicita e contraddittorio separati | role information noninterference | C07: il giocatore vede fascicoli segreti | DEBT_BLOCKED |
| D01 | Topologia e territori | Rotte, nodi e colli di bottiglia; >=10 controprove di trasmissione fra domini | topology perturbation suite | D01: colpire un porto non cambia alcun collegamento | DEBT_BLOCKED |
| D02 | Energia e reti | Bilanci energia: produzione+import+scorte=uso+perdite+export | balance invariant per tick | D02: energia creata dal consenso | DEBT_BLOCKED |
| D03 | Commercio e logistica | Flussi limitati da mezzi/capacita/tempo, shortage trasferibili | flow conservation tests | D03: rifornimenti teleportati | DEBT_BLOCKED |
| D04 | Economia e finanza | Partita doppia e solvibilita, scadenze, liquidita e default senza exploit | ledger reconciliation >=1e5 mutated transactions | D04: prestiti a costo nullo | DEBT_BLOCKED |
| D05 | Gruppi sociali | >=12 coorti con esposizioni non uniformi e audit della distribuzione | cohort differential tests | D05: tutte le persone reagiscono uguale | DEBT_BLOCKED |
| D06 | Servizi e infrastrutture | Sanita, scuola, acqua, reti essenziali con dipendenze e manutenzione | shock-to-service causal tests | D06: servizio riparte senza risorse | DEBT_BLOCKED |
| D07 | Ecologia e demografia | Shock climatici, recupero, vulnerabilita e migrazioni con lag plausibili di gioco | lag sensitivity analysis | D07: effetti istantanei senza durata | DEBT_BLOCKED |
| E01 | Guerra multi-teatro | Cielo/terra/mare/infosfera con supply e attrito, senza armi magiche | front logistics tests | E01: una barra guerra +2 basta a vincere | DEBT_BLOCKED |
| E02 | Diplomazia e tradimento | Patti con clausole, reputazione, uscita e penalita persistenti | pact state machine + NPC refusal | E02: tradire gratis | DEBT_BLOCKED |
| E03 | NPC con obiettivi | >=12 organizzazioni con utility, risorse, memoria e capacita di veto | agent counterplay audit | E03: NPC acconsentono sempre | DEBT_BLOCKED |
| E04 | Regimi e transizioni | Pace, guerra, distopia, crisi e ricostruzione collegate da condizioni vere | transition reachability tests | E04: menu cambia scenario ma mondo resta invariato | DEBT_BLOCKED |
| E05 | Adattamento avversario | Nessuna policy fissa >85% delle vittorie in 1000 seed bilanciati | adversarial policy tournament | E05: bot adotta ricetta universale | DEBT_BLOCKED |
| E06 | Shock leggibili | Shock sintetici con anticipo osservabile o motivazione documentata | seed fairness and forecast tests | E06: eventi puniscono random senza counterplay | DEBT_BLOCKED |
| E07 | Negoziazione umana | 5 attori reali, opt-out, turn deadlines, assenze, anti-stallo | multiplayer red-team scenarios | E07: un umano blocca la partita all infinito | DEBT_BLOCKED |
| F01 | Memoria causale | 12+ personaggi ricordano solo eventi osservati; referenze immutabili | characterMemory event-ref proofs | F01: personaggio cita fatti non noti | DEBT_BLOCKED |
| F02 | Relazioni e tradimenti | Legami, debiti, amicizie, rancori e cambi reputazione persistenti | relationship consistency tests | F02: nessuno ricorda un tradimento | DEBT_BLOCKED |
| F03 | Scelta dei drammi | Scene director seleziona salienza senza aggiungere eventi nuovi | scene groundedness >=100% | F03: dialogo inventa morti o vittorie | DEBT_BLOCKED |
| F04 | Voci differenziate | Almeno 5 registri credibili, sottotesti e competenze diverse | blind narrative role classification | F04: stesso testo per presidente e giudice | DEBT_BLOCKED |
| F05 | Fumetti causali | Storyboard 1-6 pannelli, ciascuno con proofRefs e fallback testo | comic caption-to-event audit | F05: fumetto riporta esito mai accaduto | DEBT_BLOCKED |
| F06 | Ambiguita intenzionale | Almeno una lettura contestata ma verificabile per ogni storia importante | narrative perspective playtest | F06: onniscienza del narratore | DEBT_BLOCKED |
| F07 | Finali ed eredita | Min 4 esiti world x ruolo x scenario e legacy state stabile | ending reachability + replay | F07: risultato positivo universale | DEBT_BLOCKED |
| G01 | Gerarchia del tavolo | Una crisi prioritaria, un portafoglio, un commit; ruoli riconoscibili in 5s | cold-start timed comprehension | G01: UI appare un gestionale di numeri | DEBT_BLOCKED |
| G02 | Zoom semantico | Dalla campagna al settore, gruppo, personaggio e prova; back navigation | route-to-detail browser audit | G02: dettaglio perde contesto | DEBT_BLOCKED |
| G03 | Grammatica infografica | 12 famiglie x 30 scenari x 5 ruoli x 4 stati con fallback espliciti | coverage matrix 7200 cells + image QA | G03: asset scompare su scenario non supportato | DEBT_BLOCKED |
| G04 | Cartoon severo e crudo | 100% asset canon con contorni, tavolozza, gerarchia, silhouette; no photoreal | style lint + human art review | G04: stile lucido/corporate/photoreal | DEBT_BLOCKED |
| G05 | Motion e sonoro | Timing, audio, notifiche e silenzio opzionali; reduced motion | cross-device sensory opt-out | G05: animazioni nascondono ordini | DEBT_BLOCKED |
| G06 | Cognizione e chiarezza | Comprensione del rischio >=80% senza tutorial; un CTA contestuale | blind user comprehension 60 players | G06: il giocatore non sa che fare | DEBT_BLOCKED |
| G07 | Accessibilita e lingue | Tastiera, screenreader, 200% text, contrasti WCAG 2.2 AA + lingua fallback | independent WCAG and localization audit | G07: azione solo visuale o incomprensibile | DEBT_BLOCKED |
| H01 | Un unico world server | Versionamento, replay, partial order e 5 writers autenticati | five writers concurrency audit | H01: cinque mondi indipendenti | DEBT_BLOCKED |
| H02 | Persistenza e ripristino | Crash/restart, idempotenza, 24h catch-up e nessun double tick | fault injection and restart E2E | H02: evento perso o replicato | DEBT_BLOCKED |
| H03 | Sicurezza e privacy | Autenticazione, abuso, input, CSP, access control e retention | threat model and pen test | H03: client altera il mondo | DEBT_BLOCKED |
| H04 | Controlli e strumenti editor | Scenario compiler, reachability, art QA, test seed, localization | factory pipeline CI independent | H04: nuovi scenari aggiunti come copia-incolla | DEBT_BLOCKED |
| H05 | SBOM e provenance | CycloneDX completo, lockfile, asset provenance, diritti, build hashes | SCA+license scan+artifact signature | H05: licenza non verificata | DEBT_BLOCKED |
| H06 | Telemetria e ricerca umana | 60+ tester consentiti su 5 ruoli e 3 famiglie, UX comprehension/fun | pre-registered study protocol | H06: 100k simulazioni spacciate per divertimento | DEBT_BLOCKED |
| H07 | Operazioni e lancio | CI/CD, deploy, rollback, monitoring, supporto e release checklist | disaster rollback exercise | H07: rilasciare senza recupero | DEBT_BLOCKED |

## Quattro stati di prova
DESIGN_ONLY: idea e modello; STATIC_CHECK: asset/schema validi; RUNTIME_PROVEN: E2E verificato; HUMAN_PROVEN: esperienza validata da persone. Nessuno di questi livelli puo essere inventato per dichiarare PASS.

## Regole di blocco
Non si passa ad alpha finche A01, B01-B07, C01-C07, D01-D06, E01-E06, G01 e H01 non dispongono di evidenza runtime; non si rilascia senza l intero registro piu gate globali e prova umana.