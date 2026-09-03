import { MODULE_ID } from "./constants.mjs";
import { log } from "./core/logger.mjs";
import {
  registerSettings,
  exposePartyActorSetting,
  ensureStandardContentEnabled
} from "./core/settings.mjs";
import { RecipientResolver } from "./core/recipient-resolver.mjs";
import { createSystemAdapter } from "./core/adapter-registry.mjs";
import { MaterialRegistry } from "./materials/material-registry.mjs";
import { MaterialService } from "./materials/material-service.mjs";
import { AcquisitionSessionManager } from "./acquisition/session-manager.mjs";
import { HarvestService } from "./acquisition/harvest-service.mjs";
import { HarvestPrototypeApp } from "./ui/harvest-app.mjs";
import { HarvestPlayerApp } from "./ui/harvest-player-app.mjs";
import { SocketService } from "./socket/socket-service.mjs";
import { ContentPackMaterialInstaller } from "./dev/content-pack-material-installer.mjs";
import { GatherService } from "./acquisition/gather-service.mjs";
import { LootService } from "./acquisition/loot-service.mjs";
import { SpecialTreasureService } from "./acquisition/special-treasure-service.mjs";
import { HoardService } from "./acquisition/hoard-service.mjs";
import { GatherApp } from "./ui/gather-app.mjs";
import { GatherPlayerApp } from "./ui/gather-player-app.mjs";
import { DeleriumSearchService } from "./acquisition/delerium-search-service.mjs";
import { DeleriumSearchApp } from "./ui/delerium-search-app.mjs";
import { DeleriumSearchPlayerApp } from "./ui/delerium-search-player-app.mjs";
import { LootApp } from "./ui/loot-app.mjs";
import { HoardApp } from "./ui/hoard-app.mjs";
import { RecipeRegistry } from "./recipes/recipe-registry.mjs";
import { Dnd5eCompendiumItemResolver } from "./recipes/dnd5e-compendium-item-resolver.mjs";
import { SpellScrollGeneratorService } from "./scrolls/spell-scroll-generator-service.mjs";
import { SpellScrollCatalogInstaller } from "./scrolls/spell-scroll-catalog-installer.mjs";
import { SpellScrollGeneratorApp } from "./ui/spell-scroll-generator-app.mjs";
import { SpellbookGeneratorService } from "./spellbooks/spellbook-generator-service.mjs";
import { SpellbookGeneratorApp } from "./ui/spellbook-generator-app.mjs";
import { PotionGeneratorService } from "./potions/potion-generator-service.mjs";
import { PotionGeneratorApp } from "./ui/potion-generator-app.mjs";
import { RecipeEvaluator } from "./recipes/recipe-evaluator.mjs";
import { RecipePlanner } from "./recipes/recipe-planner.mjs";
import { ToolInspector } from "./recipes/tool-inspector.mjs";
import { MorelordCoreAccessService } from "./core/morelord-core-access-service.mjs";
import { Dnd5eSourceFilterService } from "./core/dnd5e-source-filter-service.mjs";
import { ContentPackService } from "./core/content-pack-service.mjs";
import { ContentSyncService } from "./core/content-sync-service.mjs";
import { CraftingJobService } from "./crafting/crafting-job-service.mjs";
import { CraftingMaterialService } from "./crafting/crafting-material-service.mjs";
import { CrafterContextService } from "./crafting/crafter-context-service.mjs";
import { MarkedRecipeService } from "./crafting/marked-recipe-service.mjs";
import { CraftingRollService } from "./crafting/crafting-roll-service.mjs";
import { CraftingEnvironmentService } from "./crafting/crafting-environment-service.mjs";
import { isCharacterMemberOfGroup } from "./crafting/group-membership.mjs";
import { CraftworksSettingsApp } from "./ui/craftworks-settings-app.mjs";
import { MaterialBrowserApp } from "./ui/material-browser-app.mjs";
import { RecipeBrowserApp } from "./ui/recipe-browser-app.mjs";
import { CraftworksApp } from "./ui/craftworks-app.mjs";
import { CraftApp } from "./ui/craft-app.mjs";
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

