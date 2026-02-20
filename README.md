# Free Live Personal TV

## Status

Day-1 MVP je implementiran i pokreće se lokalno:
- mobilni/web PWA interfejs,
- instant kamera start,
- chunk upload na server,
- offline-first lokalno snimanje bez interneta,
- prompt pri povratku interneta: upload ili keep-local,
- Smart Sync i batch red lokalnih snimaka,
- proof-of-origin hash za svaki snimak,
- adaptive quality preset (Auto/High/Data Saver),
- browse feed (latest / most viewed / top rated),
- trending feed algoritam,
- rating sistem (1-5),
- chat po videu,
- login/logout sesija,
- Google login (Gmail) podrška,
- privacy-first profil: anonymous mode + izbor avatara (male/female/anonymous) bez imena/prezimena,
- reputation score + anti-spam chat zaštita,
- Top Contributors leaderboard,
- server-side enforcement free limita,
- Community Node registry (desktop-as-server osnova).

Open-source platforma za brzo mobilno snimanje i live streaming, sa fokusom na:
- anonimnost korisnika,
- kriptovanu obradu i prenos,
- opcioni lokalni (telefon) ili serverski processing,
- fer monetizaciju autora sadržaja.

## Ključni infrastrukturni uslov

Projekt je dizajniran kao **100% self-hosted** na ProLiant serveru (128 GB RAM) sa Proxmox-om.

- Nema obaveznih plaćenih cloud servisa.
- Sve ključne komponente rade lokalno (VM/LXC).
- Plaćeni servisi su opcioni kasnije, ne i zavisnost za MVP.

## Vizija

Jedan klik na ikonicu aplikacije pokreće kameru i odmah:
1. snima lokalno na uređaj,
2. paralelno strimuje ka serveru,
3. korisnik bira gde se radi obrada (CPU telefona ili CPU servera).

## Brzi MVP (najkraće i najjednostavnije)

Ovaj pristup minimizuje kodiranje za backend, frontend i storage.

### Frontend (mobilni + web)
- **PWA (Progressive Web App)**: radi kao web + može se instalirati kao ikonica na telefonu.
- **Vanilla JS Day-1 implementacija** (minimalan kod, maksimalna kompatibilnost).
- **React + Vite + TypeScript** kao planirana evolucija kada MVP stabilizujemo.
- **MediaDevices + MediaRecorder API**: start kamere/snimanja jednim klikom.
- **Chunk upload** svakih 1–2 sekunde (umesto jednog velikog fajla).

Zašto PWA prvo:
- jedan kod za web i mobilni,
- minimalni troškovi,
- brzo testiranje tržišta.

### Backend (low-code, self-hosted)
- **Appwrite self-hosted** (Auth + DB + Storage + Functions) kao najbrža no-code/low-code opcija.
- Alternativa: **Node.js/NestJS + Postgres + Keycloak** ako želiš punu kontrolu.
- **Nginx** kao reverse proxy + stream ulaz.
- **Worker servis** (FFmpeg worker) za transcode kada korisnik izabere serverski processing.

### Storage
- Primarno: **MinIO self-hosted** (S3-kompatibilan) na Proxmox-u.
- Metadata: Postgres (`videos`, `licenses`, `payments`, `proofs`).
- Lokalni cache na telefonu (IndexedDB) za offline/retry upload.

## Proxmox raspodela resursa (predlog)

Za brz i čist MVP deployment:

1. **VM/LXC: `edge`**
	- Nginx reverse proxy, TLS, rate-limit.
2. **VM/LXC: `app`**
	- API (Appwrite ili custom Node API).
3. **VM/LXC: `db`**
	- Postgres.
4. **VM/LXC: `object-storage`**
	- MinIO (disk volume za video).
5. **VM/LXC: `workers`**
	- FFmpeg worker + queue consumer.
6. **VM/LXC: `ops`**
	- Monitoring (Prometheus + Grafana) + logovi (Loki).

Za početak može i 3 VM model (`edge+app`, `db`, `minio+worker`) radi jednostavnosti.

## Protokol i kompatibilnost (uključujući starije telefone)

Da radi i na starijim uređajima, koristi hibrid:
- **Upload ingest**: HTTPS chunk upload (najkompatibilnije).
- **Playback**: HLS (M3U8) kao default, uz fallback profile nižeg kvaliteta.
- **Realtime premium opcija**: WebRTC za ultra-low-latency gde je podržano.

