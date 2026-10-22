import {playerExperience,observableResult,auditExperience} from '../src/player_experience.mjs';
import {commandCatalog,matchCommands,togglePinned,uiSnapshot} from '../src/atlas_ui.mjs';
import {decisionModel,deltaForKnownFacts,validatePlan,UX_RULESET} from '../src/gameplay_ux.mjs';
import {atlasModel,geometryIndex,clampZoom,ATLAS_LENSES} from '../src/atlas.mjs';
import {EUROPE_GEO} from '../data/europe-32.mjs';
import {f7Initial,f7Play,f7Observe,f7FastForward,f7Save,f7Restore,f7Counterfactual,F7_MOVES} from '../src/strategy.mjs';
import {F6_ACTIONS} from '../src/reticulum.mjs';
import {V9_CASES} from '../src/v9_registry.mjs';
const $=id=>document.getElementById(id);
const names={COSTANTINO:'Costantino',FINANZIATORE:'Finanziatore',PARLAMENTARE:'Parlamentare',PRESIDENTE:'Presidente',GIUDICE:'Presidente di Corte'};
const econNames={BUILD_COALITION:'Costruisci coalizione',MOBILIZE_NETWORK:'Mobilita rete',OFFER_CREDIT:'Offri credito',KEEP_LIQUIDITY:'Conserva liquidità',AUTHORIZE_GRANT:'Autorizza sostegno',EXAMINE_BUDGET:'Esamina bilancio',HOST_CIVIC_DIALOGUE:'Dialogo civico',REQUEST_PUBLIC_REPORT:'Rapporto pubblico',PUBLISH_REASONS:'Pubblica motivazioni',REVIEW_SAFEGUARDS:'Verifica garanzie'};
const approach={INVESTIGATE:'Indaga',COOPERATE:'Coopera',ACCELERATE:'Accelera'};
const moveNames={PROPOSE_PACT:'Proponi un patto',DEMAND_CONCESSION:'Chiedi concessioni',PUBLIC_HEARING:'Audizione pubblica',DECLINE:'Non negoziare',EXIT_PACT:'Abbandona il patto'};
let session=f7Initial({seed:41,humanRole:'COSTANTINO',caseId:'V4/E03'}),move='PROPOSE_PACT',other='PARLAMENTARE',strategy='COOPERATE';
let preferredPlan='COOPERATIVO';
const cases=V9_CASES.filter(x=>x.granularity.startsWith('curated'));
for(const c of cases){const o=document.createElement('option');o.value=c.uid;o.textContent=c.uid+' · '+c.title;$('case-pick').append(o)}$('case-pick').value='V4/E03';
function add(parent,tag,text='',cls=''){const el=document.createElement(tag);el.textContent=String(text);if(cls)el.className=cls;parent.append(el);return el;}
function fail(msg){$('error').textContent=String(msg)}
function pickMove(x){move=x;render()}
function choose(choice){const before=f7Observe(session);const eco=session.core.core.mode==='ECONOMIC';const input=eco?{choice,move,other,strategy}:choice;const r=f7Play(session,input);if(!r.ok)return fail(r.code);session=r.session;fail('');$('feedback').textContent=r.decision?`Trattativa: ${r.decision.outcome}. ${r.decision.reason}. Fiducia ${r.decision.trustDelta>=0?'+':''}${r.decision.trustDelta}.`:'Atto istituzionale registrato.';render();const after=f7Observe(session);const delta=deltaForKnownFacts(before,after);const summary=delta.length?delta.slice(0,3).map(d=>`${d.key} ${d.delta>0?'+':''}${d.delta}`).join(' · '):'Il mondo comune ha registrato un nuovo atto.';const result=r.decision?.outcome??'Atto registrato';const receipt=observableResult(before,after,r.decision);$('hero-feedback').hidden=false;$('hero-feedback').textContent=`${result} · ${summary}. ${receipt.explanation} ${receipt.disclosure}`;announceUI('Decisione eseguita: '+result);} 
function speed(n){const r=f7FastForward(session,{quarters:n,stopAtCritical:true});if(!r.ok)return fail(r.code);session=r.session;fail('');$('feedback').textContent=`${r.moved} trimestri avanzati · ${r.stop}`;render();}
function render(){
 const v=f7Observe(session),eco=v.mode==='ECONOMIC',e=session.core.core.economy,role=session.core.core.humanRole;
 $('role-title').textContent=names[role];$('role-description').textContent='Le istituzioni sopravvivono ai titolari. I tuoi accordi possono essere respinti o disattesi.';
 $('world-clock').textContent=`Seed ${session.core.core.world.seed} · ${eco?'Trimestre '+Math.min(e.quarter,8)+'/8':'Preludio istituzionale'}`;
 $('chapter').textContent=eco?'NEGOZIATI':'ISTITUZIONI';$('turn-number').textContent=eco?'Q'+e.quarter:'ATTO';
 $('progress').textContent=eco?e.progress+'/8':'—';$('support').textContent=eco?e.support:'—';$('legitimacy').textContent=eco?e.legitimacy:'—';$('risk').textContent=eco?e.volatility:'—';
 $('case-title').textContent=v.case.title;$('case-desc').textContent=v.case.uid+' · '+v.case.mechanism+' · Ipotesi V9, regole sintetiche';
 $('role-description').textContent='I ruoli osservano lo stesso mondo ma non possiedono gli stessi poteri o informazioni.';
 $('v9-actions').replaceChildren();for(const type of F6_ACTIONS){const b=add($('v9-actions'),'button',approach[type]);b.disabled=!v.actions.includes(type);b.classList.toggle('selected',type===strategy);b.onclick=()=>{strategy=type;render()}}if(!v.actions.includes(strategy))strategy=v.actions[0]??'INVESTIGATE';
 $('counterfactual').textContent='Effetti di gameplay sintetici, non causalità empirica verificata.';
 const s=v.strategic;$('diplomacy').hidden=!eco||v.ended;
 $('counterpart').replaceChildren();for(const peer of s.counterparties){const o=add($('counterpart'),'option',names[peer]);o.value=peer;}if(!s.counterparties.includes(other))other=s.counterparties[0];$('counterpart').value=other;
 $('moves').replaceChildren();if(!s.moves.includes(move))move=s.moves[0]??'DECLINE';for(const m of s.moves){const b=add($('moves'),'button',moveNames[m]);b.classList.toggle('selected',m===move);b.setAttribute('aria-pressed',String(m===move));b.onclick=()=>pickMove(m)}
 $('trust').textContent=eco?`Fiducia con ${names[other]}: ${s.relations[other]}/10 · L’altra parte può rifiutare; una promessa dura fino alla sua scadenza.`:'Le trattative iniziano dopo il preludio.';
 $('pacts').replaceChildren();if(!s.activePacts.length)add($('pacts'),'div','Nessun impegno attivo.','pact');for(const p of s.activePacts)add($('pacts'),'div',`${names[p.other]} · scadenza Q${p.due} · ${p.terms}`,'pact');
 if(eco&&!v.ended&&other){try{const cf=f7Counterfactual(session,'DELEGATE',other);$('strategic-cf').textContent='Patto vs nessun patto: '+Object.entries(cf.changes).map(([k,d])=>`${k} ${d>=0?'+':''}${d}`).join(' · ');}catch{$('strategic-cf').textContent='Il confronto non è disponibile in questa fase.'}}else $('strategic-cf').textContent='';
 $('decision-title').textContent=eco?(v.ended?'La campagna è conclusa':'Prendi posizione'):'Prima le istituzioni';$('decision-description').textContent=eco?'Scegli interlocutore, strategia, approccio V9 e una decisione del tuo ruolo.':'Concludi i dossier istituzionali condivisi.';
 $('options').replaceChildren();for(const kind of (eco?v.choices:v.available)){const b=add($('options'),'button','','choice');add(b,'strong',eco?(econNames[kind]??kind):kind.replaceAll('_',' '));add(b,'small','Conseguenze persistenti e auditabili nel mondo unico.');b.onclick=()=>choose(kind)}
 if(!v.ended){const b=add($('options'),'button','','choice');add(b,'strong','Delega la decisione');add(b,'small','Regola NPC deterministica, nessun LLM.');b.onclick=()=>choose(eco?'DELEGATE':'WAIT')}
 if(eco&&v.ended)add($('options'),'p','Epilogo · '+v.outcome+' · Rigioca con altro seed o altre scelte.');
 for(const n of [1,2,4])$('skip'+n).disabled=!eco||v.ended;
 $('timeline').replaceChildren();for(const h of [...session.history].reverse().slice(0,6)){const d=add($('timeline'),'div','','timeline-item');add(d,'small',`Q${h.quarter} · ${names[h.other]}`);add(d,'strong',moveNames[h.move]+' — '+h.outcome);add(d,'span',`Fiducia ${h.trustDelta>=0?'+':''}${h.trustDelta}; ${h.reason}`)}
 if(!session.history.length)add($('timeline'),'p','La storia dei negoziati comparirà qui.','muted');
 $('ledger').replaceChildren();const facts=eco?{Progresso:e.progress,'Consenso':e.support,'Legittimità':e.legitimacy,'Volatilità':e.volatility,'Patti attivi':session.pacts.filter(p=>p.status==='ACTIVE').length,'Patti rispettati':session.pacts.filter(p=>p.status==='FULFILLED').length,'Patti traditi':session.pacts.filter(p=>p.status==='BROKEN').length,'Totale monetario':v.consolidated?.total}:{Fase:v.legal?.stage??'','Istituzione':v.legal?.incumbent??''};for(const [k,val] of Object.entries(facts)){const d=add($('ledger'),'div');add(d,'span',k);add(d,'strong',val??'—')}
 renderAtlas(v,role);renderGuidance(v,role);renderPulse(v,role);
}
$('counterpart').onchange=()=>{other=$('counterpart').value;render()};
$('new').onclick=()=>{try{session=f7Initial({seed:Number($('seed').value),humanRole:$('role').value,caseId:$('case-custom').value.trim()||$('case-pick').value});preferredPlan='COOPERATIVO';$('hero-feedback').hidden=true;move='PROPOSE_PACT';other='PARLAMENTARE';strategy='COOPERATE';pinnedCountries=[];fail('');$('feedback').textContent='';render()}catch(e){fail(e.message)}};
for(const n of [1,2,4])$('skip'+n).onclick=()=>speed(n);
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(f7Save(session),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='CIE-F7-replay.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
$('import').onchange=async ev=>{try{const file=ev.target.files?.[0];if(!file)return;if(file.size>140000)throw Error('FILE_TOO_LARGE');session=f7Restore(JSON.parse(await file.text()));preferredPlan='COOPERATIVO';$('hero-feedback').hidden=true;$('seed').value=session.core.core.world.seed;$('role').value=session.core.core.humanRole;$('case-custom').value=session.core.caseId;fail('');render()}catch(e){fail('Replay respinto: '+e.message)}finally{ev.target.value=''}};
$('help').onclick=()=>$('instructions').showModal();
$('help-mobile').onclick=()=>$('instructions').showModal();

// F8 ATLANTE: read-only projection of the existing F7 authoritative session.
const atlasGeom=geometryIndex(EUROPE_GEO);
let atlasLens='TERRITORI',atlasSelected='ITA',atlasSearch='',atlasZoom=1,atlasPanX=0,atlasPanY=0;
const commandEntries=commandCatalog(EUROPE_GEO);let pinnedCountries=[],commandIndex=0;const territoryIds=EUROPE_GEO.features.map(f=>f.id);
const svgNS='http://www.w3.org/2000/svg';
const countryNodes=new Map();
const makeSvg=(name,attrs={})=>{const e=document.createElementNS(svgNS,name);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
function setSelect(id){atlasSelected=id;renderAtlas();}
function renderPinned(){
 const chosen=pinnedCountries.includes(atlasSelected);$('bookmark').setAttribute('aria-pressed',String(chosen));$('bookmark').textContent=chosen?'★ Salvato':'☆ Salva';
 const panel=$('pinned-territories');panel.replaceChildren();if(!pinnedCountries.length)add(panel,'span','Nessun luogo salvato','pin-empty');
 for(const id of pinnedCountries){const f=EUROPE_GEO.features.find(x=>x.id===id);const b=add(panel,'button',f.properties.name,'pin-chip');b.type='button';b.onclick=()=>setSelect(id);}
}
function announceUI(text){$('ui-live').textContent=text;}
function jumpTo(target){const el=target==='journal'?document.querySelector('.rightpanel'):$(target);if(!el||el.hidden){announceUI('Sezione non disponibile in questa fase');return;}if(el.closest('details:not([open])'))el.closest('details').open=true;el.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});if(target==='decision')el.querySelector('button:not([disabled])')?.focus({preventScroll:true});announceUI('Aperta sezione '+target);}
function runCommand(c){if(c.kind==='territory'){atlasSearch='';$('geo-search').value='';setSelect(c.target);jumpTo('atlas');}else if(c.kind==='lens'){atlasLens=c.target;renderAtlas();jumpTo('atlas');}else jumpTo(c.target);$('command-palette').close();announceUI(c.label+' selezionato');}
function displayCommands(){const entries=matchCommands(commandEntries,$('command-search').value);const pane=$('command-results');pane.replaceChildren();commandIndex=Math.min(commandIndex,Math.max(0,entries.length-1));if(!entries.length)add(pane,'p','Nessun risultato. Prova un territorio o una lente.','command-empty');
 entries.forEach((x,i)=>{const b=add(pane,'button','','command-result');b.type='button';b.setAttribute('data-command-id',x.id);b.setAttribute('aria-current',String(commandIndex===i));add(b,'span',x.label,'command-result-label');add(b,'small',x.detail);b.onmouseenter=()=>{commandIndex=i;highlightCommand()};b.onclick=()=>runCommand(x);});}
