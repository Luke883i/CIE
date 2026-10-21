import {f4Start,f4Play,f4Audit,f4Save,f4Restore} from '../src/judicial.mjs';
import {f3Digest} from '../src/institutions.mjs';
import {writeFileSync} from 'node:fs';
const roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
const summary={schema:'CIE-F4-AUDIT-1',ruleset:'CIE-F4-1.0.0',seedsPerRole:200,total:0,replays:0,cases:0,remedies:{},outcomes:{},zeroLedgerAnomalies:true,anomalies:[]};
for(const role of roles)for(let seed=0;seed<200;seed++){try{let s=f4Start({seed,humanRole:role}),loops=0;while(!s.world.terminal&&loops++<32){const r=f4Play(s,'WAIT');if(!r.ok)throw Error(r.code);s=r.session;}if(!s.world.terminal)throw Error('DEADLOCK');const a=f4Audit(s.world),restored=f4Restore(f4Save(s));if(f3Digest(s.world)!==f3Digest(restored.world))throw Error('REPLAY');summary.total++;summary.replays++;summary.cases+=a.cases;summary.outcomes[s.world.ending]=(summary.outcomes[s.world.ending]||0)+1;for(const remedy of a.remedies)summary.remedies[remedy]=(summary.remedies[remedy]||0)+1;}catch(e){summary.anomalies.push({role,seed,error:String(e)});}}
const path=process.argv[2]??'proofs/F4-audit.json';writeFileSync(path,JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));if(summary.total!==1000||summary.replays!==1000||summary.anomalies.length)process.exitCode=1;
