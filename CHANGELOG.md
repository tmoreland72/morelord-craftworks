# Morelord Craftworks Changelog

## 0.5.0

### Improvements

- Requires Morelord Core 0.6.0 or later. Update Core before Craftworks. Open **Morelord Tools** on the left side of a scene and select **Morelord Craftworks**. The hammer icon remains available to players and GMs. The dashboard still waits until Craftworks finishes initializing.
- When Morelord Core is older than 0.6.0, **Morelord Craftworks** remains a button on the Token controls.

## 0.4.19

### Improvements

- **Recipes (N)** on a Materials card opens Recipes filtered to the enabled recipes that accept that material. Matching uses the same ingredient rules as crafting: material ID, name, tags, category, stage, rarity, alternatives, and Drakkenheim component family, part, creature type, and rarity. The previous inline **Used in** line is no longer shown. **Produced by** is unchanged. **Clear all filters** returns to the full catalog. Players see only recipes they know.
- Removed 22 Kibbles catalog recipes whose ingredients used 18 material IDs that are not in the Craftworks Standard catalog: `scraps-of-leather`, `flask`, `common-reagent`, `rare-reagent`, `wood-scraps`, `mithril-scraps`, `rough-gem`, `bolt-of-silk`, `raw-cotton`, `raw-wool`, `raw-silk`, `paint`, `canvas`, `water`, `barrel`, `oak-barrel`, `unformed-glass`, and `supplies-salt-staples-etc`. Those recipes could not be completed. PHB and DMG candidates come from this seed, so they no longer include Common Magical Ink, Rare Magical Ink, 10 x Dart, Bolt of Cloth, Bolt of Silk, Shoes, the three glassblowing lens/vial recipes, Painting, Fancy Painting, the five broken brewing recipes, Basic Cut Gem, Exotic Cut Gem, Masterwork Ring, Masterwork Amulet, Ballgown, or Noble Garb.
- Recipe linking reads an enabled pack's item compendium even when dnd5e Configure Sources excludes that compendium, and retries indexing without rarity fields if the first index request fails. Generated rewards still honor Configure Sources.
- Ingredient materials still come from Craftworks Standard or Drakkenheim, whichever pack defined them, after another book wins the finished item.
- SRD 5.1 and SRD 5.2 both default to enabled. The **Available** badge on those cards means no extra module is required; the **Enabled** checkbox is the saved world setting. A world that already saved either pack off keeps that choice. The one-time standard-content bootstrap still turns on Craftworks Standard and SRD 5.2 only, and it does not run again.
- The Recipes toolbar no longer shows a count of recipes with unknown ingredients. **Mark Context Unknown** and **Mark Context Known** remain. When a GM loads the world, hidden recipe ids that do not match a current packaged or custom recipe are removed.
- SRD recipe titles that drop a creator prefix resolve to the one Player's Handbook or Dungeon Master's Guide item named `<Name>'s` plus that title. That links Feather Token (Bird), Feather Token (Swan Boat), and Feather Token (Whip) to Quaal's feather tokens, Handy Haversack to Heward's Handy Haversack, and Instant Fortress to Daern's Instant Fortress. Two prefixed matches do not merge. Explicit pairs cover Crawler Mucus / Carrion Crawler Mucus, Efficient Quiver / Quiver of Ehlonna, Restorative Ointment / Keoghtom's Ointment, Belt of Stone Giant Strength / Belt of Giant Strength (stone), and Belt of Storm Giant Strength / Belt of Giant Strength (storm). With the Dungeon Master's Guide enabled, that book supplies these recipes.
- The recipe catalog no longer loads 1st-Level Spell through 9th-Level Spell. Those nine generic scroll outputs are not Player's Handbook or Dungeon Master's Guide items, and each spell already has its own scroll Item in the Craftworks Spell Scrolls compendium, awarded from the Spell Scroll Generator. Cantrip stays, and the Drakkenheim Spell Scroll tier recipes stay.
- Saddle, Exotic; Saddle, Pack; Saddlebag; and Merchant's Scale stay on SRD 5.1. Those finished items are not in the handbook compendiums.
- With Craftworks Standard, SRD 5.1, SRD 5.2, Player's Handbook, Dungeon Master's Guide, and Drakkenheim enabled, and those item compendiums installed, the dashboard Recipes total is 279. SRD 5.1 supplies 4, Player's Handbook 55, Dungeon Master's Guide 144, and Drakkenheim 76. SRD 5.2 adds no further recipe while the Dungeon Master's Guide is enabled. If the SRD item compendiums are not installed, the total is 275.

