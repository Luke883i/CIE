"""F8 visual/E2E Chromium smoke. Inlining only to bypass container localhost policy.
Production uses normal ES module imports, bundled geometry and zero runtime fetches.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,re,base64
root=Path(__file__).resolve().parents[1]
def script(path):
 s=(root/path).read_text(encoding='utf8');s=re.sub(r'^import [^\n]+\n','',s,flags=re.M);return s.replace('export const ','const ').replace('export function ','function ')
n3='f3Create,f3Submit,f3SystemTransition,f3Observe,f3NpcChoice,f3Available,f3Validate,f3Audit,f3Digest,f3Word,F3_PEOPLE,F3_STAGES'
n4='f4Start,f4Play,f4Observe,f4Save,f4Restore,f4Audit'
n5='f5Initial,f5Play,f5FastForward,f5Observe,f5Save,f5Restore,f5Audit,ECON_CHOICES,ECON_ROLES,economicValidate'
n6='f6Initial,f6Play,f6FastForward,f6Observe,f6Save,f6Restore,f6Audit,f6Counterfactual,F6_ACTIONS'
n7='f7Initial,f7Play,f7FastForward,f7Observe,f7Save,f7Restore,f7Audit,f7Counterfactual,F7_MOVES'
n8='atlasModel,geometryIndex,clampZoom,ATLAS_LENSES,ATLAS_ROLES'
nu='commandCatalog,matchCommands,togglePinned,uiSnapshot'
combined='const F3=(()=>{'+script('src/institutions.mjs')+';return {'+n3+'};})();\n'
combined+='const F4=(()=>{const {'+n3+'}=F3;'+script('src/judicial.mjs')+';return {'+n4+'};})();\n'
combined+='const F5=(()=>{const {'+n4.replace('f4Audit,','')+'}=F4;const {f3Word,f3Digest,F3_PEOPLE}=F3;'+script('src/economy.mjs')+';return {'+n5+'};})();\n'
combined+='const V9=(()=>{'+script('src/v9_registry.mjs')+';return {V9_CASES,V9_CASE_MAP};})();\n'
combined+='const F6=(()=>{const {f5Initial,f5Play,f5Observe,f5Audit,f5FastForward,economicValidate}=F5;const {f3Digest,f3Audit,f3Word}=F3;const {f4Audit}=F4;const {V9_CASES,V9_CASE_MAP}=V9;'+script('src/reticulum.mjs')+';return {'+n6+'};})();\n'
combined+='const F7=(()=>{const {f6Initial,f6Play,f6Observe,f6Audit,f6Save,F6_ACTIONS}=F6;const {f3Digest,f3Word}=F3;const {ECON_CHOICES,ECON_ROLES,economicValidate}=F5;'+script('src/strategy.mjs')+';return {'+n7+'};})();\n'
combined+='const F8=(()=>{'+script('src/atlas.mjs')+';return {'+n8+'};})();\n'
combined+='const UI=(()=>{'+script('src/atlas_ui.mjs')+';return {'+nu+'};})();\n'
combined+='const GEO=(()=>{'+script('data/europe-32.mjs')+';return {EUROPE_GEO};})();\n'
combined+='(()=>{const {'+n7+'}=F7;const {'+n8+'}=F8;const {'+nu+'}=UI;const {F6_ACTIONS}=F6;const {V9_CASES}=V9;const {EUROPE_GEO}=GEO;'+script('web/f8.mjs')+';window.__f8TestDigest=()=>f7Audit(session).digest;window.__f8World=()=>f7Observe(session).worldId;})();'
html=(root/'web/f8.html').read_text();
for asset in ['cie-mandate.svg','cie-diplomacy.svg']:
 illustration=base64.b64encode((root/'assets/illustrations'/asset).read_bytes()).decode('ascii')
 html=html.replace('../assets/illustrations/'+asset,'data:image/svg+xml;base64,'+illustration)
html=re.sub(r'<link rel="stylesheet"[^>]*>','',html);html=re.sub(r'<script type="module"[^>]*></script>','',html)
css=''.join((root/'web'/f).read_text().replace("@import url('./f5.css');",'').replace("@import url('./f6.css');",'').replace("@import url('./f7.css');",'').replace("@import url('./f8-enhancements.css');",'') for f in ['f5.css','f6.css','f7.css','f8.css','f8-enhancements.css'])
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1700,'height':1000},accept_downloads=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)+' ## '+str(e.stack)))
 page.set_content(html);page.add_style_tag(content=css);page.add_script_tag(content=combined)
 assert not errors,errors
 assert page.locator('[data-country]').count()==32,page.locator('#geo-title').inner_text()
 assert page.locator('img[alt]').count()==2 and page.evaluate('Array.from(document.querySelectorAll("img[alt]")).every(x=>x.complete && x.naturalWidth>0)'),'illustrations failed to render'
 records=[]
 for i,role in enumerate(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']):
  page.locator('#role').select_option(role);page.locator('#seed').fill(str(41+i));page.locator('#new').click()
  before=page.evaluate('window.__f8TestDigest()')
  page.locator('[data-lens="ISTITUZIONI"]').click();assert page.locator('.institution-pin').count()==5
  page.locator('[data-lens="RELAZIONI"]').click();assert page.locator('.geo-edge').count()>=2
  page.locator('#geo-search').fill('Francia');assert page.locator('#geo-list option').count()==1
  page.locator('#geo-list').select_option('FRA');assert page.locator('#geo-title').inner_text()=='Francia'
  page.locator('#geo-search').fill('')
  page.locator('#zoom-in').click();assert 'scale(1.4)' in page.locator('#map-viewport').get_attribute('transform')
  page.locator('#pan-left').click();assert 'translate(505 252)' in page.locator('#map-viewport').get_attribute('transform')
  page.locator('#zoom-reset').click()
  assert page.evaluate('window.__f8TestDigest()')==before,'map changed world state'
  page.locator('[data-country="ITA"]').focus();page.keyboard.press('Enter');assert page.locator('#geo-title').inner_text()=='Italia'
  assert page.evaluate('window.__f8TestDigest()')==before,'keyboard changed state'
  # F8.1 interaction contract: palette, bookmark and navigation do not alter the game.
  page.keyboard.press('Control+k');assert page.locator('#command-palette').evaluate('(x)=>x.open')
  page.locator('#command-search').fill('germania')
  assert page.locator('#command-results .command-result').count()==1
  page.locator('#command-search').press('Enter');assert page.locator('#geo-title').inner_text()=='Germania'
  assert not page.locator('#command-palette').evaluate('(x)=>x.open')
  page.locator('#bookmark').click();assert page.locator('#bookmark').get_attribute('aria-pressed')=='true'
  assert page.locator('.pin-chip').count()==1
  page.locator('[data-country="ITA"]').click();page.locator('#bookmark').click();assert page.locator('.pin-chip').count()==2
  page.locator('.pin-chip').first.click();assert page.locator('#geo-title').inner_text()=='Germania'
  page.locator('#open-command').click();page.locator('#command-search').fill('Relazioni');
  page.locator('#command-search').press('Enter');assert page.locator('[data-lens="RELAZIONI"]').get_attribute('aria-pressed')=='true'
  assert page.evaluate('window.__f8TestDigest()')==before,'palette or bookmarks changed state'
  page.locator('[data-jump="decision"]').click();assert page.locator('#decision').is_visible()
  page.locator('#geo-search').fill('');page.locator('[data-country="ITA"]').click()
  assert page.evaluate('window.__f8TestDigest()')==before,'quick jump changed world'
  if i==0:page.screenshot(path=str(root/'proofs/F8-spotlight.png'),full_page=False)
  steps=0
  while page.locator('#chapter').inner_text()!='NEGOZIATI' and steps<40:
   assert page.locator('#options button').count()>0,(role,steps,errors)
   page.evaluate("document.querySelector('#options button:last-child').click()")
   steps+=1
  assert page.locator('#chapter').inner_text()=='NEGOZIATI',(role,errors)
  if i==0:page.screenshot(path=str(root/'proofs/F8-desktop.png'),full_page=True)
  for j in range(9):
   if page.locator('#skip1').is_disabled():break
   page.evaluate("document.querySelector('#options button:first-child').click()")
  assert page.locator('#skip4').is_disabled(),(role,'not terminal',errors)
  with page.expect_download() as dl:page.locator('#export').click()
  page.locator('#import').set_input_files(dl.value.path());assert not page.locator('#error').inner_text()
  records.append({'role':role,'institutionalSteps':steps,'endReached':True,'mapSelected':'ITA','geometries':32})
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 2'), 'mobile horizontal overflow';page.screenshot(path=str(root/'proofs/F8-mobile.png'),full_page=True)
 assert not errors,errors
 result={'ok':True,'browser':'Chromium','fiveRoles':records,'svgCountries':32,'uiInteractions':['country search','keyboard selection','lens','zoom','command palette ctrl+k','bookmarks','quick-jump','terminal game','replay'],'javascriptErrors':errors,'limitation':'inlined exact offline modules because container Chromium blocks 127.0.0.1; no hosted HTTP smoke claim'}
 (root/'proofs/F8-browser-report.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
 print(json.dumps(result,ensure_ascii=False));browser.close()
