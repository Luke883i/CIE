import fs from 'node:fs';
import {f5Initial,f5Play,f5FastForward,f5Save,f5Restore,f5Audit,ECON_ROLES,ECON_CHOICES,finalOutcome} from '../src/economy.mjs';
const report={schema:'CIE-F5-AUDIT-1',ruleset:'CIE-F5-1.0.0',cases:0,complete:0,replays:0,ledgerPass:0,failures:[],endings:{},progress:{},manualVsDelegatedChanged:0,criticalStops:0};
for(const role of ECON_ROLES)for(let seed=0;seed<200;seed++){
 let s=f5Initial({seed,humanRole:role}),n=0;while(s.mode==='INSTITUTIONAL'&&n++<60){const r=f5Play(s,'WAIT');if(!r.ok)throw Error(JSON.stringify({role,seed,r}));s=r.session;}
 const fork=s;const human=[];
 while(!s.economy.ended){const kind=ECON_CHOICES[role][(s.economy.quarter+seed)%2];human.push(kind);s=f5Play(s,kind).session;}
 let alt=fork;while(!alt.economy.ended)alt=f5Play(alt,'DELEGATE').session;
 report.cases++;report.complete+=Number(s.economy.ended);f5Audit(s);report.ledgerPass++;const again=f5Restore(f5Save(s));if(JSON.stringify(again)!==JSON.stringify(s))report.failures.push('REPLAY '+role+' '+seed);else report.replays++;
 report.manualVsDelegatedChanged+=Number(JSON.stringify(s.economy)!==JSON.stringify(alt.economy));
 const ending=finalOutcome(s.economy);report.endings[ending]=(report.endings[ending]||0)+1;report.progress[s.economy.progress]=(report.progress[s.economy.progress]||0)+1;
 if(!s.world.terminal||!s.world.mandates.some(m=>m.id==='M-P2'))report.failures.push('F4_HANDOFF '+role+' '+seed);
}
if(report.failures.length||report.complete!==1000||report.replays!==1000||Object.keys(report.progress).length<3||report.manualVsDelegatedChanged<100)throw Error('F5_AUDIT_FAILED: '+JSON.stringify(report));
fs.writeFileSync(new URL('../proofs/F5-audit.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
