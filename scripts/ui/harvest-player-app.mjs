import { MODULE_TITLE } from "../constants.mjs";
import { materialTagsSatisfy } from "../materials/material-match-utils.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class HarvestPlayerApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, session, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = session;
    this.states = {};
    this.focusedCreatureTokenUuid = null;
    this.collapsedCreatures = new Set();
    this.selectedHarvestSkill = "";
    this.recipeMatchesByMaterial = new Map();

    // A Harvest session may already contain authoritative participant state
    // before the player window opens (for example when the GM selected
    // "Skip Skill Checks"). Hydrate that state immediately so the initial
    // render goes straight to component claiming instead of showing a roll.
    for (const creature of session?.creatures ?? []) {
      const state =
        session.participants?.[
          `${game.user.id}:${creature.tokenUuid}`
        ]
        ?? null;

      if (!state) continue;

      this.states[creature.tokenUuid] =
        foundry.utils.deepClone(state);

      if (state.status === "claimed") {
        this.collapsedCreatures.add(
          creature.tokenUuid
        );
      }
    }
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-harvest-player",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window", "ml-craftworks", "ml-craftworks-harvest-modern"],
    position: {
      width: 960,
      height: 800
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
        session.participants?.[
          `${game.user.id}:${creature.tokenUuid}`
        ]
        ?? null;

      if (!state) continue;

      this.states[creature.tokenUuid] =
        foundry.utils.deepClone(state);

      // A creature must remain expanded while the player still has something
      // to do. Only collapse it after that player's claim sequence is complete.
      if (state.status === "awaiting-claim") {
        this.collapsedCreatures.delete(
          creature.tokenUuid
        );
      } else if (state.status === "claimed") {
        this.collapsedCreatures.add(
          creature.tokenUuid
        );
      }
    }

    if (!preserveFocus) {
      this.focusedCreatureTokenUuid = null;
    }

    await this.render();

    return this;
  }

  async setState(creatureTokenUuid, state) {
    this.states[creatureTokenUuid] =
      foundry.utils.deepClone(state);

    this.focusedCreatureTokenUuid =
      creatureTokenUuid;

    // Successful checks must leave the creature open so the player can claim.
    if (state?.status === "awaiting-claim") {
      this.collapsedCreatures.delete(
        creatureTokenUuid
      );
    } else if (state?.status === "claimed") {
      this.collapsedCreatures.add(
        creatureTokenUuid
      );
    }

    await this.render();
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

    this.recipeMatchesByMaterial = new Map();
    const recipeUsageFor = material => {
      const recipes = markedRecipes
        .filter(recipe => this.#recipeCanUseMaterial(recipe, material))
        .map(recipe => ({
          id: recipe.id,
          name: recipe.name,
          category: recipe.category ?? null,
          tool: recipe.craft?.tool ?? null
        }));

      if (material?.materialId) {
        this.recipeMatchesByMaterial.set(material.materialId, recipes);
      }

      return {
        matchingRecipes: recipes,
        visibleRecipes: recipes.slice(0, 4),
        hasMoreRecipes: recipes.length > 4,
        recipeCount: recipes.length
      };
    };

    const creatures = [];
    for (const creature of this.session.creatures) {
      const priorHarvest = null;
      const state = this.states[creature.tokenUuid] ?? null;


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

      const claimsByComponentId = new Map();
      for (const result of (this.session.results ?? []).filter(result => result.creatureTokenUuid === creature.tokenUuid)) {
        const claims = claimsByComponentId.get(result.componentId) ?? [];
        claims.push(result);
        claimsByComponentId.set(result.componentId, claims);
      }

      const currentUserClaimsByComponentId = new Map(
        (this.session.results ?? [])
          .filter(result =>
            result.creatureTokenUuid === creature.tokenUuid
            && result.userId === game.user.id
          )
          .map(result => [result.componentId, result])
      );

      const components = (creature.components ?? [])
        .filter(component => component.matched && component.materialId)
        .map(component => {
          const globalClaims =
            (creature.harvestMode === "drakkenheim"
              ? claimsByComponentId
              : currentUserClaimsByComponentId
            ).get(component.id)
            ?? [];
          const visibleClaims = claimsByComponentId.get(component.id) ?? [];
          const globalClaim = Array.isArray(globalClaims) ? globalClaims[0] : globalClaims;

          const inChoices =
            choiceComponentIds.has(component.id)
            || (
              !choiceComponentIds.size
              && choiceMaterialIds.has(component.materialId)
            );

          const material =
            this.craftworks.materials.get(component.materialId)
            ?? component;

          const recipeUsage = recipeUsageFor(material);

          return {
            ...component,
            itemUuid: material?.uuid ?? null,
            componentName: component.componentName ?? component.name,
            category:
              component.category
              ?? (creature.harvestMode === "drakkenheim"
                ? "Drakkenheim Component"
                : "Harvest Material"),
            neededForCrafting: recipeUsage.recipeCount > 0,
            ...recipeUsage,
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
            claimantNames: visibleClaims.map(claim => claim.actorName ?? claim.userName ?? "Unknown").join(", "),
            hasVisibleClaims: visibleClaims.length > 0,
            multipleClaims: visibleClaims.length > 1,
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
        requiresSkillCheck: Boolean(
          actor
          && !priorHarvest
          && !state?.status
        ),
        displayComponents: components
      });
    }

    const availableSkillCheckCount =
      creatures.filter(
        creature =>
          creature.requiresSkillCheck
      ).length;

    const skillOptions =
      this.craftworks.harvest
        .getSkillOptions()
        .map(skill => {
          const value = Number(actor?.system?.skills?.[skill.id]?.total ?? actor?.system?.skills?.[skill.id]?.mod ?? 0);
          return {
            ...skill,
            modifier: value,
            modifierLabel: value >= 0 ? `+${value}` : String(value),
            selected: skill.id === this.selectedHarvestSkill
          };
        });

    const selectedSkill = skillOptions.find(skill => skill.selected) ?? null;

    const skillChecksBypassed = Boolean(
      actor
      && (this.session.skipSkillChecks ?? []).some(entry =>
        entry?.userId === game.user.id
        && entry?.actorUuid === actor.uuid
      )
    );

    return foundry.utils.mergeObject(context, {
      session: this.session,
      actor: actor ? { name: actor.name, img: actor.img, uuid: actor.uuid } : null,
      skills: skillOptions,
      selectedHarvestSkill: this.selectedHarvestSkill,
      selectedHarvestSkillLabel: selectedSkill ? `${selectedSkill.label} ${selectedSkill.modifierLabel}` : "",
      skillChecksBypassed,
      availableSkillCheckCount,
      canRollHarvestChecks: Boolean(
        actor
        && this.selectedHarvestSkill
        && availableSkillCheckCount > 0
      ),
      creatures,
      claimedItems: (this.session.results ?? [])
        .map(result => {
          const material =
            this.craftworks.materials.get(result.materialId)
            ?? null;

          const recipeUsage = material
            ? recipeUsageFor(material)
            : {
                matchingRecipes: [],
                visibleRecipes: [],
                hasMoreRecipes: false,
                recipeCount: 0
              };

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
            neededForCrafting: recipeUsage.recipeCount > 0,
            ...recipeUsage
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

    this.element
      .querySelector(
        "[data-action='select-harvest-skill']"
      )
      ?.addEventListener(
        "change",
        event => {
          this.selectedHarvestSkill =
            String(
              event.currentTarget.value
              ?? ""
            );

          const rollButton =
            this.element.querySelector(
              "[data-action='roll-harvest-checks']"
            );

          if (rollButton) {
            const available =
              Number(
                rollButton.dataset
                  .availableCount
                ?? 0
              );

            rollButton.disabled =
              !this.selectedHarvestSkill
              || available <= 0;
            const label = rollButton.querySelector("[data-roll-skill-label]");
            const option = event.currentTarget.selectedOptions?.[0];
            if (label) label.textContent = option?.dataset.skillLabel
              ? `Roll ${option.dataset.skillLabel} Checks`
              : "Roll Harvest Checks";
          }
        }
      );

    this.element
      .querySelector(
        "[data-action='roll-harvest-checks']"
      )
      ?.addEventListener(
        "click",
        event =>
          this.#rollHarvestChecks(event)
      );

    this.element.querySelectorAll("[data-action='claim']")
      .forEach(button => button.addEventListener("click", event => this.#claim(event)));

    this.element.querySelectorAll("[data-action='toggle-creature']")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();

        const id = button.dataset.creature;
        if (!id) return;

        if (this.collapsedCreatures.has(id)) {
          this.collapsedCreatures.delete(id);
        } else {
          this.collapsedCreatures.add(id);
        }

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

    this.element.querySelectorAll("[data-action='show-matching-recipes']")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();
        await this.#showMatchingRecipes(button.dataset.material);
      }));

    this.element.querySelectorAll("[data-action='close']")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();
        await this.close();
      }));
    this.element.querySelector("[data-action='cancel-claims']")?.addEventListener("click", () => this.#releaseClaims({ close: true }));
    this.element.querySelector("[data-action='reset-claims']")?.addEventListener("click", () => this.#releaseClaims({ reset: true }));
    this.element.querySelector("[data-action='done-claims']")?.addEventListener("click", () => this.close());

  }

  async #releaseClaims({ close = false, reset = false } = {}) {
    try {
      await this.craftworks.socket.emit("harvest.release-claims", { sessionId: this.session.id, userId: game.user.id });
      if (close) return this.close();
      if (reset) {
        this.collapsedCreatures.clear();
        this.focusedCreatureTokenUuid = null;
        await this.render();
        this.element.querySelector(".ml-craftworks-harvest-creatures")?.scrollTo({ top: 0 });
      }
    } catch (error) { ui.notifications.error(error.message); }
  }

  async #showMatchingRecipes(materialId) {
    const recipes = this.recipeMatchesByMaterial.get(materialId) ?? [];
    if (!recipes.length) return;

    const escape = value => String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
    const content = `
      <div class="ml-craftworks ml-craftworks-harvest-recipe-dialog">
        <p>This harvested material is used by these marked recipes:</p>
        <div class="ml-craftworks-harvest-recipe-dialog-list">
          ${recipes.map(recipe => `
            <div class="ml-craftworks-harvest-recipe-dialog-row">
              <strong>${escape(recipe.name)}</strong>
              <span>${escape([recipe.category, recipe.tool].filter(Boolean).join(" · "))}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    await foundry.applications.api.DialogV2.prompt({
      window: { title: "Matching Crafting Recipes" },
      content,
      ok: { label: "Close" }
    });
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

    // Non-material recipe requirements (notably spell scrolls) do not carry
    // any material selector. Treating an empty selector as a match caused
    // those recipes to appear on every harvested component.
    const hasMaterialSelector = Boolean(
      match.materialId
      || match.itemName
      || match.rarity
      || match.category
      || match.stage
      || match.tags?.length
    );
    if (!hasMaterialSelector || match.itemType === "spellScroll") return false;

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
      if (!materialTagsSatisfy(match.tags, material.tags ?? [])) {
        return false;
      }
    }

    return true;
  }

  async #rollHarvestChecks(event) {
    const button =
      event.currentTarget;

    const skillId =
      this.selectedHarvestSkill;

    if (!skillId) {
      ui.notifications.warn(
        "Choose a Harvest skill before rolling."
      );
      return;
    }

    const actor =
      this.craftworks.adapter
        .getActorForUser(game.user);

    if (!actor) {
      ui.notifications.error(
        "Select a token you own or configure a user character first."
      );
      return;
    }

    const availableCreatures = [];

    for (
      const creature of
      this.session.creatures ?? []
    ) {
      const state =
        this.states[
          creature.tokenUuid
        ]
        ?? null;

      if (state?.status) {
        continue;
      }

      availableCreatures.push(
        creature
      );
    }

    if (!availableCreatures.length) {
      ui.notifications.info(
        "There are no unresolved Harvest checks for this character."
      );
      return;
    }

    button.disabled = true;

    const originalLabel =
      button.innerHTML;

    try {
      const attempts = [];

      for (
        let index = 0;
        index < availableCreatures.length;
        index += 1
      ) {
        const creature =
          availableCreatures[index];

        button.innerHTML =
          `<i class="fa-solid fa-dice-d20 fa-spin"></i> `
          + `Rolling ${index + 1} of ${availableCreatures.length}`;

        const roll =
          await this.craftworks.adapter
            .rollSkill(
              actor,
              skillId,
              {
                dc: creature.dc,
                flavor:
                  `Harvest ${creature.name} — DC ${creature.dc}`,
                configure: true
              }
            );

        if (roll?.cancelled) {
          continue;
        }

        attempts.push({
          sessionId:
            this.session.id,
          creatureTokenUuid:
            creature.tokenUuid,
          userId:
            game.user.id,
          actorUuid:
            actor.uuid,
          skillId,
          total:
            roll.total,
          naturalD20:
            roll.naturalD20
        });

        this.states[
          creature.tokenUuid
        ] = {
          status: "pending",
          total: roll.total,
          skillId,
          naturalD20:
            roll.naturalD20
        };

        // Every creature being resolved remains expanded so successful checks
        // immediately expose their available claim choices.
        this.collapsedCreatures.delete(
          creature.tokenUuid
        );
      }

      if (!attempts.length) {
        ui.notifications.warn(
          "No Harvest checks were rolled."
        );
        return;
      }

      await this.craftworks.socket.emit(
        "harvest.batch-attempt",
        {
          sessionId:
            this.session.id,
          userId:
            game.user.id,
          attempts
        }
      );
    } catch (err) {
      ui.notifications.error(
        err.message
      );

      button.disabled = false;
      button.innerHTML =
        originalLabel;
    }
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
