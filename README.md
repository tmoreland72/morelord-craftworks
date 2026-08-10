# Morelord Craftworks

Morelord Craftworks is a Foundry VTT module for gathering, harvesting, looting,
materials, recipes, and crafting workflows.

Craftworks separates **content packs** from the core module so campaigns can enable
only the material, recipe, harvesting, gathering, and loot content appropriate for
that world.

## Support baseline

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
- recipe workflow context (inventory/crafter) is presented in its own panel above browsing controls
- large Materials and Recipes catalogs use an explicit filter-and-search workflow rather than rendering every record
- browsers show total catalog size plus a live prospective result count, capped visually at `500+`
- Recipe browser filters include Content Pack, Category, ingredient rarity, ingredient material tag, and current-inventory craftability
- `Only Show Craftable Recipes` evaluates requirements against the selected Using Actor Inventory
- changing a query filter hides stale results until Search is run again
- Using Crafter Actor is always visible and may differ from the selected inventory actor
- recipe reference details including tools, checks, normal/no-tool DCs, and crafting-hour requirements
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
- automatic normal/no-tool DC selection based on confirmed tool possession and proficiency
- higher no-tool DCs use a compact warning tooltip rather than duplicating status text
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
- the inventory actor used when the job began remains the material/output destination for that job
- Cancel Crafting refunds the materials consumed at job start
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
- lacking the required tool increases the recipe DC; the default increase is **+5**
- owning a tool and being proficient with that tool are separate concepts

Recipes may define their total `hoursRequired`. Craftworks should use source-backed
values where available rather than inventing recipe durations.

## Future development

### GM homebrew content

Homebrew authoring is planned as a **Standard/free** Craftworks feature.

The intended model is a world-specific **Homebrew** Content Pack that is always
available to the GM and is not premium-gated.

Planned homebrew material support includes:

- creating and editing Craftworks materials/components
- name, image, rarity, category, processing stage, and tags
- normal D&D5e value and Craftworks purchasable metadata
- acquisition configuration for Harvesting, Gathering, and Encounter Loot
- use in normal Craftworks recipe matching and inventory workflows

Planned homebrew recipe support includes:

- exact material requirements
- tag/category/rarity/stage matching
- quantities and `sameMaterial` requirements
- multiple required ingredients
- alternative ingredient requirements
- processing recipes that output another Craftworks material
- finished recipes that output an existing Foundry Item
- normal Recipe browser visibility with a clear Homebrew source label

Homebrew definitions should eventually support JSON import/export so GMs can move
custom Craftworks content between worlds and share community content packs.

The same data model used by homebrew authoring should remain compatible with
Morelord-authored Content Packs so recipe/material definitions do not require
separate runtime systems.

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

Recipe catalog filters are checkbox-based multi-select controls. Selecting more
than one value within a filter uses OR semantics within that filter, while
different filter groups are combined with AND semantics. Content Pack selectors
only list enabled packs that currently contain records.

The Material browser uses the same multi-select Content Pack behavior. Search
text keeps the user's exact caret/selection across live-count rerenders.


### Spell Scroll Generator

Spell Scroll Generator is a premium GM utility. It builds the available spell
pool from spell Items in compendiums currently available to the world, filters
by scroll level, and can generate a random spell result. The utility is exposed
through the Craftworks API/dashboard foundation for future scroll creation and
loot integration.
