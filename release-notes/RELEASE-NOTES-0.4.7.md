# Morelord Craftworks 0.4.7

Craftworks uses shared Morelord page components and improves crafting, acquisition, recipe browsing, and generators. Requires Morelord Core 0.3.5 or newer.

## What Changed

### Improved

- Standardized page sections, spacing, outer scrolling, and action footers across the module.
- Reduced repeated material scans and full-item lookups while browsing recipes; all recipe filters include counts.
- Added combined character and party ingredients for players, with GM-assisted rolls for offline acquisition participants.
- Improved recipe editing with mandatory groups and alternative material choices, plus tool-based facility settings.
- Added full filtered add/remove pickers and editable quantities to potion and scroll results; scroll counts follow school selections.

### Fixed

- Crafting tool checks retain the recipe DC and apply disadvantage when tools or proficiency are missing. Tool names resolve through D&D5e, including Blacksmith's Tools, and action errors are visible.
- Drakkenheim recipes require an equal-or-higher Workshop independent of tools and complete without rolls or tracked hours.
- Delerium Search supports saved defaults, clickable reward rolls, cumulative rewards, and original compendium items delivered through Recipient.
- Updated GM, player, and in-app documentation and included the manuals in the release archive.

## Validation

- 55 automated tests pass, including player crafting actions, inventory consumption, generators, and Drakkenheim completion.
- Build and Core design-system checks pass. Browser fixtures cover 84 page states; these are not a live multiplayer end-to-end test.
