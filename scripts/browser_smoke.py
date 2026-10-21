from playwright.sync_api import sync_playwright
import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
if True:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':1440,'height':900})
  errors=[];page.on('pageerror',lambda x:errors.append(str(x)))
  import re
  html=(root/'web/index.html').read_text()
  html=re.sub(r'<link rel="stylesheet"[^>]*>','',html)
  html=re.sub(r'<script type="module"[^>]*></script>','',html)
  page.set_content(html)
  page.add_style_tag(content=(root/'web/style.css').read_text())
  core=(root/'src/episode.mjs').read_text().replace('export const ','const ').replace('export function ','function ')
  app=(root/'web/app.mjs').read_text()
  app=re.sub(r"^import [^\n]+\n",'',app)
  page.add_script_tag(content=core+'\n'+app)
  assert page.get_by_text('Il Patto Digitale').count()==1
  roles=['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']
  results=[]
  for i,role in enumerate(roles):
   page.locator('#role').select_option(role)
   page.locator('#seed').fill(str(41+i))
   page.locator('#new').click()
   buttons=page.locator('#actions button.choice')
   assert buttons.count()==2,(role,buttons.count())
   buttons.first.click()
   assert page.locator('#outcome .end').count()==1,role
   result=page.locator('#outcome .end').inner_text()
   results.append({'role':role,'outcome':result})
  page.locator('#role').select_option('GIUDICE')
  page.locator('#seed').fill('41')
  page.locator('#new').click()
  known=page.locator('#history').inner_text()
  assert 'PRIVATE_FINANCING' not in known and 'PRIVATE_DECLINE' not in known
  page.screenshot(path=str(root/'proofs/F2-browser.png'),full_page=True)
  assert not errors,errors
  browser.close()
  print(json.dumps({'ok':True,'browser':'Chromium','five_roles_completed':results,'javascript_errors':errors,'private_events_absent_from_judge_view':True}))
