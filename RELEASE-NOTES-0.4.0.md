# Morelord Craftworks 0.4.0

Morelord Craftworks 0.4.0 adds a complete Drakkenheim Delerium Search workflow and expands the acquisition and crafting systems with richer Kibbles harvesting, stronger source-item matching, and improved multiplayer controls.

## What Changed

### Added

- GMs can start an Outer City (DC 15) or Inner City (DC 20) search from Acquire when the Monsters of Drakkenheim Content Pack is enabled.
- Players roll Arcana, Investigation, or Survival, with doubled successes for beating the DC by 5 or rolling a natural 20.
- The search tracks group successes, failed characters, random-encounter triggers, and the resulting Delerium Chips, Fragments, or Shard.
- Rewards resolve against the canonical Monsters of Drakkenheim source Items.
- GMs can roll for defined player-character Actors that are not represented by a connected player.
- Added complete Kibbles-style basic, exotic, remnant, tough-hide, resistant-hide, dragon-scale, meat, and fresh-ingredient harvesting paths.
- Expanded and normalized the standard material catalog used by Kibbles harvest results.
- Added dedicated checks for Kibbles harvesting, recipe Item matching, and spell-scroll catalog sources.

### Improvements

- Player window delivery is acknowledged and failed deliveries are reported to the GM.
- Standard harvesting now shares one generated corpse offering while allowing each successful participant to claim independently.
- Individual components respect their own Harvest DCs in addition to the creature's base check.
- The Gathering setup page now lists every defined player-character Actor, selected by default.
- GMs can uncheck characters so only selected connected players receive the gathering roll window.
- Gathering and Harvest player displays provide clearer roll and result feedback.
- Improved recipe-to-Item matching and output resolution across SRD and Kibbles recipe catalogs.
- Improved recipe and material browser visibility and crafting-queue feedback.
- Added synchronized spell-scroll catalog installation and more reliable generated-scroll source handling.

### Fixed

- Fixed non-20 d20 results being treated as natural 20s during Delerium Search scoring.
- Fixed Delerium Search player windows failing silently when delivery or rendering did not complete.
- Fixed offline and unassigned player-character Actors being omitted from GM-controlled search rolls.
