# App Architecture

## 1. High-level view

Aplikacija je monolitni Node.js + Express backend sa vanilla JS PWA frontendom.

- Backend: `server/index.js`
- Frontend: `web/index.html` + `web/app.js` + `web/styles.css`
- Persistence: `data/db.json` (file-based), video fajlovi u `uploads/`
- Realtime: SSE (`/api/realtime/stream`)

## 2. Runtime components

### Frontend (PWA)
- Capture pipeline (MediaRecorder, quality profiles, offline fallback)
- Session/auth handling (guest/google)
- Feed/chat/rating/license UI tokovi
- Admin UI (moderation, metrics, pilot, feedback, iterations)
- IndexedDB local cache za offline snimke

### Backend (Express)
- Auth/session i role gating (admin/user)
- Upload sessions + chunk ingest + complete flow
- Optional FFmpeg processing + HLS pack generation
- Social layer (feed, views, ratings, chat)
- Moderation layer (reports, mute/unmute, export)
- Growth layer (metrics, pilot, feedback, 7-day iterations)
- Proof/licensing layer (daily merkle root, anchor refs, license workflow)

## 3. Data model (file DB)

`db.json` ključne kolekcije:
- `users`
- `sessions`
- `nodes`
- `reports`
- `licenses`
- `proofs`
- `auditLogs`
- `metrics`
- `clientEvents`
- `pilotParticipants`
- `feedbackItems`
- `feedbackIterations`

## 4. Primary execution flows

### A) Capture/upload flow
1. Frontend kreira `/api/sessions`
2. Šalje chunk-ove na `/api/sessions/:id/chunks`
3. Završava sa `/api/sessions/:id/complete`
4. Backend upisuje session, proof hash, opcioni HLS
5. SSE broadcast osvežava feed/listu bez manual refresh-a

### B) Offline-first flow
1. Ako nema mreže ili upload padne, snimak ide u IndexedDB
2. Po povratku mreže, frontend nudi upload ili keep-local
3. Re-upload koristi isti session/chunk/complete backend tok

### C) Governance/admin flow
1. Report chat poruka
2. Admin pregled/filter/export report-ova
3. Admin akcije: mute/unmute, status update, bulk update
4. Audit/metrics endpointi zatvaraju operativni krug

## 5. Deployment shape

- Dev: `npm run dev`
- Prod: `npm run start`
- Infra opcije: `infra/` compose + nginx TLS profili
- Reverse proxy služi API i static frontend kroz isti domen

## 6. Architectural constraints (trenutno)

- File DB (`data/db.json`) nije idealan za horizontalni scale
- `uploads/` lokalni disk zavisi od volume persistence-a
- SSE je one-way stream (dovoljno za trenutni realtime model)

## 7. Planned production evolution

- Metadata migracija na Postgres
- Object storage migracija na MinIO/S3 kompatibilno
- Worker separation za transcode/HLS pipeline
- Jači observability (dashboards + alerts + retention)
