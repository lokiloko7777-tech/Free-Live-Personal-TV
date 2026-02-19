# Proxmox Day2-7 Fast Track

## Cilj
Ubrzati završetak Day2-7 u jednom operativnom koraku:
- stabilan ingest + realtime stream,
- server-side kompresija (FFmpeg),
- moderation operacije,
- proof/anchor i licensing osnova,
- Proxmox deployment koji se odmah podiže.

## 1) Brzo podizanje na Proxmox VM
Na VM (Ubuntu 24.04 LTS):

1. Instaliraj Docker + Compose plugin.
2. Kloniraj repo.
3. Pokreni:

```bash
cd infra
docker compose -f docker-compose.proxmox.yml up -d
```

TLS varijanta (preporučeno za internet/public deployment):

```bash
cd infra
docker compose -f docker-compose.proxmox.yml -f docker-compose.proxmox.tls.yml up -d
```

4. Provera:

```bash
curl -s http://<VM_IP>/api/health
```

## 2) Obavezni env parametri
U `infra/docker-compose.proxmox.yml` prilagodi:
- `ADMIN_USER_IDS`
- `POSTGRES_PASSWORD`
- `MINIO_ROOT_PASSWORD`
- `RATE_LIMIT_ENABLED`
- `REQUIRE_HTTPS` (u TLS varijanti postaviti `1`)
- opciono `GOOGLE_CLIENT_ID`

Za TLS profil pripremi sertifikate u:
- `infra/nginx/certs/fullchain.pem`
- `infra/nginx/certs/privkey.pem`

## 3) Stream i ingest optimizacija
Nginx je podešen za:
- `proxy_request_buffering off` na `/api/sessions/` (brži upload chunk-ova),
- `proxy_buffering off` na SSE (`/api/realtime/stream`),
- gzip za statiku i JSON,
- duže timeout-e i keepalive,
- osnovni WAF blok (suspect URI patterni) i request rate-limit zone.

## 3.1) Upload enkripcija chunk-ova
Client koristi AES-GCM po chunk-u kada browser ima WebCrypto:
- server vraća per-session ključ (`chunkCryptoKey`) na `/api/sessions`,
- klijent šalje `x-chunk-enc: aes-gcm` + `x-chunk-iv`,
- server dešifruje chunk pre upisa na disk.

## 4) Video kompresija (FFmpeg)
Backend server processing koristi:
- `libx264`,
- `preset=veryfast` (brže kodiranje),
- `crf=29` (balans veličina/kvalitet),
- `aac 96k`,
- `+faststart` za brži start playback-a.

Podešavanje:
- `FFMPEG_PRESET=veryfast|faster|fast`
- `FFMPEG_CRF=24..32` (niže = bolji kvalitet, veći fajl)

## 5) Day2-7 API checklista
- Day2: `/api/limits/:userId`, enforcement u upload/complete flow.
- Day3: `/api/sessions/:sessionId/complete` sa `processingMode=server`.
- Day4: `/api/audit` + proof hash generisanje server-side.
- Day5: `/api/proofs/daily-root`, `/api/proofs/anchor`.
- Day6: `infra/nginx/default.conf`, `infra/nginx/default.tls.conf` + compose TLS override.
- Day7: `/api/licenses/request`, `/api/licenses/:licenseId/status`, `/api/payouts/summary`.

## 5.1) Day5 UI check
- U web UI sekciji **Proof of Origin** proveri:
	- dnevne merkle root zapise,
	- anchor status po danu,
	- admin akciju za anchor dana.

## 6) Operativni redosled (preporuka)
1. Podigni stack.
2. Testiraj upload sa 2 uređaja preko LAN IP.
3. Testiraj `processingMode=server` i proveri izlazni `.mp4`.
4. Testiraj moderation filtere/paginaciju/export.
5. Kreiraj license request i payout summary.
6. Dodaj TLS terminaciju (edge Nginx/HAProxy) ispred VM.
