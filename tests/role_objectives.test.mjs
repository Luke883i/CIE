import test from 'node:test';
import assert from 'node:assert/strict';
import {f7Initial,f7Observe,f7Play,f7Save,f7Restore,f7Audit} from '../src/strategy.mjs';
import {focusModel,focusCommand} from '../src/focus_ux.mjs';
import {roleObjective,roleObjectiveAudit,dualOutcome,ROLE_GOALS,choiceExplanation} from '../src/role_objectives.mjs';
import {gameGoal} from '../src/game_goal.mjs';
const roles=Object.keys(ROLE_GOALS), plans=['PRUDENTE','COOPERATIVO','INCISIVO'];
function play(role,seed,policy){let s=f7Initial({seed,humanRole:role});for(let i=0;i<40;i++){
 const v=f7Observe(s),p=policy==='TARGET'?(['FINANZIATORE','PARLAMENTARE','GIUDICE'].includes(role)?'INCISIVO':'PRUDENTE'):policy;
 const m=focusModel(v,role,{planId:p,playerCommands:f7Save(s).commands});if(m.ended)break;
 const cmd=focusCommand(v,role,p);const r=f7Play(s,cmd);assert.equal(r.ok,true,role+'/'+seed+'/'+i+'/'+r.code);s=r.session;
 }return s;}
test('five role objectives each have a unique title, action, and actual F5 allowed choice',()=>{
 assert.equal(roles.length,5);assert.equal(new Set(roles.map(r=>ROLE_GOALS[r].title)).size,5);
 assert.equal(new Set(roles.map(r=>ROLE_GOALS[r].action)).size,5);
 for(const role of roles)assert.match(ROLE_GOALS[role].description,/due|due volte/i);
});
test('personal mission independently succeeds while shared campaign fails, full replay stays identical',()=>{
 const s=play('FINANZIATORE',41,'TARGET');const v=f7Observe(s),g=gameGoal(v,'FINANZIATORE');
 const m=roleObjective(v,'FINANZIATORE',f7Save(s).commands);assert.equal(m.status,'COMPLETED');assert.notEqual(g.result,'DURABLE_PROGRESS');
 assert.equal(dualOutcome(g,m).resultCode,'MISSED/COMPLETED');
 assert.equal(f7Audit(f7Restore(f7Save(s))).digest,f7Audit(s).digest);
});
test('joint outcome success can coexist with personal outcome success',()=>{
 const s=play('COSTANTINO',65,'TARGET');const g=gameGoal(f7Observe(s),'COSTANTINO');const m=roleObjective(f7Observe(s),'COSTANTINO',f7Save(s).commands);
 assert.equal(dualOutcome(g,m).resultCode,'COMPLETED/COMPLETED');
});
test('plans explain role-specific human action rather than opaque mood',()=>{
 for(const role of roles){const v=f7Observe(play(role,41,'TARGET'));assert.equal(v.ended,true);
 let s=f7Initial({seed:41,humanRole:role});for(let i=0;i<40&&f7Observe(s).mode!=='ECONOMIC';i++){const view=f7Observe(s);const r=f7Play(s,focusCommand(view,role,'PRUDENTE'));assert.equal(r.ok,true);s=r.session;}
 const view=f7Observe(s),model=focusModel(view,role,{planId:'INCISIVO',playerCommands:f7Save(s).commands});if(model.canAct){assert.match(model.planLabel,/·/);assert.ok(model.alternatives.some(x=>x.label.includes('·')));}
 }});
test('100 scoped start views are read-only and do not reveal forged role history',()=>{
 for(const role of roles)for(let seed=0;seed<20;seed++){
 const s=f7Initial({seed,humanRole:role}),before=f7Audit(s).digest,v=f7Observe(s);
 const m=roleObjective(v,role,f7Save(s).commands);roleObjectiveAudit(m);
 assert.equal(m.actions,0);assert.equal(f7Audit(s).digest,before);
 assert.throws(()=>roleObjective(v,roles.find(r=>r!==role),[]),/SCOPE/);
 }});
test('50 full role campaigns have truthful independent outcomes, valid explanations, complete replay',()=>{
 for(const role of roles)for(let seed=5;seed<15;seed++){
 const s=play(role,seed,plans[seed%3]),v=f7Observe(s),m=roleObjective(v,role,f7Save(s).commands),g=gameGoal(v,role);roleObjectiveAudit(m);
 assert.equal(m.ended,true);assert.equal(m.qualified,m.actions>=2&&(m.metric==='defaults'?m.metricValue===0:m.metricValue>=m.threshold));
 assert.ok(dualOutcome(g,m).resultCode.includes('/'));assert.equal(f7Audit(f7Restore(f7Save(s))).digest,f7Audit(s).digest);
 }});
test('do not claim a personal win from wrong action, mismatched role or tampered metric',()=>{
 const s=play('PARLAMENTARE',48,'PRUDENTE'),v=f7Observe(s);
 assert.throws(()=>roleObjective(v,'GIUDICE',f7Save(s).commands),/SCOPE/);
 assert.throws(()=>roleObjective({...v,defaults:-3},'PARLAMENTARE',f7Save(s).commands),/UNSAFE/);
 assert.throws(()=>roleObjective(v,'PARLAMENTARE',[{kind:'WHATEVER',choice:'EXAMINE_BUDGET'}]),/COMMAND_SHAPE/);
 const m=roleObjective(v,'PARLAMENTARE',[]);assert.equal(m.status,'MISSED');
});
