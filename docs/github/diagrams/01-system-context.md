# 01 System Context

```mermaid
%%{init: {'theme':'base','themeVariables': {'primaryColor':'#1d2939','primaryTextColor':'#ffffff','primaryBorderColor':'#93c5fd','lineColor':'#93c5fd','secondaryColor':'#344054','tertiaryColor':'#101828','background':'#101828'}}}%%
flowchart LR
    User[Mobile/Web User]
    Admin[Admin/Moderator]
    Buyer[Media Buyer]
    NodeOwner[Community Node Owner]

    App[Free Live Personal TV\nPWA + API]

    Device[(Phone Camera + Storage)]
    Browser[(Browser/PWA Runtime)]

    User --> Browser
    Browser --> App
    Admin --> App
    Buyer --> App
    NodeOwner --> App
    Browser --> Device

    classDef x fill:#1d2939,stroke:#93c5fd,color:#fff
    class User,Admin,Buyer,NodeOwner,App,Device,Browser x
```
