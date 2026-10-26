# Morelord Craftworks 0.5.0

## What Changed

### Improvements

- Requires Morelord Core 0.6.0 or later. Update Core before Craftworks. Open **Morelord Tools** on the left side of a scene and select **Morelord Craftworks**. The hammer icon remains available to players and GMs. The dashboard still waits until Craftworks finishes initializing.
- When Morelord Core is older than 0.6.0, **Morelord Craftworks** remains a button on the Token controls.

## Verification

- `npm test`: 125 passed, 1 skipped, 0 failed. The skip is the local compendium index check, which this checkout does not include. New tests cover Core `api.tools` registration, the initializing warning, and the Token controls button when Core is older than 0.6.0.
- Foundry Dev1 was not available in this environment, so the Morelord Tools control was not exercised in a world.
