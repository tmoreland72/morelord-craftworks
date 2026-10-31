# Morelord Craftworks 0.5.2

## What Changed

### Improvements

- **Crafting** settings can require an activity, such as **Workshop**, or one Workshop or Instructor specialty. **Forge** is only the activity. A saved Forge specialty, including a weapon, armor, or category, is kept as **Forge**. A Forge recipe takes its category from the crafted item. A longsword needs a Forge specialty of Weapons, Martial Weapons, Martial Melee Weapons, or **Any**. Splint needs Armor, Heavy Armor, or **Any**. An item that is not armor, a weapon, or ammunition can use any Forge. The warning names the item’s category, such as `Requires common forge (Martial Melee Weapons or Any).` A facility rule saved as Blacksmith's Tools still applies to Smith's Tools.
- Alchemist is a Workshop specialty. **Alchemist's Supplies** and **Poisoner's Kit** use **Workshop: Alchemist's Supplies**. A saved `alchemist` tool setting is kept as `workshop:alchemist`. The Crafting dropdown does not list Alchemist as its own activity. An alchemy recipe needs a Workshop of sufficient tier whose specialty includes Alchemist's Supplies or is **Any**. The warning reads `Requires common workshop (Alchemist's Supplies or Any).`

### Fixed

- **Settings → Crafting** lists **Smith's Tools** once, using the D&D 2024 name. Packaged recipes that asked for Blacksmith's Tools now ask for Smith's Tools, including the recipe that crafts those tools. A facility chosen for Smith's Tools applies to those recipes. A facility rule already saved as Blacksmith's Tools still applies to Smith's Tools, including a custom recipe that still stores the older name.
- The player Craftworks dashboard no longer shows a Player Resources section. Players still open **Materials**, **Recipes**, and **Craft** from the Craft section.
- **Place in {party name} Inventory** after crafting success creates the item through the connected GM. A party member does not need to own the Group actor. One click places the item once.
- A Downtime session set to **No Location** no longer forces **On the Road** over the viewed scene. Crafting uses an explicit session location when one is chosen, and otherwise the location associated with the scene. **On the Road** applies only when that session has **No Location** and the scene has no associated location.
- **Crafting** settings include **Assign Defaults** and **Clear All**. A new world still starts with no facility assignments. **Assign Defaults** fills the Demo1 facility map. **Alchemist's Supplies** and **Poisoner's Kit** are **Workshop: Alchemist's Supplies**. **Clear All** empties every assignment. Either button asks before it replaces an assignment that is already set. Neither button saves until **Save Changes**.
- A failed crafting check spends two hours and does not advance the project. The Craft window, the active project note, and the chat card say that the materials and items set aside for the project are not lost and stay set aside for the next attempt. That note is added to the native skill, tool, and ability chat card after Foundry rebuilds the roll. While the craft is in progress, each recipe card’s **Requirements** section marks every reserved ingredient with **Set aside for this craft** and the quantity held, and says: Materials are set aside, not lost, until the craft finishes or is abandoned.
- **Assign Defaults** and **Clear All** open their confirmation when an assignment is already set.

### Requires

- Morelord Core 0.9.0 or later. Update Core before Craftworks. Open Craftworks windows refresh in the background when Configure Sources changes, and crafting uses Core's active location.

## Verification

- `npm test`: 161 passed, 1 skipped. The skip is the local compendium index check. Tests cover facility defaults, a saved `alchemist` tool setting kept as `workshop:alchemist`, alchemy recipe gating against Workshop specialty Alchemist's Supplies, **Assign Defaults** and **Clear All** confirmation, a failed native skill, tool, or ability roll whose chat card was rebuilt, reserved ingredients marked **Set aside for this craft** on an in-progress recipe card, type-only facility rules, an assigned specialty match, **Any**, a mismatch, a legacy single specialty and a saved type-only rule, Smith's Tools normalization, party-inventory placement through the GM, background Configure Sources refresh, and a Downtime session set to **No Location** using the viewed scene.
- `npm run build` passed for 0.5.2. `npm run check:recipes` passed.
- Live Foundry verification in world Dev1 was not run from this environment.
