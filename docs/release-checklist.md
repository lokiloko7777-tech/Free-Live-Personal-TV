# Release Checklist

## Pre-release
- [ ] `npm ci` prolazi bez greške
- [ ] Aplikacija startuje (`npm run start`)
- [ ] `GET /api/health` vraća `ok`
- [ ] Auth/login/logout tok provereni
- [ ] Upload + complete session tok proveren
- [ ] Feed/rating/chat osnovni tok proveren
- [ ] Admin tok: moderation, metrics, pilot, feedback, iterations

## Security
- [ ] `REQUIRE_HTTPS=1` u produkciji
- [ ] `ADMIN_USER_IDS` validiran
- [ ] Nema tajni u kodu i repo fajlovima
- [ ] Security reporting putanja dostupna (`SECURITY.md`)

## Operacije
- [ ] Backup strategija aktivna
- [ ] Disk monitor i alert prag postavljen
- [ ] Rollback plan spreman
- [ ] Runbook ažuran (`docs/production-runbook.md`)

## Open source hygiene
- [ ] Issue templates prisutni
- [ ] PR template prisutan
- [ ] `CONTRIBUTING.md` i `CODE_OF_CONDUCT.md` prisutni

## Final go/no-go
- [ ] Tim potvrđuje release
- [ ] Tag/release note pripremljen
