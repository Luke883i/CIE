import {newEpisode,episodeView,submitChoice,episodeResult,replayEpisode,PLAYER_ROLES} from '../experience/episode.mjs';
import {boardModel,PROJECTS,ROLE_LABELS} from './canonical_model.mjs';
const $=id=>document.getElementById(id);
const el=(p,tag,value,cls)=>{const n=document.createElement(tag);n.textContent=String(value??'');if(cls)n.className=cls;p.append(n);return n;};
let episode=newEpisode(41),selection=null,activeProject='P-ENERGY',pane='dossier';
function buttons(p,choices,selected){p.replaceChildren();for(const c of choices){const b=el(p,'button',`${c.name} · ${c.target}`);b.type='button';b.dataset.code=c.code;b.setAttribute('aria-pressed',String(c.code===selected));b.onclick=()=>{selection=c.code;render()};}}
function render(){const v=episodeView(episode);const m=boardModel(v,selection);selection=m.selectedCode;
 $('turn-state').textContent=episode.finished?'RISOLTO':`${v.completed} di ${v.total} ordini`;
 $('seat').textContent=episode.finished?'5 / 5':`${v.completed+1} / 5`;
 $('planning').hidden=episode.finished;$('finished').hidden=!episode.finished;
 $('roster').replaceChildren();for(const role of PLAYER_ROLES){const line=el($('roster'),'div',` ${ROLE_LABELS[role]}`,'roleline'+(role===v.role?' active':'')+(v.submittedRoles.includes(role)?' done':''));line.prepend(el(document.createDocumentFragment(),'span',v.submittedRoles.includes(role)?'✓':role===v.role?'◆':'○'));if(role===v.role)line.setAttribute('aria-current','step');}
 if(!episode.finished){$('desk-title').textContent=m.roleName;$('role-hint').textContent=v.interest;buttons($('recommended'),m.choices.slice(0,1),selection);buttons($('alternatives'),m.choices.slice(1),selection);const a=m.meaning;$('meaning').replaceChildren();el($('meaning'),'strong',`${a.action} · ${a.target}`);el($('meaning'),'p',a.scope);el($('meaning'),'p',a.cost);el($('meaning'),'p',a.uncertainty);el($('meaning'),'small',a.epistemic);$('commit').disabled=!selection;$('commit').textContent=`Registra: ${a.action} →`;}
 const cards=$('project-cards');cards.replaceChildren();for(const project of m.nodes){const c=el(cards,'div','','project');el(c,'strong',project.name);el(c,'small',project.hint+' · 5 crediti');el(c,'span',project.status,'status');}
 $('treasury').textContent=m.treasury;
 const p=PROJECTS.find(x=>x.id===activeProject);$('project-detail').textContent=`${p.name}: costo ${p.cost} crediti; ${p.hint.toLowerCase()}. ${m.nodes.find(x=>x.id===p.id).status}.`;
 for(const p of PROJECTS)$(`map-${p.id==='P-ENERGY'?'energy':'port'}`).setAttribute('aria-pressed',String(activeProject===p.id));
 if(episode.finished){const r=m.verdict;$('verdict').textContent=r.headline;$('verdict-reason').textContent=r.reason;$('replay-status').textContent=replayEpisode(episode).ok?'Replay verificato: stesso risultato e stesso mondo.':'ERRORE DI REPLAY';$('comics').replaceChildren();for(const c of r.comics){const block=el($('comics'),'article','','panel');el(block,'span','◈','panel-visual');el(block,'strong',c.title);el(block,'p',c.caption);el(block,'small','Fonti: '+c.sourceEventIds.join(', '));}if(!r.comics.length)el($('comics'),'p','Nessuna scena per questo risultato.');$('events').replaceChildren();for(const e of r.events){const block=el($('events'),'div','','event');el(block,'strong',e.kind.replaceAll('_',' '));el(block,'p',e.detail);el(block,'small',e.id+' · '+e.refs.join(', '));}$('chronicle-intro').textContent='Le scene derivano solo da eventi del registro.';$('trace-intro').textContent=`${r.events.length} eventi verificabili, saldo Tesoro ${r.balances.TREASURY}.`;
 }
 for(const x of document.querySelectorAll('[data-pane]')){const on=x.dataset.pane===pane;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on));$(x.dataset.pane).hidden=!on;}
}
$('commit').onclick=()=>{const v=episodeView(episode),c=v.choices.find(x=>x.code===selection);if(!c)return;const r=submitChoice(episode,{kind:c.kind,target:c.target});if(!r.ok){$('error').textContent='Ordine rifiutato: '+r.code;return;}episode=r.episode;selection=null;$('error').textContent='';$('alternatives').hidden=true;$('alternatives-toggle').setAttribute('aria-expanded','false');if(episode.finished)pane='chronicle';render();};
$('alternatives-toggle').onclick=()=>{const open=$('alternatives').hidden;$('alternatives').hidden=!open;$('alternatives-toggle').setAttribute('aria-expanded',String(open));};
for(const p of PROJECTS)$(`map-${p.id==='P-ENERGY'?'energy':'port'}`).onclick=()=>{activeProject=p.id;render();};
for(const b of document.querySelectorAll('[data-pane]'))b.onclick=()=>{pane=b.dataset.pane;render();};
function restart(){episode=newEpisode(41);selection=null;pane='dossier';$('alternatives').hidden=true;$('alternatives-toggle').setAttribute('aria-expanded','false');render();}
$('reset-top').onclick=restart;$('again').onclick=restart;
render();
if(location.hostname==='cie.test'||location.protocol==='about:')window.__canonicalAudit=()=>({phase:episodeView(episode).phase,steps:episode.submitted.length,digest:episode.world.committed?.stateDigest??null,replay:episode.finished?replayEpisode(episode).ok:null,selected:selection});
