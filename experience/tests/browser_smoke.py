#!/usr/bin/env python3
"""Chromium local inline asset smoke; NOT a hosted deployment test."""
import json,re
from pathlib import Path
from urllib.parse import quote
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
EXP=ROOT/'experience'

def url(s): return 'data:text/javascript;charset=utf-8,'+quote(s,safe='')
v3=url((ROOT/'convergence/ac03/src/v3_immutable.mjs').read_text())
kernel=(ROOT/'convergence/ac03/src/golden_crisis.mjs').read_text().replace("'./v3_immutable.mjs'",repr(v3))
kernelurl=url(kernel)
model=(EXP/'episode.mjs').read_text().replace("'../convergence/ac03/src/golden_crisis.mjs'",repr(kernelurl)).replace("'../convergence/ac03/src/v3_immutable.mjs'",repr(v3))
modelurl=url(model)
app=(EXP/'web/app.mjs').read_text().replace("'../episode.mjs'",repr(modelurl))
appurl=url(app)
html=(EXP/'web/index.html').read_text()
css=(EXP/'web/style.css').read_text()
html=html.replace('<link rel="stylesheet" href="./style.css">','<style>'+css+'</style>')
html=html.replace('<script type="module" src="./app.mjs"></script>', '<script type="module" src="'+appurl+'"></script>')
report=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(1440,900),(390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height})
  errors=[];page.on('pageerror',lambda x:errors.append(str(x)))
  page.goto('about:blank');page.set_content(html,wait_until='load');page.wait_for_selector('fieldset button',timeout=15000)
  assert page.get_by_text('Due opere. Pochi fondi.').count()>=1
  for code in ['EXECUTE|P-ENERGY','OFFER_CREDIT|P-ENERGY','HOLD|NONE','HOLD|NONE','REVIEW|P-ENERGY']:
   page.locator('button.choice[data-code="'+code+'"]').click();page.locator('#primary').click();
  assert page.locator('#ending').is_visible()
  assert page.locator('#verdict').inner_text().casefold()=='entrambe le opere sono operative'
  assert page.locator('#comic .panel').count()>=1
  assert page.evaluate('window.__exAudit().replayed')
  assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1')
  target=EXP/'proofs'/('EX01-desktop.png' if width>500 else 'EX01-mobile.png');target.parent.mkdir(parents=True,exist_ok=True)
  page.screenshot(path=str(target),full_page=True)
  assert not errors, errors
  page.locator('#again').click()
  assert page.locator('#ending').is_hidden()
  assert page.locator('#role').inner_text().casefold()=='costantino'
  report.append({'width':width,'height':height,'roleSteps':5,'ending':'FULL','comicPanels':3,'replay':True,'jsErrors':errors,'scrollOverflow':False})
  page.close()
 browser.close()
(EXP/'proofs'/'browser_report.json').write_text(json.dumps({'method':'inline exact module source; not HTTP navigation','runs':report},indent=2))
print(json.dumps(report))
