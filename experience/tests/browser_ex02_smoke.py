"""Chromium source-inline smoke. DOES NOT certify hosted HTTP or real human experience."""
from pathlib import Path
import base64
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]

def data_module(s):
    return 'data:text/javascript;base64,'+base64.b64encode(s.encode()).decode()

v3=data_module((ROOT/'convergence/ac03/src/v3_immutable.mjs').read_text())
k=(ROOT/'convergence/ac03/src/golden_crisis.mjs').read_text().replace("'./v3_immutable.mjs'",f"'{v3}'")
k=data_module(k)
e=(ROOT/'experience/episode.mjs').read_text().replace("'../convergence/ac03/src/golden_crisis.mjs'",f"'{k}'").replace("'../convergence/ac03/src/v3_immutable.mjs'",f"'{v3}'")
e=data_module(e)
choice=data_module((ROOT/'experience/choice_contract.mjs').read_text())
a=(ROOT/'experience/web/app.mjs').read_text().replace("'../episode.mjs'",f"'{e}'").replace("'../choice_contract.mjs'",f"'{choice}'")
a=data_module(a)
ids=['roster','playing','ending','step','phase','role','interest','choices','primary','hint','verdict','reason','outcomes','causes','comic','again']
html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+''.join(f'<div id="{i}"></div>' if i not in ['primary','again'] else f'<button id="{i}"></button>' for i in ids)+'</body></html>'
report=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(1440,900),(390,844)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto('about:blank')
        page.set_content(html)
        page.add_script_tag(url=a,type='module')
        page.wait_for_function('() => !!window.__exAudit',timeout=10000)
        for i in range(5):
            options=page.locator('#choices button')
            assert options.count()>0,(i,'missing choices')
            assert page.locator('#choice-preview').is_hidden()
            options.nth(0).click()
            assert page.locator('#choice-preview').is_visible()
            text=page.locator('#choice-preview').inner_text()
            assert 'non è una previsione' in text and 'Se scegli:' in text
            page.locator('#primary').click()
        assert page.evaluate('window.__exAudit().ended')
        assert page.evaluate('window.__exAudit().replayed')
        assert page.locator('#choice-preview').is_hidden()
        assert len(errors)==0,errors
        report.append({'viewport':width,'steps':5,'previewOnePerRole':True,'replay':True,'jsErrors':0})
        page.close()
    browser.close()
print(report)
