# Morelord Craftworks

For missing harvesting components, use Core's **Download Troubleshooting File** before **Sync with Compendiums**, then export again afterward. Updated Core exports include Craftworks content-pack configuration/access, material and recipe counts, known compendium/source availability, synchronization status, and the current client's last 10 sync attempts and 20 harvest inspections. These outcomes use fixed reason codes, contain no actor names or raw errors, and reset on reload. Older Core versions can still obtain the snapshot through `game.modules.get("morelord-craftworks").api.getDiagnostics()`.

Downtime recipe research uses `api.downtimeIntegration.getResearchComponents(actorUuid)` to list personal/party monster components and `getResearchRecipes(actorUuid, componentUuid)` to search enabled Drakkenheim recipes using the Recipes browser's family and recipe-rarity filters. These methods never consume components. `isResearchAvailable()` checks content-pack access; GM-only `learnResearchRecipes(recipeIds)` marks discoveries known to all players. `openRecipes({ recipeIds, crafterActorUuid })` focuses the Recipes browser on the results; Clear all filters returns to the catalog. Crafting still requires exact ingredients.

Morelord Craftworks is a Foundry VTT module for gathering, harvesting, looting,
materials, recipes, and crafting workflows.

Craftworks separates **content packs** from the core module so campaigns can enable
only the material, recipe, harvesting, gathering, and loot content appropriate for
that world.

## User documentation

See the [GM manual](docs/gm-manual.md) and [player manual](docs/player-manual.md) for current workflows. Potion and scroll drafts support individual removal and additions through the full filtered catalog picker. Availability counts follow category and school selections. Delerium Search awards Monsters of Drakkenheim compendium items through the Recipient selector. Page sections use the bordered, shaded Morelord Core surfaces used by Downtime. Gathering, Harvest, and Delerium Search use the same Core Player Characters section format, with round portraits and highlighted selections.

Encounter Loot lists defeated creatures in full-width selection rows with a checkbox, portrait, name, and CR, following Harvest's list layout without a Harvest DC.

## Support baseline

The Recipes browser counts ingredient tags in one pass per recipe using a shared material-catalog snapshot for each refresh. Reference cards use indexed compendium output names and images; full Items are loaded when opened or crafted. World Items and compendium outputs missing display metadata still resolve on refresh. Filter counts rebuild from the current catalog, so material edits do not leave a persistent cache stale.

- Foundry Virtual Tabletop v14
- D&D5e 5.3+
- Morelord Core for Morelord Gaming account access and premium entitlements
- `socketlib` for multiplayer acquisition sessions

Foundry v13 compatibility is intentionally out of scope.

## Standard features

Current Standard functionality includes:

- GM-initiated Harvesting
- GM-initiated Gathering
- Encounter Loot
- Treasure Hoards
- Craftworks material Items stored in normal actor inventories
- searchable Materials browser
- searchable Recipes browser grouped by crafting category
- the Recipe browser selects a crafter for marking goals; the Craft workspace selects the crafter and ingredient inventory
- large Materials and Recipes catalogs use live search and include/exclude filters
- browsers count the full matching catalog while limiting rendered cards
- Recipe browser filters include knowledge, Content Pack, Category, Preferred Artisan Tool, and rarity
- recipe reference details including tools, recipe DCs, and crafting-hour requirements
- Craftworks-wide crafting attempts representing 2 hours of work each
- failed crafting checks consume time but do not consume recipe materials
- direct navigation between recipe ingredients/outputs and the Materials browser
- Foundry Item recipe outputs resolve their live Item name/icon from UUID and can open the Item sheet directly
- recipe inventory readiness
- selected-inventory awareness for required tool possession and tool proficiency
- Group/Party actors can supply recipe materials while a separate Character actor supplies tools, proficiency, and checks
- crafting progress belongs to the Crafter Actor + Recipe and does not split when the material inventory source changes
- recipe cards keep tool requirements informational rather than coloring them as pass/fail state
- recipe cards display total crafting duration with a clock icon (`N hours`) as core recipe information
- recipe total crafting durations must be positive multiples of 2 hours
- missing tool possession or proficiency imposes disadvantage at the recipe DC
- compact tool requirement hints explain missing possession or proficiency
- recipe readiness is communicated by per-requirement red/green inventory counts rather than redundant Ready/Missing Materials header badges
- recursive processing planning
- campaign-specific Content Pack enable/disable controls
- Party/Group actor acquisition recipient support
- Morelord Marketplace material integration boundary

