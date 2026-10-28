# Morelord Craftworks 0.5.1

## What Changed

### Improvements

- Craftworks now follows the D&D system's **Configure Sources** setting for every compendium it reads. It asks Morelord Core which compendiums you allow, so recipes, materials, monsters, generators, treasure and awards come only from books you have enabled. The Craftworks Content Pack settings can narrow that list further, but never widen it.
- A recipe whose finished item comes from a compendium you have not enabled is left out of the recipe list, the crafting list and the dashboard count. Ingredient names are matched only inside that recipe's own book, so Craftworks no longer picks a same-named item from another book.
- Recipe linking no longer reads an item compendium that Configure Sources turns off.
- Open Craftworks windows refresh by themselves when you change Configure Sources, so you do not need to close and reopen them.

### Requires

- Morelord Core 0.7.0 or later. Update Core before Craftworks.

## Verification

- `npm test`: 130 passed, 1 skipped. The skip is the local compendium index check. The two changelog checks pass once the release script writes the 0.5.1 changelog entry. New tests cover the single compendium call site, recipes hidden by Configure Sources, and the refresh when Configure Sources changes.