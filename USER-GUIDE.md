# Morelord Craftworks User Guide

**Version 0.3.0**

Morelord Craftworks brings harvesting, gathering, encounter loot, treasure hoards, crafting materials, recipes, crafting workflows, and GM treasure-generation tools into one Foundry VTT module.

This guide is written for Game Masters and players using Craftworks in a D&D5e world.

---

## 1. Requirements

Craftworks currently requires:

- Foundry Virtual Tabletop v14
- D&D5e system 5.3 or later
- SocketLib
- Morelord Core

Some Craftworks content packs and tools also require the appropriate Morelord account entitlement. Content tied to official D&D or Drakkenheim material may also require the corresponding Foundry content to be installed in the world.

---

## 2. Opening Craftworks

Use the **Morelord Craftworks** button in Foundry's scene controls to open the main dashboard.

The dashboard is divided into three areas.

### Acquire

GM-only tools for obtaining resources and treasure:

- **Harvest**
- **Gather**
- **Loot**
- **Hoard**

### Craft

Reference and crafting tools:

- **Materials**
- **Recipes**
- **Craft**

### Tools

GM utilities:

- **Spell Scroll Generator**
- **Spellbook Generator**

Players can use the Materials, Recipes, and Craft tools available to them. Acquisition sessions are started by the GM.

---

## 3. First-Time Configuration

Open **Game Settings → Configure Settings → Module Settings → Morelord Craftworks** and select **Configure Craftworks**.

### Content Packs

The Content Packs section controls which Craftworks material, recipe, harvesting, gathering, loot, and crafting definitions are active.

Craftworks may offer content such as:

- Standard Craftworks materials
- SRD 5.2
- SRD 5.1
- Player's Handbook
- Dungeon Master's Guide
- Monsters of Drakkenheim

Only packs that are enabled and available to the connected account participate in Craftworks.


### Sync with Compendiums

Craftworks keeps its world material compendiums and external D&D5e content
references synchronized automatically.

When the first active GM enters a world, Craftworks compares the current content
environment with the last successful synchronization. A new sync runs only when
something relevant changed, including:

- the Craftworks version
- the D&D5e system version
- enabled Craftworks Content Packs
- available Item compendiums
- versions of active modules that provide Item compendiums

This avoids rewriting Craftworks material compendiums on every world load while
still detecting newly installed source content.

The GM can force a rescan at any time from **Craftworks Settings → Content Packs →
Sync with Compendiums**. A manual sync updates Craftworks material compendiums,
refreshes external D&D5e Item-compendium discovery, and reloads the recipe index.

### Morelord Account Access

The top of Craftworks Settings shows the current Morelord Core connection and access tier.

Use:

- **Manage Account** to open account management
- **Refresh** to refresh entitlements after an account or subscription change

---

## 4. Material Storage

Craftworks can award acquired materials to individual characters or to a shared party Actor.

### Individual Storage

Leave **Use Party Actor for Acquired Materials** disabled.

Harvesting and Gathering use the participating character as the normal recipient.

### Shared Party Storage

Enable **Use Party Actor for Acquired Materials** and select a D&D5e Group actor under **Party Recipient Actor**.

When enabled, supported acquisition workflows route their awarded Craftworks materials to that shared Group actor.

---

# Materials


### Three-State Filters

The Materials and Recipes browsers use the same long-list filtering pattern and layout as Morelord Marketplace. Filters appear in a left sidebar. Clicking a filter cycles through:

1. **Neutral** — the filter does not affect results.
2. **Include (+)** — results must match the selected value.
3. **Exclude (−)** — results matching the selected value are removed.

Recipes also include **Known** and **Unknown** knowledge filters.

The Recipes **Rarity** filter uses the public rarity of the recipe/output item. It remains usable even when a recipe is Unknown and does not reveal hidden ingredient rarity.


The list itself is only rendered when the current search and filters reduce the catalog to **100 or fewer results**. Above 100, the results pane shows the current match count and asks you to refine the filters. Search text and filter-state changes update this count immediately.

For Game Masters, **Mark Context Known** and **Mark Context Unknown** apply only to recipes matching the current search and filter context. They do not change recipes outside the current result set.

## 5. Materials Browser

Open **Materials** from the Craftworks dashboard to browse the materials currently indexed from active content packs.

Materials can include information such as:

- name
- image
- rarity
- category
- processing stage
- value
- tags
- acquisition methods
- recipes that use the material

Materials are reference data. Crafting does not occur from the Materials browser.

---

# Recipes and Crafting

## 6. Recipes Browser

### Recipe Knowledge

