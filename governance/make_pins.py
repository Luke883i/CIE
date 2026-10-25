import json,hashlib
from pathlib import Path
p=Path(__file__).resolve().parent
r=json.loads((p/'registry.json').read_text())
snap=lambda o:hashlib.sha256(json.dumps(o,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
fields=('id','title','dependsOn','gates','weight','impact','uncertainty','falsifier')
pins={'schema':'CIE-ICTC-CONTRACT-PINS-1','workPackages':{x['id']:snap({k:x[k] for k in fields}) for x in r['workPackages']},'gates':{x['id']:snap({'id':x['id'],'name':x['name']}) for x in r['gates']}}
(p/'contract_pins.json').write_text(json.dumps(pins,indent=2)+'\n')
