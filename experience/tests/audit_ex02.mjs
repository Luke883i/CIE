import {writeFileSync} from 'node:fs';
import {newEpisode,episodeView,submitChoice,episodeResult,replayEpisode,PLAYER_ROLES} from '../episode.mjs';
import {choiceMeaning} from '../choice_contract.mjs';
import {digest} from '../../convergence/ac03/src/golden_crisis.mjs';
const plans=[
 {COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},FINANZIATORE:{kind:'OFFER_CREDIT',target:'P-ENERGY'},GIUDICE:{kind:'REVIEW',target:'P-ENERGY'}},
 {COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},FINANZIATORE:{kind:'HOLD',target:'NONE'},GIUDICE:{kind:'REVIEW',target:'P-ENERGY'}},
 {COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},FINANZIATORE:{kind:'OFFER_CREDIT',target:'P-ENERGY'},GIUDICE:{kind:'STAY',target:'P-ENERGY'}}
];
const report={schema:'CIE-EX02-ADVERSARIAL-1',seeds:200,scenarios:0,legalPreviews:0,roleViews:0,invalidPreviewsRejected:0,noMutationFailures:0,replayFailures:0,ledgerFailures:0,unsourcedPanels:0,globalRelease:'BLOCK',humanParticipants:0};
for(let seed=1;seed<=200;seed++)for(const plan of plans){
 let e=newEpisode(seed);report.scenarios++;
 for(const role of PLAYER_ROLES){const v=episodeView(e),before=digest(e.world);report.roleViews++;
  for(const c of v.choices){const m=choiceMeaning(v,c.code);if(!m.epistemic.includes('non è una previsione'))throw Error('EX02_FALSE_CERTAINTY');report.legalPreviews++;}
  try{choiceMeaning(v,'ILLEGAL|P-PORT');throw Error('EX02_FALSE_ACCEPT')}catch(err){if(err.message==='EX02_FALSE_ACCEPT')throw err;report.invalidPreviewsRejected++;}
  if(digest(e.world)!==before)report.noMutationFailures++;
  const r=submitChoice(e,plan[role]??{kind:'HOLD',target:'NONE'});if(!r.ok)throw Error('EX02_ACTION_'+r.code);e=r.episode;
 }
 if(!replayEpisode(e).ok)report.replayFailures++;
 const r=episodeResult(e);if(Object.values(r.balances).reduce((a,b)=>a+b,0)!==24)report.ledgerFailures++;
 if(r.comics.some(c=>c.sourceEventIds.some(id=>!r.events.some(ev=>ev.id===id))))report.unsourcedPanels++;
}
if(report.noMutationFailures||report.replayFailures||report.ledgerFailures||report.unsourcedPanels)throw Error('EX02_AUDIT_FAIL');
writeFileSync(new URL('../proofs/EX02-audit.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
