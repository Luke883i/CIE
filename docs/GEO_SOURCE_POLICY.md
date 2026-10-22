# Geodata and illustrations — source/license manifest

**Geodata**: Natural Earth low-resolution admin-0 countries, public domain: https://www.naturalearthdata.com/about/terms-of-use/ . Used the `naturalearth_lowres` fixture bundled with `pyogrio` for local materialization; the upstream source is Natural Earth. Source file type: shapefile with .dbf, .shx, .prj and .cpg companions. `scripts/build_geo.py --source /path/to/naturalearth_lowres.shp` rebuilds the derived JSON, provided compatible Python/geospatial dependencies. Runtime does not require Python, a shapefile reader, tiles or internet.

**Transformation**: 32 supported countries (27 EU + GBR, NOR, CHE, UKR, SRB); geographical clip [-26, 33, 46, 72.7] degrees, simplified 0.045 degrees, fixed pixel transforms x=(longitude+26)*13.05; y=(72.7-latitude)*12.5. The clipping excludes remote overseas geographies and does not change claimed constitutional jurisdiction. 1:110m generalized geometries have limitations; **Malta** is explicitly a cartographic proxy generated as a small circular marker rather than a fabricated coast. The graphic is for strategic context and navigation, not border adjudication.

**Illustrations**: `assets/illustrations/cie-mandate.svg` and `cie-diplomacy.svg` are original programmatically authored vector assets created for this seed, not scraped from third parties, with SVG text alternatives. No external fonts, proprietary icons, sound or remote image dependencies are introduced by F8.

**Policy**: Keep source acknowledgments in UI and docs; record byte-level SHA-256 in delivery manifest. No license is granted over the user's full project code by the public-domain status of the map. Legal ownership and release license for CIE remain to be selected before public deployment (F11).
