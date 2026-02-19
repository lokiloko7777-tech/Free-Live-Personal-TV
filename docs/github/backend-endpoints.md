# Backend Endpoints (taksativno)

Izvor: `server/index.js`.

## Public / open endpoints

| Method | Path | Auth | Admin | Purpose |
|---|---|---:|---:|---|
| GET | `/api/health` | No | No | Health check |
| GET | `/api/config` | No | No | Frontend config (Google client id) |
| GET | `/api/network-urls` | No | No | LAN/localhost URLs |
| GET | `/api/qr` | No | No | QR SVG generacija |
| GET | `/api/docs.json` | No | No | OpenAPI JSON specifikacija |
| GET | `/api/docs` | No | No | Swagger UI |
| GET | `/api/limits/:userId` | No | No | User tier limiti |
| GET | `/api/videos/:userId` | No | No | Lista završenih videa za user |
| GET | `/api/feed` | No | No | Public feed |
| POST | `/api/licenses/request` | No | No | Kreiranje licence zahteva |
| GET | `/api/licenses` | No | No | Lista licenci |
| GET | `/api/payouts/summary` | No | No | Payout agregat |
| GET | `/api/nodes` | No | No | Lista community node-ova |

## Auth/session endpoints

| Method | Path | Auth | Admin | Purpose |
|---|---|---:|---:|---|
| POST | `/api/auth/session` | No | No | Login/session creation (guest/google) |
| GET | `/api/auth/me` | Yes | No | Session introspection |
| POST | `/api/auth/logout` | Yes | No | Logout/invalidacija sesije |

## Moderation endpoints

| Method | Path | Auth | Admin | Purpose |
|---|---|---:|---:|---|
| POST | `/api/moderation/report` | Yes | No | Report chat poruke |
| GET | `/api/moderation/reports` | Yes | Yes | Lista report-ova (filter/pagination) |
| GET | `/api/moderation/reports/export` | Yes | Yes | Export report-ova (JSON/CSV) |
| POST | `/api/moderation/reports/:reportId/status` | Yes | Yes | Status update report-a |
| POST | `/api/moderation/reports/bulk-status` | Yes | Yes | Bulk status update report-ova |
| POST | `/api/moderation/mute` | Yes | Yes | Mute korisnika |
| POST | `/api/moderation/unmute` | Yes | Yes | Unmute korisnika |

## Pilot / growth endpoints

| Method | Path | Auth | Admin | Purpose |
|---|---|---:|---:|---|
| GET | `/api/pilot/me` | Yes | No | Moj pilot status + summary |
| POST | `/api/pilot/enroll` | Yes | No | Pilot prijava |
| GET | `/api/pilot/participants` | Yes | Yes | Pilot cohort lista |
| POST | `/api/pilot/participants/:participantId/status` | Yes | Yes | Pilot status update |
| GET | `/api/pilot/summary` | Yes | Yes | Pilot summary |

## Feedback / iteration endpoints

| Method | Path | Auth | Admin | Purpose |
|---|---|---:|---:|---|
| POST | `/api/feedback` | Yes | No | Submit feedback |
| GET | `/api/feedback/my` | Yes | No | Moj feedback |
| GET | `/api/feedback` | Yes | Yes | Feedback queue |
| POST | `/api/feedback/:feedbackId/status` | Yes | Yes | Feedback status update |
| POST | `/api/iterations` | Yes | Yes | Kreiranje iteracije |
| GET | `/api/iterations` | Yes | Yes | Lista iteracija |
| POST | `/api/iterations/:iterationId/status` | Yes | Yes | Iteration status update |

## Realtime / ingest / media endpoints

| Method | Path | Auth | Admin | Purpose |
|---|---|---:|---:|---|
| GET | `/api/realtime/stream` | Yes | No | SSE realtime sync |
| POST | `/api/sessions` | Yes | No | Start capture session |
| POST | `/api/sessions/:sessionId/chunks` | Yes | No | Chunk upload |
| POST | `/api/sessions/:sessionId/complete` | Yes | No | Complete session |
| POST | `/api/client-events` | Yes | No | Client telemetry/crash events |

## Proof / licensing ops endpoints

| Method | Path | Auth | Admin | Purpose |
|---|---|---:|---:|---|
| GET | `/api/proofs/daily-root` | No | No | Daily merkle roots |
| POST | `/api/proofs/anchor` | Yes | Yes | Anchor root (manual tx ref) |
| GET | `/api/proofs/anchors` | No | No | Anchor evidencija |
| POST | `/api/licenses/:licenseId/status` | Yes | Yes | License workflow status |
| GET | `/api/audit` | Yes | Yes | Audit log fetch |
| GET | `/api/metrics/summary` | Yes | Yes | Metrics summary |

## Feed/social endpoints

| Method | Path | Auth | Admin | Purpose |
|---|---|---:|---:|---|
| POST | `/api/videos/:videoId/view` | No | No | View counter |
| POST | `/api/videos/:videoId/rate` | Yes | No | Rating submit |
| GET | `/api/videos/:videoId/chat` | No | No | Read chat thread |
| POST | `/api/videos/:videoId/chat` | Yes | No | Send chat message |
| GET | `/api/users/:userId/profile` | Yes | No | Private profile fetch |
| GET | `/api/leaderboard` | No | No | Reputation leaderboard |

## Community node endpoints

| Method | Path | Auth | Admin | Purpose |
|---|---|---:|---:|---|
| POST | `/api/nodes/register` | No | No | Register node |
| POST | `/api/nodes/:nodeId/heartbeat` | No | No | Node heartbeat |
| POST | `/api/nodes/:nodeId/unregister` | No | No | Node offline/unregister |

## Frontend fallback route

| Method | Path | Purpose |
|---|---|---|
| GET | `*` | SPA fallback (`index.html`) |
