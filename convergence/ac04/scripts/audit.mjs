import {mkdtempSync,rmSync,mkdirSync,writeFileSync} from 'node:fs';import path from 'node:path';import {tmpdir} from 'node:os';
import {initialize,CanonicalLane,ROLES,compatibilityContract} from '../src/canonical_lane.mjs';
import {f7Initial,f7Play,f7Observe,f7Audit,f7Save,f7Restore} from '../../../src/strategy.mjs';
const N=Number(process.env.CIE_AC04_SEEDS||24);if(!Number.isInteger(N)||N<1||N>1000)throw Error('SEED_COUNT_INVALID');
const report={schema:'CIE-AC04-AUDIT-1',seeds:N,roles:ROLES.length,independentCampaigns:0,steps:0,replays:0,scopedViews:0,duplicateRequests:0,balanceErrors:0,errors:[],crossKernel:compatibilityContract(),release:'BLOCK'};
for(let seed=0;seed<N;seed++){
 const dir=mkdtempSync(path.join(tmpdir(),'ac04-audit-'));try{
  const file=path.join(dir,'game.sqlite'),creds=initialize(file,{seed}),db=new CanonicalLane(file);
  for(const role of ROLES){const c=creds[role];let pure=f7Initial({seed,humanRole:role});report.independentCampaigns++;
   let steps=0;while(steps++<35){const v=db.view(c.campaign,c.token),o=v.observation;
    const trueDigest=f7Audit(pure).digest;if(v.role!==role||v.observation.worldId!==f7Observe(pure).worldId||db.audit(c.campaign,c.token).digest!==trueDigest)throw Error('VIEW_OR_REPLAY_DISAGREEMENT');report.scopedViews++;
    if(o.mode==='ECONOMIC'&&o.ended)break;
    const cmd=o.mode==='INSTITUTIONAL'?o.available[0]:{move:o.strategic.moves.includes('PROPOSE_PACT')?'PROPOSE_PACT':'PUBLIC_HEARING',other:o.strategic.counterparties.find(x=>x!=='GIUDICE')??o.strategic.counterparties[0],choice:'DELEGATE',strategy:'COOPERATE'};
    if(!cmd)throw Error('NO_CANONICAL_ACTION');const ref=f7Play(pure,cmd);if(!ref.ok)throw Error('PURE_REJECTED_'+ref.code);
    const key=`AUDIT-${String(seed).padStart(3,'0')}-${String(steps).padStart(3,'0')}`;
    const r=db.apply(c.campaign,c.token,{command:cmd,expectedRevision:steps-1,key});
    const dup=db.apply(c.campaign,c.token,{command:cmd,expectedRevision:steps-1,key});if(!dup.duplicate||r.digest!==dup.digest)throw Error('IDEMPOTENCY_FAIL');report.duplicateRequests++;
    if(r.digest!==f7Audit(ref.session).digest)throw Error('CANONICAL_DELTA_MISMATCH');pure=ref.session;report.steps++;
   }
   if(steps>35)throw Error('UNBOUNDED_EPISODE');const saved=db.snapshot(c.campaign,c.token);if(f7Audit(f7Restore(saved)).digest!==f7Audit(pure).digest)throw Error('REPLAY_FAIL');report.replays++;
  }db.close();
 }catch(e){report.errors.push({seed,code:e.message});break;}finally{rmSync(dir,{recursive:true,force:true});}
}
report.pass=report.errors.length===0&&report.replays===N*ROLES.length;
mkdirSync(new URL('../proofs/',import.meta.url),{recursive:true});writeFileSync(new URL('../proofs/canonical_lane_audit.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify({pass:report.pass,seeds:N,campaigns:report.replays,steps:report.steps,replays:report.replays,errors:report.errors.slice(0,2)}));if(!report.pass)process.exitCode=1;
