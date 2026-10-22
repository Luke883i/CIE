"""Inlined Chromium integration test: no claim of production HTTP deployment."""
from pathlib import Path
import json,re
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
base=(root/'scripts/browser_f10_expert_smoke.py').read_text()
start=base.index('def script(path):');stop=base.index('html=(root/',start)
setup=base[start:stop]
setup=setup.replace("combined+='const F8=(()=>{'+script('src/atlas.mjs')+';return {'+n8+'};})();\n'",'')
setup=setup.replace("combined+='const UI=(()=>{'+script('src/atlas_ui.mjs')+';return {'+nu+'};})();\n'",'')
setup=setup[:setup.index("combined+='(()=>{const {'+n7+'}")]
exec(setup)
combined+='const GG=(()=>{'+script('src/game_goal.mjs')+';return {gameGoal,auditGameGoal};})();\n'
combined+='const RG=(()=>{'+script('src/role_objectives.mjs')+';return {roleObjective,dualOutcome,roleObjectiveAudit,choiceExplanation};})();\n'
combined+='const C=(()=>{const {decisionModel,validatePlan}=B;const {playerExperience,observableResult}=P;const {gameGoal,auditGameGoal}=GG;const {roleObjective,dualOutcome,roleObjectiveAudit,choiceExplanation}=RG;'+script('src/focus_ux.mjs')+';return {focusModel,focusCommand,focusReceipt,focusAudit};})();\n'
combined+='(()=>{const {f7Initial,f7Play,f7Observe,f7FastForward,f7Save,f7Restore,f7Audit}=F7;const {focusModel,focusCommand,focusReceipt,focusAudit}=C;const {EUROPE_GEO}=GEO;'+script('web/focus.mjs')+';})();\n'
html=(root/'web/f10.html').read_text();html=re.sub(r'<link[^>]*rel="stylesheet"[^>]*>','',html);html=re.sub(r'<script[^>]*type="module"[^>]*></script>','',html)
css=(root/'web/focus.css').read_text()
records=[];errors=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(1440,900),(390,844)]:
  ctx=browser.new_context(viewport={'width':width,'height':height},accept_downloads=True)
  pg=ctx.new_page();pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(html);pg.add_style_tag(content=css);pg.add_script_tag(content=combined)
  assert not errors,errors
  assert pg.locator('#personal-title').is_visible()
  assert pg.locator('#personal-count').inner_text()=='0 / 2'
  assert 'trimestri' in pg.locator('#goal').inner_text()
  assert pg.locator('#metrics .goal-metric').count()==2
  assert pg.locator('#commit').bounding_box()['y']<height,(width,pg.locator('#commit').bounding_box())
  assert not pg.locator('#alternatives').is_visible()
  assert pg.evaluate('document.documentElement.scrollWidth <= window.innerWidth+2'),width
  pg.screenshot(path=str(root/f'proofs/RoleGoals-{"desktop" if width>600 else "mobile"}.png'),full_page=True)
  for i,role in enumerate(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']):
   pg.locator('#settings-open').click();pg.locator('#role').select_option(role);pg.locator('#seed').fill(str(85+i));pg.locator('#start-new').click()
   assert pg.locator('#personal-title').inner_text().strip()
   baseline=pg.evaluate('window.__focusAudit.digest()')
   pg.locator('.personal-why summary').click()
   assert pg.evaluate('window.__focusAudit.digest()')==baseline
   pg.locator('.personal-why summary').click()
   pg.locator('#alternatives-toggle').click()
   assert pg.locator('.alternative').count()==3
   pg.locator('#alternatives-toggle').click()
   assert pg.evaluate('window.__focusAudit.digest()')==baseline
   moves=0
   while pg.locator('#commit').get_attribute('data-action')!='restart' and moves<40:
    pg.locator('#commit').click();moves+=1
   assert moves>=8 and moves<40,(role,moves,errors)
   assert pg.locator('#dual-outcome').is_visible(),(width,role)
   assert 'missione personale' in pg.locator('#dual-outcome').inner_text()
   if not pg.locator('#history-details').evaluate('(e)=>e.open'):pg.locator('#history-details summary').click()
   with pg.expect_download() as download:pg.locator('#export').click()
   pg.locator('#import').set_input_files(download.value.path())
   assert not pg.locator('#error').inner_text()
   assert pg.locator('#dual-outcome').is_visible()
   records.append({'viewport':width,'role':role,'turns':moves,'goalShown':True,'personalShown':True,'replay':True})
  ctx.close()
 browser.close()
assert not errors,errors
out={'ok':True,'runs':records,'errors':errors,'note':'inlined local modules; not HTTP production or human usability proof'}
(root/'proofs/RoleGoals-browser-report.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False))