A recipe can be **Known** or **Unknown**:

- **Known** — the recipe and its ingredient requirements are visible.
- **Unknown** — the recipe remains searchable and may be marked as a crafting goal, but its ingredient requirements are concealed.

Game Masters control this state from the Recipes browser. **Mark Context Known** and **Mark Context Unknown** affect only recipes matching the current search and filter context.


Open **Recipes** to search and review available recipes.

Recipe cards show the information needed to understand how an item is made, including its material requirements and output.

Recipes are a reference tool. Actual crafting is performed from the **Craft** window.

### Marking a Recipe for Crafting

Use the recipe's crafting marker/bookmark control to mark a recipe.

Marked recipes automatically appear in the **Craft** window. This lets a player build a short list of the recipes they currently intend to work on without searching again each time.

---

## 7. Craft Window

Open **Craft** from the dashboard.

The Craft window shows recipes marked by the selected Crafter and compares their requirements against the selected inventory Actor.

A recipe shows whether each requirement is available or missing.

Craftworks supports requirements such as:

- an exact material
- material rarity
- material category
- processing stage
- tags
- alternative ingredients
- requirements where several units must come from the same material

### Crafter vs. Inventory

The **Crafter** is the character performing the work.

The **inventory Actor** is the Actor supplying the required materials and receiving the finished output for that crafting job.

### Crafting Checks

When a recipe requires checks, Craftworks uses the Crafter's D&D5e roll data and the native configured roll dialog.

Crafting progress persists between attempts.

### Crafting Time

Craftworks tracks successful crafting progress and total time spent. A failed crafting attempt can spend time without adding successful progress.

### Cancel Crafting

If an active crafting job is cancelled, Craftworks returns materials that were consumed when that job began.

### No-Check Recipes

Some source material defines crafting that does not require a skill check. Craftworks supports these recipes and advances them according to their defined workflow instead of inventing a check.

---

# Harvesting

## 8. Starting a Harvest

Harvesting is started by the GM.

1. Place or leave defeated creature tokens on the current scene.
2. Open **Craftworks → Harvest**.
3. Review the creatures Craftworks detected.
4. Review any special harvesting information.
5. Choose whether any player characters should **Skip Skill Checks**.
6. Click **Start Harvest**.

Each connected player receives a Harvest window.

---

## 9. Harvest Preflight

Before starting the session, the GM sees the dead creatures detected on the current scene.

The preflight display includes information such as:

- creature name
- creature type
- CR
- Harvest DC
- Harvest rarity when applicable

For standard creatures, Craftworks resolves the complete Kibbles harvesting
model. Depending on the creature's type, CR, size, AC, and resistances, its
offering can include:

- basic hide, carapace, scale, meat, or fresh-ingredient harvesting
- an exotic harvest result
- an exotic remnant result for applicable creature types
- special tough hide, resistant hide, dragon scale, or higher-rarity meat

Dice quantities and the exotic d100 result are generated once for the corpse
and shared by every participant in that Harvest session.

### Skip Skill Checks

The **Player Characters** section lists active player characters.

Check **Skip Skill Checks** for a character when you want that character to automatically succeed at Harvesting during this session.

A skipped character does not roll a Harvest skill check. Their player goes directly to the available claim choices.

This is useful when:

- the GM wants to waive checks for a particular scene
- the party has already earned automatic success
- testing or demonstration is needed
- a campaign rule makes harvesting automatic

---

## 10. Harvest Skill Checks

When a character is not set to **Skip Skill Checks**, the player uses the single **Harvest Skill Check** control at the top of the Harvest window.

1. Choose the Harvest skill to use.
2. Click **Roll Harvest Checks**.
3. Craftworks automatically rolls that skill separately against every unresolved creature available to that character.
4. Each creature resolves against its base Harvest DC.
5. Successful creatures immediately expose every component whose individual
   Harvest DC the roll also meets.
6. Failed creatures show their failed result and consume that character's Harvest attempt for that creature.

Creatures already attempted, already resolved, or automatically succeeded through **Skip Skill Checks** are not rolled again.

### Large Encounters

This batch workflow is specifically designed for combats with many defeated creatures. A player does not need to repeat the same skill selection and Roll action for every corpse.

Craftworks still preserves an individual result for each creature, including:

- roll total
- success or failure
- Harvest DC
- natural d20 result
- natural-20 bonus claim eligibility

### Natural 20

Craftworks can allow a natural 20 to grant two component claims instead of one.

This behavior is enabled by default and can be disabled in Craftworks Settings under **Harvesting → Natural 20 Grants Two Claims**.

