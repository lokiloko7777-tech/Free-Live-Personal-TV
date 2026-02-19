# GitHub Technical Docs

Ovaj folder je napravljen za taksativnu tehničku dokumentaciju koja je tražena za repo:

- `backend-endpoints.md` — kompletna backend endpoint lista iz `server/index.js`
- `frontend-endpoints.md` — kompletna frontend API/SSE potrošnja iz `web/app.js`
- `app-architecture.md` — aplikativna arhitektura (moduli, tokovi, deploy)
- `technology-architecture.md` — tehnološka arhitektura (stack, runtime, sigurnost, operacije)
- `where-to-check.md` — quick links gde da proveriš docs, dijagrame, export i runtime
- `architecture-overview.md` — vizuelni Mermaid dijagram celokupne arhitekture
- `request-lifecycle.md` — vizuelni Mermaid dijagram request lifecycle toka (auth -> ingest -> complete -> realtime refresh)
- `diagrams/README.md` — centralni index svih dodatnih Mermaid dijagrama
- Swagger UI endpoint — `/api/docs`
- OpenAPI JSON endpoint — `/api/docs.json`

## Diagrams

- Index: [diagrams/README.md](diagrams/README.md)
- Folder: [diagrams](diagrams)
- Master overview: [diagrams/00-master-overview.md](diagrams/00-master-overview.md)
- Diagram style guide: [diagrams/STYLE-GUIDE.md](diagrams/STYLE-GUIDE.md)

Napomena: lista endpointa je izvučena direktno iz trenutnog koda na grani `main` (datum: 2026-02-19).