Actual crafting execution is reserved for Craftworks Premium.

## Content Packs

Content Packs can contribute:

- materials
- recipes
- Harvest profiles
- Gathering profiles
- Encounter Loot material tiers
- Encounter Loot economy profiles
- premium crafting content

The GM controls active packs from **Configure Craftworks → Content Packs**.

Premium pack availability is determined through Morelord Core. An inactive or
unentitled Content Pack contributes no runtime Craftworks content.

### Monsters of Drakkenheim setup requirement

Access to the **Monsters of Drakkenheim** Craftworks Content Pack does not install
the official Foundry module or its Actors. To give players the ability to harvest
Drakkenheim monster material components, the GM must:

1. Install and enable the **Monsters of Drakkenheim** module (`drakkenheim-monsters`).
2. Enable the **Monsters of Drakkenheim** Craftworks Content Pack.
3. Use creatures whose biographies contain a **Harvestable Components** section,
   either directly or through an embedded journal page. Craftworks reads the
   creature's biography first and uses its listed Drakkenheim components and rarity.
   If no section is present, it checks the matching official **Monsters** compendium
   Actor before falling back to standard harvesting. Imported or renamed creatures
   with harvesting data in their biographies do not need a compendium match.

Standard content is shown without an extra source badge in reference browsers.
Premium content uses a compact **Premium** badge to keep recipe/material displays
from becoming unnecessarily busy.

See [`data/packs/README.md`](data/packs/README.md) for the developer-facing Content
Pack format and precedence rules.

## Material identity

Canonical Craftworks material Items use `flags.morelord-craftworks`, including:

- `materialId`
- `packId`
- `sourceUuid`
- `tags`
- `rarity`
- `category`
- `stage`
- `purchasable`
- `schemaVersion`

Materials are normal D&D5e `loot` Items with normal quantity and price fields.

## Morelord Marketplace boundary

Craftworks defines and acquires materials. It does not provide buying or selling
workflows.

Morelord Marketplace can inspect Craftworks Items through:

```js
MorelordCraftworks.marketplaceIntegration.isCraftworksItem(item)
MorelordCraftworks.marketplaceIntegration.isPurchasable(item)
MorelordCraftworks.marketplaceIntegration.getMaterialId(item)
```

## Public module entry points

```js
MorelordCraftworks.open()
MorelordCraftworks.openMaterials()
MorelordCraftworks.openRecipes()
```

Normal users should use the **Morelord Craftworks** Foundry scene-control button
rather than the console.

## Development material seed

During development, the Standard material seed can be synchronized into the
temporary world compendium with:

```js
await MorelordCraftworks.dev.installStandardMaterials();
```

The permanent packaged Content Pack format is the intended production model.


### Recipe requirement logic

Recipe requirements support three levels of logic:

- top-level requirement groups are **OR** choices
- requirements inside a group are **AND** requirements
- a requirement may contain ingredient alternatives joined by **OR**

For example:

`Hide ×1 AND (Stick ×2 OR Pole ×1)`

**OR**

`Rawhide ×5 AND Pole ×4`

This allows one recipe/output to represent materially different valid crafting
paths without creating duplicate recipes for the same output.

### Crafting lifecycle

The following lifecycle describes Standard recipes. Monsters of Drakkenheim recipes complete without rolls or tracked hours once their materials and Workshop requirements are met.

When the selected inventory satisfies a recipe and a Crafter Actor is selected,
the Recipe browser exposes a Craft action.

- starting a job chooses a complete valid material path
- if multiple valid OR paths are available, the player chooses which materials to use
- recipe materials are consumed once when crafting begins
- the first Craft click then rolls the first crafting check
- later clicks roll additional crafting checks without consuming more materials
- rolls are posted to Foundry chat
- the selected Crafter Actor supplies the check modifier, tool proficiency, DC, and persistent progress
- every attempt represents 2 hours spent
- a success adds one successful check / 2 hours of progress
- a failure adds time spent but no crafting progress and loses no additional materials
- crafting progress is persisted on the Crafter Actor and keyed by recipe
- changing the displayed material inventory does not create a separate progress track
- players automatically combine their character and member Group inventories; GMs retain explicit inventory selection
- consumed ingredients retain their origin so cancellation returns them to the correct inventories
- Cancel Crafting refunds the materials consumed at job start to their original inventories
- when the required successes are reached, Craftworks automatically awards the recipe output
- Craftworks material outputs and Foundry Item UUID outputs are both supported
- Standard finished-item recipes must resolve to real D&D5e compendium Items; unmatched Kibbles-specific/homebrew finished items are excluded
- official recipe outputs use the real compendium Item document, preserving its Foundry image and system data
- completed jobs remain visible as Crafting Complete and can be started again when another valid set of materials is available

