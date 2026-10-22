import {f7Initial,f7Play,f7Observe,f7FastForward,f7Save,f7Restore,f7Counterfactual,F7_MOVES} from '../src/strategy.mjs';
import {F6_ACTIONS} from '../src/reticulum.mjs';
import {V9_CASES} from '../src/v9_registry.mjs';
const $=id=>document.getElementById(id);
const names={COSTANTINO:'Costantino',FINANZIATORE:'Finanziatore',PARLAMENTARE:'Parlamentare',PRESIDENTE:'Presidente',GIUDICE:'Presidente di Corte'};
const econNames={BUILD_COALITION:'Costruisci coalizione',MOBILIZE_NETWORK:'Mobilita rete',OFFER_CREDIT:'Offri credito',KEEP_LIQUIDITY:'Conserva liquidità',AUTHORIZE_GRANT:'Autorizza sostegno',EXAMINE_BUDGET:'Esamina bilancio',HOST_CIVIC_DIALOGUE:'Dialogo civico',REQUEST_PUBLIC_REPORT:'Rapporto pubblico',PUBLISH_REASONS:'Pubblica motivazioni',REVIEW_SAFEGUARDS:'Verifica garanzie'};
const approach={INVESTIGATE:'Indaga',COOPERATE:'Coopera',ACCELERATE:'Accelera'};
const moveNames={PROPOSE_PACT:'Proponi un patto',DEMAND_CONCESSION:'Chiedi concessioni',PUBLIC_HEARING:'Audizione pubblica',DECLINE:'Non negoziare',EXIT_PACT:'Abbandona il patto'};
let session=f7Initial({seed:41,humanRole:'COSTANTINO',caseId:'V4/E03'}),move='PROPOSE_PACT',other='PARLAMENTARE',strategy='COOPERATE';
const cases=V9_CASES.filter(x=>x.granularity.startsWith('curated'));
for(const c of cases){const o=document.createElement('option');o.value=c.uid;o.textContent=c.uid+' · '+c.title;$('case-pick').append(o)}$('case-pick').value='V4/E03';
function add(parent,tag,text='',cls=''){const el=document.createElement(tag);el.textContent=String(text);if(cls)el.className=cls;parent.append(el);return el;}
function fail(msg){$('error').textContent=String(msg)}
function pickMove(x){move=x;render()}
function choose(choice){const eco=session.core.core.mode==='ECONOMIC';const input=eco?{choice,move,other,strategy}:choice;const r=f7Play(session,input);if(!r.ok)return fail(r.code);session=r.session;fail('');$('feedback').textContent=r.decision?`Trattativa: ${r.decision.outcome}. ${r.decision.reason}. Fiducia ${r.decision.trustDelta>=0?'+':''}${r.decision.trustDelta}.`:'Atto istituzionale registrato.';render();}
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
}
$('counterpart').onchange=()=>{other=$('counterpart').value;render()};
$('new').onclick=()=>{try{session=f7Initial({seed:Number($('seed').value),humanRole:$('role').value,caseId:$('case-custom').value.trim()||$('case-pick').value});move='PROPOSE_PACT';other='PARLAMENTARE';strategy='COOPERATE';fail('');$('feedback').textContent='';render()}catch(e){fail(e.message)}};
for(const n of [1,2,4])$('skip'+n).onclick=()=>speed(n);
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(f7Save(session),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='CIE-F7-replay.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
$('import').onchange=async ev=>{try{const file=ev.target.files?.[0];if(!file)return;if(file.size>140000)throw Error('FILE_TOO_LARGE');session=f7Restore(JSON.parse(await file.text()));$('seed').value=session.core.core.world.seed;$('role').value=session.core.core.humanRole;$('case-custom').value=session.core.caseId;fail('');render()}catch(e){fail('Replay respinto: '+e.message)}finally{ev.target.value=''}};
$('help').onclick=()=>$('instructions').showModal();for(const b of document.querySelectorAll('[data-place]'))b.onclick=()=>$('atlas-info').textContent='Rappresentazione simbolica; GIS in F8.';
render();
