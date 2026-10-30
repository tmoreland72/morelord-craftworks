# Morelord Craftworks 0.5.2

## What Changed

### Improvements

- A recipe whose artisan tool Morelord Core maps to Workshop requires a Workshop of the item’s rarity or higher whose Specialty includes that tool or is Any. Specialty may be several tools, an empty list, or a single saved tool. Recipe cards and the Craft window show that specialty. Smith's Tools still use Forge, and Alchemist's Supplies still use Alchemist. Forge weapon and armor Specialties are not checked. **Settings → Crafting** still chooses the activity for each tool, and a facility rule saved as Blacksmith's Tools still applies to Smith's Tools.

### Fixed

- **Settings → Crafting** lists **Smith's Tools** once, using the D&D 2024 name. Packaged recipes that asked for Blacksmith's Tools now ask for Smith's Tools, including the recipe that crafts those tools. A facility chosen for Smith's Tools applies to those recipes. A facility rule already saved as Blacksmith's Tools still applies to Smith's Tools, including a custom recipe that still stores the older name.
- The player Craftworks dashboard no longer shows a Player Resources section. Players still open **Materials**, **Recipes**, and **Craft** from the Craft section.
- **Place in {party name} Inventory** after crafting success creates the item through the connected GM. A party member does not need to own the Group actor. One click places the item once.
- A Downtime session set to **No Location** no longer forces **On the Road** over the viewed scene. Crafting uses an explicit session location when one is chosen, and otherwise the location associated with the scene. **On the Road** applies only when that session has **No Location** and the scene has no associated location.

### Requires

- Morelord Core 0.9.0 or later. Update Core before Craftworks. Open Craftworks windows refresh in the background when Configure Sources changes, and crafting uses Core's active location.

## Verification

- `npm test` previously reported 149 passed and 1 skipped. The skip is the local compendium index check. Tests cover Smith's Tools normalization, Workshop specialty lists, party-inventory placement through the GM, background Configure Sources refresh, and Core's active location. New cases cover a Downtime session set to **No Location**: Craftworks uses the location associated with the viewed scene, including a Common Alchemist for an Alchemist's Supplies recipe. An explicit session location still replaces that scene.
- `npm run build` passed for 0.5.2. `npm run check:recipes` passed.
- Live Foundry verification in world Dev1 was not run from this environment.
