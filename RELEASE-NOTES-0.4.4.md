# Morelord Craftworks 0.4.4

Morelord Craftworks 0.4.4 adds the missing Monsters of Drakkenheim SRD recipes and expands crafting projects with facilities, party inventories, focused workflows, and shared Core services.

## Added

- Added Harvest player-character selection with Core-standard party priority, remembered selections, and per-character Skip Skill Checks.
- Added all 19 Monsters of Drakkenheim Appendix E SRD recipe variants for enhanced armor, healing and resistance potions, enhanced shields, spell scroll tiers, and enhanced weapons.
- Added entitlement-aware recipe output resolution that prefers enabled premium PHB and DMG content before falling back to SRD 5.2; healing potions can also use SRD 5.1.
- Added recipe facility requirements backed by Morelord Core locations and capability tiers.
- Added Group actor ingredient inventories for member characters, with GM-authorized material consumption.
- Added focused single-recipe Craft windows and a public downtime integration for recipes, projects, facilities, and commissions.
- Added automated coverage for Drakkenheim recipes, crafting environments, and Group inventories.

## Improved

- Enhanced armor, shield, and weapon recipes now award the corresponding generic `+1, +2, or +3` compendium item so the GM can configure the completed item appropriately.
- Crafting projects now pause when their required environment is unavailable and resume when the requirement is met.
- The dashboard now reports total and ready crafting projects and places Manage Locations with the other GM Tools.
- Recipe cards now provide GM facility controls and clearer Known and Marked actions.
- D&D 5e skill rolls and source labels now use shared Morelord Core services.
- Release automation now supports direct Foundry package publication with separate website and Foundry credentials.