## 0.4.18

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

## 0.4.17

### Improvements

- Documentation opens the actual GM and player manuals through Core.
- Added a manifest changelog link and moved release history into `release-notes/`. Local working files belong in ignored `/tmp/`.

- Release staging and generated ZIP files use module-local `/tmp/`; ZIP validation rejects working files and release-note sources.

## 0.4.16

### Improvements

- Harvesting shows a character's claimed components on the left and one current creature in a larger right panel, with stacked panels at narrow window widths.
- Non-Drakkenheim creatures use individual Harvest checks. Drakkenheim creatures open directly to component choices without a skill check.
- Next replaces the current creature after resolving its check and claims. Skip Remaining and the final-page Done button mark the character Harvesting Completed for the GM while preserving reserved claims for Finalize Harvest.
- Reopening restores the current creature and recorded outcomes. Each character keeps a separate claim ledger, including when one player controls multiple characters.
- Restored the GM-controlled Skip Skill Checks option in a dedicated Skill Checks section before Player Characters, with a not-recommended explanation.
- Updated Harvest manuals and screenshots using Morelord Core's shared components and responsive shell.

### Fixed

- Retried creature-roll delivery reuses the recorded roll rather than rolling again.
- Concurrent requests cannot reserve the same finite Drakkenheim component or duplicate character completion.

## 0.4.15

### Added

- [Premium] GM Magic Item Generator with category and rarity filters, random draws, catalog selection, removal, and chat sharing.

### Improvements

- Spell Scroll Generator supports quantities by spell level or rarity, with working plus/minus controls and existing school/source filters.
- Workflow guidance uses Core's shared subtitle and notes styles.

### Fixed

- Harvesting uses one character roll for the whole session, applying the total to each creature's DC and preserving it across retries and reopened windows. GM fallback and the optional natural-20 bonus remain available.

## 0.4.14

### Improvements

- Request Delerium Search through Core party chat cards with independent skill choices, advantage controls, and offline-player GM fallback.
- Show Completed immediately after clicking a roll and allow other characters to roll while dice animate. Reveal GM-only search summaries after animations, recover interrupted completion without rerolling, and open saved results.
- Add Lucky Finds acquisition with private dice, corrected loot references, scroll generation, and optional Game Master integration.
- Organize Craftworks compendiums under Morelord Gaming / Craftworks while preserving pack identities and later manual moves.
- Clarify content-pack access and availability. Wait for settings synchronization before closing and keep the form open on failure.

## 0.4.13

### Improvements

- Added privacy-safe Craftworks details to Core's troubleshooting export: content-pack settings and access, catalog counts, known compendium/source availability, synchronization status and recent sync/harvest outcomes. Export before syncing when investigating missing components. Recent outcomes reset on client reload.
- Recipe research shares the Recipes browser's family/rarity filters (including all four Very Rare Organ matches), reveals discoveries for every player, and opens Recipes focused on discovered IDs.
- Added optional feature/error instrumentation through Core's shared reporting service. Fresh GM consent is required; account connection is not. Existing Core dependencies and game behavior are unchanged.
- Downtime integration exposes available personal/party monster components and matching enabled Drakkenheim recipes for one-hour research Projects. Matching reuses crafting ingredient rules without consuming materials.
- Harvest marked-recipe labels now show owned/required component quantities from personal and party inventory, including claimed-component and full recipe lists.
- Harvest recipe pills truncate long names while retaining owned/required counts and full-name tooltips. Harvest creature selection now uses Core’s whole-row choice component, matching Loot.
- Drakkenheim recipe editing explains its no-check rule in a Core callout; section subtitles are concise descriptions.
- Potion category and spell-school filters now use Core checkbox groups that wrap whole options without overlapping, including Scroll and Spellbook generators.
- Added an optional `profileId` argument to `api.openHoard()` so Encounter Stories can open the existing Hoard interface at its intended challenge range. No-argument calls retain Challenge 0–4; no treasure is generated or awarded on opening. Updated API notes in the README and GM manual.
- Optional message visibility is preserved by Delerium quantity rolls and award chat cards.

## 0.4.12

### Fixed

