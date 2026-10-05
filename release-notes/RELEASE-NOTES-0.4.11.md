# Morelord Craftworks 0.4.11

Drakkenheim crafting has no time or skill-check requirement. This release also updates Encounter Loot selection and uses Core's shared source filtering.

## What Changed

### Fixed

- Removed stale crafting durations from packaged Drakkenheim recipes. Materials and existing Workshop requirements still apply.
- Completing an older Drakkenheim crafting job now reports zero hours immediately as well as after reloading.

### Improvements

- Encounter Loot uses Core's full-width actor selection rows with a checkbox, portrait, name, and CR.
- D&D5e source filtering consumes Core's shared service while preserving existing filtering behavior. Requires Morelord Core 0.3.9 or later; no new Core release is needed.
- Updated the GM and player manuals to clarify Drakkenheim crafting requirements.

## Validation

- All 56 automated tests pass, including Drakkenheim recipe, roll, and saved-job regressions.
- JavaScript syntax and Core's design-system boundary checks pass.
- Foundry 14.368 compatibility testing confirmed by the maintainer. Supported minimum versions remain unchanged.