Hooks.once("ready", () => {
  document.addEventListener("click", async event => {
    const row = event.target.closest?.("[data-ml-craftworks-link-target]");
    if (!row) return;

    // Let Foundry handle its native UUID link so the normal document preview,
    // pinning, and click behavior remain available on the linked item name.
    if (event.target.closest?.(".content-link")) return;

    event.preventDefault();
    event.stopPropagation();

    const uuid = row.dataset.mlCraftworksLinkTarget;
    if (!uuid) return;

    try {
      const document = await fromUuid(uuid);
      if (!document) throw new Error("Document not found");
      document.sheet?.render(true);
    } catch {
      ui.notifications.warn("The source Item could not be opened.");
    }
  });
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
  const sourceFilter = new Dnd5eSourceFilterService();
  const adapter = createSystemAdapter({ sourceFilter });
  const coreAccess = new MorelordCoreAccessService();
  await coreAccess.refresh();
  const contentPacks = new ContentPackService({ coreAccess });
  contentPacks.validateManifests();

  const materials = new MaterialRegistry({ contentPacks, sourceFilter });

  const startupMaterialInstaller =
    new ContentPackMaterialInstaller({
      registry: materials,
      contentPacks
    });

  const contentSync =
    new ContentSyncService({
      materialInstaller:
        startupMaterialInstaller,
      materialRegistry:
        materials
    });

  // Only one connected GM should perform world-compendium writes. Other GMs
  // and players simply index the already-synchronized world packs.
  const activeGms =
    game.users
      .filter(user =>
        user.active
        && user.isGM
      )
      .sort((a, b) =>
        a.id.localeCompare(b.id)
      );

  const isSyncCoordinator =
    game.user.isGM
    && (
      !activeGms.length
      || activeGms[0].id
        === game.user.id
    );

  const recipientResolver = new RecipientResolver();
  const materialService = new MaterialService({ registry: materials, adapter, recipientResolver });
  const dnd5eItemResolver = new Dnd5eCompendiumItemResolver({ sourceFilter });
  await dnd5eItemResolver.refresh();

  const spellScrollGenerator = new SpellScrollGeneratorService({
    coreAccess,
    sourceFilter,
    adapter,
    recipientResolver,
    dnd5eItemResolver
  });

  const spellScrollInstaller = new SpellScrollCatalogInstaller({
    spellScrollGenerator
  });

  const spellbookGenerator = new SpellbookGeneratorService({
    spellScrollGenerator,
    adapter,
    recipientResolver
  });

  const potionGenerator = new PotionGeneratorService({
    coreAccess,
    sourceFilter,
    adapter,
    recipientResolver
  });

  const recipes = new RecipeRegistry({
    materialRegistry: materials,
    coreAccess,
    contentPacks,
    dnd5eItemResolver
  });
  contentSync.setRuntimeServices({
    dnd5eItemResolver,
    recipeRegistry: recipes,
    spellScrollInstaller
  });

  if (isSyncCoordinator) {
    await ensureStandardContentEnabled();
  }

  if (
    isSyncCoordinator
    && contentSync.needsSync()
  ) {
    try {
      await contentSync.sync({
          reason: "startup"
        });
    } catch (error) {
      console.warn(
        "Morelord Craftworks | Automatic content synchronization failed.",
        error
      );

      await materials.indexConfiguredPacks();
      await recipes.loadStandardSeed();
    }
  } else {
    await materials.indexConfiguredPacks();
    await recipes.loadStandardSeed();
  }

  const recipeEvaluator = new RecipeEvaluator({ materialRegistry: materials });
  const recipePlanner = new RecipePlanner({
    recipeRegistry: recipes,
    evaluator: recipeEvaluator
  });
  const toolInspector = new ToolInspector();
  const craftingJobs = new CraftingJobService();
  const craftingRolls = new CraftingRollService();
  const craftingEnvironment = new CraftingEnvironmentService();
  const crafterContext = new CrafterContextService();
  const markedRecipes = new MarkedRecipeService();
  const craftingMaterials = new CraftingMaterialService({
    materialRegistry: materials,
    adapter,
    socket
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
  const deleriumSearch = new DeleriumSearchService({
    adapter,
    recipientResolver,
    sessions,
    contentPacks,
    sourceFilter
  });
  const specialTreasure = new SpecialTreasureService({
    sourceFilter
  });
  const loot = new LootService({
    adapter,
    materialRegistry: materials,
    materialService,
    sessions,
    recipientResolver,
    specialTreasure,
    contentPacks,
    potionGenerator,
    spellScrollGenerator
  });

  const hoard = new HoardService({
    adapter,
    materialRegistry: materials,
    recipientResolver,
    specialTreasure,
    potionGenerator,
    spellScrollGenerator
  });
  let gmHarvestApp = null;
  const playerHarvestApps = new Map();
  let gmGatherApp = null;
  let playerGatherApp = null;
  let gmDeleriumSearchApp = null;
  let playerDeleriumSearchApp = null;
  let gmLootApp = null;
  let gmHoardApp = null;
  let materialBrowserApp = null;
  let recipeBrowserApp = null;
  let spellScrollGeneratorApp = null;
  let spellbookGeneratorApp = null;
  let potionGeneratorApp = null;
  let craftworksApp = null;
  let craftApp = null;

  const api = {
    adapter,
    materials,
    materialService,
    recipientResolver,
    sessions,
    harvest,
    gather,
    deleriumSearch,
    loot,
    hoard,
    specialTreasure,
    recipes,
    dnd5eItemResolver,
    sourceFilter,
    spellScrollGenerator,
    spellbookGenerator,
    potionGenerator,
    coreAccess,
    contentPacks,
    contentSync,
    syncContent: options =>
      contentSync.sync({
        force: true,
        reason:
          options?.reason
          ?? "api"
      }),
    recipeEvaluator,
    recipePlanner,
    toolInspector,
    craftingJobs,
    craftingRolls,
    craftingEnvironment,
    craftingMaterials,
    crafterContext,
    markedRecipes,
    socket,
    marketplaceIntegration: {
      isCraftworksItem,
      isPurchasable: isCraftworksPurchasable,
      getMaterialId: getCraftworksMaterialId
    },
    downtimeIntegration: Object.freeze({
      getRecipe: recipeId => recipes.get(recipeId, { includeDisabled: true }),
      listRecipes: () => recipes.all(),
      getFacilityOptions: () => foundry.utils.deepClone(
        craftingEnvironment.facilityOptions()
      ),
      evaluateEnvironment: (recipeOrId, context = {}) => {
        const recipe = typeof recipeOrId === "string"
          ? recipes.get(recipeOrId, { includeDisabled: true })
          : recipeOrId;
        if (!recipe) throw new Error("Craftworks recipe not found.");
        return craftingEnvironment.evaluate(recipe, context);
      },
      getProject: async ({ recipeId, crafterUuid, inventoryActorUuid = null }) => {
        const crafter = await fromUuid(crafterUuid);
        if (!crafter) return null;
        return craftingJobs.getProgress(recipeId, crafter, inventoryActorUuid);
      },
      listProjects: async ({ crafterUuid, activeOnly = false }) => {
        const crafter = await fromUuid(crafterUuid);
        return crafter ? craftingJobs.list(crafter, { activeOnly }) : [];
      },
      describeCommission: (recipeOrId, { provider = null, location = null } = {}) => {
        const recipe = typeof recipeOrId === "string"
          ? recipes.get(recipeOrId, { includeDisabled: true })
          : recipeOrId;
        if (!recipe) throw new Error("Craftworks recipe not found.");
        return foundry.utils.deepClone({
          recipeId: recipe.id,
          name: recipe.name,
          output: recipe.output,
          hoursRequired: recipe.craft?.hoursRequired ?? null,
          environment: recipe.craft?.environment ?? null,
          provider,
          location
        });
      }
    }),
    dev: {
      // Compatibility aliases. Production callers should use syncContent().
      installStandardMaterials: () =>
        contentSync.sync({
          force: true,
          reason: "legacy-install"
        }),
      syncContentPackMaterials: () =>
        contentSync.sync({
          force: true,
          reason: "legacy-sync"
        }),
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
    openDeleriumSearch: async () => {
      if (!game.user.isGM) throw new Error("Only the GM can initiate a delerium search.");
      if (!deleriumSearch.hasAccess) throw new Error("Enable the Monsters of Drakkenheim Content Pack to search for delerium.");
      if (gmDeleriumSearchApp?.rendered) await gmDeleriumSearchApp.close();
      gmDeleriumSearchApp = new DeleriumSearchApp(api);
      return gmDeleriumSearchApp.render({ force: true });
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
    openCraft: async ({ recipeId = null, crafterActorUuid = null, inventoryActorUuid = null } = {}) => {
      if (recipeId && craftApp?.rendered) {
        await craftApp.close();
        craftApp = null;
      }
      if (craftApp?.rendered) {
        await craftApp.render({ force: true });
        craftApp.bringToFront();
        return craftApp;
      }

      craftApp = new CraftApp(api, { recipeId, crafterActorUuid, inventoryActorUuid });

      try {
        return await craftApp.render({ force: true });
      } catch (error) {
        console.error(
          "Morelord Craftworks | Craft window failed to render.",
          error
        );
        craftApp = null;
        throw error;
      }
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
    },
    openSpellbookGenerator: async () => {
      if (!game.user.isGM) {
        throw new Error(
          "Only the GM can use the Spellbook Generator."
        );
      }

      if (spellbookGeneratorApp?.rendered) {
        spellbookGeneratorApp.bringToFront();
        return spellbookGeneratorApp;
      }

      spellbookGeneratorApp =
        new SpellbookGeneratorApp(api);

      return spellbookGeneratorApp.render({
        force: true
      });
    },
    openPotionGenerator: async () => {
      if (!game.user.isGM) {
        throw new Error(
          "Only the GM can use the Potion Generator."
        );
      }

      if (potionGeneratorApp?.rendered) {
        potionGeneratorApp.bringToFront();
        return potionGeneratorApp;
      }

      potionGeneratorApp = new PotionGeneratorApp(api);
      return potionGeneratorApp.render({ force: true });
    }
  };

  CraftworksSettingsApp.craftworks = api;

  socket.on("debug.ping", async ({ message }) => {
    log(`Socket ping received: ${message}`);
    ui.notifications.info(`Morelord Craftworks: ${message}`);
  });

  socket.on("harvest.open", async ({ session, actorUuid }) => {
    log(`Handling harvest.open for session ${session?.id ?? "missing"}.`);
    if (game.user.isGM) return;

    if (!session?.id) {
      throw new Error("Received a Harvest session without a valid session id.");
    }

    const imported = sessions.import(session);
    log(`Imported Harvest session ${imported.id} with ${imported.creatures?.length ?? 0} creature(s).`);

    if (!actorUuid) throw new Error("Received a Harvest session without a character.");
    const existing = playerHarvestApps.get(actorUuid);
    if (existing?.rendered) await existing.close();
    const playerHarvestApp = new HarvestPlayerApp(api, imported, actorUuid);
    playerHarvestApps.set(actorUuid, playerHarvestApp);

    // Constructor hydration loads any pre-seeded automatic-success state.
    // The first client render must still be forced so ApplicationV2 actually
    // opens a newly-created Harvest window.
    await playerHarvestApp.render({
      force: true
    });

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
    await harvest.updatePlayerCompletions(data.sessionId);
    gmHarvestApp?.setSession(sessions.get(data.sessionId));
  });

  socket.on(
    "harvest.batch-attempt",
    async ({
      sessionId,
      userId,
      attempts = []
    }) => {
      if (!game.user.isGM) return;

      const session =
        sessions.get(sessionId);

      if (!session) {
        throw new Error(
          "Harvest session not found."
        );
      }

      for (const attempt of attempts) {
        await harvest.recordAttempt({
          ...attempt,
          sessionId,
          userId
        });
      }

      const authoritative =
        sessions.get(sessionId);

      await harvest.updatePlayerCompletions(sessionId);

      // One session broadcast updates every creature result together. This
      // avoids a cascade of player rerenders during large Harvest batches.
      await socket.emit(
        "harvest.session",
        {
          session: authoritative
        }
      );

      gmHarvestApp?.setSession(
        authoritative
      );
    }
  );

  socket.on("harvest.claim", async data => {
    if (!game.user.isGM) return;

    const resolved = await harvest.claim(data);
    const session = resolved.session;

    await harvest.updatePlayerCompletions(data.sessionId);

    // Broadcast the authoritative session to every connected Harvest client.
    // This mirrors the standalone Drakkenheim Harvesting model: once a claim
    // succeeds, all clients immediately receive the same claim state.
    await socket.emit("harvest.session", {
      session
    });

    gmHarvestApp?.setSession(session);
  });

  socket.on("craft.consume-group-materials", async (data, payload) => {
    if (!game.user.isGM) return { ok: false, error: "A GM must authorize Group inventory changes." };
    try {
      const actor = await fromUuid(data.actorUuid);
      const crafter = await fromUuid(data.crafterUuid);
      const requestingUser = game.users.get(payload.senderUserId);
      if (!actor || actor.type !== "group" || !crafter || crafter.type !== "character") {
        throw new Error("The requested Group inventory or crafter is invalid.");
      }
      if (!requestingUser || !crafter.testUserPermission(requestingUser, "OWNER")) {
        throw new Error("The requesting player does not own this crafter.");
      }
      if (!isCharacterMemberOfGroup(crafter, actor)) {
        throw new Error("The crafter is not a member of this Group actor.");
      }
      const consumedMaterials = await craftingMaterials.consume(actor, data.plan, { crafter });
      return { ok: true, consumedMaterials };
    } catch (error) {
      return { ok: false, error: error.message ?? String(error) };
    }
  });

  socket.on("harvest.release-claims", async ({ sessionId, userId, actorUuid }) => {
    if (!game.user.isGM) return;
    const session = await harvest.releaseClaims(sessionId, userId, actorUuid);
    await socket.emit("harvest.session", { session });
    gmHarvestApp?.setSession(session);
    return { released: true };
  });

  socket.on("harvest.state", async ({ sessionId, creatureTokenUuid, state }) => {
    if (game.user.isGM) return;
    const playerHarvestApp = playerHarvestApps.get(state?.actorUuid);
    if (!playerHarvestApp || playerHarvestApp.session?.id !== sessionId) return;
    await playerHarvestApp.setState(creatureTokenUuid, state);
  });

  socket.on("harvest.session", async ({ session }) => {
    if (game.user.isGM) return;
    if (!session?.id) return;
    const imported = sessions.import(session);
    await Promise.all([...playerHarvestApps.values()]
      .filter(app => app.session?.id === session.id)
      .map(app => app.setSession(imported, { preserveFocus: true })));
  });


  socket.on("gather.open", async ({ session }) => {
    if (game.user.isGM) return;
    const imported = sessions.import(session);
    if (playerGatherApp?.rendered) await playerGatherApp.close();
    playerGatherApp = new GatherPlayerApp(api, imported);
    await playerGatherApp.render({ force: true });
  });

  socket.on("delerium-search.open", async ({ session }) => {
    if (game.user.isGM) return { opened: false, reason: "gm-user" };
    if (!session?.id) throw new Error("Cannot open a Delerium Search without a session.");
    const imported = sessions.import(session);
    if (playerDeleriumSearchApp?.rendered) await playerDeleriumSearchApp.close();
    playerDeleriumSearchApp = new DeleriumSearchPlayerApp(api, imported);
    await playerDeleriumSearchApp.render({ force: true });
    playerDeleriumSearchApp.bringToFront();
    return { opened: true, sessionId: imported.id };
  });

  socket.on("delerium-search.attempt", async data => {
    if (!game.user.isGM) return;
    const state = deleriumSearch.attempt(data);
    await socket.emit("delerium-search.state", { sessionId: data.sessionId, state }, { targetUserId: data.userId });
    gmDeleriumSearchApp?.setSession(sessions.get(data.sessionId));
  });

  socket.on("delerium-search.decline", async data => {
    if (!game.user.isGM) return;
    const state = deleriumSearch.decline(data);
    await socket.emit("delerium-search.state", { sessionId: data.sessionId, state }, { targetUserId: data.userId });
    gmDeleriumSearchApp?.setSession(sessions.get(data.sessionId));
  });

  socket.on("delerium-search.state", async ({ sessionId, state }) => {
    if (game.user.isGM || playerDeleriumSearchApp?.session?.id !== sessionId) return;
    await playerDeleriumSearchApp.setState(state);
  });

  socket.on("delerium-search.complete", async ({ session }) => {
    if (game.user.isGM) return;
    if (playerDeleriumSearchApp?.rendered) await playerDeleriumSearchApp.close();
    playerDeleriumSearchApp = null;
    if (session.randomEncounter) ui.notifications.warn("Two or more characters failed: the search triggers a Random Encounter.");
    ui.notifications.info(session.reward ? `The search located ${session.reward.name}; the GM is resolving the award.` : "The delerium search found nothing.");
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
      if (data.potions?.length) parts.push(`${data.potions.length} potion${data.potions.length === 1 ? "" : "s"}`);
      if (data.spellScrolls?.length) parts.push(`${data.spellScrolls.length} spell scroll${data.spellScrolls.length === 1 ? "" : "s"}`);
      if (data.customItems?.length) parts.push(data.customItems.map(item => item.name).join(", "));
      if (data.coinTotalCopper > 0) parts.push(data.coinLabel);
      if (data.special?.itemName) parts.push(data.special.itemName);
      ui.notifications.info(`The party recovered ${parts.join("; ")}. Sent to ${data.actorName}.`);
    } else {
      ui.notifications.info("The party recovered no encounter loot.");
    }
  });

  socket.on("harvest.cancel", async ({ sessionId }) => {
    if (game.user.isGM) return;

    log(
      `Closing Harvest client window for cancelled session ${
        sessionId ?? "unknown"
      }.`
    );

    for (const app of playerHarvestApps.values()) if (app.rendered) await app.close();
    playerHarvestApps.clear();

    ui.notifications.info(
      "Harvesting was cancelled by the GM."
    );
  });

  socket.on("harvest.complete", async ({ sessionId }) => {
    if (game.user.isGM) return;

    log(`Closing Harvest client window for finalized session ${sessionId}.`);

    for (const app of playerHarvestApps.values()) if (app.rendered) await app.close();
    playerHarvestApps.clear();

    ui.notifications.info("Harvesting has been completed by the GM.");
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
  globalThis.MorelordCraftworks = api;

  log("Ready. API available as game.modules.get('morelord-craftworks').api and MorelordCraftworks.");
});
