import {writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {load,validate,plan} from './engine.mjs';
const reg=load();const audited=validate(reg,{readAssets:true});
const result={audit:audited,plan:audited.pass?plan(reg):null};
console.log(JSON.stringify(result,null,2));
if(process.argv.includes('--write')&&audited.pass){mkdirSync('governance/proofs',{recursive:true});writeFileSync('governance/proofs/plan.json',JSON.stringify(result,null,2)+'\n');}
if(!audited.pass)process.exitCode=1;
