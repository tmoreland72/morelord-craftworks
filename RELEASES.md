# Morelord Craftworks Development Releases

This file contains development-build notes and historical implementation notes.

> Development release history below was migrated from the project README in dev.55.
> Going forward, dev release notes belong here rather than in `README.md`.

---

## Migrated from README.md

# Morelord Craftworks

Morelord Craftworks is a Foundry VTT module for gathering, harvesting, looting, selling,
materials and recipes, with premium crafting mechanics planned as a later feature tier.

## Current development milestone

`0.1.0-dev.3` turns the harvesting prototype into the first multiplayer vertical slice.

Implemented in this build:

- Foundry v14 module scaffold
- D&D5e 5.3+ system adapter
- Craftworks material registry using Item flags and canonical compendium UUIDs
- development Standard Materials world-compendium installer
- Actor inventory stacking/award service
- CR-derived harvesting DCs
- player choice of Nature / Medicine / Arcana
- configurable 3-6 harvest-choice range
- distinct weighted harvest choices
- GM-initiated multiplayer harvest sessions over `socketlib`
- check-before-claim workflow
- successful checks unlock selectable components
- claims award real Item documents to the harvesting Actor
- GM live progress view
- GM Finalize closes player harvest windows and notifies players

Still intentionally incomplete:

- permanent packaged Standard Materials compendium (the dev installer creates a world pack for testing)
- complete KCCC-derived Standard material catalog and harvest profiles
- gathering
- party-level loot
- purchase/sell
- recipe browser and processing graph
- premium crafting engine

## First-time development setup

Enable the module in a D&D5e world, log in as GM, and run once:

```js
await MorelordCraftworks.dev.installStandardMaterials();
```

This creates a temporary world compendium named **Morelord Craftworks — Standard Materials (Dev)**
and populates the seed materials. This is only a development bridge until the permanent module
compendium is generated and packaged.

## Test harvesting

1. Log in with a GM client and at least one player client.
2. Make sure the player controls a token they own (selected token is preferred over their configured character).
3. As GM, select one or more Beast or Monstrosity creature tokens.
4. Run:

```js
MorelordCraftworks.openHarvest();
```

5. Click **Start Harvest**.
6. Each active player receives a Harvest window.
7. The player chooses Nature, Medicine, or Arcana and rolls against the CR-derived DC.
8. A failed check ends that player's attempt for that creature.
9. A successful check reveals 3-6 distinct weighted components; the player may claim one.
10. The GM can watch live progress and click **Finalize Harvest** when done.

## Material identity

Canonical material Items carry `flags.morelord-craftworks`, including:

- `materialId`
- `sourceUuid`
- `tags`
- `rarity`
- `category`
- `stage`
- `schemaVersion`

Recipes will match by logical material ID or tags. Foundry UUIDs identify canonical source documents.


## Development Support Baseline

Morelord Craftworks currently targets **Foundry Virtual Tabletop v14 only**. Foundry v13 compatibility is intentionally out of scope so the module can use the current v14 application and document APIs without legacy compatibility workarounds.

The current D&D adapter is being developed against the D&D5e 5.3.x system data supplied for this project.



## 0.1.0-dev.48

Adds the next acquisition prototype features:

- GM-initiated individual Gathering sessions.
- Players may Gather or Decline independently.
- Gathering terrain determines DC and result pool.
- Successful gatherers receive their own generated material; failures receive nothing.
- Party-level Material Loot happens once after Harvest.
- Loot uses CR-band-specific nothing-found percentages and weighted material pools.
- After Harvest finalization, the GM is automatically offered the Material Loot window.
- Party loot is awarded once to a GM-selected character who carries it for the party during this prototype phase.

Development commands:

```js
MorelordCraftworks.openGather();
MorelordCraftworks.openLoot();
```


## 0.1.0-dev.48

Corrections:
- Fixed the Gathering player ApplicationV2 `state` property collision.
- Replaced broken reagent image paths with working Foundry core icon references.
- Normal post-combat Material Loot now scans all dead creatures on the current scene.
- Each dead creature rolls against its own CR-band loot probabilities.
- Results are consolidated into one party haul and awarded once.
- Manual CR-tier selection has been removed from normal Loot. A separate hoard/cache feature can use that model later.


## 0.1.0-dev.48

- Adds world setting **Use Party Actor for Acquired Materials**.
- Adds **Party Recipient Actor** selector populated from D&D5e Group actors.
- When enabled, Harvest, Gathering, and Loot all route awarded Craftworks Items to the configured Party/Group actor.
- If no actor is explicitly selected and exactly one populated Group actor exists, Craftworks uses it automatically.
- When Party Recipient is disabled, Harvest/Gather continue to award individual characters and Loot retains the carrier selector.


## 0.1.0-dev.48

Gathering lifecycle and persistence fixes:

- Fixed the stale GM Gathering ApplicationV2 instance that could reopen a completed session and show/award its prior result again.
- Each Gathering window now starts with a fresh GM application instance.
- Gathering attempts are persisted per Scene and per Actor using Scene flags.
- A successful or failed gathering roll consumes that Actor's opportunity on that Scene.
- Declining does not consume the Actor's scene opportunity.
- Returning to a previously visited Scene does not reset gathering availability.
- Added a GM `Reset Gathering for Scene` action.
- Player Gathering UI reports when the selected/assigned Actor has already gathered on the current Scene.


## 0.1.0-dev.48

- Harvest attempts persist per Actor, per dead token.
- Successful and failed Harvest attempts both consume that character's opportunity on that corpse.
- Loot resolution persists per dead token and is skipped on later Loot sessions.
- Added Reset Harvesting for Scene and Reset Looting for Scene GM controls.


## 0.1.0-dev.48

Marketplace integration boundary:

- Removed the planned Craftworks purchase/sell workflow; commerce belongs to Morelord Marketplace.
- Craftworks material Items remain normal D&D5e `loot` Items with quantity and price fields.
- Canonical Craftworks metadata remains in `flags.morelord-craftworks`.
- The development material installer now synchronizes existing compendium Items as well as creating missing Items.
- Material prices are stored on the Item's normal D&D5e `system.price` field so Morelord Marketplace can use them directly.
- Craftworks itself does not debit/credit currency, perform sales, or provide a shopping UI.


## 0.1.0-dev.48

Marketplace availability contract:

- Sellability is value-driven; Craftworks does not define a `sellable` flag.
- An Item with a positive value may be sold through Morelord Marketplace.
- Buying is separate: Craftworks materials expose `flags.morelord-craftworks.purchasable`.
- `purchasable` is opt-in and defaults to false when omitted.
- Current ordinary Standard materials are marked purchasable.
- Primal Essences have value but are not purchasable.
- The development installer synchronizes `purchasable` onto existing canonical material Items.
- Read-only helpers are exposed through `MorelordCraftworks.marketplaceIntegration`:
  - `isCraftworksItem(item)`
  - `isPurchasable(item)`
  - `getMaterialId(item)`

Craftworks performs no purchasing, selling, or currency transactions.

## 0.1.0-dev.48

Reference layer:
- Adds searchable Materials and Recipes browsers.
- Materials show acquisition methods, value, purchasability, tags, and recipe relationships.
- Recipes show categories, ingredient requirements, and outputs.
- Adds the first recipe registry/data model with exact material IDs, tag matching, same-material requirements, and internal material outputs.
- Adds starter processing references for Hide -> Rawhide Leather and Metal Scraps -> Parts.
- Recipe browsing is Standard functionality; crafting execution is not enabled.

