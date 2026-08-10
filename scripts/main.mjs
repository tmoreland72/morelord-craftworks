import { MODULE_ID } from "./constants.mjs";
import { log } from "./core/logger.mjs";
import { registerSettings, exposePartyActorSetting } from "./core/settings.mjs";
import { RecipientResolver } from "./core/recipient-resolver.mjs";
import { createSystemAdapter } from "./core/adapter-registry.mjs";
import { MaterialRegistry } from "./materials/material-registry.mjs";
import { MaterialService } from "./materials/material-service.mjs";
import { AcquisitionSessionManager } from "./acquisition/session-manager.mjs";
import { HarvestService } from "./acquisition/harvest-service.mjs";
import { HarvestPrototypeApp } from "./ui/harvest-app.mjs";
import { HarvestPlayerApp } from "./ui/harvest-player-app.mjs";
import { SocketService } from "./socket/socket-service.mjs";
import { StandardMaterialInstaller } from "./dev/standard-material-installer.mjs";
import { GatherService } from "./acquisition/gather-service.mjs";
import { LootService } from "./acquisition/loot-service.mjs";
import { SpecialTreasureService } from "./acquisition/special-treasure-service.mjs";
import { HoardService } from "./acquisition/hoard-service.mjs";
import { GatherApp } from "./ui/gather-app.mjs";
import { GatherPlayerApp } from "./ui/gather-player-app.mjs";
import { LootApp } from "./ui/loot-app.mjs";
import { HoardApp } from "./ui/hoard-app.mjs";
import { RecipeRegistry } from "./recipes/recipe-registry.mjs";
import { Dnd5eCompendiumItemResolver } from "./recipes/dnd5e-compendium-item-resolver.mjs";
import { SpellScrollGeneratorService } from "./scrolls/spell-scroll-generator-service.mjs";
import { SpellScrollGeneratorApp } from "./ui/spell-scroll-generator-app.mjs";
import { RecipeEvaluator } from "./recipes/recipe-evaluator.mjs";
import { RecipePlanner } from "./recipes/recipe-planner.mjs";
import { ToolInspector } from "./recipes/tool-inspector.mjs";
import { MorelordCoreAccessService } from "./core/morelord-core-access-service.mjs";
import { ContentPackService } from "./core/content-pack-service.mjs";
import { CraftingJobService } from "./crafting/crafting-job-service.mjs";
import { CraftingMaterialService } from "./crafting/crafting-material-service.mjs";
import { CraftingRollService } from "./crafting/crafting-roll-service.mjs";
import { CraftworksSettingsApp } from "./ui/craftworks-settings-app.mjs";
import { MaterialBrowserApp } from "./ui/material-browser-app.mjs";
import { RecipeBrowserApp } from "./ui/recipe-browser-app.mjs";
import { CraftworksApp } from "./ui/craftworks-app.mjs";
import {
  getCraftworksMaterialId,
  isCraftworksItem,
  isCraftworksPurchasable
} from "./integrations/marketplace-contract.mjs";

// Register for socketlib.ready as early as possible. Socketlib recommends module
// registration during that hook on every connected client.
const socket = new SocketService();
socket.start();

Hooks.once("init", () => {
  registerSettings();
  log("Initializing.");
});

Hooks.on("getSceneControlButtons", controls => {
  const tokenTools = controls?.tokens?.tools;
  if (!tokenTools) return;

  tokenTools.morelordCraftworks = {
    name: "morelordCraftworks",
    title: "Morelord Craftworks",
    icon: "fa-solid fa-hammer",
    order: Object.keys(tokenTools).length,
    button: true,
    visible: true,
    onChange: () => {
      const api = globalThis.MorelordCraftworks
        ?? game.modules.get(MODULE_ID)?.api;

      if (!api?.open) {
        ui.notifications.warn("Morelord Craftworks is still initializing.");
        return;
      }

      api.open();
    }
  };
});

