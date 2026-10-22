/** Synthetic view-projection audit; does not measure real users. */
import {writeFileSync} from 'node:fs';
import {f7Initial,f7Observe,f7Audit} from '../src/strategy.mjs';
import {focusModel,focusAudit} from '../src/focus_ux.mjs';
import {gameGoal,auditGameGoal} from '../src/game_goal.mjs';
const roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'];
let checked=0,unchanged=0,unexplained=0;
for(let seed=0;seed<200;seed++)for(const role of roles){
 const w=f7Initial({seed,humanRole:role}),before=f7Audit(w).digest,v=f7Observe(w);
 const model=focusModel(v,role),goal=gameGoal(v,role);
 focusAudit(model);auditGameGoal(goal);
 if(model.metrics.length!==2||model.metrics.map(x=>x.id).join(',')!=='progress,defaults'||!goal.victoryRule.includes('4 punti')||!goal.victoryRule.includes('zero insolvenze'))unexplained++;
 if(f7Audit(w).digest===before)unchanged++;
 checked++;
}
const proof={schema:'CIE-GOAL-AUDIT-1',baseline:'CIE PR11 merged (local verified mirror)',states:checked,observerUnchanged:unchanged,unclearGoalContracts:unexplained,roles,thresholds:'progress >= 4 && defaults === 0 at Q8',scope:'1000 synthetic observation projections, not 1000 people, not 1000 completed campaigns',pass:checked===1000&&unchanged===checked&&unexplained===0};
writeFileSync(new URL('../proofs/GameGoal-1000-audit.json',import.meta.url),JSON.stringify(proof,null,2)+'\n');
if(!proof.pass)throw Error('GOAL_AUDIT_FAILED');
console.log(JSON.stringify(proof));
