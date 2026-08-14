# Morelord Craftworks 0.3.1

Morelord Craftworks 0.3.1 improves Harvest candidate control and fixes generated spell scrolls so they contain usable D&D5e spell mechanics.

## Added

- Added GM-controlled Harvest preflight selection. GMs can include or exclude each defeated NPC token before starting Harvest.
- Added **Select All** and **Clear All** controls for Harvest preflight creature lists.

## Improvements

- Harvest automatic candidate detection is now limited to defeated D&D5e NPC Actors. Characters, vehicles, groups, and other Actor document types are excluded before preflight.
- Newly discovered defeated NPC tokens default to selected while existing selections are preserved when the Harvest window rerenders.
- Harvest preflight now explains why the GM must distinguish harvestable monsters from shopkeepers, traps, and other NPC-based tokens.

## Fixed

- Fixed the Spell Scroll Generator producing renamed generic templates that did not contain the selected spell's usable activities or effects.
- Generated spell scrolls now use D&D5e's native scroll conversion, including activity configuration, attack and save values, spell-level scaling, limited-use consumption, effects, pricing, and scroll properties.
- Generated scrolls now embed a detached copy of compendium spell mechanics so recipients can use them without requiring access to the source compendium.
- Prevented Harvest sessions from starting when no defeated NPC token is selected.

## Notes

- Foundry VTT v14 and D&D5e 5.3+ remain required.