Hooks.once("ready", async () => {
  exposePartyActorSetting();
  const adapter = createSystemAdapter();
  const coreAccess = new MorelordCoreAccessService();
  await coreAccess.refresh();
  const contentPacks = new ContentPackService({ coreAccess });
  contentPacks.validateManifests();

  const materials = new MaterialRegistry({ contentPacks });

  // Standard material Items are world compendium documents. Synchronize them
  // from Craftworks' own static material seed before indexing so existing
  // worlds receive current names, metadata, and icon paths.
  const startupMaterialInstaller = new StandardMaterialInstaller({
    registry: materials
  });

  if (game.user.isGM) {
    try {
      await startupMaterialInstaller.install();
    } catch (error) {
      console.warn(
        "Morelord Craftworks | Automatic Standard material synchronization failed.",
        error
      );
      await materials.indexConfiguredPacks();
    }
  } else {
    await materials.indexConfiguredPacks();
  }

  const recipientResolver = new RecipientResolver();
  const materialService = new MaterialService({ registry: materials, adapter, recipientResolver });
  const dnd5eItemResolver = new Dnd5eCompendiumItemResolver();
  await dnd5eItemResolver.refresh();

  const spellScrollGenerator = new SpellScrollGeneratorService({
    coreAccess
  });

  const recipes = new RecipeRegistry({
    materialRegistry: materials,
    coreAccess,
    contentPacks,
    dnd5eItemResolver
  });
  await recipes.loadStandardSeed();
  const recipeEvaluator = new RecipeEvaluator({ materialRegistry: materials });
  const recipePlanner = new RecipePlanner({
    recipeRegistry: recipes,
    evaluator: recipeEvaluator
  });
  const toolInspector = new ToolInspector();
  const craftingJobs = new CraftingJobService();
  const craftingRolls = new CraftingRollService();
  const craftingMaterials = new CraftingMaterialService({
    materialRegistry: materials,
    adapter
  });
  const sessions = new AcquisitionSessionManager();
  const harvest = new HarvestService({
    adapter,
    materialRegistry: materials,
    materialService,
    sessions,
    contentPacks
  });
  const gather = new GatherService({
    adapter,
    materialRegistry: materials,
    materialService,
    sessions,
    contentPacks
  });
  const specialTreasure = new SpecialTreasureService();
  const loot = new LootService({
    adapter,
    materialRegistry: materials,
    materialService,
    sessions,
    recipientResolver,
    specialTreasure,
    contentPacks
  });

  const hoard = new HoardService({
    adapter,
    materialRegistry: materials,
    recipientResolver,
    specialTreasure
  });
  const standardMaterialInstaller = new StandardMaterialInstaller({
    registry: materials
  });

  let gmHarvestApp = null;
  let playerHarvestApp = null;
  let gmGatherApp = null;
  let playerGatherApp = null;
  let gmLootApp = null;
  let gmHoardApp = null;
  let materialBrowserApp = null;
  let recipeBrowserApp = null;
  let spellScrollGeneratorApp = null;
  let craftworksApp = null;

  const api = {
    adapter,
    materials,
    materialService,
    recipientResolver,
    sessions,
    harvest,
    gather,
    loot,
    hoard,
    specialTreasure,
    recipes,
    dnd5eItemResolver,
    spellScrollGenerator,
    coreAccess,
    contentPacks,
    recipeEvaluator,
    recipePlanner,
    toolInspector,
    craftingJobs,
    craftingRolls,
    craftingMaterials,
    socket,
    marketplaceIntegration: {
      isCraftworksItem,
      isPurchasable: isCraftworksPurchasable,
      getMaterialId: getCraftworksMaterialId
    },
    dev: {
      installStandardMaterials: () => standardMaterialInstaller.install(),
      socketPing: targetUserId => socket.ping(targetUserId)
    },
    openHarvest: () => {
      if (!game.user.isGM) throw new Error("Only the GM can initiate harvesting.");
      gmHarvestApp = gmHarvestApp ?? new HarvestPrototypeApp(api);
      return gmHarvestApp.render({ force: true });
    },
    openCraftworks: async () => {
      if (craftworksApp?.rendered) {
        craftworksApp.bringToFront();
        return craftworksApp;
      }
      craftworksApp = new CraftworksApp(api);
      return craftworksApp.render({ force: true });
    },
    open: async () => {
      if (craftworksApp?.rendered) {
        craftworksApp.bringToFront();
        return craftworksApp;
      }
      craftworksApp = new CraftworksApp(api);
      return craftworksApp.render({ force: true });
    },
    openHarvestPrototype: () => {
      if (!game.user.isGM) throw new Error("Only the GM can initiate harvesting.");
      gmHarvestApp = gmHarvestApp ?? new HarvestPrototypeApp(api);
      return gmHarvestApp.render({ force: true });
    },
    openGather: async () => {
      if (!game.user.isGM) throw new Error("Only the GM can initiate gathering.");
      if (gmGatherApp?.rendered) await gmGatherApp.close();
      gmGatherApp = new GatherApp(api);
      return gmGatherApp.render({ force: true });
    },
    openLoot: () => {
      if (!game.user.isGM) throw new Error("Only the GM can initiate Encounter Loot.");
      if (gmLootApp?.rendered) gmLootApp.close();
      gmLootApp = new LootApp(api);
      return gmLootApp.render({ force: true });
    },
    openHoard: () => {
      if (!game.user.isGM) throw new Error("Only the GM can generate a treasure hoard.");
      if (gmHoardApp?.rendered) gmHoardApp.close();
      gmHoardApp = new HoardApp(api);
      return gmHoardApp.render({ force: true });
    },
    openMaterials: async ({ materialId = null } = {}) => {
      if (!materialBrowserApp) {
        materialBrowserApp = new MaterialBrowserApp(api);
      }

      if (materialId) {
        materialBrowserApp.focusMaterial(materialId);
      }

      if (materialBrowserApp.rendered) {
        await materialBrowserApp.render({ force: true });
        materialBrowserApp.bringToFront();
        return materialBrowserApp;
      }

      return materialBrowserApp.render({ force: true });
    },
    openRecipes: async () => {
      if (recipeBrowserApp?.rendered) await recipeBrowserApp.close();
      recipeBrowserApp = new RecipeBrowserApp(api);
      return recipeBrowserApp.render({ force: true });
    },
    openSpellScrollGenerator: async () => {
      if (!game.user.isGM) {
        throw new Error(
          "Only the GM can use the Spell Scroll Generator."
        );
      }

      if (spellScrollGeneratorApp?.rendered) {
        spellScrollGeneratorApp.bringToFront();
        return spellScrollGeneratorApp;
      }

      spellScrollGeneratorApp = new SpellScrollGeneratorApp(api);
      return spellScrollGeneratorApp.render({ force: true });
    }
  };

  CraftworksSettingsApp.craftworks = api;

  socket.on("debug.ping", async ({ message }) => {
    log(`Socket ping received: ${message}`);
    ui.notifications.info(`Morelord Craftworks: ${message}`);
  });

  socket.on("harvest.open", async ({ session }) => {
    log(`Handling harvest.open for session ${session?.id ?? "missing"}.`);
    if (game.user.isGM) return;

    if (!session?.id) {
      throw new Error("Received a Harvest session without a valid session id.");
    }

    const imported = sessions.import(session);
    log(`Imported Harvest session ${imported.id} with ${imported.creatures?.length ?? 0} creature(s).`);

    if (playerHarvestApp?.rendered) {
      await playerHarvestApp.close();
    }

    playerHarvestApp = new HarvestPlayerApp(api, imported);
    await playerHarvestApp.render({ force: true });

    log(`Player Harvest window rendered for session ${imported.id}.`);
  });

  socket.on("harvest.attempt", async data => {
    if (!game.user.isGM) return;
    const state = await harvest.recordAttempt(data);
    log(
      `Harvest attempt resolved for ${data.creatureTokenUuid}: `
      + `${state.status}${state.choices ? ` (${state.choices.length} choice(s))` : ""}.`
    );
    socket.emit("harvest.state", {
      sessionId: data.sessionId,
      creatureTokenUuid: data.creatureTokenUuid,
      state
    }, { targetUserId: data.userId });
    gmHarvestApp?.setSession(sessions.get(data.sessionId));
  });

  socket.on("harvest.claim", async data => {
    if (!game.user.isGM) return;
    const state = await harvest.claim(data);
    socket.emit("harvest.state", {
      sessionId: data.sessionId,
      creatureTokenUuid: data.creatureTokenUuid,
      state
    }, { targetUserId: data.userId });
    gmHarvestApp?.setSession(sessions.get(data.sessionId));
  });

  socket.on("harvest.state", async ({ sessionId, creatureTokenUuid, state }) => {
    if (game.user.isGM) return;
    if (!playerHarvestApp || playerHarvestApp.session?.id !== sessionId) return;
    await playerHarvestApp.setState(creatureTokenUuid, state);
  });


  socket.on("gather.open", async ({ session }) => {
    if (game.user.isGM) return;
    const imported = sessions.import(session);
    if (playerGatherApp?.rendered) await playerGatherApp.close();
    playerGatherApp = new GatherPlayerApp(api, imported);
    await playerGatherApp.render({ force: true });
  });

  socket.on("gather.attempt", async data => {
    if (!game.user.isGM) return;
    const state = await gather.attempt(data);
    await socket.emit("gather.state", {
      sessionId: data.sessionId,
      state
    }, { targetUserId: data.userId });
    gmGatherApp?.setSession(sessions.get(data.sessionId));
  });

  socket.on("gather.decline", async data => {
    if (!game.user.isGM) return;
    const state = gather.decline(data);
    await socket.emit("gather.state", {
      sessionId: data.sessionId,
      state
    }, { targetUserId: data.userId });
    gmGatherApp?.setSession(sessions.get(data.sessionId));
  });

  socket.on("gather.state", async ({ sessionId, state }) => {
    if (game.user.isGM) return;
    if (!playerGatherApp || playerGatherApp.session?.id !== sessionId) return;
    await playerGatherApp.setState(state);
  });

  socket.on("gather.complete", async ({ sessionId }) => {
    if (game.user.isGM) return;
    if (playerGatherApp?.rendered) await playerGatherApp.close();
    playerGatherApp = null;
    for (const app of GatherPlayerApp.instances()) {
      if (app.rendered) await app.close();
    }
    ui.notifications.info("Gathering has been completed by the GM.");
  });

  socket.on("loot.complete", async data => {
    if (game.user.isGM) return;
    if (data.found) {
      const parts = [];
      const materials = (data.materials ?? []).map(m => `${m.name} ×${m.quantity}`).join(", ");
      if (materials) parts.push(materials);
      if (data.coinTotalCopper > 0) parts.push(data.coinLabel);
      if (data.special?.itemName) parts.push(data.special.itemName);
      ui.notifications.info(`The party recovered ${parts.join("; ")}. Sent to ${data.actorName}.`);
    } else {
      ui.notifications.info("The party recovered no encounter loot.");
    }
  });

  socket.on("harvest.complete", async ({ sessionId }) => {
    if (game.user.isGM) return;

    log(`Closing Harvest client window for finalized session ${sessionId}.`);

    if (playerHarvestApp?.rendered) {
      await playerHarvestApp.close();
    }
    playerHarvestApp = null;

    // ApplicationV2 tracks live instances directly on the class.
    for (const app of HarvestPlayerApp.instances()) {
      if (app.rendered) await app.close();
    }

    ui.notifications.info("Harvesting has been completed by the GM.");
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
  globalThis.MorelordCraftworks = api;

  log("Ready. API available as game.modules.get('morelord-craftworks').api and MorelordCraftworks.");
});
