# Morelord Craftworks 0.2.0

Morelord Craftworks 0.2.0 is a major expansion of the module's content-pack, crafting, harvesting, gathering, loot, and entitlement systems. This release also brings the standalone Morelord Drakkenheim Harvesting workflow into Craftworks so harvesting can be managed from one module.

## Highlights

### Content Packs

- Added a content-pack architecture for controlling which recipe and material sources are active in a world.
- Added Player's Handbook content support for Kibbles-defined recipes whose finished items exist in the 2024 PHB.
- Added Dungeon Master's Guide content support for Kibbles-defined recipes whose finished items exist in the 2024 DMG.
- Added Monsters of Drakkenheim content support.
  - Adds the Drakkenheim material/component catalog used by Craftworks.
  - Adds Monsters of Drakkenheim Appendix E crafting recipes.
  - Resolves finished Drakkenheim items against the installed official Drakkenheim content when available.
  - Supports Drakkenheim's one-day, no-check Workshop crafting rules.
- Added Morelord Core entitlement integration using the same product-aware API pattern as Morelord Marketplace.
- Added product-feature gating for individual Craftworks content packs, including Champion-level Drakkenheim content.

### Crafting

- Added the dedicated **Craft** workspace.
- Recipes can be marked for crafting from Recipes and then appear automatically in Craft.
- Added material requirement/readiness tracking directly in Craft.
- Added support for recipes that do not require a crafting check.
- Improved recipe rarity handling so Drakkenheim recipes participate correctly in rarity filtering.

### Harvesting

- Integrated the Morelord Drakkenheim Harvesting workflow into Craftworks.
- Dead Monsters of Drakkenheim creatures use their exact Drakkenheim harvestable components when the Drakkenheim content pack is available.
- Drakkenheim creatures fall back to normal Craftworks harvesting when the Drakkenheim content pack is unavailable.
- Standard creatures continue to use Craftworks/Kibbles harvest profiles based on active content packs.
- GM and player Harvest windows now show available components before a claim is made.
- Added collapsible creature groups and improved visual separation between creatures.
- Harvest checks use the native D&D5e configured roll dialog.
- Added realtime claim synchronization across all open Harvest clients.
- Claimed components immediately become unavailable to other players.
- Added a shared **Claimed Components** section with image, name, rarity, source creature, claimant, and harvest roll.
- Added **Needed for Crafting** highlighting for materials required by recipes marked by the player's current Crafter.
- Added GM **Cancel Harvest**, which resets the active Harvest attempt state and closes all Harvest windows.
- Added configurable **Natural 20 Grants Two Claims** behavior.
  - Enabled by default.
  - Uses the actual d20 result rather than a modified total of 20.
  - Allows two distinct component claims on a natural 20.

### Gathering

- Gathering skill checks now use the native D&D5e configured roll dialog.
- Added configurable Gather DCs for individual terrain types.
- Each terrain retains its content-pack default DC while allowing a world-level override.
- The global Gather DC modifier is applied after the terrain-specific base DC.

### Encounter Loot and Treasure Hoards

- Removed the dependency on external Magic Item Table A-I RollTables.
- Special treasure now uses Craftworks/world/system item sources directly.
- Missing special-treasure sources now produce a single concise warning rather than repeated failures.
- Improved Treasure Hoard and Encounter Loot award handling.

### Award Chat Cards

- Added standardized public Award Cards whenever Craftworks gives items, materials, loot, coin, crafted outputs, or generated spell scrolls to a recipient.
- Multi-item awards are grouped into one card per recipient.
- Awarded item names use Foundry document links so players can click them to inspect the item.
- Cards show item images, quantities, rarity where available, and coin on the same card.
- Improved dark-row text contrast for item names, links, rarity labels, and quantities.

### Settings and UX

- Reworked Craftworks Settings to use the same Morelord Core account/entitlement integration pattern as Morelord Marketplace.
- Added account tier/status, Manage Account, Refresh, and content-pack entitlement handling.
- Added configurable Harvest and Gathering options directly to Craftworks Settings.
- Improved Harvest window sizing, scrolling, collapsed states, and client synchronization.

## Fixes

- Fixed Craftworks startup failures caused by stale material-installer initialization.
- Fixed Harvest player template errors that prevented client Harvest windows from opening.
- Fixed Harvest CSS scoping that allowed creature artwork to expand beyond the intended layout.
- Fixed GM Harvest component rows so realtime claims replace Available with claimant and roll information.
- Fixed recipe rarity filtering for content-pack recipes with requirement/output-defined rarity.
- Fixed Harvest marked-recipe detection so it uses the same Crafter actor as the Craft workspace.
- Fixed duplicate/noisy acquisition error messaging.
- Improved award and acquisition state synchronization between GM and player clients.

## Notes

- Morelord Core is required for entitled Craftworks content-pack access.
- Premium and Champion content are controlled by the product features assigned to the connected Morelord account.
- Craftworks now replaces the standalone Morelord Drakkenheim Harvesting module for Drakkenheim harvesting workflows.