function highlightCommand(){Array.from($('command-results').querySelectorAll('button')).forEach((x,i)=>x.setAttribute('aria-current',String(i===commandIndex)));}
function initCommandUI(){
 $('open-command').onclick=()=>{$('command-palette').showModal();$('command-search').value='';commandIndex=0;displayCommands();$('command-search').focus()};
 $('close-command').onclick=()=>$('command-palette').close();
 $('command-search').oninput=()=>{commandIndex=0;displayCommands()};
 $('command-search').onkeydown=ev=>{const count=$('command-results').querySelectorAll('button').length;if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault();commandIndex=(commandIndex+(ev.key==='ArrowDown'?1:-1)+Math.max(1,count))%Math.max(1,count);highlightCommand();}else if(ev.key==='Enter'){ev.preventDefault();$('command-results').querySelectorAll('button')[commandIndex]?.click();}};
 document.addEventListener('keydown',ev=>{if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'){ev.preventDefault();$('open-command').click();}else if(ev.key==='Escape'&&$('command-palette').open)$('command-palette').close();});
 document.querySelectorAll('[data-jump]').forEach(x=>x.onclick=()=>jumpTo(x.dataset.jump));
 $('bookmark').onclick=()=>{pinnedCountries=togglePinned(pinnedCountries,atlasSelected,territoryIds);renderPinned();announceUI('Territori salvati: '+pinnedCountries.length)};
}
function initAtlas(){
 const group=$('map-countries');
 for(const f of EUROPE_GEO.features){
  const path=makeSvg('path',{d:atlasGeom[f.id].path,'data-country':f.id,'tabindex':0,'role':'button','aria-label':f.properties.name,'aria-pressed':'false','class':'country'});
  path.addEventListener('click',()=>setSelect(f.id));
  path.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();setSelect(f.id)}else if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(ev.key)){ev.preventDefault();const a=EUROPE_GEO.features.map(x=>x.id);const step=ev.key==='ArrowRight'||ev.key==='ArrowDown'?1:-1;const next=a[(a.indexOf(f.id)+step+a.length)%a.length];setSelect(next);countryNodes.get(next)?.focus();}});
  path.addEventListener('mouseenter',()=>{if(f.id!==atlasSelected)$('geo-position').textContent='Esplora: '+f.properties.name;});
  path.addEventListener('mouseleave',()=>{$('geo-position').textContent='Selezionato: '+EUROPE_GEO.features.find(x=>x.id===atlasSelected).properties.name;});
  group.append(path);countryNodes.set(f.id,path);
 }
 document.querySelectorAll('[data-lens]').forEach(b=>b.addEventListener('click',()=>{atlasLens=b.dataset.lens;renderAtlas();}));
 $('geo-search').addEventListener('input',()=>{atlasSearch=$('geo-search').value;renderAtlas();});
 $('geo-list').addEventListener('change',()=>{if($('geo-list').value)setSelect($('geo-list').value);});
 $('zoom-in').addEventListener('click',()=>{atlasZoom=clampZoom(atlasZoom+.4);renderAtlas();});
 $('zoom-out').addEventListener('click',()=>{atlasZoom=clampZoom(atlasZoom-.4);renderAtlas();});
 $('zoom-reset').addEventListener('click',()=>{atlasZoom=1;atlasPanX=0;atlasPanY=0;renderAtlas();});
 const pan=(dx,dy)=>{const bound=Math.min(250,Math.round((atlasZoom-1)*170));atlasPanX=Math.max(-bound,Math.min(bound,atlasPanX+dx));atlasPanY=Math.max(-bound,Math.min(bound,atlasPanY+dy));renderAtlas();};
 for(const [id,dx,dy] of [['pan-left',35,0],['pan-right',-35,0],['pan-up',0,35],['pan-down',0,-35]])$(''+id).addEventListener('click',()=>pan(dx,dy));
 let drag=null;const map=$('euromap');map.addEventListener('pointerdown',ev=>{if(ev.target.closest('[data-country]')||atlasZoom===1)return;drag={x:ev.clientX,y:ev.clientY};map.setPointerCapture(ev.pointerId);});map.addEventListener('pointermove',ev=>{if(!drag)return;const rect=map.getBoundingClientRect(),scale=940/rect.width;const dx=(ev.clientX-drag.x)*scale,dy=(ev.clientY-drag.y)*scale;drag={x:ev.clientX,y:ev.clientY};pan(dx,dy);});map.addEventListener('pointerup',()=>{drag=null;});map.addEventListener('pointercancel',()=>{drag=null;});
 $('euromap').addEventListener('wheel',ev=>{ev.preventDefault();atlasZoom=clampZoom(atlasZoom+(ev.deltaY<0?.2:-.2));renderAtlas();},{passive:false});
}
function renderAtlas(v,role){
 const actualView=v??f7Observe(session),human=role??session.core.core.humanRole;
 const model=atlasModel(actualView,EUROPE_GEO,{role:human,lens:atlasLens,selected:atlasSelected,query:atlasSearch});
 const hubs=new Set(model.connections.flatMap(x=>[x.from,x.to]));
 for(const t of model.territories){const p=countryNodes.get(t.id);p.classList.toggle('is-eu',t.isEU);p.classList.toggle('is-partner',!t.isEU);p.classList.toggle('is-relevant',t.roleRelevant);p.classList.toggle('is-selected',t.selected);p.classList.toggle('is-dimmed',!t.searchMatch);p.classList.toggle('is-linked',hubs.has(t.id));p.setAttribute('aria-pressed',String(t.selected));}
 const links=$('map-edges');links.replaceChildren();
 for(const link of model.connections){const [sx,sy]=atlasGeom[link.from].center,[ex,ey]=atlasGeom[link.to].center;const mid=(sx+ex)/2,cy=(sy+ey)/2-55;const path=makeSvg('path',{d:`M${sx} ${sy} Q${mid} ${cy} ${ex} ${ey}`,class:'geo-edge'});links.append(path);}
 for(const institution of model.institutions){const [cx,cy]=atlasGeom[institution.country].center;const point=makeSvg('circle',{cx:cx+institution.offset[0],cy:cy+institution.offset[1],r:7,class:'institution-pin','aria-label':institution.label});const title=makeSvg('title');title.textContent=institution.label;point.append(title);links.append(point);}
 const list=$('geo-list'), previous=list.value;list.replaceChildren();let total=0;
 for(const t of model.territories){if(!t.searchMatch)continue;const option=document.createElement('option');option.value=t.id;option.textContent=(t.roleRelevant?'◈ ':'')+t.name;list.append(option);total++;}
 if([...list.options].some(x=>x.value===model.selected))list.value=model.selected;else if(previous&&[...list.options].some(x=>x.value===previous))list.value=previous;
 $('geo-title').textContent=model.selectedTitle;const active=model.territories.find(x=>x.selected);
 $('geo-meta').textContent=active.isEU?'Membro dell’Unione europea · nel mondo geografico':'Paese europeo rappresentato · fuori dal perimetro UE';
 $('geo-relevance').textContent=active.roleRelevant?'Nodo evidenziato dalla prospettiva del personaggio':'Territorio consultabile · non prioritario per questo ruolo';
 $('geo-causality').textContent=active.geometryPrecision==='cartographic_proxy'?'Malta è rappresentata con un simbolo cartografico: la fonte a bassa risoluzione non include il suo poligono.':'Nessun punteggio nazionale inventato: gli indicatori del gioco sono globali finché non esisterà un sottosistema territoriale.';
 $('geo-role').textContent=model.roleTitle;
 $('geo-links').textContent=atlasLens==='RELAZIONI'?'Collegamenti illustrativi di navigazione: non misurano influenza osservata.':atlasLens==='ISTITUZIONI'?'Le competenze seguono l’identità istituzionale del motore, non i confini grafici.':'La cartografia non è il motore causale.';
 $('geo-position').textContent='Selezionato: '+model.selectedTitle;
 $('atlas-identity').textContent='CIE / '+model.worldId.split(':').at(-1)+' / '+names[human];
 renderPinned();
 $('atlas8-scope').textContent=`${model.territories.length} territori · ${total} risultati · lente ${atlasLens.toLowerCase()} · zoom ${Math.round(atlasZoom*100)}%`;
 $('map-viewport').setAttribute('transform',`translate(${470+atlasPanX} ${252+atlasPanY}) scale(${atlasZoom}) translate(-470 -252)`);
 for(const id of ['pan-left','pan-right','pan-up','pan-down'])$(id).disabled=atlasZoom===1;
 for(const b of document.querySelectorAll('[data-lens]'))b.setAttribute('aria-pressed',String(b.dataset.lens===atlasLens));
 $('zoom-in').disabled=atlasZoom===4;$('zoom-out').disabled=atlasZoom===1;
}

