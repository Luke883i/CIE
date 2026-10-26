/** CP-01: observer-only board projection. NEVER import the world or reducer here. */
import {choiceMeaning} from '../experience/choice_contract.mjs';
export const BOARD_SCHEMA='CIE-CANONICAL-BOARD-1';
export const PROJECTS=Object.freeze([{id:'P-ENERGY',name:'Rete energetica',hint:'Continuità dei servizi',cost:5},{id:'P-PORT',name:'Porto',hint:'Traffico e approvvigionamenti',cost:5}]);
export const ROLE_LABELS=Object.freeze({COSTANTINO:'Costantino',FINANZIATORE:'Finanziatore',PARLAMENTARE:'Parlamentare',PRESIDENTE:'Presidente',GIUDICE:'Giudice'});
export const STATUS_LABELS=Object.freeze({EXECUTED:'Operativa',SUSPENDED:'Sospesa',AUTHORIZED:'Autorizzata, non eseguita'});
export function boardModel(observation,code=null){
 if(!observation||!['PLANNING','RESULT'].includes(observation.phase))throw Error('BOARD_PHASE');
 const legal=observation.choices??[];const selected=observation.phase==='PLANNING'?(legal.find(x=>x.code===code)??legal[0]??null):null;
 const m=selected?choiceMeaning(observation,selected.code):null;
 const r=observation.result??null;
 if(observation.phase==='RESULT'&&!r)throw Error('BOARD_NO_RECEIPT');
 const nodes=PROJECTS.map(p=>({id:p.id,name:p.name,hint:p.hint,cost:p.cost,status:r?STATUS_LABELS[r.statuses[p.id]]??'Non completata':'Da decidere'}));
 const out={schema:BOARD_SCHEMA,phase:observation.phase,role:observation.role,roleName:ROLE_LABELS[observation.role]??null,completed:observation.completed,total:observation.total,selectedCode:selected?.code??null,
  choices:legal.map(x=>({code:x.code,kind:x.kind,name:x.title,target:x.targetLabel})),meaning:m,nodes,
  treasury:observation.treasury,goal:'Rendere operative energia e porto in un trimestre, rispettando cassa e atti della Corte.',
  verdict:r?{outcome:r.outcome,headline:r.headline,reason:r.reason,events:r.events.map(e=>({id:e.id,kind:e.kind,detail:e.detail,refs:[...e.refs]})),comics:r.comics.map(c=>({id:c.id,title:c.title,caption:c.caption,sourceEventIds:[...c.sourceEventIds]})),balances:{...r.balances},effects:r.effects.map(e=>({...e})),blocked:r.blocked.map(x=>({...x}))}:null};
 if(out.choices.length>8||!out.goal||out.total!==5||!Number.isSafeInteger(out.treasury))throw Error('BOARD_CONTRACT');
 if(r){const ids=new Set(out.verdict.events.map(e=>e.id));if(out.verdict.comics.some(c=>!c.sourceEventIds.length||c.sourceEventIds.some(id=>!ids.has(id))))throw Error('BOARD_UNSOURCED_COMIC');}
 return Object.freeze(out);
}
