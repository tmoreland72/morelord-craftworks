# Morelord Craftworks 0.2.1

Morelord Craftworks 0.2.1 improves Harvest session control and adds new GM-facing tools for Drakkenheim harvesting and randomized spellbooks. Harvest claims are now fully reversible until the GM finalizes the session, and the new Spellbook Generator provides a complete generate, review, reroll, award, and chat workflow.

## Added

- Added a Harvest preflight **Player Characters** section with a per-character **Skip Skill Checks** option. Selected characters automatically succeed and open directly to their claimable Harvest components.
- Added Drakkenheim **Special Harvest Items / Instructions** detection. `Items:` entries found in Monsters of Drakkenheim harvest data are shown to the GM before the Harvest session starts.
- Added the **Spellbook Generator** GM tool alongside the Spell Scroll Generator.
- Spellbook Generator lets the GM choose how many cantrips and spells of each spell level should appear in the book.
- Spellbook Generator randomizes spells from enabled spell sources, lets the GM reroll before accepting the result, creates a custom spellbook Item, awards it to the selected recipient, and posts its contents to chat.
- Added a website-ready `USER-GUIDE.md` covering installation, configuration, acquisition workflows, crafting, generators, and common GM/player usage.

## Improvements

- Harvest claims are now reservation-only until **Finalize Harvest**. Claiming a component locks it for the session but does not place it in an Actor inventory.
- **Finalize Harvest** now awards all reserved components and then creates one consolidated Award Card per recipient containing everything that recipient received.
- Harvest finalization tracks each delivered claim so retrying an interrupted Finalize operation does not duplicate already-awarded items.
- **Reset Harvest** and **Cancel Harvest** can now safely discard an unfinished session because claimed components have not yet been awarded.
- Drakkenheim special-item instructions convert Foundry inline-roll notation such as `[[/r 2d4]]` to readable dice notation such as `2d4`.
- Moved **Skip Skill Checks** controls to the right side of Harvest preflight character rows.
- Renamed **Generate Spellbook** to **Spellbook Generator** for consistency with **Spell Scroll Generator**.
- Spellbook Generator results now use a contained scrolling region for large generated spellbooks.
- Spellbook result rows are display-only; only the external-link icon opens the referenced spell, matching other Craftworks interfaces.

## Fixed

- Fixed Skip Skill Checks participant state so automatic-success Harvest states are loaded before the player's first Harvest render.
- Fixed a follow-up regression where player Harvest windows could fail to open after automatic-success state hydration.
- Fixed Spellbook Generator result rows overlapping the Recipient controls.
- Fixed Spellbook Generator clickable areas so the entire spell row no longer acts as a link.
- Fixed Harvest award timing so no inventory changes occur when a player merely claims a component.

## Notes

- Foundry VTT v14 and D&D5e 5.3+ are required by the current Craftworks module manifest.
- Morelord Core is required for account-based entitlement checks and entitled content packs.
- Monsters of Drakkenheim harvesting enhancements require the appropriate Craftworks content entitlement and installed Drakkenheim source content.