- Recognizes Harvestable Components written directly in a creature's biography, as well as components in embedded journal pages.
- Uses the creature's biography first, allowing imported or renamed creatures with harvesting data to use Drakkenheim harvesting without a compendium match.
- Preserves standard harvesting when neither the creature nor its matching compendium Actor has a Harvestable Components section.
- Drakkenheim content-pack enablement and access checks remain required.

### Documentation

- Updated the setup instructions and GM manual to explain biography-first harvesting and compendium fallback.

## 0.4.11

### Fixed

- Removed stale crafting durations from packaged Drakkenheim recipes. Materials and existing Workshop requirements still apply.
- Completing an older Drakkenheim crafting job now reports zero hours immediately as well as after reloading.

### Improvements

- Encounter Loot uses Core's full-width actor selection rows with a checkbox, portrait, name, and CR.
- D&D5e source filtering consumes Core's shared service while preserving existing filtering behavior. Requires Morelord Core 0.3.9 or later; no new Core release is needed.
- Updated the GM and player manuals to clarify Drakkenheim crafting requirements.

## 0.4.10

### Improvements

- Fixed v6 rarity handling across crafting materials, recipes, potions, treasure, and award summaries while retaining legacy rarity support. Uses the shared reader in Core 0.3.8.
- Verified Foundry compatibility is explicitly recorded as 14.367; existing Foundry and system support minimums remain unchanged.
- Release guidelines require checking the latest stable Foundry build and confirming the published Foundry listing.

## 0.4.9

### Improvements

- Settings use Core headers, section headings, cards, responsive settings rows, badges, and footers; duplicated local settings styling has been removed.

- Removed unused local settings-footer styling; Craftworks Settings continues to use Core’s shared page footer.

- Character choices for crafting, gathering, harvesting, delerium search, and item delivery use Core’s shared player-owned-or-party eligibility. Existing ownership checks and Group inventory access still apply.

### Changed

- Require Morelord Core 0.3.7 or later for the shared components and character eligibility used by this release.

## 0.4.8

### Improvements

- Use Core's shared nested-scroll preservation while retaining deferred restoration.
- Require product documentation in release archives and validate the landing-page version.

### Fixed

- Remove the redundant instruction beneath Encounter Loot's Dead Creatures section subtitle.
- Remove a legacy toolbar alignment override that centered the Recipes page's Crafting Character section; use Core's standard section layout and action row.
- Match Delerium Search and Harvest Player Characters sections to Gathering with Core's shared section headers, character cards, round portraits, and selected-state highlighting.
- Align manuals with the current module and Core dependency versions.
- Correct outdated README tool-check rules: missing tools or proficiency impose disadvantage at the recipe DC; Drakkenheim recipes use their Workshop requirements and complete without tracked rolls or hours.

### Changed

- Require Morelord Core 0.3.6 or later for the shared UI services used by this release.

## 0.4.7

### Improved

- Standardized page sections, spacing, outer scrolling, and action footers across the module.
- Reduced repeated material scans and full-item lookups while browsing recipes; all recipe filters include counts.
- Added combined character and party ingredients for players, with GM-assisted rolls for offline acquisition participants.
- Improved recipe editing with mandatory groups and alternative material choices, plus tool-based facility settings.
- Added full filtered add/remove pickers and editable quantities to potion and scroll results; scroll counts follow school selections.

### Fixed

- Crafting tool checks retain the recipe DC and apply disadvantage when tools or proficiency are missing. Tool names resolve through D&D5e, including Blacksmith's Tools, and action errors are visible.
- Drakkenheim recipes require an equal-or-higher Workshop independent of tools and complete without rolls or tracked hours.
- Delerium Search supports saved defaults, clickable reward rolls, cumulative rewards, and original compendium items delivered through Recipient.
- Updated GM, player, and in-app documentation and included the manuals in the release archive.

## 0.4.6

### Added

- Added a Recipe Manager with world compendium storage, editing, deletion, and JSON import and export.
- Added an editor for output items, material quantities, alternative ingredient groups, tools, abilities, difficulty, and crafting time.
- Added searchable item and material pickers with source, type, rarity, and category filters.
- Integrated custom recipes into the crafting registry, including separate standard and Drakkenheim material rules.

## 0.4.5

### Fixed

