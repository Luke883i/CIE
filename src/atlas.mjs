/** F8 geo-presentation contract.
 * This module never owns or changes world state. Its purpose is to derive
 * deterministic, detached NAVIGATION from a role-scoped game observation.
 * There are deliberately no territorial economic/political indicators: the
 * canonical F7 game does not yet model those territorial stocks.
 */
export const ATLAS_RULESET='CIE-F8-ATLAS-1.0.0';
export const ATLAS_ROLES=Object.freeze(['COSTANTINO','FINANZIATORE','PARLAMENTARE','PRESIDENTE','GIUDICE']);
export const ATLAS_LENSES=Object.freeze(['TERRITORI','ISTITUZIONI','RELAZIONI']);
export const ATLAS_INSTITUTIONS=Object.freeze([{id:'INITIATIVE',label:'Iniziativa costituente fittizia',country:'BEL',offset:[-7,-12]},{id:'FINANCE',label:'Rete finanziaria simulata',country:'DEU',offset:[12,-12]},{id:'PARLIAMENT',label:'Assemblea fittizia',country:'ITA',offset:[-10,-12]},{id:'PRESIDENCY',label:'Presidenza fittizia',country:'ITA',offset:[8,0]},{id:'COURT',label:'Corte fittizia',country:'ITA',offset:[-10,11]}]);
const ROLE_HUB=Object.freeze({COSTANTINO:'BEL',FINANZIATORE:'DEU',PARLAMENTARE:'ITA',PRESIDENTE:'ITA',GIUDICE:'ITA'});
const ROLE_LINKS=Object.freeze({COSTANTINO:['BEL','FRA','DEU','ITA','POL'],FINANZIATORE:['DEU','FRA','NLD','CHE','ITA'],PARLAMENTARE:['ITA','BEL','FRA','DEU'],PRESIDENTE:['ITA','BEL','DEU','FRA'],GIUDICE:['ITA','BEL','FRA','DEU']});
const ITALIAN_REFERENTS=Object.freeze({COSTANTINO:'Iniziativa europea',FINANZIATORE:'Capitale e interlocutori',PARLAMENTARE:'Assemblea e mandato',PRESIDENTE:'Presidenza e garanzie',GIUDICE:'Corte e procedimenti'});
export function validateAtlas(geo){
 if(!geo||geo.schema!=='CIE-GEO-F8-1'||geo.type!=='FeatureCollection'||!Array.isArray(geo.features)||geo.features.length!==32)throw Error('F8_GEOGRAPHY_SCHEMA');
 const seen=new Set();for(const f of geo.features){
  if(!/^[A-Z]{3}$/.test(f?.id)||seen.has(f.id)||typeof f.properties?.name!=='string'||typeof f.properties?.isEU!=='boolean'||!['Polygon','MultiPolygon'].includes(f.geometry?.type))throw Error('F8_GEOGRAPHY_FEATURE');seen.add(f.id);
  const walk=(v)=>{if(!Array.isArray(v))throw Error('F8_COORDINATES');if(v.length===2&&v.every(Number.isFinite)){if(v[0]<0||v[0]>950||v[1]<0||v[1]>500)throw Error('F8_COORD_BOUNDS');return;}for(const x of v)walk(x);};walk(f.geometry.coordinates);
 }
 return true;
}
export function shapePath(geometry){
 if(!geometry||!['Polygon','MultiPolygon'].includes(geometry.type))throw Error('F8_SHAPE');
 const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;
 return polygons.map(poly=>poly.map(ring=>ring.map(([x,y],i)=>(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)).join(' ')+'Z').join(' ')).join(' ');
}
export function atlasModel(observation,geo,{role,lens='TERRITORI',selected='ITA',query=''}={}){
 validateAtlas(geo);
 if(!ATLAS_ROLES.includes(role)||role!==observation?.role||!ATLAS_LENSES.includes(lens)||typeof observation.worldId!=='string'||typeof query!=='string'||query.length>80)throw Error('F8_PROJECTION_UNAUTHORIZED');
 if(!geo.features.some(f=>f.id===selected))throw Error('F8_UNKNOWN_TERRITORY');
 const highlights=ROLE_LINKS[role];const q=query.trim().toLocaleLowerCase('it');
 const countryList=geo.features.map(f=>({id:f.id,name:f.properties.name,isEU:f.properties.isEU,geometryPrecision:f.properties.precision,roleRelevant:highlights.includes(f.id),selected:f.id===selected,searchMatch:!q||f.id.toLowerCase().includes(q)||f.properties.name.toLocaleLowerCase('it').includes(q)}));
 const active=countryList.find(t=>t.selected),hub=ROLE_HUB[role];
 return structuredClone({ruleset:ATLAS_RULESET,worldId:observation.worldId,role,lens,selected,hub,selectedTitle:active.name,scope:'NAVIGATION_ONLY_NOT_TERRITORIAL_EFFECTS',institutions:lens==='ISTITUZIONI'?ATLAS_INSTITUTIONS:[],roleTitle:ITALIAN_REFERENTS[role],territories:countryList,connections:(lens==='RELAZIONI'?highlights.filter(id=>id!==hub).map(id=>({from:hub,to:id,kind:'illustrative_role_navigation_not_observed_influence'})):[]),disclaimer:'Contorni Natural Earth 110m; Malta proxy. Evidenze e punteggi nazionali NON disponibili nel motore F7: la lente rappresenta navigazione e rilevanza, non effetti causali locali.',globalSnapshot:{quarter:observation.quarter??null,mode:observation.mode,progress:typeof observation.progress==='number'?observation.progress:null}});
}
export function geometryIndex(geo){validateAtlas(geo);return Object.fromEntries(geo.features.map(f=>[f.id,{path:shapePath(f.geometry),center:centerOf(f.geometry)}]));}
function centerOf(g){let points=[];const polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;for(const poly of polys)for(const p of poly[0])points.push(p);const sum=points.reduce((a,p)=>[a[0]+p[0],a[1]+p[1]],[0,0]);return [sum[0]/points.length,sum[1]/points.length].map(n=>+n.toFixed(2));}
export function clampZoom(zoom){if(!Number.isFinite(zoom))throw Error('F8_BAD_ZOOM');return Math.max(1,Math.min(4,+zoom.toFixed(2)));}
