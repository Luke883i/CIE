/** AC04 local canonical-F7 HTTP harness. Binds loopback only, NOT production auth. */
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';import {dirname,resolve} from 'node:path';
import {CanonicalLane} from '../src/canonical_lane.mjs';
const base=resolve(dirname(fileURLToPath(import.meta.url)),'../web');
const statics={'/':'index.html','/index.html':'index.html','/app.mjs':'app.mjs','/style.css':'style.css'};
const mime={html:'text/html; charset=utf-8',mjs:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8'};
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
const ret=(res,code,body)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8',...headers});res.end(JSON.stringify(body));};
const codeOf=e=>['ACCESS_DENIED'].includes(e.code)?403: e.code==='INVALID_IDEMPOTENCY_KEY'?400: e.code==='STALE_REVISION'?409:409;
async function bodyJSON(req){let raw='';for await(const chunk of req){raw+=chunk.toString('utf8');if(Buffer.byteLength(raw)>8192)throw Object.assign(new Error('TOO_LARGE'),{code:'TOO_LARGE'});}try{return JSON.parse(raw);}catch{throw Object.assign(new Error('INVALID_JSON'),{code:'INVALID_JSON'});}}
export function startHTTP({file,port=8094,host='127.0.0.1'}){
 const store=new CanonicalLane(file);
 const server=createServer(async(req,res)=>{try{
  const u=new URL(req.url,'http://localhost');if(u.search)return ret(res,400,{ok:false,code:'NO_QUERY'});
  if(u.pathname==='/api/health'&&req.method==='GET')return ret(res,200,{ok:true,service:'AC04-F7-CANONICAL-LANE',releaseReady:false,sharedWorld:false});
  if(u.pathname.startsWith('/api/')){
   const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):'';
   const id=req.headers['x-cie-campaign'];if(typeof id!=='string'||!token)return ret(res,401,{ok:false,code:'CREDENTIALS_REQUIRED'});
   if(u.pathname==='/api/view'&&req.method==='GET')return ret(res,200,store.view(id,token));
   if(u.pathname==='/api/step'&&req.method==='POST'){
    if(req.headers['content-type']?.split(';')[0]!=='application/json')return ret(res,415,{ok:false,code:'JSON_REQUIRED'});
    const b=await bodyJSON(req);return ret(res,200,store.apply(id,token,b));}
   return ret(res,404,{ok:false,code:'NOT_FOUND'});
  }
  if(req.method!=='GET'||!Object.hasOwn(statics,u.pathname))return ret(res,404,{ok:false,code:'NOT_FOUND'});
  const file=statics[u.pathname],buffer=await readFile(resolve(base,file));
  res.writeHead(200,{...headers,'Content-Type':mime[file.split('.').at(-1)],'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"});res.end(buffer);
 }catch(e){ret(res,codeOf(e),{ok:false,code:e.code??'ERROR'});}});
 server.listen(port,host);return {server,store,close:()=>new Promise(resolve=>server.close(()=>{store.close();resolve();}))};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const file=process.env.CIE_AC04_DB;if(!file)throw Error('CIE_AC04_DB required');const port=Number(process.env.CIE_AC04_PORT||8094);
 startHTTP({file,port});console.log(`AC04_LOCAL_ONLY: http://127.0.0.1:${port}`);
}