- Encounter Loot and spell-scroll generation now honor both D&D5e Configure Sources and the corresponding Craftworks SRD 5.1/5.2 Content Pack settings.
- SRD spells copied into another enabled compendium can no longer bypass the canonical D&D5e SRD spell-source exclusion through their container pack.
- Rerolling potion, spell-scroll, or spellbook results now retains the previously selected quantities, potion categories, and schools of magic.

## 0.4.4

### Added

- Added an in-Foundry Documentation button to the dashboard, backed by Morelord Core's shared documentation viewer.
- Added visible quantity controls and responsive three-column layouts to the potion, spell-scroll, and spellbook generators.
- Added non-awarding chat sharing for generated potion and spell-scroll results.
- Gather now shares Harvest's participant layout and priority defaults, remembers the last selection, and opens independent windows for multiple characters owned by one connected player.
- Added Harvest player-character selection with Core-standard party priority, remembered selections, and a session-wide Skip Skill Checks option.
- Harvest now opens an independent window and tracks independent claims for every selected character, including multiple characters owned by the same connected player.
- Added all 19 Monsters of Drakkenheim Appendix E SRD recipe variants for enhanced armor, healing and resistance potions, enhanced shields, spell scroll tiers, and enhanced weapons.
- Added entitlement-aware recipe output resolution that prefers enabled premium PHB and DMG content before falling back to SRD 5.2; healing potions can also use SRD 5.1.
- Added recipe facility requirements backed by Morelord Core locations and capability tiers.
- Added Group actor ingredient inventories for member characters, with GM-authorized material consumption.
- Added focused single-recipe Craft windows and a public downtime integration for recipes, projects, facilities, and commissions.
- Added automated coverage for Drakkenheim recipes, crafting environments, and Group inventories.

### Improved

- The dashboard Documentation and compendium Refresh actions are now shown only to GMs.
- Claimed creatures remain expanded in the player Harvest window to prevent disruptive layout shifts during large harvests.
- Harvest recipe highlights now use the character assigned to that specific Harvest window, including secondary characters controlled by the same player.
- Finalizing Harvest now clears the completed GM session so reopening Harvest starts a fresh scene scan without requiring Cancel Harvest.
- The labeled dashboard Refresh action now synchronizes configured compendiums, materials, spell-scroll sources, and recipes, then reports the completed changes.
- Enhanced armor, shield, and weapon recipes now award the corresponding generic `+1, +2, or +3` compendium item so the GM can configure the completed item appropriately.
- Crafting projects now pause when their required environment is unavailable and resume when the requirement is met.
- The dashboard now reports total and ready crafting projects and places Manage Locations with the other GM Tools.
- Recipe cards now provide GM facility controls and clearer Known and Marked actions.
- D&D 5e skill rolls and source labels now use shared Morelord Core services.
- Release automation now supports direct Foundry package publication with separate website and Foundry credentials.

## 0.4.3

### Added

- Added an in-app setup notice explaining that the official Monsters of Drakkenheim module and its Actors are required for harvesting support.
- Added installed and enabled status feedback for the required Drakkenheim module.
- Documented the Drakkenheim content-pack setup requirements in the README.

## 0.4.2

### Improvements

- Added visible quantities to recipe ingredients while hiding redundant quantities of one for crafted outputs.
- Redesigned complex alternative requirements as clearly separated, stacked “Choose one” groups.
- Added cross-compendium prerequisite resolution so ordinary D&D items use their native names, links, and artwork.
- Standardized spell-scroll ingredient artwork and added reliable fallback artwork for every requirement type.
- Reworked the Deck of Many Things into a practical legendary crafting recipe.

### Fixed

- Fixed recipes whose free-text ingredients could not resolve to craftable materials or compendium items.
- Fixed Armor of Resistance rejecting light, medium, and heavy armor.
- Fixed missing or incorrect prerequisite images, including weapon alternatives such as Battleaxe, Greataxe, and Handaxe.
- Fixed Blacksmithing ingredient references and preserved their Kibbles-defined material quantities.
- Replaced ambiguous recipe prerequisites with concrete items, alternatives, or dedicated Craftworks materials.
- Removed self-referential and invalid prerequisite choices from affected recipes.

## 0.4.1

### Improvements

