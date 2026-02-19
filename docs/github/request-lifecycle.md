# Request Lifecycle (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    participant U as User (PWA)
    participant FE as web/app.js
    participant NG as Nginx
    participant API as server/index.js
    participant DB as data/db.json
    participant FS as uploads/
    participant FF as FFmpeg
    participant SSE as SSE stream

    Note over U,FE: Login/session bootstrap
    U->>FE: Continue as Guest / Google Sign-In
    FE->>NG: POST /api/auth/session
    NG->>API: Proxy request
    API->>DB: upsert user + issue token
    API-->>FE: sessionToken + profile

    FE->>NG: GET /api/realtime/stream?sessionToken=...
    NG->>API: SSE connect
    API-->>FE: ready + initial sync events

    Note over U,FE: Capture and upload session
    U->>FE: Start recording
    FE->>NG: POST /api/sessions
    NG->>API: Proxy request
    API->>DB: create session(status=recording)
    API-->>FE: sessionId + chunk crypto metadata

    loop For each chunk
        FE->>NG: POST /api/sessions/:id/chunks
        NG->>API: Proxy request
        API->>FS: append chunk bytes
        API->>DB: update duration/size/session progress
        API-->>FE: 202 accepted
    end

    FE->>NG: POST /api/sessions/:id/complete
    NG->>API: Proxy request
    API->>FS: finalize source media

    alt processingMode = server and ffmpeg enabled
        API->>FF: transcode to mp4 + generate HLS variants
        FF->>FS: write output files + hls playlists
    else device mode / fallback
        API->>FS: keep uploaded media as final
    end

    API->>DB: mark completed + update metrics/proof/feed state
    API-->>FE: complete response(fileUrl/hls/proof)

    Note over API,SSE: Realtime refresh fanout
    API-->>SSE: broadcast sync payload(feed,myVideos,limits,metrics)
    SSE-->>FE: sync event
    FE->>NG: GET /api/feed + GET /api/videos/:userId + GET /api/limits/:userId
    NG->>API: Proxy requests
    API->>DB: read refreshed state
    API-->>FE: updated data for UI

    Note over FE,DB: Offline-first branch
    alt network unavailable
        FE->>FE: store blob in IndexedDB queue
    else network restored
        FE->>NG: replay /api/sessions + /chunks + /complete
        NG->>API: same ingest lifecycle
    end
```

## Notes

- API lifecycle je token-gated za write tokove (`Authorization: Bearer ...`).
- Chunk ingest je dizajniran za mobilnu mrežu (segmentisani upload + retry/offline queue).
- SSE ne prenosi kompletne podatke već signal za klijentski refresh relevantnih lista.
- Server-side processing i HLS su opcioni i zavise od FFmpeg dostupnosti/podešavanja.
