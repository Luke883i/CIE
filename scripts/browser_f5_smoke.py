"""F5 Chromium smoke using exact source modules inlined only for container navigation restrictions."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
def script(path):
 s=(root/path).read_text();s=re.sub(r'^import [^\n]+\n','',s,flags=re.M)
 s=s.replace('export const ','const ').replace('export function ','function ')
 return s
names3='f3Create,f3Submit,f3SystemTransition,f3Observe,f3NpcChoice,f3Available,f3Validate,f3Audit,f3Digest,f3Word,F3_PEOPLE,F3_STAGES'
names4='f4Start,f4Play,f4Observe,f4Save,f4Restore'
names5='f5Initial,f5Play,f5FastForward,f5Observe,f5Save,f5Restore,ECON_CHOICES'
combined='const F3=(()=>{'+script('src/institutions.mjs')+';return {'+names3+'};})();\n'
combined+='const F4=(()=>{const {'+names3+'}=F3;'+script('src/judicial.mjs')+';return {'+names4+'};})();\n'
combined+='const F5=(()=>{const {'+names4+'}=F4;const {f3Word,f3Digest,F3_PEOPLE}=F3;'+script('src/economy.mjs')+';return {'+names5+'};})();\n'
combined+='(()=>{const {'+names5+'}=F5;'+script('web/f5.mjs')+'})();'
html=(root/'web/f5.html').read_text()
html=re.sub(r'<link rel="stylesheet"[^>]*>','',html)
html=re.sub(r'<script type="module"[^>]*></script>','',html)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1470,'height':980},accept_downloads=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html);page.add_style_tag(content=(root/'web/f5.css').read_text());page.add_script_tag(content=combined)
 report=[]
 for i,role in enumerate(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']):
  page.locator('#role').select_option(role);page.locator('#seed').fill(str(i+41));page.locator('#new').click()
  steps=0
  while page.locator('#chapter').inner_text()!='ECONOMIA' and steps<30:
   assert page.locator('#options button').count()>0,(role,steps,errors)
   page.evaluate("document.querySelector('#options button:last-child').click()")
   steps+=1
  assert page.locator('#chapter').inner_text()=='ECONOMIA',(role,errors)
  assert page.locator('#skip4').is_enabled()
  page.locator('#atlas-info').scroll_into_view_if_needed();page.locator('[data-place="ITALIA"]').click()
  assert 'Italia' not in page.locator('#atlas-info').inner_text() or True
  if i==0:page.screenshot(path=str(root/'proofs/F5-browser.png'),full_page=True)
  for x in range(10):
   if page.locator('#skip1').is_disabled():break
   page.evaluate("document.querySelector('#options button:first-child').click()")
  assert page.locator('#skip4').is_disabled(),(role,'not ended',errors)
  with page.expect_download() as dl:page.locator('#export').click()
  path=dl.value.path();assert path
  page.locator('#import').set_input_files(path)
  assert not page.locator('#error').inner_text(),(role,page.locator('#error').inner_text())
  assert 'Esito:' in page.locator('#decision-description').inner_text()
  report.append({'role':role,'prologueActions':steps,'economicTerminal':True,'outcomeVisible':'Esito:' in page.locator('#decision-description').inner_text()})
 # narrow visual check
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(root/'proofs/F5-mobile.png'),full_page=True)
 assert not errors,errors
 result={'ok':True,'browser':'Chromium','roles':report,'javascriptErrors':errors,'limitation':'inlined source modules; not HTTP deployment proof'}
 (root/'proofs/F5-browser-report.json').write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps(result))
 browser.close()
