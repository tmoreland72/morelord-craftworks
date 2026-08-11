import { MODULE_TITLE } from "../constants.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class HarvestPlayerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, session, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = session;
    this.states = {};
    this.focusedCreatureTokenUuid = null;
    this.collapsedCreatures = new Set();
    this.selectedSkills = new Map();
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-harvest-player",
    classes: ["morelord-craftworks", "mcw-window", "mcw", "mcw-harvest-modern"],
    position: {
      width: 820,
      height: 720
    },
    window: {
      title: `${MODULE_TITLE} — Harvest`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/harvest-player.hbs"
    }
  };

  async setSession(session, { preserveFocus = false } = {}) {
    this.session = session;

    // Keep local per-creature state synchronized with the authoritative
    // session sent by the GM.
    for (const creature of session?.creatures ?? []) {
      const state =
        session.participants?.[`${game.user.id}:${creature.tokenUuid}`]
        ?? null;

      if (state) {
        this.states[creature.tokenUuid] =
          foundry.utils.deepClone(state);

        if (state.status === "claimed") {
          this.collapsedCreatures.add(
            creature.tokenUuid
          );
        }
      }
    }

    if (!preserveFocus) {
      this.focusedCreatureTokenUuid = null;
    }

    await this.render();

    if (preserveFocus && this.focusedCreatureTokenUuid) {
      this.#focusCreature(this.focusedCreatureTokenUuid);
    }

    return this;
  }

  async setState(creatureTokenUuid, state) {
    this.states[creatureTokenUuid] = state;
    this.focusedCreatureTokenUuid = creatureTokenUuid;
    await this.render();
    this.#focusCreature(creatureTokenUuid);
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.craftworks.adapter.getActorForUser(game.user);

    // Recipe marks live on the Crafter actor used by the Craft window.
    // That actor can differ from adapter.getActorForUser() when the user has
    // multiple owned characters or is controlling a different token.
    const markedRecipeActor =
      this.craftworks.crafterContext?.resolve()
      ?? actor;

    const markedRecipes = markedRecipeActor
      ? this.craftworks.markedRecipes
          .list(markedRecipeActor)
          .map(recipeId =>
            this.craftworks.recipes.get(recipeId, {
              includeDisabled: true
            })
          )
          .filter(Boolean)
      : [];

    const creatures = [];
    for (const creature of this.session.creatures) {
      const priorHarvest = actor
        ? await this.craftworks.harvest.getHarvestRecord(creature.tokenUuid, actor.uuid)
        : null;
      const state = this.states[creature.tokenUuid] ?? null;

      if (state?.skillId && !this.selectedSkills.has(creature.tokenUuid)) {
        this.selectedSkills.set(creature.tokenUuid, state.skillId);
      }

      const selectedSkill =
        this.selectedSkills.get(creature.tokenUuid)
        ?? state?.skillId
        ?? "";

      const choiceComponentIds = new Set(
        (state?.choices ?? [])
          .map(choice => choice.componentId)
          .filter(Boolean)
      );

      const choiceMaterialIds = new Set(
        (state?.choices ?? [])
          .map(choice => choice.materialId)
          .filter(Boolean)
      );

      const claimsByComponentId = new Map(
        (this.session.results ?? [])
          .filter(result => result.creatureTokenUuid === creature.tokenUuid)
          .map(result => [result.componentId, result])
      );

      const components = (creature.components ?? [])
        .filter(component => component.matched && component.materialId)
        .map(component => {
          const globalClaim =
            claimsByComponentId.get(component.id)
            ?? null;

          const inChoices =
            choiceComponentIds.has(component.id)
            || (
              !choiceComponentIds.size
              && choiceMaterialIds.has(component.materialId)
            );

          const material =
            this.craftworks.materials.get(component.materialId)
            ?? component;

          const neededByRecipes = markedRecipes
            .filter(recipe =>
              this.#recipeCanUseMaterial(recipe, material)
            )
            .map(recipe => recipe.name);

          return {
            ...component,
            componentName: component.componentName ?? component.name,
            category:
              component.category
              ?? (creature.harvestMode === "drakkenheim"
                ? "Drakkenheim Component"
                : "Harvest Material"),
            neededForCrafting: neededByRecipes.length > 0,
            neededByRecipes,
            neededByLabel: neededByRecipes.join(", "),
            claimable:
              state?.status === "awaiting-claim"
              && inChoices
              && !globalClaim,
            claimed:
              Boolean(globalClaim),
            claimedByCurrentUser:
              globalClaim?.userId === game.user.id,
            claimantName:
              globalClaim?.actorName
              ?? globalClaim?.userName
              ?? null,
            claimRoll:
              globalClaim?.rollTotal
              ?? null
          };
        });

      creatures.push({
        ...creature,
        actorName: creature.name,
        rarity: creature.harvestRarity ?? null,
        state,
        alreadyHarvested: Boolean(priorHarvest) && !state,
        isCollapsed: this.collapsedCreatures.has(creature.tokenUuid),
        selectedSkill,
        checkLocked: Boolean(priorHarvest || state?.status),
        canRoll: Boolean(
          actor
          && selectedSkill
          && !priorHarvest
          && !state?.status
        ),
        skillOptions: this.craftworks.harvest.getSkillOptions().map(skill => ({
          ...skill,
          selected: skill.id === selectedSkill
        })),
        displayComponents: components
      });
    }

    return foundry.utils.mergeObject(context, {
      session: this.session,
      actor: actor ? { name: actor.name, img: actor.img, uuid: actor.uuid } : null,
      skills: this.craftworks.harvest.getSkillOptions(),
      creatures,
      claimedItems: (this.session.results ?? [])
        .map(result => {
          const material =
            this.craftworks.materials.get(result.materialId)
            ?? null;

          const neededByRecipes = material
            ? markedRecipes
                .filter(recipe =>
                  this.#recipeCanUseMaterial(recipe, material)
                )
                .map(recipe => recipe.name)
            : [];

          return {
            ...result,
            displayName:
              result.componentName
              ?? result.materialName
              ?? "Claimed Component",
            displayImg:
              result.materialImg
              ?? "",
            displayRarity:
              result.rarity
              ?? "Unspecified",
            displayClaimant:
              result.actorName
              ?? result.userName
              ?? "Unknown",
            displayRoll:
              result.rollTotal
              ?? "—",
            linkUuid:
              result.sourceItemUuid
              ?? result.itemUuid
              ?? null,
            neededForCrafting: neededByRecipes.length > 0,
            neededByLabel: neededByRecipes.join(", ")
          };
        })
        .sort((a, b) =>
          Number(a.claimedAt ?? 0)
          - Number(b.claimedAt ?? 0)
        ),
      summary: {
        creatures: creatures.length,
        completed: creatures.filter(c => c.alreadyHarvested || c.state?.status === "claimed" || c.state?.status === "failed").length,
        drakkenheim: creatures.filter(c => c.harvestMode === "drakkenheim").length,
        claimed: (this.session.results ?? []).length
      }
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelectorAll("[data-action='select-skill']")
      .forEach(select => select.addEventListener("change", event => {
        const creatureTokenUuid = event.currentTarget.dataset.creature;
        const skillId = String(event.currentTarget.value ?? "");

        if (skillId) this.selectedSkills.set(creatureTokenUuid, skillId);
        else this.selectedSkills.delete(creatureTokenUuid);

        const rollButton = this.element.querySelector(
          `[data-action="roll"][data-creature="${CSS.escape(creatureTokenUuid)}"]`
        );

        if (rollButton) rollButton.disabled = !skillId;
      }));

    this.element.querySelectorAll("[data-action='roll']")
      .forEach(button => button.addEventListener("click", event => this.#roll(event)));

    this.element.querySelectorAll("[data-action='claim']")
      .forEach(button => button.addEventListener("click", event => this.#claim(event)));

    this.element.querySelectorAll("[data-action='toggle-creature']")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();
        const id = button.dataset.creature;
        if (!id) return;
        if (this.collapsedCreatures.has(id)) this.collapsedCreatures.delete(id);
        else this.collapsedCreatures.add(id);
        await this.render();
      }));

    this.element.querySelectorAll("[data-action='open-claimed-item']")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();

        const uuid = button.dataset.uuid;
        if (!uuid) return;

        try {
          const item = await fromUuid(uuid);
          if (item?.sheet) {
            item.sheet.render(true);
          }
        } catch {
          // Some clients may not have permission to open another actor's
          // embedded item. The row remains useful without the link.
        }
      }));

    this.element.querySelectorAll("[data-action='close']")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();
        await this.close();
      }));

    if (this.focusedCreatureTokenUuid) {
      this.#focusCreature(this.focusedCreatureTokenUuid);
    }
  }

  #recipeCanUseMaterial(recipe, material) {
    if (!recipe || !material) return false;

    return (recipe.requirementGroups ?? []).some(group =>
      (group.requirements ?? []).some(requirement => {
        if (requirement.type === "alternatives") {
          return (requirement.alternatives ?? []).some(alternative =>
            this.#materialMatches(alternative.match, material)
          );
        }

        return this.#materialMatches(requirement.match, material);
      })
    );
  }

  #materialMatches(match, material) {
    if (!match || !material) return false;

    if (
      match.materialId
      && String(material.materialId ?? "") !== String(match.materialId)
    ) {
      return false;
    }

    if (
      match.itemName
      && String(material.name ?? "").trim().toLowerCase()
        !== String(match.itemName).trim().toLowerCase()
    ) {
      return false;
    }

    if (
      match.rarity
      && String(material.rarity ?? "").toLowerCase()
        !== String(match.rarity).toLowerCase()
    ) {
      return false;
    }

    if (
      match.category
      && String(material.category ?? "").toLowerCase()
        !== String(match.category).toLowerCase()
    ) {
      return false;
    }

    if (
      match.stage
      && String(material.stage ?? "").toLowerCase()
        !== String(match.stage).toLowerCase()
    ) {
      return false;
    }

    if (match.tags?.length) {
      const tags = new Set(
        (material.tags ?? [])
          .map(tag => String(tag).toLowerCase())
      );

      if (
        !match.tags.every(tag =>
          tags.has(String(tag).toLowerCase())
        )
      ) {
        return false;
      }
    }

    return true;
  }

  async #roll(event) {
    const button = event.currentTarget;
    const creatureTokenUuid = button.dataset.creature;
    const skillId = this.selectedSkills.get(creatureTokenUuid) ?? "";
    const creature = this.session.creatures.find(c => c.tokenUuid === creatureTokenUuid);

    if (!skillId) {
      return ui.notifications.warn("Choose a harvest skill before rolling.");
    }
    const actor = this.craftworks.adapter.getActorForUser(game.user);

    if (!actor) {
      return ui.notifications.error("Select a token you own or configure a user character first.");
    }

    if (await this.craftworks.harvest.hasHarvested(creatureTokenUuid, actor.uuid)) {
      return ui.notifications.warn(`${actor.name} has already attempted to harvest this creature.`);
    }

    button.disabled = true;
    try {
      const roll = await this.craftworks.adapter.rollSkill(actor, skillId, {
        dc: creature.dc,
        flavor: `Harvest ${creature.name} — DC ${creature.dc}`
      });

      if (roll?.cancelled) {
        button.disabled = false;
        return;
      }

      this.states[creatureTokenUuid] = {
        status: "pending",
        total: roll.total,
        skillId
      };
      this.focusedCreatureTokenUuid = creatureTokenUuid;
      await this.render();
      this.#focusCreature(creatureTokenUuid);

      await this.craftworks.socket.emit("harvest.attempt", {
        sessionId: this.session.id,
        creatureTokenUuid,
        userId: game.user.id,
        actorUuid: actor.uuid,
        skillId,
        total: roll.total,
        naturalD20: roll.naturalD20
      });
    } catch (err) {
      ui.notifications.error(err.message);
      button.disabled = false;
    }
  }

  #focusCreature(creatureTokenUuid) {
    if (!creatureTokenUuid || !this.element) return;

    requestAnimationFrame(() => {
      const selector = `[data-creature-token="${CSS.escape(creatureTokenUuid)}"]`;
      const card = this.element.querySelector(selector);
      card?.scrollIntoView({ block: "nearest", behavior: "instant" });
    });
  }

  async #claim(event) {
    const button = event.currentTarget;
    button.disabled = true;

    await this.craftworks.socket.emit("harvest.claim", {
      sessionId: this.session.id,
      creatureTokenUuid: button.dataset.creature,
      userId: game.user.id,
      materialId: button.dataset.material,
      componentId: button.dataset.component || null
    });
  }
}
