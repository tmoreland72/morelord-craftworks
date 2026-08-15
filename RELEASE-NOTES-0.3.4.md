# Morelord Craftworks 0.3.4

Morelord Craftworks 0.3.4 makes Standard materials and supported SRD 5.2 recipes available automatically when a world starts.

## Fixed

- Fresh worlds now enable **Craftworks Standard** and **SRD 5.2** automatically without requiring account authentication or manual compendium synchronization.
- Worlds affected by earlier access gating automatically restore the Standard and SRD 5.2 content-pack defaults once.
- Startup synchronization now waits until the D&D5e item resolver and recipe registry are attached, preventing a successful sync from recording zero indexed recipes.

## Notes

- SRD 5.2 recipe availability is limited to recipes whose outputs match items in the installed D&D5e SRD 5.2 Equipment compendium.
- Premium content packs continue to require their corresponding entitlements.
