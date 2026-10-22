"""Python HTTP static asset routing smoke (not an actual hosted Chromium E2E)."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
from urllib.request import urlopen
import hashlib, json, threading
root=Path(__file__).resolve().parents[1]
assets=['web/f8.html','web/f8.css','web/f8-enhancements.css','web/f8.mjs','src/atlas_ui.mjs','src/atlas.mjs','src/strategy.mjs','src/reticulum.mjs','data/europe-32.mjs','data/europe-32.geojson','assets/illustrations/cie-mandate.svg','assets/illustrations/cie-diplomacy.svg']
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
httpd=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)))
thread=threading.Thread(target=httpd.serve_forever,daemon=True);thread.start()
results=[]
try:
 for f in assets:
  with urlopen(f'http://127.0.0.1:{httpd.server_port}/{f}',timeout=4) as res:
   payload=res.read();assert res.status==200;assert payload==(root/f).read_bytes(),f
   results.append({'path':f,'status':res.status,'sha256':hashlib.sha256(payload).hexdigest()})
finally:httpd.shutdown();thread.join()
result={'ok':True,'mode':'local Python HTTP assets route only, not browser HTTP E2E','routes':results,'total':len(results)}
(root/'proofs/F8-http-routes.json').write_text(json.dumps(result,indent=2)+'\n')
print('HTTP resources:',len(results),'byte-for-byte identical')
