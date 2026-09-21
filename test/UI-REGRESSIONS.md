# Craftworks UI regression tests

Run in a logged-in Foundry GM client after Craftworks finishes initialization:

```js
const { runCraftworksUiTests } = await import("./modules/morelord-craftworks/scripts/testing/ui-regressions.mjs");
console.log(await runCraftworksUiTests());
```

Uses Core's runner, actual Foundry template rendering, native label clicks, loaded styles, and the real recipe editor. Checks long recipe names truncate while quantities stay visible at regular and compact widths, name/portrait/background/checkbox clicks toggle exactly once, and Drakkenheim uses a callout without DC controls. Test windows close without saving or changing campaign data. Reports and screenshots are in `test/in-game-reports/ui-*`.

Verified September 17, 2026 on Foundry 14.368 / D&D5e 6.0.3: all six shared and module checks passed. Core and Craftworks automated suites passed (46 and 58 tests respectively), as did the design-system check.

For generator categories/schools and the Core version-sharing checkbox, import `./modules/morelord-craftworks/scripts/testing/generator-layout.mjs` and run `runGeneratorLayoutTests()`. This reuses Core’s `connection-layout.js` check, renders the actual generator templates at 820px and 460px with enlarged text, verifies bounds/non-overlap and label toggling, and closes all windows without saving.

Generator/Core checkbox verification: all eight checks passed in Foundry 14.368 / D&D5e 6.0.3, including 820px/460px generator layouts with enlarged text. Report: test/in-game-reports/checkbox-layout.json.
