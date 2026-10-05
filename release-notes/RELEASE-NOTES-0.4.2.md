# Morelord Craftworks 0.4.2

Morelord Craftworks 0.4.2 repairs recipe ingredients, improves complex recipe readability, and makes crafting requirements substantially easier to understand and use.

## What Changed

### Improvements

- Added visible quantities to recipe ingredients while hiding redundant quantities of one for crafted outputs.
- Redesigned complex alternative requirements as clearly separated, stacked “Choose one” groups.
- Added cross-compendium prerequisite resolution so ordinary D&D items use their native names, links, and artwork.
- Standardized spell-scroll ingredient artwork and added reliable fallback artwork for every requirement type.
- Reworked the Deck of Many Things into a practical legendary crafting recipe.

### Fixed

- Fixed recipes whose free-text ingredients could not resolve to craftable materials or compendium items.
- Fixed Armor of Resistance rejecting light, medium, and heavy armor.
- Fixed missing or incorrect prerequisite images, including weapon alternatives such as Battleaxe, Greataxe, and Handaxe.
- Fixed Blacksmithing ingredient references and preserved their Kibbles-defined material quantities.
- Replaced ambiguous recipe prerequisites with concrete items, alternatives, or dedicated Craftworks materials.
- Removed self-referential and invalid prerequisite choices from affected recipes.