Development commands:
```js
MorelordCraftworks.openMaterials();
MorelordCraftworks.openRecipes();
```

## 0.1.0-dev.48

- Fixes dev.20 startup regression where the RecipeRegistry was exposed on the API before being instantiated.
- Recipe data now loads during the ready hook before the public Craftworks API is created.
- Restores `globalThis.MorelordCraftworks` and `game.modules.get("morelord-craftworks").api`.



## 0.1.0-dev.48

- Converts Materials and Recipes into proper scrollable permanent browsers.
- Browser headers and search controls remain fixed while results scroll independently.
- Uses flex/min-height rules compatible with Foundry v14 ApplicationV2 windows.
- Increases default browser size slightly while retaining resizability.

## 0.1.0-dev.48

Main application shell:

- Adds a permanent Morelord Craftworks dashboard as the normal module entry point.
- Materials and Recipes are available to all users from the dashboard.
- GM-only Acquire section opens Harvest, Gather, and Loot workflows.
- Dashboard summarizes the current scene, dead creature count, gathering usage, material/recipe counts, and Party Recipient status.
- Existing acquisition and reference applications remain separate ApplicationV2 windows.

Open Craftworks with:

```js
MorelordCraftworks.open();
```

`MorelordCraftworks.openCraftworks()` is also available.

## 0.1.0-dev.48

- Fixes the Craftworks dashboard Party Recipient display.
- Party recipient status now exposes normalized `actorName`, `actorUuid`, `memberCount`, and `valid` fields.
- Dashboard shows the resolved Party/Group actor name and member count.
- Misconfigured Party Recipient settings now show a warning instead of a blank recipient name.


## 0.1.0-dev.48

Encounter Loot:

- Replaces Material Loot with Encounter Loot.
- Each unresolved dead creature independently checks for:
  - Craftworks materials (most likely),
  - coin (less likely).
- One special-treasure check is made for the entire encounter, based on the highest CR band present.
- Default chances:
  - CR 0–4: 65% material, 30% coin, 2% special treasure.
  - CR 5–10: 75% material, 40% coin, 4% special treasure.
  - CR 11–16: 85% material, 55% coin, 7% special treasure.
  - CR 17+: 90% material, 70% coin, 12% special treasure.
- Coin scales by creature CR and is consolidated into the encounter haul.
- Party Recipient now receives both Craftworks materials and recovered coin.
- Encounter corpse results remain persistent so reopening Loot cannot farm the same dead tokens.
- Special treasure is currently a source-backed hook only; dev.25 does not generate or redistribute magic Items.
- A separate Hoard workflow remains planned for accumulated treasure caches/lairs/vaults.

The probability model is Craftworks-owned design inspired by the distinction between individual treasure and hoards, not a reproduction of the 2014 DMG tables.

## 0.1.0-dev.48

Expanded acquisition economy settings.

Harvest:
- Harvest DC Modifier.
- Minimum Harvest Choices.
- Maximum Harvest Choices.
- Rare Result Bias.

Gathering:
- Gathering DC Modifier.
- Quantity Multiplier.
- Rare Result Bias.

Encounter Loot:
- Material Chance Modifier.
- Coin Chance Modifier.
- Special Treasure Chance Modifier.
- Material Quantity Multiplier.
- Coin Multiplier.

Chance modifiers are percentage-point adjustments to the CR-band defaults and are clamped to 0–100%.
Quantity/value multipliers scale the generated result after the normal content roll.
Rare Result Bias changes relative weighting toward or away from higher-rarity materials without replacing content-pack weights.

The obsolete pre-Encounter-Loot "nothing found chance" settings are no longer registered.

## 0.1.0-dev.48

Settings UI cleanup:

- Numeric Craftworks world settings now use normal number inputs instead of sliders.
- Artificial UI min/max ranges have been removed.
- Runtime code still applies safety rules where they are logically required, such as clamping final probability values to 0–100%.
- Existing defaults are unchanged.

## 0.1.0-dev.48

Settings documentation:

- Every visible Craftworks world setting now includes a detailed GM-facing description.
- Descriptions explain whether a value is additive or multiplicative.
- Probability modifiers include examples and clarify that they modify CR-band defaults.
- Party Recipient settings explain automatic Group selection and fallback behavior.
- Runtime safety behavior, such as probability clamping and whole-Item quantity rounding, is documented directly in the settings UI.

## 0.1.0-dev.48

Encounter Loot channel controls:

- Adds `Enable Craftworks Material Loot`.
- Adds `Enable Coin Loot`.
- Adds `Enable Special Treasure Loot`.
- Each channel is independent.
- Disabled channels do not roll, do not generate awards, and do not display misleading "nothing found" results.
- Existing chance modifiers and multipliers remain available for enabled channels.

## 0.1.0-dev.48

- Fixes the dev.29 startup regression caused by removing the exported `exposePartyActorSetting()` function during the settings-description refactor.
- Restores dynamic Party/Group actor choices in Module Settings.
- Validates that every named import from `core/settings.mjs` used by `main.mjs` is actually exported before packaging.

## 0.1.0-dev.48

- Fixes dev.30 initialization failure: `registerBoolean is not defined`.
- Restores all settings helper functions used by `registerSettings()`:
  - `registerBoolean`
  - `registerString`
  - `registerNumber`
- Packaging validation now checks both:
  - helper functions referenced inside `registerSettings()`
  - named exports imported by `main.mjs`

## 0.1.0-dev.48

- Rebuilds `core/settings.mjs` cleanly after the dev.28-dev.31 settings regressions.
- Fixes registration stopping after the first setting.
- Restores the ready-time Party Recipient Actor selector pattern.
- Fixes incorrect Harvest setting identifiers (`HARVEST_CHOICES_MIN` and `HARVEST_CHOICES_MAX`).
- Preserves all current descriptions, plain-number inputs, and Encounter Loot channel toggles.
- Build validation now checks every `SETTINGS.*` reference across all module scripts and fails if any referenced key is undefined.
- Build validation also checks all helpers called by `registerSettings()` and verifies the expected visible settings are actually registered.

## 0.1.0-dev.48

Source-backed Special Treasure:

- Encounter Loot can now turn a successful Special Treasure check into an actual Item.
- Craftworks automatically searches for existing RollTables named `Magic Item Table A` through `Magic Item Table I`.
- Sources may be world RollTables or RollTables stored in installed compendiums.
- Craftworks does not ship or recreate those copyrighted tables/items.
- CR bands use Craftworks-owned table-selection weighting:
  - CR 0–4 favors A, then B, with a small C chance.
  - CR 5–10 favors B/C with some A/D/E.
  - CR 11–16 favors D/E/F with some C/G.
  - CR 17+ favors G/H/I with some E/F.
- Nested RollTables are followed automatically up to a safe recursion limit.
- Table results that resolve to owned Item documents are copied into the Encounter Loot recipient when awarded.
- If the special roll triggers but no compatible A–I table or Item result can be resolved, the Loot UI shows a clear warning and does not fabricate a reward.
- `MorelordCraftworks.specialTreasure.sourceStatus()` can be used from the console to see which A–I source tables Craftworks detected.

## 0.1.0-dev.48

Craftworks launcher and Foundry v14 cleanup:

- Adds a Morelord Craftworks button to the Token scene controls.
- The launcher is available to all users because Materials and Recipes are player-facing; GM-only acquisition actions remain hidden from players inside the dashboard.
- Clicking the launcher opens or focuses the main Craftworks dashboard.
- Updates Special Treasure result resolution to use the Foundry v14 UUID path rather than legacy TableResult link fields.
- Keeps embedded UUID/Compendium text-link resolution as a final compatibility fallback.

