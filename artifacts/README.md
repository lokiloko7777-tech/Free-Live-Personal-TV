# APK Artifacts

- File: free-live-personal-tv-debug.apk
  - Build: debug (Capacitor Android)
  - Backend mode: dynamic LAN auto-discovery (DHCP friendly)
  - SHA256: 2d4c8102f7269837233d650d573333c6610f5d82207127267db2800f97d50bbc

- File: free-live-personal-tv-release-signed.apk
  - Build: release (signed)
  - Backend mode: dynamic LAN auto-discovery (DHCP friendly)
  - SHA256: 5ab3630d8330b7ef215e99c88de14b87a97b12e688a2959a3ccff1fe5a3b290c

- File: free-live-personal-tv-production-public-ip-unsigned.apk
  - Build: release (unsigned)
  - Backend mode: fixed public backend URL baked into APK
  - Build setting: FLPT_PUBLIC_IP=4.210.177.138, FLPT_APP_SCHEME=http, FLPT_APP_PORT=8080
  - SHA256: 53f9325d7396f2509b616f16951f76c9fe678132f559c69bc29eb729bd3f1d65

Napomena: telefon i server moraju biti na istoj Wi‑Fi mreži, a server mora slušati na 0.0.0.0:8080.
Po potrebi možeš override-ovati backend URL preko query parametra: ?backend=http://<server-ip>:8080
