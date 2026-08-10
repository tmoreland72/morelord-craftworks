# Morelord Craftworks Content Packs

Each Craftworks Content Pack has one entry in `manifests.mjs`.

A manifest may contribute:

- `materials`
  - `seedPath`: optional packaged JSON seed path
  - `entries`: optional in-memory material definitions
- `recipes`
- `harvestProfiles`
- `gatheringProfiles`
- `lootTiers`
- `encounterLootProfiles`

## Pack ownership

Every runtime entry is assigned a `packId`. If an entry omits it, the manifest
id becomes the owner.

## Priority and collisions

Manifests have a numeric `priority`.

Lower-priority packs are loaded first. Higher-priority packs load later.

When two active packs define the same identity:

- recipe `id`
- Harvest profile `id`
- Gathering profile `id`
- Loot tier `id`
- Encounter Loot profile `id`
- material `materialId`

the higher-priority pack wins.

This allows campaign packs such as Monsters of Drakkenheim to intentionally
override a generic Standard definition while both packs remain enabled.

Within a single manifest, duplicate IDs are invalid and startup validation fails.

## Entitlements and world enablement

The manifest does not decide whether a pack is active.

`ContentPackService` combines:

1. the GM's world enable/disable setting, and
2. Morelord Core entitlement/access state.

Inactive packs contribute no runtime content.