## 0.1.0-dev.48

Dashboard cleanup:

- Removes the Economy Settings informational section from the main dashboard.
- Reduces Storage from a full dashboard section to a compact status row.
- Keeps Materials, Recipes, and Acquire as the primary visual hierarchy.

## 0.1.0-dev.48

Dashboard recipient wording:

- Replaces the generic "Storage" label with plain-English recipient status.
- Party mode now states that acquired materials and loot go to the configured Group actor inventory.
- Individual mode states that acquired materials go to the individual actor's inventory.

## 0.1.0-dev.48

Treasure Hoards:

- Adds a separate GM-only Hoard workflow for lairs, vaults, caches, strongboxes, treasure rooms, and similar accumulated wealth.
- GM chooses a challenge tier: 0–4, 5–10, 11–16, or 17+.
- Higher tiers generate substantially more coin, more Craftworks material rolls, and a greater chance of special treasure.
- Hoards respect the existing material, coin, and special-treasure enable/disable settings.
- Existing material quantity, coin, and special-treasure modifiers also apply.
- Special treasure uses the same source-backed provider as Encounter Loot.
- Party Recipient mode sends the complete hoard to the configured Group actor; otherwise the GM chooses a carrier.
- Adds Hoard to the main Craftworks dashboard.
- Hoard values are Craftworks-owned defaults and do not reproduce published treasure-hoard tables.

## 0.1.0-dev.48

Hoard special treasure quantity:

- A successful Hoard special-treasure check now rolls 1d4 to determine how many special items are found.
- Each item is resolved independently through the existing source-backed special-treasure provider.
- All resolved items are displayed in the Hoard result and awarded to the same recipient.
- If some draws fail to resolve while others succeed, valid items are preserved and the unresolved draws are reported.
- Encounter Loot remains limited to one special item when its special-treasure check succeeds.

## 0.1.0-dev.48

Recipe schema foundation:

- Expands RecipeRegistry to normalize and validate the full agreed recipe model.
- Supports exact material requirements using `materialId`.
- Supports generic matching by tags, rarity, category, and processing stage.
- Multiple requirement objects are AND requirements.
- Multiple tags inside one match are compatibility requirements on the same material.
- Supports alternatives with independent quantities.
- Supports `sameMaterial` requirements.
- Supports both `craftworks-material` and `foundry-item` outputs.
- Recipe browser displays normalized human-readable requirements and output types.
- Recipe search includes recipe metadata, material IDs/names, tags, rarity, stage, and output labels.
- Material/recipe relationship helpers understand exact dependencies and alternatives.
- Development seed includes examples exercising every schema shape.
- The Foundry Item output example is intentionally a placeholder and is not final SRD content.

This establishes the schema needed for separate Standard SRD 5.2 and SRD 5.1 recipe packs.

## 0.1.0-dev.48

- Fixes `recipes is not iterable` during recipe registry startup.
- Recipe seed loading now accepts:
  - a raw recipe array,
  - `{ recipes: [...] }`,
  - `{ recipes: { ...keyed recipes... } }`,
  - compatible keyed development recipe objects.
- Adds a module-version query parameter and `cache: "no-store"` when fetching recipe seed data so Foundry/browser caching cannot reuse an older seed shape after an upgrade.
- Invalid seed shapes now produce a specific format error rather than a generic iteration exception.

## 0.1.0-dev.48

Recipe startup reliability:

- Removes runtime `fetch()` of `standard-recipes.seed.json`.
- Recipe seed data is now imported directly as an ES module from `data/standard-recipes.seed.mjs`.
- The registry and its seed are therefore loaded/versioned together by Foundry's module loader.
- This eliminates the stale JSON-vs-JavaScript cache mismatch that caused `recipes is not iterable`.
- The JSON seed remains in the project as readable source data; the runtime uses the ESM seed.
- Added a real Node runtime validation that imports the packaged RecipeRegistry, loads the packaged seed through a fake material registry, and verifies all recipe definitions normalize successfully.

## 0.1.0-dev.48

Recipe registry correction:

- Fixes the persistent `recipes is not iterable` startup failure.
- Previous dev.39-dev.41 work mistakenly modified `scripts/core/recipe-registry.mjs`, but `main.mjs` actually imports `scripts/recipes/recipe-registry.mjs`.
- Replaces the actual imported registry with the new full-schema implementation.
- Removes the unused duplicate registry under `scripts/core` so there is now one RecipeRegistry source of truth.
- Runtime recipe seed is imported directly from `data/standard-recipes.seed.mjs`.
- Material browser dependency lookup now recognizes exact-material requirements inside recipe alternatives.
- Build validation now traces the RecipeRegistry import directly from `main.mjs` and runtime-tests that exact file.

## 0.1.0-dev.48

Recipe browser layout cleanup:

- Rebuilds recipe cards with a dedicated layout rather than inheriting the Material reference-card grid.
- Separates recipe title, metadata, description, requirements, output, and tags into stable regions.
- Requirements and Produces now use a responsive two-column layout.
- Recipe tags use the existing pill treatment instead of rendering as an unstyled text blob.
- Output Items use a compact image/name/type block.
- Narrow windows collapse the recipe details to one column cleanly.

## 0.1.0-dev.48

Recipe inventory readiness:

- Adds a reusable RecipeEvaluator for checking recipe requirements against Actor inventory.
- Recipe browser can evaluate Character and Group actor inventories.
- Controlled token is preferred automatically; player character is used next when available.
- Supports exact Craftworks material IDs, tag matches, rarity, category, processing stage, quantities, alternatives, and `sameMaterial`.
- Recipe cards show Ready, Missing Materials, or No Inventory.
- Each requirement shows its own satisfied/missing state and available quantity detail.
- This is reference/readiness only; it does not consume materials or execute crafting.

## 0.1.0-dev.48

Recursive recipe planning:

- Adds a RecipePlanner on top of the inventory evaluator.
- Recipes now have three meaningful inventory states:
  - Ready
  - Ready after processing
  - Missing materials
- Planner recursively follows Craftworks processing recipes that produce exact missing material IDs.
- Processing chains can span multiple internal processing recipes.
- Planner simulates consumption/production without modifying Actor inventory.
- Recipe cards show the processing steps required when a recipe can become ready through processing.
- Cycles are guarded so recursive processing definitions cannot loop forever.
- Generic tag/category requirements remain direct-inventory checks for now; recursive production currently requires an exact output materialId.
- This remains planning/reference functionality only and does not execute crafting.

## 0.1.0-dev.48

Multiplayer acquisition delivery reliability:

- Fixes a race where a client could receive `harvest.open` before Craftworks had registered the Harvest message handler.
- SocketService now queues messages whose named handler has not been registered yet and replays them when that handler becomes available.
- This protects Harvest, Gathering, and future multiplayer Craftworks workflows from async client-startup timing differences.
- Harvest client handling now validates the session id, logs imported creature count, and only closes an existing player Harvest window when it is actually rendered.
- GM Harvest notification now lists the player names the session was sent to.

## 0.1.0-dev.48

Harvest player window scrolling:

- Gives the Harvest player ApplicationV2 window a bounded, resizable default height.
- Makes the creature list vertically scrollable while keeping the Harvest window shell/header visible.
- Large encounters no longer require resizing the entire client window just to reach later corpses.

### dev.47 follow-up

- Harvest player state changes now keep the rolled creature card in view, so successful rolls immediately expose the inline component claim choices even in long scrollable creature lists.
- `harvest.state` rendering is awaited on the client.
- Restores per-Actor/per-token Harvest persistence: failed attempts are recorded immediately and successful attempts are recorded when the component is claimed.