The bonus uses the actual active d20 result, not a modified total of 20.


## 11. Claiming Harvest Components

After a successful check, the player chooses from the highlighted components available to them.

A claim is a **reservation**, not an immediate inventory award.

When a player claims a component:

- the component becomes reserved for that player
- all open Harvest windows synchronize the claim
- the displayed dice quantity is reserved with the component
- standard Kibbles results remain independently claimable by every successful
  participant
- exact Drakkenheim monster components remain finite and exclusive
- the item is **not yet added to inventory**

This design lets the GM Reset or Cancel a Harvest session without needing to remove inventory items.

### Needed for Crafting

If a Harvest material is needed by a recipe that the player's current Crafter has marked for crafting, Craftworks highlights it with **Needed for Crafting**.

This makes it easier to recognize components that directly advance the player's current crafting plans.

---

## 12. Claimed Components

During a Harvest session, the GM and players can see a shared **Claimed Components** list.

The list can show:

- component image
- component name
- rarity
- source creature
- claimant
- Harvest roll

Claims update in realtime.

---

## 13. Finalize, Reset, and Cancel Harvest

### Finalize Harvest

**Finalize Harvest** commits the session.

Only at this point does Craftworks:

1. award the reserved items to their resolved recipients
2. mark those claims as delivered
3. create one consolidated Award Card per recipient
4. close the Harvest session/windows

Each recipient's Award Card lists all items that recipient received from the Harvest.

Finalize is designed to avoid duplicating items if the finalization process is retried after a partial interruption.

### Reset Harvest

**Reset Harvest** clears the Harvest attempt state so the scene can be harvested again.

Because claims are not awarded until Finalize, resetting an unfinished Harvest does not require removing items from inventories.

### Cancel Harvest

**Cancel Harvest** discards the active Harvest session, resets the Harvest attempt state, and closes all Harvest windows.

No claimed items from the cancelled session are awarded.

---

# Drakkenheim Harvesting

## 14. Monsters of Drakkenheim Support

When the Monsters of Drakkenheim Craftworks content is active and the corresponding official source content is available, Craftworks can use the creature's exact Drakkenheim Harvestable Components data.

If the Drakkenheim content is not available, the creature falls back to the normal Craftworks harvesting model instead of becoming unharvestable.

### Special Harvest Items / Instructions

Some Monsters of Drakkenheim creatures include an **Items:** entry in their Harvestable Components information.

Craftworks displays these entries on the GM's Harvest preflight screen as **Special Harvest Items / Instructions**.

These instructions are informational so the GM knows the creature has additional special loot or handling rules beyond the normal component claim list.

Foundry inline-roll syntax in those instructions is simplified for readability. For example:

`[[/r 2d4]]`

is displayed as:

`2d4`

---

# Gathering

## 15. Gathering

Gathering is an individual player activity started by the GM.

The Gather workflow uses the current scene's selected terrain profile.

Players can make the configured Gathering check, and successful results award an appropriate material from that terrain's active content data.

Gathering uses the native D&D5e configured roll dialog.

Gathering opportunities are tracked per character for the scene so reopening the tool does not automatically provide unlimited repeat attempts.

---

## 16. Gathering Settings

Craftworks Settings provides:

- **Global DC Modifier**
- **Quantity Multiplier**
- **Rare Result Bias**
- individual **Terrain Gather DCs**

Each terrain shows its normal source-pack DC and an editable world value.

The Global DC Modifier is applied after the terrain-specific base DC.

Example:

- Forest base DC: 12
- Global DC Modifier: +2
- Final Forest Gather DC: 14

---

# Encounter Loot

## 17. Loot

**Loot** is a GM-run party-level encounter workflow.

It evaluates unresolved defeated creatures on the current scene and can generate:

- Craftworks materials
- coin
- special treasure

Loot is resolved once for the encounter rather than once per player.

Craftworks tracks resolved corpse loot so reopening Loot does not automatically farm the same defeated tokens again.

### Loot Settings

The GM can enable or disable:

- Materials
- Coin
- Special Treasure

The GM can also configure:

- material chance modifier
- coin chance modifier
- special treasure chance modifier
- material quantity multiplier
- coin multiplier

---

# Treasure Hoards

## 18. Hoard

Use **Hoard** for a lair, vault, cache, reward chest, or other accumulated treasure source rather than ordinary post-combat loot.

A generated hoard can include:

- Craftworks materials
- coin
- special treasure

When awarded, Craftworks creates a consolidated Award Card for the recipient.

---

# Award Cards

## 19. Award Cards

