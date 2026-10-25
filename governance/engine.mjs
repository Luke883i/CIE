/** CIE ICTC governance: observer of evidence, never a gameplay reducer or release authority. */
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {audit as legacyAudit} from '../convergence/assurance/check.mjs';
export const BASE_MAIN='0831c0525d47ed81853441a58e5cf73d2f22d5f1';
const dir=path.dirname(fileURLToPath(import.meta.url));
export const hash=(value)=>createHash('sha256').update(value).digest('hex');
export const load=()=>JSON.parse(readFileSync(path.join(dir,'registry.json'),'utf8'));
const pins=JSON.parse(readFileSync(path.join(dir,'contract_pins.json'),'utf8'));
const canonical=(obj)=>JSON.stringify(obj,Object.keys(obj).sort());
const stable=(obj)=>{const walk=x=>Array.isArray(x)?x.map(walk):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,walk(x[k])])):x;return hash(JSON.stringify(walk(obj)))};
const pinFields=['id','title','dependsOn','gates','weight','impact','uncertainty','falsifier'];
const complete=(wp)=>wp.state==='INTEGRATED' && wp.evidence.length>0;
const allUnique=(items)=>new Set(items).size===items.length;
export function validate(reg, {readAssets=false, root=path.join(dir,'..')}={}){
 const errors=[];const err=(x)=>{if(!errors.includes(x))errors.push(x)};
 if(reg?.schema!=='CIE-ICTC-GOV-1'||reg?.version!=='0.1.0')err('SCHEMA');
 if(reg?.baselineMainSha!==BASE_MAIN)err('BASE_SHA_DRIFT');
 if(reg?.referenceGraph!=='convergence/assurance/holistic_reticulum_ac04.json.gz')err('GRAPH_REFERENCE_DRIFT');
 if(!Array.isArray(reg?.workPackages)||reg.workPackages.length!==14)err('WORKPACKAGE_COVERAGE');
 if(!Array.isArray(reg?.gates)||reg.gates.length!==32)err('GLOBAL_GATE_COVERAGE');
 if(!Array.isArray(reg?.proofs))err('PROOF_REGISTRY');
 if(!Array.isArray(reg?.convergenceHistory))err('HISTORY');
 if(reg?.releaseState!=='BLOCK'||reg?.humanReleaseApproval!==false)err('UNATTESTED_RELEASE_CLAIM');
 if(!reg?.scenarioPlanning||JSON.stringify(reg.scenarioPlanning.deliveredCapacityPerIteration)!=='[1.25,2,3]' || reg.scenarioPlanning.integrationReserve!==6||reg.scenarioPlanning.humanCycles!==4||reg.scenarioPlanning.stabilizationReserve!==8)err('PLANNING_BASELINE_DRIFT');
 const w=Array.isArray(reg?.workPackages)?reg.workPackages:[];
 const gates=Array.isArray(reg?.gates)?reg.gates:[];
 const gIds=gates.map(x=>x.id),wIds=w.map(x=>x.id);
 if(!allUnique(wIds)||!allUnique(gIds))err('DUPLICATE_ID');
 if(wIds.sort().join(',')!==Array.from({length:14},(_,i)=>`ICTC${String(i+1).padStart(2,'0')}`).sort().join(','))err('REQUIRED_WORKPACKAGES_MISSING');
 if(gIds.sort().join(',')!==Array.from({length:32},(_,i)=>`GATE-G${String(i+1).padStart(2,'0')}`).sort().join(','))err('REQUIRED_GATES_MISSING');
 for(const gate of gates){
  if(gate.state!=='OPEN'||(gate.verifiedEvidence?.length??-1)!==0)err('UNPROVEN_GLOBAL_GATE');
  if(!gate.name||gate.name.length<5)err('GATE_SEMANTICS');
  if(stable({id:gate.id,name:gate.name})!==pins.gates[gate.id])err('GATE_SEMANTIC_DRIFT');
 }
 const wMap=new Map(w.map(x=>[x.id,x]));
 let mapped=[];
 for(const item of w){
  if(!item.title||item.title.length<9||!item.falsifier||item.falsifier.length<20)err('MISSING_SEMANTIC_CONTRACT');
  if(stable(Object.fromEntries(pinFields.map(k=>[k,item[k]])))!==pins.workPackages[item.id])err('WORKPACKAGE_SEMANTIC_DRIFT');
  if(!Number.isInteger(item.weight)||item.weight<1||item.weight>15||!Number.isInteger(item.impact)||item.impact<1||item.impact>5||!Number.isInteger(item.uncertainty)||item.uncertainty<1||item.uncertainty>5)err('RISK_SCORE_BOUNDS');
  if(!Array.isArray(item.dependsOn)||!Array.isArray(item.gates)||!Array.isArray(item.evidence))err('WORKPACKAGE_SCHEMA');
  if(!['OPEN','LOCAL_PASS','INTEGRATED'].includes(item.state))err('WORKPACKAGE_STATE');
  if(item.state!=='OPEN'&&!item.evidence?.length)err('UNPROVEN_WORKPACKAGE_PASS');
  if(item.owner==='APPROVED'||item.reviewer==='APPROVED')err('FAKE_REVIEW_APPROVAL');
  if(item.id==='ICTC01'&&item.dependsOn.length!==0)err('ROOT_DEPENDENCY');
  for(const dep of item.dependsOn??[])if(!wMap.has(dep)||dep===item.id)err('INVALID_DEPENDENCY');
  if(!allUnique(item.dependsOn??[])||!allUnique(item.gates??[]))err('DUPLICATE_EDGE');
  for(const id of item.gates??[]){mapped.push(id);if(!gIds.includes(id))err('UNKNOWN_GATE');}
  for(const proofId of item.evidence??[])if(!(reg.proofs??[]).some(p=>p.id===proofId&&p.workPackage===item.id))err('UNRESOLVED_EVIDENCE');
 }
 if(!allUnique(mapped)||mapped.length!==32)err('MISSING_OR_DUPLICATED_GATE_MAPPING');
 const visiting=new Set(),done=new Set();
 const walk=(id)=>{if(visiting.has(id)){err('DEPENDENCY_CYCLE');return;}if(done.has(id))return;visiting.add(id);for(const d of wMap.get(id)?.dependsOn??[])walk(d);visiting.delete(id);done.add(id)};
 for(const id of wIds)walk(id);
 for(const p of reg.proofs??[]){
  if(!p.id||!p.workPackage||!wMap.has(p.workPackage)||p.scope!=='LOCAL'||!p.path||!/^([a-f0-9]{64})$/.test(p.sha256??'')||p.sourceRevision!==reg.baselineMainSha||p.status!=='PASS_LOCAL'||p.humanStudy!==false)err('UNVERIFIABLE_PROOF_CLAIM');
  if(readAssets){const f=path.resolve(root,p.path);if(!f.startsWith(root+path.sep)||!existsSync(f)||hash(readFileSync(f))!==p.sha256)err('MISSING_OR_STALE_PROOF');}
 }
 if(readAssets){
  const file=path.resolve(root,reg.referenceGraph);
  if(!existsSync(file)||hash(readFileSync(file))!==reg.baseGraphSha256)err('BASELINE_GRAPH_CHANGED');
  else {const graph=JSON.parse(gunzipSync(readFileSync(file)));if(graph.nodes.length!==1100||graph.edges.length!==2714)err('BASELINE_GRAPH_SHAPE');}
  if(!legacyAudit().pass)err('INHERITED_ASSURANCE_REGRESSION');
 }
 return {pass:errors.length===0,errors};
}
export function plan(reg){
 const checked=validate(reg);if(!checked.pass)throw Error('INVALID_GOVERNANCE_REGISTRY:'+checked.errors.join(','));
 const work=reg.workPackages;const map=new Map(work.map(x=>[x.id,x]));const memo=new Map();
 const depth=(id)=>{if(memo.has(id))return memo.get(id);const p=map.get(id);const d=1+Math.max(0,...p.dependsOn.map(depth));memo.set(id,d);return d};
 const rows=work.map(x=>({id:x.id,title:x.title,depth:depth(x.id),weight:x.weight,impact:x.impact,uncertainty:x.uncertainty,risk:x.impact*x.uncertainty+x.weight,blockedBy:x.dependsOn.filter(d=>!complete(map.get(d))),state:x.state,gates:x.gates}));
 const ready=rows.filter(x=>x.state==='OPEN'&&!x.blockedBy.length).sort((a,b)=>b.risk-a.risk||a.id.localeCompare(b.id));
 const weightedDebt=rows.filter(x=>x.state!=='INTEGRATED').reduce((s,x)=>s+x.weight,0);
 const p=reg.scenarioPlanning,reserve=p.integrationReserve+p.humanCycles+p.stabilizationReserve;
 return {schema:'CIE-ICTC-PLAN-1',release:'BLOCK',gateClosure:0,globalGates:reg.gates.length,workPackages:rows.length,weightedDebt,criticalDependencyDepth:Math.max(...rows.map(x=>x.depth)),ready:ready.map(x=>x.id),ranked:rows.sort((a,b)=>a.depth-b.depth||b.risk-a.risk||a.id.localeCompare(b.id)),scenarioIterations:p.deliveredCapacityPerIteration.map(rate=>({verifiedWeightedUnitsPerIteration:rate,indicativeIterations:Math.ceil(weightedDebt/rate)+reserve})),notes:['These are ordinal planning capacity assumptions, not throughput measurements.','No PR, mutation audit, or governance file alone certifies any release gate.']};
}
