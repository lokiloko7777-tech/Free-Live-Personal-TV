# Device Test Matrix (Day-8)

## Goal
Validate capture/upload compatibility across older and newer devices.

## Test dimensions
- Device model
- OS version
- Browser version
- MediaRecorder support
- Chosen capture profile (`auto-vp8`, `auto-legacy`, `saver-*`, `high-*`)
- Audio capture available (yes/no)
- Online upload success (yes/no)
- Offline local save success (yes/no)
- Re-upload after reconnect (yes/no)
- Playback success (yes/no)

## Matrix template

| Device | OS | Browser | MediaRecorder | Profile | Audio | Online Upload | Offline Save | Reconnect Upload | Playback | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Redmi (legacy sample) | Android X | Chrome Y | Yes/No | auto-legacy | Yes/No | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | |
| Samsung (modern sample) | Android X | Chrome Y | Yes/No | auto-vp8 | Yes/No | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | |
| iPhone (legacy iOS) | iOS X | Safari Y | Yes/No | auto-legacy | Yes/No | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | |
| iPhone (new iOS) | iOS X | Safari Y | Yes/No | auto-vp8/legacy | Yes/No | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | |

## Acceptance recommendation
- Minimum 90% successful online upload sessions.
- Offline recording must work on every tested device.
- Reconnect upload should pass on all devices that support online mode.
