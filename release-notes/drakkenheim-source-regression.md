# Drakkenheim family source regression evidence

Inspected read-only copies of the installed `drakkenheim-monsters` Actor and Guide compendiums; no Foundry world was switched or tested.

| Monster | Actor ID | Type | CR | Harvest rarity | Relevant components |
| --- | --- | --- | --- | --- | --- |
| The World Ender | AKIChWZLty2czNa5 | aberration | 30 | Legendary | Skull, Spine, Ribs |
| The Duchess | z0iDtt74N5NdaiuJ | aberration | 18 | Legendary | Skull |

Guide page IDs: `45biotheworldend` and `89bioepdregs0000`, respectively, in `drakkenheim-monsters.guide` / `drakkenheimRef01`.

The previous source lookup required the displayed material ID to equal the harvest matcher's chosen award ID. This excluded family references when a more specific Item won the match. Source lookup now includes relevant physical parts within the requested family, creature type, and rarity, while preserving exact physical identity for specific-part queries. This does not broaden harvesting awards.

Offline tests cover family inclusion, wrong-type/rarity/category exclusion, skull-versus-spine isolation, cache sharing/invalidation, and retry after failure. `runMaterialSourceTests` includes an opt-in live Dev1 check of both named sources and completed-index reuse. That check remains unrun because the Browser service cannot initialize; this file is static-compendium evidence, not live Foundry verification.

Additional static audit: the installed Delerium Dragon forms list Claws/Teeth and have Uncommon, Rare, Very Rare, and Legendary harvest rarity; neither they nor Tower Dragon/Minazorond list Horns. Installed Ratling entries range from Common to Rare, so the Very Rare Claws variant has no source. These catalog variants must not receive a GM Harvest action. Source journal and creature-subtype aliases are considered when matching a species omitted from an Actor name.
