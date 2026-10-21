"""Chromium smoke: F3 HTML/CSS and unmodified module semantics, inlined to bypass localhost policy."""
from playwright.sync_api import sync_playwright
import pathlib, re, json
root=pathlib.Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1540,'height':1020},accept_downloads=True)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    html=(root/'web/f3.html').read_text()
    html=re.sub(r'<link rel="stylesheet"[^>]*>','',html)
    html=re.sub(r'<script type="module"[^>]*></script>','',html)
    page.set_content(html)
    page.add_style_tag(content=(root/'web/f3.css').read_text())
    core=(root/'src/institutions.mjs').read_text().replace('export const ','const ').replace('export function ','function ')
    app=re.sub(r"^import [^\n]+\n",'',(root/'web/f3.mjs').read_text())
    page.add_script_tag(content=core+'\n'+app)
    summary=[]
    for i,role in enumerate(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']):
        page.locator('#role').select_option(role)
        page.locator('#seed').fill(str(41+i))
        page.locator('#create').click()
        actions=0
        while 'Finale' not in page.locator('#status').inner_text() and actions<6:
            choices=page.locator('#choices button')
            assert choices.count()==3,(role,'choices',choices.count())
            choices.first.click()
            actions+=1
        assert 'Finale' in page.locator('#status').inner_text(),role
        assert actions>=2,(role,actions)
        text=page.locator('#dossier-a').inner_text()+' '+page.locator('#dossier-b').inner_text()
        assert 'P1' in text and 'P2' in text,role
        summary.append({'role':role,'decisions':actions,'outcome':page.locator('#status').inner_text()})
    page.locator('#role').select_option('PRESIDENTE')
    page.locator('#seed').fill('41')
    page.locator('#create').click()
    page.locator('#choices button').first.click()
    assert page.locator('#identity').inner_text().count('P1')>=1
    assert 'Nessuna' in page.locator('#identity').inner_text() # post-mandate identity
    assert 'P2' in page.locator('#mandates').inner_text()
    page.locator('#choices button').nth(1).click()
    assert 'Finale' in page.locator('#status').inner_text()
    with page.expect_download() as dl:
        page.locator('#export').click()
    replay=dl.value.path()
    assert replay
    page.locator('#role').select_option('GIUDICE')
    page.locator('#seed').fill('41')
    page.locator('#create').click()
    assert 'PRIVATE_FINANCING' not in page.locator('#events').inner_text()
    page.screenshot(path=str(root/'proofs/F3-browser.png'),full_page=True)
    assert not errors,errors
    (root/'proofs/F3-browser-report.json').write_text(json.dumps({'browser':'Chromium','mode':'inlined modules due to local HTTP policy','all_roles':summary,'postMandateP1_keeps_person':True,'reviewed_no_private_finance':True,'errors':errors},indent=2)+'\n')
    print(json.dumps(summary))
    browser.close()