initAtlas();initCommandUI();render();

// F8bis: no second engine. A single visible CTA maps observer-scoped plan -> existing F7 reducer.
function renderGuidance(view,role){
 const model=decisionModel(view,role),group=$('hero-plans');group.replaceChildren();
 $('hero-role').textContent=model.roleName+' · LA TUA SCRIVANIA';
 $('hero-title').textContent=model.title;$('hero-prompt').textContent=model.prompt;
 $('hero-tick').textContent=model.phase==='ECONOMIC'?'TRIMESTRE '+session.core.core.economy.quarter+'/8':'PRELUDIO';
 $('hero-context').textContent=model.mission+' '+model.context;
 if(!model.plans.some(p=>p.id===preferredPlan))preferredPlan=model.plans[0]?.id??'COOPERATIVO';
 for(const plan of model.plans){
  const b=add(group,'button','','hero-plan');b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-checked',String(preferredPlan===plan.id));b.setAttribute('data-plan',plan.id);
  add(b,'span',plan.tag,'plan-kicker');add(b,'strong',plan.label,'plan-name');add(b,'span',plan.subtitle,'plan-note');
  b.title=plan.risk;b.onclick=()=>{preferredPlan=plan.id;renderGuidance(view,role);group.querySelector('[data-plan="'+plan.id+'"]')?.focus()};
  b.addEventListener('keydown',ev=>{if(ev.key==='ArrowLeft'||ev.key==='ArrowRight'){ev.preventDefault();const idx=model.plans.findIndex(p=>p.id===plan.id),other=model.plans[(idx+(ev.key==='ArrowRight'?1:-1)+model.plans.length)%model.plans.length];preferredPlan=other.id;renderGuidance(view,role);renderPulse(view,role);group.querySelector('[data-plan="'+other.id+'"]')?.focus()}});
 }
 $('hero-commit').disabled=!model.canAct;
 $('hero-commit').textContent=model.CTA+' →';
 $('hero-details').setAttribute('aria-expanded',String($('advanced-tactics').open));
}
$('hero-commit').addEventListener('click',()=>{
 const view=f7Observe(session),role=session.core.core.humanRole,model=decisionModel(view,role),p=model.plans.find(p=>p.id===preferredPlan);
 if(!p||!validatePlan(view,role,p)){announceUI('Nessuna azione disponibile');return}
 if(p.command.kind==='ECONOMIC'){move=p.command.move;other=p.command.other;strategy=p.command.strategy}
 choose(p.command.choice);
});
$('hero-details').addEventListener('click',()=>{$('advanced-tactics').open=!$('advanced-tactics').open;$('hero-details').setAttribute('aria-expanded',String($('advanced-tactics').open));if($('advanced-tactics').open)$('advanced-tactics').scrollIntoView({block:'start',behavior:'instant'});});
$('advanced-tactics').addEventListener('toggle',()=>{$('hero-details').setAttribute('aria-expanded',String($('advanced-tactics').open))});
renderGuidance(f7Observe(session),session.core.core.humanRole);

