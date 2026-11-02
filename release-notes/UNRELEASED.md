# Unreleased

## What Changed

### Fixed

- Clicking an award-card row checks **Configure Sources** before opening the linked item. A disabled source warns that the source is disabled in Configure Sources and does not open. The item name's own link is unchanged.
- **Hoard** item search adds the chosen item without opening its sheet. The open icon on a special-treasure row still opens that item.
- Compendium packs are denied when Morelord Core does not provide its sources filter. Core 0.8.2 or later remains required.

### Improvements

- Materials and Recipes filter rows no longer show a count beside each option. Content Pack rows remain. A Materials Content Pack row appears only when that pack has materials. The match total above the results stays. **Recipes (N)** on a material card stays. **Sync with Compendiums** still reports how many recipes were indexed. Craft and the generators still show their counts.
- **Configure Craftworks** no longer shows an active recipe count beside **Recipes**.

## Verification

- `npm test`: 174 passed, 1 skipped. The skip is the local compendium index check. Tests cover a missing Core sources API denying compendium packs, a chat-card row that warns and does not call `fromUuid` when Configure Sources disallows the source, Hoard search results that do not open an item sheet, frozen facility defaults, and Materials, Recipes, and Settings templates that no longer show those counts.
- Live Foundry verification was not run from this environment.
