# CP01 — Un solo tavolo canonico, senza riscrivere le regole

## Baseline

`main` `6918a3da1562b629b66eacb050a7ee6cd7737509`, PR16 EX02 merged. Entrata `/web/index.html` prima del change: redirect a F10, non EX01/EX02.

## 3 commit semantici

1. `research(board): survey 100 titles and lock primitive provenance` — 10 classi, 18 primitive, classi di evidenza, SBOM parziale e inventario delle homepage F1–EX02.
2. `feat(board): converge to one canonical playable tabletop` — tavolo INK & BLEU, carte, scelta legale, anteprima EX02, conseguenze del mondo EX01, 3 lenti, nessun terzo reducer.
3. `test(board): falsify 100k preview paths and close CI gates` — 100.500 proiezioni, 6.700 episodi, 33.500 tentativi illegali, Chromium desktop/mobile, lineage test, CI separata.

## DoD e limitazioni

Vedi `docs/CP01_CONTRACT.md`: 18 DoD locali, tre catene E2E, release 0/32. I risultati locali vengono confermati sulla source real del repository dalla CI della PR; solo dopo quel risultato il merge può essere preso in considerazione.

La homepage non sostiene di essere il gioco completo; preserva le nove route legacy, no eliminazione di motori o archivi. La ricerca su 100 giochi è uno scouting documentale ragionato per trasferimento di primitive, non osservazione empirica o riuso di proprietà intellettuale.
