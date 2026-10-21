// Deterministic fictional world, no generative AI or runtime network.
export const ROLES=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
const PERMISSIONS={COSTANTINO:['PROPONE'],FINANZIATORE:['FINANZIA'],PARLAMENTARE:['APPROVA','RESPINGE'],PRESIDENTE:['PROMULGA','RINVIA'],GIUDICE:['ACCOGLIE','RIGETTA']};
export function initial(seed=41){if(!Number.isSafeInteger(seed)||seed<0)throw Error('INVALID_SEED');return {seed,step:0,phase:'INIZIATIVA',proposal:false,bill:'ABSENT',judgment:'NONE',implementation:'NONE',balances:{FINANZIATORE:70,INIZIATIVA:0,IMPRESA:30,TESORO:100},events:[],terminal:false};}
export function checksum(x){const str=JSON.stringify(x);let n=2166136261;for(let i=0;i<str.length;i++)n=Math.imul(n^str.charCodeAt(i),16777619);return (n>>>0).toString(16).padStart(8,'0');} // noncryptographic replay checksum
export function transition(state,cmd){if(!cmd||!PERMISSIONS[cmd.actor]?.includes(cmd.type))return {ok:false,reason:'UNAUTHORIZED',state};if(state.terminal)return {ok:false,reason:'TERMINAL',state};
const expected={PROPONE:'INIZIATIVA',FINANZIA:'PROPOSTA',APPROVA:'PROPOSTA',RESPINGE:'PROPOSTA',PROMULGA:'LEGGE',RINVIA:'LEGGE',ACCOGLIE:'CONTROLLO',RIGETTA:'CONTROLLO'};
if(state.phase!==expected[cmd.type])return {ok:false,reason:'BAD_PHASE',state};
if(cmd.type==='FINANZIA'&&state.balances.FINANZIATORE<10)return {ok:false,reason:'NO_FUNDS',state};
const s=structuredClone(state);let e={id:'E'+String(s.step+1).padStart(4,'0'),actor:cmd.actor,type:cmd.type,visibleTo:ROLES.slice(),links:[]};
switch(cmd.type){
case 'PROPONE':s.proposal=true;s.phase='PROPOSTA';e.links=['INIZIATIVA','PARLAMENTO'];break;
case 'FINANZIA':s.balances.FINANZIATORE-=10;s.balances.INIZIATIVA+=10;e.visibleTo=['FINANZIATORE','COSTANTINO'];e.links=['INIZIATIVA','FINANZIATORE'];break;
case 'APPROVA':s.bill='APPROVED';s.phase='LEGGE';e.links=['PARLAMENTO','PRESIDENZA'];break;
case 'RESPINGE':s.bill='REJECTED';s.terminal=true;break;
case 'PROMULGA':s.bill='PROMULGATED';s.phase='CONTROLLO';e.links=['PRESIDENZA','CORTE'];break;
case 'RINVIA':s.bill='RETURNED';s.phase='PROPOSTA';break;
case 'ACCOGLIE':s.judgment='ANNULLED';s.terminal=true;break;
case 'RIGETTA':s.judgment='UPHELD';s.phase='ATTUAZIONE';if(s.balances.INIZIATIVA>=10){s.balances.INIZIATIVA-=10;s.balances.IMPRESA+=10;s.implementation='CONTRACTED';}else s.implementation='UNFUNDED';s.terminal=true;e.links=['CORTE','INIZIATIVA','IMPRESA'];break;
}
s.step++;s.events.push(e);return {ok:true,event:e,state:s};
}
export function observe(s,role){if(!ROLES.includes(role))throw Error('INVALID_ROLE');return {worldId:'CIE:'+s.seed,role,phase:s.phase,step:s.step,bill:s.bill,judgment:s.judgment,implementation:s.implementation,visibleEvents:s.events.filter(e=>e.visibleTo.includes(role)),balances:Object.fromEntries(Object.entries(s.balances).filter(([k])=>k==='TESORO'||k===role||(role==='COSTANTINO'&&k==='INIZIATIVA'))),available:(PERMISSIONS[role]||[]).filter(type=>{const r=transition(s,{actor:role,type});return r.ok}),eventCount:s.events.length};}
export function replay(seed,commands){let s=initial(seed);for(const cmd of commands){const r=transition(s,cmd);if(!r.ok)throw Error(r.reason);s=r.state;}return s;}
export const PROOF_ACTIONS=[{actor:'COSTANTINO',type:'PROPONE'},{actor:'FINANZIATORE',type:'FINANZIA'},{actor:'PARLAMENTARE',type:'APPROVA'},{actor:'PRESIDENTE',type:'PROMULGA'},{actor:'GIUDICE',type:'RIGETTA'}];
