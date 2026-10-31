import { resolveArtisanToolId } from "../recipes/artisan-tools.mjs";

export const FAILED_ATTEMPT_MATERIALS_NOTE = "The materials and items set aside for this project are not lost. They stay set aside for the next attempt.";

export class CraftingRollService {
  async roll({
    recipe,
    crafter,
    dc,
    toolStatus
  }) {
    if (!recipe) {
      throw new Error(
        "Crafting roll requires a recipe."
      );
    }

    if (!crafter) {
      throw new Error(
        "Crafting roll requires a crafter Actor."
      );
    }

    const craft = recipe.craft ?? {};
    if (craft.checkRequired === false || recipe.packId === "monsters-of-drakkenheim" || recipe.source?.contentPackId === "monsters-of-drakkenheim") {
      return { cancelled: false, success: true, roll: null, rollType: "none", dc: null };
    }
    const disadvantage = Boolean(craft.tool && (!toolStatus?.hasTool || !toolStatus?.proficient));
    const abilityId =
      this.#abilityId(craft.ability);
    const skillId =
      craft.tool ? null : this.#skillId(craft.skill);
    const toolId =
      resolveArtisanToolId(craft.tool, toolStatus);

    if (craft.tool && !toolId && game.system.id === "dnd5e") {
      throw new Error(`Unable to resolve artisan tool: ${craft.tool}`);
    }

    if (!abilityId) {
      throw new Error(
        `Unable to resolve crafting ability '${
          craft.ability ?? "unknown"
        }'.`
      );
    }

    const target = Number(craft.dc ?? dc);
    const title = this.#title({
      recipe,
      craft,
      dc: target
    });

    let nativeResult;
    let rollType;

    if (
      game.system.id === "dnd5e"
      && skillId
      && typeof crafter.rollSkill === "function"
    ) {
      rollType = "skill";
      nativeResult = await crafter.rollSkill({
        skill: skillId,
        ability: abilityId,
        dialog: {
          configure: true,
          title
        },
        message: {
          create: true
        }
      });
    } else if (
      game.system.id === "dnd5e"
      && toolId
      && typeof crafter.rollToolCheck === "function"
    ) {
      rollType = "tool";
      nativeResult = await crafter.rollToolCheck({
        tool: toolId,
        ability: abilityId,
        ...(disadvantage ? { disadvantage: true } : {})
      }, { configure: true, options: { window: { title } } }, { create: true });
    } else if (
      game.system.id === "dnd5e"
      && !craft.tool
      && typeof crafter.rollAbilityCheck === "function"
    ) {
      rollType = "ability";
      nativeResult = await crafter.rollAbilityCheck({
        ability: abilityId,
        dialog: {
          configure: true,
          title
        },
        message: {
          create: true
        }
      });
    } else {
      // Compatibility fallback for unsupported systems/API changes.
      // D&D5e 5.3.x should use one of the native paths above.
      return this.#legacyRoll({
        recipe,
        crafter,
        dc: target,
        abilityId,
        skillId,
        toolStatus
      });
    }

    const roll =
      this.#extractRoll(nativeResult);

    // Closing/cancelling the native D&D5e roll dialog is not a failed
    // crafting attempt. Leave the existing crafting job untouched.
    if (!roll) {
      return {
        cancelled: true,
        roll: null,
        total: null,
        dc: Number.isFinite(target)
          ? target
          : null,
        abilityId,
        skillId,
        toolId,
        rollType,
        success: null
      };
    }

    const total = Number(roll.total);
    const success = Number.isFinite(target)
      ? total >= target
      : true;
    const naturalD20 = this.#naturalD20(roll);
    if (success === false) await this.#annotateFailedAttempt(roll);

    return {
      cancelled: false,
      roll,
      total,
      dc: Number.isFinite(target)
        ? target
        : null,
      modifier: null,
      abilityId,
      skillId,
      toolId,
      rollType,
      success
      , naturalD20
    };
  }

  #extractRoll(result) {
    if (!result) return null;

    if (
      Number.isFinite(
        Number(result.total)
      )
    ) {
      return result;
    }

    if (Array.isArray(result)) {
      return result.find(candidate =>
        Number.isFinite(
          Number(candidate?.total)
        )
      ) ?? null;
    }

    const possibleArrays = [
      result.rolls,
      result.results,
      result.data?.rolls
    ];

    for (const candidates of possibleArrays) {
      if (!Array.isArray(candidates)) continue;

      const roll = candidates.find(candidate =>
        Number.isFinite(
          Number(candidate?.total)
        )
      );

      if (roll) return roll;
    }

    if (
      Number.isFinite(
        Number(result.roll?.total)
      )
    ) {
      return result.roll;
    }

    return null;
  }

  #naturalD20(roll) {
    const die = (roll?.dice ?? []).find(entry => Number(entry.faces) === 20);
    const result = die?.results?.find(entry => entry.active !== false && !entry.discarded);
    return Number.isFinite(Number(result?.result)) ? Number(result.result) : null;
  }

  async #legacyRoll({
    recipe,
    crafter,
    dc,
    abilityId,
    skillId,
    toolStatus
  }) {
    const modifier = this.#legacyModifier({
      crafter,
      abilityId,
      skillId,
      toolProficient:
        Boolean(toolStatus?.proficient)
    });

    const roll = await new Roll(
      `${recipe.craft?.tool && (!toolStatus?.hasTool || !toolStatus?.proficient) ? "2d20kl" : "1d20"} + ${modifier}`
    ).evaluate();

    const success = Number.isFinite(dc)
      ? roll.total >= dc
      : true;

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({
        actor: crafter
      }),
      flavor: this.#craftingFlavor(recipe.name, success)
    });

    return {
      cancelled: false,
      roll,
      total: roll.total,
      dc: Number.isFinite(dc)
        ? dc
        : null,
      modifier,
      abilityId,
      skillId,
      toolId: null,
      rollType: "legacy",
      success
    };
  }

  #craftingFlavor(recipeName, success) {
    const heading = `<strong>${recipeName}</strong><br>Crafting Check`;
    return success === false ? `${heading}<br>${FAILED_ATTEMPT_MATERIALS_NOTE}` : heading;
  }

  async #annotateFailedAttempt(roll) {
    const message = this.#messageForRoll(roll);
    if (!message?.update) return;
    if (String(message.flavor ?? "").includes(FAILED_ATTEMPT_MATERIALS_NOTE)) return;
    const flavor = [message.flavor, FAILED_ATTEMPT_MATERIALS_NOTE].filter(Boolean).join("<br>");
    await message.update({ flavor });
  }

  #messageForRoll(roll) {
    const list = this.#chatMessages();
    const messageId = this.#rollMessageId(roll);
    if (messageId) {
      const byId = list.find(message => String(message?.id ?? "") === messageId);
      if (byId) return byId;
    }
    const total = Number(roll?.total);
    const formula = String(roll?.formula ?? "").trim();
    for (let index = list.length - 1; index >= 0; index -= 1) {
      const message = list[index];
      const rolls = message?.rolls ?? [];
      if (rolls.some(entry => entry === roll || this.#samePostedRoll(entry, total, formula))) return message;
    }
    return null;
  }

  #chatMessages() {
    const collection = globalThis.game?.messages;
    const messages = collection?.contents ?? (typeof collection?.filter === "function" ? collection.filter(() => true) : []);
    return Array.isArray(messages) ? messages : Array.from(messages ?? []);
  }

  #rollMessageId(roll) {
    for (const value of [roll?.messageId, roll?.message?.id, roll?.options?.messageId, roll?.options?.chatMessage]) {
      const id = String(value ?? "").trim();
      if (id) return id;
    }
    return "";
  }

  // ChatMessage rebuilds each roll, so the object from the check is not the one on the card.
  #samePostedRoll(entry, total, formula) {
    if (!Number.isFinite(total) || !formula) return false;
    return Number(entry?.total) === total && String(entry?.formula ?? "").trim() === formula;
  }

  #title({
    recipe,
    craft,
    dc
  }) {
    const check = [
      craft.skill || craft.tool || craft.ability,
      Number.isFinite(dc)
        ? `DC ${dc}`
        : null
    ]
      .filter(Boolean)
      .join(" · ");

    return `${recipe.name} — ${check}`;
  }

  #abilityId(name) {
    if (!name) return null;

    const needle = String(name)
      .trim()
      .toLowerCase();

    const direct = {
      strength: "str",
      dexterity: "dex",
      constitution: "con",
      intelligence: "int",
      wisdom: "wis",
      charisma: "cha"
    }[needle];

    if (direct) return direct;

    for (
      const [id, config]
      of Object.entries(
        CONFIG.DND5E?.abilities ?? {}
      )
    ) {
      const label = game.i18n.localize(
        config?.label ?? config ?? ""
      );

      if (
        String(label).toLowerCase()
        === needle
      ) {
        return id;
      }
    }

    return null;
  }

  #skillId(name) {
    if (!name) return null;

    const needle = String(name)
      .trim()
      .toLowerCase();

    for (
      const [id, config]
      of Object.entries(
        CONFIG.DND5E?.skills ?? {}
      )
    ) {
      const label = game.i18n.localize(
        config?.label ?? config ?? ""
      );

      if (
        String(label).toLowerCase()
        === needle
      ) {
        return id;
      }
    }

    const legacy = {
      acrobatics: "acr",
      "animal handling": "ani",
      arcana: "arc",
      athletics: "ath",
      deception: "dec",
      history: "his",
      insight: "ins",
      intimidation: "itm",
      investigation: "inv",
      medicine: "med",
      nature: "nat",
      perception: "prc",
      performance: "prf",
      persuasion: "per",
      religion: "rel",
      "sleight of hand": "slt",
      stealth: "ste",
      survival: "sur"
    };

    return legacy[needle] ?? null;
  }

  #legacyModifier({
    crafter,
    abilityId,
    skillId,
    toolProficient
  }) {
    const ability =
      crafter.system?.abilities?.[abilityId]
      ?? {};

    const abilityMod = this.#number(
      ability.mod,
      Math.floor(
        (
          this.#number(
            ability.value,
            10
          ) - 10
        ) / 2
      )
    );

    const proficiencyBonus = this.#number(
      crafter.system?.attributes?.prof,
      this.#number(
        crafter.system?.attributes?.proficiency,
        0
      )
    );

    if (!skillId) {
      return abilityMod
        + (
          toolProficient
            ? proficiencyBonus
            : 0
        );
    }

    const skill =
      crafter.system?.skills?.[skillId]
      ?? {};

    if (
      Number.isFinite(
        Number(skill.total)
      )
    ) {
      return Number(skill.total);
    }

    return abilityMod;
  }

  #number(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }
}
