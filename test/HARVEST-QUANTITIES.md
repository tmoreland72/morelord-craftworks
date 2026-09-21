# Harvest quantity regression

From a loaded GM client with Craftworks enabled, run:

```js
const { runHarvestQuantityTests } = await import("./modules/morelord-craftworks/scripts/testing/harvest-quantities.mjs");
const report = await runHarvestQuantityTests();
console.log(JSON.stringify(report, null, 2));
```

This uses Core's shared in-game runner and actual Foundry Actor/Item documents and Harvest rendering. It creates a disposable character, a member party, an unrelated party, and component stacks; marks an existing recipe for the fixture character; checks combined owned/required counts; changes party stock; checks the refreshed count at a compact width; and unmarks the recipe. It closes its window and deletes only created actors (and their embedded items) in `finally`. No harvest claim is sent, and no existing campaign actor, inventory, or recipe is changed. A loaded recipe with an explicit component quantity of at least two is required. Player clients skip fixture creation.

September 17, 2026: live verification on Foundry 14.368 / D&D5e 6.0.3. Reports and wide/compact screenshots are retained in `test/in-game-reports/harvest-quantities*`. The before report runs the same assertion against the previous Harvest application implementation; the corrected implementation passes. This verifies the GM-rendered participant view, not cross-client claim delivery or every theme.