- Migrated Craftworks applications, settings, dashboards, browsers, generators, chat cards, statuses, and actions to Core-owned components and semantic tokens.
- Standardized readable `ml-craftworks-*` and `ml-craftworks-harvest-*` selectors.
- Split the manifest stylesheet into foundation and workflow feature styles.
- Standardized award-card and hoard-card typography and interaction behavior.
- Improved dashboard card sizing so descriptions and localized labels remain contained.

### Fixed

- Fixed stale chat-card dataset bindings after namespace migration.
- Fixed warning, success, failure, readiness, and crafting-progress states using inconsistent feature colors.

## 0.4.0

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

## 0.3.9

### Improvements

- Standard Kibbles-style harvesting now generates one shared material offering per creature for the session.
- Every successful player receives access to the same standard materials and may harvest the same material independently.
- Drakkenheim's exact monster components remain finite and exclusively claimed.

### Fixed

- Fixed the Craft character selector not updating the shared crafter context.
- Fixed Harvest showing recipe tags from a different owned character's Craft queue.
- Standard materials claimed by another player no longer appear locked or unavailable to the current player.
- Natural 20 second claims and Harvest completion checks now respect the independent standard-material claim model.

## 0.3.8

### Added

- Added a setting that reveals otherwise unknown recipes when the selected character is proficient with the recipe's preferred artisan tool.
- Added preferred artisan tool filters to the Recipes browser, including proficiency indicators for the selected character.
- Added Drakkenheim material-family filters to Recipes.
- Added a character selector directly to the Recipes browser for choosing the active crafter.
- Harvested materials now show matching recipe tags, with a detail view when more than four recipes match.

### Improvements

- Recipe, dashboard, content-pack, and filter counts now include only recipes visible to the selected player character.
- Recipe material filters use AND semantics across separately selected material requirements.
- Drakkenheim requirements now understand hierarchical material families and component branches. Broad requirements such as Animus accept matching descendants, while intermediate requirements such as Bones - Spine accept only descendants in the Spine branch.
- Recipe requirements now display resolved material or Item names and images instead of generic Material placeholders.
- Alternative material requirements are visually grouped and separated with clear OR labels.
- Recipe knowledge and Mark for Crafting controls now use matching button presentation and behavior.
- Premium badges are grouped with the other recipe tags.
- Craftworks applications open at larger default sizes, and split-pane pages scroll their filters independently from their results while retaining fixed headers.

### Fixed

- Fixed artisan-tool proficiency detection for possessive tool names such as Alchemist's Supplies.
- Fixed tool-proficient hidden recipes not appearing for eligible player characters.
- Fixed recipe totals on the Craftworks dashboard disagreeing with the player-visible Recipes browser.
- Fixed broad Drakkenheim requirements failing to recognize valid child materials.
- Fixed intermediate Drakkenheim component requirements matching sibling branches instead of only their own descendants.
- Fixed Craft requirement rows rendering icons without their material labels.

## 0.3.7

### Added

- Encounter Loot and Treasure Hoard results can now be edited before they are awarded.
- GMs can mark individual materials, potions, spell scrolls, special treasure, and manually added Items for removal.
- Added an Item lookup for adding rewards from Item compendiums enabled through D&D5e Configure Sources.
- Coin rewards can now be adjusted by denomination before Loot or Hoard results are awarded.
- The GM Harvest window now displays a persistent Harvesting Completed state for each player.

### Improvements

- Item lookup results use a compact source-aware layout and retain search focus while results update.
- Harvest completion recognizes failed checks, empty results, completed claims, and cases where no claimable choices remain.
- Harvest and Gathering keep the individual character as the participant while routing acquired materials to the configured Party actor when shared storage is enabled.

### Fixed

- Restored scrolling in the player Harvest claiming window.
- Fixed Harvest and Gathering rewards ignoring the configured Party recipient.
- Prevented player startup from invoking an entitlement refresh that may attempt to update protected world settings.
- Prevented Harvest players from remaining stuck in an awaiting-claim state after all available components were claimed.

## 0.3.6

### Added

- Added multi-select school-of-magic constraints to the Spell Scroll Generator, with all available schools selected by default.
- Added the same school-of-magic constraints to the Spellbook Generator, including availability counts that update for the selected schools.
- Added multi-select potion categories for Healing and Recovery, Protection and Resistance, Physical Enhancement, Mobility and Transformation, and Utility and Other. Categories are inferred conservatively from potion names, with unmatched items kept in Utility and Other.
- Added comprehensive Game Master and player manuals with illustrated guidance for acquisition, materials, recipes, crafting, and generated rewards.

