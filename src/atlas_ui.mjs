/** F8 UX-only commands/bookmarks; never reads raw game state or invokes game reducers. */
export const COMMAND_LENSES=Object.freeze(['TERRITORI','ISTITUZIONI','RELAZIONI']);
const FOCUSES=Object.freeze([{id:'atlas',label:'Atlante europeo',hint:'Vai alla mappa'},{id:'decision',label:'Decisioni',hint:'Vai alla scrivania'},{id:'diplomacy',label:'Trattative',hint:'Vai alle negoziazioni'},{id:'journal',label:'Cronaca',hint:'Vai al diario'}]);
export function commandCatalog(geo){
 if(!geo||!Array.isArray(geo.features)||geo.features.length!==32)throw Error('UI_GEO_INVALID');
 return structuredClone([
  ...FOCUSES.map(x=>({id:'jump:'+x.id,kind:'jump',target:x.id,label:x.label,detail:x.hint})),
  ...COMMAND_LENSES.map(x=>({id:'lens:'+x,kind:'lens',target:x,label:'Lente: '+x.charAt(0)+x.slice(1).toLocaleLowerCase('it'),detail:'Cambia la visualizzazione'})),
  ...geo.features.map(f=>({id:'territory:'+f.id,kind:'territory',target:f.id,label:f.properties.name,detail:'Territorio · '+(f.properties.isEU?'UE':'Europa')}))
 ]);
}
export function matchCommands(catalog,query,limit=9){
 if(!Array.isArray(catalog)||typeof query!=='string'||query.length>80||!Number.isSafeInteger(limit)||limit<1||limit>40)throw Error('UI_SEARCH_INVALID');
 const norm=s=>String(s).toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
 const q=norm(query);return catalog.filter(x=>norm(x.label).includes(q)||norm(x.target).includes(q)||norm(x.detail).includes(q)).slice(0,limit).map(x=>({...x}));
}
export function togglePinned(current,id,ids,max=5){
 if(!Array.isArray(current)||!Array.isArray(ids)||!ids.includes(id)||new Set(current).size!==current.length||current.some(x=>!ids.includes(x))||!Number.isSafeInteger(max)||max<1||max>10)throw Error('UI_BOOKMARK_INVALID');
 if(current.includes(id))return current.filter(x=>x!==id);
 return current.length<max?[...current,id]:[...current.slice(1),id];
}
export function uiSnapshot(visible){
 if(!visible||typeof visible.worldId!=='string')throw Error('UI_OBSERVATION_INVALID');
 return {worldId:visible.worldId,role:visible.role,mode:visible.mode,quarter:visible.quarter??null,ended:!!visible.ended};
}
