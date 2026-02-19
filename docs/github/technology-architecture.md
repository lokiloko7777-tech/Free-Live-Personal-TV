# Technology Architecture

## 1. Technology stack

### Backend
- Node.js 20+
- Express 4
- `helmet`, `cors`, `morgan`
- `google-auth-library` (opciono Google login)
- `qrcode`, `uuid`
- Native Node crypto (`AES-GCM`, `SHA-256`)
- FFmpeg (opciono server processing + HLS)

### Frontend
- Vanilla JavaScript (ES modules)
- HTML/CSS (bez framework-a)
- MediaRecorder + getUserMedia
- IndexedDB (offline local storage)
- Service Worker + Web App Manifest (PWA)
- EventSource (SSE realtime)

### Infra/ops
- Nginx (reverse proxy, TLS, rate-limit)
- Docker Compose profili (`infra/`)
- Opcioni stack servisi: Postgres, MinIO, Redis (predefinisani compose assets)

## 2. Architecture style

- Trenutni stil: modular monolith
- API + static app se serviraju iz istog backend servisa
- Data persistence je file-based za MVP brzinu i jednostavnost
- Realtime je event push preko SSE (server -> klijent)

## 3. Security architecture

- Bearer session token sa TTL (`AUTH_SESSION_TTL_MS`)
- Admin RBAC preko `ADMIN_USER_IDS`
- Rate limiting (app + nginx sloj)
- Optional HTTPS enforcement (`REQUIRE_HTTPS=1`)
- Moderation workflow + audit trail
- Security disclosure proces kroz `SECURITY.md`

## 4. Media architecture

- Chunk ingest (`/api/sessions/:id/chunks`)
- Optional AES-GCM transport enkripcija chunk-ova
- Device ili server processing mode
- Optional FFmpeg MP4 transcode
- Optional adaptive HLS generation (master + variants)
- Frontend playback strategija: native HLS -> file fallback -> hls.js popup fallback

## 5. Observability architecture

- Health endpoint (`/api/health`)
- Metrics summary (`/api/metrics/summary`)
- Client crash/event ingestion (`/api/client-events`)
- Audit endpoint (`/api/audit`)

## 6. Product/governance architecture

- Community docs u `.github/` + root policy fajlovi
- Issue templates + PR template
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`
- Release/runbook dokumenti u `docs/`

## 7. Trade-offs (MVP vs production)

MVP prednosti:
- Brza iteracija i minimalan operativni overhead
- Jednostavan deploy i lokalni razvoj

MVP limiti:
- File DB i local disk storage nisu dugoročno skalabilni
- Monolitni server processing limitira horizontalni throughput

Production smer:
- State i storage externalizacija (DB + object store)
- Worker/pipeline separacija
- Centralizovan monitoring i alerting
