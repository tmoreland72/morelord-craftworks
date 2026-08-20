# Morelord Craftworks 0.3.9

Morelord Craftworks 0.3.9 corrects multiplayer Kibbles harvesting and keeps Harvest recipe guidance synchronized with the selected crafting character.

## Improvements

- Standard Kibbles-style harvesting now generates one shared material offering per creature for the session.
- Every successful player receives access to the same standard materials and may harvest the same material independently.
- Drakkenheim's exact monster components remain finite and exclusively claimed.

## Fixed

- Fixed the Craft character selector not updating the shared crafter context.
- Fixed Harvest showing recipe tags from a different owned character's Craft queue.
- Standard materials claimed by another player no longer appear locked or unavailable to the current player.
- Natural 20 second claims and Harvest completion checks now respect the independent standard-material claim model.