When Craftworks awards items or loot, it creates a public chat card summarizing the result.

Award Cards can show:

- recipient
- item image
- clickable item link
- rarity
- quantity
- coin

For multi-item operations, Craftworks groups the items into one card per recipient instead of creating a separate chat message for every item.

For Harvesting, Award Cards are created only after the GM clicks **Finalize Harvest**.

---

# GM Tools

## 20. Spell Scroll Generator

Open **Spell Scroll Generator** from the GM Tools section.

The generator uses spell compendiums enabled for the world.

Typical workflow:

1. choose the scroll level
2. generate a random spell
3. review the result
4. select the recipient
5. create and award the spell scroll

The resulting scroll retains the selected spell identity and is added to the recipient's inventory.

---

## 21. Spellbook Generator

Open **Spellbook Generator** from the GM Tools section.

Use this when the party discovers a wizard's spellbook or another collection of random spells.

### Generate a Spellbook

1. Enter a name for the spellbook.
2. Enter how many cantrips and spells of each level should be included.
3. Click **Generate**.
4. Review the randomized spells.
5. Use the external-link icon beside a spell to inspect it.
6. Click **Reroll** if you want a completely new result using the same requested counts.
7. Choose the recipient.
8. Click **Create & Award Spellbook**.

The result is one custom spellbook Item containing the selected spells as clickable Foundry document links.

A public chat card is also created showing the spellbook and its spell contents.

The generated spell list has its own scrollbar so large books can be reviewed without pushing the recipient controls offscreen.

---

# Craftworks Settings Reference

## 22. Harvesting Settings

Available Harvest controls include:

- **DC Modifier**
- **Minimum Choices**
- **Maximum Choices**
- **Rare Result Bias (%)**
- **Natural 20 Grants Two Claims**

---

## 23. Gathering Settings

Available Gathering controls include:

- **Global DC Modifier**
- **Quantity Multiplier**
- **Rare Result Bias (%)**
- per-terrain Gather DC values

---

## 24. Encounter Loot Settings

Available Loot controls include:

- Materials on/off
- Coin on/off
- Special Treasure on/off
- Material Chance Modifier
- Coin Chance Modifier
- Special Chance Modifier
- Material Quantity Multiplier
- Coin Multiplier

---

# Troubleshooting

## 25. A Player Does Not Receive an Acquisition Window

Check that:

- the player is currently connected
- the player has an owned or assigned character where required
- SocketLib is active
- Morelord Craftworks is active for both GM and player clients

For Harvesting, starting the session should open the player Harvest application automatically.

---

## 26. Premium Content Is Not Available

Open Craftworks Settings and check the **Craftworks Content Access** card.

Then:

1. verify Morelord Core is active
2. verify the Morelord account is connected
3. click **Refresh**
4. confirm the desired Content Pack is enabled

An enabled pack still requires any entitlement assigned to that pack.

---

## 27. A Recipe Says Materials Are Missing

Confirm that the selected inventory Actor contains materials matching the recipe's exact requirements.

Some recipes require more than a matching name. Requirements may specify:

- exact material ID
- rarity
- category
- tags
- processing stage
- same-material quantities

---

## 28. A Harvest Claim Did Not Add an Item

This is expected until the GM finalizes the session.

Harvest claims reserve components only. The inventory award occurs when the GM clicks **Finalize Harvest**.

---

## 29. Drakkenheim Components Are Not Appearing

Confirm that:

- the Monsters of Drakkenheim Craftworks content pack is enabled
- the account has access to that content pack
- the relevant official Drakkenheim source content is installed and available

Without the Drakkenheim enhancement path, Craftworks intentionally falls back to standard harvesting where possible.

---

# Quick Reference

## GM

- **Harvest:** dead creatures → preflight → Start → players claim → Finalize
- **Gather:** select terrain → start session → players roll or decline
- **Loot:** resolve ordinary post-combat party loot
- **Hoard:** generate a cache/lair/vault treasure result
- **Spell Scroll Generator:** random spell → create scroll
- **Spellbook Generator:** choose spell counts → Generate/Reroll → create book
- **Settings:** configure packs, recipients, Harvest, Gather, and Loot behavior

## Player

- **Materials:** browse Craftworks materials
- **Recipes:** browse and mark recipes for crafting
- **Craft:** work on marked recipes
- **Harvest:** choose one skill and roll all unresolved creature checks, or claim directly when the GM skips checks
- **Gather:** make the scene's Gathering attempt when the GM starts a session

---

## Version

This guide describes Morelord Craftworks **0.2.2**.
