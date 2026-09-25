import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
const playwright = process.env.MORELORD_PLAYWRIGHT || "C:/Users/troy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
const { chromium } = await import(pathToFileURL(playwright).href);
const browser = await chromium.launch({ headless: true });
const folder = "test/in-game-reports";
await fs.mkdir(folder, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1500, height: 1100 } });
  page.on("pageerror", error => console.log("Browser error:", error.message));
  page.on("console", message => {
    if (message.type() === "error" || /Craftworks.*(failed|Ready|sync)/i.test(message.text())) console.log(message.text().slice(0, 1500));
  });
  await page.route("**/api/foundry/telemetry**", route => route.abort());
  // Keep this UI regression offline; Core uses its existing access snapshot.
  await page.route("**/api/foundry/entitlements**", route => route.abort());
  await page.goto(`${process.env.FOUNDRY_TEST_URL || "http://127.0.0.1:31400"}/join`);
  await page.waitForFunction(() => globalThis.game?.world?.id);
  const world = await page.evaluate(() => game.world.id);
  if (world.toLowerCase() !== "dev1") {
    console.log(JSON.stringify({ skipped: true, reason: "Loaded world is not Dev1." }));
  } else {
    await page.locator('input[name="username"]').fill(process.env.FOUNDRY_TEST_GM || "Chuck");
    await page.locator('input[name="password"]').fill(process.env.FOUNDRY_TEST_PASSWORD || "");
    await page.locator('button[name="join"]').click();
    try {
      await page.waitForFunction(() => globalThis.game?.ready && game.modules.get("morelord-craftworks")?.api?.magicItemGenerator, {}, { timeout: 180000 });
    } catch (error) {
      console.log(await page.evaluate(() => ({ ready: globalThis.game?.ready, world: globalThis.game?.world?.id,
        loggedIn: Boolean(globalThis.game?.user), craftworks: globalThis.game?.modules?.get("morelord-craftworks")?.active,
        api: Boolean(globalThis.game?.modules?.get("morelord-craftworks")?.api), notifications: document.querySelector('#notifications')?.innerText })));
      throw error;
    }
    if ((await page.evaluate(() => game.world.id)).toLowerCase() !== "dev1") throw new Error("World identity changed; tests skipped.");
    await page.exposeFunction("captureCraftworks", async (name, id) => {
      await page.locator(`[id="${id}"]`).screenshot({ path: `${folder}/2026-09-24-${name}.png` });
    });
    const visualOnly = process.argv.includes("--visual-only");
    const generatorsOnly = process.argv.includes("--generators-only");
    if (visualOnly) await page.setViewportSize({ width: 1600, height: 1900 });
    const report = await page.evaluate(async ({ visualOnly, generatorsOnly }) => {
      if (visualOnly) {
        const { SpellScrollGeneratorApp } = await import("./modules/morelord-craftworks/scripts/ui/spell-scroll-generator-app.mjs");
        const { MagicItemGeneratorApp } = await import("./modules/morelord-craftworks/scripts/ui/magic-item-generator-app.mjs");
        const api = game.modules.get("morelord-craftworks").api;
        const results = [];
        for (const [name, App] of [["scroll", SpellScrollGeneratorApp], ["magic-items", MagicItemGeneratorApp]]) {
          const app = new App(api);
          if (name === "scroll") app.countMode = "rarity";
          try {
            await app.render({ force: true });
            ui.notifications.clear();
            for (const theme of ["dark", "light"]) {
              app.element.classList.remove("theme-dark", "theme-light");
              app.element.classList.add(`theme-${theme}`);
              for (const zoom of [1, 2]) {
                app.element.style.zoom = String(zoom);
                app.setPosition({ width: 460, height: 820, left: 20, top: 20 });
                const input = [...app.element.querySelectorAll('input[type="number"]')].at(-1);
                input?.focus(); input?.scrollIntoView({ block: "center" });
                await new Promise(resolve => setTimeout(resolve, 150));
                const content = app.element.querySelector('.window-content');
                if (content.scrollWidth > content.clientWidth + 1) throw new Error(`${name} overflows at ${zoom * 100}% zoom.`);
                if (input && document.activeElement !== input) throw new Error(`${name} quantity cannot receive focus.`);
                await window.captureCraftworks(`${name}-${theme}-${zoom * 100}percent`, app.id);
                results.push({ name, theme, zoom, status: "pass" });
              }
            }
          } finally { await app.close(); }
        }
        return { ok: true, world: game.world.id, foundry: game.version, results };
      }
      const { runInGameTests } = await import("./modules/morelord-core/scripts/testing/in-game.js");
      const { generatorAndHarvestChecks } = await import("./modules/morelord-craftworks/scripts/testing/generators-and-harvest.mjs");
      return runInGameTests({ checks: generatorAndHarvestChecks({ capture: async (app, name) => {
        ui.notifications.clear();
        for (const width of [820, 460]) {
          app.setPosition({ width, left: 50, top: 50 });
          await new Promise(resolve => setTimeout(resolve, 150));
          const content = app.element.querySelector('.window-content');
          if (content.scrollWidth > content.clientWidth + 1) throw new Error(`${name} overflows at ${width}px.`);
          await window.captureCraftworks(`${name}-${width}`, app.id);
          const lastInput = [...app.element.querySelectorAll('input,select')].at(-1);
          if (lastInput && width === 460) {
            lastInput.focus();
            lastInput.scrollIntoView({ block: 'center' });
            await window.captureCraftworks(`${name}-${width}-controls`, app.id);
          }
        }
      } }).filter(check => !generatorsOnly || !check.id.includes("harvest")) });
    }, { visualOnly, generatorsOnly });
    await fs.writeFile(`${folder}/2026-09-24-${visualOnly ? "generator-visuals" : generatorsOnly ? "generator-controls" : "generators-and-harvest"}.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report));
    if (!report.ok) process.exitCode = 1;
  }
} finally { await browser.close(); }
