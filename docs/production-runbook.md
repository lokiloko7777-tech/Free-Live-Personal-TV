# Production Runbook

## 1) Infrastruktura (minimum)
- Reverse proxy: Nginx
- App: Node.js servis (`server/index.js`)
- Storage: persistent volume za `uploads/` i `data/`
- Backup: dnevni backup `data/db.json` + uploads metapodataka

## 2) Environment varijable
Obavezno proveri:
- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `PORT=8080`
- `RATE_LIMIT_ENABLED=1`
- `REQUIRE_HTTPS=1` (u produkciji)
- `AUTH_SESSION_TTL_MS` (npr. 7 dana)
- `ADMIN_USER_IDS` (lista admin user ID-jeva)
- `GOOGLE_CLIENT_ID` (ako koristiš Google login)
- `FFMPEG_ENABLED=1` (ako je potreban server processing/HLS)

## 3) Reverse proxy i TLS
- Redirect HTTP → HTTPS.
- Uključi HSTS.
- Ograniči metode i payload size.
- Zadrži upload timeout dovoljno visok za mobilne mreže.

## 4) Deploy koraci
1. `npm ci`
2. Postavi env varijable
3. Start: `npm run start`
4. Health check: `GET /api/health`
5. Smoke:
   - auth session,
   - create/upload/complete session,
   - feed endpoint,
   - admin metrics/pilot/feedback/iterations.

## 5) Operativni monitoring
Pratiti minimum:
- HTTP 5xx rate
- latency p50/p95
- upload success rate
- disk usage (`uploads/`, `data/`)
- crash/event trend (`/api/metrics/summary`)

## 6) Backup i restore
- Backup interval: dnevno + retention policy.
- Test restore procedure najmanje 1x mesečno.
- Validirati da restore vraća funkcionalan `/api/feed` i `/api/videos/:userId`.

## 7) Incident odgovor
- Privremeno pojačati rate-limit.
- U slučaju abuse-a koristiti moderation mute i audit.
- Kod security incidenta pratiti `SECURITY.md` proces.

## 8) Go-live kriterijum
- API health stabilan 24h.
- Smoke test prolazi bez regresija.
- HTTPS/TLS aktivan.
- Backup + rollback procedura testirana.
