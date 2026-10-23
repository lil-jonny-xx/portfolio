# Implementation plan

Portfolio for Jonathan V Paul. Next.js 16 (App Router), React 19, TypeScript strict,
Tailwind CSS 4 plus CSS custom properties, Lucide icons, Playwright for browser tests.
No animation library: every motion in this site is a CSS transition or a small
IntersectionObserver / requestAnimationFrame hook, so a second dependency would buy nothing.

## What was inspected first

| Source | Finding | Used as |
|---|---|---|
| `D:\portfolio\ECHO-WEBSITE` | Vanilla JS + OGL reference; client work, MIT | Design ideas only (orbital intro, cylindrical reel, horizontal timeline). No code, copy or images reused. |
| `D:\CloudScale\BNP-BLR-Team-01` | Team repo, 5 authors, Jonathan wrote 25 of 41 commits. Terraform modules, SQS workers, OPA guard, FIS chaos, Prometheus/Grafana. Remote state lists applied resources. | Cloud Optimizer: Dynamic |
| same repo, `Cloud-Optimizer-Static` | Baseline that shares every module except the fleet; priced with Infracost, not deployed (free-plan RDS quota) | Cloud Optimizer: Static |
| `D:\ecodatas` | Solo, 346 commits, live at app.ecodatas.com. Phases 0-8 done; RAG, quant, reports not built yet. Private repo. | EcoData |
| `D:\trading` | Type-1 Darvas script, matrix engine with parity self-test, 5-stage walk-forward gate. `METHODOLOGY_V4.md` says every new rule failed walk-forward and nothing is live or paper traded. | Darvas research |
| `D:\RoadSafetyAI\CivTech` | Public repo, 2 authors, Nov-Dec 2025. YOLOv8 dual-video comparator, ORB sync, heuristic PCI, Nominatim + rule-based GIS profile, IRC lookup, LaTeX/FPDF report, Streamlit + Folium. | Road safety ML |
| `D:\chain-platform` | Public repo (collaborator's), Besu QBFT dev network: 4 validators, 2 RPC nodes behind nginx, Prometheus/Grafana in Compose. No contracts, API or indexer yet. | Permissioned blockchain |
| `D:\Rooftop-Delivery` | Public repo. Spring Boot + MySQL, two-heap allocation engine with tests. | Rooftop delivery |
| `D:\Glean_Resume.pdf` | Own resume: email, NAS (Linux, Samba), internship, hackathon placing | Email and NAS only (others need confirmation) |
| Verilog/AES, AR Food Studio | No files found on D: or the user profile | Not featured until material exists |

## Build order

1. Design tokens (`globals.css`), fonts, layout shell, reveal observer.
2. Navigation (active section, mobile menu, progress bar) and hero with orbital SVG.
3. Typed project registry (`src/data/projects.ts`) with validation, data-driven SVG diagrams.
4. Work showcase: category filters, CSS 3D reel with keyboard/pointer control, index view.
5. Case-study route `/work/[slug]` generated from the registry; unknown slug returns 404.
6. Systems explorer (tabs), skills with evidence levels, horizontal timeline, about.
7. Contact (links hidden when unset), footer.
8. Metadata, OG image, sitemap, robots, icon.
9. Playwright tests, build, lint, typecheck; README and CLAUDE.md.

## Truthfulness rules applied

- Every project carries a `status` and a `verification` note shown on its page.
- Planned components in diagrams are drawn dashed and labelled planned.
- No metric appears unless it is in the source repo; backtest figures carry a disclaimer.
- Links render only when a URL is configured.
