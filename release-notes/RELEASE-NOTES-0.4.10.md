# Morelord Craftworks 0.4.10

## What Changed

### Improvements

- Fixed v6 rarity handling across crafting materials, recipes, potions, treasure, and award summaries while retaining legacy rarity support. Uses the shared reader in Core 0.3.8.
- Verified Foundry compatibility is explicitly recorded as 14.367; existing Foundry and system support minimums remain unchanged.
- Release guidelines require checking the latest stable Foundry build and confirming the published Foundry listing.

## Validation

- 56 automated tests pass, including legacy/v6 rarity, potion, treasure, and recipe regressions. Live settings rendering and module initialization checked on Foundry 14.367 / D&D 5e 6.0.1.
- Legacy rarity compatibility is regression-tested; a live pre-v6 world was not available.
