/** EX02: pre-decision consequences as an OBSERVER-ONLY semantic projection.
 * Statements describe competences, costs and uncertainty; they are NOT predicted outcomes.
 * No direct world, NPC, privateNotes or future-state inputs are accepted.
 */
export const CHOICE_RULESET='CIE-EX02-CHOICE-MEANING-1';
const texts=Object.freeze({
 EXECUTE:{scope:'Puoi chiedere l’esecuzione dell’opera scelta.',cost:'Se eseguita, costa 5 crediti al Tesoro.',uncertainty:'Non è garantita: dipende dalla cassa e da eventuali sospensioni.'},
 OFFER_CREDIT:{scope:'Puoi trasferire fino a 5 crediti dal fondo al Tesoro.',cost:'Il trasferimento crea un debito da rimborsare.',uncertainty:'Il credito non annulla gli atti giudiziari e non garantisce entrambe le opere.'},
 INQUIRE:{scope:'Puoi aprire un controllo parlamentare sull’opera.',cost:'La verifica non autorizza né sospende automaticamente l’esecuzione.',uncertainty:'Altri organi mantengono i propri poteri.'},
 CONVENE:{scope:'Puoi convocare gli organi coinvolti.',cost:'La convocazione non sostituisce un atto autorizzativo.',uncertainty:'L’esecuzione continua a dipendere da risorse e provvedimenti.'},
 STAY:{scope:'Puoi sospendere cautelarmente solo la rete energetica sul fascicolo ammissibile.',cost:'L’opera energetica resta bloccata in questo trimestre.',uncertainty:'La sospensione non blocca automaticamente il porto.'},
 REVIEW:{scope:'Puoi esaminare il fascicolo energetico senza sospendere.',cost:'Non introduci un blocco cautelare con questo ordine.',uncertainty:'L’opera può comunque essere limitata dalle risorse.'},
 HOLD:{scope:'Puoi lasciare invariata la tua posizione in questo turno.',cost:'Non impegni una nuova decisione di tua competenza.',uncertainty:'Altri organi e la manutenzione autonoma possono comunque agire.'}
});
const KNOWN_ROLES=new Set(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']);
export function choiceMeaning(observation,code){
 if(!observation||observation.phase!=='PLANNING'||!KNOWN_ROLES.has(observation.role)||!Array.isArray(observation.choices))throw Error('EX02_SCOPE');
 if(typeof code!=='string'||code.length>70)throw Error('EX02_CODE');
 const legal=observation.choices.find(x=>x.code===code);
 if(!legal||!Object.hasOwn(texts,legal.kind))throw Error('EX02_UNAUTHORIZED_CHOICE');
 const t=texts[legal.kind];const target=legal.target==='NONE'?'nessuna opera':legal.targetLabel;
 return Object.freeze({schema:CHOICE_RULESET,role:observation.role,code,action:legal.title,target,
  scope:t.scope,cost:t.cost,uncertainty:t.uncertainty,
  epistemic:'Le conseguenze effettive verranno calcolate dopo i cinque ordini; questa non è una previsione.',
  source:'AC03 authorized choice contract; no hidden state read.'});
}
