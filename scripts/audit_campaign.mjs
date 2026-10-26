import fs from 'node:fs';
import {f7Initial,f7Save,f7Restore,f7Audit} from '../src/strategy.mjs';
import {campaignView,campaignPlay,ROLE_LABELS,PLAN_IDS} from '../src/campaign_turn.mjs';
const report={schema:'CIE-CP02-AUDIT-1',campaigns:0,roles:{},economicTurns:0,preludeActs:0,projections:0,replayMatches:0,mutations:0,invalidActions:0,outcomes:{}};
for(const role of Object.keys(ROLE_LABELS))for(const seed of [1,41,97]){
 let session=f7Initial({seed,humanRole:role,caseId:'V4/E03'}),q=0,p=0;
 while(true){const m=campaignView(session);if(m.ended)break;const old=f7Audit(session).digest;
  for(const plan of PLAN_IDS){const v=campaignView(session,plan);report.projections++;if(!v.goal.victoryRule||v.role!==role||f7Audit(session).digest!==old)report.mutations++;}
  const id=PLAN_IDS[(q+p+seed)%PLAN_IDS.length],result=campaignPlay(session,id);if(!result.ok)throw Error('CP02_INVALID_'+role+'_'+result.code);
  session=result.session;if(m.phase==='ECONOMIC')q++;else p++;if(q>8||p>80)throw Error('CP02_UNBOUNDED');
 }
 const terminal=campaignView(session);if(q!==8||!terminal.ended||campaignPlay(session).ok)throw Error('CP02_INCOMPLETE');
 report.invalidActions++;const restored=f7Restore(f7Save(session));if(f7Audit(restored).digest!==f7Audit(session).digest)throw Error('CP02_REPLAY');
 report.replayMatches++;report.campaigns++;report.economicTurns+=q;report.preludeActs+=p;report.roles[role]=(report.roles[role]??0)+1;
 const code=terminal.goal.result;report.outcomes[code]=(report.outcomes[code]??0)+1;
}
if(report.mutations||report.campaigns!==15||report.economicTurns!==120)throw Error('CP02_AUDIT_FAILED');
fs.mkdirSync('proofs',{recursive:true});fs.writeFileSync('proofs/cp02-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
