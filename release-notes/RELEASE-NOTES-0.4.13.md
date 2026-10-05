# Morelord Craftworks 0.4.13

Updates to shared reporting and craftworks workflows.

## What Changed

### Improvements

- Added privacy-safe Craftworks details to Core's troubleshooting export: content-pack settings and access, catalog counts, known compendium/source availability, synchronization status and recent sync/harvest outcomes. Export before syncing when investigating missing components. Recent outcomes reset on client reload.
- Recipe research shares the Recipes browser's family/rarity filters (including all four Very Rare Organ matches), reveals discoveries for every player, and opens Recipes focused on discovered IDs.
- Added optional feature/error instrumentation through Core's shared reporting service. Fresh GM consent is required; account connection is not. Existing Core dependencies and game behavior are unchanged.
- Downtime integration exposes available personal/party monster components and matching enabled Drakkenheim recipes for one-hour research Projects. Matching reuses crafting ingredient rules without consuming materials.
- Harvest marked-recipe labels now show owned/required component quantities from personal and party inventory, including claimed-component and full recipe lists.
- Harvest recipe pills truncate long names while retaining owned/required counts and full-name tooltips. Harvest creature selection now uses Core’s whole-row choice component, matching Loot.
- Drakkenheim recipe editing explains its no-check rule in a Core callout; section subtitles are concise descriptions.
- Potion category and spell-school filters now use Core checkbox groups that wrap whole options without overlapping, including Scroll and Spellbook generators.
- Added an optional `profileId` argument to `api.openHoard()` so Encounter Stories can open the existing Hoard interface at its intended challenge range. No-argument calls retain Challenge 0–4; no treasure is generated or awarded on opening. Updated API notes in the README and GM manual.
- Optional message visibility is preserved by Delerium quantity rolls and award chat cards.

## Compatibility and verification

Verified release workflows on Foundry VTT 14.368 with D&D5e 6.0.3 in a disposable test world. Supported minimum/maximum bounds are unchanged. Existing Node tests and the shared Core design-system check passed; in-game evidence is retained in the repositories.
