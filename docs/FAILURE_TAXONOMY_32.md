# 32 classi di fallimento cognitivo/ludico

Classi da falsificare. Soglie human sono criteri di progetto **non** risultati osservati.

| ID | Failure | Contratto di rimedio | Metodo / DoD |
|---|---|---|---|
| C01 | Goal opacity: Il giocatore non sa per cosa sta giocando | Titolo e payoff hanno un verbo-obiettivo, orizzonte, condizione misurabile | heuristic: 5/5 ruoli mostrano scopo entro primo schermo |
| C02 | Absent win threshold: Un valore cresce ma nessuno sa se basta | Progresso corrente/4 e zero insolvenze | automatic: 100% viste economiche con target esplicito |
| C03 | Hidden loss condition: Il fallimento compare solo alla fine | La soglia debito/default e rischio sono spiegati ex ante senza promettere esito | automatic: 100% stati contengono regola esatta |
| C04 | Role ambiguity: Il titolo del ruolo non spiega competenza | Frase in seconda persona distinta per ognuno dei cinque ruoli | automatic: 5 messaggi semanticamente distinti |
| C05 | Ludic identity deficit: E una dashboard senza narrativa di conflitto | Patto digitale, ostacoli e attori vengono contestualizzati | human: >=80% sa rispondere cosa gioco |
| C06 | Abstract metrics: Consenso o progresso sembrano KPI operativi reali | Unità e target come astrazioni di gioco, differenza tra obiettivo e fattore | automatic: ogni metrica ha label+range+spiegazione |
| C07 | Metric valence inversion: Più pressione sembra un punteggio positivo | Rischi non presentati fra obiettivi da massimizzare | automatic: solo progress/default nel pannello vittoria |
| C08 | Metric hierarchy collapse: Ogni indicatore sembra altrettanto importante | Un obiettivo primario e una condizione di sicurezza; rischi nei dettagli | automatic: max 2 metriche di primo livello |
| C09 | Disembodied action: Scegli tra etichette senza percepire effetto | CTA usa un verbo e nomina oggetto/effetto per quanto conoscibile | human: >=85% sa parafrasare la propria azione |
| C10 | Pre-action uncertainty: Non sa cosa accade cliccando | Aspettativa limitata e caveat sugli NPC visibili | automatic: 100% CTA validi, nessuna previsione NPC |
| C11 | False certainty: L app promette che il piano funzionera | Caveat osservabilità e fattori indipendenti | automatic: zero asserzioni di esito NPC ex-ante |
| C12 | Feedback latency: Non collega conseguenze e decisione | Resoconto dopo click con deltas osservabili | automatic: receipt generato su 100% mosse testate |
| C13 | Feedback causality laundering: La scena grafica fa pensare a prova territoriale | Illustrazione esplicitamente simbolica, non mappa di effetti territoriali | automatic: 0 claim di KPI locali da vista globale |
| C14 | Invisible time horizon: Il turno non ha legame con finale | Trimestre corrente su 8 e condizione a T8 | automatic: 100% viste economic con clock |
| C15 | Dead effort: La progressione percepita non ha traguardi | Target visibile e feedback di avvicinamento | human: >=70% percepisce progresso |
| C16 | Premature complexity: Dati V9 e organizzazioni oscurano l ingresso | Dettagli disponibili solo su richiesta | automatic: 0 menu avanzati aperti in default |
| C17 | Recall tax: Serve ricordare obiettivo da altro schermo | Obiettivo sempre accanto alla CTA | automatic: 100% schermate decisioni includono goal |
| C18 | Plan homonym: Prudente/cooperativo sembra identico a livello di gioco | Mostra rischio/beneficio distinti e scelta contestuale | automatic: alternative label non duplicate |
| C19 | Empty progress semantics: Edifici illustrati anche se il progetto non avanza | Stage derivato soltanto da view.progress | automatic: consultazione non cambia stage/digest |
| C20 | Responsibility diffusion: Il giocatore pensa di poter dirigere tutti i ruoli | Potere del personaggio e autonomia degli altri comunicati | human: >=85% capisce confine di agency |
| C21 | Hollow social loop: Patti non hanno volto ne memoria | NPC e promesse con stato e scadenza | human: >=70% sa citare una relazione cambiata |
| C22 | Incoherent victory: Termine 8 trimestri senza sintesi comprensibile | Quattro esiti finali tradotti e criteri espliciti | automatic: 4 outcome labels univoci |
| C23 | Unfair failure: Il finale negativo appare senza spiegazione | Default e progresso mostrati in riepilogo finale | automatic: ogni esito contiene progress/default |
| C24 | Punitive replay: Un errore richiede rifare tutto senza contesto | Replay e nuovo seed presenti, senza false promesse undo | automatic: restore mantiene digest |
| C25 | Visual competition: Troppi riquadri chiedono attenzione insieme | Un messaggio, una CTA, due metriche | automatic: 1 CTA primaria e <=2 metriche |
| C26 | Help path invisibility: Approfondimenti nascosti senza etichetta | Details accessibili con nome concreto | automatic: 2 native details con summary |
| C27 | Jargon cliff: Terms T0-T5, procedura, reticolo prima del gioco | Lingua comune in superficie, termini specialistici nei dettagli | human: >=80% comprensione senza tutorial |
| C28 | Temporal FOMO: Il giocatore teme avanzamento automatico incontrollato | Avanzamento solo su comando in singleplayer | automatic: zero clock automatico in Focus |
| C29 | Cognitive fatigue: Sessioni di decisioni equivalenti diventano monotone | Riepilogo breve e ritmo differenziato, da playtest | human: mediana carico percepito <=3/5 |
| C30 | Ambiguous success language: Progresso fragile viene chiamato vittoria | Solo DURABLE_PROGRESS soddisfa obiettivo forte | automatic: 100% etichette di outcome coerenti con finalOutcome |
| C31 | Accessibility lexical: Icone e colori veicolano l unico significato | Label testuali, focus, aria-live e score in testo | automatic: 0 badge senza label testuale |
| C32 | Compulsion loop: Rientro o escalation senza scelte consapevoli | Nessuna penalità per assenza; replay volontario | human: nessuna pressione dark-pattern osservata |