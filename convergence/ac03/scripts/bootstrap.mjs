import {initialize} from '../server/store.mjs';
import {writeFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
const [dbFile,credsFile,seedText='41']=process.argv.slice(2);
if(!dbFile||!credsFile){console.error('node scripts/bootstrap.mjs <sqlite.db> <PRIVATE_credentials.json> [seed]');process.exit(2)}
try{await stat(credsFile);throw Error('CREDENTIAL_FILE_EXISTS')}catch(e){if(e.code!=='ENOENT')throw e;}
const tokens=initialize(resolve(dbFile),{seed:Number(seedText)});
await writeFile(resolve(credsFile),JSON.stringify({schema:'CIE-AC03-LOCAL-ONLY',tokens},null,2),{mode:0o600,flag:'wx'});
console.log('Database initialized. Private credentials written to '+resolve(credsFile)+' (0600). DO NOT publish credentials.');
