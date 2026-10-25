/** EX-01: one bounded, five-perspective, ONE-TURN hotseat episode over the ACTUAL AC03 kernel.
 * Not the canonical F7 campaign, not an authenticated multiplayer service. */
import {start,draft,commit,view,comic,digest,replayFrom,choices} from '../convergence/ac03/src/golden_crisis.mjs';
import {ROLES} from '../convergence/ac03/src/v3_immutable.mjs';
export const EX_RULESET='CIE-EX01-EPISODE-1';
export const PLAYER_ROLES=Object.freeze([...ROLES]);
const title={COSTANTINO:'Il coordinatore',FINANZIATORE:'Il finanziatore',PARLAMENTARE:'Il parlamentare',PRESIDENTE:'Il presidente',GIUDICE:'Il giudice'};
const interest={COSTANTINO:'Scegli quale opera provare a completare. Una seconda iniziativa procede in autonomia.',FINANZIATORE:'Decidi se un prestito ponte merita il rischio di debito futuro.',PARLAMENTARE:'Puoi avviare un controllo, senza sostituirti a chi esegue.',PRESIDENTE:'Puoi convocare gli organi, non autorizzare ogni opera.',GIUDICE:'Il fascicolo energetico e ammissibile: puoi sospendere soltanto quella opera.'};
const actions={EXECUTE:'Esegui opera',HOLD:'Non intervenire',OFFER_CREDIT:'Offri 5 crediti',INQUIRE:'Apri controllo',CONVENE:'Convoca le istituzioni',STAY:'Sospendi energia',REVIEW:'Esamina senza sospendere'};
const targetNames={'P-ENERGY':'Rete energetica','P-PORT':'Porto','NONE':'Nessuno'};
const clone=x=>structuredClone(x);
export function newEpisode(seed=41){const world=start({seed});return {schema:EX_RULESET,seed,world,submitted:[],finished:false};}
export function episodeView(episode){
 if(episode.schema!==EX_RULESET)throw Error('EX_SCHEMA');
 const role=PLAYER_ROLES[episode.submitted.length]??null;
 const w=role?view(episode.world,role):null;
 return {phase:episode.finished?'RESULT':'PLANNING',episodeTitle:'La doppia opera',goal:'Entro questo trimestre: realizzare sia la rete energetica sia il porto, senza violare sospensioni e limiti di cassa.',role,roleTitle:role?title[role]:null,interest:role?interest[role]:null,
  turn:1,turnMax:1,completed:episode.submitted.length,total:5,treasury:w?.treasury??episode.world.balances.TREASURY,
  fundAvailable:w?.fundAvailable??null,choices:role?choices(episode.world,role).map(o=>({kind:o.kind,target:o.target,code:`${o.kind}|${o.target}`,title:actions[o.kind]||o.kind,targetLabel:targetNames[o.target]})):[],
  submittedRoles:[...episode.submitted],result:episode.finished?episodeResult(episode):null};
}
export function submitChoice(episode,order){
 if(episode.schema!==EX_RULESET||episode.finished||episode.submitted.length>=5)return {ok:false,code:'EPISODE_CLOSED'};
 const role=PLAYER_ROLES[episode.submitted.length];
 const d=draft(episode.world,{role,order,expectedRevision:episode.world.revision});
 if(!d.ok)return {ok:false,code:d.code};
 const out={...episode,world:d.world,submitted:[...episode.submitted,role]};
 if(out.submitted.length<5)return {ok:true,episode:out};
 const c=commit(out.world,{key:`EX01-SEED-${episode.seed}`,expectedRevision:0});
 if(!c.ok)return {ok:false,code:c.code};
 return {ok:true,episode:{...out,world:c.world,finished:true}};
}
export function episodeResult(episode){
 if(!episode.finished||episode.world.phase!=='COMMITTED')throw Error('EX_NOT_FINISHED');
 const r=episode.world.committed.receipt;
 const executed=episode.world.proposals.filter(p=>p.status==='EXECUTED').map(p=>p.id);
 const statuses=Object.fromEntries(episode.world.proposals.map(p=>[p.id,p.status]));
 const both=executed.length===2;
 const headline=both?'Entrambe le opere sono operative':executed.length?'Un progetto avanza, l\u2019altro resta indietro':'Nessuna opera viene completata';
 const reason=both?'Il finanziamento e le autorizzazioni hanno consentito entrambe le opere.':
  r.courtStay?'La Corte ha sospeso la rete energetica; il provvedimento prevale sul finanziamento.':
  r.blocked.some(b=>b.code==='TREASURY_INSUFFICIENT')?'Le risorse disponibili non sono bastate per finanziare entrambi i progetti.':'I mandati, gli ordini e le iniziative autonome hanno determinato il risultato.';
 const events=r.events.map(e=>({id:e.id,kind:e.kind,detail:e.detail,refs:clone(e.refs)}));
 const ref=new Set(events.map(x=>x.id));const strips=comic(view(episode.world,'COSTANTINO')).map(s=>({id:s.id,title:s.title,caption:s.caption,alt:s.alt,sourceEventIds:[...s.sourceEventIds]}));
 for(const s of strips)if(!s.sourceEventIds.length||s.sourceEventIds.some(id=>!ref.has(id)))throw Error('EX_UNSOURCED_COMIC');
 return Object.freeze({schema:EX_RULESET,outcome:both?'FULL':'PARTIAL',complete:both,headline,reason,executed,statuses,
  treasury:episode.world.balances.TREASURY,balances:clone(episode.world.balances),loan:r.loan,courtStay:r.courtStay,
  effects:clone(r.worldEffects),blocked:clone(r.blocked),events,comics:strips,
  canonicalDigest:digest(episode.world),receiptRevision:r.revision,limitedClaim:'Un turno, un mondo AC03 isolato. Non prova la campagna F7, sicurezza multiplayer o divertimento umano.'});
}
export function replayEpisode(episode){
 if(!episode.finished)return {ok:false,code:'EX_NOT_FINISHED'};
 const r=replayFrom(episode.world);
 return {ok:r.digest===digest(episode.world),digest:r.digest};
}
export function runEpisode(seed,orders={}){
 let e=newEpisode(seed);for(const role of PLAYER_ROLES){const o=orders[role]??{kind:'HOLD',target:'NONE'};const s=submitChoice(e,o);if(!s.ok)throw Error('INVALID_PLAN_'+role+'_'+s.code);e=s.episode;}
 return e;
}
