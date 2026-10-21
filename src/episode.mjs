/** CIE F2: deterministic, closed-world, fictional single-player institutional episode.
 * No AI, system clock, I/O, network, or implicit randomness in the authoritative engine.
 * This is a game model, NOT a statement of actual constitutional procedure.
 */
export const RULESET = 'CIE-F2-1.0.0';
export const SCENARIO = 'EUROPA-ALTERNATIVA-PATTO-DIGITALE';
export const ACTORS = Object.freeze(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']);
export const PHASES = Object.freeze(['PROPOSAL','FINANCING','VOTE','EXECUTIVE','JUDICIAL','COMPLETE']);
export const CAPABILITIES = Object.freeze({
  COSTANTINO:['PROPOSE_BALANCED','PROPOSE_AMBITIOUS'],
  FINANZIATORE:['FUND','WITHHOLD'],
  PARLAMENTARE:['APPROVE','REJECT'],
  PRESIDENTE:['PROMULGATE','RETURN'],
  GIUDICE:['UPHOLD','STRIKE'],
});
export const ACTOR_PHASE = Object.freeze({COSTANTINO:'PROPOSAL',FINANZIATORE:'FINANCING',PARLAMENTARE:'VOTE',PRESIDENTE:'EXECUTIVE',GIUDICE:'JUDICIAL'});
const OFFICE = Object.freeze({COSTANTINO:null,FINANZIATORE:null,PARLAMENTARE:'OFFICE_MANDATE',PRESIDENTE:'OFFICE_HEAD_OF_STATE',GIUDICE:'OFFICE_JUDICIAL_PANEL_DELEGATE'});
export const IDENTITIES = Object.freeze(Object.fromEntries(ACTORS.map((actor,i)=>[actor,Object.freeze({actorId:actor,personId:'P'+(i+1),officeId:OFFICE[actor],organizationId:['CIVIC_INITIATIVE','CAPITAL_FUND','PARLIAMENT','PRESIDENCY','COURT'][i]})])));
const TOTAL_MONEY = 160; // 40 private + 0 initiative + 20 supplier + 100 treasury.
const AMOUNTS = Object.freeze({PROPOSE_BALANCED:12,PROPOSE_AMBITIOUS:16});
function clone(x){return structuredClone(x);}
export function digest(x){const s=JSON.stringify(x);let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return (h>>>0).toString(16).padStart(8,'0');}
export function randomWord(seed,tick,actor,topic='DECISION') {
  const s=`${RULESET}|${seed}|${tick}|${actor}|${topic}`;
  let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);
  h^=h>>>16;h=Math.imul(h,0x7feb352d);h^=h>>>15;h=Math.imul(h,0x846ca68b);h^=h>>>16;
  return h>>>0;
}
function makeEvent(world, actor, type, data={}, visibility='PUBLIC', references=[]) {
  return {internalId:'EV'+String(world.events.length+1).padStart(3,'0'),tick:world.tick,actor,type,data:clone(data),visibility,refs:[...references]};
}
function add(world,actor,type,data={},visibility='PUBLIC',refs=[]) {world.events.push(makeEvent(world,actor,type,data,visibility,refs));}
function spend(world,source,dest,amount,reason) {
  if(!Number.isSafeInteger(amount)||amount<=0||world.ledger[source]<amount) throw Error('INVALID_TRANSFER');
  world.ledger[source]-=amount;world.ledger[dest]+=amount;
  world.transfers.push({source,dest,amount,reason});
}
function finish(w,ending,reason){w.ending=ending;w.reason=reason;w.phase='COMPLETE';w.terminal=true;add(w,'SYSTEM','EPISODE_FINISHED',{ending,reason});}
function validState(w){
  if(w.events.length>16||w.tick>12)throw Error('TICK_BOUND');
  if(Object.values(w.ledger).some(x=>!Number.isSafeInteger(x)||x<0))throw Error('LEDGER_NEGATIVE');
  if(Object.values(w.ledger).reduce((a,b)=>a+b,0)!==TOTAL_MONEY)throw Error('LEDGER_NOT_CONSERVED');
  for(const t of w.transfers)if(!Number.isSafeInteger(t.amount)||t.amount<=0)throw Error('TRANSFER_INVALID');
  if(!PHASES.includes(w.phase))throw Error('UNKNOWN_PHASE');
  return true;
}
export function createWorld({scenarioId=SCENARIO,worldSeed=41,rulesetVersion=RULESET}={}){
  if(scenarioId!==SCENARIO||rulesetVersion!==RULESET||!Number.isSafeInteger(worldSeed)||worldSeed<0||worldSeed>0xffffffff)throw Error('UNSUPPORTED_WORLD');
  const w={worldId:`${scenarioId}:${rulesetVersion}:${worldSeed}`,seed:worldSeed,scenarioId,rulesetVersion,tick:0,phase:'PROPOSAL',proposal:null,act:'NONE',case:null,judgment:'NONE',implementation:'NONE',ledger:{FINANZIATORE:40,INIZIATIVA:0,IMPRESA:20,TESORO:100},transfers:[],events:[],terminal:false,ending:null,reason:null};
  validState(w);return w;
}
const PUBLIC_TYPES=new Set(['PROPOSED','APPROVED','REJECTED','PROMULGATED','RETURNED','CASE_FILED','JUDGMENT','IMPLEMENTATION','EPISODE_FINISHED']);
function visible(e,actor){return e.visibility==='PUBLIC'||(Array.isArray(e.visibility)&&e.visibility.includes(actor));}
function filteredEvents(w,actor){return w.events.filter(e=>visible(e,actor)).map((e,i)=>({displayId:'K'+String(i+1).padStart(3,'0'),type:e.type,tick:e.tick,actor:e.actor,data:clone(e.data),refs:[...e.refs]}));}
function actorLedger(w,actor){
  if(actor==='FINANZIATORE')return {ownCapital:w.ledger.FINANZIATORE};
  if(actor==='COSTANTINO')return {initiativeBalance:w.ledger.INIZIATIVA};
  if(actor==='PARLAMENTARE'||actor==='PRESIDENTE')return {publicTreasury:w.ledger.TESORO};
  return {};
}
function affordances(w,actor){if(w.terminal||w.phase!==ACTOR_PHASE[actor])return [];
  return CAPABILITIES[actor].map(type=>({type,actorId:actor,expectedTurn:w.tick}));}