### Improvements

- Generator constraints persist while rerolling and clearly warn when no school or potion category is selected.
- Added reusable branded demo-production assets, timed narration, subtitles, and build scripts for the Morelord Craftworks product walkthrough.

### Fixed

- Harvesting checks now open D&D5e's native roll-configuration dialog so players can select Normal, Advantage, or Disadvantage and apply situational bonuses.
- Cancelling a harvesting roll dialog leaves that creature unresolved instead of consuming or failing the attempt.

## 0.3.5

### Added

- Added potion generation and potion and spell-scroll rewards to loot and hoards, with every hoard including both reward types.
- Added reroll and reset controls to Encounter Loot results.
- Added reward-recipient selection for all player characters and group actors while preserving the configured default.
- Added clickable item references wherever generated and awarded items are displayed, including chat cards.
- Added armor, potion, spell-scroll, artisan-tool, and other useful item subtype filters and updated prefab store templates to use them.

### Improvements

- Rebuilt Craft as the standard two-panel search-and-filter list while keeping it focused on recipes marked for crafting and active crafting jobs.
- Materials and Recipes now initially show up to 300 results while counts and filter totals reflect every matching item.
- Spell scrolls now use the native D&D5e scroll-creation API, including scrolls above level 1.
- Standardized compendium source labels to names such as **SRD 5.2**, **Player's Handbook**, and **Monsters of Drakkenheim**.
- Grouped Craftworks and Drakkenheim material filters into concise top-level sections and family options.
- Standardized application scrolling around one outer scrollbar per panel or window and corrected prefab-store height and spacing.
- Tuned encounter magic rewards to a combined 25% chance, favoring potions over spell scrolls.

### Fixed

- Enforced the D&D5e **Configure Sources** selection for every compendium-backed reward, including a final validation when rewards are awarded.
- Fixed broken potion links in award chat cards and linked generated spell scrolls to their source spells.
- Fixed reward cards so item links open their documents with the module's standard dark presentation and hover behavior.
- Fixed result-summary wrapping and long encounter-creature lists.
- Removed verbose console messages about included and excluded items and recipes.

## 0.3.4

### Fixed

- Fresh worlds now enable **Craftworks Standard** and **SRD 5.2** automatically without requiring account authentication or manual compendium synchronization.
- Worlds affected by earlier access gating automatically restore the Standard and SRD 5.2 content-pack defaults once.
- Startup synchronization now waits until the D&D5e item resolver and recipe registry are attached, preventing a successful sync from recording zero indexed recipes.

## 0.3.3

### Fixed

- Removed account authentication requirements from the non-premium **Craftworks Standard** and **SRD 5.2** content packs.
- New worlds can now index standard materials and enabled SRD 5.2 recipes immediately after content synchronization.

## 0.3.2

### Fixed

- Fixed **Sync with Compendiums** failing with `craftworks is not defined`, preventing materials and recipes from being imported or refreshed in a new world.

## 0.3.1

### Added

- Added GM-controlled Harvest preflight selection. GMs can include or exclude each defeated NPC token before starting Harvest.
- Added **Select All** and **Clear All** controls for Harvest preflight creature lists.

### Improvements

- Harvest automatic candidate detection is now limited to defeated D&D5e NPC Actors. Characters, vehicles, groups, and other Actor document types are excluded before preflight.
- Newly discovered defeated NPC tokens default to selected while existing selections are preserved when the Harvest window rerenders.
- Harvest preflight now explains why the GM must distinguish harvestable monsters from shopkeepers, traps, and other NPC-based tokens.

### Fixed

- Fixed the Spell Scroll Generator producing renamed generic templates that did not contain the selected spell's usable activities or effects.
- Generated spell scrolls now use D&D5e's native scroll conversion, including activity configuration, attack and save values, spell-level scaling, limited-use consumption, effects, pricing, and scroll properties.
- Generated scrolls now embed a detached copy of compendium spell mechanics so recipients can use them without requiring access to the source compendium.
- Prevented Harvest sessions from starting when no defeated NPC token is selected.

## 0.3.0

### Added