### dev.47 Harvest choice fix

- Fixes successful Harvest checks showing "Choose one component" with no claim buttons.
- Root cause: the prototype Harvest profile only covered beast and monstrosity creature types; aberrations, fey, and other types generated an empty choice list.
- Adds Standard fallback harvest pools for all core creature types and a generic fallback for custom creature types.
- Adds a zero-choice safeguard: Harvest will never enter `awaiting-claim` with an empty `choices` array.
- GM console logging now records each Harvest result status and the number of generated choices.

### dev.47 Harvest reset/finalize cleanup

- Moves **Reset Harvest** beside **Finalize Harvest** while a Harvest session is active.
- Reset clears the scene's persistent Harvest records and starts a fresh Harvest session for connected players so the GM and player windows both return to an unattempted state.
- Removes the automatic Encounter Loot window launch after Finalize Harvest. Encounter Loot remains a separate GM-initiated acquisition workflow from the Craftworks dashboard.

## 0.1.0-dev.48

Recipe source-pack architecture:

- Adds explicit Craftworks recipe packs:
  - Craftworks Standard (system-agnostic)
  - SRD 5.2 (2024)
  - SRD 5.1 (2014)
- RecipeRegistry now aggregates multiple packaged recipe sources and rejects duplicate recipe IDs.
- Every recipe carries pack id, pack label, and rules-generation metadata.
- Recipe browser adds a Recipe Pack filter with per-pack recipe counts.
- Recipe cards display source pack and rules generation.
- Search includes pack/rules metadata.
- Existing development recipes are classified as Craftworks Standard.
- SRD 5.2 and SRD 5.1 runtime source files are intentionally empty placeholders in this build; no SRD recipe content has been invented or silently added.
- This establishes the safe separation required before populating actual SRD-derived reference content.

### dev.48 Recipe pack world settings

- Every recipe pack registered in `RECIPE_PACKS` automatically receives a world-level GM checkbox under Morelord Craftworks settings.
- Current settings are:
  - Recipe Pack: Craftworks Standard
  - Recipe Pack: SRD 5.2
  - Recipe Pack: SRD 5.1
- A disabled pack remains installed but its recipes are excluded from:
  - Recipe browser results and source filters
  - Recipe search
  - Inventory readiness
  - Recursive processing plans
  - Material-to-recipe dependency resolution
- The mechanism is data-driven. Future packs such as PHB and Monsters of Drakkenheim only need to be registered in `RECIPE_PACKS`; their enable/disable settings are created automatically.
- This supports campaign-specific configurations such as enabling Monsters of Drakkenheim while disabling PHB and SRD packs.

### dev.48 Content Packs manager

- Replaces individual visible per-pack settings with one **Content Packs** submenu.
- Free and Premium packs are listed together with status labels.
- Premium packs remain visible without entitlement and show **Premium — Access Required**.
- Premium toggles are disabled until access exists.
- Hidden world settings persist each pack's enabled/disabled state.
- Adds placeholder premium packs for Player's Handbook and Monsters of Drakkenheim.
- Adds a centralized ContentAccessService for future Patreon/license entitlement integration.


## 0.1.0-dev.54

Settings architecture and Morelord Core entitlement integration:

- Replaces the long list of visible Foundry settings with one **Configure Craftworks** submenu.
- All underlying world settings are now hidden persistence values (`config: false`).
- Removes the old behavior that exposed Party Recipient Actor back into the normal settings list.
- New Craftworks settings UI has explicit sections:
  - Content Packs
  - Materials
  - Recipes
  - Crafting
- Materials contains organized subsections for storage, Harvesting, Gathering, and Encounter Loot.
- Content Packs shows Free/Premium status and enable/disable state in one place.
- Premium access no longer uses a Craftworks-local entitlement flag/service.
- Adds `MorelordCoreAccessService`, which reads entitlement state from the active Morelord Core module and caches it for Craftworks.
- Current premium packs require the shared `premium-modules` entitlement.
- Premium packs remain visible without entitlement but cannot be enabled.
- Placeholder premium packs remain registered for Player's Handbook and Monsters of Drakkenheim.
- Recipe availability requires both world enablement and Morelord Core entitlement.
- Morelord Core is declared as a recommended module dependency so Standard/free acquisition workflows remain usable if Core is unavailable.

### dev.49 settings scroll fix

- Fixes the unified Craftworks settings window so the settings form has an explicit vertical scrollbar.
- The ApplicationV2 window content now remains bounded while the inner settings form scrolls independently.
- The sticky Save Changes footer remains reachable at the bottom of the scroll area.


## 0.1.0-dev.54

Morelord Core premium access integration:

- Reworks Craftworks premium detection to consume the access model actually exposed by Morelord Core rather than assuming Core mirrors the website entitlement list verbatim.
- Supports explicit Core entitlement APIs when available, including `premium-modules`.
- Supports Core feature/access APIs when available.
- Supports Morelord Core installation/account access objects carrying a `tier`.
- `premium`, `tools-premium`, and `champion` tiers satisfy Craftworks Premium.
- A generic `feature: true` flag alone is not treated as premium; a premium-tier/access signal is still required.
- Supports Core public state exposed through `game.modules.get("morelord-core").api`, `globalThis.MorelordCore`, or `globalThis.morelordCore`.
- Craftworks settings now show the detected Core source, tier, entitlements, features, and whether Craftworks considers the account Premium.
- Crafting Premium status and premium Content Pack availability use the same Core access result.


## 0.1.0-dev.54

Content Pack foundation:

- Generalizes the recipe-only pack model into a Craftworks-wide Content Pack model.
- Content packs declare capabilities for materials, recipes, harvesting, gathering, loot, and crafting.
- Adds `ContentPackService` as the single source of truth for world enablement plus Morelord Core entitlement.
- Existing dev.50 per-pack world choices are preserved by retaining the same hidden setting keys.
- RecipeRegistry now exposes only recipes from active Content Packs.
- Harvest profiles are pack-owned and filtered by active packs with the `harvest` capability.
- Craftworks Standard owns the current generic Harvest fallback; disabling Standard prevents that fallback from leaking into a Drakkenheim-only campaign.
- MaterialRegistry reads material pack ownership and ignores materials from disabled/inaccessible packs.
- Existing legacy Standard materials without a pack id are treated as `standard-core`.
- Newly synchronized Standard materials are stamped with `packId: standard-core`.
- This establishes the boundary future PHB and Monsters of Drakkenheim packs need to contribute their own materials, recipes, harvest profiles, gathering, and loot data independently.


## 0.1.0-dev.54

Content Pack acquisition completion:

- Gathering terrain profiles are now Content Pack owned.
- All current Standard Gathering terrains belong to `standard-core`.
- Gather UI lists only terrains from active packs with the `gathering` capability.
- Gathering resolution verifies that the terrain's supplying Content Pack is still active.
- Encounter Loot material tiers are Content Pack owned.
- Encounter Loot economy profiles (material, coin, special chances and coin ranges) are Content Pack owned.
- All current Encounter Loot profiles belong to `standard-core`.
- LootService requests profiles only from active packs with the `loot` capability.
- No active Loot pack now produces a clear error instead of silently falling back to Standard.
- Disabling Craftworks Standard consistently removes its materials, recipes, Harvest profiles, Gathering profiles, and Encounter Loot profiles.
- This completes the first end-to-end Content Pack boundary for future PHB and Monsters of Drakkenheim content.


## 0.1.0-dev.54

