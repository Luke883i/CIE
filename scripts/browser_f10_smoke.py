"""F10 offline browser audit. Uses exact bundled module source inlined because Chromium's
container policy blocks localhost navigation; does not certify production HTTP hosting."""
from pathlib import Path
import json, re, base64
from playwright.sync_api import sync_playwright
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
nb='UX_RULESET,UX_PLANS,decisionModel,validatePlan,deltaForKnownFacts,cognitiveContract,roleMission,primaryActionFor,assertStrategyPermission'
combined='const F3=(()=>{'+script('src/institutions.mjs')+';return {'+n3+'};})();\n'
combined+='const F4=(()=>{const {'+n3+'}=F3;'+script('src/judicial.mjs')+';return {'+n4+'};})();\n'
combined+='const F5=(()=>{const {'+n4.replace('f4Audit,','')+'}=F4;const {f3Word,f3Digest,F3_PEOPLE}=F3;'+script('src/economy.mjs')+';return {'+n5+'};})();\n'
combined+='const V9=(()=>{'+script('src/v9_registry.mjs')+';return {V9_CASES,V9_CASE_MAP};})();\n'
combined+='const F6=(()=>{const {f5Initial,f5Play,f5Observe,f5Audit,f5FastForward,economicValidate}=F5;const {f3Digest,f3Audit,f3Word}=F3;const {f4Audit}=F4;const {V9_CASES,V9_CASE_MAP}=V9;'+script('src/reticulum.mjs')+';return {'+n6+'};})();\n'
combined+='const F7=(()=>{const {f6Initial,f6Play,f6Observe,f6Audit,f6Save,F6_ACTIONS}=F6;const {f3Digest,f3Word}=F3;const {ECON_CHOICES,ECON_ROLES,economicValidate}=F5;'+script('src/strategy.mjs')+';return {'+n7+'};})();\n'
combined+='const F8=(()=>{'+script('src/atlas.mjs')+';return {'+n8+'};})();\n'
combined+='const UI=(()=>{'+script('src/atlas_ui.mjs')+';return {'+nu+'};})();\n'
combined+='const B=(()=>{'+script('src/gameplay_ux.mjs')+';return {'+nb+'};})();\n'
combined+='const P=(()=>{const {decisionModel,roleMission,deltaForKnownFacts}=B;'+script('src/player_experience.mjs')+';return {playerExperience,observableResult,auditExperience};})();\n'
combined+='const GEO=(()=>{'+script('data/europe-32.mjs')+';return {EUROPE_GEO};})();\n'
combined+='(()=>{const {'+n7+'}=F7;const {'+n8+'}=F8;const {'+nu+'}=UI;const {'+nb+'}=B;const {F6_ACTIONS}=F6;const {V9_CASES}=V9;const {EUROPE_GEO}=GEO;const {playerExperience,observableResult,auditExperience}=P;'+script('web/f10.mjs')+';window.__f8bisDigest=()=>F7.f7Audit(session).digest;window.__f8bisView=()=>F7.f7Observe(session);})();'
html=(root/'web/f10.html').read_text()
for asset in ['cie-mandate.svg','cie-diplomacy.svg']:
 src=root/'assets/illustrations'/asset
 if src.exists():html=html.replace('../assets/illustrations/'+asset,'data:image/svg+xml;base64,'+base64.b64encode(src.read_bytes()).decode('ascii'))
