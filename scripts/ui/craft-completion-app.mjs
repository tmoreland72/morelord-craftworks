import { itemRarity } from "../../../morelord-core/scripts/services/item-rarity.js";
import { MODULE_TITLE } from "../constants.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const {
  ApplicationV2,
  HandlebarsApplicationMixin
} = foundry.applications.api;

export class CraftCompletionApp
  extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  #placing = false;

  constructor(
    craftworks,
    {
      recipe,
      crafter,
      progress,
      onPlaced = null
    } = {},
    options = {}
  ) {
    super(options);
    this.craftworks = craftworks;
    this.recipe = recipe;
    this.crafter = crafter;
    this.progress = progress;
    this.onPlaced = onPlaced;
    this.resolvedOutput = null;
    this.partyActor = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-craft-complete",
    classes: [
      "ml-window",
      "ml-craftworks-module",
      "ml-craftworks-window",
      "ml-craftworks-craft-complete-window"
    ],
    position: {
      width: 720,
      height: 720
    },
    window: {
      title: `${MODULE_TITLE} — Crafting Complete`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template:
        "modules/morelord-craftworks/templates/craft-completion.hbs"
    }
  };

  async _prepareContext(options) {
    const context =
      await super._prepareContext(options);

    this.resolvedOutput =
      await this.craftworks.craftingMaterials
        .resolveOutput(this.recipe);

    const source = this.resolvedOutput.source;

    const partyInfo =
      await this.craftworks.materialService
        .getPartyRecipientInfo();

    this.partyActor =
      partyInfo?.valid
        ? await fromUuid(partyInfo.actorUuid)
        : null;

    if (this.partyActor?.type !== "group") {
      this.partyActor = null;
    }

    const description = await TextEditor.enrichHTML(
      String(
        source.system?.description?.value
        ?? ""
      ),
      {
        async: true,
        documents: true
      }
    );

    const rarity =
      itemRarity(source.system)
      ?? source.system?.type?.value
      ?? null;

    const price =
      source.system?.price?.value
      ?? source.system?.price
      ?? null;

    const sourceLabel =
      this.recipe.output?.sourceBook
      ?? this.craftworks.sourceFilter
        ?.sourceLabelForPack(source.pack)
      ?? this.craftworks.contentPacks
        ?.get(this.recipe.packId)?.label
      ?? this.recipe.packLabel
      ?? null;

    return foundry.utils.mergeObject(
      context,
      {
        recipeName: this.recipe.name,
        crafterName: this.crafter.name,
        itemName: source.name,
        itemImg: source.img,
        quantity: this.resolvedOutput.quantity,
        itemUuid: source.uuid,
        description,
        rarity,
        price,
        sourceLabel,
        partyActor: this.partyActor
          ? {
              uuid: this.partyActor.uuid,
              name: this.partyActor.name
            }
          : null
      },
      { inplace: false }
    );
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    const root = this.element;
    if (!root || root.dataset.craftCompletionBound === "true") return;
    root.dataset.craftCompletionBound = "true";
    root.addEventListener("click", event => {
      const action = event.target?.closest?.("[data-action]")?.dataset.action;
      if (!action) return;
      if (action === "open-item") {
        event.preventDefault();
        this.resolvedOutput?.source?.sheet?.render(true);
        return;
      }
      if (action === "place-self") {
        event.preventDefault();
        void this.#place(this.crafter);
        return;
      }
      if (action === "place-party") {
        event.preventDefault();
        void this.#place(this.partyActor);
      }
    });
  }

  async #place(destination) {
    if (this.#placing || !destination) return;
    this.#placing = true;
    const buttons = [...this.element?.querySelectorAll?.(
      "[data-action='place-self'], [data-action='place-party']"
    ) ?? []];
    for (const button of buttons) button.disabled = true;

    try {
      const awarded =
        await this.craftworks.craftingMaterials
          .awardOutput(destination, this.recipe);

      await this.craftworks.craftingJobs
        .markOutputAwarded(
          this.recipe.id,
          this.crafter,
          this.progress?.inventoryActorUuid
        );

      await this.onPlaced?.({
        destination,
        awarded
      });

      ui.notifications.info(
        `${awarded.quantity} × ${awarded.label} added to ${destination.name}.`
      );

      await this.close();
    } catch (error) {
      this.#placing = false;
      for (const button of buttons) button.disabled = false;
      console.error(
        "Morelord Craftworks | Failed to place crafted output.",
        error
      );
      ui.notifications.error(error.message);
    }
  }
}
