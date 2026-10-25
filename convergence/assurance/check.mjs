/** AC-05 migration release gate. Verifies requirements linkage, not product quality. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.resolve(root,p));
const sha=(b)=>createHash('sha256').update(b).digest('hex');
const pins=JSON.parse(read('assurance/source_pins.json'));
const graph=JSON.parse(gunzipSync(read('assurance/holistic_reticulum_ac04.json.gz')));
const ac04=JSON.parse(read('assurance/ac04_dod.json'));
const gap=JSON.parse(read('assurance/semantic_gap_matrix.json'));
const srcRoot=path.resolve(root,'..');
export function audit(g=graph,verifyPinned=true){
 const errors=[];
 const fail=(code)=>errors.push(code);
 const nodes=g.nodes??[],edges=g.edges??[];
 const ids=new Map();for(const n of nodes){if(!n.id||ids.has(n.id))fail('DUPLICATE_OR_EMPTY_NODE');ids.set(n.id,n);}
 const gateways=nodes.filter(n=>n.type==='GLOBAL_GATE');const local=nodes.filter(n=>n.type==='MICRO_DOD');
 if(g.release!=='BLOCK'||g.certifiedGlobalGates!==0||g.globalGatesDefined!==32||gateways.length!==32||gateways.some(x=>x.state!=='OPEN'))fail('FALSE_RELEASE_CERTIFICATION');
 if(ids.get('RELEASE-CIE-1.0')?.state!=='BLOCKED')fail('FALSE_RELEASE_STATE');
 if(local.length!==146||nodes.filter(x=>x.type==='LOCAL_DOD').length!==49||nodes.filter(x=>x.type==='CROSS_JUNCTION').length!==24)fail('COVERAGE_MISMATCH');
 for(const e of edges){if(!ids.has(e.from)||!ids.has(e.to))fail('DANGLING_EDGE');if(!e.relation)fail('UNTYPED_EDGE');}
 for(const n of local){
  if(!edges.some(e=>e.from===n.id&&e.relation==='VERIFIED_BY_CHAIN'))fail('UNLINKED_MICRO_DOD');
  if(!edges.some(e=>e.to===n.id&&e.relation==='DRIVES'))fail('UNMOTIVATED_DOD');
  if(!edges.some(e=>e.to===n.id&&e.relation==='MUST_PROVE'))fail('MISSING_EVIDENCE_OBLIGATION');
 }
 for(const n of gateways){if(!edges.some(e=>e.from===n.id&&e.to==='RELEASE-CIE-1.0'&&e.relation==='REQUIRED_FOR'))fail('RELEASE_DEPENDENCY_MISSING');}
 if(verifyPinned){
  if(sha(read('assurance/holistic_reticulum_ac04.json.gz'))!==pins.baselineGraphGzipSha256||sha(gunzipSync(read('assurance/holistic_reticulum_ac04.json.gz')))!==pins.baselineGraphSha256)fail('UNREVIEWED_GRAPH_MUTATION');
  for(const [name,hash] of Object.entries(pins.files)){
   const buf=readFileSync(path.resolve(srcRoot,name));const gitBlob=createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`),buf])).digest('hex');
   if(gitBlob!==hash)fail('CANONICAL_RULE_SOURCE_CHANGED:'+name);
  }
 }
 if(ac04.length!==24||ac04.filter(x=>x.status==='PASS_LOCAL').length!==15||ac04.filter(x=>x.status!=='PASS_LOCAL').length!==9)fail('AC04_STATUS_MISMATCH');
 if(gap.sameSeedMeansSameGameInstance!==false||gap.nonNegotiableBlockingDimensions.length!==6)fail('FALSE_SHARED_WORLD_CLAIM');
 return {pass:errors.length===0,errors:[...new Set(errors)],nodes:nodes.length,edges:edges.length,localDoD:local.length,localAC04Pass:15,globalCertified:0,release:'BLOCK',scope:'STRUCTURAL_AND_LOCAL_ONLY'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=audit();console.log(JSON.stringify(result));if(!result.pass)process.exitCode=1;
}
