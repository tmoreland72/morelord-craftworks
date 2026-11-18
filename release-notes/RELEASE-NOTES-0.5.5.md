# Morelord Craftworks 0.5.5

## What Changed

### Fixed

- Fixed Hoard and Loot special treasure reporting no eligible magic items when Foundry rejected overlapping compendium index fields. Magic items now load from visible Item compendiums enabled in D&D5e Configure Sources.
- The empty-pool warning now identifies the enabled compendium sources it searches.

### Compatibility

- Verified on Foundry VTT 14.370 with D&D5e 6.1.1. Existing minimum support and the Morelord Core 0.9.2 requirement are unchanged.

## Verification

- All five Core shared-runner checks passed in verified Dev1, including real Item compendium indexing and challenge 11–16 special treasure resolution. Evidence: `test/in-game-reports/2026-11-18-special-treasure.json`.
- Nine focused offline tests passed, including reproduction of the parent/child projection collision. No Items were awarded or campaign data changed by the live treasure check.
- Full release-preparation suite: 182 passed, one local compendium-fixture check skipped, zero failed. Refreshing the cumulative changelog with LF line endings resolved the two earlier Windows checkout failures.
- Foundry's official release listing identifies 14.370 as the latest stable build: https://foundryvtt.com/releases/14.370.
