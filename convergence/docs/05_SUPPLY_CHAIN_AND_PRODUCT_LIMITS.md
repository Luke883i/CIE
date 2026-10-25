# AC-04 · Engineering supply-chain inventory (partial, not attested product SBOM)

| Component | Origin | Version/assurance | Risk |
|---|---|---|---|
| CIE F7 + F12 UI snapshot | Luke883i/CIE at confirmed 21a93879... source blob pins | Seven main source files exact; snapshot comes from prior archive | Full provenance/licensing of all artifacts not audited |
| AC03 Golden Crisis | Frozen AC03 published sandbox archive | Original SHA256 in manifest; internal AC01/AC02 lineage | Isolated from real CIE gameplay |
| Node.js | System executable | Node >=22.13; node:sqlite experimental | Breaking engine changes; no vetted deployment binary |
| SQLite | Node builtin binding | WAL, FULL sync in local FS tests | No hosted replication/backup/security assurance |
| Python | System executable | Native stdlib QA and HTTP smoke | Packaging/reproducibility across target OS unresolved |
| HTML/CSS/ES modules | Original AC04 | CSP, loopback-only demos | No comprehensive WCAG audit or real browser HTTP smoke |
| INK & BLEU infographic | Original SVG authored locally | Source available in bundle | Full asset pipeline, fonts/licensing and comics validation incomplete |

No third-party runtime NPM dependencies are introduced. An actual production SBOM must include OS image, transitive dependencies, third-party asset provenance, vulnerabilities, signed build provenance and a review of license obligations. `package.json` alone is insufficient. Never use the loopback bearer-token demo on the public internet.
