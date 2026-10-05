# Morelord Craftworks 0.3.6

Morelord Craftworks 0.3.6 adds focused reward-generation controls, restores the full native D&D5e roll workflow for harvesting, and introduces comprehensive GM and player documentation.

## Added

- Added multi-select school-of-magic constraints to the Spell Scroll Generator, with all available schools selected by default.
- Added the same school-of-magic constraints to the Spellbook Generator, including availability counts that update for the selected schools.
- Added multi-select potion categories for Healing and Recovery, Protection and Resistance, Physical Enhancement, Mobility and Transformation, and Utility and Other. Categories are inferred conservatively from potion names, with unmatched items kept in Utility and Other.
- Added comprehensive Game Master and player manuals with illustrated guidance for acquisition, materials, recipes, crafting, and generated rewards.

## Improvements

- Generator constraints persist while rerolling and clearly warn when no school or potion category is selected.
- Added reusable branded demo-production assets, timed narration, subtitles, and build scripts for the Morelord Craftworks product walkthrough.

## Fixed

- Harvesting checks now open D&D5e's native roll-configuration dialog so players can select Normal, Advantage, or Disadvantage and apply situational bonuses.
- Cancelling a harvesting roll dialog leaves that creature unresolved instead of consuming or failing the attempt.

## Notes

- Spell and potion generators continue to use only compendiums enabled through D&D5e Configure Sources.
- Potion categorization is name-based because D&D5e potion Items do not expose a standard functional-category field.
