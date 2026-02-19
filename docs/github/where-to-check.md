# Where to Check (quick verification)

## 1) Technical docs
- Docs index: [README.md](README.md)
- Backend endpoints: [backend-endpoints.md](backend-endpoints.md)
- Frontend endpoints: [frontend-endpoints.md](frontend-endpoints.md)
- App architecture: [app-architecture.md](app-architecture.md)
- Technology architecture: [technology-architecture.md](technology-architecture.md)

## 2) Diagram sources (Mermaid)
- Diagrams index + reading order: [diagrams/README.md](diagrams/README.md)
- Master diagram: [diagrams/00-master-overview.md](diagrams/00-master-overview.md)
- Existing top-level diagrams:
  - [architecture-overview.md](architecture-overview.md)
  - [request-lifecycle.md](request-lifecycle.md)

## 3) Exported images (SVG/PNG)
- Export output folder: [diagrams/export](diagrams/export)
- Examples:
  - [diagrams/export/diagrams__00-master-overview.svg](diagrams/export/diagrams__00-master-overview.svg)
  - [diagrams/export/diagrams__00-master-overview.png](diagrams/export/diagrams__00-master-overview.png)
  - [diagrams/export/architecture-overview.svg](diagrams/export/architecture-overview.svg)
  - [diagrams/export/request-lifecycle.svg](diagrams/export/request-lifecycle.svg)

## 4) How to regenerate exports
- Run: `npm run export:diagrams`
- Script: [../../scripts/export-diagrams.mjs](../../scripts/export-diagrams.mjs)

## 5) Runtime app/API checks
- Start app: `npm run dev`
- App UI: `http://localhost:8080`
- Health: `http://localhost:8080/api/health`
- Feed smoke: `http://localhost:8080/api/feed?sort=latest&limit=5`
- Nodes list: `http://localhost:8080/api/nodes`
- Swagger UI: `http://localhost:8080/api/docs`
- OpenAPI JSON: `http://localhost:8080/api/docs.json`

## 5.1) Codespaces / dev container access (important)

Ako radiš u GitHub Codespaces ili remote dev container-u, browser na host mašini **ne vidi** container `localhost` direktno.

- ✅ koristi forwarded URL oblika `https://<workspace>-8080.app.github.dev`
- ❌ ne koristi `http://localhost:8080` sa host browser-a
- ❌ ne koristi container LAN IP (`10.x.x.x`, `172.x.x.x`) sa host browser-a

Primer (isti origin za frontend + backend):
- Frontend: `https://<workspace>-8080.app.github.dev/`
- Health API: `https://<workspace>-8080.app.github.dev/api/health`
- Feed API: `https://<workspace>-8080.app.github.dev/api/feed?sort=latest&limit=5`
- Swagger UI: `https://<workspace>-8080.app.github.dev/api/docs`
- OpenAPI JSON: `https://<workspace>-8080.app.github.dev/api/docs.json`

U ovom okruženju svi endpointi treba da se otvaraju preko **istog forwarded host-a**.

## 6) CI checks (GitHub Actions)
- Workflow file: [../../.github/workflows/diagrams-export-check.yml](../../.github/workflows/diagrams-export-check.yml)
- Actions page: https://github.com/lokiloko7777-tech/Free-Live-Personal-TV/actions
- Job name: `Diagrams Export Check`
- Artifact name (on successful run): `diagrams-export`
