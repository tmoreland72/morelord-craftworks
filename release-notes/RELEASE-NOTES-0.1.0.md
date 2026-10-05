# Morelord Craftworks 0.1.0

Initial public release of Morelord Craftworks.

## Added

- Core Craftworks module framework for Foundry VTT v14.
- GM-initiated harvesting, gathering, encounter loot, and treasure-hoard workflows.
- Materials and Recipes reference browsers.
- Crafting workflow foundation and content-pack architecture.
- Morelord Core entitlement integration boundary and socketlib multiplayer support.

- Added the Player's Handbook recipe content-pack pipeline.
- PHB recipes use Kibbles v1.1.3 for crafting rules and material requirements while resolving finished items from the exact 2024 Player's Handbook Equipment compendium at runtime.

- Added the Dungeon Master's Guide recipe content-pack pipeline.
- DMG recipes use Kibbles v1.1.3 for crafting rules and material requirements while resolving finished items from the exact 2024 Dungeon Master's Guide Equipment compendium at runtime.

- Added the Monsters of Drakkenheim content pack with its own Antics & Rolls-derived material catalog.
- Added 725 Drakkenheim material entries (145 defined components across five rarity tiers).
- Added Monsters of Drakkenheim Appendix E recipes with runtime links to the installed official Drakkenheim item compendiums.
- Added no-check, one-day Workshop crafting support for Drakkenheim recipes.
- Removed Treasure Hoard dependency on external magic-item RollTables.
- Special treasure now selects directly from World Items and D&D5e system compendiums using CR-weighted rarity tiers; no add-on module is required.
- Missing special-treasure sources now produce a single concise warning instead of repeated failures.
- Updated Craftworks content-pack access to use the exact Morelord Gaming product feature keys.
- Monsters of Drakkenheim now requires `craftworks.content-mod`; PHB uses `craftworks.content-phb`; DMG uses `craftworks.content-dmg`; SRD 5.2 uses `craftworks.content-srd52`.
- Craftworks Settings now displays the required product feature key for each gated content pack.
- Explicit Craftworks product features are now authoritative for content-pack access, allowing Champion-only Drakkenheim packs without generic Premium access bypassing the feature assignment.
- Replaced Craftworks' heuristic Morelord Core discovery with the same direct Core API contract used by Morelord Marketplace.
- Craftworks now resolves account state with `isConnected()`, `getTier("morelord-craftworks")`, `hasFeature(feature, "morelord-craftworks")`, `getEntitlements("morelord-craftworks")`, and `refresh("morelord-craftworks", ...)`.
- Craftworks Settings now provides Marketplace-style Connect/Manage Account, tier, last validation, and Refresh controls.
- Reworked Morelord Core integration to match Marketplace exactly: standalone entitlement service, direct product-aware API calls, required Core dependency, and Marketplace-style account access card.
- Fixed a startup regression caused by a stale StandardMaterialInstaller reference after content-pack material synchronization replaced the old standard-only installer.
- Craftworks Harvest now detects dead actors sourced from the official Monsters of Drakkenheim monster compendium and parses their embedded Harvestable Components data.
- Drakkenheim harvest checks now present the exact Drakkenheim components from the monster entry and resolve them against Craftworks' internal Drakkenheim material catalog, removing the Antics & Rolls runtime dependency.
- Replaced the basic Craftworks Harvest windows with the richer creature/component presentation migrated from Morelord Drakkenheim Harvesting while retaining Craftworks skill-check and socket workflows.
- Fixed Harvest window CSS scoping so the migrated Drakkenheim Harvesting layout, compact creature artwork, scrolling, and footer controls render correctly.
- Fixed the Harvest player template block mismatch that prevented client Harvest windows from rendering.
- Added Drakkenheim-style per-creature collapse/expand controls to the GM Harvest window and retained them on player windows.
- Harvest remains dual-path: exact Monsters of Drakkenheim components for entitled Drakkenheim actors, and normal Craftworks/Kibbles harvesting for all other creatures using active account-accessible content packs.
- Drakkenheim creatures now fall back to normal Craftworks harvesting whenever the Monsters of Drakkenheim content pack is not enabled and entitled.
- Standard creatures now preview all compatible Kibbles/Craftworks harvest components in both GM and player Harvest windows.
- Player Harvest checks now use a right-aligned skill selector and Roll button above each creature's components; Claim buttons remain disabled until a successful check makes that component claimable.
- Recipe normalization now preserves recipe/output rarity, and the Recipes rarity filter recognizes tag-based requirement rarities used by Monsters of Drakkenheim recipes.
- Harvest claims now follow the standalone Drakkenheim Harvesting synchronization model: the GM broadcasts the authoritative Harvest session after every successful claim so every open player window updates immediately.
- Harvest components are globally claim-locked by creature/component identity; once one player claims a component, other clients see it claimed in real time and cannot claim it again.
- Added a shared Claimed Components panel below the creature list on both GM and player Harvest windows, with linked material images where resolvable, component name, rarity, source creature, claimant, and harvest roll.
- GM Harvest creature cards now merge authoritative realtime claim results into their component rows, replacing Available with claimant and harvest-roll details as soon as a component is claimed.
- Increased visual separation between expanded Harvest creature sections with a distinct component-area background, border, and spacing.
- Player Harvest now highlights materials usable by any recipe marked on that player's crafter, including tag/rarity/category-based recipe requirements, and identifies them with a Needed for Crafting badge.
- The player Claimed Components history retains the same Needed cue for claimed materials that apply to marked recipes.
- Added standardized public Award Cards whenever Craftworks gives items, materials, loot, coin, crafted outputs, or generated scrolls to a recipient.
- Award Cards are grouped one per recipient per award operation, aggregate multi-item Encounter Loot/Treasure Hoards, and use Foundry UUID links so item names are clickable for other users.
- Removed duplicate plain-text crafting-completion chat messages in favor of the shared linked Award Card presentation.
- Fixed Harvest's Needed for Crafting highlight to read marked recipes from the same Crafter actor used by the Craft window, including users with multiple owned characters or a separately controlled token.
- Added GM-only Cancel Harvest, which resets Harvest attempt records, discards the active session, closes all player Harvest windows, and closes the GM Harvest window.
- Improved Award Card contrast by forcing light text, links, rarity labels, and quantities on dark item rows.
- Added per-terrain Gather DC configuration to Craftworks Settings. Each active Gathering terrain shows its source-pack default and a world-level editable base DC; the existing Global Gathering DC Modifier is applied afterward.
- Added configurable Natural 20 Harvesting: by default, a natural 20 on the actual d20 allows two distinct component claims from that creature; GMs can disable this under Settings → Materials → Harvesting.
- Natural 20 detection now uses the active d20 face from the configured D&D5e skill roll, so a modified total of 20 does not trigger the bonus.
