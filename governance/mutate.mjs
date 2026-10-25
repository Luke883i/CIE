/** 100k deterministic semantic governance mutations: controlled adversarial coverage, NOT 100k game episodes. */
import {writeFileSync,mkdirSync} from 'node:fs';
import {load,validate,hash} from './engine.mjs';
const base=load();
export const ATTACKS=[
 ['false_release',r=>{r.releaseState='READY'}],
 ['self_approval',r=>{r.humanReleaseApproval=true}],
 ['global_false_pass',r=>{r.gates[0].state='PASS'}],
 ['global_forged_evidence',r=>{r.gates[1].verifiedEvidence=['faked']}],
 ['missing_global_gate',r=>{r.gates.pop()}],
 ['duplicate_global_gate',r=>{r.gates[2]=structuredClone(r.gates[1])}],
 ['semantic_gate_rewrite',r=>{r.gates[3].name='Suddenly all green without review'}],
 ['semantic_work_rewrite',r=>{r.workPackages[4].falsifier='unvalidated narrative pass without direct behavioral evidence'}],
 ['missing_workpackage',r=>{r.workPackages.pop()}],
 ['duplicate_workpackage',r=>{r.workPackages[2].id=r.workPackages[0].id}],
 ['missing_falsifier',r=>{r.workPackages[3].falsifier=''}],
 ['invalid_dependency',r=>{r.workPackages[5].dependsOn=['UNKNOWN']}],
 ['cyclic_dependency',r=>{r.workPackages[0].dependsOn=['ICTC14']}],
 ['drop_gate_mapping',r=>{r.workPackages[9].gates.pop()}],
 ['duplicate_gate_mapping',r=>{r.workPackages[8].gates.push('GATE-G01')}],
 ['invalid_weight',r=>{r.workPackages[3].weight=-7}],
 ['local_fake_pass',r=>{r.workPackages[1].state='INTEGRATED'}],
 ['orphan_proof_reference',r=>{r.workPackages[6].evidence.push('FAKE-EV')}],
 ['fabricated_human_study',r=>{r.proofs.push({id:'LIE',workPackage:'ICTC13',scope:'GLOBAL',humanStudy:true,status:'PASS',sha256:'0'.repeat(64)})}],
 ['baseline_sha_rewrite',r=>{r.baselineMainSha='0'.repeat(40)}]
];
function mutate(r,mode,i){
 const out=structuredClone(r);
 if(mode==='benign'){
  const shift=i%out.workPackages.length;
  out.workPackages=out.workPackages.slice(shift).concat(out.workPackages.slice(0,shift));
  if(i%2===0)out.gates.reverse();
  if(i%3===0)out.convergenceHistory.push({kind:'DRAFT_NOTE',sequence:i,executed:false});
  return out;
 }
 ATTACKS[mode][1](out);
 // Sample variety without weakening the test: order of independent records varies per seed.
 if(i%3===0)out.workPackages.reverse();
 if(i%7===0)out.gates.reverse();
 return out;
}
export function run(count=100000){
 if(!Number.isSafeInteger(count)||count<100||count%(ATTACKS.length+5)!==0)throw Error('COUNT_REQUIRES_25_WAY_BALANCE');
 const per=count/(ATTACKS.length+5), classes=[];
 let detections=0,misses=0,falsePositives=0,benignAccepted=0;
 for(let mode=0;mode<ATTACKS.length;mode++){
  let detected=0;
  for(let i=0;i<per;i++){
   const validation=validate(mutate(base,mode,i));if(!validation.pass){detected++;detections++;}else misses++;
  }
  classes.push({class:ATTACKS[mode][0],tested:per,detected});
 }
 for(let i=0;i<per*5;i++){
  const validation=validate(mutate(base,'benign',i));if(validation.pass)benignAccepted++;else falsePositives++;
 }
 const report={schema:'CIE-ICTC-MUTATION-AUDIT-1',seed:243071,determinism:'round-robin 20 attack classes x 4k + 20k benign variants (default); no random inputs',total:count,adversarial:per*ATTACKS.length,benign:per*5,detected:detections,missed:misses,falsePositives,benignAccepted,classes,pass:misses===0&&falsePositives===0&&detections===per*ATTACKS.length,scope:'registry semantics and integrity only, not gameplay or human efficacy',baselineSha256:hash(JSON.stringify(base))};
 return report;
}
if(import.meta.url===`file://${process.argv[1]}`){
 const count=Number(process.argv[2]||100000);const start=performance.now();const result=run(count);const elapsedMs=Math.round(performance.now()-start);console.log(JSON.stringify({...result,benchmarkElapsedMs:elapsedMs},null,2));
 if(process.argv.includes('--write')){mkdirSync('governance/proofs',{recursive:true});writeFileSync('governance/proofs/mutation_audit.json',JSON.stringify(result,null,2)+'\n');}
 if(!result.pass)process.exitCode=1;
}
