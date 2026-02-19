# Day-1 Runbook (MacBook + Redmi)

## Goal
Run a functional MVP in one day:
- open app from phone browser,
- tap one button to start camera recording,
- recording works even when internet is down,
- when internet returns, user chooses upload or keep-local,
- free limits are enforced server-side,
- optional desktop Community Node registration works.

## Requirements
- Node.js 20+
- npm
- MacBook and Redmi on same network (for local test)

## Start locally
1. Install deps:
   - `npm install`
2. Run app:
   - `npm run dev`
3. Open on Mac:
   - `http://localhost:8080`
4. Open on phone (same Wi-Fi):
   - `http://<MAC_LOCAL_IP>:8080`

Important:
- Multi-device testing must use **local IP address**, not `localhost`.
- Server is configured to listen on `0.0.0.0`.

## Android install (Day-1)
1. Open `http://<MAC_LOCAL_IP>:8080` on Redmi.
2. Tap **Install Android App** (if available).
3. If not available: browser menu → **Add to Home Screen**.
4. The app installs as a PWA and is ready for local testing.

## QR quick connect
- On desktop home screen, use **Scan QR (LAN test)** section.
- Scan the QR code with phone to open local IP URL without manual typing.
- Use **Copy LAN Link** or **Share Link** for instant sharing.

## Smart Sync and bulk local actions
- Enable **Smart Sync** for automatic upload when internet returns.
- In **Local Offline Videos** section use:
   - **Upload all pending** to upload the full queue,
   - **Keep all local** to mark all pending clips as local-only.

## Quality and proof
- Use **Capture quality** in User section: Auto / High / Data Saver.
- Each clip now has a proof marker (hash) visible in video lists.

## User interaction
- In **Explore Videos** you can browse feed by latest, most viewed and top rated.
- Users can rate each video (1-5).
- **Video Chat** provides per-video chat threads.
- Feed/chat/leaderboard now support realtime sync (no manual refresh needed when events arrive).

## Login / privacy / avatar
- Users can sign in with Google (Gmail) when `GOOGLE_CLIENT_ID` is configured on server.
- **Continue as Guest** is always available.
- Users can choose privacy mode and one of 3 avatars: **male**, **female**, **anonymous**.
- No first/last name is displayed publicly; only privacy alias is shown.
- Both **login** and **logout** flows are supported.
- Google ID token is verified server-side before session is created.
- API write actions use bearer session token (issued at login, expires by TTL).

Google login setup:
- start server with `GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com npm run dev`
- optional session TTL override: `AUTH_SESSION_TTL_MS=259200000 npm run dev`

Moderation setup:
- set admin users with `ADMIN_USER_IDS` (comma-separated user IDs)
- example: `ADMIN_USER_IDS=u-abcd1234,u-efgh5678 npm run dev`
- any user can report chat messages; admin can mute/unmute users and review reports
- to sign in as admin guest, enter one of those IDs into **User ID** field before clicking **Continue as Guest**
- reports now include audit trail fields: status (`open`, `resolved`, `rejected`), admin note, and action history
- admin can multi-select reports and apply bulk status updates from Moderation UI
- admin can export moderation reports and audit fields as JSON or CSV from Moderation UI
- moderation now supports filters + pagination by status/reporter/video/date

Day2-7 fast-track additions:
- server processing (`processingMode=server`) now attempts FFmpeg transcode to MP4
- chunk upload uses AES-GCM per-session encryption key when WebCrypto is available
- proof endpoints: `GET /api/proofs/daily-root`, `POST /api/proofs/anchor`
- proof UI: **Proof of Origin** section shows daily roots + anchor status + admin anchor action
- monetization endpoints: `POST /api/licenses/request`, `POST /api/licenses/:licenseId/status`, `GET /api/payouts/summary`
- API + ingest now include baseline per-IP/per-session rate limiting
- Proxmox quick deploy: `infra/docker-compose.proxmox.yml`
- Proxmox TLS profile: `infra/docker-compose.proxmox.tls.yml` + `infra/nginx/default.tls.conf`

Day8 compatibility additions:
- capture now auto-selects best supported codec/profile per device/browser
- graceful degrade: if audio capture fails, app records video-only; if MediaRecorder is missing, app blocks capture with clear hint
- capture profile is stored in video metadata and visible in lists/feed

## Test flow
1. Set user ID.
2. Confirm app opens from at least 2 devices via `http://<MAC_LOCAL_IP>:8080`.
3. Tap **Start instantly**.
4. Record a short clip.
5. Tap **Stop**.
6. Verify video appears in list.
7. Turn off internet on phone and record a clip (must stay local).
8. Turn internet back on and verify upload vs keep-local prompt appears.
9. Repeat until 3 videos and verify 4th is blocked.

## Community Node test
1. Scroll to **Community Node**.
2. Enter node name and optional URL.
3. Click **Register node**.
4. Click **List nodes** and verify status.

## Domain choice
- Primary production domain: `nettvsshop.com` (brand-aligned).
- Optional staging/dev: `war4.info`.

## Notes
- Current Day-1 persistence is file-based (`data/db.json`, `uploads/`).
- Production on Proxmox should move metadata to Postgres and objects to MinIO.
