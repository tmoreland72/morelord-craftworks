# Morelord Craftworks 0.4.15

## Added

- [Premium] GM Magic Item Generator with category and rarity filters, random draws, catalog selection, removal, and chat sharing.

## Improvements

- Spell Scroll Generator supports quantities by spell level or rarity, with working plus/minus controls and existing school/source filters.
- Workflow guidance uses Core's shared subtitle and notes styles.

## Fixed

- Harvesting uses one character roll for the whole session, applying the total to each creature's DC and preserving it across retries and reopened windows. GM fallback and the optional natural-20 bonus remain available.

## Compatibility and verification

Requires Morelord Core 0.3.15. Verified on Foundry VTT 14.368 with D&D5e 6.0.3 in Dev1. Automated tests and shared design-system checks passed; runtime regressions cover generator controls and single-roll harvesting.
