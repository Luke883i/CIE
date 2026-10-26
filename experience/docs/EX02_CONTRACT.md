# EX02 — Prima di confermare: potere, costo, incertezza

## Decisione di governance
Baseline PR #15, SHA `9eb7a70f9d647f5a4ac68988f2528a08e99b00a7`. La slice migliora soltanto l'interazione EX01, non il reducer AC03, la campagna F7, il registro ICTC o le condizioni di vittoria. Il gioco resta una demo hotseat di un trimestre e cinque ruoli.

## Audit 1–3: contratti di uscita

| Gate | Requisito falsificabile | Prova | Stato progettato |
|---|---|---|---|
| EX02-L01 | Ogni scelta visualizzata è nel catalogo autorizzato del ruolo | Node across all five roles | PASS se test verde |
| EX02-L02 | Ogni scelta ha descrizione di potere, costo e incertezza | Node completeness | PASS se test verde |
| EX02-L03 | Anteprima senza stato riservato, senza fare previsioni del futuro | Sentinel / observable-only tests | PASS se test verde |
| EX02-L04 | Esplorare/scartare una scelta non cambia il digest del mondo | 600 campagne / 9.000 preview | PASS se test verde |
| EX02-L05 | Anteprima di azione illegale o dopo il finale rifiutata | Negative tests | PASS se test verde |
| EX02-L06 | Cambiare ruolo azzera l'anteprima | UI code + browser E2E richiesto | PARTIAL fino a browser |
| EX02-L07 | Ogni ramo termina con replay e bilanci riconciliati | 600 complete runs | PASS se test verde |
| EX02-L08 | Nessuna vignetta senza ID di evento sorgente | 600 complete runs | PASS se test verde |
| EX02-L09 | Il test EX01/EX02 entra nella CI ufficiale | Workflow verify.yml | PASS dopo CI remota |
| EX02-L10 | Baseline AC03/F7/ICTC immutata | Git blob comparison | PASS dopo verifica GitHub |
| EX02-I01 | Catena vista -> scelta -> spiegazione -> ordine -> ricevuta -> vignetta | Node + browser | PARTIAL in assenza browser HTTP nativo |
| EX02-I02 | Audit 1 (disponibilità), Audit 2 (integrità), Audit 3 (significato) non confusi | Assurance + test | PASS se check |
| EX02-G01 | 32 gate di release CIE | gate status fail-closed | BLOCK |
| EX02-G02 | Comprensione e divertimento misurati con utenti indipendenti | test preregistrato >= 30 partecipanti per variante | BLOCK |

### Tre obblighi indipendenti
- **Audit 1, prodotto reale**: una partita completa *nel perimetro di un solo trimestre*, non una campagna commerciale.
- **Audit 2, governance**: contratti read-only, no leak intenzionali, replay, conservazione contabile, nessuna alterazione della simulazione canonica.
- **Audit 3, esperienza emergente**: prima della conferma l'interfaccia distingue poteri, costi e incertezza; la comprensione effettiva e il piacere richiedono studio umano.

### Falsificatori permanenti
- Il giudice mostra la possibilità di sospendere il porto: FAIL.
- L'offerta di credito viene presentata come finanziamento gratuito e senza debito: FAIL.
- La convocazione presidenziale viene presentata come autorizzazione: FAIL.
- Un evento narrativo non punta al registro canonico: FAIL.
- La mera anteprima altera il digest: FAIL.
- I test EX01 non vengono eseguiti nella CI: FAIL.
- Un test sintetico viene promosso a prova di divertimento: FAIL.

## Non-claim e roadmap
Nessuna pretesa di sicurezza hotseat contro devtools, autenticazione reale, persistenza multi-trimestre, bilanciamento del gioco, conformità WCAG completa o pubblicabilità. Successivo esperimento EX03: confronto umano pre-registrato di EX01 vs EX02 su tasso di spiegazione corretta degli effetti, errori e agency percepita; poi integrazione con mondo multiplayer autorevole.
