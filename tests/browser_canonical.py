import asyncio, json, mimetypes, pathlib
import shutil
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
import re

def clean(path):
    s=(ROOT/path).read_text(encoding='utf8')
    s=re.sub(r'^import[^\n]*\n','',s,flags=re.M)
    s=re.sub(r'\bexport (const|function|class)\b',r'\1',s)
    return s

modules=[
 "const V3=(()=>{"+clean('convergence/ac03/src/v3_immutable.mjs')+";return {ROLES};})();",
 "const AC03=(()=>{const {ROLES}=V3;"+clean('convergence/ac03/src/golden_crisis.mjs')+";return {start,draft,commit,view,comic,digest,replayFrom,choices};})();",
 "const EX=(()=>{const {start,draft,commit,view,comic,digest,replayFrom,choices}=AC03;const {ROLES}=V3;"+clean('experience/episode.mjs')+";return {newEpisode,episodeView,submitChoice,episodeResult,replayEpisode,PLAYER_ROLES};})();",
 "const EX02=(()=>{"+clean('experience/choice_contract.mjs')+";return {choiceMeaning};})();",
 "const BOARD=(()=>{const {choiceMeaning}=EX02;"+clean('web/canonical_model.mjs')+";return {boardModel,PROJECTS,ROLE_LABELS};})();",
 "(()=>{const {newEpisode,episodeView,submitChoice,episodeResult,replayEpisode,PLAYER_ROLES}=EX;const {boardModel,PROJECTS,ROLE_LABELS}=BOARD;"+clean('web/canonical.mjs')+"})();"
]
combined='\n'.join(modules)
html=(ROOT/'web/index.html').read_text()
html=re.sub(r'<link rel="stylesheet"[^>]+>','',html)
html=re.sub(r'<script type="module"[^>]*></script>','',html)

async def suite():
    result={'desktop':False,'mobile':False,'jsErrors':[],'mode':'inline-exact-source','screenshots':[]}
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(headless=True,**({'executable_path':shutil.which('chromium')} if shutil.which('chromium') else {}),args=['--no-sandbox'])
        for label,width,height in [('desktop',1440,900),('mobile',390,844)]:
            page=await browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
            page.on('pageerror',lambda exc:result['jsErrors'].append(str(exc)))
            await page.set_content(html)
            await page.add_style_tag(content=(ROOT/'web/canonical.css').read_text())
            await page.add_script_tag(content=combined)
            await page.locator('#commit').wait_for()
            await page.screenshot(path=str(ROOT/'proofs'/f'canonical-{label}-initial.png'),full_page=True)
            pre=await page.evaluate('window.__canonicalAudit()')
            assert pre['steps']==0 and pre['phase']=='PLANNING'
            assert await page.locator('#recommended button').count()==1
            assert await page.locator('#alternatives').is_hidden()
            if label=='mobile':
                bound=await page.locator('#commit').bounding_box()
                assert bound['y']<height,('CTA outside initial viewport',bound)
            await page.locator('#map-port').click()
            assert await page.locator('#map-port').get_attribute('aria-pressed')=='true'
            assert (await page.evaluate('window.__canonicalAudit()'))['steps']==0
            await page.locator('[data-pane="trace"]').click()
            assert not await page.locator('#trace').is_hidden()
            assert (await page.evaluate('window.__canonicalAudit()'))['steps']==0
            await page.locator('#alternatives-toggle').click()
            assert not await page.locator('#alternatives').is_hidden()
            await page.locator('#alternatives button').first.click()
            assert (await page.evaluate('window.__canonicalAudit()'))['steps']==0
            await page.locator('#commit').click()
            for _ in range(4):await page.locator('#commit').click()
            post=await page.evaluate('window.__canonicalAudit()')
            assert post['steps']==5 and post['phase']=='RESULT' and post['replay'] is True
            await page.locator('[data-pane="chronicle"]').click()
            assert await page.locator('#comics .panel').count()>=1
            assert await page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
            out=ROOT/'proofs'/f'canonical-{label}.png'
            await page.screenshot(path=str(out),full_page=True)
            result['screenshots'].append(out.name)
            await page.locator('#again').click()
            assert (await page.evaluate('window.__canonicalAudit()'))['steps']==0
            result[label]=True
            await page.close()
        await browser.close()
    assert not result['jsErrors'],result
    (ROOT/'proofs'/'browser-canonical.json').write_text(json.dumps(result,indent=2))
    print(json.dumps(result,indent=2))
if __name__=='__main__':asyncio.run(suite())
