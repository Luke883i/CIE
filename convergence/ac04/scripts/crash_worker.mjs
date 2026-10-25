import {CanonicalLane} from '../src/canonical_lane.mjs';
const [dbFile,id,token,phase,key]=process.argv.slice(2);const s=new CanonicalLane(dbFile);const v=s.view(id,token);
const command=v.observation.mode==='INSTITUTIONAL'?v.observation.available[0]:{move:'PUBLIC_HEARING',other:v.observation.strategic.counterparties[0],choice:'DELEGATE',strategy:'COOPERATE'};
const hooks=phase==='BEFORE'?{beforeCommit:()=>process.kill(process.pid,'SIGKILL')}:phase==='AFTER'?{afterCommit:()=>process.kill(process.pid,'SIGKILL')}:{};
s.apply(id,token,{command,expectedRevision:v.revision,key},hooks);s.close();
