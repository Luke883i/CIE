import {writeFileSync,mkdirSync} from 'node:fs';
import {runEpisode,episodeResult,replayEpisode} from '../episode.mjs';
const plans={full:{COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},FINANZIATORE:{kind:'OFFER_CREDIT',target:'P-ENERGY'},GIUDICE:{kind:'REVIEW',target:'P-ENERGY'}},stay:{COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},FINANZIATORE:{kind:'OFFER_CREDIT',target:'P-ENERGY'},GIUDICE:{kind:'STAY',target:'P-ENERGY'}},scarce:{COSTANTINO:{kind:'EXECUTE',target:'P-ENERGY'},GIUDICE:{kind:'REVIEW',target:'P-ENERGY'}}};
const result={schema:'CIE-EX01-AUDIT-1',seeds:320,campaigns:0,full:0,partial:0,loans:0,courtStays:0,scarcity:0,sourceFailures:0,balanceFailures:0,replayFailures:0,globalRelease:'BLOCK'};
for(let seed=1;seed<=320;seed++)for(const plan of Object.values(plans)){
 const e=runEpisode(seed,plan),v=episodeResult(e);result.campaigns++;if(v.complete)result.full++;else result.partial++;if(v.loan)result.loans++;if(v.courtStay)result.courtStays++;if(v.blocked.some(b=>b.code==='TREASURY_INSUFFICIENT'))result.scarcity++;
 if(Object.values(v.balances).reduce((a,b)=>a+b,0)!==24)result.balanceFailures++;
 if(!replayEpisode(e).ok)result.replayFailures++;
 if(v.comics.some(x=>x.sourceEventIds.some(id=>!v.events.some(y=>y.id===id))))result.sourceFailures++;
}
if(result.balanceFailures||result.replayFailures||result.sourceFailures||result.full!==320||result.courtStays!==320||result.scarcity!==320)throw Error('EX01_AUDIT_FAILED');
mkdirSync(new URL('../proofs/',import.meta.url),{recursive:true});writeFileSync(new URL('../proofs/EX01-audit.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(result);
