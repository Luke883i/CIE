import {f7Initial,f7Play,f7Observe,f7FastForward,f7Save,f7Restore,f7Audit} from '../src/strategy.mjs';
import {focusModel,focusCommand,focusReceipt,focusAudit} from '../src/focus_ux.mjs';
import {EUROPE_GEO} from '../data/europe-32.mjs';
const $=id=>document.getElementById(id);
const ROLE_NAMES={COSTANTINO:'Costantino',FINANZIATORE:'Finanziatore',PARLAMENTARE:'Parlamentare',PRESIDENTE:'Presidente',GIUDICE:'Presidente di Corte'};
let session=f7Initial({seed:41,humanRole:'COSTANTINO',caseId:'V4/E03'}),planId='PRUDENTE';
const el=(parent,tag,value,cls)=>{const x=document.createElement(tag);x.textContent=String(value);if(cls)x.className=cls;parent.append(x);return x;};
const setError=t=>{$('error').textContent=String(t??'')};
function render(){
 const v=f7Observe(session),role=session.core.core.humanRole,m=focusModel(v,role,{planId});focusAudit(m);planId=m.planId??'COOPERATIVO';
 $('role-label').textContent=m.roleName;$('clock').textContent=m.turn;$('kicker').textContent=m.kicker.toUpperCase();$('title').textContent=m.headline;$('description').textContent=m.description;$('goal').textContent=m.goal;
 $('warning').hidden=!m.warning;$('warning').textContent=m.warning??'';$('choice-label').textContent=m.planLabel||'Il prossimo capitolo';$('tradeoff').textContent=m.tradeoff||m.description;$('quarter').textContent=m.turn.toUpperCase();
 $('commit').textContent=m.cta+' →';$('commit').disabled=!m.canAct&&!m.ended;$('commit').dataset.action=m.ended?'restart':'play';
 const opts=$('alternatives');opts.replaceChildren();for(const p of m.alternatives){const b=el(opts,'button','','alternative');b.type='button';b.setAttribute('aria-pressed',String(m.planId===p.id));el(b,'span',p.label,'alternative-title');const sub=el(b,'small',p.risk);b.firstChild.append(sub);el(b,'span',m.planId===p.id?'✓':'→');b.onclick=()=>{planId=p.id;render()};}
 $('world-stage').textContent=m.stageName;$('milestone').textContent=m.phase==='INSTITUTIONAL'?'La storia inizia dalle istituzioni.':`${m.turn} · Il progetto prende forma con le tue scelte.`;
 for(const g of document.querySelectorAll('[data-stage]'))g.classList.toggle('visible',Number(g.dataset.stage)<=m.stage);
 const metrics=$('metrics');metrics.replaceChildren();for(const p of m.metrics)el(metrics,'span',`${p.label} ${p.value}`,'metric');
 const history=$('history');history.replaceChildren();const recent=v.strategic?.publicResults??[];if(recent.length===0)el(history,'p','Le conseguenze dei negoziati compariranno qui.');for(const entry of recent.slice(-5).reverse())el(history,'div',`T${entry.quarter}: ${entry.outcome} · ${entry.reason}`,'history-item');
 $('situation').textContent=m.phase==='ECONOMIC'?`${m.metrics.map(x=>x.label+': '+x.value).join(' · ')} · ${v.strategic?.activePacts?.length??0} impegni attivi`:'Procedimento istituzionale in corso.';
}
function choose(){
 const v=f7Observe(session),role=session.core.core.humanRole,m=focusModel(v,role,{planId});if(m.ended){startSession();return;}
 const cmd=focusCommand(v,role,planId);const outcome=f7Play(session,cmd);if(!outcome.ok){setError('Azione non disponibile: '+outcome.code);return;}
 session=outcome.session;planId=session.core.core.mode==='ECONOMIC'?'COOPERATIVO':'PRUDENTE';render();const after=f7Observe(session),receipt=focusReceipt(v,after,outcome.decision);
 const parts=receipt.changes.map(x=>x.label+' '+(x.delta>0?'+':'')+x.delta).join(' · ');
 $('receipt').hidden=false;$('receipt').replaceChildren();el($('receipt'),'strong',receipt.outcome+' · '+(parts||'Nessuna variazione visibile'));el($('receipt'),'p',receipt.explanation);
 setError('');
}
function startSession(){
 const seed=Number($('seed').value);if(!Number.isSafeInteger(seed)||seed<0||seed>4294967295){setError('Identificativo non valido');return;}
 session=f7Initial({seed,humanRole:$('role').value,caseId:'V4/E03'});planId='PRUDENTE';$('receipt').hidden=true;$('alternatives').hidden=true;$('alternatives-toggle').setAttribute('aria-expanded','false');setError('');render();
}
$('commit').onclick=choose;$('alternatives-toggle').onclick=()=>{const open=$('alternatives').hidden;$('alternatives').hidden=!open;$('alternatives-toggle').setAttribute('aria-expanded',String(open));};
$('settings-open').onclick=()=>$('settings').showModal();$('cancel-new').onclick=()=>$('settings').close();$('settings-form').onsubmit=ev=>{ev.preventDefault();try{startSession();$('settings').close()}catch(err){setError(err.message)}};
for(const f of EUROPE_GEO.features){const o=document.createElement('option');o.value=f.id;o.textContent=f.properties.name;$('territory').append(o)}
$('territory').onchange=()=>{const f=EUROPE_GEO.features.find(x=>x.id===$('territory').value);$('territory-info').textContent=f?`${f.properties.name} · territorio geografico consultabile, nessun indicatore locale simulato.`:''};$('territory').dispatchEvent(new Event('change'));
$('export').onclick=()=>{const json=JSON.stringify(f7Save(session),null,2);const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='CIE-replay.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
$('import').onchange=async ev=>{try{const f=ev.target.files?.[0];if(!f)return;if(f.size>140000)throw Error('FILE_TOO_LARGE');session=f7Restore(JSON.parse(await f.text()));$('role').value=session.core.core.humanRole;$('seed').value=session.core.core.world.seed;planId='PRUDENTE';$('receipt').hidden=true;setError('');render()}catch(err){setError('Replay non valido: '+err.message)}finally{ev.target.value=''}};
render();
// Read-only handles for reproducible browser audits; not a network or multiplayer authority.
if(location.hostname==='cie.test'||location.protocol==='about:')window.__focusAudit={view:()=>f7Observe(session),digest:()=>f7Audit(session).digest};