- Added **Known** and **Unknown** recipe knowledge states. Unknown recipes remain discoverable, but their required ingredients are concealed from players until the recipe becomes Known.
- Added **Known / Unknown** three-state filters to the Recipes browser.
- Added **Mark Context Known** and **Mark Context Unknown** GM actions. Bulk knowledge changes now affect only recipes matching the current search and filter context.
- Added production `MorelordCraftworks.syncContent()` support.
- Added **Sync with Compendiums** to Craftworks Settings so GMs can force an immediate material/content rescan.
- Added automatic content-signature synchronization when relevant installed content changes.

### Improvements

- Standardized the **Materials** and **Recipes** browsers on the Morelord Marketplace long-list UI pattern.
- Filters now live in a persistent left rail and cycle through **Any → Include → Exclude → Any**.
- Search and filter changes update result counts immediately.
- Materials and Recipes do not render result cards until the current context is reduced to **100 or fewer** records.
- The filter rail and result list use independent scroll regions; nested filter-list scrollbars were removed.
- Recipe **Rarity** now represents the public recipe/output rarity rather than ingredient rarity.
- Standard Recipe Rarity filters are always available and work for both Known and Unknown recipes without revealing hidden ingredient information.
- Recipe requirement rows now use friendly component names instead of internal match tags such as `drakkenheim-component-fluid-sap`.
- Requirement rarity is shown separately as a compact label.
- Repetitive **AND** labels were removed from ordinary requirement lists; explicit **OR** handling remains for alternatives.
- Drakkenheim tag-and-rarity requirements resolve back to Craftworks Material images when a suitable material match exists.
- Added application-wide scroll-position preservation for Craftworks ApplicationV2 windows.
- Automatic content synchronization now runs only when the Craftworks version, D&D5e version, enabled Content Packs, available Item compendiums, or relevant active module versions change.
- Only the first active GM performs automatic world-compendium synchronization, avoiding duplicate writes when multiple GMs are connected.

### Fixed

- Fixed long-list actions that could return Materials, Recipes, Craft, Harvest, Gathering, Loot, Hoard, Settings, Spell Scroll Generator, or Spellbook Generator windows to the top after rerendering.
- Fixed Drakkenheim recipe requirement images when requirements are defined by tags and rarity rather than an explicit material ID.
- Fixed Recipe Rarity filtering for players when recipes are Unknown.
- Fixed Recipe Rarity rows disappearing for GMs or players during the rarity-filter refactor.
- Fixed nested scrollbars inside Ingredient Tags and other long filter sections.
- Fixed recipe visibility semantics so Unknown recipes remain searchable and can still be marked as crafting goals without exposing their ingredients.
- Unknown recipes can no longer begin a new player crafting job until their ingredients are Known; existing in-progress jobs are not interrupted by a later knowledge-state change.

## 0.2.2

### Added

- Added a single **Harvest Skill Check** control at the top of the player Harvest window.
- Added **Roll Harvest Checks**, which automatically rolls the selected Harvest skill separately against every unresolved creature available to that character.
- Added batched Harvest attempt resolution so the GM processes the player's creature checks together and returns one authoritative session update.

### Improvements

- Removed repeated per-creature Harvest skill selectors and Roll buttons.
- Large Harvest sessions now require one skill selection and one roll action instead of repeating the same interaction for every corpse.
- Each batched creature check still uses that creature's own Harvest DC.
- Each creature retains its own roll total, success/failure state, and natural-20 result.
- Natural 20 two-claim behavior continues to apply independently to each creature.
- Creatures already attempted, already resolved, automatically succeeded through **Skip Skill Checks**, or otherwise unavailable are skipped by the batch.
- Successful creatures remain expanded so their claimable components are immediately visible.
- Harvest client updates are consolidated after the full batch instead of rerendering the player window after every creature.

### Fixed

- Fixed long Harvest sessions where skill-check resolution could collapse an expanded creature before the player claimed a component.
- Fixed Harvest interactions that could repeatedly jump the player's scroll position back to the top of a long corpse list.
- Preserved the visible Harvest viewport through skill-check results, realtime session synchronization, claims, and manual creature expand/collapse actions.

## 0.2.1

### Added

