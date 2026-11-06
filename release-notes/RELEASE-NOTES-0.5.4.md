# Morelord Craftworks 0.5.4

## What Changed

### Fixed

- Reloading no longer stops a saved **Delerium Search** from restoring when its chat message has no whisper list. Craftworks whispers that message to the GMs and can still post the saved result once. It does not roll the search again or award it again.

### Improvements

- Character purses, coin labels, encounter loot totals, and hoard coin ranges convert pp, gp, ep, sp, and cp through Morelord Core. The standard rates remain 1 pp = 10 gp and 1 gp = 2 ep = 10 sp = 100 cp. A world that changes the dnd5e currency conversion uses those rates. The coin editor uses the same conversion.
- Award, hoard, and spellbook chat cards use Morelord Core's item card when Core provides it. Clicking an award row outside the item name still opens the linked item. A disabled source still warns that the source is disabled in Configure Sources and does not open. The item name remains the document link. Without Core's item card, Craftworks keeps the previous card.

### Requires

- Morelord Core 0.9.2 or later. Update Core before Craftworks. Core 0.9.1 does not include the currency API these coin totals call. dnd5e 5.3 or later is unchanged.

## Verification

- `npm test`: 181 passed, 1 skipped, 0 failed. The skip is the local compendium index check (`installed compendiums load 279 unique recipes, or 275 without the SRD books`). The same run includes the currency conversion tests, the award, hoard, and spellbook item-card tests, and the Delerium Search recovery test. There is no separate integration suite.
- Foundry `compatibility.verified` stays `14.369`. The latest stable Foundry release is 14.370 (2 November 2026). This prepare did not verify 14.370, so the manifest does not claim it.
- Live Foundry verification in world Dev1 was not run from this environment.
