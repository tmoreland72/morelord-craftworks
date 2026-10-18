# Morelord Craftworks 0.4.18

## What Changed

### Improvements

Requires Morelord Core 0.5.1 or later. Publish and install Core 0.5.1 before this update; earlier Core releases do not include the required shared components.

- GMs can open material sources from orange Gather, Harvest, and Loot pills. Standard pills reflect active acquisition rules rather than stale catalog flags. Players retain passive tags.
- Craftable identifies materials produced by an enabled recipe; Produced by lists those recipes.
- Craft output images open the filtered Recipes browser with the crafter retained; specific ingredient images open Materials. Both consume Core's shared image-link control and support keyboard activation.
- Material Used in lists now include Drakkenheim tag/rarity requirements and alternatives instead of only explicit material IDs. Ingredient lookups share tag hierarchy and rarity aliases with crafting; output-only recipes stay under Produced by.
- Gathering lists terrains. Harvest lists creature type, size, CR, and required traits with category-only descriptions and merged duplicates. Processed goods such as Boiled Leather and Tanned Leather no longer claim a harvest source.
- Drakkenheim family references include relevant specific parts at the correct rarity and creature type, rather than requiring the family Item to win an exact award match. Legendary aberration bones now include The World Ender and The Duchess. Actual harvest awards are unchanged.
- Named monsters use Core's shared Encounters card, including portrait, CR/source, and Open Actor sheet, with no Regenerate action. Source cards omit unrelated special-item and delerium instructions; actual harvesting retains them. Ordinary materials never search or mention Drakkenheim.
- Drakkenheim searches share an in-memory index, including concurrent requests. Catalog/document changes invalidate it; world restarts and browser reloads clear it automatically. Failed/incomplete builds remain retryable.
- The GM Materials browser verifies Drakkenheim Harvest pills against the completed cache, with a visible initial checking state. Unsupported variants such as Common dragon horns and Very Rare ratling claws no longer advertise a Harvest action. Subtype and source-journal names participate in source identity matching.
- Player Harvest tags now use the same GM-verified availability through a material-ID-only socket response. Player clients never fall back to stale catalog flags. Source invalidation refreshes open clients, and source details remain GM-only. A connected GM is required for fresh player verification.
- Searches show a spinner and monster inspection progress. Empty/error states remain distinct from unfinished searches.
- Expanded Standard loot to all 172 catalog materials: 116 outcomes at CR 0–4, 25 at CR 5–10, 18 at CR 11–16, and 25 at CR 17+. New outcomes use one unit and weight 2; original results, weights, quantities, and overall drop chances remain. Per-material selection odds change.
- Corrected Standard seed acquisition flags and five invalid built-in image paths. The browser repairs those paths in already synchronized catalog entries. Core provides opt-in fallback artwork for unavailable images.
- GM catalog indexing also repairs those five paths on Craftworks-owned world-compendium Item documents, fixing their native sheets while restoring the original compendium lock state. Custom artwork and other packages are excluded.
- Added acquisition and artwork audit commands, regression tests, and a final before/after flag ledger in material-acquisition-audit.json. Existing world Items are not deleted; seed metadata updates through normal synchronization.


## Verification

All 95 automated tests, acquisition rules for 172 materials, 49 Kibbles references, and 897 image paths pass. Dev1 on Foundry VTT 14.369 / D&D5e 6.0.3 passed all eight source checks and five crafting-reference checks through Core's runner. Evidence covers named Drakkenheim sources/cache, actual Actor and Item sheets, image links, orange aligned pills, loading states, and artwork repair. Loot balance has not received campaign playtesting.

Player verification passed four shared-runner checks with the GM-only settings check skipped. The existing explicit GM route selected a freshly initialized GM because older open GM tabs lacked the new handler. The response contained only verified material IDs; actual player renders matched supported/unsupported variants and exposed no source controls. Refresh every connected client after updating. Dark/light and 380px shared source-card captures were inspected.
