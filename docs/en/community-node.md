# Community Node Mode (Desktop-as-Server)

## What it is
Community Node allows users to run their own desktop machine as:
- personal ingest/storage node,
- optional shared resource node for the network pool.

## MVP architecture
- Central registry tracks active nodes (`/api/nodes`).
- Each node registers and sends heartbeats.
- Clients can discover available nodes.

## Why this matches DC hub / torrent spirit
- Resource sharing is voluntary.
- Storage and bandwidth can be contributed by the community.
- Central server can evolve into coordinator rather than full media host.

## Next evolution (post Day-1)
1. Signed node identity (public/private key).
2. Node reputation and uptime score.
3. Chunk replication across 2+ nodes.
4. Optional WebRTC data channels for direct transfer.
5. Incentive ledger for contributors.
