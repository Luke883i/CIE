#!/usr/bin/env python3
"""Native actual HTTP clients, two server processes; not a Chromium network browser test."""
import json,os,pathlib,subprocess,tempfile,time,urllib.request,urllib.error,concurrent.futures,socket
R=pathlib.Path(__file__).resolve().parents[1]
def request(port,path,info=None,body=None):
 headers={'Authorization':'Bearer '+info['token'],'X-CIE-Campaign':info['campaign']} if info else {}
 if body is not None:headers['Content-Type']='application/json'
 rq=urllib.request.Request(f'http://127.0.0.1:{port}{path}',data=None if body is None else json.dumps(body).encode(),headers=headers)
 try:
  with urllib.request.urlopen(rq,timeout=10) as resp:return resp.status,json.load(resp)
 except urllib.error.HTTPError as e:return e.code,json.load(e)
def free_port():
 with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
def main():
 with tempfile.TemporaryDirectory(prefix='ac04-http-') as d:
  db=str(pathlib.Path(d)/'test.sqlite');cred=pathlib.Path(d)/'PRIVATE.json'
  p=subprocess.run(['node','scripts/bootstrap.mjs',db,str(cred),'13'],cwd=R,capture_output=True,text=True,timeout=15);assert p.returncode==0,p.stderr
  credentials=json.loads(cred.read_text());ports=[free_port(),free_port()];servers=[]
  try:
   for port in ports:
    env={**os.environ,'CIE_AC04_DB':db,'CIE_AC04_PORT':str(port)}
    servers.append(subprocess.Popen(['node','server/http.mjs'],cwd=R,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE))
   for port in ports:
    for _ in range(50):
     try:status,health=request(port,'/api/health');assert status==200;break
     except Exception:time.sleep(.1)
    else:raise RuntimeError('SERVER_START_TIMEOUT')
   responses={};
   for role,c in credentials.items():
    status,v=request(ports[0],'/api/view',c);assert status==200,(role,status,v);assert v['role']==role;responses[role]=v
   invalid=dict(credentials['GIUDICE']);invalid['campaign']=credentials['COSTANTINO']['campaign'];assert request(ports[0],'/api/view',invalid)[0]==403
   def do_step(pair):
    i,(role,c)=pair;v=responses[role];o=v['observation'];cmd=o['available'][0] if o['mode']=='INSTITUTIONAL' else {'move':'PUBLIC_HEARING','other':o['strategic']['counterparties'][0],'choice':'DELEGATE','strategy':'COOPERATE'}
    code,payload=request(ports[i%2],'/api/step',c,{'command':cmd,'expectedRevision':0,'key':'AC04-HTTP-'+role+'-001'});return role,code,payload,cmd
   with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:results=list(pool.map(do_step,enumerate(credentials.items())))
   for role,code,payload,cmd in results:
    assert code==200,(role,code,payload);assert payload['revision']==1
    c=credentials[role];a,v=request(ports[1],'/api/view',c);assert a==200 and v['revision']==1
    idcode,_=request(ports[1],'/api/step',c,{'command':cmd,'expectedRevision':0,'key':'AC04-HTTP-'+role+'-001'});assert idcode==200
   summary={'schema':'CIE-AC04-HTTP-E2E-1','status':'PASS_LOCAL','serverProcesses':2,'independentRoleCampaigns':5,'parallelSteps':5,'crossRoleDenied':True,'revisionsEqual':True,'exactlyOncePerCampaign':True,'nativeHTTPClients':True,'nativeChromiumHTTP':'NOT_EXECUTED','sharedFiveHumanWorld':False}
   (R/'proofs').mkdir(parents=True,exist_ok=True);(R/'proofs'/'http_smoke.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary))
  finally:
   for x in servers:
    x.terminate()
    try:x.wait(timeout=5)
    except subprocess.TimeoutExpired:x.kill();x.wait()
if __name__=='__main__':main()
