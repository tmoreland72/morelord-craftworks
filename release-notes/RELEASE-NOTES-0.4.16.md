# Morelord Craftworks 0.4.16

## What Changed

### Improvements

- Harvesting shows a character's claimed components on the left and one current creature in a larger right panel, with stacked panels at narrow window widths.
- Non-Drakkenheim creatures use individual Harvest checks. Drakkenheim creatures open directly to component choices without a skill check.
- Next replaces the current creature after resolving its check and claims. Skip Remaining and the final-page Done button mark the character Harvesting Completed for the GM while preserving reserved claims for Finalize Harvest.
- Reopening restores the current creature and recorded outcomes. Each character keeps a separate claim ledger, including when one player controls multiple characters.
- Restored the GM-controlled Skip Skill Checks option in a dedicated Skill Checks section before Player Characters, with a not-recommended explanation.
- Updated Harvest manuals and screenshots using Morelord Core's shared components and responsive shell.

### Fixed

- Retried creature-roll delivery reuses the recorded roll rather than rolling again.
- Concurrent requests cannot reserve the same finite Drakkenheim component or duplicate character completion.

## Compatibility and verification

Requires Morelord Core 0.4.0 or newer. Verified on Foundry VTT 14.368 with D&D5e 6.0.3 in Dev1. The shared-runner socket regression covers creature navigation, individual rolls, Drakkenheim claims without checks, character-specific ledgers, reopened progress, explicit Done/Skip Remaining completion in the GM window, retained reservations, and normal/narrow layouts. All 74 automated tests and Core's design-system check passed. Separate-player disconnect, light-theme, and 200% zoom checks remain outstanding.
