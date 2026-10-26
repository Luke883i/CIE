/** CP02: 8-quarter SOLO campaign presentation/turn adapter over canonical F7.
 * No new authoritative reducer, invented forecast, or hidden NPC reads. */
import {f7Observe,f7Play,f7Save,f7Audit} from './strategy.mjs';
import {decisionModel} from './gameplay_ux.mjs';
import {gameGoal} from './game_goal.mjs';
import {roleObjective,dualOutcome} from './role_objectives.mjs';
import {observableResult,stageFromProgress} from './player_experience.mjs';
export const CAMPAIGN_RULESET='CIE-CP02-8Q-1';
export const PLAN_IDS=Object.freeze(['PRUDENTE','COOPERATIVO','INCISIVO']);
export const ROLE_LABELS=Object.freeze({COSTANTINO:'Costantino',FINANZIATORE:'Finanziatore',PARLAMENTARE:'Parlamentare',PRESIDENTE:'Presidente',GIUDICE:'Giudice'});
const CHOICE_LABELS=Object.freeze({PRUDENTE:'Prudenza',COOPERATIVO:'Cooperazione',INCISIVO:'Iniziativa'});
const string=x=>String(x??'').slice(0,220);
export function campaignView(session,selected='COOPERATIVO'){
 const v=f7Observe(session),role=session.core.core.humanRole,dm=decisionModel(v,role),goal=gameGoal(v,role);
 const archive=f7Save(session),personal=roleObjective(v,role,archive.commands),dual=dualOutcome(goal,personal);
 const plan=dm.plans.find(p=>p.id===selected)??dm.plans[0]??null;
 const economic=v.mode==='ECONOMIC',ended=Boolean(v.ended);
 const progress=economic?v.progress:0;
 const model={schema:CAMPAIGN_RULESET,role,roleLabel:ROLE_LABELS[role],phase:v.mode,ended,
   chapter:economic?`Trimestre ${Math.min(v.quarter,8)} di 8`:'Preludio istituzionale',quarter:economic?Math.min(v.quarter,8):0,
   mission:'Realizza il Patto digitale europeo evitando insolvenze in otto trimestri.',goal,personal,dual,
   headline:ended?goal.resultLabel:economic?'Decidi la prossima mossa':'Prepara le istituzioni',
   description:goal.actorTask,selectedId:plan?.id??null,canAct:dm.canAct,cta:dm.CTA,
   plans:dm.plans.map(p=>({id:p.id,label:CHOICE_LABELS[p.id]??p.label,act:string(p.label),risk:string(p.risk??p.subtitle),command:structuredClone(p.command)})),
   percent:Math.max(0,Math.min(100,Math.round(progress/4*100))),progress,stage:stageFromProgress(progress),
   metrics:economic?[{id:'progress',label:'Avanzamento',value:progress,target:4},{id:'defaults',label:'Insolvenze',value:v.defaults,target:0},{id:'support',label:'Sostegno',value:v.support,target:30},{id:'legitimacy',label:'Legittimità',value:v.legitimacy,target:30},{id:'volatility',label:'Pressione',value:v.volatility,target:20}]:[],
   lastEvents:(v.strategic?.publicResults??[]).slice(-4).reverse().map(x=>({quarter:x.quarter,outcome:string(x.outcome),reason:string(x.reason),move:string(x.move)})),
   digest:f7Audit(session).digest,turnsRemaining:economic?(ended?0:9-v.quarter):8,
   caveat:'Campagna fittizia individuale; gli altri quattro ruoli sono NPC deterministici. Non è multiplayer.'};
 campaignAudit(model);return Object.freeze(model);
}
export function campaignAudit(m){
 if(m.schema!==CAMPAIGN_RULESET||!Object.hasOwn(ROLE_LABELS,m.role)||m.plans.length>3||m.metrics.length>5)throw Error('CP02_SCOPE');
 if(m.ended&&m.canAct)throw Error('CP02_ENDED_CAN_ACT');
 if(m.canAct&&(!m.plans.length||!m.selectedId))throw Error('CP02_EMPTY_TURN');
 if(m.plans.some(p=>!PLAN_IDS.includes(p.id)||!p.command||!p.act))throw Error('CP02_UNEXPLAINED_CHOICE');
 if(m.quarter<0||m.quarter>8||!m.goal.victoryRule||!m.personal.description)throw Error('CP02_MISSING_GOALS');
 return true;
}
export function campaignPlay(session,id='COOPERATIVO'){
 const before=campaignView(session,id);
 if(!before.canAct)return {ok:false,code:'CP02_NO_TURN'};
 const plan=before.plans.find(x=>x.id===id)??before.plans[0];
 const cmd=plan.command.kind==='INSTITUTIONAL'?plan.command.choice:{move:plan.command.move,other:plan.command.other,choice:plan.command.choice,strategy:plan.command.strategy};
 const actual=f7Play(session,cmd);
 if(!actual.ok)return {ok:false,code:actual.code};
 const after=campaignView(actual.session,'COOPERATIVO');
 const changes=observableResult(f7Observe(session),f7Observe(actual.session)).changes.slice(0,4).map(x=>({label:x.label,delta:x.delta}));
 return {ok:true,session:actual.session,before,after,
   receipt:{label:before.phase==='INSTITUTIONAL'?'Atto istituzionale registrato':'Trimestre risolto',decision:plan.act,changes,
    summary:changes.length?changes.map(c=>`${c.label} ${c.delta>0?'+':''}${c.delta}`).join(' · '):'Nessuna variazione negli indicatori pubblici selezionati',
    note:'Effetti realmente osservati dopo il commit; non predizioni.'}};
}
