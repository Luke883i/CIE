import {readFileSync,existsSync} from 'node:fs';import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');const at=(p)=>path.resolve(root,p);
const reg=JSON.parse(readFileSync(at('experience/assurance.json')));
const check=(cond,reason)=>{if(!cond)throw Error('EX01_ASSURANCE_'+reason)};
const gitBlob=(p)=>{const b=readFileSync(at(p));return createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')};
check(reg.schema==='CIE-EX01-ASSURANCE-1','SCHEMA');
check(reg.projectRelease==='BLOCK'&&reg.worldReleaseGates?.total===32&&reg.worldReleaseGates?.certified===0&&reg.worldReleaseGates?.status==='BLOCK','FALSE_RELEASE');
check(gitBlob(reg.baseline.kernelPath)===reg.baseline.kernelGitBlob,'KERNEL_DRIFT');
check(gitBlob(reg.baseline.v3Path)===reg.baseline.v3GitBlob,'V3_DRIFT');
check(reg.microGates?.length===16,'GATE_COUNT');
check(new Set(reg.microGates.map(g=>g.id)).size===16,'DUPLICATE_GATE');
const expected={LOCAL_PASS:13,PARTIAL:1,BLOCK:2},actual={LOCAL_PASS:0,PARTIAL:0,BLOCK:0};
for(const g of reg.microGates){check(Object.hasOwn(actual,g.state),'ILLEGAL_GATE_STATE');actual[g.state]++;check(Object.hasOwn(reg.auditCrosswalk,g.audit),'ORPHAN_AUDIT');if(g.state==='BLOCK')check(g.evidence===null,'FALSE_EVIDENCE');else check(typeof g.evidence==='string'&&existsSync(at(g.evidence)),'MISSING_EVIDENCE');}
for(const s of Object.keys(expected))check(actual[s]===expected[s],'STATUS_CHANGE_'+s);
for(const [audit,a] of Object.entries(reg.auditCrosswalk)){check(['AUDIT-1','AUDIT-2','AUDIT-3'].includes(audit)&&a.proofs.every(p=>existsSync(at(p))),'CROSSWALK_PROOFS');}
check(reg.metrics.syntheticEpisodes===960&&reg.metrics.humanParticipants===0&&reg.metrics.humanFunMeasured===false&&reg.metrics.secureMultiplayer===false,'CLAIM_LAUNDERING');
const aud=JSON.parse(readFileSync(at('experience/proofs/EX01-audit.json')));
check(aud.campaigns===reg.metrics.syntheticEpisodes&&aud.replayFailures===0&&aud.balanceFailures===0&&aud.sourceFailures===0&&aud.globalRelease==='BLOCK','AUDIT_MISMATCH');
console.log(JSON.stringify({pass:true,gates:reg.microGates.length,status:actual,release:'BLOCK',sourcePins:'MATCH',audit1to3:'MAPPED'}));