// F10: purely presentational progression. The authoritative F7 session is NEVER mutated here.
function renderPulse(view,role){
 const x=playerExperience(view,role);auditExperience(x);
 $('exp-head').textContent=x.phase==='INSTITUTIONAL'?'Le fondamenta della tua storia':x.stageName;
 $('exp-goal').textContent=x.goal;
 $('exp-chapter').textContent=x.phase==='ECONOMIC'?'Q'+Math.min(x.quarter,8)+' / 8 · '+x.chapter:'PRELUDIO';
 $('exp-stage-name').textContent=x.stageName;
 $('exp-stage-note').textContent=x.phase==='ECONOMIC'?`Il progetto ha raggiunto ${x.progress} traguardi; la situazione dipende anche dagli altri attori.`:'Prima si stabiliscono poteri, procedure e garanzie.';
 $('exp-scene').querySelectorAll('.scene-step').forEach(g=>{g.classList.toggle('scene-inactive',Number(g.dataset.minStage)>x.stage)});
 const m=$('exp-metrics');m.replaceChildren();for(const k of x.metrics){const item=add(m,'div','','pulse-metric');add(item,'span',k.label);add(item,'strong',k.value+' / '+k.cap);const bar=add(item,'div','','pulse-meter');bar.setAttribute('role','progressbar');bar.setAttribute('aria-label',k.label);bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax',String(k.cap));bar.setAttribute('aria-valuenow',String(Math.min(k.value,k.cap)));bar.style.setProperty('--level',Math.min(100,Math.round(k.value/k.cap*100))+'%');}
 $('exp-signal').textContent=x.signals.map(s=>s.text).join(' ');
 $('exp-track').replaceChildren();for(const q of x.milestones){const node=add($('exp-track'),'span',String(q.number),'chapter-dot '+q.state);node.title=q.name+' · '+q.state;node.setAttribute('aria-label','Trimestre '+q.number+': '+q.name+' ('+q.state+')');}
 const plan=x.plans.find(p=>p.id===preferredPlan)||x.plans[0];$('exp-preview').textContent=plan?plan.tradeoff+' Le conseguenze precise si conoscono dopo la decisione.':'Episodio concluso: puoi riesaminare le conseguenze o rigiocare.';
}
renderPulse(f7Observe(session),session.core.core.humanRole);
