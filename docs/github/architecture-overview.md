# Architecture Overview (Mermaid)

```mermaid
flowchart TB
    subgraph ClientSide[Client / PWA]
        UI[web/index.html]
        APP[web/app.js]
        SW[web/sw.js]
        IDB[(IndexedDB local queue)]
        UI --> APP
        APP <--> IDB
        APP --> SW
    end

    subgraph Edge[Edge Layer]
        NGINX[infra/nginx/default.conf]
    end

    subgraph Backend[Node.js Backend]
        API[server/index.js\nExpress API]
        SSE[SSE stream endpoint]
        AUTH[Auth API group]
        SESS[Sessions API group]
        FEED[Feed and Videos API]
        MOD[Moderation API group]
        PILOT[Pilot API group]
        FB[Feedback and Iterations API]
        LIC[Licensing and Payouts API]
        PROOF[Proof API group]
        NODEAPI[Nodes API group]
        METRICS[Metrics and Client Events API]

        API --> SSE
        API --> AUTH
        API --> SESS
        API --> FEED
        API --> MOD
        API --> PILOT
        API --> FB
        API --> LIC
        API --> PROOF
        API --> NODEAPI
        API --> METRICS
    end

    subgraph DataLayer[Persistence]
        DB[(data/db.json)]
        UP[(uploads/)]
        HLS[(uploads/hls/...)]
    end

    subgraph Processing[Media Processing]
        FFMPEG[FFmpeg\ntranscode + HLS pack]
    end

    APP -->|HTTPS API| NGINX
    APP -->|SSE subscribe| NGINX
    NGINX --> API

    API <--> DB
    API <--> UP
    API --> FFMPEG
    FFMPEG --> UP
    FFMPEG --> HLS

    APP -->|offline capture| IDB
    APP -->|re-upload queue| NGINX

    classDef comp fill:#1d2939,stroke:#93c5fd,color:#ffffff
    class UI,APP,SW,IDB,NGINX,API,SSE,AUTH,SESS,FEED,MOD,PILOT,FB,LIC,PROOF,NODEAPI,METRICS,DB,UP,HLS,FFMPEG comp
```

## Notes

- Realtime je jednostrani push preko SSE (server -> client).
- Upload pipeline je chunk-based, sa optional AES-GCM chunk enkripcijom.
- Offline-first tok koristi IndexedDB queue i kasniji re-upload.
- Trenutna perzistencija je file-based (`data/db.json` + `uploads/`), uz plan migracije na Postgres + object storage.
