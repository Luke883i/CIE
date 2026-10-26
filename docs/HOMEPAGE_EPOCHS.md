# CIE · Censimento delle homepage e delle epoche · CP01

Baseline ispezionata: `main` `6918a3da1562b629b66eacb050a7ee6cd7737509`, PR #16 EX02 merged. La presenza di una route non certifica un gioco completo.

## Epoche identificabili

| Epoca | Slice / tentativo | Interazione principale | Stato epistemico |
|---|---|---|---|
| Origine | F1–F2 | costituzione di un mondo storico e replay | motore tecnico |
| Istituzioni | F3–F4 | atti legali, mandati e giustizia | episodio locale |
| Economia e relazioni | F5–F7 | trimestri economici e diplomazia | singola campagna umano + NPC |
| Atlante | F8, F8bis | mappa e strumenti di navigazione | vista del mondo, non nuovo motore |
| Progressione e Focus | PR10–11 | decisione primaria, conseguenze e grafica | UI diverse sul F7 |
| Scopo e ruoli | PR12 | finale collettivo e missioni personali | obiettivi sintetici |
| Sistemi di guerra e mondo | V2–V5.1 bundle locali | portafogli multisettore, fumetti, tavolo | prototipi separati, non main |
| Assurance / convergenza | V6, AC01–AC04, PR13–14 | reticolo, persistenza, due motori distinti | piattaforma e prove, release BLOCK |
| Esperienza delimitata | PR15 EX01 | cinque ordini, un mondo, un turno | episodio hotseat completo |
| Significato della scelta | PR16 EX02 | competenza, costo e incertezza prima di confermare | proiezione read-only |
| Homepage unica | CP01 questa PR | tavolo+carte+drilldown, riuso EX01/EX02 | nuova entrata, stessa meccanica |

## Censimento completo delle 12 homepage HTML di `main` pre-CP01

| Route | Cosa mostra | Classificazione dopo CP01 |
|---|---|---|
| `/web/index.html` | redirect storico a F10 | **sostituita: unica home canonica CP01** |
| `/web/f3.html` | episodio istituzionale | LEGACY leggibile |
| `/web/f4.html` | approfondimento giuridico | LEGACY leggibile |
| `/web/f5.html` | episodio economico | LEGACY leggibile |
| `/web/f6.html` | reticolo V9 | LEGACY leggibile |
| `/web/f7.html` | negoziati | LEGACY leggibile |
| `/web/f8.html` | atlante cartografico | LEGACY leggibile |
| `/web/f10.html` | Focus/obiettivi | LEGACY leggibile |
| `/web/f10-expert.html` | dashboard esperta | LEGACY leggibile |
| `/experience/web/index.html` | EX01+EX02 giocabile | LEGACY REFERENZA E2E; non eliminata |
| `/convergence/ac03/web/index.html` | esperimento HTTP persistente AC03 | LABORATORIO LEGACY, non home commerciale |
| `/convergence/ac04/web/index.html` | adattatore F7 persistente AC04 | LABORATORIO LEGACY, non home commerciale |

Le pagine legacy non vengono cancellate o redirette: replay e deep link possono dipenderne. La deprecazione è **a livello di navigazione canonica e di registro**; non è una rimozione immediata. Nessun asset storico viene riciclato senza verifica di provenienza.

Il censimento fallisce se una nuova pagina HTML nelle quattro radici note non compare nel registro. Numero: 12 homepage = 1 canonica + 11 legacy.
