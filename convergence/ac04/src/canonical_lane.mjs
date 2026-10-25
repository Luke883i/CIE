/** AC-04 canonical-lane durable adapter, NOT a five-human shared F7 world.
 * Precisely reuses byte-identical CIE main source, with no modification of its simulation rules.
 * Local engineering harness only; NOT production authentication or access control assurance.
 */
import {DatabaseSync} from 'node:sqlite';
import {createHash, randomBytes} from 'node:crypto';
import {f7Initial,f7Play,f7Observe,f7Save,f7Restore,f7Audit,F7_RULESET} from '../../../src/strategy.mjs';
import {gameGoal} from '../../../src/game_goal.mjs';
import {roleObjective,dualOutcome} from '../../../src/role_objectives.mjs';

export const ROLES = Object.freeze(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']);
export const SCHEMA = 'CIE-AC04-CANONICAL-LANE-1';
const sha = v => createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const fail = code => {const e=new Error(code);e.code=code;return e;};
const keyOK = k=>typeof k==='string'&&/^[A-Za-z0-9-]{8,64}$/.test(k);
const idFor = (seed,role) => `F7-${seed}-${role}`;
export function initialize(file,{seed=41}={}){
 if(!Number.isSafeInteger(seed)||seed<0||seed>0xffffffff)throw fail('INVALID_SEED');
 const db=new DatabaseSync(file); db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=8000;');
 db.exec(`CREATE TABLE IF NOT EXISTS meta(k TEXT PRIMARY KEY,v TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS campaigns(id TEXT PRIMARY KEY,role TEXT NOT NULL,seed INTEGER NOT NULL,revision INTEGER NOT NULL,body TEXT NOT NULL,body_sha TEXT NOT NULL,token_sha TEXT NOT NULL UNIQUE);
 CREATE TABLE IF NOT EXISTS idempotency(campaign TEXT NOT NULL,k TEXT NOT NULL,input_sha TEXT NOT NULL,response TEXT NOT NULL,PRIMARY KEY(campaign,k));
 CREATE TABLE IF NOT EXISTS audit(seq INTEGER PRIMARY KEY AUTOINCREMENT,campaign TEXT NOT NULL,revision INTEGER NOT NULL,digest TEXT NOT NULL,event TEXT NOT NULL);`);
 if(db.prepare('SELECT v FROM meta WHERE k=?').get('schema')){db.close();throw fail('ALREADY_INITIALIZED');}
 const credentials={};db.exec('BEGIN IMMEDIATE');try{
  db.prepare('INSERT INTO meta VALUES (?,?)').run('schema',SCHEMA);
  db.prepare('INSERT INTO meta VALUES (?,?)').run('f7_ruleset',F7_RULESET);
  for(const role of ROLES){
   const state=f7Initial({seed,humanRole:role});const body=JSON.stringify(f7Save(state));const id=idFor(seed,role);const token=`c04_${randomBytes(32).toString('base64url')}`;
   credentials[role]={campaign:id,token};
   db.prepare('INSERT INTO campaigns VALUES(?,?,?,?,?,?,?)').run(id,role,seed,0,body,sha(body),sha(token));
   db.prepare('INSERT INTO audit(campaign,revision,digest,event) VALUES(?,?,?,?)').run(id,0,f7Audit(state).digest,'BOOTSTRAP');
  }
  db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e;}finally{db.close();}
 return credentials;
}
export class CanonicalLane{
 constructor(file){this.db=new DatabaseSync(file);this.db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=8000;');
  if(this.db.prepare('SELECT v FROM meta WHERE k=?').get('schema')?.v!==SCHEMA)throw fail('SCHEMA_MISMATCH');
  if(this.db.prepare('SELECT v FROM meta WHERE k=?').get('f7_ruleset')?.v!==F7_RULESET)throw fail('RULESET_MISMATCH');}
 close(){this.db.close();}
 _row(id,token){if(typeof id!=='string'||typeof token!=='string'||token.length>160)throw fail('ACCESS_DENIED');
  const row=this.db.prepare('SELECT * FROM campaigns WHERE id=?').get(id);
  if(!row||sha(token)!==row.token_sha)throw fail('ACCESS_DENIED');return row;}
 _state(row){if(sha(row.body)!==row.body_sha)throw fail('STATE_HASH_MISMATCH');let archive;
  try{archive=JSON.parse(row.body);}catch{throw fail('STATE_FORMAT');}
  const state=f7Restore(archive),a=f7Audit(state);
  if(archive.digest!==a.digest||row.revision!==archive.commands.length)throw fail('REPLAY_REVISION_MISMATCH');
  if(state.core.core.humanRole!==row.role||state.core.core.world.seed!==row.seed)throw fail('ROLE_OR_SEED_MISMATCH');
  return state;}
 view(id,token){const row=this._row(id,token),state=this._state(row),v=f7Observe(state),goal=gameGoal(v,row.role),personal=roleObjective(v,row.role,f7Save(state).commands);
  return {schema:SCHEMA,campaign:id,revision:row.revision,role:row.role,observation:v,collectiveGoal:goal,personalGoal:personal,dual:dualOutcome(goal,personal)};}
 apply(id,token,{command,expectedRevision,key}={},hooks={}){
  if(!keyOK(key))throw fail('INVALID_IDEMPOTENCY_KEY');
  this.db.exec('BEGIN IMMEDIATE');let txOpen=true;try{
   const row=this._row(id,token);const inp={command,expectedRevision};const ph=sha(inp);
   const existing=this.db.prepare('SELECT input_sha,response FROM idempotency WHERE campaign=? AND k=?').get(id,key);
   if(existing){if(existing.input_sha!==ph)throw fail('IDEMPOTENCY_CONFLICT');this.db.exec('COMMIT');txOpen=false;return {...JSON.parse(existing.response),duplicate:true};}
   if(row.revision!==expectedRevision)throw fail('STALE_REVISION');
   const state=this._state(row),before=f7Audit(state).digest,played=f7Play(state,command);
   if(!played.ok){if(f7Audit(state).digest!==before)throw fail('ILLEGAL_MUTATED_STATE');throw fail('ACTION_'+played.code);}
   const after=played.session,save=f7Save(after),body=JSON.stringify(save),revision=row.revision+1;
   if(save.commands.length!==revision||f7Audit(after).digest!==save.digest)throw fail('REPLAY_AFTER_MISMATCH');
   this.db.prepare('UPDATE campaigns SET revision=?,body=?,body_sha=? WHERE id=?').run(revision,body,sha(body),id);
   this.db.prepare('INSERT INTO audit(campaign,revision,digest,event) VALUES(?,?,?,?)').run(id,revision,save.digest,'CANONICAL_F7_APPLY');
   const response={ok:true,campaign:id,revision,digest:save.digest,phase:f7Observe(after).mode};
   this.db.prepare('INSERT INTO idempotency VALUES(?,?,?,?)').run(id,key,ph,JSON.stringify(response));
   hooks.beforeCommit?.(); // deterministic crash-fault injection test only, never exposed on HTTP.
   this.db.exec('COMMIT');txOpen=false;hooks.afterCommit?.();return response;
  }catch(e){if(txOpen)this.db.exec('ROLLBACK');throw e;}
 }
 audit(id,token){const row=this._row(id,token),state=this._state(row);const history=this.db.prepare('SELECT revision,digest,event FROM audit WHERE campaign=? ORDER BY seq').all(id);
  return {revision:row.revision,digest:f7Audit(state).digest,history,requests:this.db.prepare('SELECT COUNT(*) n FROM idempotency WHERE campaign=?').get(id).n};}
 snapshot(id,token){const row=this._row(id,token);this._state(row);return JSON.parse(row.body);}
}
/** Intentional fail-closed capability bridge: no illegitimate shared-world claim. */
export function compatibilityContract(){return Object.freeze({
 ac02:'CIE-AC02-1',f7:F7_RULESET,
 canonicalEnginePreserved:true,
 f7Authority:'ONE_HUMAN_ROLE_AND_SEEDED_NPCS',ac03Authority:'FIVE_HUMANS_ONE_SIMULTANEOUS_QUARTER',
 sameWorld:false,sharedCausalHistory:false,realMultiplayer:false,
 losslessCommandTranslation:false,commonCurrency:false,commonLegalActs:false,
 requiredForUnification:['MULTI_ACTOR_CANONICAL_TRANSITION','SHARED_ECONOMIC_LEDGER','COMPETENCE_CROSSWALK','EVENT_NAMESPACE_AND_PROVENANCE','FIVE_ROLE_INFORMATION_NONINTERFERENCE','MIGRATION_AND_REPLAY']
});}
export function requireSharedWorld(){throw fail('SEMANTIC_UNIFICATION_NOT_IMPLEMENTED');}
