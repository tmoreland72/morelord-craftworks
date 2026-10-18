# Craftworks development tools

`standard-materials.seed.json` is intentionally not the final runtime storage format.
The canonical material records will live as Foundry Item documents in a module compendium.
The seed exists only to make the first compendium generation repeatable once the module is
installed in the Foundry development world.

Run `npm run check:acquisition` to verify all Standard acquisition flags and rule references. `npm run check:kibbles` verifies trait-based harvest references and resolver paths. Run `npm run check:images -- <Foundry>/resources/app/public` to verify built-in and module artwork for both material seeds. The material-source Node tests also check loot rarity bands, duplicate outcomes, source isolation, and known image repairs. Material compendium synchronization updates seed metadata; the browser derives Standard acquisition pills from active rules even when previously synchronized Items have stale flags.
