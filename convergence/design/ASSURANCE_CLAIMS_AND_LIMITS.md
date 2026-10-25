# Assurance case: cosa è noto, cosa rimane aperto

## CLAIM-P — Integrità del processo (supportata, limitata)

La baseline V6 è localmente congelata con hash SHA-256. Ogni editing silenzioso dei contratti protetti viene rilevato, salvo modifica simultanea dell'archivio/lock o compromissione del validatore. Il reticolo esteso ha link esatti e DAG verificato. Il release gate non può diventare verde usando soltanto campi editabili. Le prove negative attaccano 20 famiglie di corruzione; una vulnerabilità nuova richiede un nuovo test.

## CLAIM-C — Assenza di requisiti orfani (supportata sul perimetro)

146 micro-requisiti V6, 20 catene, 32 gate, 24 congiunzioni trasversali, 16 prospettive interne e 20 domande aperte appaiono tutti nel reticolo, ciascuno collegato a catene/gate. Questo non dimostra che l'ontologia degli interessi umani, giochi e minacce sia esaustiva.

## CLAIM-X — Esecuzione corretta del gioco (non supportata in V6.1)

Non sono state eseguite le 24 prove incrociate sul runtime reale, nessun simulatore V3 è stato mutato e nessuna prova di giocabilità su 16 trimestri è stata acquisita ora. I test del *validator* non provano l'implementazione del *gameplay*. 0/32 gate globali certificati.

## CLAIM-H — Divertimento e comprensione (non supportata)

Nessuna persona reale ha partecipato a una prova in questa iterazione. Le sedici prospettive sono esercizi interni e non peer review indipendente. Misurare con persone consenzienti la comprensione entro 90 secondi, la sensazione di agency, il volersi rigiocare, il carico cognitivo, il rispetto dell'accessibilità e il livello di stress desiderato.

## CLAIM-R — Release (bloccata)

Non ci sono trusted roots né candidate release verificata. Un lock locale può essere falsificato se l'attaccante controlla anche la sua origine; serve provenance esterna e firme/CI affidabile, con identità del revisore. Le policy non sono certificazioni ISO, ASVS o WCAG. Qualsiasi nuovo P0 o critica esterna riapre il reticolo.

## Riferimenti di lavoro (non certificazioni)

- ISO/IEC 25010:2023: https://www.iso.org/standard/78176.html
- ISO/IEC/IEEE 29148:2018: https://www.iso.org/standard/72089.html
- OWASP ASVS 5.0.0: https://asvs.owasp.org/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Ecma ECMA-424 CycloneDX 1.7: https://ecma-international.org/publications-and-standards/standards/ecma-424/
