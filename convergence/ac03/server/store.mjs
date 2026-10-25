/** AC-03 persistent authority. Node >=22.13 node:sqlite experimental. No production assurance. */
import {DatabaseSync} from 'node:sqlite';
import {randomBytes,createHash} from 'node:crypto';
import {ROLES} from '../src/v3_immutable.mjs';
import {start,draft,commit,view,comic,digest,replayFrom} from '../src/golden_crisis.mjs';
const enc=v=>JSON.stringify(v);
const hash=s=>createHash('sha256').update(s).digest('hex');
const safeRole=r=>ROLES.includes(r)||r==='OPERATOR';
const fail=(code,http=409)=>Object.assign(new Error(code),{code,http});
export function initialize(dbFile,{seed=41}={}){
 const db=new DatabaseSync(dbFile); db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=8000;');
 db.exec(`CREATE TABLE IF NOT EXISTS worlds(id TEXT PRIMARY KEY, body TEXT NOT NULL, hash TEXT NOT NULL, version INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS identities(role TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, revoked INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS requests(role TEXT NOT NULL, op TEXT NOT NULL, idem TEXT NOT NULL, payload_hash TEXT NOT NULL, response TEXT NOT NULL, PRIMARY KEY(role,op,idem));
 CREATE TABLE IF NOT EXISTS ledger(seq INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT NOT NULL, event TEXT NOT NULL, revision INTEGER NOT NULL, state_sha TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS system_meta(k TEXT PRIMARY KEY,v TEXT NOT NULL);`);
 if(db.prepare('SELECT 1 FROM worlds WHERE id=?').get('golden')){db.close();throw fail('WORLD_ALREADY_BOOTSTRAPPED');}
 const w=start({seed});const body=enc(w);
 const tokens={};
 db.exec('BEGIN IMMEDIATE');
 try{
  db.prepare('INSERT INTO worlds VALUES(?,?,?,?)').run('golden',body,hash(body),0);
  for(const role of [...ROLES,'OPERATOR']){
   const token='cie3_'+randomBytes(32).toString('base64url');tokens[role]=token;
   db.prepare('INSERT INTO identities(role,token_hash,revoked) VALUES(?,?,0)').run(role,hash(token));
  }
  db.prepare('INSERT INTO system_meta(k,v) VALUES(?,?)').run('schema','CIE-AC03-1');
  db.prepare('INSERT INTO ledger(actor,event,revision,state_sha) VALUES(?,?,?,?)').run('SYSTEM','BOOTSTRAP',0,hash(body));
  db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e;}finally{db.close();}
 return tokens;
}
export class PersistentWorld{
 constructor(dbFile){this.db=new DatabaseSync(dbFile);this.db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=8000; PRAGMA foreign_keys=ON;');
 if(this.db.prepare('SELECT v FROM system_meta WHERE k=?').get('schema')?.v!=='CIE-AC03-1')throw fail('SCHEMA_MISMATCH');}
 close(){this.db.close();}
 identity(token){if(typeof token!=='string'||token.length<25||token.length>150)return null;
 const row=this.db.prepare('SELECT role,revoked FROM identities WHERE token_hash=?').get(hash(token));return row&&!row.revoked?row.role:null;}
 _read(){const row=this.db.prepare('SELECT * FROM worlds WHERE id=?').get('golden');if(!row)throw fail('MISSING_WORLD',500);if(hash(row.body)!==row.hash)throw fail('STATE_HASH_MISMATCH',500);
 const world=JSON.parse(row.body);if(row.version!==world.revision)throw fail('REVISION_MISMATCH',500);return {world,version:row.version};}
 _write(w){const body=enc(w);this.db.prepare('UPDATE worlds SET body=?,hash=?,version=? WHERE id=?').run(body,hash(body),w.revision,'golden');return hash(body);}
 _atomic(operation){this.db.exec('BEGIN IMMEDIATE');try{const v=operation();this.db.exec('COMMIT');return v;}catch(e){this.db.exec('ROLLBACK');throw e;}}
 _memo(role,op,key,payload){const s=this.db.prepare('SELECT payload_hash,response FROM requests WHERE role=? AND op=? AND idem=?').get(role,op,key);
 if(!s)return null;if(s.payload_hash!==hash(enc(payload)))throw fail('IDEMPOTENCY_CONFLICT');return JSON.parse(s.response);}
 _remember(role,op,key,payload,response){this.db.prepare('INSERT INTO requests(role,op,idem,payload_hash,response) VALUES(?,?,?,?,?)').run(role,op,key,hash(enc(payload)),enc(response));}
 _log(actor,event,w){this.db.prepare('INSERT INTO ledger(actor,event,revision,state_sha) VALUES(?,?,?,?)').run(actor,event,w.revision,hash(enc(w)));}
 _validateKey(key){if(typeof key!=='string'||!/^[a-zA-Z0-9-]{8,64}$/.test(key))throw fail('INVALID_REQUEST_KEY',400);}
 getView(role){if(!ROLES.includes(role))throw fail('ROLE_REQUIRED',403);const {world}=this._read();return {...view(world,role),revoked:false,comics:comic(view(world,role))};}
 operatorStatus(){const {world}=this._read();const revoked=this.db.prepare('SELECT role FROM identities WHERE revoked=1').all().map(x=>x.role);
 return {phase:world.phase,revision:world.revision,submittedCount:Object.keys(world.pending).length,requiredCount:ROLES.length,missingRoles:ROLES.filter(x=>!Object.hasOwn(world.pending,x)),revokedRoles:revoked,events:world.events.length,digest:digest(world)};}
 submit(role,payload){if(!ROLES.includes(role))throw fail('ROLE_REQUIRED',403);const {order,expectedRevision,key}=payload??{};this._validateKey(key);
 return this._atomic(()=>{
  const old=this._memo(role,'submit',key,{order,expectedRevision});if(old)return {...old,duplicate:true};
  if(this.db.prepare('SELECT revoked FROM identities WHERE role=?').get(role)?.revoked)throw fail('MANDATE_REVOKED',403);
  const {world}=this._read();const r=draft(world,{role,order,expectedRevision});if(!r.ok)throw fail(r.code);
  this._write(r.world);const response={ok:true,accepted:true,revision:r.world.revision,submittedCount:Object.keys(r.world.pending).length};
  this._remember(role,'submit',key,{order,expectedRevision},response);this._log(role,'ORDER_SUBMITTED',r.world);return response;
 });}
 revoke(role,{key,reason='MANDATE_EXPIRED'}={}){if(!ROLES.includes(role))throw fail('NO_REVOCABLE_ROLE',400);this._validateKey(key);
 return this._atomic(()=>{
  const old=this._memo('OPERATOR','revoke',key,{role,reason});if(old)return {...old,duplicate:true};
  const {world}=this._read();if(world.phase!=='PLANNING')throw fail('REVOCATION_AFTER_COMMIT');
  if(this.db.prepare('SELECT revoked FROM identities WHERE role=?').get(role)?.revoked)throw fail('ALREADY_REVOKED');
  this.db.prepare('UPDATE identities SET revoked=1 WHERE role=?').run(role);
  // Evict stale order; revoked seat contributes only a transparent HOLD.
  world.pending[role]={kind:'HOLD',target:'NONE'};
  this._write(world);const resp={ok:true,role,revoked:true,orderDisposition:'HOLD'};
  this._remember('OPERATOR','revoke',key,{role,reason},resp);this._log('OPERATOR','MANDATE_REVOKED:'+role,world);return resp;
 });}
 resolve({key,expectedRevision}={},hooks={}){this._validateKey(key);return this._atomic(()=>{
  const old=this._memo('OPERATOR','resolve',key,{expectedRevision});if(old)return {...old,duplicate:true};
  const {world}=this._read();if(world.phase==='COMMITTED')throw fail('ALREADY_COMMITTED');
  if(world.revision!==expectedRevision)throw fail('STALE_REVISION');
  if(ROLES.some(role=>!Object.hasOwn(world.pending,role)))throw fail('NOT_ALL_ROLES_READY');
  // The authoritative kernel checks competence at submission; revocation checks at commit.
  for(const row of this.db.prepare('SELECT role FROM identities WHERE revoked=1').all())
   if(world.pending[row.role]?.kind!=='HOLD')throw fail('REVOKED_NON_HOLD');
  const result=commit(world,{key,expectedRevision});if(!result.ok)throw fail(result.code);
  this._write(result.world);this._log('OPERATOR','WORLD_COMMITTED',result.world);
  const response={ok:true,receipt:result.receipt,stateSha:hash(enc(result.world)),revision:result.world.revision};
  this._remember('OPERATOR','resolve',key,{expectedRevision},response);
  hooks.afterWorldWrite?.(); // kill now => rollback; only injectable in direct tests.
  return response;
 },hooks);}
 resolveWithCrash({key,expectedRevision},phase){ // Separate test-only entry point, NEVER exposed by HTTP.
  if(phase==='BEFORE_COMMIT')return this.resolve({key,expectedRevision},{afterWorldWrite:()=>process.kill(process.pid,'SIGKILL')});
  if(phase==='AFTER_COMMIT'){
   const r=this.resolve({key,expectedRevision});process.kill(process.pid,'SIGKILL');return r;
  }
  throw fail('UNKNOWN_INJECTION');
 }
 snapshotForAudit(){const {world}=this._read();return {world,stateSha:hash(enc(world)),replay:world.phase==='COMMITTED'?replayFrom(world).digest:null};}
 counts(){return {auditRows:this.db.prepare('SELECT COUNT(*) n FROM ledger').get().n,requestRows:this.db.prepare('SELECT COUNT(*) n FROM requests').get().n};}
}
export {ROLES};
