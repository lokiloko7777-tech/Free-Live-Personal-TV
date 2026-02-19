# Community Node režim (Desktop-kao-server)

## Šta je to
Community Node omogućava korisniku da pokrene svoj desktop računar kao:
- lični ingest/storage čvor,
- opcioni deljeni čvor za mrežni pool resursa.

## MVP arhitektura
- Centralni registry prati aktivne čvorove (`/api/nodes`).
- Svaki čvor se registruje i šalje heartbeat.
- Klijenti otkrivaju dostupne čvorove.

## Zašto je blisko DC hub / torrent modelu
- Deljenje resursa je dobrovoljno.
- Zajednica može da deli storage i bandwidth.
- Centralni server postaje koordinator umesto jedinog domaćina medija.

## Sledeća evolucija (posle Day-1)
1. Potpisani identitet čvora (public/private key).
2. Reputacija čvora i uptime score.
3. Replikacija chunk-ova na 2+ čvora.
4. Opcioni WebRTC data channel za direktan transfer.
5. Incentive ledger za kontribuciju.
