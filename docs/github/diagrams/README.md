# Diagrams Index

Kompletna kolekcija Mermaid dijagrama za projekat.

## Master
- [00-master-overview.md](00-master-overview.md)

## Recommended Reading Order (Onboarding)
1. [00-master-overview.md](00-master-overview.md)
2. [01-system-context.md](01-system-context.md)
3. [02-container-view.md](02-container-view.md)
4. [03-backend-modules.md](03-backend-modules.md)
5. [04-frontend-modules.md](04-frontend-modules.md)
6. [05-auth-security-flow.md](05-auth-security-flow.md)
7. [06-upload-processing-flow.md](06-upload-processing-flow.md)
8. [07-realtime-sync-flow.md](07-realtime-sync-flow.md)
9. [08-data-model-erd.md](08-data-model-erd.md)
10. [09-deployment-topology.md](09-deployment-topology.md)
11. [10-moderation-workflow.md](10-moderation-workflow.md)
12. [11-licensing-payout-workflow.md](11-licensing-payout-workflow.md)
13. [12-pilot-feedback-iteration-workflow.md](12-pilot-feedback-iteration-workflow.md)
14. [../architecture-overview.md](../architecture-overview.md)
15. [../request-lifecycle.md](../request-lifecycle.md)

## Style
- [STYLE-GUIDE.md](STYLE-GUIDE.md)

## Export (SVG/PNG)
- Run: `npm run export:diagrams`
- Output folder: `docs/github/diagrams/export`
- Export mode: local `mermaid-cli` first, auto-fallback na `mermaid.ink` ako u runtime-u fale Chromium biblioteke
- Export scope:
	- svi numerisani dijagrami iz `docs/github/diagrams/*.md` (osim `README.md` i `STYLE-GUIDE.md`)
	- top-level: `docs/github/architecture-overview.md` i `docs/github/request-lifecycle.md`

## Core architecture
- [01-system-context.md](01-system-context.md)
- [02-container-view.md](02-container-view.md)
- [03-backend-modules.md](03-backend-modules.md)
- [04-frontend-modules.md](04-frontend-modules.md)

## Security and runtime flows
- [05-auth-security-flow.md](05-auth-security-flow.md)
- [06-upload-processing-flow.md](06-upload-processing-flow.md)
- [07-realtime-sync-flow.md](07-realtime-sync-flow.md)

## Data and deployment
- [08-data-model-erd.md](08-data-model-erd.md)
- [09-deployment-topology.md](09-deployment-topology.md)

## Product workflows
- [10-moderation-workflow.md](10-moderation-workflow.md)
- [11-licensing-payout-workflow.md](11-licensing-payout-workflow.md)
- [12-pilot-feedback-iteration-workflow.md](12-pilot-feedback-iteration-workflow.md)

## Existing top-level diagrams in docs/github
- [architecture-overview.md](../architecture-overview.md)
- [request-lifecycle.md](../request-lifecycle.md)