Content Pack manifests:

- Adds a single manifest for every Craftworks Content Pack.
- A manifest can contribute:
  - materials metadata/source
  - recipes
  - Harvest profiles
  - Gathering profiles
  - Encounter Loot material tiers
  - Encounter Loot economy profiles
- Moves existing Standard acquisition data into `data/packs/standard/`.
- Adds empty manifest-backed acquisition modules for:
  - SRD 5.2
  - SRD 5.1
  - Player's Handbook
  - Monsters of Drakkenheim
- Harvest, Gathering, Loot, and Recipe registries now read from Content Pack manifests rather than hardcoded global source arrays.
- `ContentPackService` can return manifests, collect active pack data by field/capability, and validate that every registered pack has exactly one manifest.
- Startup validates pack/manifest consistency.
- Craftworks Settings now shows per-pack counts for recipes, Harvest profiles, Gathering profiles, and Loot tiers.
- This makes future content packs additive: their data can be supplied through their manifest without modifying Craftworks core acquisition logic.


## 0.1.0-dev.54

Content Pack manifest completion:

- Finishes the manifest architecture introduced in dev.53.
- Materials are now a first-class manifest source with `seedPath` and inline `entries` support.
- Standard material synchronization reads its seed path from the Standard manifest instead of hardcoding the file path.
- Adds deterministic manifest priority.
- Higher-priority active packs may intentionally replace lower-priority content with the same identity.
- Collision precedence now applies to:
  - material IDs
  - recipe IDs
  - Harvest profile IDs
  - Gathering profile IDs
  - Loot tier IDs
  - Encounter Loot profile IDs
- Duplicate IDs inside the same manifest fail validation.
- Every registered Content Pack must have exactly one valid manifest.
- Every profile collection must be an array and materials must declare a source object.
- Runtime profile accessors automatically annotate ownership with `packId`.
- MaterialRegistry uses Content Pack priority when duplicate material IDs are present.
- Existing legacy Standard material Items remain compatible.
- Settings now report material source, recipe, Harvest, Gathering, Loot-tier, and Encounter-profile counts for each pack.
- Adds `data/packs/README.md` documenting the Content Pack format, ownership, precedence, entitlement behavior, and extension rules.
- No further Craftworks core changes should be required simply to add a new content pack.


---

## 0.1.0-dev.55

Materials inventory browser:

- Adds Character/Group inventory selection to the Materials browser.
- Controlled token is preferred automatically, then the user's assigned
  character, then the sole accessible Character/Group actor.
- Displays quantity owned for every visible Craftworks material.
- Shows total displayed material types owned and total units owned.
- Adds an active Content Pack filter to the Materials browser.
- Material search now includes Content Pack/source information.
- Material cards display their source Content Pack.
- Recipe relationships continue to use only active recipe content.
- Removes development-build history from `README.md`.
- Development release notes now belong in `RELEASES.md`.


---

## 0.1.0-dev.56

Recipe catalog work:

- Removes the development-only Foundry Item output example from Standard recipes.
- Removes demonstration-only reagent recipes that referenced material rarities not present in the current Standard catalog.
- Standard recipes now contain five usable processing recipes:
  - Prepare Rawhide Leather
  - Piece Together Rawhide
  - Fabricate Parts
  - Concentrate Primal Essence
  - Refine Primal Essence
- Adds Recipe browser filters for Content Pack, recipe Type, and Category.
- Retains inventory readiness and recursive processing-plan behavior.
- Adds the planned Standard/free Homebrew Materials and Homebrew Recipes roadmap to README as durable future-development documentation.


---

## 0.1.0-dev.57

Recipe reference metadata:

- Adds optional per-recipe crafting metadata for recommended tool, governing ability, optional skill, reference DC, and crafting/processing time.
- RecipeRegistry normalizes the new metadata without requiring it for every pack.
- Recipe cards display a compact crafting-details row.
- Populates the current five Craftworks Standard processing recipes with reference metadata.
- Crafting execution remains Premium; Standard continues to provide recipe reference and inventory-readiness information.


---

## 0.1.0-dev.58

Recipe browser cleanup:

- Removes the visible Craftworks Standard source badge from normal recipe cards.
- Premium recipes use a compact `Premium` badge rather than `Craftworks Premium`.
- Consolidates the duplicate Rawhide Leather recipes into one recipe with OR ingredient choices:
  - 1 × Hide
  - OR 3 × Hide Scraps
- Standard recipe catalog now contains four recipes with one recipe per output material.
- Requirement rows now show inventory availability as `(available of required)`.
- Sufficient requirements are shown in green.
- Insufficient requirements are shown in red.
- Alternative ingredient options each show their own availability and status.


---

## 0.1.0-dev.59

Recipe planner regression fix:

- Restores the `RecipeRegistry.recipesProducingMaterial(materialId)` API required
  by `RecipePlanner`.
- Fixes the Recipes browser crash that appears when a selected inventory causes
  recursive processing evaluation.
- This is why the browser could initially open normally, then fail after adding
  Hide to the selected Party/Group inventory.
- Packaging validation now verifies that every public RecipeRegistry method called
  by RecipePlanner is actually implemented.


---

## 0.1.0-dev.60

Recipe/material navigation and output validation:

- Exact Craftworks material ingredients are clickable from Recipe cards.
- Craftworks material outputs are clickable from Recipe cards.
- Clicking a material opens/focuses the Materials browser on that material.
- The Materials browser now supports a focused material state while preserving
  actor inventory quantities and pack filtering.
- RecipeRegistry now enforces one Craftworks material-output recipe per Content
  Pack. A second recipe producing the same material causes startup validation to
  fail with guidance to use OR/alternative requirements instead.
- This formalizes the recipe behavior requested in dev.58 rather than relying only
  on the current Standard dataset being clean.


---

## 0.1.0-dev.61

Crafting time/check model:

- Replaces the temporary per-recipe time field with the actual Craftworks crafting
  model.
- Adds a global 2-hour crafting-check interval.
- Adds `noToolDc` to recipe metadata; when omitted it defaults to normal DC + 5.
- Adds optional `hoursRequired` to recipe metadata.
- Current Standard recipes intentionally leave `hoursRequired` unset until
  source-backed durations are available.
- Recipe cards now show normal check/DC, no-tool DC, and `Each Check: 2 hours`.
- Failed crafting checks are formally modeled as consuming 2 hours while adding
  zero crafting progress and consuming no recipe materials.
- Adds a reusable `resolveCraftingAttempt()` rule helper for eventual Premium
  crafting execution.


---

## 0.1.0-dev.62

Recipe total-time and crafting-progress model:

- Recipe cards no longer display `Each Check: 2 hours`.
- Recipes display their total `Time` when `hoursRequired` is known.
- The 2-hour crafting-check interval remains an internal Craftworks rule.
- Adds automatic calculation of required successful checks from total crafting
  hours (`hoursRequired / 2`, rounded up).
- Adds a CraftingJobService foundation that tracks attempts and successful checks
  separately.
- Failed attempts consume time but do not increment successful crafting progress.
- Once a crafting job exists, the Recipe card can append progress such as
  `✅ 1 of 4 Successes`.
- No player-facing Premium crafting execution/start button is enabled yet.
- Current Standard recipe durations remain unset rather than inventing source data.
- Requirement rows now use compact material icons with quantity beside them; hover
  reveals the full ingredient description.
- Produce rows use the same compact icon + quantity presentation, with full output
  details available on hover.


---

## 0.1.0-dev.63

Nested recipe requirement logic:

