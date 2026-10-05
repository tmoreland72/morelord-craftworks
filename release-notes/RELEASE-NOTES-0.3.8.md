# Morelord Craftworks 0.3.8

Morelord Craftworks 0.3.8 improves recipe discovery, crafting context, and Drakkenheim material handling throughout the crafting workflow.

## Added

- Added a setting that reveals otherwise unknown recipes when the selected character is proficient with the recipe's preferred artisan tool.
- Added preferred artisan tool filters to the Recipes browser, including proficiency indicators for the selected character.
- Added Drakkenheim material-family filters to Recipes.
- Added a character selector directly to the Recipes browser for choosing the active crafter.
- Harvested materials now show matching recipe tags, with a detail view when more than four recipes match.

## Improvements

- Recipe, dashboard, content-pack, and filter counts now include only recipes visible to the selected player character.
- Recipe material filters use AND semantics across separately selected material requirements.
- Drakkenheim requirements now understand hierarchical material families and component branches. Broad requirements such as Animus accept matching descendants, while intermediate requirements such as Bones - Spine accept only descendants in the Spine branch.
- Recipe requirements now display resolved material or Item names and images instead of generic Material placeholders.
- Alternative material requirements are visually grouped and separated with clear OR labels.
- Recipe knowledge and Mark for Crafting controls now use matching button presentation and behavior.
- Premium badges are grouped with the other recipe tags.
- Craftworks applications open at larger default sizes, and split-pane pages scroll their filters independently from their results while retaining fixed headers.

## Fixed

- Fixed artisan-tool proficiency detection for possessive tool names such as Alchemist's Supplies.
- Fixed tool-proficient hidden recipes not appearing for eligible player characters.
- Fixed recipe totals on the Craftworks dashboard disagreeing with the player-visible Recipes browser.
- Fixed broad Drakkenheim requirements failing to recognize valid child materials.
- Fixed intermediate Drakkenheim component requirements matching sibling branches instead of only their own descendants.
- Fixed Craft requirement rows rendering icons without their material labels.

