# Morelord Craftworks 0.3.7

Morelord Craftworks 0.3.7 gives GMs direct control over generated rewards and improves the reliability of multiplayer Harvesting and Gathering workflows.

## Added

- Encounter Loot and Treasure Hoard results can now be edited before they are awarded.
- GMs can mark individual materials, potions, spell scrolls, special treasure, and manually added Items for removal.
- Added an Item lookup for adding rewards from Item compendiums enabled through D&D5e Configure Sources.
- Coin rewards can now be adjusted by denomination before Loot or Hoard results are awarded.
- The GM Harvest window now displays a persistent Harvesting Completed state for each player.

## Improvements

- Item lookup results use a compact source-aware layout and retain search focus while results update.
- Harvest completion recognizes failed checks, empty results, completed claims, and cases where no claimable choices remain.
- Harvest and Gathering keep the individual character as the participant while routing acquired materials to the configured Party actor when shared storage is enabled.

## Fixed

- Restored scrolling in the player Harvest claiming window.
- Fixed Harvest and Gathering rewards ignoring the configured Party recipient.
- Prevented player startup from invoking an entitlement refresh that may attempt to update protected world settings.
- Prevented Harvest players from remaining stuck in an awaiting-claim state after all available components were claimed.

## Notes

- Existing Loot and Hoard reroll behavior is unchanged.
- Manually added reward Items are included in awards, chat output, and player-facing result summaries.
