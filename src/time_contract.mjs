/** Pure scheduler contract for eventual server-driven persistence, NO background claim. */
export const TIME_CONTRACT='CIE-CLOCK-1';
export function dueWindow({trustedNowMs,committedAtMs,intervalMs=3600000,maxTicks=4,revision=0}={}){
 if(![trustedNowMs,committedAtMs,intervalMs,maxTicks,revision].every(Number.isSafeInteger)||intervalMs<=0||maxTicks<1||maxTicks>100||revision<0||trustedNowMs<committedAtMs)throw Error('INVALID_CLOCK_INPUT');
 const due=Math.floor((trustedNowMs-committedAtMs)/intervalMs);const ticks=Math.min(due,maxTicks);return {schema:TIME_CONTRACT,due,ticks,remaining:due-ticks,expectedRevision:revision,newCommittedAtMs:committedAtMs+ticks*intervalMs,leaseKey:`rev-${revision}:ticks-${ticks}`};}
export function acceptLease(state,claim){if(!state||!claim||state.revision!==claim.expectedRevision||claim.ticks<1||!Number.isSafeInteger(claim.ticks))return {ok:false,code:'STALE_OR_EMPTY_LEASE'};return {ok:true,next:{...state,revision:state.revision+claim.ticks,committedAtMs:claim.newCommittedAtMs}};}
