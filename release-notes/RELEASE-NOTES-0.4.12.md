# Morelord Craftworks 0.4.12

Harvesting now reads a creature's own Harvestable Components before checking its official Drakkenheim compendium source.

## What Changed

### Fixed

- Recognizes Harvestable Components written directly in a creature's biography, as well as components in embedded journal pages.
- Uses the creature's biography first, allowing imported or renamed creatures with harvesting data to use Drakkenheim harvesting without a compendium match.
- Preserves standard harvesting when neither the creature nor its matching compendium Actor has a Harvestable Components section.
- Drakkenheim content-pack enablement and access checks remain required.

### Documentation

- Updated the setup instructions and GM manual to explain biography-first harvesting and compendium fallback.

## Validation

- All 57 automated tests pass, including biography-source regression checks; JavaScript syntax checks pass.
- Foundry 14.368 runtime compatibility testing confirmed by the maintainer. Supported minimum versions and Core dependencies remain unchanged.