export function observe(w,actor){
  if(!ACTORS.includes(actor))throw Error('UNKNOWN_ACTOR');
  const obs={worldId:w.worldId,rulesetVersion:w.rulesetVersion,actor:clone(IDENTITIES[actor]),phase:w.phase,turn:w.tick,proposal:clone(w.proposal),act:w.act,case:w.case?clone(w.case):null,judgment:w.judgment,implementation:w.implementation,ledger:actorLedger(w,actor),knownEvents:filteredEvents(w,actor),availableActions:affordances(w,actor),terminal:w.terminal,ending:w.terminal?w.ending:null,reason:w.terminal?w.reason:null};
  // detach all nested objects; never export global event count, internal event ids or transfers.
  return clone({...obs,objective: roleObjective(w,actor)});
}
function roleObjective(w,actor){
  const focus={COSTANTINO:'Initiative viability',FINANZIATORE:'Capital exposure',PARLAMENTARE:'Legislative agency',PRESIDENTE:'Executive procedural act',GIUDICE:'Review with admissible case'}[actor];
  return {focus,decisionPossible:!w.terminal&&w.phase===ACTOR_PHASE[actor],ending:w.terminal?w.ending:null,explanation:w.terminal?('Result '+w.ending+' follows from recorded institutional decisions and financing constraints.'):null};
}
export function listActions(w,actor){return observe(w,actor).availableActions;}
export function submitAction(world,command){
  if(!command||!ACTORS.includes(command.actorId)||!CAPABILITIES[command.actorId].includes(command.type))return {ok:false,code:'NO_COMPETENCE'};
  if(world.terminal)return {ok:false,code:'EPISODE_TERMINAL'};
  if(command.expectedTurn!==world.tick)return {ok:false,code:'STALE_TURN'};
  if(world.phase!==ACTOR_PHASE[command.actorId])return {ok:false,code:'PROCEDURE_BLOCKED'};
  if(Object.keys(command).some(k=>!['actorId','type','expectedTurn'].includes(k)))return {ok:false,code:'UNKNOWN_PARAMETER'};
  const w=clone(world);const role=command.actorId;
  switch(command.type){
    case 'PROPOSE_BALANCED':case 'PROPOSE_AMBITIOUS':
      w.proposal={policy:command.type,requiredFunding:AMOUNTS[command.type]};
      add(w,role,'PROPOSED',w.proposal,'PUBLIC',['INITIATIVE','PARLIAMENT']);w.phase='FINANCING';break;
    case 'FUND':
      spend(w,'FINANZIATORE','INIZIATIVA',12,'PLEDGE');
      add(w,role,'PRIVATE_FINANCING',{amount:12},['FINANZIATORE','COSTANTINO'],['FUND','INITIATIVE']);
      w.phase='VOTE';break;
    case 'WITHHOLD':
      add(w,role,'PRIVATE_DECLINE',{},['FINANZIATORE','COSTANTINO'],['FUND']);w.phase='VOTE';break;
    case 'APPROVE':w.act='APPROVED';add(w,role,'APPROVED',{},'PUBLIC',['PARLIAMENT']);w.phase='EXECUTIVE';break;
    case 'REJECT':w.act='REJECTED';add(w,role,'REJECTED',{},'PUBLIC',['PARLIAMENT']);finish(w,'REJECTED','LEGISLATIVE_REJECTION');break;
    case 'PROMULGATE':
      w.act='PROMULGATED';add(w,role,'PROMULGATED',{},'PUBLIC',['PRESIDENCY']);
      // Fixed fictional constitutional route: an eligible civic association files a case.
      w.case={id:'CASE-DIGITAL-001',claim:'PROPORTIONALITY_CHALLENGE',filedBy:'CIVIC_ASSOCIATION',admissible:true,receivedEvidence:['PUBLIC_TEXT']};
      add(w,'CIVIC_ASSOCIATION','CASE_FILED',{caseId:w.case.id,claim:w.case.claim},'PUBLIC',['COURT','PRESIDENCY']);
      w.phase='JUDICIAL';break;
    case 'RETURN':w.act='RETURNED';add(w,role,'RETURNED',{},'PUBLIC',['PRESIDENCY']);finish(w,'RETURNED','EXECUTIVE_RETURN');break;
    case 'UPHOLD':case 'STRIKE':
      if(!w.case?.admissible)return {ok:false,code:'NO_ADMISSIBLE_CASE'};
      w.judgment=command.type;add(w,role,'JUDGMENT',{decision:command.type,caseId:w.case.id},'PUBLIC',['COURT']);
      if(command.type==='STRIKE'){finish(w,'STRUCK','JUDICIAL_REMEDY');break;}
      if(w.ledger.INIZIATIVA>=w.proposal.requiredFunding){spend(w,'INIZIATIVA','IMPRESA',w.proposal.requiredFunding,'INFRASTRUCTURE_CONTRACT');w.implementation='CONTRACTED';}
      else w.implementation='UNFUNDED';
      add(w,'IMPLEMENTER','IMPLEMENTATION',{status:w.implementation},'PUBLIC',['INITIATIVE','IMPRESA']);
      finish(w,w.implementation,w.implementation==='CONTRACTED'?'FUNDED_EXECUTION':'FUNDING_SHORTFALL');break;
  }
  w.tick++;validState(w);
  return {ok:true,world:w,eventTypes:w.events.slice(world.events.length).map(e=>e.type)};
}
export function npcChoice(observation,seed){
  const a=observation.actor.actorId,options=observation.availableActions;
  if(!options.length)throw Error('NPC_NOT_ACTIVE');
  const h=randomWord(seed,observation.turn,a,'POLICY');
  const preference={COSTANTINO:h%2?'PROPOSE_BALANCED':'PROPOSE_AMBITIOUS',FINANZIATORE:h%3===0?'WITHHOLD':'FUND',PARLAMENTARE:'APPROVE',PRESIDENTE:'PROMULGATE',GIUDICE:h%4===0?'STRIKE':'UPHOLD'}[a];
  const cmd=options.find(x=>x.type===preference);if(!cmd)throw Error('NPC_POLICY_UNAUTHORIZED');return cmd;
}
function resolveUntilHuman(w,humanId){const decisions=[];let hops=0;
  while(!w.terminal&&ACTOR_PHASE[humanId]!==w.phase){
    if(hops++>=12)throw Error('NPC_DEADLOCK');
    const npc=ACTORS.find(a=>ACTOR_PHASE[a]===w.phase);
    if(!npc)throw Error('NO_SCHEDULED_ACTOR');
    const obs=observe(w,npc);const cmd=npcChoice(obs,w.seed);const applied=submitAction(w,cmd);
    if(!applied.ok)throw Error('NPC_REJECTED_'+applied.code);
    decisions.push({actorId:npc,type:cmd.type,turn:cmd.expectedTurn});w=applied.world;
  }
  return {world:w,npcDecisions:decisions};
}
export function startEpisode({seed=41,humanId='COSTANTINO'}={}){
  if(!ACTORS.includes(humanId))throw Error('UNKNOWN_HUMAN');
  const first=resolveUntilHuman(createWorld({worldSeed:seed}),humanId);
  return {world:first.world,humanId,humanCommands:[],npcDecisions:first.npcDecisions};
}
export function play(session,actionType){
  if(session.world.terminal)return {ok:false,code:'EPISODE_TERMINAL'};
  const legal=listActions(session.world,session.humanId);
  const delegation=actionType==='WAIT';
  // An explicit wait delegates the scheduled choice to the institution's deterministic default policy.
  // It advances the same canonical clock; it never creates a second world or a privileged action.
  const possible=delegation&&legal.length?npcChoice(observe(session.world,session.humanId),session.world.seed):legal.find(x=>x.type===actionType);
  if(!possible)return {ok:false,code:'NOT_AVAILABLE'};
  const applied=submitAction(session.world,possible);if(!applied.ok)return applied;
  const next=resolveUntilHuman(applied.world,session.humanId);
  const result={world:next.world,humanId:session.humanId,humanCommands:[...session.humanCommands,actionType],npcDecisions:[...session.npcDecisions,...next.npcDecisions]};
  return {ok:true,session:result};
}
export function saveEpisode(session){
  const archive={schema:'CIE-F2-REPLAY-1',seed:session.world.seed,humanId:session.humanId,commands:[...session.humanCommands],resultDigest:digest(session.world)};
  return clone(archive);
}
export function restoreEpisode(archive){
  if(!archive||archive.schema!=='CIE-F2-REPLAY-1'||!Array.isArray(archive.commands)||archive.commands.length>12||!ACTORS.includes(archive.humanId)||!Number.isSafeInteger(archive.seed)||typeof archive.resultDigest!=='string')throw Error('REPLAY_FORMAT');
  let session=startEpisode({seed:archive.seed,humanId:archive.humanId});
  for(const type of archive.commands){const result=play(session,type);if(!result.ok)throw Error('REPLAY_ACTION_'+result.code);session=result.session;}
  if(digest(session.world)!==archive.resultDigest)throw Error('REPLAY_MISMATCH');
  return session;
}
export function auditEpisode(world){
  validState(world);
  const before={FINANZIATORE:40,INIZIATIVA:0,IMPRESA:20,TESORO:100};
  for(const t of world.transfers){if(!Object.hasOwn(before,t.source)||!Object.hasOwn(before,t.dest)||before[t.source]<t.amount)throw Error('BAD_LEDGER_HISTORY');before[t.source]-=t.amount;before[t.dest]+=t.amount;}
  if(JSON.stringify(before)!==JSON.stringify(world.ledger))throw Error('LEDGER_RECONCILIATION');
  const roles=new Set(ACTORS);const events=world.events.filter(e=>roles.has(e.actor));
  for(const e of events){if(!e.type||!e.actor)throw Error('BAD_EVENT');}
  return {valid:true,terminal:world.terminal,ending:world.ending,digest:digest(world),tick:world.tick,transfers:world.transfers.length};
}
