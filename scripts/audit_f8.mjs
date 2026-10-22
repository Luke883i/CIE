import fs from 'node:fs';
import {f7Initial,f7Observe,f7Audit} from '../src/strategy.mjs';
import {atlasModel,validateAtlas,geometryIndex,ATLAS_ROLES,ATLAS_LENSES} from '../src/atlas.mjs';
const geo=JSON.parse(fs.readFileSync(new URL('../data/europe-32.geojson',import.meta.url),'utf8'));
validateAtlas(geo);const shapes=geometryIndex(geo);
const report={schema:'CIE-F8-AUDIT-1',ruleset:'CIE-F8-ATLAS-1.0.0',countries:geo.features.length,euCountries:geo.features.filter(x=>x.properties.isEU).length,cartographicProxies:geo.features.filter(x=>x.properties.precision==='cartographic_proxy').map(x=>x.id),roles:ATLAS_ROLES,seedCountPerRole:100,gameWorlds:0,projections:0,geometryPaths:Object.keys(shapes).length,unchangedWorldDigests:0,identityMatches:0,unexpectedPrivateCountryStats:0,failures:[]};
for(const role of ATLAS_ROLES){for(let seed=0;seed<100;seed++){
 const s=f7Initial({seed,humanRole:role});const obs=f7Observe(s),digest=f7Audit(s).digest;report.gameWorlds++;
 for(const lens of ATLAS_LENSES){for(let n=0;n<8;n++){
 const selected=geo.features[(seed*7+n*13)%32].id;
 const m=atlasModel(obs,geo,{role,lens,selected});report.projections++;
 if(m.worldId!==obs.worldId)report.failures.push({role,seed,lens,reason:'IDENTITY_CHANGED'});else report.identityMatches++;
 if(m.territories.some(t=>['treasury','taxRevenue','regionalGDP','partyVotes','judicialDecision'].some(k=>Object.hasOwn(t,k))))report.unexpectedPrivateCountryStats++;
 }}
 if(digest===f7Audit(s).digest)report.unchangedWorldDigests++;else report.failures.push({role,seed,reason:'WORLD_MUTATED'});
 }}
if(report.gameWorlds!==500||report.projections!==12000||report.failures.length||report.unexpectedPrivateCountryStats||report.unchangedWorldDigests!==500)throw Error(JSON.stringify(report));
const out=new URL('../proofs/F8-audit.json',import.meta.url);fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
