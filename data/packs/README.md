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

## Player's Handbook content pack

The PHB pack uses `data/kibbles-recipes.seed.mjs` as the authoritative
recipe source. Every Kibbles catalog-item recipe is treated as a candidate.
At runtime, Craftworks indexes only the exact Foundry collection
`dnd-players-handbook.equipment` and includes a PHB recipe only when the
finished output can be resolved there by name.

The PHB module supplies the finished Foundry Item. Kibbles supplies the
crafting tool, ability, DC, time, value, and material requirements.
Craftworks Standard supplies the shared Kibbles-defined materials.

Do not duplicate PHB Item definitions inside Craftworks and do not hard-code
PHB compendium document IDs.

## Dungeon Master's Guide content pack

The DMG pack uses `data/kibbles-recipes.seed.mjs` as the authoritative
recipe source. Every Kibbles catalog-item recipe is treated as a candidate.
At runtime, Craftworks indexes only the exact Foundry collection
`dnd-dungeon-masters-guide.equipment` and includes a DMG recipe only when
the finished output can be resolved there by name.

The DMG module supplies the finished Foundry Item. Kibbles supplies the
crafting tool, ability, DC, time, value, and material requirements.
Craftworks Standard supplies the shared Kibbles-defined materials.

Do not duplicate DMG Item definitions inside Craftworks and do not hard-code
DMG compendium document IDs.

## Monsters of Drakkenheim content pack

This pack has its own material catalog and crafting rules.

- Material definitions come from the supplied Antics & Rolls: Drakkenheim
  Mastercraft ingredient catalog. Craftworks creates a component Item for each
  defined ingredient at each Monsters of Drakkenheim component rarity.
- Recipe requirements come from Appendix E: Magic Items in Monsters of
  Drakkenheim.
- Finished items are not copied into Craftworks. At runtime, the recipe resolver
  indexes Item compendiums belonging to the installed `drakkenheim-monsters`
  package and resolves the recipe output by exact normalized item name.
- Monsters of Drakkenheim crafting takes one day at the required Workshop and
  does not require a crafting check. Craftworks therefore uses a no-check
  completion path for these recipes rather than Kibbles' repeated checks.
