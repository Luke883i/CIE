/** CIE Focus Mode: observer-only compression. A decision guide, never a second game engine. */
import {decisionModel,validatePlan} from './gameplay_ux.mjs';
import {playerExperience,observableResult} from './player_experience.mjs';
import {gameGoal,auditGameGoal} from './game_goal.mjs';
import {roleObjective,dualOutcome,roleObjectiveAudit,choiceExplanation} from './role_objectives.mjs';
export const FOCUS_RULESET='CIE-FOCUS-1.0.0';
export const FOCUS_RULES=Object.freeze({
  visiblePrimaryActions:1,visibleDefaultOptions:0,maxHeadlineWords:10,maxSummaryMetrics:2,
  advancedOptIn:true,zeroPreActionConfiguration:true,noHiddenStateRead:true
});
const ROLE={COSTANTINO:'Costantino',FINANZIATORE:'Finanziatore',PARLAMENTARE:'Parlamentare',PRESIDENTE:'Presidente',GIUDICE:'Presidente di Corte'};
const FRAME={
 INSTITUTIONAL:{kicker:'Un atto alla volta',headline:'Che cosa decidi adesso?',description:'La tua scelta entra nella storia condivisa.'},
 ECONOMIC:{kicker:'Il mondo risponde',headline:'Come vuoi procedere?',description:'Gli altri attori possono reagire e opporsi.'},
 ENDED:{kicker:'Capitolo concluso',headline:'Hai scritto una storia.',description:'Esplora il bilancio o inizia una nuova partita.'}
};
const PLAN_EXPLAIN={PRUDENTE:'Più garanzie; potresti avanzare più lentamente.',COOPERATIVO:'Cerchi consenso; l’accordo non è garantito.',INCISIVO:'Spingi sul risultato; pressione e opposizione possono aumentare.'};
const safe=(s,n=130)=>String(s??'').slice(0,n);
export function focusModel(view,role,{planId='COOPERATIVO',playerCommands=[]}={}){
 if(!Object.hasOwn(ROLE,role))throw Error('FOCUS_ROLE');
 const decisions=decisionModel(view,role),experience=playerExperience(view,role),game=gameGoal(view,role);auditGameGoal(game);
 const personal=roleObjective(view,role,playerCommands);roleObjectiveAudit(personal);const dual=dualOutcome(game,personal);
 const plan=decisions.plans.find(x=>x.id===planId)??decisions.plans[0]??null;
 const frame=FRAME[decisions.ended?'ENDED':decisions.phase];
 const economy=decisions.phase==='ECONOMIC';
 const warnings=experience.signals.filter(s=>s.kind==='warning').slice(0,1);
 const metrics=game.metrics;
 const result={schema:FOCUS_RULESET,worldId:safe(view.worldId,140),role,roleName:ROLE[role],
 phase:decisions.phase,canAct:decisions.canAct,ended:decisions.ended,
 turn: economy?`Trimestre ${Math.min(experience.quarter,8)} di 8`:'Preludio',
 kicker:frame.kicker,headline:game.headline,description:game.explanation,gamePitch:game.whatIsGame,roleTask:game.actorTask,winRule:game.victoryRule,stakes:game.stakes,liveStatus:game.liveStatus,gameHorizon:game.horizon,gameResult:game.result,gameResultLabel:game.resultLabel,epistemic:game.epistemic,
 mission:safe(experience.mission),goal:safe(game.victoryRule),personal,dual,planId:plan?.id??null,
 planLabel:safe(plan?`${plan.label}${choiceExplanation(plan.command)?` · ${choiceExplanation(plan.command)}`:''}`:''),tradeoff:plan?(economy?PLAN_EXPLAIN[plan.id]:plan.subtitle):'',
 command:plan?structuredClone(plan.command):null,
 alternatives:decisions.plans.map(p=>({id:p.id,label:safe(`${p.label}${choiceExplanation(p.command)?` · ${choiceExplanation(p.command)}`:''}`),risk:PLAN_EXPLAIN[p.id]})),
 progress:experience.progress,stage:experience.stage,stageName:experience.stageName,
 metrics:metrics.map(x=>({id:x.id,label:x.label,value:x.value,target:x.target,display:x.display,help:x.help})),
 warning:warnings[0]?.text??null,
 cta:decisions.ended?'Ricomincia':economy?'Conferma e avanza':'Registra la decisione',
 primaryActions:decisions.canAct?1:0,source:'Scoped observer projection, synthetic decision consequences'};
 return Object.freeze(result);
}
export function focusCommand(view,role,planId='COOPERATIVO'){
 const decision=decisionModel(view,role).plans.find(x=>x.id===planId);
 if(!decision||!validatePlan(view,role,decision))throw Error('FOCUS_ILLEGAL_ACTION');
 return decision.command.kind==='INSTITUTIONAL'?decision.command.choice:
 {move:decision.command.move,other:decision.command.other,choice:decision.command.choice,strategy:decision.command.strategy};
}
export function focusReceipt(before,after,decision){
 const result=observableResult(before,after,decision);
 return {outcome:safe(result.outcome,48),changes:result.changes.slice(0,2).map(x=>({label:safe(x.label,28),delta:x.delta})),
 explanation:result.changes.length?'Questi sono gli effetti che puoi osservare.':'L’atto è registrato; gli indicatori visibili non sono cambiati.',
 caveat:'Gli altri possono decidere autonomamente. Nessuna previsione di fatti nascosti.'};
}
export function focusAudit(model){
 if(model.primaryActions>1||model.alternatives.length>3||model.metrics.length>2)throw Error('FOCUS_DENSITY');
 if(model.canAct&&!model.command)throw Error('FOCUS_EMPTY_CTA');
 if(model.headline.split(/\s+/).length>FOCUS_RULES.maxHeadlineWords)throw Error('FOCUS_HEADLINE');
 if(!model.personal||!model.dual||!model.kicker||!model.goal||!model.source||!model.gamePitch||!model.roleTask||!model.winRule||model.metrics.map(x=>x.id).join(',')!=='progress,defaults')throw Error('FOCUS_CONTEXT');
 return true;
}
