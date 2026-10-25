/** Fail closed if a migrated software/contract artifact silently drifts. */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const m=JSON.parse(readFileSync(path.join(root,'convergence/migration_manifest.json')));
const errors=[];
for(const e of m.softwareAndContracts){
 try{const buf=readFileSync(path.join(root,e.path));const d=createHash('sha256').update(buf).digest('hex');if(d!==e.sha256||buf.length!==e.bytes)errors.push(e.path+':HASH_DRIFT');}
 catch{errors.push(e.path+':MISSING');}
}
if(m.release!=='BLOCK'||m.certifiedGlobalGates!==0||m.runtimeUnified!==false||m.fullBinaryBundleEquivalence!==false)errors.push('FALSE_ASSURANCE_CLAIM');
console.log(JSON.stringify({pass:errors.length===0,checked:m.softwareAndContracts.length,errors:errors.slice(0,12),release:m.release}));if(errors.length)process.exitCode=1;
