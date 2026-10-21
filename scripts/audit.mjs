import fs from 'node:fs';
import path from 'node:path';
import {ACTORS,startEpisode,play,saveEpisode,restoreEpisode,observe,auditEpisode,digest} from '../src/episode.mjs';
const count=1000;const wins={};let completed=0;const endings=new Set();let minTick=99,maxTick=0;let replay=0;const anomaly=[];
for(const actor of ACTORS){wins[actor]={};for(let seed=0;seed<count;seed++){
  let game=startEpisode({seed,humanId:actor});const initialHash=digest(game.world);let steps=0;
  while(!game.world.terminal){if(++steps>12)throw Error('DEADLOCK '+actor+' '+seed);const view=observe(game.world,actor);const decision=view.availableActions[(seed+1)%view.availableActions.length]?.type;if(!decision)throw Error('NO_CHOICE');const response=play(game,decision);if(!response.ok)throw Error('ACTION_REJECTED');game=response.session;}
  const a=auditEpisode(game.world);if(!a.valid)throw Error('AUDIT_FALSE');const restored=restoreEpisode(saveEpisode(game));if(digest(restored.world)!==digest(game.world))throw Error('REPLAY_DIVERGED');replay++;completed++;wins[actor][game.world.ending]=(wins[actor][game.world.ending]??0)+1;endings.add(game.world.ending);minTick=Math.min(minTick,game.world.tick);maxTick=Math.max(maxTick,game.world.tick);
}}
const report={schema:'CIE-F2-AUDIT-1',ruleset:'CIE-F2-1.0.0',totalEpisodes:completed,seedCountPerRole:count,roles:ACTORS,fullyReplayed:replay,terminalOutcomes:[...endings].sort(),endingsByRole:wins,minTick,maxTick,ledgerInvariants:completed,replayInvariants:replay,anomalies:anomaly,claims:{supported:['single-player deterministic five-perspective toy episode','autonomous four NPC per session','seed-sensitive choices','closed-ledger and replay within model'],notCertified:['external institutional realism','full semantic V9 coverage','browser security against local attacker','full release DoD','independent third-party certification']}};
const file=path.resolve('proofs/F2-audit.json');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
