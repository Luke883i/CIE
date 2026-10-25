const $=id=>document.getElementById(id);let credential=null;let current=null;let operator=false;
const say=x=>{$('message').textContent=String(x)};
async function api(path,method='GET',body=null){const r=await fetch(path,{method,headers:{'Authorization':'Bearer '+credential,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!r.ok)throw Error(data.code||'REQUEST_FAILED');return data;}
const mk=(tag,txt,cls)=>{const n=document.createElement(tag);n.textContent=String(txt);if(cls)n.className=cls;return n;};
function present(v){current=v;operator=!v.role;$('who').textContent=operator?'OPERATORE':'MANDATO · '+v.role;
 $('desk-title').textContent=operator?'Stato del commit autorevole':'La tua scrivania · '+v.role;
 $('plans').hidden=operator;$('ops').hidden=!operator;
 const s=$('situation');s.replaceChildren();const vals=operator?[['Stato',v.phase],['Ordini',v.submittedCount+' / '+v.requiredCount],['Revisione',v.revision]]:[['Trimestre',v.quarter],['Fase',v.phase],['Tesoro',v.treasury],['Presentati',v.submittedCount+' / 5'],['Tuo ordine',v.selfSubmitted?'Registrato':'Da decidere'],['Fascicolo',v.caseStatus]];
 for(const [n,val] of vals){const box=mk('div','');box.append(mk('small',n),mk('strong',val));s.append(box)}
 $('events').replaceChildren();$('comics').replaceChildren();if(!operator){const sel=$('orders');sel.replaceChildren();for(const o of v.available){const option=document.createElement('option');option.value=JSON.stringify(o);option.textContent=o.kind+' · '+o.target;sel.append(option)}
 $('submit').disabled=v.selfSubmitted||v.phase!=='PLANNING';for(const ev of v.events) $('events').append(mk('div',ev.id+' · '+ev.kind+' · '+ev.detail,'event'));
 for(const c of v.comics){const card=mk('article','', 'comic');card.append(mk('h4',c.title),mk('p',c.caption),mk('small',c.sourceEventIds.join(', ')));$('comics').append(card)}
 }else{$('readiness').textContent=v.missingRoles.length?'Mancano: '+v.missingRoles.join(', '):'Tutti gli ordini presenti';$('resolve').disabled=v.phase!=='PLANNING'||!!v.missingRoles.length;
 $('revoked').replaceChildren();for(const role of ['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE'].filter(x=>!v.revokedRoles.includes(x))){const option=document.createElement('option');option.value=role;option.textContent=role;$('revoked').append(option);}}
}
async function refresh(){const v=await api('/api/view');present(v);}
$('connect').onclick=async()=>{credential=$('token').value.trim();$('token').value='';try{await refresh();$('signin').hidden=true;$('desk').hidden=false;$('login-error').textContent='';}catch(e){credential=null;$('login-error').textContent='Accesso negato: '+e.message}};
$('logout').onclick=()=>{credential=null;current=null;$('signin').hidden=false;$('desk').hidden=true;$('message').textContent='';};
$('submit').onclick=async()=>{try{const order=JSON.parse($('orders').value);const r=await api('/api/order','POST',{key:crypto.randomUUID(),order,expectedRevision:current.revision});await refresh();say(r.duplicate?'Ordine già registrato':'Ordine registrato: il mondo non è ancora avanzato.');}catch(e){say('Ordine respinto: '+e.message)}};
$('resolve').onclick=async()=>{try{const r=await api('/api/commit','POST',{key:crypto.randomUUID(),expectedRevision:current.revision});await refresh();say('Trimestre risolto · '+r.receipt.events.length+' eventi · SHA '+r.stateSha.slice(0,16))}catch(e){say('Commit rifiutato: '+e.message)}};
$('revoke').onclick=async()=>{try{const role=$('revoked').value;await api('/api/revoke','POST',{role,key:crypto.randomUUID(),reason:'MANDATE_EXPIRED'});await refresh();say('Mandato revocato: '+role+'. Il suo ordine è diventato HOLD.')}catch(e){say('Revoca rifiutata: '+e.message)}};
