import { runInGameTests, assert } from "../../../morelord-core/scripts/testing/in-game.js";
import { MaterialBrowserApp } from "../ui/material-browser-app.mjs";
import { MaterialSourcesApp } from "../ui/material-sources-app.mjs";
import { getLootMaterialIds } from "../acquisition/loot-profiles.mjs";
import { activeMaterialAcquisition, materialAcquisition } from "../materials/material-sources.mjs";
import { activateImageFallbacks } from "../../../morelord-core/scripts/ui/image-fallbacks.js";
import { getDrakkenheimSourceIndex } from "../materials/drakkenheim-source-index.mjs";
import { repairCatalogImages } from "../materials/material-images.mjs";

export async function runMaterialSourceTests({ onRendered = async () => {} } = {}) {
  if (game.world?.id !== "dev1") throw new Error("Material source tests require verified Dev1.");
  return runInGameTests({ checks: [{
    id: "craftworks.material-source-pills-and-results",
    skip: game.user.isGM ? null : "GM required.",
    async run() {
      const api = game.modules.get("morelord-craftworks")?.api;
      const lootIds = getLootMaterialIds({ activePackIds: api.contentPacks.enabled({ capability: "loot" }).map(pack => pack.id) });
      const material = api?.materials.all().find(entry => entry.packId !== "monsters-of-drakkenheim"
        && lootIds.has(entry.materialId) && entry.purchasable);
      assert(material, "Enable a standard material with Loot and Purchasable tags.");
      const browser = new MaterialBrowserApp(api);
      const source = new MaterialSourcesApp(api, material, "loot");
      try {
        browser.focusMaterial(material.materialId);
        await browser.render({ force: true });
        const pill = browser.element.querySelector('[data-material-source="loot"]');
        const passive = pill?.parentElement.querySelector("span.ml-badge");
        assert(pill && passive, "Material needs clickable and passive Core badges.");
        assert(getComputedStyle(pill).cursor === "pointer", "Source pill must show a clickable cursor.");
        assert(pill.dataset.tone === "action" && getComputedStyle(pill).color === "rgb(255, 255, 255)", "Clickable source pills must use Core's orange/white action tone.");
        assert(Math.abs(pill.getBoundingClientRect().height - passive.getBoundingClientRect().height) < 1, "Clickable and passive pills must align.");
        await onRendered(browser, "materials");
        const missing = api.materials.all().find(entry => entry.acquisition?.lootable && !lootIds.has(entry.materialId));
        if (missing) {
          browser.focusMaterial(missing.materialId);
          await browser.render();
          assert(!browser.element.querySelector('[data-material-source="loot"]'), "Catalog flags cannot show Loot for a material absent from active tables.");
        }
        const availability = activeMaterialAcquisition(api);
        for (const [id, kind] of [["boiled-leather", "harvest"], ["common-supplies", "gather"]]) {
          const entry = api.materials.get(id);
          assert(entry, `Load the Standard material ${id}.`);
          browser.focusMaterial(id);
          await browser.render();
          assert(!browser.element.querySelector(`[data-material-source="${kind}"]`), `${id} cannot show an unsupported ${kind} pill.`);
          assert(materialAcquisition(entry, availability)[kind === "gather" ? "gatherable" : "harvestable"] === false, "Availability must reflect active rules.");
        }
        const craftable = api.materials.all().find(entry => api.recipes.recipesProducingMaterial(entry.materialId).length) ?? material;
        const fixtureId = `material-output-regression-${foundry.utils.randomID()}`;
        const recipe = api.recipes.all()[0];
        assert(recipe, "Load an enabled recipe for the material-output fixture.");
        try {
          // Some catalogs have no material-producing recipes; keep this fixture in memory only.
          api.recipes._recipes.set(fixtureId, { ...recipe, id: fixtureId, output: { type: "craftworks-material", materialId: craftable.materialId, quantity: 1 } });
          browser.focusMaterial(craftable.materialId);
          await browser.render();
          assert([...browser.element.querySelectorAll("span.ml-badge")].some(pill => pill.textContent === "Craftable"), "Recipe outputs must show Craftable.");
        } finally { api.recipes._recipes.delete(fixtureId); }
        const broken = document.createElement("img");
        broken.alt = "Artwork fallback regression fixture";
        broken.dataset.mlImageFallback = "icons/svg/item-bag.svg";
        broken.src = "modules/morelord-craftworks/tmp/nonexistent-image-regression.webp";
        browser.element.querySelector(".window-content").append(broken);
        try {
          activateImageFallbacks(browser.element);
          for (let attempt = 0; attempt < 100 && !(broken.complete && broken.naturalWidth > 0); attempt++) await new Promise(resolve => setTimeout(resolve, 50));
          assert(broken.getAttribute("src") === broken.dataset.mlImageFallback && broken.naturalWidth > 0, "Unavailable material artwork must render the bundled fallback.");
        } finally { broken.remove(); }
        await source.render({ force: true });
        assert(source.element.querySelector('[role="status"] .fa-spinner'), "Searching must show a spinner.");
        assert(!source.element.textContent.includes("No matching sources"), "Loading cannot display the empty state.");
        await onRendered(source, "loading");
        await source.load();
        assert(!/drakkenheim/i.test(source.element.textContent), "Standard materials cannot mention Drakkenheim.");
        assert(!source.element.querySelector('[role="status"]'), "Search indicator must disappear on completion.");
        await onRendered(source, "results");
        source.setPosition({ width: 380 });
        await onRendered(source, "compact");
      } finally {
        await source.close();
        await browser.close();
      }
    }
  }, {
    id: "craftworks.shared-monster-card-opens-actor",
    skip: game.user.isGM ? null : "GM required.",
    async run() {
      const api = game.modules.get("morelord-craftworks")?.api;
      const actor = game.actors.find(actor => actor.type === "npc");
      assert(actor, "Load an NPC Actor before running this card regression.");
      const app = new MaterialSourcesApp(api, { name: "Monster card regression" }, "harvest");
      const alreadyOpen = actor.sheet.rendered;
      try {
        app.loading = false;
        app.rows = [{ name: actor.name, uuid: actor.uuid, img: actor.img, cr: api.adapter.getCreatureCR(actor), sourceLabel: "Regression fixture", detail: "Animus" }];
        await app.render({ force: true });
        const card = app.element.querySelector(".ml-monster-card");
        assert(card?.querySelector(".ml-avatar"), "Monster card must show Core's actor portrait.");
        assert(card.querySelectorAll("button").length === 1, "Material source cards must only have an Open action.");
        card.querySelector("button").click();
        for (let attempt = 0; attempt < 100 && !actor.sheet.rendered; attempt++) await new Promise(resolve => setTimeout(resolve, 50));
        assert(actor.sheet.rendered, "Open action must display the Actor sheet.");
        await onRendered(app, "monster-card");
      } finally {
        await app.close();
        if (!alreadyOpen && actor.sheet.rendered) await actor.sheet.close();
      }
    }
  }, {
    id: "craftworks.drakkenheim-family-sources-and-cache",
    skip: game.user.isGM && game.modules.get("morelord-craftworks")?.api?.contentPacks.isEnabled("monsters-of-drakkenheim")
      ? null : "GM and enabled Monsters of Drakkenheim content required.",
    async run() {
      const api = game.modules.get("morelord-craftworks").api;
      const material = api.materials.get("drakkenheim-legendary-bones-aberration");
      assert(material, "Synchronize the Drakkenheim material catalog first.");
      const first = await getDrakkenheimSourceIndex(api);
      assert(!first.notices.length, "Every installed monster source must be readable for this check.");
      assert(first === await getDrakkenheimSourceIndex(api), "Repeat searches must reuse the same completed source index.");
      const app = new MaterialSourcesApp(api, material, "harvest");
      try {
        await app.load();
        assert(app.rows.some(row => row.name === "The World Ender"), "Legendary aberration bones must include The World Ender's listed bone components.");
        assert(app.rows.some(row => row.name === "The Duchess"), "Legendary aberration bones must include The Duchess's skull.");
        assert(!app.element.textContent.includes("Delerium (separate") && !app.element.textContent.includes("GM loot instructions"), "Source cards must omit unrelated loot instructions.");
        await onRendered(app, "drakkenheim-bones-cached");
        const browser = new MaterialBrowserApp(api);
        try {
          for (const material of api.materials.all().filter(entry =>
            entry.name === "Natural Weapon - Horns from a Dragon (Common)"
            || entry.name === "Natural Weapon - Claws from a Ratling (Very Rare)")) {
            browser.focusMaterial(material.materialId);
            await browser.render({ force: true });
            assert(!browser.element.querySelector('[data-material-source="harvest"]'), `${material.name} must not advertise an unsupported harvest source.`);
          }
        } finally { await browser.close(); }
      } finally { await app.close(); }
    }
  }, {
    id: "craftworks.stored-item-artwork-repair",
    skip: game.user.isGM ? null : "GM required to create a disposable compendium fixture.",
    async run() {
      const name = `morelord-craftworks-materials-artwork-regression-${foundry.utils.randomID().toLowerCase()}`;
      let pack, item;
      try {
        pack = await foundry.documents.collections.CompendiumCollection.createCompendium({ name, label: "Craftworks artwork regression fixture", type: "Item", package: "world", system: game.system.id });
        assert(pack.collection === `world.${name}`, "Only the newly created fixture compendium may be changed.");
        [item] = await CONFIG.Item.documentClass.createDocuments([{ name: "Mithril Ore image regression", type: "loot",
          img: "icons/commodities/stone/ore-pile-silver.webp", flags: { "morelord-craftworks": { materialId: "mithril-ore" } } }], { pack: pack.collection });
        await pack.configure({ locked: true });
        const index = await pack.getIndex({ fields: ["img", "flags.morelord-craftworks.materialId"] });
        assert(await repairCatalogImages(pack, index) === 1, "Known invalid stored artwork must be repaired.");
        assert(pack.locked, "Artwork repair must preserve compendium locking.");
        item = await pack.getDocument(item.id);
        assert(item.img === "icons/commodities/stone/ore-chunk-silver-gray.webp", "The actual Item must receive the repaired image path.");
        await item.sheet.render({ force: true });
        assert(item.sheet.rendered, "Native Item sheet must open using the repaired document.");
        await onRendered(item.sheet, "repaired-native-item");
      } finally {
        if (item?.sheet.rendered) await item.sheet.close();
        if (pack?.collection === `world.${name}`) {
          await pack.configure({ locked: false });
          await pack.deleteCompendium();
        }
      }
    }
  }] });
}

