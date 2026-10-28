# Unreleased

## What Changed

- Actor and Item compendium reads now go through one Craftworks call site, `scripts/core/allowed-packs.mjs`. That file will call Morelord Core's `getAllowedPacks` and `isUuidAllowed` helpers. It does not implement dnd5e Configure Sources itself.
- A compendium Core does not allow is no longer indexed, listed, offered, or used as a name or UUID fallback for recipes, materials, monsters, generators, treasure, or awards. Craftworks Content Pack settings only narrow that set.
- Recipe linking no longer reads an item compendium that Configure Sources excludes.
- A recipe whose finished item comes from a compendium Core does not allow is left out of the catalog, crafting list, and dashboard count. The recipe card is not kept with its item link removed. Ingredient names resolve only in that recipe's source book; Craftworks does not substitute another pack's item of the same name.
- Open Craftworks windows reload when Core fires `morelordCoreConfigureSourcesChanged`. Recipe, material, and treasure indexes are rebuilt from the packs Core allows.
