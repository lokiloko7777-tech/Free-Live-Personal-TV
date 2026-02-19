# TODO (taksativno)

## Pre-faza — Self-hosted infrastruktura (Prioritet: Kritično)
- [ ] Definisati Proxmox layout: 3 VM minimum (`edge+app`, `db`, `storage+worker`).
- [ ] Postaviti mrežu i firewall pravila između VM-ova.
- [ ] Deploy MinIO self-hosted i mount storage volume.
- [ ] Deploy Postgres self-hosted sa dnevnim backup-om.
- [ ] Deploy Appwrite self-hosted (ili Node API + Keycloak).
- [ ] Potvrditi da MVP nema obavezne plaćene servise.

## Faza 0 — Osnova repozitorijuma (Prioritet: Kritično)
- [ ] Definisati `docs/architecture.md` sa dijagramom tokova (capture → ingest → storage → license).
- [ ] Dodati `docs/non-functional.md` (latencija, kompatibilnost, limiti).
- [ ] Definisati coding standard i branching pravila.

## Faza 1 — MVP capture + upload (Prioritet: Kritično)
- [ ] PWA shell (instalacija ikonice na telefonu).
- [ ] Dugme: "Start instantly" pokreće kameru i snimanje odmah.
- [ ] Lokalno čuvanje snimka na uređaju.
- [ ] Paralelni chunk upload ka serveru (1–2 s segmenti).
- [ ] Retry mehanizam za slab internet.

## Faza 2 — Tier limiti (Prioritet: Kritično)
- [x] Ograničiti broj videa na 3 za free korisnika.
- [x] Ograničiti trajanje na 3 min po videu.
- [x] Ograničiti veličinu na 30 MB.
- [x] Server-side validacija svih limita.

## Faza 3 — Processing izbor (Prioritet: Visok)
- [x] UI prekidač: "Process on device" / "Process on server".
- [x] Device path: osnovna kompresija na telefonu.
- [x] Server path: FFmpeg worker transcoding.
- [x] Metadata polje koje beleži gde je processing izvršen.

## Faza 4 — Sigurnost i anonimnost (Prioritet: Visok)
- [x] Pseudonymous user ID (bez obaveznih ličnih podataka).
- [x] AES-GCM enkripcija chunkova pre slanja.
- [x] SHA-256 hash za svaki video/chunk.
- [x] Audit log događaja (upload, process, publish, license).

## Faza 5 — Blockchain proof (Prioritet: Srednji)
- [x] Kreirati merkle root od dnevnih hash-eva.
- [x] Periodično anchor-ovati root na Polygon (manual endpoint osnova).
- [x] Čuvati tx hash i referencu u bazi.
- [x] UI prikaz "Proof of origin".

## Faza 6 — Nginx i skaliranje (Prioritet: Visok)
- [x] Reverse proxy za API + ingest.
- [x] Keepalive i timeout tuning.
- [x] Rate-limit po IP i korisniku.
- [x] TLS hardening i osnovna WAF pravila.
- [x] Horizontalno dodavanje worker instance kroz Proxmox bez promene aplikativnog koda (compose osnova).

## Faza 7 — Monetizacija (Prioritet: Visok)
- [x] License request workflow za medije/agregatore.
- [x] Checkout i izdavanje licence (UI + API status workflow).
- [x] Podela prihoda autor/platforma.
- [x] Dashboard sa pregledom zarade autora (UI + API summary).

## Faza 8 — Kompatibilnost sa starim uređajima (Prioritet: Kritično)
- [x] Fallback codec/profile za slabije telefone.
- [x] HLS playback sa više kvaliteta.
- [x] Test matrix: Android stari modeli + iOS starije verzije.
- [x] Graceful degrade za uređaje bez punog MediaRecorder feature seta.

## Faza 9 — Pilot i rast (Prioritet: Visok)
- [x] Zatvoreni beta pilot (20–50 korisnika).
- [x] Merenje: uspeh upload-a, vreme do prvog frame-a, crash rate.
- [x] Iteracije po feedback-u svakih 7 dana.
- [x] Open-source community onboarding (issues, templates, CONTRIBUTING).

## Faza 10 — Community Node P2P (Prioritet: Visok)
- [ ] Signed node identity (ključ + potpis heartbeat poruka).
- [ ] Reputacioni score i anti-abuse pravila za node-ove.
- [ ] Replikacija chunk-ova na najmanje 2 community node-a.
- [ ] Scheduler za raspodelu opterećenja po dostupnom bandwidth/storage.
- [ ] Incentive model za korisnike koji dele resurse.

## Operativni troškovi (kontrola) (Prioritet: Visok)
- [ ] Dashboard za CPU/RAM/disk/network potrošnju po servisu.
- [ ] Alarmi za disk usage i throughput (posebno storage VM).
- [ ] Automatizovan lifecycle: brisanje privremenih transcode fajlova.
- [ ] Dokumentovati granice kapaciteta pre sledećeg hardverskog proširenja.

## Definicija uspeha (MVP)
- [ ] 90%+ uspešnih upload sesija na mobilnim mrežama.
- [ ] Prosečno vreme od klika do live ingest < 3 sekunde.
- [ ] 100% server-side enforcement free limita.
- [ ] Prva uspešna kupovina licence i payout autoru.
