# Morelord Craftworks 0.4.8

## What Changed

### Improvements

- Use Core's shared nested-scroll preservation while retaining deferred restoration.
- Require product documentation in release archives and validate the landing-page version.

### Fixed

- Remove the redundant instruction beneath Encounter Loot's Dead Creatures section subtitle.
- Remove a legacy toolbar alignment override that centered the Recipes page's Crafting Character section; use Core's standard section layout and action row.
- Match Delerium Search and Harvest Player Characters sections to Gathering with Core's shared section headers, character cards, round portraits, and selected-state highlighting.
- Align manuals with the current module and Core dependency versions.
- Correct outdated README tool-check rules: missing tools or proficiency impose disadvantage at the recipe DC; Drakkenheim recipes use their Workshop requirements and complete without tracked rolls or hours.

### Changed

- Require Morelord Core 0.3.6 or later for the shared UI services used by this release.

## Validation

- All 55 module tests pass; the shared design-system check passes across six feature modules.
- Live Foundry visual and interaction verification was not performed.
