"""Chromium smoke with exact JS/CSS embedded; does not verify deployment HTTP."""
from pathlib import Path
import re,json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
base=(root/'scripts/browser_f10_expert_smoke.py').read_text()
setup=base[base.index('def script(path):'):base.index("combined+='const F8=(()=>{")]
exec(setup)
combined+='const B=(()=>{'+script('src/gameplay_ux.mjs')+';return {decisionModel,deltaForKnownFacts};})();\n'
combined+='const P=(()=>{const {decisionModel,deltaForKnownFacts}=B;'+script('src/player_experience.mjs')+';return {observableResult,stageFromProgress};})();\n'
combined+='const GG=(()=>{'+script('src/game_goal.mjs')+';return {gameGoal};})();\n'
combined+='const RG=(()=>{'+script('src/role_objectives.mjs')+';return {roleObjective,dualOutcome};})();\n'
combined+='const CB=(()=>{const {f7Observe,f7Play,f7Save,f7Audit}=F7;const {decisionModel}=B;const {gameGoal}=GG;const {roleObjective,dualOutcome}=RG;const {observableResult,stageFromProgress}=P;'+script('src/campaign_turn.mjs')+';return {campaignView,campaignPlay,ROLE_LABELS};})();\n'
combined+='(()=>{const {f7Initial,f7Save,f7Restore,f7Audit}=F7;const {campaignView,campaignPlay,ROLE_LABELS}=CB;'+script('web/campaign.mjs')+';})();'
html=(root/'web/campaign.html').read_text();html=re.sub(r'<link[^>]*rel="stylesheet"[^>]*>','',html);html=re.sub(r'<script[^>]*type="module"[^>]*></script>','',html)
css=(root/'web/campaign.css').read_text()
records=[];errs=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(1440,900),(390,844)]:
  ctx=b.new_context(viewport={'width':width,'height':height},accept_downloads=True)
  pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.set_content(html);pg.add_style_tag(content=css);pg.add_script_tag(content=combined)
  assert not errs,errs
  assert pg.locator('.plan').count()==3
  assert pg.locator('#advance').is_visible()
  assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+2')
  assert pg.locator('#advance').bounding_box()['y']<height,(width,pg.locator('#advance').bounding_box())
  pg.screenshot(path=str(root/f'proofs/campaign-{width}.png'),full_page=True)
  for role in (['COSTANTINO'] if width==1440 else ['GIUDICE']):
   pg.locator('#new-game').click();pg.locator('#role-select').select_option(role);pg.locator('#seed').fill('41');pg.locator('#setup button[type=submit]').click()
   before=pg.evaluate('window.__campaignAudit.digest()')
   pg.locator('[data-plan="INCISIVO"]').click();pg.locator('[data-plan="PRUDENTE"]').click()
   assert pg.evaluate('window.__campaignAudit.digest()')==before
   n=0
   while pg.locator('#advance').is_enabled() and n<48:
    pg.locator('#advance').click();n+=1
   assert n<48 and n>=8,(role,n,errs)
   assert pg.locator('#end').is_visible(),role
   assert 'Replay verificato' in pg.locator('#end-replay').inner_text()
   with pg.expect_download() as d:pg.locator('#save').click()
   pg.locator('#load').set_input_files(d.value.path())
   assert pg.locator('#end').is_visible()
   records.append({'role':role,'viewport':width,'decisions':n,'replay':True})
  ctx.close()
 b.close()
assert not errs,errs
proof={'ok':True,'runs':records,'errors':errs,'limitation':'inlined exact JS because local Chromium HTTP blocked; not hosted E2E'}
(root/'proofs/campaign-browser.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(proof,ensure_ascii=False))
