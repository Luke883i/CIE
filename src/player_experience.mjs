/** F10: strictly observer-scoped, fictional game presentation. No authority or hidden-state reads. */
import {decisionModel,roleMission,deltaForKnownFacts} from './gameplay_ux.mjs';
export const EXPERIENCE_RULESET='CIE-F10-1.0.0';
export const CHAPTERS=Object.freeze(['Una proposta','Prime alleanze','Il cantiere','La risposta','Interessi in gioco','La prova','La scelta finale','Il bilancio']);
export const STAGE_NAMES=Object.freeze(['Una visione','Il progetto prende forma','Si apre il cantiere','La rete cresce','Una nuova infrastruttura']);
const safeNumber=(n,cap)=>Number.isSafeInteger(n)&&n>=0&&n<=cap?n:null;
const RULES=Object.freeze({PRUDENTE:'Priorità: verifiche e garanzie. Potresti rinunciare a parte dello slancio.',COOPERATIVO:'Priorità: collaborazione. Le altre persone possono rifiutare.',INCISIVO:'Priorità: rapidità. Aumenta l’esposizione a opposizione e rischio.'});
export function stageFromProgress(progress){const p=safeNumber(progress,100);return p===null?0:p>=4?4:p>=3?3:p>=2?2:p>=1?1:0;}
export function playerExperience(view,role){
 const dm=decisionModel(view,role),eco=dm.phase==='ECONOMIC',q=eco?safeNumber(view.quarter,9):0;
 if(eco&&q===null)throw Error('EXPERIENCE_QUARTER');
 const progress=eco?safeNumber(view.progress,100):0;
 if(eco&&progress===null)throw Error('EXPERIENCE_PROGRESS');
 const completed=Boolean(view.ended),stage=stageFromProgress(progress);
 const support=eco?safeNumber(view.support,100):null, legitimacy=eco?safeNumber(view.legitimacy,100):null,
 volatility=eco?safeNumber(view.volatility,100):null;
 const cards=dm.plans.map(p=>Object.freeze({id:p.id,label:p.label,tradeoff:RULES[p.id],command:p.command}));
 const signals=[];
 if(support!==null&&support<=6)signals.push({kind:'warning',text:'Il consenso è fragile: alcune alleanze potrebbero non reggere.'});
 if(volatility!==null&&volatility>=7)signals.push({kind:'warning',text:'La pressione cresce: i prossimi eventi possono cambiare il ritmo.'});
 if(legitimacy!==null&&legitimacy<=5)signals.push({kind:'warning',text:'La legittimità è sotto pressione: valuta le garanzie.'});
 if(!signals.length)signals.push({kind:'neutral',text:eco?'Il mondo è in movimento: osserva gli effetti dopo ogni scelta.':'Il preludio definisce chi può decidere e secondo quali procedure.'});
 const milestones=CHAPTERS.map((name,i)=>({number:i+1,name,state:!eco?'locked':completed||q>i+1?'done':q===i+1?'current':'future'}));
 return Object.freeze({schema:EXPERIENCE_RULESET,worldId:view.worldId,role,phase:dm.phase,canAct:dm.canAct,ended:completed,
 quarter:q,quarterMax:8,chapter:eco?CHAPTERS[Math.min(Math.max(q-1,0),7)]:'Le istituzioni si muovono',
 stage,stageName:STAGE_NAMES[stage],progress:progress??0,mission:roleMission(role),
 prompt:dm.prompt,cta:dm.CTA,plans:cards,milestones,signals:signals.slice(0,2),
 goal:eco?'Avanza il progetto senza esaurire consenso e fiducia.':'Completa il procedimento: ogni carica ha limiti e responsabilità.',
 metrics:eco?[{id:'progress',label:'Progetto',value:progress,cap:8},{id:'support',label:'Consenso',value:support,cap:30},{id:'legitimacy',label:'Legittimità',value:legitimacy,cap:30},{id:'volatility',label:'Pressione',value:volatility,cap:20}].filter(x=>x.value!==null):[],
 note:'Illustrazione simbolica di progresso aggregato; non è una mappa di effetti locali né una previsione delle scelte NPC.'});
}
export function observableResult(before,after,decision=null){
 const delta=deltaForKnownFacts(before,after);
 const known=delta.slice(0,3).map(x=>({id:x.key,delta:x.delta,label:({progress:'Progetto',support:'Consenso',legitimacy:'Legittimità',volatility:'Pressione',resilience:'Resilienza',production:'Produzione'})[x.key]||x.key}));
 const outcome=decision&&typeof decision.outcome==='string'?decision.outcome:'Atto registrato';
 return {outcome,changes:known,explanation:known.length?`${known.length} effetti visibili sulla situazione condivisa.`:'Il mondo ha registrato una scelta; gli indicatori osservabili non sono cambiati.',
 disclosure:'Risultato di una regola sintetica. Non mostra intenzioni o informazioni segrete degli NPC.'};
}
export function auditExperience(x){
 if(x.metrics.length>4||x.signals.length>2||x.plans.length>3||x.milestones.length!==8)throw Error('EXPERIENCE_DENSITY');
 if(x.phase==='ECONOMIC'&&(x.quarter<1||x.quarter>9))throw Error('EXPERIENCE_TIME');
 if(x.plans.some(x=>!x.tradeoff||!x.command))throw Error('EXPERIENCE_UNEXPLAINED_CHOICE');
 if(!x.goal||!x.cta||!x.mission||!x.note)throw Error('EXPERIENCE_CLARITY');
 return true;
}
