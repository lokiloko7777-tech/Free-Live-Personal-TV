# Day-1 Runbook (MacBook + Redmi)

## Cilj
Pokrenuti funkcionalan MVP za jedan dan:
- otvaranje aplikacije na telefonu,
- jednim klikom start kamere,
- snimanje radi i kada internet ne radi,
- kada internet proradi, korisnik bira upload ili čuvanje lokalno,
- free limiti važe na serveru,
- opciono radi registracija desktop Community Node čvora.

## Preduslovi
- Node.js 20+
- npm
- MacBook i Redmi na istoj mreži (za lokalni test)

## Pokretanje lokalno
1. Instaliraj zavisnosti:
   - `npm install`
2. Pokreni aplikaciju:
   - `npm run dev`
3. Otvori na Mac-u:
   - `http://localhost:8080`
4. Otvori na telefonu (isti Wi-Fi):
   - `http://<LOKALNI_IP_MACA>:8080`

Važno:
- Test sa drugih uređaja radi preko **lokalne IP adrese**, ne preko `localhost`.
- Server je podešen da sluša na `0.0.0.0`.

## Android instalacija (Day-1)
1. Na Redmi telefonu otvori `http://<LOKALNI_IP_MACA>:8080`.
2. Klikni dugme **Install Android App** (ako je dostupno).
3. Ako dugme nije dostupno: browser meni → **Add to Home Screen**.
4. Aplikacija se instalira kao PWA i može odmah da se testira lokalno.

## QR brzo povezivanje
- Na desktop prikazu početne strane koristi sekciju **Scan QR (LAN test)**.
- Skeniraj QR kod telefonom da otvoriš lokalnu IP adresu bez ručnog unosa.
- Za deljenje koristi **Copy LAN Link** ili **Share Link**.

## Smart Sync i batch lokalne akcije
- Uključi **Smart Sync** za automatski upload lokalnih snimaka kada internet postane dostupan.
- U sekciji **Local Offline Videos** koristi:
   - **Upload all pending** za upload celog reda,
   - **Keep all local** da sve pending snimke ostaviš samo lokalno.

## Quality i proof
- U User sekciji koristi **Capture quality**: Auto / High / Data Saver.
- Svaki snimak dobija proof oznaku (hash) koja se prikazuje u listama videa.

## Interakcija korisnika
- U sekciji **Explore Videos** možeš pregledati feed po kriterijumima: latest, most viewed, top rated.
- Korisnici mogu da daju ocenu (1-5) za svaki video.
- U sekciji **Video Chat** je omogućen chat po izabranom videu.
- Feed/chat/leaderboard sada imaju realtime sync (nije potreban ručni refresh kada stigne događaj).

## Login / privacy / avatar
- Korisnik može da se prijavi preko Google (Gmail) naloga ako je `GOOGLE_CLIENT_ID` podešen na serveru.
- Uvek je dostupna i opcija **Continue as Guest**.
- Korisnik bira anonimnost i jedan od 3 avatara: **male**, **female**, **anonymous**.
- Ime i prezime se ne prikazuju; koristi se privacy alias.
- Podržani su i **login** i **logout** tokovi.
- Google ID token se verifikuje server-side pre kreiranja sesije.
- Write API akcije koriste bearer session token (izdaje se na login-u, ima TTL).

Podešavanje Google login-a:
- pokreni server sa `GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com npm run dev`
- opciono podešavanje session TTL: `AUTH_SESSION_TTL_MS=259200000 npm run dev`

Podešavanje moderacije:
- admin korisnike postavi preko `ADMIN_USER_IDS` (user ID vrednosti odvojene zarezom)
- primer: `ADMIN_USER_IDS=u-abcd1234,u-efgh5678 npm run dev`
- svaki korisnik može prijaviti chat poruku; admin može mute/unmute i pregled report prijava
- za admin guest login, unesi jedan od tih ID-jeva u polje **User ID** pre klika na **Continue as Guest**
- report sada ima audit trail polja: status (`open`, `resolved`, `rejected`), admin napomenu i istoriju akcija
- admin može označiti više report prijava i primeniti bulk status update iz Moderation UI sekcije
- admin može izvesti moderation prijave i audit polja kao JSON ili CSV direktno iz Moderation UI sekcije
- moderation sada ima filtere + paginaciju po status/reporter/video/date kriterijumu

Day2-7 fast-track dodaci:
- server processing (`processingMode=server`) sada pokušava FFmpeg transcode u MP4
- chunk upload koristi AES-GCM per-session enkripcioni ključ kada WebCrypto postoji
- proof endpoint-i: `GET /api/proofs/daily-root`, `POST /api/proofs/anchor`
- proof UI: sekcija **Proof of Origin** prikazuje daily root + anchor status + admin anchor akciju
- monetization endpoint-i: `POST /api/licenses/request`, `POST /api/licenses/:licenseId/status`, `GET /api/payouts/summary`
- API + ingest sada imaju osnovni rate-limit po IP/per-session ključu
- Proxmox quick deploy: `infra/docker-compose.proxmox.yml`
- Proxmox TLS profil: `infra/docker-compose.proxmox.tls.yml` + `infra/nginx/default.tls.conf`

Day8 compatibility dodaci:
- capture sada automatski bira najbolji podržani codec/profile po uređaju/browser-u
- graceful degrade: ako audio capture padne, app snima video-only; ako MediaRecorder ne postoji, capture se blokira uz jasnu poruku
- capture profile se čuva u video metadata i prikazuje u listama/feed-u

## Test scenario
1. Unesi korisnički ID.
2. Potvrdi da se app otvara sa bar 2 uređaja preko `http://<LOKALNI_IP_MACA>:8080`.
3. Klikni **Start instantly**.
4. Snimi kratak video.
5. Klikni **Stop**.
6. Proveri da se video pojavljuje u listi.
7. Isključi internet na telefonu i snimi video (mora da ostane lokalno).
8. Uključi internet i potvrdi da aplikacija pita za upload ili keep-local.
9. Ponovi do 3 videa i proveri da je 4. blokiran.

## Community Node test
1. Idi na sekciju **Community Node**.
2. Unesi naziv čvora i opcioni URL.
3. Klikni **Register node**.
4. Klikni **List nodes** i proveri status.

## Izbor domena
- Primarni produkcioni domen: `nettvsshop.com` (jači brending).
- Opciono staging/dev: `war4.info`.

## Napomena
- Day-1 trenutno koristi fajl-perzistenciju (`data/db.json`, `uploads/`).
- Za Proxmox produkciju metadata prebaciti u Postgres, a video objekte u MinIO.
