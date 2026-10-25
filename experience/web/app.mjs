import {newEpisode,episodeView,submitChoice,episodeResult,replayEpisode,PLAYER_ROLES} from '../episode.mjs';
const $=id=>document.getElementById(id);let ep=newEpisode(41),selection=null;
const roleLabels={COSTANTINO:'Costantino',FINANZIATORE:'Finanziatore',PARLAMENTARE:'Parlamentare',PRESIDENTE:'Presidente',GIUDICE:'Giudice'};
const add=(parent,tag,txt,cls)=>{const n=document.createElement(tag);n.textContent=txt;if(cls)n.className=cls;parent.append(n);return n;};
function render(){const v=episodeView(ep);$('roster').replaceChildren();for(const role of PLAYER_ROLES){const done=ep.submitted.includes(role);const card=add($('roster'),'div',`${done?'✓':'○'}  ${roleLabels[role]}`,'rosterline'+(role===v.role?' active':''));card.setAttribute('aria-current',role===v.role?'step':'false');}
 $('playing').hidden=ep.finished;$('ending').hidden=!ep.finished;$('step').textContent=ep.finished?'05 / 05':`${String(v.completed+1).padStart(2,'0')} / 05`;$('phase').textContent=ep.finished?'TRIMESTRE RISOLTO':'ORDINI · TURNO 1';
 if(ep.finished){end();return;}
 $('role').textContent=roleLabels[v.role];$('interest').textContent=v.interest;
 const field=$('choices');field.replaceChildren();for(const c of v.choices){const b=add(field,'button',`${c.title} · ${c.targetLabel}`,'choice');b.type='button';b.dataset.code=c.code;b.setAttribute('aria-pressed',String(selection?.kind===c.kind&&selection?.target===c.target));b.onclick=()=>{selection={kind:c.kind,target:c.target};$('primary').disabled=false;for(const n of field.children)n.setAttribute('aria-pressed',String(n===b));};}
 $('primary').disabled=!selection;
 $('hint').textContent=v.role==='GIUDICE'?'L’ultimo ordine chiude il trimestre. La sospensione, se scelta, prevale sui fondi.':'L’ordine viene registrato. Il mondo cambia solo quando i cinque hanno agito.';
}
function end(){const r=episodeResult(ep);$('verdict').textContent=r.headline;$('reason').textContent=r.reason;$('outcomes').replaceChildren();for(const [k,v] of Object.entries(r.statuses)){const p=add($('outcomes'),'div','', 'outcome');add(p,'span',k==='P-ENERGY'?'Energia':'Porto');add(p,'strong',v==='EXECUTED'?'OPERATIVO':v==='SUSPENDED'?'SOSPESO':'NON COMPLETATO');}
 const causes=$('causes');causes.replaceChildren();for(const e of r.events){const n=add(causes,'div','', 'cause');add(n,'b',e.kind.replaceAll('_',' '));add(n,'span',e.detail);add(n,'small',`PROVA ${e.id} · ${e.refs.join(', ')}`);}
 $('comic').replaceChildren();if(!r.comics.length)add($('comic'),'p','Nessuna scena rilevante per questo esito.');for(const c of r.comics){const box=add($('comic'),'article','', 'panel');const visual=add(box,'div',c.title==='Il blocco'?'✕':c.title==='Il credito'?'▤':c.title==='La sospensione'?'⚖':'▰','panel-visual');visual.setAttribute('aria-hidden','true');add(box,'strong',c.title);add(box,'p',c.caption);add(box,'small','Fonte '+c.sourceEventIds.join(', '));}
 if(!replayEpisode(ep).ok)throw Error('REPLAY_INVALID');
}
$('primary').onclick=()=>{if(!selection)return;const result=submitChoice(ep,selection);if(!result.ok){$('hint').textContent='Ordine rifiutato: '+result.code;return;}ep=result.episode;selection=null;render();};
$('again').onclick=()=>{ep=newEpisode(41);selection=null;render();window.scrollTo({top:0,behavior:'instant'});};
render();
// Browser-smoke probe only, without access to the internal world or private role notes.
if(location.hostname==='cie.test'||location.protocol==='about:')window.__exAudit=()=>({phase:episodeView(ep).phase,steps:ep.submitted.length,replayed:ep.finished?replayEpisode(ep).ok:null,ended:ep.finished});