html=re.sub(r'<link rel="stylesheet"[^>]*>','',html);html=re.sub(r'<script[^>]*type="module"[^>]*></script>','',html)
css=''.join((root/'web'/f).read_text().replace("@import url('./f5.css');",'').replace("@import url('./f6.css');",'').replace("@import url('./f7.css');",'').replace("@import url('./f8-enhancements.css');",'') for f in ['f5.css','f6.css','f7.css','f8.css','f8-enhancements.css','f8bis.css','f10.css'])
records=[];errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1500,'height':960},accept_downloads=True)
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html);page.add_style_tag(content=css);page.add_script_tag(content=combined)
 assert not errors, errors
 assert page.locator('#exp-scene').count()==1
 assert page.locator('.chapter-dot').count()==8
 assert page.locator('#hero-commit').count()==1
 assert page.locator('.hero-plan').count()==3
 assert page.locator('.hero-plan[aria-checked="true"]').count()==1
 assert not page.locator('#advanced-tactics').evaluate('(e)=>e.open')
 assert page.locator('#hero-commit').is_visible()
 assert page.locator('[data-country]').count()==32
 for i,role in enumerate(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']):
  page.locator('#role').select_option(role);page.locator('#seed').fill(str(91+i));page.locator('#new').click()
  before=page.evaluate('window.__f8bisDigest()')
  page.locator('[data-plan="PRUDENTE"]').click();page.locator('[data-plan="INCISIVO"]').click();page.locator('[data-plan="COOPERATIVO"]').click()
  assert page.evaluate('window.__f8bisDigest()')==before,'Plan preview mutated shared world'
  assert page.locator('#exp-preview').inner_text().strip()
  page.locator('#hero-details').click();assert page.locator('#advanced-tactics').evaluate('(e)=>e.open')
  page.locator('#hero-details').click();assert not page.locator('#advanced-tactics').evaluate('(e)=>e.open')
  page.locator('[data-lens="RELAZIONI"]').click();assert page.evaluate('window.__f8bisDigest()')==before
  page.locator('[data-country="ITA"]').click();page.locator('#bookmark').click();assert page.evaluate('window.__f8bisDigest()')==before
  steps=0
  while not page.locator('#skip1').is_enabled() and steps<50:
   assert page.locator('#hero-commit').is_enabled(),role
   page.locator('#hero-commit').click();steps+=1
  assert steps<50,(role,'stuck in institutional',errors)
  assert page.locator('#hero-tick').inner_text().startswith('TRIMESTRE')
  assert page.locator('.pulse-metric').count()==4
  if i==0:
   page.screenshot(path=str(root/'proofs/F10-desktop.png'),full_page=True)
  q=0
  while page.locator('#hero-commit').is_enabled() and q<11:
   page.locator('[data-plan="'+(['INCISIVO','COOPERATIVO','PRUDENTE'][q%3])+'"]').click()
   page.locator('#hero-commit').click();q+=1
  assert not page.locator('#hero-commit').is_enabled(),(role,'not terminal',q,errors)
  assert not page.locator('#hero-feedback').is_hidden()
  assert page.locator('#exp-stage-name').inner_text().strip()
  with page.expect_download() as download:page.locator('#export').click()
  page.locator('#import').set_input_files(download.value.path());assert not page.locator('#error').inner_text()
  records.append({'role':role,'institutionalCTAs':steps,'economicCTAs':q,'terminal':True,'replay':True})
 page.set_viewport_size({'width':390,'height':844});page.locator('#role').select_option('COSTANTINO');page.locator('#seed').fill('53');page.locator('#new').click()
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 2'),'Mobile overflow'
 assert page.locator('#hero-commit').is_visible()
 assert page.locator('#hero-commit').bounding_box()['y']<844,'Mobile CTA not above fold'
 assert page.locator('.hero-plan').count()==3
 page.screenshot(path=str(root/'proofs/F10-mobile.png'),full_page=True)
 assert not errors,errors
 result={'ok':True,'browser':'Chromium','roles':records,'quickCTAVisibleMobile390':True,'visualStages':5,'chapterTrack':8,'receipts':True,'advancedClosedByDefault':True,'geometries':32,'jsErrors':errors,'limitation':'inlined exact modules because localhost navigation is blocked; not production hosting'}
 (root/'proofs/F10-browser-report.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
 print(json.dumps(result,ensure_ascii=False))
 browser.close()
