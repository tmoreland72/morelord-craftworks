# Morelord Craftworks 0.5.7

## What Changed

### Improvements

- Harvest offers mutually exclusive Skip Skill Checks and One Check for All Creatures options. Leave both unchecked for separate creature checks.
- One Check for All Creatures requests one check per character before the creature walkthrough, using the lowest Harvest DC among selected creatures. Success unlocks all creatures; failure shows “Failed to recover any components” with only Done available. Reopening and retries preserve the result.
- Delerium Search opens character-specific windows matching Gather, including character portraits, skill buttons with bonuses, and Decline/Close footer actions. Skill buttons open native D&D5e roll configuration.
- The GM can reopen pending Delerium Search windows and roll for offline characters, including players who disconnect. Existing summaries, results, and award recovery remain available.
- Updated the GM and player documentation for Harvest options and Delerium Search.

## Compatibility

- Requires Morelord Core 0.9.4 or later.
- Verified on Foundry VTT 14.370 with D&D5e 6.1.1 in Dev1.

## Verification

- All six live shared-runner checks passed in Dev1, including comparison with the rendered Gather window, native dialog cancellation, signed skill bonuses, single-roll resolution, and Harvest success/failure/navigation.
- Wide and narrow layouts were captured and visually checked. Separate-player disconnect, light-theme, and 200% zoom coverage remain outstanding.
