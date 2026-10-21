"""Chromium E2E: exact F3/F4 module bodies inlined solely due to localhost navigation policy.
This does not prove HTTP deployment or supply-chain integrity."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
def script(filename):
    s=(root/filename).read_text();s=re.sub(r'^import [^\n]+\n','',s,flags=re.M);s=s.replace('export const ','const ').replace('export function ','function ');return s
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1480,'height':1100},accept_downloads=True)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    html=(root/'web/f4.html').read_text();html=re.sub(r'<link rel="stylesheet"[^>]*>','',html);html=re.sub(r'<script type="module"[^>]*></script>','',html)
    page.set_content(html);page.add_style_tag(content=(root/'web/f4.css').read_text())
    core3=script('src/institutions.mjs')
    core4=script('src/judicial.mjs')
    app=script('web/f4.mjs')
    f3names='f3Create,f3Submit,f3SystemTransition,f3Observe,f3NpcChoice,f3Available,f3Validate,f3Audit,f3Digest,f3Word,F3_PEOPLE,F3_STAGES'
    f4names='f4Start,f4Play,f4Observe,f4Save,f4Restore'
    combined='const F3=(()=>{'+core3+';return {'+f3names+'};})();\n'
    combined+='const F4=(()=>{const {'+f3names+'}=F3;'+core4+';return {'+f4names+'};})();\n'
    combined+='(()=>{const {'+f4names+'}=F4;'+app+'})();'
    page.add_script_tag(content=combined)
    summary=[]
    for i,role in enumerate(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']):
        page.locator('#role').select_option(role);page.locator('#seed').fill(str(41+i));page.locator('#new').click()
        moves=0
        while 'Episodio concluso' not in page.locator('#actions').inner_text() and moves<24:
            actions=page.locator('#actions button');assert actions.count()>=2,(role,moves,actions.count(),errors)
            page.evaluate("document.querySelector('#actions button:last-child').click()")  # activate directly to avoid click stability waits
            moves+=1
        assert 'Episodio concluso' in page.locator('#actions').inner_text(),(role,moves)
        assert page.locator('#ending').inner_text().strip(),role
        summary.append({'role':role,'humanDecisions':moves,'ending':page.locator('#ending').inner_text().strip()})
    page.locator('#role').select_option('GIUDICE');page.locator('#seed').fill('41');page.locator('#new').click()
    assert page.locator('#court-phase').inner_text().startswith('CASE-A')
    assert 'PRIVATE_FINANCING' not in page.locator('#history').inner_text()
    assert page.locator('#actions button').count()>=2
    # real choices: discovery then conflict recusal, hearing, majority, remedy
    page.locator('#actions button').first.click()
    assert 'RECUSAL' in page.locator('#court-phase').inner_text()
    page.screenshot(path=str(root/'proofs/F4-browser.png'),full_page=True)
    with page.expect_download() as info:page.locator('#export').click()
    assert info.value.path()
    assert not errors,errors
    report={'browser':'Chromium','roles':summary,'allFiveComplete':True,'sealedFinanceNotSeenBeforeDiscovery':True,'browserErrors':errors,'limitation':'inlined modules, no HTTP-hosted smoke'}
    (root/'proofs/F4-browser-report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
    browser.close()
