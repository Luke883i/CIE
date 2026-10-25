import {makeApp} from './http.mjs';
const dbFile=process.env.CIE_DB;
if(!dbFile){console.error('Set CIE_DB=<bootstrap SQLite path>. Run node scripts/bootstrap.mjs first.');process.exit(2)}
const host=process.env.CIE_HOST||'127.0.0.1';const port=Number(process.env.CIE_PORT||8087);
if(!Number.isInteger(port)||port<0||port>65535){console.error('Invalid port');process.exit(2)}
const app=makeApp({dbFile});app.server.listen(port,host,()=>console.log(`CIE AC-03 local server: http://${host}:${app.server.address().port}/`));
for(const event of ['SIGINT','SIGTERM'])process.on(event,()=>app.close().finally(()=>process.exit(0)));
