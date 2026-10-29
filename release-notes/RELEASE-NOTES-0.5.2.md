# Morelord Craftworks 0.5.2

## What Changed

### Fixed

- **Settings → Crafting** lists **Smith's Tools** once, using the D&D 2024 name. Packaged recipes that asked for Blacksmith's Tools now ask for Smith's Tools, including the recipe that crafts those tools. A facility chosen for Smith's Tools applies to those recipes. A facility rule already saved as Blacksmith's Tools still applies to Smith's Tools, including a custom recipe that still stores the older name.
- The player Craftworks dashboard no longer shows a Player Resources section. Players still open **Materials**, **Recipes**, and **Craft** from the Craft section.
- **Place in {party name} Inventory** after crafting success creates the item through the connected GM. A party member does not need to own the Group actor. One click places the item once.

## Verification

- `npm test`: 141 passed, 1 skipped. The skip is the local compendium index check. Tests cover Smith's Tools normalization and placing a crafted item in a party Group through the GM, including a repeated completion click.
- `npm run build` passed for 0.5.2. `npm run check:recipes` passed.
- Live Foundry verification in world Dev1 was not run from this environment.
