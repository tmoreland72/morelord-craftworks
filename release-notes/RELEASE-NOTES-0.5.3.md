# Morelord Craftworks 0.5.3

## What Changed

### Fixed

- Clicking an award-card row checks **Configure Sources** before opening the linked item. A disabled source warns that the source is disabled in Configure Sources and does not open. The item name's own link is unchanged.
- **Hoard** item search adds the chosen item without opening its sheet. The open icon on a special-treasure row still opens that item.
- Compendium packs are denied when Morelord Core does not provide its sources filter. Core 0.8.2 or later remains required.

### Improvements

- Materials and Recipes filter rows no longer show a count beside each option. Content Pack rows remain. A Materials Content Pack row appears only when that pack has materials. The match total above the results stays. **Recipes (N)** on a material card stays. **Sync with Compendiums** still reports how many recipes were indexed. Craft and the generators still show their counts.
- **Configure Craftworks** no longer shows an active recipe count beside **Recipes**.

## Verification

- Dev1 checks passed on eec8bf3: the Hoard click, the disabled-source chat link, and the counts removed.
