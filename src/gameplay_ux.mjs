/** CIE F8bis: observer-scoped, deterministic decision guidance.
 * Pure presentation of available legal actions. Never reads an authoritative world.
 * Never predicts confidential NPC behaviour or empirical political outcomes.
 */
export const UX_RULESET='CIE-F8BIS-1.0.0';
export const UX_PLANS=['PRUDENTE','COOPERATIVO','INCISIVO'];
const ROLE_NAMES=Object.freeze({COSTANTINO:'Costantino',FINANZIATORE:'Finanziatore',PARLAMENTARE:'Parlamentare',PRESIDENTE:'Presidente',GIUDICE:'Presidente della Corte'});
const PLAN_META=Object.freeze({
 PRUDENTE:{label:'Metti in sicurezza',tag:'Controllo',icon:'◈',subtitle:'Riduci l’esposizione e difendi la fiducia.',risk:'Ritmo più lento; maggiore cautela.'},
 COOPERATIVO:{label:'Cerca un accordo',tag:'Equilibrio',icon:'◇',subtitle:'Costruisci consenso senza forzare le controparti.',risk:'La controparte può non aderire.'},
 INCISIVO:{label:'Prendi l’iniziativa',tag:'Slancio',icon:'↗',subtitle:'Premi per un risultato più rapido.',risk:'Opposizione, credibilità e rischio possono peggiorare.'}
});
const INSTITUTIONAL_LABELS=Object.freeze({BALANCED:'Proponi un piano sostenibile',AMBITIOUS:'Proponi un piano ambizioso',FUND:'Finanzia il progetto',WITHHOLD:'Non impegnare capitale',APPROVE:'Approva la proposta',REJECT:'Respingi la proposta',PROMULGATE:'Promulga il provvedimento',RETURN:'Rinvia il provvedimento',PUBLIC_RESPONSE:'Intervieni pubblicamente',SEEK_REMEDY:'Attiva un rimedio',UPHOLD:'Conferma la validità',STRIKE:'Dichiara l’invalidità',REQUEST_DISCLOSURE:'Acquisisci prove',PUBLIC_RECORD_ONLY:'Usa il fascicolo pubblico',RECUSE_CONFLICT:'Escludi il giudice in conflitto',RETAIN_MEMBER:'Mantieni il componente',HEAR_RIGHTS:'Ascolta le ragioni sui diritti',HEAR_FEASIBILITY:'Valuta la fattibilità',RECOMMEND_UPHOLD:'Proponi di confermare',RECOMMEND_STRIKE:'Proponi di annullare',REQUEST_REHEARING:'Richiedi nuova deliberazione',ACCEPT_OUTCOME:'Accetta l’esito',WAIT:'Delega la decisione'});
const LEGAL_STRATEGIES=['INVESTIGATE','COOPERATE','ACCELERATE'];
const ROLE_MISSION=Object.freeze({COSTANTINO:'Trasforma una proposta in un patto durevole senza perdere legittimità.',FINANZIATORE:'Proteggi il capitale mentre valuti accordi e opportunità.',PARLAMENTARE:'Bilancia consenso, responsabilità e sostenibilità del programma.',PRESIDENTE:'Difendi la continuità delle istituzioni senza sostituirti agli altri poteri.',GIUDICE:'Mantieni indipendenza e garanzie; non negoziare sentenze.'});
const freezePlans=plans=>plans.map(x=>Object.freeze({...x,command:Object.freeze({...x.command})}));
const firstAllowed=(list, options, fallback)=>options.find(x=>list.includes(x))??(list.includes(fallback)?fallback:list[0]);
const validList=list=>Array.isArray(list)&&list.every(x=>typeof x==='string'&&x.length>0);
export function decisionModel(view,role){
 if(!view||typeof view!=='object'||!Object.hasOwn(ROLE_NAMES,role))throw Error('UX_VIEW_OR_ROLE');
 const phase=view.mode==='ECONOMIC'?'ECONOMIC':'INSTITUTIONAL';
 const ended=Boolean(view.ended);
 const available=phase==='ECONOMIC'?view.choices:view.available;
 if(!validList(available))throw Error('UX_BAD_ACTION_LIST');
 const canAct=!ended&&available.length>0;
 const primary={phase,role,roleName:ROLE_NAMES[role],mission:ROLE_MISSION[role],canAct,ended,
  title:ended?'Il tuo capitolo è concluso':phase==='ECONOMIC'?'Il futuro si decide adesso':'Un atto può cambiare il corso degli eventi',
  prompt:ended?'Esamina la cronaca o ricomincia da un nuovo seed.':phase==='ECONOMIC'?'Scegli un orientamento. Puoi approfondire o decidere subito.':'Scegli quale atto adottare. Gli altri ruoli agiranno autonomamente.',
  CTA:ended?'Episodio concluso':phase==='ECONOMIC'?'Conferma e avanza di un trimestre':'Registra questa decisione',
  context:phase==='ECONOMIC'?'Il mondo reagirà: non controlli tutte le conseguenze.':'Questo atto sarà conservato nel registro condiviso.'};
 if(!canAct)return {...primary,plans:[]};
 if(phase==='INSTITUTIONAL'){
  const actions=view.legal?.court?.phase==='REMEDY'&&view.legal.court.irregularity?available.filter(x=>x!=='ACCEPT_OUTCOME'):available;
  const acts=[actions[0],actions[1]??actions[0],'WAIT'];
  return {...primary,plans:freezePlans(UX_PLANS.map((id,i)=>({...PLAN_META[id],id,tag:i===2?'DELEGA':'ATTO',label:INSTITUTIONAL_LABELS[acts[i]]??acts[i].replaceAll('_',' '),command:{kind:'INSTITUTIONAL',choice:acts[i]},subtitle:i===2?'Procedi con la regola istituzionale, senza scegliere tu.':`Atto possibile dal tuo mandato · ${PLAN_META[id].tag.toLowerCase()}.`,risk:i===2?'La decisione verrà presa dalla procedura automatica.':PLAN_META[id].risk})))};
 }
 const strategic=view.strategic;
 if(!strategic||!validList(strategic.moves)||!validList(strategic.counterparties)||!strategic.counterparties.length)throw Error('UX_STRATEGIC_OBSERVATION');
 const peers=strategic.counterparties;
 const counterpart=peers.find(x=>x!=='GIUDICE')??peers[0];
 const moves=strategic.moves;
 const strategies=[
  {move:firstAllowed(moves,['PUBLIC_HEARING','DECLINE'],moves[0]),choice:available[0],strategy:'INVESTIGATE'},
  {move:firstAllowed(moves,['PROPOSE_PACT','PUBLIC_HEARING','DECLINE'],moves[0]),choice:available[0],strategy:'COOPERATE'},
  {move:firstAllowed(moves,['DEMAND_CONCESSION','PROPOSE_PACT','PUBLIC_HEARING'],moves[0]),choice:available[1]??available[0],strategy:'ACCELERATE'}
 ];
 return {...primary,plans:freezePlans(UX_PLANS.map((id,i)=>({...PLAN_META[id],id,command:{kind:'ECONOMIC',...strategies[i],other:counterpart}})))};
}
export function validatePlan(view,role,plan){
 const model=decisionModel(view,role);if(!plan||!model.plans.some(x=>x.id===plan.id))return false;
 const canonical=model.plans.find(x=>x.id===plan.id);
 return JSON.stringify(canonical.command)===JSON.stringify(plan.command);
}
export function deltaForKnownFacts(before,after){
 if(!before||!after||before.worldId!==after.worldId)throw Error('UX_DIFFERENT_WORLD');
 const fields=['progress','support','legitimacy','volatility','resilience','production'];
 const results=[];
 for(const key of fields){const b=before.economy?.[key]??before[key],a=after.economy?.[key]??after[key];if(Number.isFinite(a)&&Number.isFinite(b)&&a!==b)results.push({key,delta:a-b});}
 return results;
}
export function cognitiveContract(){return {visiblePlanCount:3,defaultSelected:true,requiredPreDecisionInteractions:0,primaryActionCount:1,detailsOptIn:true,hiddenNpcPredictions:0,source:'UX contract, not human task completion evidence'};}
export function roleMission(role){if(!ROLE_MISSION[role])throw Error('UX_UNKNOWN_ROLE');return ROLE_MISSION[role];}
export function primaryActionFor(view,role,id='COOPERATIVO'){const model=decisionModel(view,role);return model.plans.find(p=>p.id===id)??model.plans[0]??null;}
export function assertStrategyPermission(view,role){const m=decisionModel(view,role);if(role==='GIUDICE'&&m.phase==='ECONOMIC')for(const p of m.plans)if(['PROPOSE_PACT','DEMAND_CONCESSION'].includes(p.command.move))throw Error('UX_JUDICIAL_BARGAINING');return true;}
