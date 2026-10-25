import {PersistentWorld} from '../server/store.mjs';
const [dbFile,key,phase]=process.argv.slice(2);
if(!dbFile||!key||!['BEFORE_COMMIT','AFTER_COMMIT'].includes(phase))process.exit(2);
const store=new PersistentWorld(dbFile);
store.resolveWithCrash({key,expectedRevision:0},phase);
process.exit(71); // unreachable unless the fault hook failed
