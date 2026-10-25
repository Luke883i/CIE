/** CIE V3 The Fracture: executable isolated design vertical slice.
 * Every rule and country is fictional; strategic conflict only (no tactical targeting model).
 * One canonical world, deterministic phased resolver, role-bound powers, event provenance.
 */
export const RULESET='CIE-V3-FRACTURE-0.1';
export const ROLES=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
export const SCENARIOS={
 SOFT:{name:'La pace perfetta',genre:'Distopia morbida',opening:'Una rete decisionale pan-europea rende i servizi più efficienti. Il suo proprietario comincia a governare senza essere eletto.',seedState:{war:12,trust:58,rights:47,leverage:49,front:51,support:52},ambitions:{EFFICIENCY:'Stato efficiente',HEGEMONY:'Controllo dell’infrastruttura',PLURALISM:'Poteri distribuiti'}},
 OPEN:{name:'Il cielo è conteso',genre:'Guerra aperta',opening:'Un’armata rivale occupa un valico. I porti sono sotto pressione e l’alleanza discute su chi debba combattere.',seedState:{war:73,trust:45,rights:48,leverage:43,front:42,support:51},ambitions:{VICTORY:'Vittoria strategica',ARMISTICE:'Armistizio negoziato',SURVIVAL:'Tenere la linea'}},
 FRIENDS:{name:'Fratelli nemici',genre:'Guerra tra alleati',opening:'Due alleati hanno diviso energia, crediti e porti. Dopo il primo ultimatum, nessuno vuole essere il primo a cedere.',seedState:{war:33,trust:52,rights:55,leverage:48,front:52,support:54},ambitions:{REUNION:'Salvare l’alleanza',DOMINANCE:'Diventare egemone',SEPARATION:'Rompere e reggere'}}
};
export const SECTORS={
 AIR:{name:'Cielo',channel:'security',cost:3},LAND:{name:'Terra',channel:'security',cost:3},MARITIME:{name:'Mare e porti',channel:'transport',cost:3},INFOSPHERE:{name:'Infosfera',channel:'information',cost:2},ENERGY:{name:'Energia',channel:'energy',cost:3},FOOD:{name:'Alimenti e acqua',channel:'food',cost:2},TRADE:{name:'Commercio',channel:'trade',cost:2},FINANCE:{name:'Finanza',channel:'finance',cost:3},INFRASTRUCTURE:{name:'Infrastrutture',channel:'transport',cost:3},HEALTH:{name:'Salute',channel:'health',cost:2},CLIMATE:{name:'Clima',channel:'food',cost:2},DIPLOMACY:{name:'Diplomazia',channel:'trust',cost:1}
};
export const COMPETENCES={
 COSTANTINO:{domains:Object.keys(SECTORS),verbs:['COORDINATE','PROPOSE','MOBILIZE','CENTRALIZE','BREAK_PACT','RECONCILE'],attention:4},
 FINANZIATORE:{domains:['ENERGY','TRADE','FINANCE','INFRASTRUCTURE','MARITIME','HEALTH','INFOSPHERE'],verbs:['INVEST','WITHHOLD','LEVERAGE'],attention:3},
 PARLAMENTARE:{domains:['ENERGY','TRADE','FINANCE','INFRASTRUCTURE','MARITIME','HEALTH','INFOSPHERE','DIPLOMACY'],verbs:['ALLOCATE','INQUIRE','CENSURE','AUTHORIZE'],attention:3},
 PRESIDENTE:{domains:['DIPLOMACY','FINANCE','HEALTH','INFOSPHERE','AIR','MARITIME'],verbs:['CONVENE','REFER','RETURN'],attention:2},
 GIUDICE:{domains:['FINANCE','HEALTH','INFOSPHERE','AIR','MARITIME','DIPLOMACY'],verbs:['REVIEW','STAY','UPHOLD'],attention:2}
};
export const VERBS={TRUCE_OFFER:'Offri un armistizio',COORDINATE:'Coordina',PROPOSE:'Proponi',MOBILIZE:'Mobilita',CENTRALIZE:'Accentra',BREAK_PACT:'Rompi il patto',RECONCILE:'Ricuci il patto',INVEST:'Investi',WITHHOLD:'Non investire',LEVERAGE:'Acquisisci leva',ALLOCATE:'Proponi stanziamento',INQUIRE:'Apri inchiesta',CENSURE:'Promuovi sfiducia',AUTHORIZE:'Autorizza proposta',CONVENE:'Convoca',REFER:'Rinvia per controllo',RETURN:'Rinvia l’atto',REVIEW:'Esamina fascicolo',STAY:'Sospendi cautelarmente',UPHOLD:'Conferma legittimità'};
export const GROUPS={
 PORT_WORKERS:{name:'Lavoratori portuali',weights:{transport:3,trade:2,security:1}},
 SMALL_FIRMS:{name:'Piccole imprese',weights:{energy:3,finance:3,transport:2}},
 HOSPITALS:{name:'Rete sanitaria',weights:{health:3,energy:2,transport:2}},
 BORDER_FAMILIES:{name:'Famiglie di confine',weights:{security:3,food:1,trust:1}},
 DIGITAL_WORKERS:{name:'Lavoratori digitali',weights:{information:3,energy:2,finance:1}},
 RURAL:{name:'Comunità rurali',weights:{food:3,transport:2,energy:1}},
 PUBLIC_SERVICES:{name:'Servizi pubblici',weights:{health:2,information:2,trust:2}},
 INVESTORS:{name:'Investitori',weights:{finance:3,trade:2,trust:1}}
};
const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Math.round(v)));
const copy=x=>structuredClone(x);
const hash=(v)=>{let h=2166136261;for(const c of JSON.stringify(v)){h=Math.imul(h^c.charCodeAt(0),16777619);}return (h>>>0).toString(16).padStart(8,'0')}; // only integrity check, not crypto
const jitter=(...args)=>(parseInt(hash(args).slice(0,5),16)%5)-2;
const moneyTotal=w=>Object.values(w.money).reduce((a,b)=>a+b,0);
const transfer=(w,a,b,n)=>{if(n<0||w.money[a]<n) return false;w.money[a]-=n;w.money[b]+=n;return true};
function initialCases(scenario){return scenario==='SOFT'?[{id:1,domain:'INFOSPHERE',kind:'AUTOMATED_DENIAL',state:'OPEN',reviewed:false}]:scenario==='OPEN'?[{id:1,domain:'MARITIME',kind:'EMERGENCY_DECREE',state:'OPEN',reviewed:false}]:[{id:1,domain:'FINANCE',kind:'ALLIANCE_DISPUTE',state:'OPEN',reviewed:false}]}
export function newGame({seed=41,role='COSTANTINO',scenario='FRIENDS',ambition=null}={}){
 if(!Number.isSafeInteger(seed)||seed<0||seed>1_000_000||!ROLES.includes(role)||!SCENARIOS[scenario])throw Error('BAD_START');
 ambition??=Object.keys(SCENARIOS[scenario].ambitions)[0];if(!SCENARIOS[scenario].ambitions[ambition])throw Error('BAD_AMBITION');
 const base=SCENARIOS[scenario].seedState;
 return {ruleset:RULESET,seed,role,scenario,ambition,turn:1,horizon:6,revision:0,money:{TREASURY:60,FUND:40,FIRMS:50,HOUSEHOLDS:50},
  theaters:{SKY:48,LAND:48,SEA:48,CYBER:48},policy:Object.fromEntries(Object.keys(SECTORS).map(s=>[s,1])),channels:Object.fromEntries([...new Set(Object.values(SECTORS).map(s=>s.channel))].map(c=>[c,50])),
  groups:Object.fromEntries(Object.keys(GROUPS).map(k=>[k,50])),indicators:copy(base),cases:initialCases(scenario),pending:[],memories:[],events:[],history:[]};
}
function verbsFor(w,domain){
 if(!SECTORS[domain]||!COMPETENCES[w.role].domains.includes(domain))return [];
 const hasCase=w.cases.some(c=>c.domain===domain&&c.state==='OPEN');
 const hasPending=w.pending.some(p=>p.domain===domain);
 switch(w.role){
  case 'COSTANTINO':return ["COORDINATE",...(domain==='FINANCE'||domain==='TRADE'?['PROPOSE']:[]),...(w.scenario==='OPEN'&&['AIR','LAND','MARITIME'].includes(domain)?['MOBILIZE']:[]),...(w.scenario==='SOFT'&&domain==='INFOSPHERE'?['CENTRALIZE']:[]),...(w.scenario==='FRIENDS'&&domain==='DIPLOMACY'?['BREAK_PACT','RECONCILE']:[]),...(w.scenario==='OPEN'&&domain==='DIPLOMACY'?['TRUCE_OFFER']:[])];
  case 'FINANZIATORE':return ['INVEST','WITHHOLD',...(domain==='FINANCE'||domain==='INFOSPHERE'?['LEVERAGE']:[])];
  case 'PARLAMENTARE':return ['ALLOCATE','INQUIRE',...(hasPending?['AUTHORIZE']:[]),...(domain==='FINANCE'||domain==='DIPLOMACY'?['CENSURE']:[])];
  case 'PRESIDENTE':return ['CONVENE','REFER',...(hasPending?['RETURN']:[])];
  case 'GIUDICE':return hasCase?['REVIEW','STAY','UPHOLD']:['REVIEW'];
 }
 return [];
}
export function allowed(w){if(w.turn>w.horizon)return {};return Object.fromEntries(COMPETENCES[w.role].domains.map(d=>[d,verbsFor(w,d)]));}
export function observe(w){const latest=w.history.at(-1);return copy({role:w.role,scenario:w.scenario,ambition:w.ambition,turn:w.turn,horizon:w.horizon,
 scenarioName:SCENARIOS[w.scenario].name,opening:SCENARIOS[w.scenario].opening,ambitionName:SCENARIOS[w.scenario].ambitions[w.ambition],
 money:w.money,theaters:w.theaters,channels:w.channels,groups:w.groups,indicators:w.indicators,cases:w.cases,pending:w.pending,allowed:allowed(w),attention:COMPETENCES[w.role].attention,latest,ended:w.turn>w.horizon,verdict:w.turn>w.horizon?score(w):null});}