export async function runPlayerMaterialAvailabilityTests() {
  if (game.world?.id !== "dev1") throw new Error("Player material availability tests require verified Dev1.");
  return runInGameTests({ checks: [{
    id: "craftworks.player-verified-harvest-tags",
    skip: game.user.isGM ? "Run on a player client with a connected GM." : null,
    async run() {
      const api = game.modules.get("morelord-craftworks")?.api;
      assert(api, "Craftworks must be ready.");
      assert(!foundry.applications.instances.get("morelord-craftworks-material-browser")?.rendered, "Close Materials before this check.");
      const ids = await api.socket.executeAsGm("materials.harvest-availability");
      assert(Array.isArray(ids) && ids.every(id => typeof id === "string"), "GM must return material IDs only.");
      const verified = new Set(ids);
      const materials = api.materials.all().filter(material => material.packId === "monsters-of-drakkenheim");
      const supported = materials.find(material => verified.has(material.materialId));
      const unsupported = materials.find(material => material.acquisition?.harvestable && !verified.has(material.materialId));
      assert(supported && unsupported, "Load supported and catalog-only Drakkenheim material variants.");
      let app;
      try {
        for (const material of [supported, unsupported]) {
          await api.openMaterials({ materialId: material.materialId });
          app = foundry.applications.instances.get("morelord-craftworks-material-browser");
          for (let attempt = 0; attempt < 200 && app._monsterLookupPending; attempt++) await new Promise(resolve => setTimeout(resolve, 50));
          assert(!app._monsterLookupPending && !app._monsterLookupFailed, "GM verification must finish successfully.");
          const card = app.element.querySelector(".ml-craftworks-material-card");
          assert(card, "Focused material must render.");
          const hasHarvest = [...card.querySelectorAll(".ml-badge")].some(tag => tag.textContent.trim() === "Harvest");
          assert(hasHarvest === verified.has(material.materialId), "Player Harvest tag must agree with GM-verified availability.");
          assert(!card.querySelector("[data-material-source]"), "Player tags must remain passive; source details are GM-only.");
        }
      } finally { await app?.close(); }
    }
  }] });
}
