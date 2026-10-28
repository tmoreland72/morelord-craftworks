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

- Harvest profile `id`
- Gathering profile `id`
- Loot tier `id`
- Encounter Loot profile `id`
- material `materialId`

the higher-priority pack wins.

Recipes are different. The same recipe name is loaded once, from the
highest-priority enabled source whose finished item resolves:

1. Any other source pack, such as Monsters of Drakkenheim and future setting
   or third-party packs
2. Dungeon Master's Guide
3. Player's Handbook
4. SRD 5.2, then SRD 5.1

A disabled pack is skipped, so the next enabled source supplies that recipe.
The dashboard Recipes total is the number of unique recipes loaded this way,
including a custom world recipe. Content pack cards in Craftworks Settings do
not list recipe or profile counts.

SRD titles that drop a creator prefix match a Player's Handbook or Dungeon
Master's Guide item when that book has exactly one `<Name>'s` plus the SRD
title. Explicit pairs cover the renames that pattern misses: Crawler Mucus /
Carrion Crawler Mucus, Efficient Quiver / Quiver of Ehlonna, Restorative
Ointment / Keoghtom's Ointment, and the stone and storm belts of giant
strength. Recipes named `1st-Level Spell` through `9th-Level Spell` are not
loaded. Each spell already has a scroll item, and those nine generic outputs
are not handbook items. Cantrip and the Drakkenheim spell-scroll tier recipes
stay.

With every pack enabled and its item compendium installed, that total is 279:
SRD 5.1 supplies 4 (Saddle, Exotic; Saddle, Pack; Saddlebag; Merchant's Scale),
Player's Handbook 55, Dungeon Master's Guide 144, and Monsters of Drakkenheim
76. SRD 5.2 adds nothing further while the Dungeon Master's Guide is enabled.
Linking reads a compendium only when dnd5e Configure Sources allows it. A
finished item from a compendium that setting excludes drops the recipe from
the catalog instead of leaving a card with no item link. Ingredient names
stay in the recipe's own source book and are not replaced by another pack.
Missing SRD item compendiums, or SRD packs saved as disabled, leave those four
recipes out, and the total is 275. The renamed items still load from the
Dungeon Master's Guide. Ingredient materials are not taken from the winning
book. Kibbles materials come from Craftworks Standard.

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
Ingredient `materialId` values must exist in the Craftworks Standard catalog.
Recipes that require a material ID missing from that catalog are omitted from
the seed.

At runtime, Craftworks indexes only the exact Foundry collection
`dnd-players-handbook.equipment` and includes a PHB recipe only when the
finished output can be resolved there by name.

The PHB module supplies the finished Foundry Item. Kibbles supplies the
crafting tool, ability, DC, time, value, and material requirements.
Craftworks Standard supplies the shared Kibbles-defined materials.

A recipe whose finished item also resolves in a higher-priority enabled
book is supplied by that book instead. Disabling the higher-priority book
lets this pack supply it.

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
  indexes these installed Item compendiums and resolves the recipe output by
  normalized item name, including the same near-miss titles used for the SRD:
  `drakkenheim-monsters.items`, `drakkenheim-core.items`, and
  `drakkenheim-scgd.items`.
- Monsters of Drakkenheim crafting takes one day at the required Workshop and
  does not require a crafting check. Craftworks therefore uses a no-check
  completion path for these recipes rather than Kibbles' repeated checks.
