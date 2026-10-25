import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {PersistentWorld} from './store.mjs';
const base=resolve(dirname(fileURLToPath(import.meta.url)),'../web');
const staticPaths={'/':'index.html','/index.html':'index.html','/app.mjs':'app.mjs','/style.css':'style.css'};
const mime={'html':'text/html; charset=utf-8','mjs':'text/javascript; charset=utf-8','css':'text/css; charset=utf-8'};
const maxBytes=8192;
async function parseBody(req){let text='';for await(const chunk of req){text+=chunk.toString('utf8');if(Buffer.byteLength(text)>maxBytes)throw Object.assign(new Error('BODY_TOO_LARGE'),{http:413});}
 try{return JSON.parse(text);}catch{throw Object.assign(new Error('INVALID_JSON'),{http:400});}}
function send(res,status,obj){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(JSON.stringify(obj));}
export function makeApp({dbFile}){
 const store=new PersistentWorld(dbFile);
 const server=createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://localhost');const path=url.pathname;
   if(req.method==='GET'&&path==='/api/health')return send(res,200,{ok:true,service:'CIE-AC03-SPIKE',releaseReady:false});
   if(path.startsWith('/api/')){
    if(url.search) return send(res,400,{ok:false,code:'QUERY_REJECTED'});
    const header=req.headers.authorization;
    const token=typeof header==='string'&&header.startsWith('Bearer ')?header.slice(7):null;
    const role=store.identity(token);
    if(!role)return send(res,401,{ok:false,code:'NOT_AUTHENTICATED'});
    if(req.method==='GET'&&path==='/api/view'){
     if(role==='OPERATOR')return send(res,200,store.operatorStatus());
     return send(res,200,store.getView(role));
    }
    if(req.method!=='POST')return send(res,405,{ok:false,code:'METHOD_NOT_ALLOWED'});
    if(req.headers['content-type']?.split(';')[0]!=='application/json')return send(res,415,{ok:false,code:'JSON_REQUIRED'});
    const body=await parseBody(req);
    if(path==='/api/order')return send(res,200,store.submit(role,body));
    if(path==='/api/commit'){
     if(role!=='OPERATOR')return send(res,403,{ok:false,code:'OPERATOR_REQUIRED'});
     return send(res,200,store.resolve(body));
    }
    if(path==='/api/revoke'){
     if(role!=='OPERATOR')return send(res,403,{ok:false,code:'OPERATOR_REQUIRED'});
     return send(res,200,store.revoke(body?.role,body));
    }
    return send(res,404,{ok:false,code:'UNKNOWN_API_ROUTE'});
   }
   if(req.method!=='GET'||!Object.hasOwn(staticPaths,path))return send(res,404,{ok:false,code:'NOT_FOUND'});
   const file=staticPaths[path];const ext=file.split('.').at(-1);const content=await readFile(resolve(base,file));
   res.writeHead(200,{'Content-Type':mime[ext],'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",'X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Referrer-Policy':'no-referrer'});res.end(content);
  }catch(e){const status=[400,401,403,404,409,413,415,500].includes(e.http)?e.http:409;
   send(res,status,{ok:false,code:e.code||((status===500)?'SERVER_FAULT':'REJECTED')});}
 });
 return {server,store,close:async()=>{await new Promise((r,j)=>server.close(e=>e?j(e):r()));store.close();}};
}
