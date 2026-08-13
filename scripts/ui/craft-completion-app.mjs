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
      "morelord-craftworks",
      "mcw-window",
      "mcw-craft-complete-window"
    ],
    position: {
      width: 620,
      height: 650
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
      source.system?.rarity
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

    this.element
      .querySelector("[data-action='open-item']")
      ?.addEventListener(
        "click",
        () => this.resolvedOutput?.source
          ?.sheet?.render(true)
      );

    this.element
      .querySelector("[data-action='place-self']")
      ?.addEventListener(
        "click",
        () => this.#place(this.crafter)
      );

    this.element
      .querySelector("[data-action='place-party']")
      ?.addEventListener(
        "click",
        () => this.#place(this.partyActor)
      );
  }

  async #place(destination) {
    if (!destination) return;

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
      console.error(
        "Morelord Craftworks | Failed to place crafted output.",
        error
      );
      ui.notifications.error(error.message);
    }
  }
}
