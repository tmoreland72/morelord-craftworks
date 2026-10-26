# Unreleased

## What Changed

- Recipe linking reads an enabled pack's item compendium even when dnd5e Configure Sources excludes that compendium, and retries indexing without rarity fields if the first index request fails. Generated rewards still honor Configure Sources.
- With Craftworks Standard, SRD 5.1, SRD 5.2, Player's Handbook, Dungeon Master's Guide, and Drakkenheim enabled, and those item compendiums installed, the dashboard Recipes total is 290. SRD 5.2 supplies 16, SRD 5.1 supplies 7, Player's Handbook 57, Dungeon Master's Guide 134, and Drakkenheim 76. If the SRD item compendiums are not installed, the total is 267.
- Ingredient materials still come from Craftworks Standard or Drakkenheim, whichever pack defined them, after another book wins the finished item.
- The Recipes toolbar count of recipes with unknown ingredients includes only loaded recipes marked Unknown.