Recipes display persistent progress such as
`1 of 4 Successes · 2 of 8 hours progress · 2 hours spent`.
Because every crafting check represents 2 hours, recipe total crafting times
must be defined in 2-hour increments.

## Crafting time model

Craftworks uses a common timing model for recipe execution:

- recipes display their **total crafting time**
- internally, each crafting check represents **2 hours** of work
- the total time determines how many successful checks are required
- a successful check contributes 2 hours of crafting progress
- a failed check still consumes 2 hours of character time but contributes no progress
- failed checks do not consume the recipe's materials
- once crafting is initiated, recipe UI can display progress such as `✅ 1 of 4 Successes`
- the check itself does not change when the required tool is missing
- lacking the required tool or its proficiency imposes disadvantage without changing the recipe DC
- owning a tool and being proficient with that tool are separate concepts

Recipes may define their total `hoursRequired`. Craftworks should use source-backed
values where available rather than inventing recipe durations.

## Custom recipes

GMs can create and edit standard or supported Drakkenheim recipes, select output Items and materials through the full catalog picker, define AND requirements and OR alternatives, and import/export recipe JSON. See the [GM manual](docs/gm-manual.md#create-and-manage-custom-recipes) for the current workflow. General-purpose homebrew material authoring remains future work.

## Development release history

Development-build notes are maintained in [`RELEASES.md`](RELEASES.md).


## Third-party content

Standard crafting data adapted from Kibbles’ Compendium of Craft and Creation is documented in `ATTRIBUTION.md`; applicable Open Game License terms are included in `OPEN-GAME-LICENSE-1.0a.txt`.


### Material images

Standard material definitions store static Foundry-relative `icons/...` paths.
For Kibbles-defined crafting materials, those paths are copied during development
from the corresponding Kibbles crafting-material compendium Items. Craftworks
does not query, require, or depend on the Kibbles Foundry module at runtime.

The Standard Materials world compendium is synchronized from Craftworks' own
static seed so existing worlds receive corrected icon paths after module updates.


### Standard D&D content packs

The Standard subscription separates D&D SRD recipe content by rules generation:

- **SRD 5.2** contains only Kibbles-defined recipes whose finished output resolves
  in the D&D5e `dnd5e.equipment24` compendium.
- **SRD 5.1** contains only Kibbles-defined recipes whose finished output resolves
  in the D&D5e `dnd5e.items` or `dnd5e.tradegoods` compendiums.
- The two recipe sets intentionally remain separate and may contain equivalent
  recipes, such as healing potions.
- A recipe output is never resolved across SRD generations. Disabling SRD 5.1
  prevents SRD 5.1 recipe definitions and Item UUIDs from participating.
- `standard-core` provides the shared Kibbles-defined material vocabulary and
  acquisition/reference infrastructure but does not contribute finished-item recipes.
- The Standard material seed contains only material identifiers actually referenced
  by the imported Kibbles recipe data.


### Shared materials and recipe source labels

`standard-core` remains the shared Craftworks content pack for the exact Kibbles
crafting material vocabulary plus harvesting, gathering, encounter loot, and
hoard infrastructure. SRD 5.2 and SRD 5.1 own their finished-item recipe catalogs.

Recipe cards display descriptive source labels such as `SRD 5.2`, `SRD 5.1`,
`Player's Handbook`, and `Monsters of Drakkenheim` rather than rules-year labels.


### Catalog query filters

Recipe and material catalog facets cycle through neutral, include, and exclude states. Included values within a group use OR semantics; separate groups combine with AND semantics. Search text and source facets apply to the full enabled catalog.


### Spell Scroll Generator

Spell Scroll Generator is a premium GM utility. It builds the available spell
pool from spell Items in compendiums currently available to the world, filters
by scroll level, and can generate a random spell result. The utility is exposed
through the Craftworks API/dashboard foundation for future scroll creation and
loot integration.


### D&D5e source filtering

Randomized compendium-backed features respect the D&D5e system's
`Configure Sources` selection. Craftworks treats a compendium as available
unless D&D5e's `packSourceConfiguration` setting explicitly disables it.

This source filter applies to Spell Scroll Generator, Encounter Loot special
treasure, and Hoard special treasure. Recipe catalogs intentionally use
Craftworks Content Pack settings instead and do not follow D&D5e's source filter.

### Hoard chat and special treasure

Generated Hoards can be sent to chat as a formatted Craftworks card. Special
treasure results resolve to actual Item documents. When a RollTable produces a
plain-text item name, Craftworks attempts to resolve that name against enabled
Item compendiums before awarding the result.

### Generated spell scrolls

The premium Spell Scroll Generator can create and award an Item based on the
official enabled spell-scroll template for the chosen level. The generated Item
keeps the official scroll mechanics/image and records the selected spell in its
name, description, and Craftworks flags.


### Randomized Item source resolution

For randomized treasure and generated scrolls, Craftworks uses the D&D5e
system's Configure Sources setting, not Craftworks Content Pack settings.

Treasure-table document links are treated as references to an item concept. If
a table points at an Item in a disabled source, Craftworks uses that Item's name
and searches the currently enabled D&D5e Item compendiums for an equivalent
Item. This supports worlds that disable the built-in SRD packs while using
official PHB/DMG or other sourcebook compendiums.


Hoard chat cards use native Foundry UUID content links for resolved Material and
Special Treasure Items. The displayed names therefore open the actual Item
documents used by Craftworks rather than acting as plain text labels.


### Randomized compendium priority

When more than one enabled compendium contains the same randomized Item or
Spell, Craftworks prefers enabled non-SRD sourcebooks first. SRD sources are
fallbacks, ordered newest to oldest: SRD 5.2 before SRD 5.1, followed by any
older or unrecognized SRD source.

### Recipe discovery visibility

Recipes are visible by default. GMs can hide or show individual recipes from
the Recipe browser and can bulk Hide All or Unhide All. Hidden recipes remain
available to the GM for management and existing crafting jobs, but are omitted
from normal player recipe browsing. Recipe visibility is world-persistent and
independent of Content Pack enablement.


### Catalog auto-display threshold

Materials and Recipes continue to support explicit Search for large catalogs.
When the current filter/search scope contains 50 or fewer records, Craftworks
displays those records immediately while retaining all active filters.

### Multi-select behavior

Craftworks multi-select filters close when the user clicks outside them. Only
the selector explicitly being edited is preserved across the rerender required
to update its checkbox state.

Materials supports Content Pack, Rarity, and Tag multi-select filters.

### Randomized Item source labels

Generated spell-scroll results and Special Treasure results include the
descriptive label of the resolved D&D5e source compendium, such as Player's
Handbook, Dungeon Master's Guide, SRD 5.2, or SRD 5.1.


### Native D&D5e crafting roll dialog

Crafting checks use the D&D5e system's native D20 roll pipeline when running on
D&D5e. Craftworks invokes the appropriate native skill, tool, or ability check,
which presents D&D5e's standard roll configuration dialog before the roll.

This allows one-off Normal/Advantage/Disadvantage selection and situational
bonus formulas while preserving actor-specific D&D5e bonuses, effects, skill
proficiency, and tool proficiency. Craftworks then reads the completed native
roll total and compares it with the recipe DC.

Closing the D&D5e roll dialog does not count as a failed crafting attempt.


### Craft workspace

Materials and Recipes are reference tools. Recipes do not execute crafting.
A character can mark recipes for crafting, and those marked recipes appear in
the dedicated Craft workspace without search controls.

Marked recipes are persisted on the crafter Actor. Craft uses the current
character context: a controlled character token first, then the user's assigned
Character, then the user's single owned Character when unambiguous.

Craft has one inventory selector for the Actor or Group supplying ingredients.
Marked recipes are grouped into collapsible In Process, Craftable, and Not
Craftable sections. Crafting progress remains tied to Crafter + Recipe.

A session-only Craft log is held in the Craft application instance. It survives
closing/reopening the Craft window during the current Foundry client session and
resets when the client reloads.

Successful crafting opens a completion window using the actual output Item from
its source compendium. The player chooses the output destination after success:
their own crafter inventory, or the configured Party Group inventory when a
valid Group recipient exists.


### Native D&D5e skill-check configuration

Player-facing Craftworks skill checks use the D&D5e system's native skill-roll
configuration dialog. This includes Harvesting and Gathering as well as any
other workflow routed through the D&D5e adapter's `rollSkill()` method.

The native dialog is intentionally not fast-forwarded, allowing the player to
choose Normal, Advantage, or Disadvantage and enter a situational bonus before
rolling. Closing the dialog does not consume or record an acquisition attempt.

## Installation

After the first GitHub release is published, install Morelord Craftworks in Foundry using this permanent manifest URL:

```text
https://raw.githubusercontent.com/tmoreland72/morelord-craftworks/main/module.json
```

## Release workflow

Morelord Craftworks uses the standard Morelord Foundry module release workflow shared with Morelord Marketplace, Morelord Journeys, and Morelord Encounters.

Project-specific release settings are stored in `release.config.json`. Local website publishing credentials belong in `.env`:

```text
RELEASE_PUBLISH_TOKEN=your-token-here
```

Release notes use the standard filename format `RELEASE-NOTES-0.1.0.md`.

Validate a release without modifying GitHub or the website:

```powershell
.\release.ps1 -Version 0.1.0 -DryRun
```

Publish the release:

```powershell
.\release.ps1 -Version 0.1.0
```

Crafting facility requirements are configured per artisan tool in module Settings. Recipe cards show the resulting requirement, with the crafted item’s rarity as the minimum facility tier; higher tiers qualify. The recipe DC and all recipe filter counts are visible. The recipe editor begins with Item to Be Crafted and supports mandatory AND groups containing OR material choices. Offline Harvest and Gather characters can be played by the GM. Potion and scroll draft quantities default to one and may be edited before sharing or awarding.

### Shared UI and current crafting rules

Craftworks consumes Core's page and nested-scroll preservation along with its shared surfaces, typography, and controls. Standard recipes use two-hour attempts at the recipe DC; missing tool possession or proficiency imposes disadvantage. Monsters of Drakkenheim recipes instead complete without rolls or tracked hours when their materials and equal-or-higher Workshop requirements are met. The Workshop requirement is independent of artisan-tool facility settings.
### Release documentation check

Production releases require the `docs` directory in the archive. Before releasing, update the manuals and set `docs/README.md` frontmatter to the target version; the shared release script rejects a missing or mismatched documentation landing page. Review all manuals as part of each code change, including behavior and compatibility requirements.


Character choices for crafting, gathering, harvesting, delerium search, and item delivery use Core’s shared player-owned-or-party eligibility. Existing ownership checks and Group inventory access still apply.


Settings use Morelord Core’s shared headers, sections, content cards, settings rows, and footer. Descriptions remain beside checkboxes at narrow widths.

D&D5e Configure Sources filtering is provided by Core’s shared `Dnd5eSourceFilterService`, including canonical SRD exclusions for copied documents. Craftworks preserves its existing source and priority behavior while Marketplace and Downtime use the same shared rules.

## Optional usage and error reports

When a compatible Morelord Core is active, its explicit reporting choices can share fixed feature events and sanitized error code locations without connecting a Morelord account. Reporting is disabled in Developer Mode. No campaign content or account credentials are sent; a random world ID measures repeat use. See [Core reporting documentation](../morelord-core/TELEMETRY.md) for this module's event coverage and limitations. Existing Core versions continue to work without this optional reporting API. Website ingestion must be deployed before releasing these changes.

Encounter Stories can open Hoard with a selected starting profile via `game.modules.get("morelord-craftworks").api.openHoard({ profileId: "5-10" })`. Existing calls without options still start at Challenge 0–4; unknown profile IDs use that default. This only opens the normal interface: the GM must generate, review, and award explicitly.


### Game Master chat integration

Morelord Game Master can reuse the Delerium Search service with chat-card requests instead of player windows. It sets `session.messageMode` to `blind`, which the existing reward service now forwards to quantity rolls and the award card. Sessions without this optional property keep their existing visibility. Search rules, source items, and reward calculations are unchanged.

## Release dependency

This release requires Morelord Core 0.3.10 or newer for the shared UI and service updates. Optional integrations remain optional.
