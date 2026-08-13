# Morelord Craftworks 0.2.2

Morelord Craftworks 0.2.2 focuses on improving Harvest usability during large combats. Players now make one Harvest skill selection and resolve all eligible corpse checks in a single action, while Craftworks preserves each creature's individual DC, result, natural-20 behavior, and component claims.

## Added

- Added a single **Harvest Skill Check** control at the top of the player Harvest window.
- Added **Roll Harvest Checks**, which automatically rolls the selected Harvest skill separately against every unresolved creature available to that character.
- Added batched Harvest attempt resolution so the GM processes the player's creature checks together and returns one authoritative session update.

## Improvements

- Removed repeated per-creature Harvest skill selectors and Roll buttons.
- Large Harvest sessions now require one skill selection and one roll action instead of repeating the same interaction for every corpse.
- Each batched creature check still uses that creature's own Harvest DC.
- Each creature retains its own roll total, success/failure state, and natural-20 result.
- Natural 20 two-claim behavior continues to apply independently to each creature.
- Creatures already attempted, already resolved, automatically succeeded through **Skip Skill Checks**, or otherwise unavailable are skipped by the batch.
- Successful creatures remain expanded so their claimable components are immediately visible.
- Harvest client updates are consolidated after the full batch instead of rerendering the player window after every creature.

## Fixed

- Fixed long Harvest sessions where skill-check resolution could collapse an expanded creature before the player claimed a component.
- Fixed Harvest interactions that could repeatedly jump the player's scroll position back to the top of a long corpse list.
- Preserved the visible Harvest viewport through skill-check results, realtime session synchronization, claims, and manual creature expand/collapse actions.

## Notes

- Batch Harvest rolls intentionally do not open a separate D&D5e roll-configuration dialog for every corpse. The selected skill is rolled automatically against each unresolved creature to keep large Harvest sessions practical.
- Foundry VTT v14 and D&D5e 5.3+ remain required.
- Fixed Drakkenheim recipe ingredient images. Recipe and Craft requirement rows now resolve tag-and-rarity requirements back to the active Craftworks Material Registry instead of only looking up requirements with an explicit `materialId`.
- Specific Drakkenheim requirements use the exact material image and remain clickable. Generic requirements that match several materials show shared category art when available without linking to an arbitrary material.
- Added application-wide scroll preservation for Craftworks. Every scrollable region in every Craftworks ApplicationV2 window now retains its vertical and horizontal position when an action rerenders the window.
- Long Materials, Recipes, Craft, Harvest, Gathering, Loot, Hoard, Settings, Spell Scroll Generator, and Spellbook Generator views no longer jump back to the top after actions such as visibility changes, marking recipes, filtering, claiming, expanding/collapsing, or other rerendering controls.
- Changed recipe visibility semantics from **Visible/Hidden** to **Known/Unknown**. Existing Hidden recipe IDs are retained as the world setting for backward compatibility, but now mean that the recipe is discoverable while its ingredient requirements are unknown.
- Unknown recipes remain visible and searchable by players by recipe name, category, source, output, and public recipe tags. Their ingredient list is concealed until the GM marks the recipe Known.
- Ingredient rarity/tag filters and ingredient-text searching no longer reveal information from Unknown recipes.
- Unknown recipes may still be marked for Crafting as goals, but players cannot begin a new crafting job until the ingredients are Known. Existing in-progress jobs are not interrupted if a GM later changes the recipe to Unknown.
- GM controls are now labeled **Known**, **Unknown**, **Mark All Known**, and **Mark All Unknown**.
- Replaced unconditional GM startup material synchronization with a smart content signature. Craftworks now automatically syncs only when the Craftworks version, D&D5e version, enabled Content Packs, available Item compendiums, or relevant active content-module versions change.
- Added **Sync with Compendiums** to Craftworks Settings → Content Packs. The manual sync refreshes Craftworks material compendiums, rescans D&D5e Item compendiums, and reloads the recipe registry immediately.
- Added production `MorelordCraftworks.syncContent()` API. Existing `dev.installStandardMaterials()` and `dev.syncContentPackMaterials()` commands remain as compatibility aliases.
- Added last-successful-sync status and prevents multiple connected GMs from all performing the same automatic world-compendium writes at startup.
- Standardized the Materials and Recipes long-list interfaces on the Marketplace filter-rail pattern. Filters now live in a persistent left sidebar and cycle through three states: neutral, include, and exclude.
- Added **Known** and **Unknown** tri-state filters to Recipes.
- Recipe bulk knowledge actions now apply only to the recipes in the current search/filter context instead of the entire active catalog. The buttons are labeled **Mark Context Known** and **Mark Context Unknown**.
- Updated Materials and Recipes to the full Marketplace long-list standard. The left rail now mirrors Marketplace's larger search field, Any/Include/Exclude legend, stacked filter sections, compact filter rows with counts, and independently scrolling results pane.
- Raised the browser display threshold from 50 to **100**. Materials or Recipes are not rendered while more than 100 records match the current filters; the result pane instead tells the user how many records remain and asks them to refine to 100 or fewer.
- Search and three-state filters now update the browser live. The separate Apply Search action is no longer required.
- Fixed player Recipe rarity filtering for Unknown recipes. Recipe/output rarity remains public and can be filtered normally, while hidden ingredient rarities remain concealed until the recipe becomes Known.
- Corrected the Recipes **Rarity** filter to use the recipe/output item's public rarity rather than ingredient rarity. Unknown recipes can now be filtered by rarity exactly like Known recipes without exposing any hidden ingredient information.
- Restored the Recipes Rarity filter list after the public-rarity refactor. Rarity filter rows are now built explicitly from public recipe/output rarity metadata and include per-rarity recipe counts.
- Removed nested scrollbars from long-list filter groups. Ingredient Tags and other filter sections now expand naturally within the single left filter-rail scrollbar.
- Made Recipe Rarity filters deterministic. Standard rarity rows now always appear for both GMs and players instead of depending on runtime rarity counts, and public recipe tags provide a fallback rarity source for content such as Drakkenheim. Known/Unknown ingredient state no longer affects Rarity filter availability.
- Fixed the missing Recipe Rarity rows for both GMs and players by exposing the public rarity filter rows under both the legacy `ingredientRarities` and current `rarityFilters` template context names. This also protects development installs from mixed cached-JavaScript/new-template states.
- Development build version advanced to `0.2.3-dev.1` so Foundry/browser module caching does not reuse the previous 0.2.2 JavaScript URL while testing this fix.
- Improved recipe requirement presentation. Internal material-match tags such as `drakkenheim-component-fluid-sap` are now shown as friendly component names such as **Sap**, with rarity displayed separately as a compact badge.
- Removed repetitive AND labels between normal requirement rows; a vertical requirement list now implies that all listed components are required. Explicit OR presentation remains for alternatives.
