import json,gzip,hashlib
from pathlib import Path
root=Path(__file__).resolve().parent
repo=root.parent
graph_bytes=(repo/'convergence/assurance/holistic_reticulum_ac04.json.gz').read_bytes()
g=json.loads(gzip.decompress(graph_bytes))
gates=[{'id':n['id'],'name':n['label'],'state':'OPEN','verifiedEvidence':[]} for n in g['nodes'] if n.get('type')=='GLOBAL_GATE']
assert len(gates)==32
W=[
('ICTC01','Baseline, scopes and evidence governance',[],['GATE-G32'],3,5,4,'Provenance and immutable source snapshots; not a product certificate.'),
('ICTC02','Five-human constitution, mandates and 0-N orders',['ICTC01'],['GATE-G01','GATE-G03','GATE-G04'],8,5,5,'One shared world, five valid mandates, forbidden order inert.'),
('ICTC03','Twelve domains, scarce stock/flow economy',['ICTC02'],['GATE-G06','GATE-G07','GATE-G08'],8,5,5,'Double-entry and resource conservation under adversarial orders.'),
('ICTC04','Territories, cohorts and distribution',['ICTC03'],['GATE-G09','GATE-G10'],7,4,5,'A traced, differentiated effect per affected cohort and territory.'),
('ICTC05','Atomic joint transitions and replay',['ICTC02','ICTC03'],['GATE-G02','GATE-G05'],8,5,5,'120 arrival permutations and post-crash replay equal.'),
('ICTC06','Persistent server, role privacy and security',['ICTC05'],['GATE-G21','GATE-G22'],8,5,5,'Five separate sessions, TLS candidate, no private field leakage.'),
('ICTC07','NPC agency, war and regime shifts',['ICTC04','ICTC05'],['GATE-G11','GATE-G12'],8,5,5,'War-to-peace transitions and active opposition not pre-scripted.'),
('ICTC08','Complete campaigns and differentiated goals',['ICTC07'],['GATE-G13','GATE-G14'],8,5,5,'16 quarters, five roles, replay and non-compensable endings.'),
('ICTC09','Scenario and grammar factory',['ICTC07','ICTC08'],['GATE-G16','GATE-G17'],6,4,4,'At least twelve distinct scenarios valid, reachable and replayable.'),
('ICTC10','Narrative provenance and adult graphic art',['ICTC04','ICTC06'],['GATE-G15','GATE-G25'],6,4,4,'Panels supported by role-visible event IDs and comprehensible fantasy.'),
('ICTC11','Game balance and no dominant strategies',['ICTC08','ICTC09'],['GATE-G18','GATE-G26'],9,5,5,'No trivial fixed policy wins across adversarial seed/roles.'),
('ICTC12','Turntable UX, tutorial, accessibility and performance',['ICTC08','ICTC10'],['GATE-G19','GATE-G20','GATE-G27','GATE-G28'],7,5,5,'Decision first, readable outcomes, mobile and assistive tech audit.'),
('ICTC13','Human playtesting, consent and community safety',['ICTC11','ICTC12'],['GATE-G23','GATE-G29'],9,5,5,'Pre-registered human study, role comprehension and safe interaction.'),
('ICTC14','Reproducible release and operation',['ICTC06','ICTC09','ICTC13'],['GATE-G24','GATE-G30','GATE-G31'],9,5,5,'Full SBOM/license/rights and deploy/restore/rollback runbook exercised.')]
items=[{'id':id,'title':title,'dependsOn':deps,'gates':gs,'weight':weight,'impact':impact,'uncertainty':uncertainty,'state':'OPEN','evidence':[], 'falsifier':falsifier,'owner':'UNASSIGNED','reviewer':'UNASSIGNED'} for id,title,deps,gs,weight,impact,uncertainty,falsifier in W]
assert sorted(x for item in items for x in item['gates'])==sorted(x['id'] for x in gates)
reg={'schema':'CIE-ICTC-GOV-1','version':'0.1.0','baselineMainSha':'0831c0525d47ed81853441a58e5cf73d2f22d5f1','baseGraphSha256':hashlib.sha256(graph_bytes).hexdigest(),'referenceGraph':'convergence/assurance/holistic_reticulum_ac04.json.gz','methodology':'ICTC is CIE project-local shorthand for Intent-Contract-Test-Closure, not a claimed published standard','humanReleaseApproval':False,'releaseState':'BLOCK','workPackages':items,'gates':gates,'proofs':[], 'scenarioPlanning':{'deliveredCapacityPerIteration':[1.25,2,3],'integrationReserve':6,'humanCycles':4,'stabilizationReserve':8}, 'convergenceHistory':[]}
(root/'registry.json').write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n')
