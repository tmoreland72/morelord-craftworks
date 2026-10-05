# Morelord Craftworks 0.3.5

Morelord Craftworks 0.3.5 refreshes the crafting workflow, expands generated rewards, and makes source filtering and reward presentation more reliable throughout the module.

## Added

- Added potion generation and potion and spell-scroll rewards to loot and hoards, with every hoard including both reward types.
- Added reroll and reset controls to Encounter Loot results.
- Added reward-recipient selection for all player characters and group actors while preserving the configured default.
- Added clickable item references wherever generated and awarded items are displayed, including chat cards.
- Added armor, potion, spell-scroll, artisan-tool, and other useful item subtype filters and updated prefab store templates to use them.

## Improvements

- Rebuilt Craft as the standard two-panel search-and-filter list while keeping it focused on recipes marked for crafting and active crafting jobs.
- Materials and Recipes now initially show up to 300 results while counts and filter totals reflect every matching item.
- Spell scrolls now use the native D&D5e scroll-creation API, including scrolls above level 1.
- Standardized compendium source labels to names such as **SRD 5.2**, **Player's Handbook**, and **Monsters of Drakkenheim**.
- Grouped Craftworks and Drakkenheim material filters into concise top-level sections and family options.
- Standardized application scrolling around one outer scrollbar per panel or window and corrected prefab-store height and spacing.
- Tuned encounter magic rewards to a combined 25% chance, favoring potions over spell scrolls.

## Fixed

- Enforced the D&D5e **Configure Sources** selection for every compendium-backed reward, including a final validation when rewards are awarded.
- Fixed broken potion links in award chat cards and linked generated spell scrolls to their source spells.
- Fixed reward cards so item links open their documents with the module's standard dark presentation and hover behavior.
- Fixed result-summary wrapping and long encounter-creature lists.
- Removed verbose console messages about included and excluded items and recipes.

## Notes

- Generated rewards only use compendiums currently enabled in the D&D5e system source configuration.
- Material components remain the most common generated loot; potions are more common than spell scrolls.
