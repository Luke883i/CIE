import fs from 'node:fs';
import {f7Initial,f7Observe,f7Play,f7Audit,f7Save,f7Restore} from '../src/strategy.mjs';
import {focusModel,focusCommand} from '../src/focus_ux.mjs';
import {roleObjective,roleObjectiveAudit,dualOutcome,ROLE_GOALS} from '../src/role_objectives.mjs';
import {gameGoal} from '../src/game_goal.mjs';
const roles=Object.keys(ROLE_GOALS),policies=['PRUDENTE','COOPERATIVO','INCISIVO'];
const tally={},rows=[];let projections=0, fullGames=0, replay=0, nonMutations=0, legal=0;
for(const role of roles){
 for(let seed=0;seed<200;seed++){const s=f7Initial({seed,humanRole:role}),before=f7Audit(s).digest,v=f7Observe(s);
  const m=roleObjective(v,role,f7Save(s).commands);roleObjectiveAudit(m);
  const fm=focusModel(v,role,{playerCommands:f7Save(s).commands});if(!fm.personal.title||!fm.personal.description||!fm.dual)throw Error('FOCUS_UNEXPLAINED');
  if(f7Audit(s).digest!==before)throw Error('PROJECTION_MUTATED');nonMutations++;projections++;
 }
 for(let seed=0;seed<40;seed++){
  let s=f7Initial({seed:seed+80,humanRole:role});const policy=policies[seed%3];
  for(let i=0;i<45;i++){
   const v=f7Observe(s),log=f7Save(s).commands;
   const m=focusModel(v,role,{planId:policy,playerCommands:log});if(m.ended)break;
   const choice=focusCommand(v,role,policy);const r=f7Play(s,choice);if(!r.ok)throw Error('ILLEGAL_'+role+'_'+r.code);
   s=r.session;legal++;
  }
  const v=f7Observe(s),obj=roleObjective(v,role,f7Save(s).commands),g=gameGoal(v,role);
  if(!obj.ended)throw Error('INCOMPLETE_GAME');roleObjectiveAudit(obj);
  const outcome=dualOutcome(g,obj).resultCode;tally[outcome]=(tally[outcome]??0)+1;
  if(f7Audit(f7Restore(f7Save(s))).digest!==f7Audit(s).digest)throw Error('REPLAY_MISMATCH');replay++;fullGames++;
  rows.push({role,seed:seed+80,policy,global:g.result,personal:obj.status,actions:obj.actions,metric:obj.metricValue,dual:outcome});
 }
}
if(projections!==1000||fullGames!==200||replay!==200||nonMutations!==1000)throw Error('AUDIT_COUNT');
for(const role of roles)if(!rows.some(r=>r.role===role&&r.personal==='COMPLETED'))throw Error('UNREACHABLE_PERSONAL_MISSION_'+role);
if(!tally['MISSED/COMPLETED']||!tally['COMPLETED/MISSED'])throw Error('INDEPENDENCE_NOT_OBSERVED');
const report={schema:'CIE-ROLE-GOALS-AUDIT-1',base:'178789e21bf7548352b58088e39ab881a0a58d2a',roles,projections,nonMutations,fullGames,replay,legalActions:legal,dualOutcomeDistribution:tally,personalCompletion: Object.fromEntries(roles.map(role=>[role,rows.filter(r=>r.role===role&&r.personal==='COMPLETED').length])),rows,epistemic:'Deterministic artificial campaigns, not human-player enjoyment or externally calibrated political model.'};
fs.mkdirSync('proofs',{recursive:true});fs.writeFileSync('proofs/RoleGoals-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,rows:undefined}));
