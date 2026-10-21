// CIE foundation: closed, fictional, deterministic institutional world.
export const VERSION='CIE-FOUNDATION-1';
export const ROLES=['COSTANTINO','PRESIDENTE','PARLAMENTARE','FINANZIATORE','GIUDICE'];
export const ENTITIES={
 COSTANTINO:{kind:'person',office:null,name:'Costantino',allegiance:'federal'},
 PRESIDENTE:{kind:'person',office:'PRESIDENZA_IT',name:'Presidente A. Serra',allegiance:'constitutional'},
 PARLAMENTARE:{kind:'person',office:'PARLAMENTO_IT',name:'Deputata M. Valli',allegiance:'regional'},
 FINANZIATORE:{kind:'person',office:null,name:'Finanziatrice L. Ferri',allegiance:'market'},
 GIUDICE:{kind:'person',office:'CORTE_IT',name:'Giudice R. Costa',allegiance:'judicial'},
 PARLAMENTO_IT:{kind:'institution',name:'Parlamento della Repubblica simulata'},
 PRESIDENZA_IT:{kind:'institution',name:'Presidenza della Repubblica simulata'},
 CORTE_IT:{kind:'institution',name:'Corte costituzionale simulata'},
 TESORO_IT:{kind:'institution',name:'Tesoro simulato'},
 INIZIATIVA:{kind:'organization',name:'Iniziativa Costituzione Europea'},
 IMPRESA:{kind:'organization',name:'Consorzio interconnessione'}
};
export const PROCESSES=['INIZIATIVA','PROPOSTA','LEGGE','CONTROLLO','ATTUAZIONE'];
export const COMMANDS={
 COSTANTINO:['PRESENTA_PROPOSTA','PROMUOVI_CONSENSO','ATTENDI'],
 PRESIDENTE:['RINVIA_LEGGE','PROMULGA_LEGGE','ATTENDI'],
 PARLAMENTARE:['APPROVA_LEGGE','RESPINGI_LEGGE','ATTENDI'],
 FINANZIATORE:['FINANZIA_INIZIATIVA','REVOCA_FINANZIAMENTO','ATTENDI'],
 GIUDICE:['ACCOGLI_RICORSO','RIGETTA_RICORSO','ATTENDI']
};
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
export function hash(x){const str=stable(x);let a=2166136261,b=2246822519;for(let i=0;i<str.length;i++){const c=str.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^c,3266489917)}return [a>>>0,b>>>0].map(n=>n.toString(16).padStart(8,'0')).join('');} // deterministic checksum, NOT cryptographic authority
export function initial(seed=41){if(!Number.isSafeInteger(seed)||seed<0)throw Error('INVALID_SEED');return {
 version:VERSION,seed,step:0,phase:'INIZIATIVA',proposal:false,bill:'ABSENT',judgment:'NONE',implementation:'NONE',
 balances:{TESORO_IT:100,FINANZIATORE:70,INIZIATIVA:0,IMPRESA:30},
 relations:[{source:'COSTANTINO',target:'INIZIATIVA',kind:'LEADS'},{source:'PARLAMENTARE',target:'PARLAMENTO_IT',kind:'MEMBER'},{source:'GIUDICE',target:'CORTE_IT',kind:'MEMBER'},{source:'PRESIDENTE',target:'PRESIDENZA_IT',kind:'HOLDS_OFFICE'}],
 evidence:[],access:{},events:[], terminal:false
};}
// Actor permissions are not equivalent to institutional legitimacy; phase and evidence also gate decisions.
function validate(s,a){if(!a||typeof a!=='object'||!ROLES.includes(a.actor)||!COMMANDS[a.actor].includes(a.type))return 'UNAUTHORIZED';if(s.terminal)return 'TERMINAL';
 const t=a.type;
 if(t==='ATTENDI')return null;
 if(t==='PRESENTA_PROPOSTA'&&s.phase!=='INIZIATIVA')return 'BAD_PHASE';
 if(t==='PROMUOVI_CONSENSO'&&!s.proposal)return 'NO_PROPOSAL';
 if(t==='FINANZIA_INIZIATIVA'&&(!s.proposal||s.balances.FINANZIATORE<10))return 'INSUFFICIENT_FUNDS_OR_NO_PROPOSAL';
 if(t==='REVOCA_FINANZIAMENTO'&&s.balances.INIZIATIVA<10)return 'NO_FUNDS';
 if(['APPROVA_LEGGE','RESPINGI_LEGGE'].includes(t)&&s.phase!=='PROPOSTA')return 'BAD_PHASE';
 if(['RINVIA_LEGGE','PROMULGA_LEGGE'].includes(t)&&s.phase!=='LEGGE')return 'BAD_PHASE';
 if(['ACCOGLI_RICORSO','RIGETTA_RICORSO'].includes(t)&&s.phase!=='CONTROLLO')return 'BAD_PHASE';
 return null;
}
export function transition(s,a){const reason=validate(s,a);if(reason)return {ok:false,reason,state:s};
 const n=structuredClone(s);const evt={id:`E${String(n.step+1).padStart(4,'0')}`,actor:a.actor,type:a.type,step:n.step+1,links:[],visibleTo:ROLES.slice()};
 switch(a.type){
 case 'PRESENTA_PROPOSTA':n.proposal=true;n.phase='PROPOSTA';evt.links=['COSTANTINO','INIZIATIVA','PARLAMENTO_IT'];break;
 case 'PROMUOVI_CONSENSO':n.relations.push({source:'COSTANTINO',target:'PARLAMENTARE',kind:'LOBBIED',at:evt.id});evt.links=['PARLAMENTARE'];break;
 case 'FINANZIA_INIZIATIVA':n.balances.FINANZIATORE-=10;n.balances.INIZIATIVA+=10;n.relations.push({source:'FINANZIATORE',target:'INIZIATIVA',kind:'FUNDED',at:evt.id});evt.visibleTo=['FINANZIATORE','COSTANTINO'];evt.links=['FINANZIATORE','INIZIATIVA'];break;
 case 'REVOCA_FINANZIAMENTO':n.balances.FINANZIATORE+=10;n.balances.INIZIATIVA-=10;evt.links=['FINANZIATORE','INIZIATIVA'];break;
 case 'APPROVA_LEGGE':n.bill='APPROVED';n.phase='LEGGE';evt.links=['PARLAMENTO_IT','PRESIDENZA_IT'];break;
 case 'RESPINGI_LEGGE':n.bill='REJECTED';n.terminal=true;evt.links=['PARLAMENTO_IT'];break;
 case 'RINVIA_LEGGE':n.bill='RETURNED';n.phase='PROPOSTA';evt.links=['PRESIDENZA_IT','PARLAMENTO_IT'];break;
 case 'PROMULGA_LEGGE':n.bill='PROMULGATED';n.phase='CONTROLLO';n.evidence.push({id:`D${n.step+1}`,kind:'PETITION',public:true});evt.links=['PRESIDENZA_IT','CORTE_IT'];break;
 case 'ACCOGLI_RICORSO':n.judgment='ANNULLED';n.terminal=true;evt.links=['CORTE_IT','PARLAMENTO_IT'];break;
 case 'RIGETTA_RICORSO':n.judgment='UPHELD';n.phase='ATTUAZIONE';if(n.balances.INIZIATIVA>=10){n.balances.INIZIATIVA-=10;n.balances.IMPRESA+=10;n.implementation='CONTRACTED';}else{n.implementation='UNFUNDED';}n.terminal=true;evt.links=['CORTE_IT','IMPRESA','INIZIATIVA'];break;
 default:evt.links=[a.actor];
 }
 n.step++;evt.previous=hash(s);n.events.push(evt);evt.stateAfter=hash({...n,events:n.events.map(e=>({...e,stateAfter:undefined}))});
 return {ok:true,event:evt,state:n};
}
export function observe(s,role,{omniscient=false}={}){if(!ROLES.includes(role))throw Error('INVALID_ROLE');const events=s.events.filter(e=>omniscient||e.visibleTo.includes(role));return {
 worldId:`CIE:${s.seed}:${VERSION}`,role,office:ENTITIES[role].office,phase:s.phase,step:s.step,
 proposal:s.proposal,bill:s.bill,judgment:s.judgment,implementation:s.implementation,terminal:s.terminal,
 visibleEvents:events.map(e=>({id:e.id,type:e.type,actor:e.actor,links:e.links})),
 // Only involved parties see private balances; public institutional ledgers stay visible.
 balances:Object.fromEntries(Object.entries(s.balances).filter(([k])=>omniscient||k==='TESORO_IT'||k===role||(role==='COSTANTINO'&&k==='INIZIATIVA'))),
 relations:s.relations.filter(r=>omniscient||r.kind!=='FUNDED'||role===r.source||role==='COSTANTINO'),
 available:COMMANDS[role].filter(type=>!validate(s,{actor:role,type})),
 eventCount:s.events.length,
 canonicalHash:omniscient?hash(s):undefined
};}
export function replay(seed,actions){let s=initial(seed);for(const a of actions){const r=transition(s,a);if(!r.ok)throw Error(`REPLAY_${r.reason}`);s=r.state;}return s;}
export function scriptedProof(seed=41){const actions=[
 {actor:'COSTANTINO',type:'PRESENTA_PROPOSTA'},
 {actor:'FINANZIATORE',type:'FINANZIA_INIZIATIVA'},
 {actor:'PARLAMENTARE',type:'APPROVA_LEGGE'},
 {actor:'PRESIDENTE',type:'PROMULGA_LEGGE'},
 {actor:'GIUDICE',type:'RIGETTA_RICORSO'}];return {actions,state:replay(seed,actions)};}