- Added a Harvest preflight **Player Characters** section with a per-character **Skip Skill Checks** option. Selected characters automatically succeed and open directly to their claimable Harvest components.
- Added Drakkenheim **Special Harvest Items / Instructions** detection. `Items:` entries found in Monsters of Drakkenheim harvest data are shown to the GM before the Harvest session starts.
- Added the **Spellbook Generator** GM tool alongside the Spell Scroll Generator.
- Spellbook Generator lets the GM choose how many cantrips and spells of each spell level should appear in the book.
- Spellbook Generator randomizes spells from enabled spell sources, lets the GM reroll before accepting the result, creates a custom spellbook Item, awards it to the selected recipient, and posts its contents to chat.
- Added a website-ready `USER-GUIDE.md` covering installation, configuration, acquisition workflows, crafting, generators, and common GM/player usage.

### Improvements

- Harvest claims are now reservation-only until **Finalize Harvest**. Claiming a component locks it for the session but does not place it in an Actor inventory.
- **Finalize Harvest** now awards all reserved components and then creates one consolidated Award Card per recipient containing everything that recipient received.
- Harvest finalization tracks each delivered claim so retrying an interrupted Finalize operation does not duplicate already-awarded items.
- **Reset Harvest** and **Cancel Harvest** can now safely discard an unfinished session because claimed components have not yet been awarded.
- Drakkenheim special-item instructions convert Foundry inline-roll notation such as `[[/r 2d4]]` to readable dice notation such as `2d4`.
- Moved **Skip Skill Checks** controls to the right side of Harvest preflight character rows.
- Renamed **Generate Spellbook** to **Spellbook Generator** for consistency with **Spell Scroll Generator**.
- Spellbook Generator results now use a contained scrolling region for large generated spellbooks.
- Spellbook result rows are display-only; only the external-link icon opens the referenced spell, matching other Craftworks interfaces.

### Fixed

- Fixed Skip Skill Checks participant state so automatic-success Harvest states are loaded before the player's first Harvest render.
- Fixed a follow-up regression where player Harvest windows could fail to open after automatic-success state hydration.
- Fixed Spellbook Generator result rows overlapping the Recipient controls.
- Fixed Spellbook Generator clickable areas so the entire spell row no longer acts as a link.
- Fixed Harvest award timing so no inventory changes occur when a player merely claims a component.

## 0.2.0

- Added Harvest preflight controls listing active player characters with a per-character **Skip Skill Checks** option; selected characters receive automatic Harvest success and proceed directly to component claims.
- Drakkenheim Harvest preflight now surfaces `Items:` entries and special harvest instructions from Monsters of Drakkenheim before the GM starts the session.
- Added the GM **Spellbook Generator** tool: choose spell counts by level, generate and reroll randomized spells from enabled spell sources, create a custom linked spellbook Item, award it to a recipient, and post its spell contents to chat.
- Harvest Award Cards are now deferred until the GM clicks **Finalize Harvest**; Craftworks then creates one consolidated card per recipient listing all components that recipient claimed during the session.
- Renamed **Generate Spellbook** to **Spellbook Generator** for consistency with **Spell Scroll Generator**.
- Added a dedicated scrollbar to the Spellbook Generator results area for large generated spellbooks.
- Changed Harvest claims to reservation-only state: claiming a component no longer adds it to an Actor inventory. Claimed components remain synchronized and locked during the session, but actual item awards occur only when the GM clicks **Finalize Harvest**.
- **Reset Harvest** and **Cancel Harvest** can therefore safely discard claims before finalization without having to remove previously awarded inventory.
- Harvest finalization is retry-safe: each claim is marked as awarded individually so an interrupted or repeated Finalize operation does not duplicate delivered items.
- Fixed Spellbook Generator result layout so spell rows stay contained inside the scrollable results area and no longer overlap Recipient controls.
- Spellbook result rows are now display-only; only the external-link icon opens the spell, matching the interaction pattern used elsewhere in Craftworks.
- Cleaned Drakkenheim Special Harvest Item instructions so embedded Foundry roll syntax such as `[[/r 2d4]]` is displayed as readable dice notation (`2d4`) on the Harvest preflight screen.
- Right-aligned the **Skip Skill Checks** control in each Harvest preflight character row.
- Fixed **Skip Skill Checks** Harvest preflight handling: pre-seeded automatic-success participant states are now loaded before the player Harvest window's first render, so selected characters go directly to component claiming instead of being prompted to roll.
- Fixed a Harvest client regression introduced by Skip Skill Checks state hydration: new player Harvest windows again use a forced initial ApplicationV2 render while preserving the preloaded automatic-success state.

## 0.1.0

### Added

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
