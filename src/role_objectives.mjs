/** CIE-RG1: two independent, observable goal tracks in one F7 world.
 * Fictional design targets, NOT empirical assessments of political actors.
 * Evidence: the human's replay commands and f7Observe() only; no hidden state.
 */
export const ROLE_GOALS_RULESET='CIE-ROLE-GOALS-1.0.0';
export const ROLE_GOALS=Object.freeze({
 COSTANTINO:{title:'Costruisci una coalizione credibile',action:'BUILD_COALITION',actionLabel:'Costruisci coalizione',metric:'support',metricName:'Sostegno',threshold:8,description:'Scegli due volte di costruire una coalizione e termina con almeno 8 punti di sostegno.',tension:'Mobilitare rapidamente la rete può aumentare il sostegno ma anche la pressione.'},
 FINANZIATORE:{title:'Proteggi la liquidità',action:'KEEP_LIQUIDITY',actionLabel:'Conserva liquidità',metric:'defaults',metricName:'Insolvenze',threshold:0,description:'Conserva la liquidità in due trimestri e termina senza insolvenze.',tension:'Offrire credito può aiutare il progetto, ma riduce il margine per proteggere i fondi.'},
 PARLAMENTARE:{title:'Controlla il bilancio pubblico',action:'EXAMINE_BUDGET',actionLabel:'Esamina bilancio',metric:'defaults',metricName:'Insolvenze',threshold:0,description:'Esamina due volte il bilancio e termina senza insolvenze.',tension:'Autorizzare contributi può sostenere il progetto, ma compete con le verifiche.'},
 PRESIDENTE:{title:'Rafforza la fiducia civica',action:'HOST_CIVIC_DIALOGUE',actionLabel:'Apri dialogo pubblico',metric:'legitimacy',metricName:'Legittimità',threshold:8,description:'Promuovi due dialoghi pubblici e termina con almeno 8 punti di legittimità.',tension:'Dedicare tempo al confronto pubblico compete con verifiche e rapidità.'},
 GIUDICE:{title:'Difendi le garanzie',action:'REVIEW_SAFEGUARDS',actionLabel:'Verifica garanzie',metric:'resilience',metricName:'Resilienza',threshold:8,description:'Verifica due volte le garanzie e termina con almeno 8 punti di resilienza.',tension:'Le verifiche rafforzano la sicurezza, ma non garantiscono l’avanzamento economico.'}
});
const minActions=2;
const integers=x=>Number.isSafeInteger(x)&&x>=0&&x<=100;
const passed=(goal,value)=>goal.metric==='defaults'?value===0:value>=goal.threshold;
export function roleObjective(view,role,playerCommands=[]){
 if(!Object.hasOwn(ROLE_GOALS,role)||!view||typeof view!=='object'||!Array.isArray(playerCommands)||playerCommands.length>80)throw Error('ROLE_GOAL_INPUT');
 if(view.role&&view.role!==role)throw Error('ROLE_GOAL_SCOPE');
 for(const c of playerCommands){
  if(!c||!['ECONOMIC','INSTITUTIONAL'].includes(c.kind)||typeof c.choice!=='string'||c.choice.length>60)throw Error('ROLE_GOAL_COMMAND_SHAPE');
 }
 const g=ROLE_GOALS[role],total=playerCommands.filter(c=>c.kind==='ECONOMIC').length;
 const actions=playerCommands.filter(c=>c.kind==='ECONOMIC'&&c.choice===g.action).length;
 const ended=Boolean(view.mode==='ECONOMIC'&&view.ended);
 const metricValue=view.mode==='ECONOMIC'?view[g.metric]:null;
 if(metricValue!==null&&!integers(metricValue))throw Error('ROLE_GOAL_UNSAFE_METRIC');
 const eligible=actions>=minActions&&metricValue!==null&&passed(g,metricValue);
 const status=ended?(eligible?'COMPLETED':'MISSED'):eligible?'CURRENTLY_MET':'IN_PROGRESS';
 const remaining=Math.max(0,minActions-actions),turnsLeft=view.mode==='ECONOMIC'?(ended?0:Math.max(0,9-view.quarter)):8;
 const possible=!ended&&remaining<=turnsLeft&&(g.metric!=='defaults'||metricValue===null||metricValue===0);
 return Object.freeze({schema:ROLE_GOALS_RULESET,role,title:g.title,description:g.description,tension:g.tension,
 action:g.action,actionLabel:g.actionLabel,actions,requiredActions:minActions,actionsDisplay:`${Math.min(actions,minActions)} / ${minActions}`,
 metric:g.metric,metricLabel:g.metricName,metricValue,threshold:g.threshold,
 metricCondition:g.metric==='defaults'?'0 insolvenze':`${g.metricName} almeno ${g.threshold}`,
 phase:view.mode,ended,status,qualified:eligible,possible:ended?false:possible,turnsLeft,
 guidance:ended?(eligible?'Obiettivo personale raggiunto.':'Obiettivo personale non raggiunto.'):
 !possible?'Obiettivo personale non più raggiungibile nei trimestri rimasti.':
 remaining>0?`${view.mode==='INSTITUTIONAL'?'Dopo il preludio, ':'Per avanzare, '}scegli «${g.actionLabel}» (${remaining} volte ancora).`:
 metricValue===null?'Completa il preludio e osserva gli indicatori.':
 passed(g,metricValue)?'Condizione personale provvisoriamente rispettata. Proteggila fino alla fine.':
 `Per riuscire, porta ${g.metricName.toLowerCase()} ${g.metric==='defaults'?'a zero':`ad almeno ${g.threshold}`}.`,
 note:'Riuscita personale e collettiva sono due condizioni separate in un mondo fittizio.'});
}
export function dualOutcome(game,personal){
 if(!game||!personal||typeof game.ended!=='boolean'||game.ended!==personal.ended)throw Error('DUAL_OUTCOME_PHASE');
 const collective=game.ended?(game.result==='DURABLE_PROGRESS'?'COMPLETED':'MISSED'):'IN_PROGRESS';
 return Object.freeze({collective,personal:personal.ended?personal.status:'IN_PROGRESS',
 resultCode:game.ended?`${collective}/${personal.status}`:'PENDING',
 combinedLabel:game.ended?`${collective==='COMPLETED'?'Patto riuscito':'Patto non pienamente riuscito'} · ${personal.qualified?'missione personale compiuta':'missione personale incompiuta'}`:'Due obiettivi, un solo mondo'});
}
export function roleObjectiveAudit(m){
 if(!m||m.schema!==ROLE_GOALS_RULESET||!Object.hasOwn(ROLE_GOALS,m.role)||m.requiredActions!==2||m.actions<0||!m.title||!m.description||!m.tension||!m.guidance)throw Error('ROLE_GOAL_AUDIT');
 if(m.ended&&!['COMPLETED','MISSED'].includes(m.status))throw Error('ROLE_GOAL_FINAL');
 return true;
}
export const ROLE_CHOICE_NAMES=Object.freeze({BUILD_COALITION:'Costruisci coalizione',MOBILIZE_NETWORK:'Mobilita la rete',OFFER_CREDIT:'Offri credito',KEEP_LIQUIDITY:'Conserva liquidità',AUTHORIZE_GRANT:'Autorizza contributo',EXAMINE_BUDGET:'Esamina bilancio',HOST_CIVIC_DIALOGUE:'Promuovi dialogo',REQUEST_PUBLIC_REPORT:'Richiedi relazione',PUBLISH_REASONS:'Pubblica motivazioni',REVIEW_SAFEGUARDS:'Verifica garanzie',DELEGATE:'Delega'});
export function choiceExplanation(command){
 if(!command||typeof command!=='object')return '';
 const c=command.kind==='ECONOMIC'?command.choice:null;
 return ROLE_CHOICE_NAMES[c]??'';
}