- Adds canonical `requirementGroups` to recipes.
- Top-level requirement groups are OR choices.
- Requirements inside each group are AND requirements.
- Individual requirements can still contain OR ingredient alternatives.
- Supports structures such as:
  - `Hide ×1 AND (Stick ×2 OR Pole ×1)`
  - OR `Rawhide ×5 AND Pole ×4`
- RecipeEvaluator now evaluates each complete OR group and consumes simulated
  inventory across AND requirements so the same stock cannot satisfy multiple
  requirements in one group.
- RecipePlanner can recursively process materials through the new group structure.
- Recipe cards visually show AND within a group and OR between complete groups.
- Existing flat `requirements` remains readable for backward compatibility, but
  packaged Standard recipes now use `requirementGroups`.


---

## 0.1.0-dev.64

Recipe tool awareness:

- Recipe cards now inspect the selected Character/Group inventory for the required
  D&D5e Tool item.
- When the tool is present, the recipe displays the normal recipe DC.
- When the tool is absent, the recipe displays the no-tool DC.
- Tool possession is visually indicated with success/missing status.
- When the matching D&D5e Tool item is present, Craftworks also reads
  `item.system.proficient` and labels the actor as Proficient or Not Proficient.
- Owning the tool and being proficient with the tool remain separate states.
- No automatic crafting roll is added yet; this prepares the Recipe browser and
  future Premium execution to use the correct selected-actor conditions.


---

## 0.1.0-dev.65

Recipe tool/DC presentation correction:

- Removes red/green state coloring from the required Tool label.
- Removes visible `Proficient`, `Not Proficient`, and duplicate `Missing tool;
  using DC ...` text from recipe cards.
- Tool remains neutral recipe information.
- The Check line now displays only the DC that applies to the selected actor.
- The normal DC requires both the required tool and confirmed proficiency.
- Otherwise the higher no-tool DC is displayed with a compact orange information
  icon; hover explains why the higher DC is being used.
- Expands tool-proficiency detection beyond the owned Tool item's
  `system.proficient` field by inspecting common actor-level D&D5e proficiency
  collections and prepared Tool properties.


---

## 0.1.0-dev.66

Recipe card status cleanup:

- Changes the tool/DC information icon to a slightly brighter orange.
- Tooltip text is now exactly: `DC is higher without the recommended tool or proficiency.`
- Removes the top-level `Ready`, `Ready after processing`, and `Missing Materials`
  badges from recipe cards.
- Material readiness remains visible through the red/green `(available of required)`
  indicators beside each requirement.
- This keeps the header focused on recipe information and leaves a future Craft
  button to serve as the positive ready-to-craft action state.
- Recipes are now grouped visually by category such as Alchemy, Tinkering, and
  Leatherworking.
- Removes the visible recipe Type/`Processing` filter and per-card `Processing`
  label; the underlying `kind` metadata remains intact for internal logic and
  future use.
- Category headings are now visually stronger than recipe titles, use the same
  neutral accent family as Tool/Check icons, and no longer have an underline.
- Dividers appear only between category groups.


---

## 0.1.0-dev.67

Foundry Item recipe output resolution:

- Finished-item recipes can rely on a Foundry Item UUID as their authoritative
  output reference.
- Recipe browser resolves the live Item document and uses its current name/image.
- Clicking a resolved finished-item output icon opens that Item sheet.
- Optional recipe label/image values remain as compatibility fallbacks rather than
  authoritative duplicated metadata.
- Missing/broken Foundry Item UUIDs display a compact warning instead of silently
  presenting stale output information.
- This prepares Craftworks for larger SRD and premium recipe catalogs without
  duplicating Foundry Item metadata in every recipe definition.


---

## 0.1.0-dev.68

Group inventory / Character crafter separation:

- A selected Character inventory uses that same Character as the crafter.
- When a Group/Party actor is selected under Check Inventory, the Recipe browser
  exposes a separate Crafter selector containing available Character actors.
- Material readiness evaluates against the selected inventory actor.
- Tool possession, tool proficiency, applicable crafting DC, and crafting progress
  evaluate against the selected Character crafter.
- Crafter default order is controlled Character token, assigned user Character,
  then the sole available Character when only one exists.
- This lets the Party/Group actor serve as shared material storage without requiring
  tools or proficiencies to exist on the Group actor.


---

## 0.1.0-dev.69

Recipe browser toolbar layout:

- Moves Check Inventory and the optional Group-inventory Crafter selector into a
  dedicated top workflow-context row.
- Moves Search Recipes, Content Pack, and Category into a separate browsing row.
- Gives Search Recipes the largest share of horizontal space.
- Keeps the Crafter selector hidden when a Character inventory is selected.
- Adds responsive single-column behavior for narrower Recipe windows.


---

## 0.1.0-dev.70

Recipe actor-context layout refinement:

- Separates actor workflow context into its own panel above search/filter controls.
- Renames `Check Inventory` to `Using Actor Inventory`.
- Renames `Crafter` to `Using Crafter Actor`.
- The Crafter selector is now always visible.
- Character inventory selection may seed the initial crafter, but the user can
  explicitly select a different Character actor afterward.
- Material readiness continues to use Using Actor Inventory.
- Tools, proficiency, DC, crafting progress, and future crafting rolls continue
  to use Using Crafter Actor.


---

## 0.1.0-dev.71

Crafting rolls and persistent success tracking:

- Adds Craft actions to recipes whose selected inventory directly satisfies the
  material requirements and which have a selected Crafter Actor.
- The first Craft click creates the crafting job and immediately rolls its first
  crafting check.
- Active jobs switch the action label to `Roll Crafting Check`.
- Crafting checks roll in Foundry chat and compare against the actor-specific
  normal/no-tool DC already shown by the recipe card.
- Crafting roll modifiers use the recipe ability, optional skill proficiency,
  and relevant tool proficiency without stacking proficiency twice.
- Every roll records 2 hours spent; successful checks add 2 hours of progress,
  while failed checks add no progress.
- Progress is persisted in flags on the Crafter Actor and is scoped by recipe
  plus selected inventory actor.
- Recipes with total crafting time display `x of y Successes`; recipes with no
  configured total time still track successful checks and hours spent.
- Adds Reset Progress.
- This stage intentionally does not consume recipe materials or award finished
  outputs yet.


---

## 0.1.0-dev.72

Recipe crafting-time visibility:

- Restores the previously defined total crafting durations for all current
  Standard recipes.
- Recipe cards once again always show total crafting time using the compact
  clock-icon format: `clock icon + N hours`.
- Total crafting time remains separate from the internal 2-hour-per-check rule.
- Starting a crafting job still adds the separate success/time-spent tracker;
  it does not replace the recipe's total-time display.
- Required successful checks continue to derive from the recipe's total
  `hoursRequired` value.


---

## 0.1.0-dev.73

Crafting-duration validation and progress-display fix:

- Recipe total crafting time must now be a positive multiple of 2 hours.
- `craftingSuccessesRequired` now uses exact 2-hour intervals rather than ceiling
  odd durations.
- Corrects Concentrate Primal Essence from 1 hour to 2 hours so all current
  Standard recipes comply with the rule.
- Adds registry validation so future packaged/homebrew recipe data cannot silently
  define 1-, 3-, 5-hour, etc. crafting durations.
- CraftingJobService now maintains a synchronized in-memory job cache in addition
  to persistent Crafter Actor flags so a roll result is immediately visible on
  the same Recipe-browser render cycle.
- Crafting progress is now a dedicated visible row showing:
  `x of y Successes · progress hours · total hours spent`.
