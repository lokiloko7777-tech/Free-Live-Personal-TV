# 00 Master Overview

```mermaid
%%{init: {'theme':'base','themeVariables': {'primaryColor':'#1d2939','primaryTextColor':'#ffffff','primaryBorderColor':'#93c5fd','lineColor':'#93c5fd','secondaryColor':'#344054','tertiaryColor':'#101828','background':'#101828'}}}%%
flowchart TB
    subgraph Actors
      U[User]
      ADM[Admin]
      BUY[Buyer]
      NOD[Node Owner]
    end

    subgraph Frontend[PWA Frontend]
      UI[UI + App Logic]
      SW[Service Worker]
      IDB[(IndexedDB Offline Queue)]
      UI --> SW
      UI <--> IDB
    end

    subgraph Edge[Edge]
      NGINX[Nginx]
    end

    subgraph Backend[Node API]
      AUTH[Auth/Sessions]
      INGEST[Capture Sessions + Chunks]
      SOCIAL[Feed/Chat/Rating/Leaderboard]
      MOD[Moderation]
      GROWTH[Pilot + Feedback + Iterations]
      LIC[Licensing + Payouts]
      PROOF[Proof + Anchor]
      OPS[Metrics + Audit + Client Events]
      NODEAPI[Community Nodes]
      SSE[SSE Realtime Sync]
      FF[FFmpeg Processing + HLS]
    end

    subgraph Data[Persistence]
      DB[(data/db.json)]
      UP[(uploads/)]
      HLS[(uploads/hls)]
    end

    U --> UI
    ADM --> UI
    BUY --> UI
    NOD --> UI

    UI -->|REST| NGINX --> AUTH
    UI -->|REST| NGINX --> INGEST
    UI -->|REST| NGINX --> SOCIAL
    UI -->|REST| NGINX --> MOD
    UI -->|REST| NGINX --> GROWTH
    UI -->|REST| NGINX --> LIC
    UI -->|REST| NGINX --> PROOF
    UI -->|REST| NGINX --> OPS
    UI -->|REST| NGINX --> NODEAPI

    UI -->|SSE subscribe| NGINX --> SSE
    INGEST --> SSE
    SOCIAL --> SSE
    MOD --> SSE
    GROWTH --> SSE
    LIC --> SSE
    PROOF --> SSE
    OPS --> SSE
    NODEAPI --> SSE
    SSE --> UI

    AUTH <--> DB
    INGEST <--> DB
    SOCIAL <--> DB
    MOD <--> DB
    GROWTH <--> DB
    LIC <--> DB
    PROOF <--> DB
    OPS <--> DB
    NODEAPI <--> DB

    INGEST <--> UP
    INGEST --> FF
    FF --> UP
    FF --> HLS

    classDef x fill:#1d2939,stroke:#93c5fd,color:#fff
    class U,ADM,BUY,NOD,UI,SW,IDB,NGINX,AUTH,INGEST,SOCIAL,MOD,GROWTH,LIC,PROOF,OPS,NODEAPI,SSE,FF,DB,UP,HLS x
```

## Scope

Master pregled kombinuje:
- sistemski kontekst,
- aplikativne module,
- ingest/processing tok,
- realtime sync,
- governance i monetization tokove,
- data i deployment sloj.
