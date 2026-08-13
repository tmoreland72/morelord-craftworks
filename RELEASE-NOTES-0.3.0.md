# Morelord Craftworks 0.3.0

Morelord Craftworks 0.3.0 substantially improves the Materials and Recipes experience, introduces recipe knowledge states, and adds automatic synchronization with installed compendium content.

## Added

- Added **Known** and **Unknown** recipe knowledge states. Unknown recipes remain discoverable, but their required ingredients are concealed from players until the recipe becomes Known.
- Added **Known / Unknown** three-state filters to the Recipes browser.
- Added **Mark Context Known** and **Mark Context Unknown** GM actions. Bulk knowledge changes now affect only recipes matching the current search and filter context.
- Added production `MorelordCraftworks.syncContent()` support.
- Added **Sync with Compendiums** to Craftworks Settings so GMs can force an immediate material/content rescan.
- Added automatic content-signature synchronization when relevant installed content changes.

## Improvements

- Standardized the **Materials** and **Recipes** browsers on the Morelord Marketplace long-list UI pattern.
- Filters now live in a persistent left rail and cycle through **Any → Include → Exclude → Any**.
- Search and filter changes update result counts immediately.
- Materials and Recipes do not render result cards until the current context is reduced to **100 or fewer** records.
- The filter rail and result list use independent scroll regions; nested filter-list scrollbars were removed.
- Recipe **Rarity** now represents the public recipe/output rarity rather than ingredient rarity.
- Standard Recipe Rarity filters are always available and work for both Known and Unknown recipes without revealing hidden ingredient information.
- Recipe requirement rows now use friendly component names instead of internal match tags such as `drakkenheim-component-fluid-sap`.
- Requirement rarity is shown separately as a compact label.
- Repetitive **AND** labels were removed from ordinary requirement lists; explicit **OR** handling remains for alternatives.
- Drakkenheim tag-and-rarity requirements resolve back to Craftworks Material images when a suitable material match exists.
- Added application-wide scroll-position preservation for Craftworks ApplicationV2 windows.
- Automatic content synchronization now runs only when the Craftworks version, D&D5e version, enabled Content Packs, available Item compendiums, or relevant active module versions change.
- Only the first active GM performs automatic world-compendium synchronization, avoiding duplicate writes when multiple GMs are connected.

## Fixed

- Fixed long-list actions that could return Materials, Recipes, Craft, Harvest, Gathering, Loot, Hoard, Settings, Spell Scroll Generator, or Spellbook Generator windows to the top after rerendering.
- Fixed Drakkenheim recipe requirement images when requirements are defined by tags and rarity rather than an explicit material ID.
- Fixed Recipe Rarity filtering for players when recipes are Unknown.
- Fixed Recipe Rarity rows disappearing for GMs or players during the rarity-filter refactor.
- Fixed nested scrollbars inside Ingredient Tags and other long filter sections.
- Fixed recipe visibility semantics so Unknown recipes remain searchable and can still be marked as crafting goals without exposing their ingredients.
- Unknown recipes can no longer begin a new player crafting job until their ingredients are Known; existing in-progress jobs are not interrupted by a later knowledge-state change.

## Notes

- Existing world data stored in the previous hidden-recipe setting is retained for compatibility. Those recipe IDs now mean **Unknown ingredients**, not invisible recipes.
- Recipe/output rarity is treated as public recipe metadata. Ingredient details and ingredient rarity remain concealed for Unknown recipes.
- Existing `dev.installStandardMaterials()` and `dev.syncContentPackMaterials()` commands remain available as compatibility aliases for the production content-sync API.
- Foundry VTT v14 and D&D5e 5.3+ remain required.
