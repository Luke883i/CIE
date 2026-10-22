import {f6Initial,f6Play,f6Observe,f6FastForward,f6Save,f6Restore,f6Counterfactual,F6_ACTIONS} from '../src/reticulum.mjs';
import {V9_CASES} from '../src/v9_registry.mjs';
const $=id=>document.getElementById(id);
const names={COSTANTINO:'Costantino',FINANZIATORE:'Finanziatore',PARLAMENTARE:'Parlamentare',PRESIDENTE:'Presidente',GIUDICE:'Presidente di Corte'};
const economicNames={BUILD_COALITION:'Costruisci coalizione',MOBILIZE_NETWORK:'Mobilita rete',OFFER_CREDIT:'Offri credito',KEEP_LIQUIDITY:'Conserva liquidità',AUTHORIZE_GRANT:'Autorizza sostegno',EXAMINE_BUDGET:'Esamina bilancio',HOST_CIVIC_DIALOGUE:'Dialogo civico',REQUEST_PUBLIC_REPORT:'Richiedi un rapporto',PUBLISH_REASONS:'Pubblica motivazioni',REVIEW_SAFEGUARDS:'Verifica garanzie'};
const actions={INVESTIGATE:['Indaga','+ resilienza e controllo, − velocità'],COOPERATE:['Coopera','+ consenso e capacità, dipende dal dominio'],ACCELERATE:['Accelera','+ attuazione, + rischio e revisione']};
let session=f6Initial({seed:41,humanRole:'COSTANTINO',caseId:'V4/E03'}),strategy='COOPERATE';
const curated=V9_CASES.filter(c=>c.granularity.startsWith('curated'));
for(const c of curated){const o=document.createElement('option');o.value=c.uid;o.textContent=c.uid+' · '+c.title;$('case-pick').append(o);} $('case-pick').value='V4/E03';
function el(parent,tag,text='',cl=''){const x=document.createElement(tag);x.textContent=String(text);if(cl)x.className=cl;parent.append(x);return x;}
function fail(error){$('error').textContent=error;}
function choose(choice){const r=session.core.mode==='ECONOMIC'?f6Play(session,{choice,strategy}):f6Play(session,choice);if(!r.ok)return fail(r.code);session=r.session;$('error').textContent='';$('feedback').textContent='Azione registrata. Causalità e bilanci aggiornati.';render();}
function speed(n){const r=f6FastForward(session,{quarters:n,stopAtCritical:true});if(!r.ok)return fail(r.code);session=r.session;$('error').textContent='';$('feedback').textContent=`${r.moved} trimestri simulati, stop: ${r.stop}`;render();}
function render(){const v=f6Observe(session),eco=v.mode==='ECONOMIC',caseMeta=v.case;const e=session.core.economy;
 $('role-title').textContent=names[session.core.humanRole];$('role-description').textContent='Una prospettiva, un mondo. Le altre persone e istituzioni agiscono in autonomia.';$('world-clock').textContent=`Seed ${session.core.world.seed} · ${eco?'Trimestre '+Math.min(e.quarter,8)+'/8':'Preludio istituzionale'}`;
 $('case-title').textContent=caseMeta.title;$('case-desc').textContent=caseMeta.uid+' · '+caseMeta.mechanism+' · '+caseMeta.granularity+' · '+caseMeta.proofStatus;
 $('chapter').textContent=eco?'RETICOLO V9':'ISTITUZIONI';$('turn-number').textContent=eco?'Q'+e.quarter:'ATTO';$('progress').textContent=eco?e.progress+'/8':'—';$('support').textContent=eco?e.support:'—';$('legitimacy').textContent=eco?e.legitimacy:'—';$('risk').textContent=eco?e.volatility:'—';
 $('decision-title').textContent=eco?(v.ended?'L’episodio è concluso':'Una scelta e le sue conseguenze'):'La costituzione del mondo';$('decision-description').textContent=eco?`Approccio V9: ${strategy}. Ora scegli anche come agire nel tuo ruolo.`:'Prima attraversa le decisioni istituzionali, poi il reticolo entra in gioco.';
 $('v9-actions').replaceChildren();for(const act of F6_ACTIONS){const b=el($('v9-actions'),'button',actions[act][0]);b.title=actions[act][1];b.disabled=!v.actions.includes(act);if(act===strategy)b.classList.add('selected');b.onclick=()=>{strategy=act;render();};}
 if(eco&&!v.ended){let cf;try{cf=f6Counterfactual(session,'COOPERATE','INVESTIGATE');$('counterfactual').textContent='Controfattuale sintetico cooperare vs indagare: '+Object.entries(cf.deltas).map(([k,x])=>k+' '+(x>0?'+':'')+x).join(' · ');}catch{$('counterfactual').textContent='Confronto non disponibile per questa fase.';}}else $('counterfactual').textContent='Gli effetti dipendono dal trimestre e dal caso scelto.';
 $('options').replaceChildren();for(const kind of (eco?v.choices:v.available)){const b=el($('options'),'button','','choice');el(b,'strong',eco?(economicNames[kind]??kind):kind.replaceAll('_',' '));el(b,'small',eco?'Decisione propria del ruolo; tutti gli altri NPC reagiscono.':'Atto istituzionale e conseguenze persistenti.');b.onclick=()=>choose(kind);}
 if(!(eco?v.ended:session.core.world.terminal)){const b=el($('options'),'button','','choice');el(b,'strong','Delega la decisione');el(b,'small','Regola NPC deterministica, nessun LLM');b.onclick=()=>choose(eco?'DELEGATE':'WAIT');}
 if(eco&&v.ended)el($('options'),'p','Finale · '+v.outcome+'. Puoi rigiocare un’altra politica con lo stesso seed.');
 for(const n of [1,2,4])$('skip'+n).disabled=!eco||v.ended;
 $('timeline').replaceChildren();for(const h of [...session.history].reverse().slice(0,6)){const box=el($('timeline'),'div','','timeline-item');el(box,'small',`Q${h.quarter} · ${h.caseId}`);el(box,'strong',h.choice);el(box,'span','T0→T1→T2→T3↔T1→T4↔T0→T5');}
 if(!session.history.length)el($('timeline'),'p','Nessun effetto reticolare ancora applicato.','muted');
 $('ledger').replaceChildren();const facts=eco?{Trimestre:v.quarter,Progresso:v.progress,Consenso:v.support,Produzione:v.production,Resilienza:v.resilience,'Contabilità totale':v.consolidated?.total,'Trasferimento ponte':v.consolidated?.bridge,...v.privateBalances}:{Fase:v.legal?.stage??'',Mandato:v.legal?.incumbent??''};for(const [k,value] of Object.entries(facts)){const row=el($('ledger'),'div');el(row,'span',k);el(row,'strong',value??'—');}
}
$('new').onclick=()=>{try{const seed=Number($('seed').value);const uid=$('case-custom').value.trim()||$('case-pick').value;session=f6Initial({seed,humanRole:$('role').value,caseId:uid});strategy='COOPERATE';$('error').textContent='';render();}catch(e){fail(e.message)}};
for(const n of [1,2,4])$('skip'+n).onclick=()=>speed(n);
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(f6Save(session),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='CIE-F6-replay.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);};
$('import').onchange=async ev=>{try{const file=ev.target.files?.[0];if(!file)return;if(file.size>120000)throw Error('ARCHIVE_TOO_LARGE');session=f6Restore(JSON.parse(await file.text()));$('seed').value=session.core.world.seed;$('role').value=session.core.humanRole;$('case-custom').value=session.caseId;strategy='COOPERATE';$('error').textContent='';render();}catch(e){fail('Replay rifiutato: '+e.message)}finally{ev.target.value=''}};
$('help').onclick=()=>$('instructions').showModal();for(const b of document.querySelectorAll('[data-place]'))b.onclick=()=>$('atlas-info').textContent='Mappa simbolica · geometrie reali in F8. La storia causale è condivisa.';
render();
