"""Two genuine OS processes, five independent credentials, one SQLite journal."""
import pathlib,tempfile,subprocess,os,socket,json,time,urllib.request,urllib.error,concurrent.futures
ROOT=pathlib.Path(__file__).resolve().parent.parent

def free_port():
 with socket.socket() as sock:
  sock.bind(('127.0.0.1',0));return sock.getsockname()[1]

def req(port,token,route,body=None):
 data=json.dumps(body).encode() if body is not None else None
 request=urllib.request.Request(f'http://127.0.0.1:{port}'+route,data=data,method='POST' if body else 'GET',headers={'Authorization':'Bearer '+token,**({'Content-Type':'application/json'} if body else {})})
 try:
  with urllib.request.urlopen(request,timeout=7) as r:return r.status,json.load(r)
 except urllib.error.HTTPError as e:return e.code,json.loads(e.read())

def main():
 with tempfile.TemporaryDirectory(prefix='cie3-multiprocess-') as tmp:
  db=str(pathlib.Path(tmp)/'world.sqlite');cred=str(pathlib.Path(tmp)/'private.json');seed=41
  subprocess.run(['node','scripts/bootstrap.mjs',db,cred,str(seed)],cwd=ROOT,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
  tokens=json.loads(pathlib.Path(cred).read_text())['tokens'];ports=[free_port(),free_port()];workers=[]
  try:
   for port in ports:
    env=dict(os.environ,CIE_DB=db,CIE_PORT=str(port),CIE_HOST='127.0.0.1')
    workers.append(subprocess.Popen(['node','server/cli.mjs'],cwd=ROOT,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL))
   for port in ports:
    for _ in range(60):
     try:
      with urllib.request.urlopen(f'http://127.0.0.1:{port}/api/health',timeout=1):break
     except:time.sleep(.1)
    else:raise Exception('SERVER_START_FAILED')
   plans={'COSTANTINO':{'kind':'EXECUTE','target':'P-ENERGY'},'FINANZIATORE':{'kind':'OFFER_CREDIT','target':'P-PORT'},'PARLAMENTARE':{'kind':'INQUIRE','target':'P-ENERGY'},'PRESIDENTE':{'kind':'CONVENE','target':'P-PORT'},'GIUDICE':{'kind':'STAY','target':'P-ENERGY'}}
   with concurrent.futures.ThreadPoolExecutor(max_workers=7) as ex:
    jobs=[ex.submit(req,ports[i%2],tokens[role],'/api/order',{'key':'MULTI-'+role+'-KEY','expectedRevision':0,'order':order})for i,(role,order) in enumerate(plans.items())]
    outputs=[f.result() for f in jobs]
    assert all(status==200 and data['ok'] for status,data in outputs),outputs
    commit_data={'key':'COMMIT-MULTI-00001','expectedRevision':0}
    jobs=[ex.submit(req,p,tokens['OPERATOR'],'/api/commit',commit_data)for p in ports]
    results=[f.result() for f in jobs]
    assert all(s==200 for s,d in results),results
    assert sorted(bool(d.get('duplicate')) for _,d in results)==[False,True],results
   status1=req(ports[0],tokens['OPERATOR'],'/api/view')[1];status2=req(ports[1],tokens['OPERATOR'],'/api/view')[1]
   assert status1['digest']==status2['digest'] and status1['revision']==1
   views=[req(ports[i%2],tokens[role],'/api/view')for i,role in enumerate(plans)]
   assert all(s==200 and d['phase']=='COMMITTED' for s,d in views)
   for i,(status,data) in enumerate(views):
    serialized=json.dumps(data)
    if list(plans)[i]!='FINANZIATORE': assert 'PRIVATE_FINANCIER_9217_' not in serialized
    if list(plans)[i]!='GIUDICE': assert 'PRIVATE_DRAFT_JUDGMENT_' not in serialized
   report={'schema':'CIE-AC03-MULTIPROCESS-1','pass':True,'serverProcesses':2,'independentRoleTokens':5,'concurrentOrders':5,'concurrentCommits':2,'appliedCommits':1,'duplicateCommits':1,'revision':1,'digestsEqual':True,'serverScopedViews':5,'method':'actual HTTP over localhost using Python urllib, no Chromium'}
   (ROOT/'proofs'/'multiprocess_report.json').write_text(json.dumps(report,indent=2))
   print(json.dumps(report))
  finally:
   for proc in workers:
    proc.terminate()
    try:proc.wait(timeout=5)
    except subprocess.TimeoutExpired:proc.kill();proc.wait(timeout=5)
if __name__=='__main__':main()