- Progress remains persistent across closing/reopening the browser because Actor
  flags remain the durable storage source.


---

## 0.1.0-dev.74

Multi-check recipe test case:

- Updates `Refine Primal Essence` to require 4 total crafting hours.
- This recipe now requires 2 successful crafting checks because each successful
  check contributes 2 hours of progress.
- Other current Standard processing recipes remain at 2 hours for quick
  single-check testing.


---

## 0.1.0-dev.75

Crafter-owned crafting progress:

- Crafting progress is now keyed by Crafter Actor + Recipe only.
- The selected material inventory actor is no longer part of the crafting-job
  identity.
- Switching between a Character inventory and Group/Party inventory therefore
  keeps the same crafting progress for that crafter and recipe.
- The current inventory actor remains stored as job context so Craftworks knows
  where materials are being sourced from.
- Adds compatibility migration for dev.71-dev.74 jobs that were previously keyed
  as `recipeId::inventoryActorUuid`.
- Legacy per-inventory job keys are normalized to the new recipe-only key the
  next time the job is used.


---

## 0.1.0-dev.76

Complete crafting lifecycle:

- Starting Craft now resolves a concrete valid material-consumption plan.
- If more than one complete OR path is valid, the player is prompted to choose
  which material path to spend.
- Recipe materials are consumed exactly once when the crafting job begins.
- Subsequent failed checks spend only time and do not consume additional materials.
- Active jobs remain rollable after their input materials have been removed from
  inventory.
- The material/output inventory used when crafting begins is stored on the job,
  while persistent progress remains owned by Crafter Actor + Recipe.
- Cancel Crafting refunds the materials consumed at job start.
- Reaching the required successful checks automatically awards the recipe output
  to the job's inventory actor.
- Supports both Craftworks material outputs and live Foundry Item UUID outputs.
- Completed jobs display `Crafting Complete`; `Craft Again` is available when
  another valid set of requirements is present.
- Legacy pre-consumption test progress is safely cleared the first time it is
  encountered so it cannot produce an unfunded finished item.


---

## 0.1.0-dev.77

Standard catalog population:

- Replaces the small Standard recipe test seed with the full table-driven crafting catalog extracted from Kibbles’ Compendium of Craft and Creation v1.1.3.
- Adds 399 recipes across 21 crafting branches, including the minor-branch example recipes on pages 303-305.
- Expands Standard materials to 109 canonical purchasable/trackable materials, including typed reagent and essence variants used by the recipes.
- Adds named-item recipe requirements so recipes can require existing crafted/equipment items without misclassifying every finished item as a Craftworks material.
- Adds `catalog-item` recipe outputs so table recipes can award a crafted Foundry Item even when no compendium UUID is available.
- Preserves source page, source crafting time/check count, difficulty, rarity, value, and source material text as recipe metadata.
- Normalizes the source’s single 1-hour recipe to Craftworks’ required 2-hour increment; all Standard recipe durations now validate as positive multiples of 2 hours.
- Adds `ATTRIBUTION.md` and the Open Game License v1.0a text with the source copyright notice.
- Descriptive item prose and source artwork are not bundled; the catalog contains structured crafting-table data.


---

## 0.1.0-dev.78

Recipe search input fix:

- Fixes the Recipe browser search field caret jumping during typing.
- Search rendering is now debounced by 200ms instead of rerendering the entire
  recipe catalog immediately on every keypress.
- Search focus and the caret position are restored to the end of the entered
  text after the filtered catalog rerenders.
- Search render timers are cleaned up when the Recipe browser closes.


---

## 0.1.0-dev.79

Large-catalog browser workflow:

- Materials and Recipes no longer render the entire catalog when opened.
- Each browser displays the total number of records in its catalog.
- Search text and filters calculate a live prospective result count without
  rendering the matching cards.
- Counts are exact through 500 and display as `500+` above that.
- At least one narrowing criterion must be set before Search is enabled.
- Matching cards render only after clicking Search or pressing Enter in the
  text-search field.
- Changing a query filter hides stale results until Search is run again.
- Inventory/Crafter actor choices remain workflow context and do not count as
  search filters.
- Direct navigation from a recipe requirement to a specific material still
  opens that exact material immediately.


---

## 0.1.0-dev.80

Recipe ingredient and craftability filters:

- Adds Ingredient Rarity filtering based on the Craftworks materials referenced
  by each recipe's ingredient requirements.
- Adds Ingredient Tag filtering populated dynamically from tags on materials
  actually referenced by recipe ingredients.
- Adds `Only Show Craftable Recipes`.
- Craftable-only filtering evaluates the current recipe requirements against
  `Using Actor Inventory` with the existing RecipePlanner.
- The craftable-only option is disabled when no inventory actor is selected.
- Changing the inventory actor invalidates displayed results when craftable-only
  filtering is active because the prospective result set may have changed.
- All new filters participate in the live prospective record count and explicit
  Search workflow introduced for the large catalog.


---

## 0.1.0-dev.81

Standard recipe output cleanup and compendium integration:

- Removes unmatched Kibbles-specific/homebrew finished items from the effective
  Standard recipe catalog.
- Standard catalog outputs now resolve using enabled D&D5e Item compendiums.
- Exact normalized-name matching is used; punctuation, spacing, typographic
  apostrophes, and `N x Item` quantity prefixes do not prevent a match.
- When a Standard recipe output matches a Craftworks material, the recipe now
  produces that material rather than creating a generic Item.
- When a Standard recipe output matches a D&D5e compendium Item, the recipe is
  converted to a Foundry Item UUID output.
- Crafted official items therefore use the real compendium document and preserve
  the compendium image, Item type, description, activities/effects, and other
  D&D5e data.
- If a Kibbles finished-item recipe does not resolve to either a Craftworks
  material or D&D5e compendium Item, it is excluded from Standard.
- Restores the four original Craftworks processing recipes that were displaced
  by the dev.77 bulk catalog import.
- Synchronizes `standard-recipes.seed.json` with the packaged MJS source.


---

## 0.1.0-dev.82

Exact Kibbles material icon synchronization:

- Adds a Kibbles material-image resolver that scans installed Item compendiums
  associated with Kibbles/crafting content.
- Standard Craftworks materials are matched to Kibbles material Items by
  normalized material name.
- When a match exists, Craftworks uses the exact `img` path from the Kibbles
  compendium Item rather than a hand-selected approximation.
- The resolved Kibbles source Item UUID and source pack are recorded on the
  synchronized Craftworks material Item flags for traceability.
- The Standard Materials world compendium now automatically synchronizes for the
  GM during startup before MaterialRegistry indexing.
- Existing Standard material Items are updated as part of synchronization, so
  worlds created on earlier development builds receive the corrected images.
- Recipe ingredient/output icons automatically follow the synchronized material
  images because they resolve through MaterialRegistry.
- If no Kibbles crafting compendium is installed, packaged images remain as
  fallbacks and Craftworks continues to function.


---

## 0.1.0-dev.83

Static Kibbles material icon paths:

- Removes the dev.82 Kibbles runtime compendium resolver completely.
- Morelord Craftworks has no runtime dependency on the Kibbles Foundry module.
- Extracted the exact `img` values from the uploaded Kibbles
  `kccc-crafting-materials` compendium during development.
- Baked those Foundry-relative `icons/...` paths directly into
  `data/standard-materials.seed.json`.
- Matched 86 Craftworks material definitions directly or by an
  explicit display-name alias to their Kibbles compendium material image.
- 23 Craftworks material definitions are not present as Items in
  the Kibbles crafting-material compendium; their existing static fallback image
  remains unchanged.
