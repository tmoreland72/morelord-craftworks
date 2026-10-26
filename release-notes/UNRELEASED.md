# Unreleased

## What Changed

- **Recipes (N)** on a Materials card opens Recipes filtered to the enabled recipes that accept that material. Matching uses the same ingredient rules as crafting: material ID, name, tags, category, stage, rarity, alternatives, and Drakkenheim component family, part, creature type, and rarity. The previous inline **Used in** line is no longer shown. **Produced by** is unchanged. **Clear all filters** returns to the full catalog. Players see only recipes they know.
- Removed 22 Kibbles catalog recipes whose ingredients used 18 material IDs that are not in the Craftworks Standard catalog: `scraps-of-leather`, `flask`, `common-reagent`, `rare-reagent`, `wood-scraps`, `mithril-scraps`, `rough-gem`, `bolt-of-silk`, `raw-cotton`, `raw-wool`, `raw-silk`, `paint`, `canvas`, `water`, `barrel`, `oak-barrel`, `unformed-glass`, and `supplies-salt-staples-etc`. Those recipes could not be completed. PHB and DMG candidates come from this seed, so they no longer include Common Magical Ink, Rare Magical Ink, 10 x Dart, Bolt of Cloth, Bolt of Silk, Shoes, the three glassblowing lens/vial recipes, Painting, Fancy Painting, the five broken brewing recipes, Basic Cut Gem, Exotic Cut Gem, Masterwork Ring, Masterwork Amulet, Ballgown, or Noble Garb.
- Recipe linking reads an enabled pack's item compendium even when dnd5e Configure Sources excludes that compendium, and retries indexing without rarity fields if the first index request fails. Generated rewards still honor Configure Sources.
- Ingredient materials still come from Craftworks Standard or Drakkenheim, whichever pack defined them, after another book wins the finished item.
- SRD 5.1 and SRD 5.2 both default to enabled. The **Available** badge on those cards means no extra module is required; the **Enabled** checkbox is the saved world setting. A world that already saved either pack off keeps that choice. The one-time standard-content bootstrap still turns on Craftworks Standard and SRD 5.2 only, and it does not run again.
- The Recipes toolbar no longer shows a count of recipes with unknown ingredients. **Mark Context Unknown** and **Mark Context Known** remain. When a GM loads the world, hidden recipe ids that do not match a current packaged or custom recipe are removed.
- With Craftworks Standard, SRD 5.1, SRD 5.2, Player's Handbook, Dungeon Master's Guide, and Drakkenheim enabled, and those item compendiums installed, the dashboard Recipes total is 288. SRD 5.2 supplies 16, SRD 5.1 supplies 7, Player's Handbook 55, Dungeon Master's Guide 134, and Drakkenheim 76. If the SRD item compendiums are not installed, the total is 265.

## Verification

Live Foundry verification of the Recipes button is still outstanding. Run `runCraftReferenceTests` from `scripts/testing/craft-reference-links.mjs` in Dev1.
