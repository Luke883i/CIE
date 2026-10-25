import {mkdtemp,rm,writeFile,mkdir} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {initialize,PersistentWorld,ROLES} from '../server/store.mjs';import {digest} from '../src/golden_crisis.mjs';
import {fileURLToPath} from 'node:url';import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
let runs=400,correct=0,blockedEnergy=0,scarce=0,revocations=0,replays=0,scopedViews=0,publicPanels=0,duplicates=0,mutations=0;
let samples=[];let started=Date.now();
for(let seed=0;seed<runs;seed++){
 const dir=await mkdtemp(join(tmpdir(),'cie3-audit-'));const db=join(dir,'state.db');
 try{
  const credentials=initialize(db,{seed});let a=new PersistentWorld(db);
  const isStay=seed%2===0,hasCredit=seed%4<2,isRevoke=seed%11===0;
  const choices={COSTANTINO:{kind:'EXECUTE',target:seed%3===0?'P-PORT':'P-ENERGY'},FINANZIATORE:hasCredit?{kind:'OFFER_CREDIT',target:'P-PORT'}:{kind:'HOLD',target:'NONE'},PARLAMENTARE:{kind:'INQUIRE',target:'P-ENERGY'},PRESIDENTE:{kind:'CONVENE',target:'P-PORT'},GIUDICE:isStay?{kind:'STAY',target:'P-ENERGY'}:{kind:'REVIEW',target:'P-ENERGY'}};
  const order=[...ROLES].sort((r,s)=>((ROLES.indexOf(r)+seed*3)%5)-((ROLES.indexOf(s)+seed*3)%5));
  for(const role of order){let res=a.submit(role,{order:choices[role],key:'SUBMIT-'+role,expectedRevision:0});if(!res.ok)throw Error('BAD_SUBMIT');}
  if(isRevoke){a.revoke('FINANZIATORE',{key:'REVOKE-00001'});revocations++;}
  const w0=a.snapshotForAudit().stateSha;
  for(const role of ROLES){if(isRevoke&&role==='FINANZIATORE')continue;
   const v=a.getView(role),json=JSON.stringify(v);scopedViews++;
   if(role!=='FINANZIATORE'&&json.includes('PRIVATE_FINANCIER_'))throw Error('FINANCE_LEAK');
   if(role!=='GIUDICE'&&json.includes('PRIVATE_DRAFT_JUDGMENT_'))throw Error('JUDGE_LEAK');
   if(json.includes('token_hash')||json.includes('privateNotes'))throw Error('STRUCTURAL_LEAK');
   for(const frame of v.comics){publicPanels++;if(frame.sourceEventIds.length===0)throw Error('FRAME_MISSING_SOURCE')}
  }
  if(w0!==a.snapshotForAudit().stateSha)throw Error('READ_MUTATED');
  const r=a.resolve({key:'COMMIT-AUDIT-0001',expectedRevision:0});if(r.duplicate)throw Error('FIRST_WAS_DUPLICATE');
  const d=a.snapshotForAudit();if(d.world.phase!=='COMMITTED'||d.world.revision!==1)throw Error('COMMIT_NOT_DURABLE');
  if(Object.values(d.world.balances).reduce((sum,x)=>sum+x,0)!==24||Object.values(d.world.balances).some(x=>x<0))throw Error('LEDGER');
  if(isStay&&d.world.proposals.find(p=>p.id==='P-ENERGY').status!=='SUSPENDED')throw Error('STAY_INVALID');
  if(isStay)blockedEnergy++;
  if(!hasCredit||isRevoke)scarce++;
  if(d.replay!==digest(d.world))throw Error('REPLAY_INVALID');replays++;
  if(!a.resolve({key:'COMMIT-AUDIT-0001',expectedRevision:0}).duplicate)throw Error('NO_IDEMPOTENCY');duplicates++;
  a.close();const b=new PersistentWorld(db);
  if(b.snapshotForAudit().stateSha!==d.stateSha||b.operatorStatus().revision!==1)throw Error('RESTART_DRIFT');
  for(const role of ROLES){if(isRevoke&&role==='FINANZIATORE')continue;const v=b.getView(role);scopedViews++;if(v.comics.some(x=>x.sourceEventIds.some(e=>!v.events.some(y=>y.id===e))))throw Error('COMIC_SOURCE_MISSING');publicPanels+=v.comics.length;}
  if(b.counts().requestRows!==(ROLES.length+1+Number(isRevoke)))throw Error('IDEMPOTENT_REQUEST_COUNT');
  b.close();correct++;if(samples.length<4)samples.push({seed,isStay,hasCredit,isRevoke,stateSha:d.stateSha,receiptHash:digest(d.world),events:d.world.events.map(x=>x.kind)});
 }finally{await rm(dir,{recursive:true,force:true})}
}
const result={schema:'CIE-AC03-AUDIT-1',status:'PASS_LOCAL',seeds:runs,verifiedWorlds:correct,scopedProjections:scopedViews,comicFramesWithProvenance:publicPanels,replays,deduplicatedCommits:duplicates,judicialStayCases:blockedEnergy,scarcityConfiguredCases:scarce,revocations,forbiddenLeaks:0,stateReadMutations:0,dbRestarts:correct,samples,elapsedMs:Date.now()-started,limitations:['no real identity provider or TLS','single-turn prototype','experimental node:sqlite','no independent security audit','no deployment/multiplayer proof']};
await mkdir(join(root,'proofs'),{recursive:true});await writeFile(join(root,'proofs','ac03-audit.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,seeds:correct,projections:scopedViews,frames:publicPanels,replays,deduplicatedCommits:duplicates,elapsedMs:result.elapsedMs}));
