import { MODULE_ID } from "../constants.mjs";
import {
  SETTINGS,
  getSetting
} from "./settings.mjs";
import {
  CONTENT_PACKS,
  getContentPackSettingKey
} from "../../data/content-packs.mjs";

export class ContentSyncService {
  constructor({
    materialInstaller,
    materialRegistry,
    dnd5eItemResolver = null,
    recipeRegistry = null,
    spellScrollInstaller = null
  }) {
    this.materialInstaller =
      materialInstaller;
    this.materialRegistry =
      materialRegistry;
    this.dnd5eItemResolver =
      dnd5eItemResolver;
    this.recipeRegistry =
      recipeRegistry;
    this.spellScrollInstaller =
      spellScrollInstaller;
    this.running = null;
  }

  setRuntimeServices({
    dnd5eItemResolver = null,
    recipeRegistry = null,
    spellScrollInstaller = null
  } = {}) {
    if (dnd5eItemResolver) {
      this.dnd5eItemResolver =
        dnd5eItemResolver;
    }

    if (recipeRegistry) {
      this.recipeRegistry =
        recipeRegistry;
    }

    if (spellScrollInstaller) {
      this.spellScrollInstaller =
        spellScrollInstaller;
    }
  }

  buildSignature() {
    const module =
      game.modules.get(MODULE_ID);

    const enabledPacks =
      CONTENT_PACKS
        .filter(pack => {
          try {
            return Boolean(
              game.settings.get(
                MODULE_ID,
                getContentPackSettingKey(
                  pack.id
                )
              )
            );
          } catch {
            return Boolean(
              pack.enabledByDefault
            );
          }
        })
        .map(pack => pack.id)
        .sort();

    const itemCompendiums =
      [...game.packs]
        .filter(pack =>
          String(
            pack.documentName
            ?? pack.metadata?.type
            ?? ""
          ) === "Item"
        )
        .map(pack => ({
          collection:
            pack.collection,
          package:
            pack.metadata?.packageName
            ?? pack.metadata?.package
            ?? "",
          system:
            pack.metadata?.system
            ?? ""
        }))
        .sort((a, b) =>
          a.collection.localeCompare(
            b.collection
          )
        );

    const activeContentModules =
      [...game.modules.values()]
        .filter(module =>
          module.active
          && (
            [...game.packs].some(pack =>
              (
                pack.metadata
                  ?.packageName
                ?? pack.metadata
                  ?.package
              ) === module.id
              && String(
                pack.documentName
                ?? pack.metadata?.type
                ?? ""
              ) === "Item"
            )
          )
        )
        .map(module => ({
          id: module.id,
          version:
            module.version
            ?? module.manifest?.version
            ?? ""
        }))
        .sort((a, b) =>
          a.id.localeCompare(b.id)
        );

    return JSON.stringify({
      craftworksVersion:
        module?.version ?? "",
      systemId:
        game.system?.id ?? "",
      systemVersion:
        game.system?.version ?? "",
      enabledPacks,
      itemCompendiums,
      activeContentModules
    });
  }

  needsSync() {
    if (!game.user.isGM) {
      return false;
    }

    const current =
      this.buildSignature();

    const previous =
      String(
        getSetting(
          SETTINGS.CONTENT_SYNC_SIGNATURE
        ) ?? ""
      );

    return current !== previous;
  }

  async sync({
    force = false,
    reason = "manual"
  } = {}) {
    if (!game.user.isGM) {
      throw new Error(
        "Only a GM can synchronize Craftworks content."
      );
    }

    if (this.running) {
      return this.running;
    }

    if (
      !force
      && !this.needsSync()
    ) {
      return {
        skipped: true,
        reason,
        signature:
          this.buildSignature(),
        materials: [],
        materialCreates: 0,
        materialUpdates: 0,
        materialDeletes: 0,
        recipeCount:
          this.recipeRegistry
            ?.all()?.length
          ?? null,
        compendiumCount:
          this.#itemCompendiumCount()
      };
    }

    this.running =
      this.#runSync({
        reason
      });

    try {
      return await this.running;
    } finally {
      this.running = null;
    }
  }

  async #runSync({ reason }) {
    const materialResults =
      await this.materialInstaller
        .installAll();

    const spellScrollResult =
      await this.spellScrollInstaller
        ?.install();

    if (this.dnd5eItemResolver) {
      await this.dnd5eItemResolver
        .refresh();
    }

    if (this.recipeRegistry) {
      await this.recipeRegistry
        .loadStandardSeed();
    }

    const signature =
      this.buildSignature();

    const completedAt =
      new Date().toISOString();

    await game.settings.set(
      MODULE_ID,
      SETTINGS.CONTENT_SYNC_SIGNATURE,
      signature
    );

    await game.settings.set(
      MODULE_ID,
      SETTINGS.CONTENT_SYNC_LAST_AT,
      completedAt
    );

    return {
      skipped: false,
      reason,
      signature,
      completedAt,
      materials:
        materialResults ?? [],
      spellScrolls:
        spellScrollResult ?? null,
      materialCreates:
        sum(
          materialResults,
          "creates"
        ),
      materialUpdates:
        sum(
          materialResults,
          "updates"
        ),
      materialDeletes:
        sum(
          materialResults,
          "deletes"
        ),
      recipeCount:
        this.recipeRegistry
          ?.all()?.length
        ?? null,
      compendiumCount:
        this.#itemCompendiumCount()
    };
  }

  #itemCompendiumCount() {
    return [...game.packs]
      .filter(pack =>
        String(
          pack.documentName
          ?? pack.metadata?.type
          ?? ""
        ) === "Item"
      )
      .length;
  }
}

function sum(
  rows,
  property
) {
  return (rows ?? [])
    .reduce(
      (total, row) =>
        total
        + Number(
          row?.[property] ?? 0
        ),
      0
    );
}
