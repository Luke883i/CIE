"""Chromium smoke with exact F3/F4/F5/F6 source modules inlined for container access restrictions."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
def script(path):
 s=(root/path).read_text();s=re.sub(r'^import [^\n]+\n','',s,flags=re.M);s=s.replace('export const ','const ').replace('export function ','function ')
 return s
n3='f3Create,f3Submit,f3SystemTransition,f3Observe,f3NpcChoice,f3Available,f3Validate,f3Audit,f3Digest,f3Word,F3_PEOPLE,F3_STAGES'
n4='f4Start,f4Play,f4Observe,f4Save,f4Restore,f4Audit'
n5='f5Initial,f5Play,f5FastForward,f5Observe,f5Save,f5Restore,f5Audit,ECON_CHOICES,economicValidate'
n6='f6Initial,f6Play,f6FastForward,f6Observe,f6Save,f6Restore,f6Audit,f6Counterfactual,F6_ACTIONS'
combined='const F3=(()=>{'+script('src/institutions.mjs')+';return {'+n3+'};})();\n'
combined+='const F4=(()=>{const {'+n3+'}=F3;'+script('src/judicial.mjs')+';return {'+n4+'};})();\n'
combined+='const F5=(()=>{const {'+n4.replace('f4Audit,','')+'}=F4;const {f3Word,f3Digest,F3_PEOPLE}=F3;'+script('src/economy.mjs')+';return {'+n5+'};})();\n'
combined+='const V9=(()=>{'+script('src/v9_registry.mjs')+';return {V9_CASES,V9_CASE_MAP};})();\n'
combined+='const F6=(()=>{const {f5Initial,f5Play,f5Observe,f5Audit,f5FastForward,economicValidate}=F5;const {f3Digest,f3Audit,f3Word}=F3;const {f4Audit}=F4;const {V9_CASES,V9_CASE_MAP}=V9;'+script('src/reticulum.mjs')+';return {'+n6+'};})();\n'
combined+='(()=>{const {'+n6+'}=F6;const {V9_CASES}=V9;'+script('web/f6.mjs')+'})();'
html=(root/'web/f6.html').read_text();html=re.sub(r'<link rel="stylesheet"[^>]*>','',html);html=re.sub(r'<script type="module"[^>]*></script>','',html)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1480,'height':960},accept_downloads=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(html)
 page.add_style_tag(content=(root/'web/f5.css').read_text()+(root/'web/f6.css').read_text().replace("@import url('./f5.css');",''));page.add_script_tag(content=combined)
 records=[]
 for i,role in enumerate(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']):
  page.locator('#role').select_option(role);page.locator('#seed').fill(str(41+i));page.locator('#new').click()
  steps=0
  while page.locator('#chapter').inner_text()!='RETICOLO V9' and steps<40:
   assert page.locator('#options button').count()>0,(role,steps,errors)
   page.evaluate("document.querySelector('#options button:last-child').click()")
   steps+=1
  assert page.locator('#chapter').inner_text()=='RETICOLO V9',(role,errors)
  assert page.locator('#v9-actions button').count()==3
  if i==0:page.screenshot(path=str(root/'proofs/F6-browser.png'),full_page=True)
  for j in range(9):
   if page.locator('#skip1').is_disabled():break
   page.evaluate("document.querySelector('#options button:first-child').click()")
  assert page.locator('#skip4').is_disabled(),(role,'not terminal',errors)
  with page.expect_download() as dl:page.locator('#export').click()
  replay=dl.value.path();page.locator('#import').set_input_files(replay)
  assert not page.locator('#error').inner_text(),(role,page.locator('#error').inner_text())
  records.append({'role':role,'steps':steps,'terminal':True,'v9Chains':page.locator('.timeline-item').count()})
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(root/'proofs/F6-mobile.png'),full_page=True)
 assert not errors,errors
 report={'ok':True,'browser':'Chromium','fiveRoles':records,'javascriptErrors':errors,'limitation':'inlined offline modules; not a public HTTP deploy proof'}
 (root/'proofs/F6-browser-report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report));browser.close()
