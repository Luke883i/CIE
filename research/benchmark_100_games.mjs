/** Desk benchmark: title corpus and UX primitive hypotheses, NOT 100 games personally played.
 * Each family tag is a comparison lens, not a claim of certified mechanics for every title.
 */
export const PRIMITIVES=Object.freeze({
 OBJECTIVE:'visible victory/failure condition',TURN:'bounded turn with end-turn affordance',AUTHORITY:'actor powers and limited competences',BUDGET:'scarce spendable resources',BOARD:'spatial tabletop or map',CARD:'decision/action card',DRILL:'progressive disclosure',FEEDBACK:'visible before/after',LEDGER:'traceable sources and economy',CONFLICT:'counteraction and opposition',STORY:'character event and memory',REPLAY:'replay or scenario retry',SOCIAL:'negotiation and trust',AUTOMATION:'delegation and routines',THREAT:'forecast of a threat',TUTORIAL:'learn by first action',PROGRESSION:'persistent milestones',FOCUS:'one legible problem at once'
});
const GROUPS=[
 ['4X / grand strategy','BOARD,TURN,PROGRESSION,AUTHORITY','Civilization VI;Civilization VII;Stellaris;Crusader Kings III;Europa Universalis IV;Hearts of Iron IV;Victoria 3;Old World;Endless Legend;Humankind'],
 ['Conflitto tattico','BOARD,THREAT,TURN,CONFLICT','Total War: ROME II;Total War: THREE KINGDOMS;Total War: WARHAMMER III;XCOM 2;Into the Breach;Company of Heroes 3;Panzer Corps 2;Foxhole;Terra Invicta;Unity of Command II'],
 ['Politica e istituzioni','AUTHORITY,CARD,SOCIAL,STORY','Suzerain;Democracy 4;The Political Process;Tropico 6;This Is the Police;Yes, Your Grace;Not For Broadcast;Beholder;Papers, Please;Rebel Inc: Escalation'],
 ['Sopravvivenza gestionale','BUDGET,THREAT,FEEDBACK,STORY','Frostpunk;Frostpunk 2;RimWorld;Dwarf Fortress;Oxygen Not Included;This War of Mine;Against the Storm;Timberborn;Banished;Surviving Mars'],
 ['Logistica e reti','BOARD,LEDGER,FEEDBACK,AUTOMATION','Factorio;Satisfactory;Dyson Sphere Program;Anno 1800;Transport Fever 2;OpenTTD;Mini Metro;Mini Motorways;Rail Route;Workers & Resources: Soviet Republic'],
 ['Economia e imprese','BUDGET,LEDGER,PROGRESSION,DRILL','Capitalism Lab;Game Dev Tycoon;Software Inc.;Two Point Hospital;Planet Zoo;Cities: Skylines;Cities: Skylines II;Offworld Trading Company;Big Ambitions;Project Highrise'],
 ['Narrativa e dilemmi','CARD,STORY,SOCIAL,FOCUS','Reigns;Reigns: Her Majesty;80 Days;Citizen Sleeper;Disco Elysium;The Banner Saga;Roadwarden;Pentiment;We. The Revolution;The Life and Suffering of Sir Brante'],
 ['Puzzle e chiarezza','OBJECTIVE,CARD,TUTORIAL,FEEDBACK','Balatro;Slay the Spire;Inscryption;Loop Hero;Stacklands;Dorfromantik;Unpacking;A Little to the Left;The Case of the Golden Idol;Return of the Obra Dinn'],
 ['Boardgame politico-cooperativo','BOARD,AUTHORITY,SOCIAL,CONFLICT','Twilight Imperium;Diplomacy;Twilight Struggle;Pax Pamir: Second Edition;Root;Brass: Birmingham;Gloomhaven;Spirit Island;Pandemic Legacy: Season 1;Terraforming Mars'],
 ['Boardgame economico','BOARD,BUDGET,CARD,TURN','Scythe;Dune: Imperium;Ark Nova;Through the Ages;7 Wonders Duel;Brass: Lancashire;Great Western Trail;Concordia;Food Chain Magnate;Power Grid']
];
export const GAMES=Object.freeze(GROUPS.flatMap(([family,codes,names])=>names.split(';').map((title)=>Object.freeze({title,family,primitiveHypotheses:codes.split(','),evidence:'DESK_CLASSIFICATION_NOT_PLAYTEST'}))));
export const RESEARCH_SOURCES=Object.freeze([
 {label:'BoardGameGeek mechanics catalog / dataset overview',url:'https://solojulian.dev/bgg/',role:'mechanic taxonomy'},
 {label:'SteamDB strategy and grand strategy lists',url:'https://steamdb.info/charts/?tagid=4364',role:'market discovery sample'},
 {label:'Hunicke, LeBlanc, Zubek 2004 — MDA',url:'https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/',role:'mechanics→dynamics→experience'},
 {label:'W3C WCAG 2.2',url:'https://www.w3.org/TR/WCAG22/',role:'a11y acceptance baseline'}
]);
export function benchmarkAudit(){
 if(GAMES.length!==100||new Set(GAMES.map(g=>g.title)).size!==100||new Set(GAMES.map(g=>g.family)).size!==10)throw Error('BENCHMARK_CARDINALITY');
 if(GAMES.some(g=>g.primitiveHypotheses.some(p=>!Object.hasOwn(PRIMITIVES,p))))throw Error('BENCHMARK_PRIMITIVE');
 return Object.freeze({titles:100,families:10,primitiveTypes:Object.keys(PRIMITIVES).length,classification:'Desk heuristic, not 100 empirical playtests',status:'STRUCTURAL_PASS_NOT_EMPIRICAL'});
}