export function validate(w,orders){
 if(!w||w.ruleset!==RULESET||w.turn>w.horizon)return {ok:false,reason:'GAME_NOT_ACTIVE'};
 if(!Array.isArray(orders)||orders.length>COMPETENCES[w.role].attention)return {ok:false,reason:'ATTENTION_LIMIT'};
 const domains=new Set();for(const o of orders){
  if(!o||typeof o!=='object'||Object.keys(o).sort().join(',')!=='domain,verb'||!SECTORS[o.domain]||domains.has(o.domain)||!verbsFor(w,o.domain).includes(o.verb))return {ok:false,reason:'ILLEGAL_OR_DUPLICATE_ORDER'};
  domains.add(o.domain);
 }
 return {ok:true};
}
function addEvent(w,turn,kind,detail,refs=[]){const id=`EV-${String(w.events.length+1).padStart(4,'0')}`;w.events.push({id,turn,kind,detail,refs});return id}
function apply(w,order){const {domain:d,verb:v}=order,cost=SECTORS[d].cost;const ev=[];let issue=null;
 const emit=(kind,detail)=>ev.push(addEvent(w,w.turn,kind,detail,[d]));
 if(v==='COORDINATE'){
  if(!transfer(w,'TREASURY','FIRMS',cost))return {ok:false,reason:'NO_TREASURY'};
  w.policy[d]=clamp(w.policy[d]+1,0,4);emit('COORDINATION',`${d} +1 · costo ${cost}`);
 }else if(v==='PROPOSE'||v==='ALLOCATE'){
  w.pending.push({id:w.pending.length+w.events.length+1,domain:d,kind:v,created:w.turn,origin:w.role});emit('PROPOSAL',`${d} · proposta non ancora autorizzata`);
 }else if(v==='MOBILIZE'){
  if(!transfer(w,'TREASURY','FIRMS',5))return {ok:false,reason:'NO_TREASURY'};
  w.indicators.front=clamp(w.indicators.front+7);w.indicators.war=clamp(w.indicators.war+3);w.indicators.support=clamp(w.indicators.support-2);emit('MOBILIZATION',`${d} · preparazione strategica, pressione elevata`);
 }else if(v==='CENTRALIZE'){
  w.policy[d]=clamp(w.policy[d]+1,0,4);w.indicators.leverage=clamp(w.indicators.leverage+7);w.indicators.rights=clamp(w.indicators.rights-5);emit('CENTRALIZATION','Efficienza e controllo aumentano; potere contestabile');
 }else if(v==='BREAK_PACT'){
  w.indicators.trust=clamp(w.indicators.trust-13);w.indicators.leverage=clamp(w.indicators.leverage+8);w.indicators.war=clamp(w.indicators.war+5);emit('PACT_BROKEN','Alleanza sospesa unilateralmente');
 }else if(v==='TRUCE_OFFER'){
  const accepted=jitter('TRUCE',w.seed,w.turn)+w.indicators.trust>=45;
  if(accepted){w.indicators.war=clamp(w.indicators.war-10);w.indicators.trust=clamp(w.indicators.trust+3);}else{w.indicators.war=clamp(w.indicators.war+1);w.indicators.trust=clamp(w.indicators.trust-2);}
  emit(accepted?'TRUCE_ACCEPTED':'TRUCE_REFUSED',accepted?'La controparte accetta una pausa verificabile':'La controparte respinge l’offerta, nessun cessate il fuoco imposto');
 }else if(v==='RECONCILE'){
  const offerAccepted=w.indicators.trust>=42&&jitter('PARTNER_OFFER',w.seed,w.turn)>=-1;
  w.indicators.trust=clamp(w.indicators.trust+(offerAccepted?7:-3));w.indicators.leverage=clamp(w.indicators.leverage-(offerAccepted?5:1));w.indicators.support=clamp(w.indicators.support-1);
  emit(offerAccepted?'PACT_REPAIRED':'PACT_OFFER_REJECTED',offerAccepted?'L’alleato concede un’intesa condizionata':'L’alleato rifiuta la riconciliazione');
 }else if(v==='INVEST'){
  if(!transfer(w,'FUND','FIRMS',cost+1))return {ok:false,reason:'FUND_EXHAUSTED'};
  w.policy[d]=clamp(w.policy[d]+1,0,4);w.indicators.leverage=clamp(w.indicators.leverage+2);emit('INVESTMENT',`${d} · capitale investito`);
 }else if(v==='WITHHOLD'){
  w.indicators.support=clamp(w.indicators.support-1);emit('CAPITAL_WITHHELD',`${d} · rischio finanziario evitato, progetto non sostenuto`);
 }else if(v==='LEVERAGE'){
  if(!transfer(w,'FUND','FIRMS',2))return {ok:false,reason:'FUND_EXHAUSTED'};
  w.indicators.leverage=clamp(w.indicators.leverage+6);w.indicators.trust=clamp(w.indicators.trust-3);emit('LEVERAGE',`${d} · influenza contrattuale crescente`);
 }else if(v==='AUTHORIZE'){
  const p=w.pending.find(x=>x.domain===d);if(!p)return {ok:false,reason:'NO_PENDING_AUTHORIZATION'};
  w.pending=w.pending.filter(x=>x.id!==p.id);w.policy[d]=clamp(w.policy[d]+1,0,4);emit('AUTHORIZATION',`${d} · autorizzata proposta ${p.id}`);
 }else if(v==='INQUIRE'||v==='REFER'){
  if(!w.cases.some(x=>x.domain===d&&x.state==='OPEN'))w.cases.push({id:w.events.length+1,domain:d,kind:v,state:'OPEN',reviewed:false});
  w.indicators.rights=clamp(w.indicators.rights+2);emit('OVERSIGHT',`${d} · fascicolo aperto, nessun esito predeterminato`);
 }else if(v==='CENSURE'){
  w.indicators.support=clamp(w.indicators.support-4);w.indicators.rights=clamp(w.indicators.rights+3);emit('CENSURE',`${d} · maggioranza contestata`);
 }else if(v==='CONVENE'){
  w.indicators.trust=clamp(w.indicators.trust+3);w.indicators.support=clamp(w.indicators.support+2);emit('CONVOCATION',`${d} · tavolo convocato, nessuna firma forzata`);
 }else if(v==='RETURN'){
  const p=w.pending.find(x=>x.domain===d);if(!p)return {ok:false,reason:'NO_PENDING_ACT'};
  w.pending=w.pending.filter(x=>x.id!==p.id);w.indicators.rights=clamp(w.indicators.rights+2);emit('RETURN',`${d} · proposta rinviata per nuova deliberazione`);
 }else if(['REVIEW','STAY','UPHOLD'].includes(v)){
  const c=w.cases.find(x=>x.domain===d&&x.state==='OPEN');if(!c){if(v!=='REVIEW')return {ok:false,reason:'NO_ADMISSIBLE_CASE'};emit('CASE_SCREEN',`${d} · nessun fascicolo pendente`);return {ok:true,ids:ev};}
  if(v==='REVIEW') {if(c.reviewed)emit('REDUNDANT_REVIEW',`${d} · nessun fatto nuovo da valutare`);else{c.reviewed=true;w.indicators.rights=clamp(w.indicators.rights+2);emit('EVIDENCE_REVIEW',`${d} · prova esaminata, giudizio non ancora deciso`);}}
  if(v==='STAY') {c.state='SUSPENDED';w.indicators.rights=clamp(w.indicators.rights+4);w.indicators.support=clamp(w.indicators.support-2);emit('INTERIM_STAY',`${d} · effetti temporaneamente sospesi`);}
  if(v==='UPHOLD') {c.state='UPHELD';w.indicators.rights=clamp(w.indicators.rights+1);emit('JUDGMENT',`${d} · atto confermato secondo regola procedurale sintetica`);}
 }else return {ok:false,reason:'UNKNOWN_VERB'};
 return {ok:true,ids:ev};
}
function updateWorld(w,orderIds){
 // Council is independent of the player. Pending acts resolve no earlier than the following turn.
 const stillPending=[];for(const p of w.pending){
  if(p.created>=w.turn){stillPending.push(p);continue;}
  const approved=jitter('COUNCIL',w.seed,w.turn,p.domain)>=0&&w.indicators.support>=38;
  if(approved){w.policy[p.domain]=clamp(w.policy[p.domain]+1,0,4);addEvent(w,w.turn,'AUTONOMOUS_COUNCIL_APPROVAL',p.domain+' · proposta '+p.id+' approvata da NPC',[p.domain]);}
  else addEvent(w,w.turn,'AUTONOMOUS_COUNCIL_REFUSAL',p.domain+' · proposta '+p.id+' respinta da NPC',[p.domain]);
 }w.pending=stillPending;
 const prev=copy(w.channels), previousGroups=copy(w.groups),before=copy(w.indicators);
 const deltas=Object.fromEntries(Object.keys(w.channels).map(x=>[x,0]));
 for(const [domain,level] of Object.entries(w.policy)){
  const ch=SECTORS[domain].channel;
  deltas[ch]+=level-1+jitter(w.seed,w.turn,domain)/2;
 }
 if(w.scenario==='OPEN'&&w.indicators.war>70){deltas.transport-=2;deltas.health-=1;deltas.security-=2;}
 // Non-recursive bounded two-hop propagation through essential services and finance.
 const stage=copy(deltas);
 deltas.health+=Math.trunc(stage.energy/2);deltas.trade+=Math.trunc(stage.transport/2);
 deltas.finance+=Math.trunc(stage.trade/3);deltas.trust+=Math.trunc(stage.health/3);
 for(const k of Object.keys(deltas))w.channels[k]=clamp(w.channels[k]+deltas[k]);
 const groupChanges={};for(const [g,ref] of Object.entries(GROUPS)){
  const raw=Object.entries(ref.weights).reduce((a,[ch,s])=>a+deltas[ch]*s,0);
  const delta=Math.trunc(raw/3);w.groups[g]=clamp(w.groups[g]+delta);groupChanges[g]=w.groups[g]-previousGroups[g];
 }
 // Autonomous rival has an agenda. Actions are seeded, no runtime randomness or hidden UI forecast.
 const rival=jitter('RIVAL',w.seed,w.turn,w.scenario);
 if(w.scenario==='OPEN'){
  const theatreDomain={SKY:'AIR',LAND:'LAND',SEA:'MARITIME',CYBER:'INFOSPHERE'};
  for(const [theatre,domain] of Object.entries(theatreDomain))w.theaters[theatre]=clamp(w.theaters[theatre]+w.policy[domain]-2+jitter(w.seed,w.turn,'THEATRE',theatre));
  const preparedness=w.policy.AIR+w.policy.LAND+w.policy.MARITIME;
  w.indicators.front=clamp(w.indicators.front+preparedness-4+rival+Math.trunc((Object.values(w.theaters).reduce((a,b)=>a+b,0)/4-48)/7));
  w.indicators.war=clamp(w.indicators.war+(preparedness>=5?-2:4)+rival);
  w.indicators.support=clamp(w.indicators.support+(w.indicators.war>75?-3:0));
 }else if(w.scenario==='FRIENDS'){
  w.indicators.trust=clamp(w.indicators.trust+rival-1);
  w.indicators.war=clamp(w.indicators.war+(w.indicators.trust<37?5:0)+rival);
  w.indicators.front=clamp(w.indicators.front+(w.indicators.war>55?-2:0));
 }else{
  w.indicators.leverage=clamp(w.indicators.leverage+(w.policy.INFOSPHERE>=2?2:0)+rival);
  w.indicators.rights=clamp(w.indicators.rights+(w.indicators.leverage>=65?-2:1));
 }
 // Reciprocal feedback from experienced service changes; no fabricated individual casualty counts.
 const avg=Object.values(groupChanges).reduce((a,b)=>a+b,0)/Object.keys(groupChanges).length;
 w.indicators.support=clamp(w.indicators.support+Math.trunc(avg/2)+(w.indicators.war>80?-2:0));
 // Minimum maintenance expenses, transparent stock-flow conservation.
 const upkeep=2+Math.floor(Object.values(w.policy).reduce((a,b)=>a+b,0)/12);
 if(!transfer(w,'TREASURY','FIRMS',Math.min(upkeep,w.money.TREASURY))){throw Error('MAINTENANCE_LEDGER');}
 const ids=[];const important=Object.entries(groupChanges).filter(([k,v])=>v!==0).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])||a[0].localeCompare(b[0]));
 if(important.length){const [group,delta]=important[0];ids.push(addEvent(w,w.turn,'GROUP_RESPONSE',`${GROUPS[group].name}: ${delta>0?'+':''}${delta} condizioni di servizio (indice sintetico)`,orderIds));}
 if(w.scenario==='OPEN'&&w.indicators.war>=79)ids.push(addEvent(w,w.turn,'FRONT_CRISIS','Le forze rivali mantengono pressione sui fronti; la disponibilità strategica cala.',orderIds));
 if(w.scenario==='FRIENDS'&&w.indicators.trust<=34)ids.push(addEvent(w,w.turn,'ALLIANCE_FRACTURE','La precedente alleanza sospende il coordinamento comune.',orderIds));
 if(w.scenario==='FRIENDS'&&w.indicators.war>=60&&!w.events.some(x=>x.kind==='FORMAL_WAR_DECLARATION'))ids.push(addEvent(w,w.turn,'FORMAL_WAR_DECLARATION','La controversia fra ex alleati passa a guerra dichiarata.',orderIds));
 if(w.scenario==='SOFT'&&w.indicators.leverage>=68)ids.push(addEvent(w,w.turn,'ADMINISTRATIVE_CAPTURE','Il sistema centrale diventa la principale leva di governo.',orderIds));
 return {channelDeltas:Object.fromEntries(Object.keys(deltas).map(k=>[k,w.channels[k]-prev[k]])),groupChanges,indicatorDeltas:Object.fromEntries(Object.keys(before).map(k=>[k,w.indicators[k]-before[k]])),events:ids};
}
const NARRATORS={PORT_WORKERS:'Nora, rappresentante portuale',SMALL_FIRMS:'Elio, impresa manifatturiera',HOSPITALS:'Ada, responsabile ospedaliera',BORDER_FAMILIES:'Marta, comunità di confine',DIGITAL_WORKERS:'Iris, coordinatrice digitale',RURAL:'Sami, cooperativa rurale',PUBLIC_SERVICES:'Teo, amministrazione pubblica',INVESTORS:'Lea, investitrice'};
function scene(w,receipt){
 const arr=Object.entries(receipt.propagation.groupChanges).filter(([,v])=>v!==0).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])||a[0].localeCompare(b[0]));
 const [g,delta]=arr[0]??['PUBLIC_SERVICES',0];const sign=delta>0?'migliorate':delta<0?'peggiorate':'stabili';
 let quote=`«Le condizioni per ${GROUPS[g].name.toLowerCase()} sono ${sign}. Il cambiamento misurato è ${delta>0?'+':''}${delta}».`;
 if(w.scenario==='OPEN')quote+=` «La guerra non aspetta il prossimo bilancio».`;
 if(w.scenario==='FRIENDS')quote+=` «I nostri ex soci rispondono per conto loro».`;
 if(w.scenario==='SOFT')quote+=` «Ora sappiamo chi dispone della rete e quanto dipendiamo dalle sue decisioni».`;
 return {speaker:NARRATORS[g],group:g,delta,text:quote,sourceEventIds:receipt.ids.slice(),synthetic:true};
}
export function play(w,orders=[]){
 const check=validate(w,orders);if(!check.ok)return {ok:false,code:check.reason};
 const n=copy(w),beforeMoney=moneyTotal(w),beforeKey=digest(w);
 const sorted=[...orders].sort((a,b)=>a.domain.localeCompare(b.domain));let ids=[];
 for(const o of sorted){const result=apply(n,o);if(!result.ok)return {ok:false,code:result.reason};ids.push(...result.ids);}
 const propagation=updateWorld(n,ids);ids.push(...propagation.events);
 const receipt={turn:w.turn,orders:sorted,ids,propagation,conservation:moneyTotal(n),sourceDigest:beforeKey};
 const narrative=scene(n,receipt);n.memories.push({turn:w.turn,...narrative});
 n.history.push(receipt);n.turn++;n.revision++;
 if(moneyTotal(n)!==beforeMoney)throw Error('MONEY_NOT_CONSERVED');
 return {ok:true,world:n,receipt:copy(receipt),scene:copy(narrative)};
}
export function score(w){
 const c=w.channels,i=w.indicators,crit={
 EFFICIENCY:c.information>=53&&c.energy>=53&&i.support>=42,
 HEGEMONY:i.leverage>=60&&c.information>=53,
 PLURALISM:i.rights>=55&&i.support>=43,
 VICTORY:i.front>=55&&i.war<=76,
 ARMISTICE:i.war<=45&&i.trust>=42,
 SURVIVAL:i.front>=43&&i.support>=40,
 REUNION:i.trust>=65&&i.war<=50,
 DOMINANCE:i.leverage>=60&&i.front>=45,
 SEPARATION:i.trust<=33&&i.front>=45&&i.support>=38};
 const personalOrders=w.history.flatMap(h=>h.orders);
 const ownByRole={COSTANTINO:['COORDINATE','PROPOSE','MOBILIZE','CENTRALIZE','BREAK_PACT','RECONCILE','TRUCE_OFFER'],FINANZIATORE:['INVEST','LEVERAGE'],PARLAMENTARE:['INQUIRE','AUTHORIZE','CENSURE','ALLOCATE'],PRESIDENTE:['CONVENE','REFER','RETURN'],GIUDICE:['REVIEW','STAY','UPHOLD']};
 const impactfulKinds={COSTANTINO:['COORDINATION','PROPOSAL','MOBILIZATION','CENTRALIZATION','PACT_BROKEN','PACT_REPAIRED','PACT_OFFER_REJECTED','TRUCE_ACCEPTED','TRUCE_REFUSED'],FINANZIATORE:['INVESTMENT','LEVERAGE'],PARLAMENTARE:['PROPOSAL','OVERSIGHT','CENSURE','AUTHORIZATION'],PRESIDENTE:['CONVOCATION','OVERSIGHT','RETURN'],GIUDICE:['EVIDENCE_REVIEW','INTERIM_STAY','JUDGMENT']};
 const actionCount=w.events.filter(e=>impactfulKinds[w.role].includes(e.kind)&&w.history.some(h=>h.ids.includes(e.id))).length;
 const personalConditions={COSTANTINO:i.support>=42,FINANZIATORE:w.money.FUND>=12,PARLAMENTARE:i.rights>=47,PRESIDENTE:i.trust>=37,GIUDICE:i.rights>=47};
 const personal={title:({COSTANTINO:'Influenzare davvero il governo',FINANZIATORE:'Aumentare influenza senza fallire',PARLAMENTARE:'Esercitare controllo sul potere',PRESIDENTE:'Mantenere aperti canali istituzionali',GIUDICE:'Lasciare atti e garanzie verificabili'})[w.role],actions:actionCount,requiredActions:2,conditionMet:Boolean(personalConditions[w.role]),victory:actionCount>=2&&Boolean(personalConditions[w.role])};
 const result={completed:w.turn>w.horizon,victory:Boolean(crit[w.ambition]),personal,ambition:w.ambition,ambitionName:SCENARIOS[w.scenario].ambitions[w.ambition],
 world:{war:i.war,trust:i.trust,leverage:i.leverage,front:i.front,rights:i.rights,support:i.support},
 pressureGroups:Object.entries(w.groups).filter(([,n])=>n<42).map(([k])=>k)};
 return result;
}
export function digest(w){return hash(w)}
export function replay({seed,role,scenario,ambition,commands}){
 let w=newGame({seed,role,scenario,ambition});for(const orders of commands){const r=play(w,orders);if(!r.ok)throw Error('REPLAY_'+r.code);w=r.world;}return w;
}
export function save(w){return copy({schema:'CIE-V3-REPLAY',seed:w.seed,role:w.role,scenario:w.scenario,ambition:w.ambition,commands:w.history.map(h=>h.orders),digest:digest(w)});}
export function restore(p){if(!p||p.schema!=='CIE-V3-REPLAY'||Object.keys(p).sort().join(',')!=='ambition,commands,digest,role,scenario,schema,seed'||!Array.isArray(p.commands)||p.commands.length>6)throw Error('BAD_REPLAY');const w=replay(p);if(digest(w)!==p.digest)throw Error('TAMPERED_REPLAY');return w;}
export function audit(w){if(!w||w.ruleset!==RULESET||w.history.length!==w.turn-1||moneyTotal(w)!==200||w.turn<1||w.turn>7)return {ok:false,code:'INVARIANT'};return {ok:true,turns:w.history.length,money:moneyTotal(w),events:w.events.length,scenes:w.memories.length,digest:digest(w)};}
