"""Build the offline country geometry from Natural Earth low-res, no runtime dependency.
Natural Earth public domain: https://www.naturalearthdata.com/about/terms-of-use/
"""
from pathlib import Path
import argparse
import json
import geopandas as gpd
from shapely.geometry import box, Point, mapping
from shapely.ops import transform
p='/opt/pyvenv/lib/python3.13/site-packages/pyogrio/tests/fixtures/naturalearth_lowres/naturalearth_lowres.shp'
parser=argparse.ArgumentParser(description='Rebuild committed offline Natural Earth 110m projection. Supply exact source shapefile for external use.')
parser.add_argument('--source',default=p,help='Path to Natural Earth 110m admin-0 shapefile')
df=gpd.read_file(parser.parse_args().source)
regions={'AUT':'Austria','BEL':'Belgio','BGR':'Bulgaria','HRV':'Croazia','CYP':'Cipro','CZE':'Cechia','DNK':'Danimarca','EST':'Estonia','FIN':'Finlandia','FRA':'Francia','DEU':'Germania','GRC':'Grecia','HUN':'Ungheria','IRL':'Irlanda','ITA':'Italia','LVA':'Lettonia','LTU':'Lituania','LUX':'Lussemburgo','MLT':'Malta','NLD':'Paesi Bassi','POL':'Polonia','PRT':'Portogallo','ROU':'Romania','SVK':'Slovacchia','SVN':'Slovenia','ESP':'Spagna','SWE':'Svezia','GBR':'Regno Unito','NOR':'Norvegia','CHE':'Svizzera','UKR':'Ucraina','SRB':'Serbia'}
EU=set(list(regions)[:27]);bbox=box(-26,33,46,72.7);feat=[]
for code,name in regions.items():
 if code=='MLT':g=Point(14.37,35.94).buffer(0.085,resolution=12)
 else:
  rows=df[df['name']==('France' if code=='FRA' else 'Norway')] if code in ['FRA','NOR'] else df[df['iso_a3']==code]
  assert len(rows)==1,(code,len(rows));g=rows.iloc[0].geometry
 g=g.intersection(bbox).simplify(.045,preserve_topology=True);assert not g.is_empty,code
 def convert(x,y,z=None):return ((x+26)*13.05,(72.7-y)*12.5)
 projected=transform(convert,g)
 feat.append({'type':'Feature','id':code,'properties':{'name':name,'isEU':code in EU,'precision':('cartographic_proxy' if code=='MLT' else 'naturalearth_110m'),'geoBounds':[round(v,2) for v in g.bounds]},'geometry':mapping(projected)})
obj={'type':'FeatureCollection','schema':'CIE-GEO-F8-1','projection':'equirectangular fixed viewBox pixels; no distance metric','source':'Natural Earth admin-0 110m public domain with Malta proxy; transformed and simplified at build time','features':feat}
out=Path(__file__).resolve().parents[1]/'data/europe-32.geojson';out.write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':'))+'\n')
print('GEO',len(feat),out.stat().st_size)