Napomena: “bleeding edge” tehnologije uvoditi selektivno. Za 10+ godina stare telefone stabilnost i kompatibilnost su važnije od najnovijeg protokola.

## Anonimnost + enkripcija + “blockchain” bez over-engineering-a

Predlog koji je praktičan i brz za MVP:

1. **Pseudonymous ID** po korisniku (bez obaveznih ličnih podataka).
2. **End-to-end enkripcija chunkova** (AES-GCM) pre slanja.
3. **Hash svakog videa/chunka** (SHA-256) u bazi.
4. Periodično sidrenje merkle root-a hash-eva na blockchain (npr. Polygon).

Time dobijaš:
- dokaz originalnosti i vremena nastanka,
- audit trag,
- bez potrebe da ceo video ide “na chain” (preskupo/sporo).

## Free tier pravila (inicijalna verzija)

- Maksimum **3 videa** po korisniku.
- Maksimalno trajanje po videu: **3 minuta**.
- Maksimalna veličina po fajlu: **30 MB**.

Predlog formata za limit:
- Video: H.264
- Audio: AAC
- Container: MP4
- Target bitrate profilisati da 3 min ostanu ispod 30 MB.

## Monetizacija autora (core startup differentiator)

Model:
- Mediji/agregatori ne mogu besplatno preuzimati sadržaj.
- Kupovina licence ide kroz platformu.
- Autor dobija automatski procenat.
- Platform fee transparentan u smart-contract ili backend ledger logici.

Minimalni MVP tok:
1. Upload i objava videa.
2. “Request license” dugme.
3. Plaćanje.
4. Isporuka originalnog fajla + dokaz o licenciranju.

## Predlog arhitekture (jednostavna i skalabilna)

1. **Client PWA**
	- Kamera, lokalno snimanje, chunk upload, izbor local/server processing.
2. **API Gateway (Nginx)**
	- TLS, routing, rate limit, keepalive tuning.
3. **Core API**
	- Auth, video metadata, tier limits, license workflow.
4. **Storage Layer**
	- S3 objekti + Postgres metadata.
5. **Processing Layer**
	- Worker queue (FFmpeg jobs) samo kada je potrebno.
6. **Proof Layer**
	- Hashing + periodično anchor na blockchain.

## Community Node režim (desktop kao server)

Novi dodatak: korisnik može da pokrene svoj desktop server i da:
- koristi ga kao privatni ingest/storage node,
- opciono deli resurse sa mrežom (DC hub / torrent princip).

U Day-1 MVP-u je implementirano:
- registracija čvora,
- heartbeat mehanizam,
- listing aktivnih čvorova.

Sledeći koraci su replika chunk-ova i reputacioni sistem čvorova.

Detalji:
- EN: [docs/en/community-node.md](docs/en/community-node.md)
- SR: [docs/sr/community-node.md](docs/sr/community-node.md)

## Nginx i keepalive (osnovni smer)

- HTTP/2 i TLS obavezno.
- Keepalive konekcije uključene za upload stabilnost.
- `client_max_body_size` uskladiti sa 30 MB limitom.
- Odvojeni upstream-i za API i ingest rutu.
- Rate-limit po IP + po korisniku da spreči abuse.

## Trošak i free-first strategija

Obavezni trošak za MVP može biti **0 €** ako koristiš:
- Proxmox + Linux VM/LXC,
- Appwrite/Node + Postgres,
- MinIO,
- Nginx,
- FFmpeg,
- Prometheus/Grafana.

Jedini potencijalni eksterni troškovi su domen i eventualni blockchain transaction fee za anchor (može batch dnevno da bude minimalan).

## Najbrži put do prvog demoa (7–10 dana)

1. Dan 1–2: PWA kamera + lokalno snimanje + upload chunkova.
2. Dan 3–4: Backend sa limitima (3 videa / 3 min / 30 MB).
3. Dan 5: HLS playback i osnovni dashboard.
4. Dan 6–7: Enkripcija, hashing i proof logika.
5. Dan 8–10: Nginx hardening + mali pilot korisnici.

## Tehnologije (preporučeni stack)

- Frontend: React, Vite, TypeScript, PWA, Tailwind (opciono)
- Backend: Appwrite self-hosted (ili Node.js/NestJS + Postgres + Keycloak)
- Obrada videa: FFmpeg worker
- Proxy: Nginx
- Storage: MinIO self-hosted (S3-kompatibilan)
- Queue: Redis + BullMQ (ako preraste MVP)
- Blockchain proof: Polygon + periodični merkle anchor

