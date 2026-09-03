# Morelord Craftworks 0.4.5

Morelord Craftworks 0.4.5 fixes source filtering for generated spell scrolls and preserves generator choices when rerolling results.

## Fixed

- Encounter Loot and spell-scroll generation now honor both D&D5e Configure Sources and the corresponding Craftworks SRD 5.1/5.2 Content Pack settings.
- SRD spells copied into another enabled compendium can no longer bypass the canonical D&D5e SRD spell-source exclusion through their container pack.
- Rerolling potion, spell-scroll, or spellbook results now retains the previously selected quantities, potion categories, and schools of magic.

## Validation

- Added regression coverage for disabled canonical SRD sources and copied SRD spell provenance.
