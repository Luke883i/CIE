"""Browser Focus UX smoke with inlined local ES modules; not an HTTP deployment test."""
from pathlib import Path
import json, mimetypes
from urllib.parse import urlparse, unquote
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
records=[];errors=[]
import re
base=Path(__file__).resolve().parent/'browser_f10_expert_smoke.py'
text=base.read_text()
start=text.index('def script(path):')
stop=text.index('html=(root/',start)
setup=text[start:stop]
setup=setup.replace("combined+='const F8=(()=>{'+script('src/atlas.mjs')+';return {'+n8+'};})();\n'",'')
setup=setup.replace("combined+='const UI=(()=>{'+script('src/atlas_ui.mjs')+';return {'+nu+'};})();\n'",'')
setup=setup.replace("combined+='const GEO=(()=>{'+script('data/europe-32.mjs')+';return {EUROPE_GEO};})();\n'", "combined+='const GEO=(()=>{'+script('data/europe-32.mjs')+';return {EUROPE_GEO};})();\n'")
setup=setup[:setup.index("combined+='(()=>{const {'+n7+'}")]
exec(setup)
combined+='const C=(()=>{const {decisionModel,validatePlan}=B;const {playerExperience,observableResult}=P;'+script('src/focus_ux.mjs')+';return {focusModel,focusCommand,focusReceipt,focusAudit};})();\n'
combined+='(()=>{const {f7Initial,f7Play,f7Observe,f7FastForward,f7Save,f7Restore,f7Audit}=F7;const {focusModel,focusCommand,focusReceipt,focusAudit}=C;const {EUROPE_GEO}=GEO;'+script('web/focus.mjs')+';})();\n'
html=(root/'web/f10.html').read_text();html=re.sub(r'<link[^>]*rel="stylesheet"[^>]*>','',html);html=re.sub(r'<script[^>]*type="module"[^>]*></script>','',html)
css=(root/'web/focus.css').read_text()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(1440,900),(390,844)]:
  ctx=browser.new_context(viewport={'width':width,'height':height},accept_downloads=True)
  pg=ctx.new_page();pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(html);pg.add_style_tag(content=css);pg.add_script_tag(content=combined)
  assert not errors,errors
  assert pg.locator('#commit').is_visible()
  assert pg.locator('#commit').bounding_box()['y']<height,(width,pg.locator('#commit').bounding_box())
  assert pg.locator('#alternatives').is_hidden()
  assert not pg.locator('#world-details').evaluate('(e)=>e.open')
  assert not pg.locator('#history-details').evaluate('(e)=>e.open')
  assert pg.locator('#commit').count()==1
  assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),width
  pg.screenshot(path=str(root/f'proofs/Focus-{"desktop" if width>500 else "mobile"}.png'),full_page=True)
  for i,role in enumerate(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']):
   pg.locator('#settings-open').click();pg.locator('#role').select_option(role);pg.locator('#seed').fill(str(73+i));pg.locator('#start-new').click();assert not pg.locator('#settings').evaluate('(e)=>e.open')
   before=pg.evaluate('window.__focusAudit.digest()')
   pg.locator('#alternatives-toggle').click();assert pg.locator('.alternative').count()==3
   pg.locator('.alternative').nth(0).click();assert pg.evaluate('window.__focusAudit.digest()')==before
   pg.locator('#alternatives-toggle').click()
   pg.locator('#world-details summary').click();pg.locator('#territory').select_option(index=3);assert pg.evaluate('window.__focusAudit.digest()')==before
   pg.locator('#world-details summary').click()
   turns=0
   while pg.locator('#commit').is_enabled() and pg.locator('#commit').get_attribute('data-action')!='restart' and turns<36:
    pg.locator('#commit').click();turns+=1
   assert turns>=8 and turns<36,(role,turns,errors)
   assert pg.locator('#commit').get_attribute('data-action')=='restart',role
   if not pg.locator('#history-details').evaluate('(e)=>e.open'):pg.locator('#history-details summary').click()
   with pg.expect_download() as d:pg.locator('#export').click()
   pg.locator('#import').set_input_files(d.value.path());assert not pg.locator('#error').inner_text()
   records.append({'viewport':width,'role':role,'turns':turns,'replay':True})
  ctx.close()
 browser.close()
assert not errors,errors
out={'ok':True,'viewportRuns':records,'errors':errors,'oneCTAFirstViewport':True,'optionalDisclosureClosed':True,'inlinedLocalModules':True,'notProven':'human fun, independent accessibility audit, production deploy'}
(root/'proofs/Focus-browser-report.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False))
