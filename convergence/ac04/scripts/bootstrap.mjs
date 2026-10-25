import {initialize} from '../src/canonical_lane.mjs';
import {writeFileSync,chmodSync} from 'node:fs';
const [dbfile,credentialPath,rawSeed='41']=process.argv.slice(2);if(!dbfile||!credentialPath)throw Error('Usage: node scripts/bootstrap.mjs DBFILE PRIVATE_TOKENS.json [SEED]');
const obj=initialize(dbfile,{seed:Number(rawSeed)});writeFileSync(credentialPath,JSON.stringify(obj,null,2),{flag:'wx',mode:0o600});chmodSync(credentialPath,0o600);console.log('Created 5 independent F7 campaigns; no 5-human shared state. Credentials saved locally.');
