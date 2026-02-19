# Frontend Endpoints (taksativno)

Izvor: `web/app.js`.

## Frontend app routes/assets

- `GET /` (SPA entry)
- `GET /index.html`
- `GET /app.js`
- `GET /styles.css`
- `GET /manifest.webmanifest`
- `GET /sw.js`
- `GET /icon.svg`

## API endpoints koje frontend koristi

### Auth/session
- `POST /api/auth/session`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/config`

### Core capture/upload
- `POST /api/sessions`
- `POST /api/sessions/:sessionId/chunks`
- `POST /api/sessions/:sessionId/complete`
- `GET /api/limits/:userId`
- `GET /api/videos/:userId`

### Feed/social
- `GET /api/feed?sort=...&limit=...`
- `POST /api/videos/:videoId/view`
- `POST /api/videos/:videoId/rate`
- `GET /api/videos/:videoId/chat?limit=...`
- `POST /api/videos/:videoId/chat`
- `GET /api/leaderboard?limit=...`
- `GET /api/users/:userId/profile`

### Moderation
- `POST /api/moderation/report`
- `POST /api/moderation/mute`
- `POST /api/moderation/unmute`
- `GET /api/moderation/reports?...`
- `POST /api/moderation/reports/:reportId/status`
- `POST /api/moderation/reports/bulk-status`
- `GET /api/moderation/reports/export?format=...&limit=...`

### Metrics/telemetry
- `POST /api/client-events`
- `GET /api/metrics/summary`

### Pilot / feedback / iterations
- `GET /api/pilot/me`
- `POST /api/pilot/enroll`
- `GET /api/pilot/participants?...`
- `POST /api/pilot/participants/:participantId/status`
- `GET /api/feedback/my?limit=...`
- `POST /api/feedback`
- `GET /api/feedback?...`
- `POST /api/feedback/:feedbackId/status`
- `POST /api/iterations`
- `GET /api/iterations?limit=...`
- `POST /api/iterations/:iterationId/status`

### Proof / licensing / payouts
- `GET /api/proofs/daily-root`
- `GET /api/proofs/anchors?limit=...`
- `POST /api/proofs/anchor`
- `POST /api/licenses/request`
- `GET /api/licenses?...`
- `POST /api/licenses/:licenseId/status`
- `GET /api/payouts/summary`

### Community node
- `POST /api/nodes/register`
- `POST /api/nodes/:nodeId/heartbeat`
- `GET /api/nodes`

### LAN / QR / realtime
- `GET /api/network-urls`
- `GET /api/qr?text=...`
- `GET /api/realtime/stream?sessionToken=...` (SSE)

## Napomena

Frontend je single-page PWA i nema odvojene frontend REST rute tipa `/app/*`; endpoint lista iznad predstavlja mrežne tačke koje frontend koristi prema backend-u + static asset entrypoint.
