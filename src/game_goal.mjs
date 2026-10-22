/** Game-meaning contract. This is a view-only projection, NOT a second engine.
 * All win thresholds mirror src/economy.mjs: finalOutcome().
 */
export const GOAL_RULESET='CIE-GOAL-CLARITY-1.0.0';
export const GOAL={project:4,fragile:3,defaults:0,quarters:8};
const PEOPLE={
 COSTANTINO:{INSTITUTIONAL:'Presenta il Patto digitale e cerca una via istituzionale.',ECONOMIC:'Mobilita la rete: gli altri attori possono dissentire.'},
 FINANZIATORE:{INSTITUTIONAL:'Valuta se finanziare il Patto: il capitale è limitato.',ECONOMIC:'Decidi se offrire credito o proteggere la liquidità.'},
 PARLAMENTARE:{INSTITUTIONAL:'Esamina e vota: non controlli la Presidenza o la Corte.',ECONOMIC:'Valuta contributi pubblici e sostenibilità del bilancio.'},
 PRESIDENTE:{INSTITUTIONAL:'Esercita i poteri della carica senza sostituirti agli altri organi.',ECONOMIC:'Sollecita trasparenza e confronto pubblico.'},
 GIUDICE:{INSTITUTIONAL:'Controlla prove, composizione e garanzie della Corte.',ECONOMIC:'Difendi le garanzie senza negoziare il risultato giudiziario.'}
};
const LABEL={DURABLE_PROGRESS:'Obiettivo raggiunto: progresso durevole',FRAGILE_PROGRESS:'Progetto avanzato, ma risultato fragile',DEBT_CRISIS:'Crisi finanziaria: insolvenze non risolte',STALLED_REFORM:'Il progetto non ha raggiunto il traguardo'};
const isInt=Number.isSafeInteger;
export function gameGoal(view,role){
 if(!view||typeof view!=='object'||!Object.hasOwn(PEOPLE,role))throw Error('GOAL_VIEW_OR_ROLE');
 const economic=view.mode==='ECONOMIC', ended=economic&&Boolean(view.ended);
 const p=economic?view.progress:0,d=economic?view.defaults:0,q=economic?view.quarter:0;
 if(!isInt(p)||p<0||p>100||!isInt(d)||d<0||d>100||!isInt(q)||q<0||q>9)throw Error('GOAL_UNSAFE_OBSERVATION');
 const outcome=ended?view.outcome:null;
 if(ended&&!Object.hasOwn(LABEL,outcome))throw Error('GOAL_UNKNOWN_OUTCOME');
 const meets=(p>=GOAL.project&&d===GOAL.defaults);
 if(ended&&(outcome==='DURABLE_PROGRESS')!==meets)throw Error('GOAL_OUTCOME_INCONSISTENT');
 const text=ended?LABEL[outcome]:economic?(d>0?'Una insolvenza blocca il successo durevole.':p>=GOAL.project?'Hai raggiunto il traguardo: proteggilo.':'Realizza il Patto digitale senza provocare insolvenze.'):'Avvia il Patto digitale attraverso le istituzioni.';
 return Object.freeze({schema:GOAL_RULESET,role,phase:economic?'ECONOMIC':'INSTITUTIONAL',ended,whatIsGame:'Un gioco di decisioni politiche, economiche e giudiziarie in un’Europa alternativa.',
 headline:text,actorTask:PEOPLE[role][economic?'ECONOMIC':'INSTITUTIONAL'],
 explanation:economic?'Le tue decisioni e quelle degli altri cambiano risorse, fiducia e possibilità di attuazione.':'Il primo capitolo stabilisce se e come il Patto può diventare una decisione legittima.',
 victoryRule:'In 8 trimestri: almeno 4 punti di avanzamento e zero insolvenze.',
 liveStatus:ended?LABEL[outcome]:d>0?'Il finale durevole non è più possibile; da 3 punti puoi ottenere progresso fragile.':p>=4?'Condizione attualmente rispettata: può cambiare nei trimestri rimanenti.':'Traguardo ancora da raggiungere.',
 stakes:'Le crisi del debito compromettono la vittoria durevole. Gli altri attori decidono autonomamente.',
 horizon:economic?`${Math.min(q,8)} / 8 trimestri`:'Preludio istituzionale → 8 trimestri',
 result:outcome,resultLabel:ended?LABEL[outcome]:null,
 metrics:[{id:'progress',label:'Avanzamento',value:p,target:GOAL.project,display:`${p} / ${GOAL.project}`,help:'Punti sintetici del progetto; traguardo minimo 4.'},
 {id:'defaults',label:'Insolvenze',value:d,target:GOAL.defaults,display:String(d),help:'Deve restare a zero per ottenere progresso durevole.'}],
 epistemic:'Regole di un mondo fittizio; non sono dati statistici reali.'});
}
export function auditGameGoal(m){
 if(m.schema!==GOAL_RULESET||m.metrics.length!==2||m.metrics[0].target!==4||m.metrics[1].target!==0||!m.actorTask||!m.victoryRule)throw Error('GOAL_CONTRACT');
 if(m.ended&&(!m.resultLabel||!Object.hasOwn(LABEL,m.result)))throw Error('GOAL_MISSING_END');
 return true;
}
