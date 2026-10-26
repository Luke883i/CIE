import {f7Initial,f7Save,f7Restore,f7Audit} from '../src/strategy.mjs';
import {campaignView,campaignPlay,ROLE_LABELS} from '../src/campaign_turn.mjs';
const $=id=>document.getElementById(id);
const put=(parent,tag,text,cls)=>{const x=document.createElement(tag);x.textContent=String(text??'');if(cls)x.className=cls;parent.append(x);return x};
let session=f7Initial({seed:41,humanRole:'COSTANTINO',caseId:'V4/E03'}),selection='COOPERATIVO',lastReceipt=null;
function draw(){
 const m=campaignView(session,selection);selection=m.selectedId;
 $('chapter').textContent=m.chapter.toUpperCase();$('headline').textContent=m.headline;$('description').textContent=m.description;
 $('countdown').textContent=m.turnsRemaining;$('role').textContent=m.roleLabel.toUpperCase();$('goal-text').textContent=m.goal.victoryRule;
 $('collective').textContent=m.goal.liveStatus;$('personal').textContent=m.personal.description;$('personal-progress').textContent=m.personal.actionsDisplay+' atti · '+m.personal.guidance;
 $('progress-label').textContent=m.progress+' / 4';$('progress-bar').style.width=m.percent+'%';$('growth').style.opacity=String(.2+m.stage*.2);
 const stats=$('stats');stats.replaceChildren();for(const x of m.metrics){const c=put(stats,'div','','metric');put(c,'strong',x.value);put(c,'small',x.label);}
 if(!m.metrics.length)put(stats,'p','Preludio: gli indicatori economici arriveranno dopo gli atti istituzionali.');
 $('plans').replaceChildren();for(const [i,p] of m.plans.entries()){
  const btn=put($('plans'),'button','','plan');btn.type='button';btn.setAttribute('aria-pressed',String(selection===p.id));btn.dataset.plan=p.id;
  put(btn,'span',String(i+1).padStart(2,'0'),'number');const txt=put(btn,'span','');put(txt,'strong',p.label);put(txt,'small',p.act);
  btn.onclick=()=>{selection=p.id;draw()};
 }
 const chosen=m.plans.find(p=>p.id===selection);
 $('choice-help').replaceChildren();put($('choice-help'),'strong',chosen?.act??'Episodio concluso');put($('choice-help'),'p',chosen?.risk??m.goal.resultLabel);
 $('advance').disabled=!m.canAct;$('advance').hidden=m.ended;
 $('end').hidden=!m.ended;if(m.ended){$('end-title').textContent=m.goal.resultLabel;$('end-explanation').textContent=m.dual.combinedLabel;$('end-replay').textContent=f7Audit(f7Restore(f7Save(session))).digest===f7Audit(session).digest?'Replay verificato: stesso stato finale.':'Replay non verificato';}
 const receipt=$('receipt');receipt.replaceChildren();if(lastReceipt){put(receipt,'strong',lastReceipt.label);put(receipt,'p',lastReceipt.summary);put(receipt,'small',lastReceipt.note);}else put(receipt,'p','La prossima scelta produrrà una conseguenza visibile dopo il commit.');
 const history=$('history');history.replaceChildren();for(const h of m.lastEvents)put(history,'p',`T${h.quarter}: ${h.outcome} · ${h.reason}`);if(!m.lastEvents.length)put(history,'p','La cronaca negoziale comparirà dopo il preludio.');
}
function advance(){const r=campaignPlay(session,selection);if(!r.ok){$('error').textContent=r.code;return;}session=r.session;selection='COOPERATIVO';lastReceipt=r.receipt;$('error').textContent='';draw()}
function reset(){session=f7Initial({seed:Number($('seed').value),humanRole:$('role-select').value,caseId:'V4/E03'});selection='COOPERATIVO';lastReceipt=null;draw()}
$('advance').onclick=advance;$('new-game').onclick=()=>$('start-modal').showModal();$('cancel').onclick=()=>$('start-modal').close();$('play-again').onclick=()=>{reset();window.scrollTo?.(0,0)};
$('setup').onsubmit=e=>{e.preventDefault();try{reset();$('start-modal').close()}catch(err){$('error').textContent=err.message}};
$('save').onclick=()=>{const blob=new Blob([JSON.stringify(f7Save(session),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='cie-campaign-replay.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('load').onchange=async e=>{try{const file=e.target.files?.[0];if(!file)return;if(file.size>140000)throw Error('Replay troppo grande');const next=f7Restore(JSON.parse(await file.text()));session=next;selection='COOPERATIVO';lastReceipt=null;$('error').textContent='';$('role-select').value=session.core.core.humanRole;$('seed').value=session.core.core.world.seed;draw()}catch(err){$('error').textContent='Replay non valido: '+err.message}finally{e.target.value=''}};
document.addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLButtonElement||e.ctrlKey||e.altKey||e.metaKey)return;const m=campaignView(session,selection);if(['1','2','3'].includes(e.key)){const p=m.plans[Number(e.key)-1];if(p){selection=p.id;draw()}}else if(e.key==='Enter'&&m.canAct)advance();});
draw();if(location.hostname==='cie.test'||location.protocol==='about:')window.__campaignAudit={view:()=>campaignView(session,selection),digest:()=>f7Audit(session).digest,save:()=>f7Save(session)};
