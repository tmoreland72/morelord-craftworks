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
