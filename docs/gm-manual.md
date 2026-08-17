---
title: Morelord Craftworks Game Master Manual
description: Install, configure, and operate Morelord Craftworks acquisition, crafting, and treasure tools.
slug: morelord-craftworks/gm
product: morelord-craftworks
audience: game-master
version: 0.3.5
foundry: 14
---

# Morelord Craftworks Game Master Manual

Morelord Craftworks gives a dnd5e world a connected system for harvesting creatures, gathering by terrain, generating encounter loot and hoards, managing materials and recipes, and running long-term crafting projects.

This manual applies to Morelord Craftworks 0.3.5, Foundry VTT v14, and dnd5e 5.3 or later.

## Contents

- [Feature access](#feature-access)
- [Install and activate](#install-and-activate)
- [Open Craftworks](#open-craftworks)
- [Configure content and storage](#configure-content-and-storage)
- [Configure acquisition rules](#configure-acquisition-rules)
- [Manage materials and recipes](#manage-materials-and-recipes)
- [Run Harvest](#run-harvest)
- [Run Gather](#run-gather)
- [Generate encounter loot](#generate-encounter-loot)
- [Generate a treasure hoard](#generate-a-treasure-hoard)
- [Use the item generators](#use-the-item-generators)
- [Exceptional content: Monsters of Drakkenheim](#exceptional-content-monsters-of-drakkenheim)
- [Troubleshooting](#troubleshooting)

## Feature access

| Feature | Standard | Corresponding premium access |
| --- | :---: | :---: |
| Craftworks Standard materials | Yes | Yes |
| SRD 5.2 content when available | Yes | Yes |
| Materials and Recipes browsers | Yes | Yes |
| Harvest, Gather, Loot, and Hoard | Yes | Yes |
| Recipe planning and progress display | Yes | Yes |
| Complete crafting execution | No | Yes |
| Premium content packs | No | Yes |

Premium access is managed by Morelord Core. A content pack may also depend on official Foundry content installed in the world. Enabling a pack does not grant access to a source product.

## Install and activate

### Requirements

- Foundry Virtual Tabletop v14
- dnd5e 5.3 or later
- Morelord Core 0.1.0 or later
- SocketLib 1.1.3 or later
- Morelord Craftworks 0.3.5 or later

### Install with the manifest

1. On Foundry's Setup screen, open **Add-on Modules**.
2. Select **Install Module**.
3. Paste this manifest URL into **Manifest URL**:

   `https://raw.githubusercontent.com/tmoreland72/morelord-craftworks/main/module.json`

4. Install the module.
5. Open the intended world and choose **Manage Modules**.
6. Enable **SocketLib**, **Morelord Core**, and **Morelord Craftworks**.
7. Save the module configuration and reload when prompted.

## Open Craftworks

Open **Token Controls** on the left side of a scene and select the **Morelord Craftworks** control. The dashboard groups its tools into three areas:

| Area | Tools |
| --- | --- |
| **Acquire** | Harvest, Gather, Loot, Hoard |
| **Craft** | Materials, Recipes, Craft |
| **Tools** | Potion Generator, Spell Scroll Generator, Spellbook Generator |

Acquisition and generator tools are GM-operated. Players can use the reference and crafting tools available to them and receive interactive Harvest or Gather windows when the GM starts a session.

![The Morelord Craftworks dashboard groups acquisition, crafting, and generator tools.](assets/craftworks-dashboard.png)

## Configure content and storage

Open **Game Settings → Configure Settings → Module Settings → Morelord Craftworks**, then select **Configure Craftworks**.

![Craftworks settings show account access, content packs, synchronization, storage, and acquisition rules.](assets/craftworks-settings-overview.png)

### Account and content access

The access panel shows the Morelord Core connection, current access tier, and most recent entitlement state. Use **Manage Account** to change the connection and **Refresh** after an account or subscription change.

Craftworks Standard and SRD 5.2 are enabled automatically in a fresh world and do not require authentication. Premium packs remain unavailable until their requirements are satisfied.

### Content Packs

Enable only the packs that should contribute to the campaign. Depending on installed sources and access, the list can include:

- Craftworks Standard
- SRD 5.2
- SRD 5.1
- Player's Handbook
- Dungeon Master's Guide
- Monster Manual
- Monsters of Drakkenheim

An active pack can contribute materials, recipes, Harvest and Gather profiles, encounter-loot rules, economy profiles, and crafting definitions. Disabled or unavailable packs contribute no runtime content.

![The Monsters of Drakkenheim content pack is enabled separately from standard Craftworks content.](assets/content-pack-drakkenheim.png)

### Synchronize compendiums

Craftworks automatically synchronizes when the first active GM enters the world and a relevant content signature has changed. The signature includes Craftworks and dnd5e versions, enabled content packs, available Item compendiums, and versions of active modules that supply Item compendiums.

Select **Sync with Compendiums** after installing or updating source content, changing dnd5e's configured sources, or troubleshooting a missing material or recipe. Synchronization updates Craftworks material compendiums, refreshes external Item discovery, and rebuilds the recipe index.

Generated compendium-backed rewards respect the dnd5e **Configure Sources** selection. A disabled source is excluded when results are generated and checked again before an award is committed.

### Choose the acquisition recipient

By default, Harvest and Gather materials go to the participating character. To centralize resources:

1. Enable **Use Party Actor for Acquired Materials**.
2. Choose a dnd5e Group actor under **Party Recipient Actor**.
3. Save the configuration.

The selected Group actor becomes the default recipient for supported acquisition awards. Loot and Hoard also let the GM choose from player characters and Group actors before awarding a result.

## Configure acquisition rules

### Harvesting

| Setting | Effect |
| --- | --- |
| **DC Modifier** | Adjusts every calculated Harvest DC. |
| **Minimum Choices** | Sets the lower bound for component choices. |
| **Maximum Choices** | Sets the upper bound for component choices. |
| **Rare Result Bias (%)** | Shifts random choices toward rarer components. |
| **Natural 20 Grants Two Claims** | Gives a second claim when the active d20 is a natural 20. |

### Gathering

| Setting | Effect |
| --- | --- |
| **Global DC Modifier** | Adjusts every terrain's Gather DC. |
| **Quantity Multiplier** | Multiplies awarded material quantities. |
| **Rare Result Bias (%)** | Shifts successful results toward rarer materials. |
| **Terrain Gather DCs** | Overrides the source-pack DC for individual terrains. |

The final Gather DC is the terrain value plus the global modifier.

### Encounter Loot

The Loot settings independently enable materials, coin, and special treasure. Chance modifiers tune the frequency of each category, while material-quantity and coin multipliers adjust result sizes.

Potion and spell-scroll rewards use enabled dnd5e Item sources. In 0.3.5, material components remain the most common results and potions are more common than spell scrolls.

## Manage materials and recipes

### Browse large catalogs

Materials and Recipes use a search field and persistent filter rail. Facets cycle through three states:

| Symbol | State | Meaning |
| --- | --- | --- |
| Empty circle | Any | This value does not affect the result. |
| Plus | Include | Results must match the value. |
| Minus | Exclude | Matching results are removed. |

Search and filter totals always reflect the complete catalog. The browser initially renders up to 300 matching cards to keep very large catalogs responsive.

Materials can be filtered by source pack, rarity, category, processing stage, and material tags. Recipes add filters for recipe/output rarity and knowledge state.

![The Materials browser combines catalog totals, search, tri-state filters, and rich material cards.](assets/materials-browser-overview.png)

![Drakkenheim materials are organized into concise setting-specific families.](assets/materials-drakkenheim-families.png)

### Control recipe knowledge

Recipes are either **Known** or **Unknown**. An Unknown recipe remains discoverable and can be marked as a crafting goal, but its ingredient requirements are concealed from players and a player cannot begin a new job from it.

Use **Mark Context Known** or **Mark Context Unknown** to update only the recipes matched by the current search and filters. This makes it possible to reveal a family of recipes without changing unrelated entries.

![The Recipes browser exposes knowledge controls, filters, requirements, and crafting status.](assets/recipes-browser-overview.png)

![Drakkenheim recipes remain visibly attributed while using the normal Craftworks recipe workflow.](assets/recipes-drakkenheim.png)

### Understand crafting context

The **Using Crafter Actor** performs checks and supplies tool possession and proficiency. The **Using Actor Inventory** supplies ingredients and receives the output. These can be different actors, so a character can craft from a shared Group inventory.

Crafting progress belongs to the crafter-and-recipe combination and does not split when the inventory source changes. Each attempt represents two hours. Failed checks consume time but not recipe materials. Recipe durations must be positive multiples of two hours.

Craftworks automatically chooses the normal or no-tool DC from confirmed tool possession and proficiency. Some recipes require no check and advance through their defined workflow without inventing one.

![The Craft workspace separates filtering, crafter and inventory context, requirements, and project progress.](assets/craft-workspace.png)

## Run Harvest

Harvest is a synchronized session in which players test their characters against defeated creatures and reserve components for a final award.

### Start the session

1. Keep defeated creature tokens on the active scene.
2. Open **Craftworks → Harvest**.
3. Review the detected defeated dnd5e NPC tokens.
4. Include actual harvestable creatures and exclude shopkeepers, traps, or other defeated NPC-based tokens.
5. Use **Select All** or **Clear All** when useful.
6. Review creature type, CR, Harvest DC, rarity, components, and special instructions.
7. Optionally enable **Skip Skill Checks** for individual player characters.
8. Select **Start Harvest**.

![The GM Harvest preflight identifies defeated creatures and lets the GM include participants and bypass checks selectively.](assets/harvest-gm-preflight.png)

At least one defeated NPC must be selected. Connected players receive the Harvest application automatically.

### Monitor checks and claims

A player chooses one Harvest skill and uses **Roll Harvest Checks**. Craftworks rolls that skill separately against every unresolved creature available to the character. Success exposes component choices; failure consumes that character's attempt for that creature.

A claim reserves a component but does not add it to inventory. All open Harvest windows synchronize reservations, claimants, source creatures, and roll results. Other players cannot reserve the same component.

![The GM view tracks every participant's checks, outcomes, and component claims in real time.](assets/harvest-gm-results.png)

### Finalize, reset, or cancel

- **Finalize Harvest** awards reserved items, marks them delivered, creates one consolidated chat card per recipient, and closes the session.
- **Reset Harvest** clears attempt state so the scene can be harvested again. Unfinalized claims have not entered inventories.
- **Cancel Harvest** discards the session, clears its attempt state, closes the windows, and awards nothing.

Finalization is designed to avoid duplicate delivery if it is retried after an interruption.

![A finalized Harvest produces a consolidated, linked award card.](assets/harvest-award-chat-card.png)

## Run Gather

Gather is a GM-started, scene-based opportunity for individual characters.

1. Open **Craftworks → Gather** on the intended scene.
2. Select the terrain profile.
3. Review the displayed DC and active participants.
4. Start the session.
5. Players choose an allowed skill and make the configured dnd5e roll, or decline.
6. Successful results award a material appropriate to the terrain.

Gather attempts are tracked per character and scene. Reopening the tool does not grant unlimited repeat attempts. Use the GM reset control only when the scene should offer a new opportunity.

![The GM Gather preflight selects terrain, shows its DC, and identifies eligible participants.](assets/gather-gm-preflight.png)

![The reset state makes the scene-level attempt controls explicit.](assets/gather-gm-reset-state.png)

![A completed Gather award is summarized in chat with its material and recipient.](assets/gather-reward-chat-card.png)

## Generate encounter loot

Loot is a party-level post-combat workflow and resolves applicable defeated creatures once for the encounter.

1. Open **Craftworks → Loot** on the scene containing defeated tokens.
2. Review the encounter creatures and generated **Encounter Haul**.
3. Open linked items when you need to inspect a result.
4. Use **Reroll** to replace the current generated result or **Reset** to clear the encounter's resolved state when appropriate.
5. Choose a player character or Group actor under **Recipient**.
6. Select **Award Encounter Loot**.

A result can include materials, coin, potions, spell scrolls, and special treasure. The final award is summarized in a consolidated public chat card with clickable item references.

![Encounter Loot begins with the resolved creatures, enabled reward categories, and recipient context.](assets/loot-gm-setup.png)

![The generated Encounter Haul can be inspected, rerolled, reset, and awarded.](assets/loot-gm-results.png)

![The Encounter Loot award card consolidates the delivered result.](assets/loot-award-chat-card.png)

## Generate a treasure hoard

Use Hoard for a vault, cache, lair, reward chest, or other accumulated treasure rather than ordinary corpse loot.

1. Open **Craftworks → Hoard**.
2. Set the hoard's parameters and generate the result.
3. Review its materials, currency, potions, spell scrolls, and special treasure.
4. Choose a player character or Group actor.
5. Award the hoard.

Every generated hoard includes potion and spell-scroll rewards in addition to its other configured results. Awards produce a consolidated chat card.

![Hoard setup provides a challenge range and recipient before generation.](assets/hoard-gm-setup.png)

![A generated hoard combines materials, consumables, currency, and special treasure.](assets/hoard-gm-results.png)

![The hoard summary presents the generated cache before delivery.](assets/hoard-summary-chat-card.png)

![The final hoard card records what the chosen recipient received.](assets/hoard-award-chat-card.png)

## Use the item generators

### Potion Generator

Open **Potion Generator**, choose the available generation options, and generate a result from enabled dnd5e sources. Review the linked potion, choose a recipient, and create the award. The source is validated again before the item is delivered.

![Potion Generator setup controls the number of random potions to draw.](assets/potion-generator-setup.png)

![Generated potions show their names, sources, document links, recipient, and reroll control.](assets/potion-generator-results.png)

![The potion award card records quantities, rarities, and recipient.](assets/potion-award-chat-card.png)

### Spell Scroll Generator

1. Open **Spell Scroll Generator**.
2. Enter the number of scrolls to generate at each level, from cantrip through level 9.
3. Select **Generate** and review the random spells from enabled compendiums.
4. Open a source document when you need to inspect a result, or use **Reroll** to replace the draft.
5. Choose the recipient.
6. Select **Award Generated Spell Scrolls**.

Generated scrolls use dnd5e's native scroll conversion, preserve the selected spell's usable mechanics, support levels above 1, and keep a link to the source spell.

![Spell Scroll Generator accepts independent quantities for cantrips and spell levels 1 through 9.](assets/spell-scroll-generator-setup.png)

![Generated scrolls are grouped by level and retain visible source attribution.](assets/spell-scroll-generator-results.png)

![The spell-scroll award card shows the created Items, rarities, quantities, and recipient.](assets/spell-scroll-award-chat-card.png)

### Spellbook Generator

1. Open **Spellbook Generator**.
2. Name the spellbook.
3. Enter the desired number of cantrips and spells at each level.
4. Select **Generate**.
5. Inspect spell links and use **Reroll** if needed.
6. Choose a recipient.
7. Select **Create & Award Spellbook**.

Craftworks creates one custom spellbook Item containing clickable spell links and posts a public award card.

![Spellbook Generator accepts a book name and independent spell counts at every level.](assets/spellbook-generator-setup.png)

![The generated spellbook draft groups linked spells by level and supports rerolling before delivery.](assets/spellbook-generator-results.png)

![The awarded spellbook card preserves its name, recipient, level structure, and clickable spell references.](assets/spellbook-award-chat-card.png)

## Exceptional content: Monsters of Drakkenheim

The standard Craftworks experience does not depend on Drakkenheim. **Monsters of Drakkenheim** is an optional, exceptional content pack that demonstrates how deeply a supported setting can extend the same materials, recipes, acquisition, and crafting framework.

### Requirements

The enhanced experience requires:

- the **Monsters of Drakkenheim** Craftworks Content Pack enabled
- the corresponding Morelord account entitlement
- the supported official Monsters of Drakkenheim Foundry content installed and available

Enabling the Craftworks pack does not provide or unlock the official source product. After installing or changing the source content, run **Sync with Compendiums**.

### What the pack adds

When its requirements are satisfied, the pack can contribute:

- Drakkenheim material families such as animus, bones, dust, fluid, hair, hide, natural weapons, and organs
- rarity-specific Drakkenheim materials
- exact creature-specific Harvestable Components data
- Drakkenheim recipes and ingredient relationships
- Harvest, Gather, Loot, and other content definitions supplied by the pack
- special harvesting notes that do not fit the ordinary component-claim model

The Materials and Recipes browsers group Drakkenheim filters into concise top-level families, so users can explore the setting content without navigating an unmanageably long flat list.

Drakkenheim content is not isolated in a separate mode. When enabled, its materials, recipes, potions, and spells participate in the same searches and generators as other active sources. Results retain their source attribution: for example, a potion draft can mix core potions with **Trollblood Potion**, **Vampire Blood Potion**, and **Greater Rejuvenation Potion**, while scroll and spellbook drafts can include Drakkenheim spells beside core spells.

### Drakkenheim Harvest preflight

For a supported creature, Craftworks inspects its official source data and matches its listed Harvestable Components to canonical Craftworks materials. Review those matches in the GM preflight before starting the session.

Some creatures also include an **Items:** entry or special handling rule. Craftworks presents it as **Special Harvest Items / Instructions**. This information is intentionally GM-facing and informational: it calls attention to exceptional treasure or procedures outside the ordinary material reservation workflow.

Players still use the normal Harvest experience—roll against each creature, reserve an available component, and wait for the GM to finalize the awards. The content is richer, but the workflow remains consistent.

### Graceful fallback

If the official Drakkenheim creature or harvesting data cannot be resolved, Craftworks falls back to standard harvesting where possible rather than making the creature unusable. Missing enhanced results should therefore be diagnosed as a content-pack, entitlement, source-installation, or synchronization issue—not as a requirement for ordinary Craftworks operation.

## Troubleshooting

### Materials or recipes are missing

- Confirm the corresponding Content Pack is enabled and available.
- Confirm required official content is installed.
- Check dnd5e **Configure Sources** for the expected Item compendium.
- Select **Sync with Compendiums** in Craftworks Settings.
- Reopen the browser after synchronization finishes.

### Premium content is locked

- Confirm Morelord Core is active.
- Use **Manage Account** in Craftworks Settings.
- Select **Refresh** after connecting or changing access.
- Confirm the desired Content Pack is enabled.

### A player does not receive Harvest or Gather

- Confirm the player is connected.
- Confirm the player has an assigned or owned character.
- Confirm SocketLib is active for the world.
- Confirm Craftworks is enabled and loaded for both clients.

### A Harvest claim did not add an item

Claims are reservations. Select **Finalize Harvest** to commit them to the resolved recipients.

### A generated reward is missing or cannot be awarded

Confirm its compendium remains enabled in dnd5e **Configure Sources**. Craftworks validates source availability when generating and again when awarding.

### Drakkenheim components are not appearing

- Confirm the **Monsters of Drakkenheim** Content Pack is enabled.
- Confirm the connected account has the corresponding entitlement.
- Confirm the supported official source module is installed and active.
- Run **Sync with Compendiums** after changing content or access.
- Check the Harvest preflight for fallback standard components and any matching warnings.

### A recipe reports missing materials

Check the selected **Using Actor Inventory**. A requirement can depend on canonical material identity, quantity, rarity, category, stage, tags, alternatives, or several units of the same material—not only the displayed item name.

## Support

Report reproducible problems at [Morelord Craftworks Issues](https://github.com/tmoreland72/morelord-craftworks/issues). Include Craftworks, Foundry, and dnd5e versions; the active content packs; relevant console errors; and steps to reproduce the problem.
