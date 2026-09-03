---
title: Morelord Craftworks Player Manual
description: Browse materials and recipes, manage crafting projects, and participate in Craftworks acquisition sessions.
slug: morelord-craftworks/player
product: morelord-craftworks
audience: player
version: 0.4.4
foundry: 14
---

# Morelord Craftworks Player Manual

Morelord Craftworks lets you browse your campaign's materials and recipes, plan crafting projects, work from personal or shared inventories, and take part in Harvest and Gather sessions started by your Game Master.

This manual applies to Morelord Craftworks 0.4.4.

## Contents

- [Before you begin](#before-you-begin)
- [Open Craftworks](#open-craftworks)
- [Browse materials](#browse-materials)
- [Browse and learn recipes](#browse-and-learn-recipes)
- [Plan and complete crafting](#plan-and-complete-crafting)
- [Participate in Harvest](#participate-in-harvest)
- [Participate in Gather](#participate-in-gather)
- [Understand awards and storage](#understand-awards-and-storage)
- [Optional Drakkenheim content](#optional-drakkenheim-content)
- [Troubleshooting](#troubleshooting)

## Before you begin

You normally need a character assigned to your Foundry user or an owned character token on the scene. Your GM controls the available Content Packs, recipe knowledge, acquisition settings, and whether acquired materials go to individual characters or a shared party Group actor.

Materials are normal dnd5e loot Items. Their Craftworks identity includes information such as rarity, category, processing stage, tags, and source pack, so a recipe may require more than an item with a similar name.

## Open Craftworks

1. Open **Token Controls** on the left side of the scene.
2. Select the **Morelord Craftworks** control.
3. Choose **Materials**, **Recipes**, or **Craft** from the dashboard.

Harvest and Gather windows open automatically when the GM starts a session in which your character can participate. Use **Documentation** at the top of the dashboard for the current in-Foundry guide.

![The Craftworks dashboard gives players direct access to Materials, Recipes, and Craft.](assets/craftworks-dashboard.png)

## Browse materials

Open **Materials** to search the complete active material catalog. A material card can show its name, image, rarity, category, processing stage, value, acquisition methods, tags, and recipes that use it.

### Search and filters

Enter part of a name in Search or use facets such as Content Pack, rarity, category, stage, and material tag. Each facet cycles through three states:

| Symbol | State | Meaning |
| --- | --- | --- |
| Empty circle | Any | Do not filter on this value. |
| Plus | Include | Require this value. |
| Minus | Exclude | Hide results with this value. |

You can include several useful values while excluding unwanted families. Counts update against the complete catalog as you adjust the context. For responsiveness, Craftworks initially displays up to 300 matching cards even when the total is larger.

Use links between Materials and Recipes to move from an ingredient to recipes that use it or from a recipe requirement back to relevant materials.

![The Materials browser combines full-catalog search, tri-state filters, and material details.](assets/materials-browser-overview.png)

## Browse and learn recipes

Open **Recipes** to search available projects. Recipe cards can show the output, total crafting duration, required materials, tools, checks, normal and no-tool DCs, and whether your selected inventory currently satisfies each requirement.

### Known and Unknown recipes

- **Known** recipes display their ingredient requirements and can begin a new crafting job.
- **Unknown** recipes remain searchable and can be marked as goals, but their ingredients are concealed until the GM marks them Known.

Recipe rarity describes the public recipe or output rarity. It remains visible for an Unknown recipe and does not reveal its ingredient rarity.

### Find recipes you can make

The Recipes browser can filter by Content Pack, category, recipe rarity, ingredient rarity, ingredient material tag, knowledge, and inventory craftability. Enable **Only Show Craftable Recipes** to compare requirements with the current **Using Actor Inventory**.

Changing a query or facet updates the prospective count and hides stale results until you run Search again where the interface requests it.

![The Recipes browser shows recipe knowledge, requirements, filters, and crafting status.](assets/recipes-browser-overview.png)

### Mark a goal

Use a recipe's crafting marker to add or remove it from your Craft list. You may mark an Unknown recipe as a future goal even though you cannot see its ingredients or start a new job yet.

## Plan and complete crafting

Open **Craft** to see recipes you marked for crafting and any active jobs. The window uses the same two-panel search-and-filter pattern as the reference browsers.

### Choose the crafter and inventory

- **Using Crafter Actor** is the character doing the work. This actor supplies tool possession, tool proficiency, and check data.
- **Using Actor Inventory** supplies the ingredients and receives the finished output for that job.

These can be different. For example, your character can make the checks while the party's Group actor supplies shared materials. Changing inventory does not create a separate progress record; progress belongs to the crafter and recipe.

### Read requirement status

Each ingredient row shows the amount available and required. Green counts satisfy a requirement; red counts do not. Requirements can identify:

- an exact Craftworks material
- a rarity, category, or processing stage
- one or more material tags
- alternative ingredients
- several units that must come from one matching material

Tool information is shown separately. Craftworks uses the crafter's actual tool possession and proficiency to select the normal DC or the higher no-tool DC.

### Make progress

Each crafting attempt represents two hours of work. A successful attempt adds progress. A failed check spends the two hours but does not consume recipe materials. Some recipes define no check and advance through their own supported workflow.

Progress persists between attempts. Recipe cards display the total duration, and the active job records successful progress and total time spent.

Some recipes require a facility supplied by the current Morelord Core Location, such as a forge. A project pauses while that environment is unavailable and resumes when the requirement is met. Crafting projects can also appear in Morelord Downtime and open directly into a focused Craftworks recipe view.

When the job completes, the output is delivered to the selected inventory actor. Foundry Item outputs use their live name and image and can be opened from their linked reference.

If you cancel an active job, Craftworks returns materials consumed when that job began.

Actual crafting execution requires the appropriate premium access. Standard users can still browse, evaluate requirements, mark goals, and review the Craft window.

![The Craft workspace brings selected goals, actor context, requirements, and progress together.](assets/craft-workspace.png)

## Participate in Harvest

Harvest begins when the GM selects defeated creatures and starts a synchronized session.

### Roll against the creatures

1. Wait for the Harvest window to open.
2. Choose an available Harvest skill.
3. Select **Roll Harvest Checks**.
4. Craftworks rolls that skill separately against every unresolved creature available to your character.

Each creature uses its own Harvest DC. A success reveals claimable components; a failure consumes your character's attempt for that creature. Previously attempted or resolved creatures are not rolled again.

The GM chooses the characters included in the Harvest and may enable the session-wide **Skip Skill Checks** option. When enabled, every included character proceeds directly to the available choices. If you control multiple included characters, Craftworks opens an independently titled Harvest window for each one; their checks and claims remain separate.

![The player Harvest window presents the available skill choices and each unresolved creature.](assets/harvest-player-ready.png)

### Claim a component

Select one of the highlighted components after a success. If your natural d20 was 20 and the world setting permits it, you can receive a second claim. Claimed creatures remain expanded to keep the window from shifting during a large Harvest; you can still collapse a creature manually.

A claim is a reservation, not an immediate inventory award. All participants see it in the shared **Claimed Components** list, and another player cannot take the same reserved component. Materials connected to one of your marked recipes may display **Needed for Crafting**.

The GM must select **Finalize Harvest** before reserved items enter their resolved inventories. If the GM resets or cancels the session, unfinalized claims are discarded.

![Successful Harvest checks reveal component choices and their source creatures.](assets/harvest-player-results.png)

![A claimed component is visibly reserved while the session awaits GM finalization.](assets/harvest-player-claimed.png)

![Finalization posts the delivered Harvest materials as linked chat results.](assets/harvest-award-chat-card.png)

## Participate in Gather

Gather is an individual opportunity tied to the current scene and its terrain.

1. Wait for the GM to start Gather.
2. Review the terrain and displayed DC.
3. Choose an allowed Gathering skill.
4. Make the configured dnd5e roll, or decline the opportunity.
5. On a success, Craftworks awards an appropriate material from the active terrain content.

An attempt is tracked for your character on that scene, so closing and reopening the application does not provide another roll. Your GM can reset the scene's Gather state when a new opportunity is appropriate.

![The player Gather window shows the terrain, DC, available skills, and decline option.](assets/gather-player-ready.png)

![Gather uses the normal dnd5e roll-configuration dialog for the selected skill.](assets/gather-player-roll-configuration.png)

![A successful Gather attempt displays the resulting material and outcome.](assets/gather-player-success.png)

## Understand awards and storage

Your GM can configure acquired Craftworks materials to go directly to participating characters or to a shared dnd5e Group actor. Loot and Hoard awards also let the GM choose a player character or Group actor as recipient.

When Craftworks commits an award, it posts a consolidated public chat card. The card can include the recipient, linked item names, images, rarities, quantities, and currency. Select a linked item to inspect its document.

Harvest is different while it is in progress: a component appears on the final award card only after the GM finalizes the session.

![Craftworks award cards summarize delivered items for the recipient.](assets/hoard-award-chat-card.png)

## Optional Drakkenheim content

Your campaign may enable the exceptional **Monsters of Drakkenheim** Content Pack. It is additional content rather than a requirement for using Craftworks.

When available, you may encounter:

- Drakkenheim material families and rarities in the Materials browser
- recipes using setting-specific components
- creature-specific Harvest choices drawn from official Harvestable Components data
- special harvesting instructions presented by the GM

![Drakkenheim materials appear as optional, setting-specific families within the normal Materials browser.](assets/materials-drakkenheim-families.png)

![Drakkenheim recipes use the same recipe cards, knowledge rules, and crafting workflow as other content.](assets/recipes-drakkenheim.png)

The normal Craftworks controls do not change. You still search with the same filters, mark recipes in the same way, make Harvest checks against individual creatures, reserve components, and receive them when the GM finalizes the session.

If the pack or its official source content is unavailable, Craftworks can use standard Harvest results where possible. Ask the GM about content access when you expected a setting-specific component but received the standard experience.

## Troubleshooting

### Craftworks does not show my character

- Select a token for a character you own.
- Ask the GM to assign your Foundry user a character.
- Ask the GM to verify your Owner permission.

### A material or recipe is missing

- Clear Search and active filters.
- Ask the GM whether the relevant Content Pack is enabled.
- Ask the GM to confirm the required official source is installed and selected in dnd5e **Configure Sources**.
- Ask the GM to run **Sync with Compendiums**.

### A recipe is Unknown

Unknown recipes intentionally conceal ingredients. You can mark one as a goal, but the GM must mark it Known before you can inspect its requirements or start a new job.

### Craft says an ingredient is missing

Confirm the correct **Using Actor Inventory** is selected. A visually similar Item may not match the required canonical material, rarity, category, stage, tags, quantity, or same-material rule.

### The no-tool DC is being used

The **Using Crafter Actor** must possess the required tool and have the necessary proficiency. Items stored only in the selected inventory actor do not replace the crafter's own tool context.

### My Harvest claim is not in inventory

This is expected until the GM selects **Finalize Harvest**. Claims only reserve components during the live session.

### Gather says this character already attempted

Gather opportunities are tracked per character and scene. The GM must reset the scene's Gather state before the character can try again.

## Getting help

Ask your GM first about enabled content, recipe knowledge, shared storage, and acquisition settings. Reproducible module problems can be reported at [Morelord Craftworks Issues](https://github.com/tmoreland72/morelord-craftworks/issues).
