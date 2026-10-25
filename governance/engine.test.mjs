import test from 'node:test';import assert from 'node:assert/strict';
import {load,validate,plan} from './engine.mjs';
import {ATTACKS} from './mutate.mjs';
const original=load();
test('CIE baseline local contract is admissible but release BLOCK',()=>{assert.equal(validate(original,{readAssets:true}).pass,true);const p=plan(original);assert.equal(p.release,'BLOCK');assert.equal(p.globalGates,32);assert.equal(p.ready.length,1);assert.equal(p.ready[0],'ICTC01');assert.equal(p.criticalDependencyDepth>5,true);});
for(const [name,attack] of ATTACKS)test(`governance blocks ${name}`,()=>{const r=structuredClone(original);attack(r);assert.equal(validate(r).pass,false,name);});
test('benign reordering does not invalidate governance',()=>{const r=structuredClone(original);r.workPackages.reverse();r.gates.reverse();assert.equal(validate(r).pass,true);});
test('roadmap recomputes on evidence-backed local integration without making release green',()=>{const r=structuredClone(original);r.proofs.push({id:'TEST-EV',workPackage:'ICTC01',scope:'LOCAL',path:'governance/proofs/test.tmp',sha256:'f'.repeat(64),sourceRevision:r.baselineMainSha,status:'PASS_LOCAL',humanStudy:false});r.workPackages[0].evidence=['TEST-EV'];r.workPackages[0].state='INTEGRATED';const p=plan(r);assert.equal(p.ready.includes('ICTC02'),true);assert.equal(p.release,'BLOCK');});
