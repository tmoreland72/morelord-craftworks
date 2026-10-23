# Unreleased

## What Changed

- **Recipes (N)** on a Materials card opens Recipes filtered to the enabled recipes that accept that material. Matching uses the same ingredient rules as crafting: material ID, name, tags, category, stage, rarity, alternatives, and Drakkenheim component family, part, creature type, and rarity. The previous inline **Used in** line is no longer shown. **Produced by** is unchanged. **Clear all filters** returns to the full catalog. Players see only recipes they know.
- Removed 22 Kibbles catalog recipes whose ingredients used 18 material IDs that are not in the Craftworks Standard catalog: `scraps-of-leather`, `flask`, `common-reagent`, `rare-reagent`, `wood-scraps`, `mithril-scraps`, `rough-gem`, `bolt-of-silk`, `raw-cotton`, `raw-wool`, `raw-silk`, `paint`, `canvas`, `water`, `barrel`, `oak-barrel`, `unformed-glass`, and `supplies-salt-staples-etc`. Those recipes could not be completed. PHB and DMG candidates come from this seed, so they no longer include Common Magical Ink, Rare Magical Ink, 10 x Dart, Bolt of Cloth, Bolt of Silk, Shoes, the three glassblowing lens/vial recipes, Painting, Fancy Painting, the five broken brewing recipes, Basic Cut Gem, Exotic Cut Gem, Masterwork Ring, Masterwork Amulet, Ballgown, or Noble Garb.

## Verification

Live Foundry verification of the Recipes button is still outstanding. Run `runCraftReferenceTests` from `scripts/testing/craft-reference-links.mjs` in Dev1.