- Adds `data/kibbles-material-icon-reference.json` as development/reference
  metadata documenting the extracted mappings; runtime code does not read it.
- Keeps automatic GM startup synchronization of the Craftworks Standard
  Materials world compendium, but synchronization now uses Craftworks' own
  static seed only.
- Existing Standard material Items therefore receive the corrected static icon
  paths without requiring Kibbles to be installed.


---

## 0.1.0-dev.84

SRD content-pack separation and catalog cleanup:

- Removes the 399 Kibbles finished-item recipe rows from `standard-core`.
- `standard-core` no longer contributes finished-item recipes.
- Creates separate SRD 5.2 and SRD 5.1 candidate recipe sets from the same
  Kibbles-authored recipe data, with unique pack-specific recipe IDs.
- SRD 5.2 recipes resolve outputs **only** against `dnd5e.equipment24`.
- SRD 5.1 recipes resolve outputs **only** against `dnd5e.items` and
  `dnd5e.tradegoods`.
- A recipe candidate is registered only when its finished output exists in its
  own exact SRD compendium set.
- Duplicate recipes across SRD generations are intentionally preserved because
  they belong to different Craftworks content packs.
- Fixes cases where an SRD 5.2 recipe could previously resolve a same-named
  output from the SRD 5.1 compendium.
- D&D5e output metadata records both `sourceBook` and `sourcePackId`.
- Prunes the shared material seed from 109 to
  94 entries by removing 15 material
  definitions not referenced anywhere in the imported Kibbles recipe data.
- No new Craftworks-only material or recipe definitions are introduced.


---

## 0.1.0-dev.85

Catalog cleanup and browser polish:

- Standard material seed now contains only exact-name Items present in Kibbles'
  `kccc-crafting-materials` compendium.
- Removed 21 remaining non-Kibbles material definitions, including
  prior imports such as Barrel and Common Reagent.
- SRD recipe candidates referencing removed/non-Kibbles materials are removed
  so recipes cannot depend on invented Craftworks materials.
- SRD 5.2 candidate rows after material validation: 371.
- SRD 5.1 candidate rows after material validation: 371.
- Recipe query controls now use responsive flex wrapping based on window width.
- Recipe and Material search fields preserve their exact caret/selection
  position across debounced rerenders.
- Recipe cards now show descriptive content-source labels instead of
  `2014 Rules` / `2024 Rules`.
- `standard-core` remains the shared material/acquisition pack while SRD packs
  own their finished-item recipe catalogs.


---

## 0.1.0-dev.86

Search/filter UX and SRD 5.2 output-name resolution:

- Fixes the remaining Recipe and Material search-field caret jump. The old
  input's blur event no longer clears restoration state while ApplicationV2 is
  replacing the rendered input.
- After the new input receives its exact saved selection/caret position, the
  restoration flag is cleared until the next typed change.
- Recipe Content Pack, Category, Ingredient Rarity, and Ingredient Tag filters
  are now checkbox-based multi-select controls.
- Material Content Pack filtering is also multi-select.
- Multiple choices inside one filter use OR semantics; filter groups combine
  with AND semantics.
- Multi-select menus stay open while selecting multiple values even though the
  live prospective result count rerenders.
- Content Pack filter lists hide packs with zero effective records.
- Adds controlled SRD output-name aliases for the 2024 parenthetical naming
  convention.
- `Potion of Greater Healing` now resolves to
  `Potion of Healing (Greater)` when that is the exact Item name in SRD 5.2.
- The same mapping is provided for Superior and Supreme Healing Potions.
- Adds narrow two-way aliases for the Giant Strength potion parenthetical
  naming family without enabling fuzzy cross-item matching.
- Output resolution remains strictly scoped to the recipe's SRD content pack;
  aliases cannot fall back from SRD 5.2 to SRD 5.1.


---

## 0.1.0-dev.87

Materials UI, spell-scroll recipe matching, and premium scroll generator:

- Materials toolbar now uses the same responsive flex alignment model as Recipes.
- Material Content Pack checkbox rows are explicitly left-aligned.
- Adds controlled spell-scroll output aliases so Kibbles scroll-scribing recipes
  can resolve SRD Items named `Spell Scroll, Cantrip`,
  `Spell Scroll, Level 1`, etc., while preserving strict SRD pack boundaries.
- Also maps Kibbles' terse scroll recipe labels such as `Cantrip` and `2nd-Level Spell` to their corresponding SRD spell-scroll Item names.
- Adds the premium Spell Scroll Generator service and ApplicationV2 UI.
- Generator selects a scroll level and builds its spell pool from spell Items in
  compendiums currently available to the world.
- Generator reports the number of available spells for the selected level and
  can select a random spell result.
- Result cards show the spell image, name, level, source compendium, and provide
  a link to open the underlying spell Item.
- Adds the dashboard/API foundation for the premium generator so later builds
  can create the actual scroll Item and integrate the same generator with loot.


### dev.87 follow-up validation

- Rebuilt Scrollscribing from the complete Kibbles Scroll Crafting Table rather
  than the incomplete alternating-row import.
- Adds all ten Kibbles scroll recipes: Cantrip plus spell levels 1 through 9.
- Scroll essence requirements use the Kibbles rule of any essence of the
  required rarity (`category: essences`) rather than a fake `Common Essence`
  Item.
- Restores Kibbles `Parchment` and `Legendary Parchment` because the complete
  scroll table actually uses them.
- Standard material synchronization now deletes obsolete material Items that
  are no longer in the canonical seed. This fixes older worlds continuing to
  display removed materials such as Barrel and Common Reagent.
- Search text no longer causes an ApplicationV2 rerender at all. Prospective
  counts and Search-button state update directly in the existing DOM, which
  eliminates cursor/caret movement structurally.
- Wires Spell Scroll Generator into the GM dashboard and public Craftworks API.
- Premium access accepts either the dedicated feature entitlement or normal
  Morelord premium access.


---

## 0.1.0-dev.88

Materials toolbar layout correction:

- Replaces the Materials toolbar's mixed label/div markup with dedicated,
  consistent field wrappers.
- Search Materials, Content Pack, and Check Inventory now share the same
  explicit label row and 40px control row.
- Search button is aligned to the control row rather than participating as an
  unmatched toolbar child.
- Fixes the actual checkbox alignment conflict caused by the legacy
  `.mcw-material-toolbar label { flex-direction: column; }` rule.
- Material Content Pack options explicitly use `flex-direction: row`,
  left-aligned checkbox + text, and fixed checkbox sizing.
- Toolbar remains responsive and wraps fields according to available window
  width.


---

## 0.1.0-dev.89

Workflow-oriented dashboard and Recipe browser layout:

- Recipe search/filter controls now appear before actor context.
- The total recipe count and prospective Search result count are moved inside
  the Search panel as its bottom status row.
- Using Actor Inventory and Using Crafter Actor are moved beneath Search.
- Adds an orange help icon beside each actor selector.
- Inventory help explains that the selected actor/group supplies and consumes
  recipe ingredients.
- Crafter help explains that the selected Character owns crafting progress and
  supplies the ability/tool/proficiency context used for crafting checks.
- Dashboard workflow is reordered to `Acquire` → `Craft` → `Tools`.
- Acquire is the first section for GMs because acquisition begins the normal
  Craftworks workflow and is expected to be used most frequently.
- Materials and Recipes now live in a dedicated `Craft` dashboard section.
- Spell Scroll Generator remains in `Tools`.
- Player dashboard behavior remains compatible: Craft/reference tools remain
  visible while GM-only acquisition/tools stay restricted.
