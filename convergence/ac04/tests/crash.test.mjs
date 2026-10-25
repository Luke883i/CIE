import test from 'node:test';import assert from 'node:assert/strict';import {mkdtempSync,rmSync} from 'node:fs';import path from 'node:path';import {tmpdir} from 'node:os';import {spawnSync} from 'node:child_process';
import {initialize,CanonicalLane} from '../src/canonical_lane.mjs';
function setup(){const dir=mkdtempSync(path.join(tmpdir(),'cie-ac04-kill-'));const file=path.join(dir,'data.sqlite');const c=initialize(file);return {dir,file,c:c.COSTANTINO,done:()=>rmSync(dir,{recursive:true,force:true})};}
function command(v){return v.mode==='INSTITUTIONAL'?v.available[0]:{move:'PUBLIC_HEARING',other:v.strategic.counterparties[0],choice:'DELEGATE',strategy:'COOPERATE'};}
for(const phase of ['BEFORE','AFTER'])test(`SIGKILL ${phase} durable commit recovers with correct idempotency`,()=>{
 const x=setup();try{let s=new CanonicalLane(x.file),v=s.view(x.c.campaign,x.c.token);const cmd=command(v.observation),key=`CRASH-KEY-${phase}-001`;s.close();
 const proc=spawnSync(process.execPath,['--disable-warning=ExperimentalWarning','scripts/crash_worker.mjs',x.file,x.c.campaign,x.c.token,phase,key],{cwd:path.join(import.meta.dirname,'..'),timeout:20000});assert.equal(proc.signal,'SIGKILL');s=new CanonicalLane(x.file);
 assert.equal(s.audit(x.c.campaign,x.c.token).revision,phase==='BEFORE'?0:1);
 const r=s.apply(x.c.campaign,x.c.token,{command:cmd,expectedRevision:0,key});assert.equal(Boolean(r.duplicate),phase==='AFTER');assert.equal(s.audit(x.c.campaign,x.c.token).revision,1);s.close();
 }finally{x.done();}
});