## Principi dizajna koda

- Minimalan broj servisa u MVP-u.
- Čisti interfejsi (`capture`, `ingest`, `process`, `license`, `payout`).
- Event log za svaki upload/licencu.
- Feature flag za local vs server processing.
- Sve kritične limite implementirati server-side.

## Brz self-hosted deployment redosled

1. Proxmox: podigni 3 VM (`edge+app`, `db`, `storage+worker`).
2. Deploy Nginx + Appwrite/Node API + Postgres + MinIO.
3. Uključi TLS i Nginx keepalive.
4. Spoji PWA upload na `ingest` endpoint.
5. Aktiviraj server-side limite (3/3min/30MB).
6. Tek nakon toga dodaj blockchain proof i licensing flow.

## Day-1 pokretanje (MacBook + Redmi)

Lokalni development **ne zahteva Proxmox**. Dovoljni su Node.js + npm.

Najjednostavnije pokretanje na MacBook-u (i5/8GB):
1. `npm install`
2. `npm run dev:mac`

`dev:mac` režim radi bez FFmpeg server processing-a (device processing only), što je lakše za slabiji laptop.
Ako imaš FFmpeg na Mac-u (`brew install ffmpeg`), koristi `npm run dev:mac:ffmpeg` za server processing.

1. `npm install`
2. `npm run dev`
3. Na Mac-u otvori: `http://localhost:8080`
4. Na telefonu (isti Wi-Fi): `http://<lokalni-ip-macbooka>:8080`
5. Na telefonu instaliraj app preko dugmeta **Install Android App** (ili browser meni → Add to Home Screen)
6. Alternativno: skeniraj QR kod iz sekcije **Scan QR (LAN test)** na početnoj strani
7. Za brzo deljenje koristi **Copy LAN Link** ili **Share Link** dugme
8. Uključi **Smart Sync** ako želiš automatski upload lokalnih snimaka kad internet proradi
9. U sekciji **Local Offline Videos** koristi **Upload all pending** i **Keep all local** za batch akcije
10. Po potrebi promeni **Capture quality**: Auto / High / Data Saver

Google login setup (opciono):
- postavi env var `GOOGLE_CLIENT_ID` pre starta servera
- primer: `GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com npm run dev`
- Google credential se sada verifikuje **server-side** (ID token validacija), ne samo na klijentu

Session security (novo):
- login vraća bearer session token sa istekom (default 7 dana)
- TTL možeš menjati preko `AUTH_SESSION_TTL_MS`
- primer: `AUTH_SESSION_TTL_MS=259200000 GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com npm run dev`

## Android APK (Redmi i drugi telefoni)

Ovaj repo sada ima Capacitor Android packaging.

1. Pokreni backend/server (na mašini dostupnoj telefonu):
	- `npm install`
	- `npm run dev`
2. Postavi URL servera koji telefon može da otvori (LAN IP ili domen):
	- primer LAN: `FLPT_APP_URL=http://192.168.1.50:8080`
	- primer domen: `FLPT_APP_URL=https://tv.example.com`
3. Postavi Android SDK putanju (obavezno za build):
	- `export ANDROID_SDK_ROOT=/path/to/Android/Sdk`
4. Prvo generisanje Android projekta:
	- `FLPT_APP_URL=http://192.168.1.50:8080 npm run android:init`
5. Build debug APK:
	- `FLPT_APP_URL=http://192.168.1.50:8080 npm run android:apk:debug`
6. APK putanja:
	- `android/app/build/outputs/apk/debug/app-debug.apk`

Napomene:
- Za `http://` URL Android će dozvoliti cleartext samo za taj način rada (LAN/dev).
- Za produkciju koristi `https://` domen.
- Ako menjaš server URL, ponovo pokreni `android:sync` ili direktno `android:apk:debug`.

### Release APK / AAB (potpisano)

1. Napravi keystore (jednom):
	- `keytool -genkeypair -v -keystore flpt-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias flpt`
2. Export signing varijable:
	- `export FLPT_KEYSTORE_PATH=/absolute/path/to/flpt-release.jks`
	- `export FLPT_KEYSTORE_PASSWORD=your_keystore_password`
	- `export FLPT_KEY_ALIAS=flpt`
	- `export FLPT_KEY_PASSWORD=your_key_password`
3. Android SDK putanja:
	- `export ANDROID_SDK_ROOT=/path/to/Android/Sdk`
4. Build release APK:
	- `FLPT_APP_URL=https://your-domain.com npm run android:apk:release`
5. Build release AAB (Play Store):
	- `FLPT_APP_URL=https://your-domain.com npm run android:aab:release`

Output putanje:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

Ako signing env varijable nisu postavljene, release artifact će biti unsigned.

`android:sync` sada automatski pokušava da generiše `android/local.properties` iz `ANDROID_SDK_ROOT` ili `ANDROID_HOME`.

Moderation setup (admin):
- postavi admin naloge preko env var `ADMIN_USER_IDS` (comma-separated user IDs)
- primer: `ADMIN_USER_IDS=u-abcd1234,u-efgh5678 npm run dev`
- admin može da pregleda report-e i da mute/unmute korisnike iz UI sekcije **Moderation (Admin)**
- report audit trail: status (`open`/`resolved`/`rejected`), admin note, history log
- bulk moderation: multi-select report-a i jednim klikom promena statusa
- export moderation report-a: direktan download audit podataka u JSON/CSV formatu
- moderation filteri + paginacija (status/reporter/video/date)
- server-side processing putanja sada radi FFmpeg transcode (`processingMode=server`)
- chunk upload koristi AES-GCM (per-session key) kada je klijent online i podržava WebCrypto
- API ima osnovni rate-limit + request guard protiv očiglednih abuse pattern-a
- Day5 proof API: dnevni merkle root + anchor endpoint
- Day5 proof UI: sekcija **Proof of Origin** (daily roots + anchor status + admin anchor akcija)
- Day6 TLS profil: `infra/nginx/default.tls.conf` + `infra/docker-compose.proxmox.tls.yml`
- Day7 monetization osnova: license request/status + payout summary API
- Day7 monetization UI: sekcija **Licensing & Payouts** (license request, admin status update, payout pregled)
- Day8 compatibility: automatski fallback capture codec/profile + graceful degrade za slabije uređaje

Obavezno za multi-device test:
- aplikaciju testirati preko **lokalne IP adrese**, ne samo preko `localhost`.
- server sluša na `0.0.0.0` tako da je dostupan svim uređajima u istoj mreži.
- lokalnu IP adresu na Mac-u možeš videti komandom: `ipconfig getifaddr en0` (Wi-Fi).

Runbook:
- EN: [docs/en/day1-runbook.md](docs/en/day1-runbook.md)
- SR: [docs/sr/day1-runbook.md](docs/sr/day1-runbook.md)
- Proxmox Day2-7 fast-track: [docs/proxmox-day2-7-fasttrack.md](docs/proxmox-day2-7-fasttrack.md)
- Device test matrix template: [docs/device-test-matrix.md](docs/device-test-matrix.md)
- Production runbook: [docs/production-runbook.md](docs/production-runbook.md)
- Release checklist: [docs/release-checklist.md](docs/release-checklist.md)
- GitHub technical docs index: [docs/github/README.md](docs/github/README.md)
- Backend endpoints (taksativno): [docs/github/backend-endpoints.md](docs/github/backend-endpoints.md)
- Frontend endpoints (taksativno): [docs/github/frontend-endpoints.md](docs/github/frontend-endpoints.md)
- App architecture: [docs/github/app-architecture.md](docs/github/app-architecture.md)
- Technology architecture: [docs/github/technology-architecture.md](docs/github/technology-architecture.md)
- Request lifecycle diagram: [docs/github/request-lifecycle.md](docs/github/request-lifecycle.md)
- Full diagrams index: [docs/github/diagrams/README.md](docs/github/diagrams/README.md)
- Quick verification links: [docs/github/where-to-check.md](docs/github/where-to-check.md)
- Swagger UI: `/api/docs`
- OpenAPI JSON: `/api/docs.json`

Open-source onboarding:
- Contributing guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of Conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Issue/PR templates: [.github](.github)

## Domen preporuka

- Primarni produkcioni domen: **nettvsshop.com** (jasniji brending proizvoda).
- Sekundarni staging/dev domen: **war4.info**.

## Sledeći korak

Pogledaj [TODO.md](TODO.md) za taksativni plan izvršenja po prioritetima.
