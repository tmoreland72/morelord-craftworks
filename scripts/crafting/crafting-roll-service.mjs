export class CraftingRollService {
  async roll({
    recipe,
    crafter,
    dc,
    toolStatus
  }) {
    if (!recipe) throw new Error("Crafting roll requires a recipe.");
    if (!crafter) throw new Error("Crafting roll requires a crafter Actor.");

    const craft = recipe.craft ?? {};
    const abilityId = this.#abilityId(craft.ability);
    const skillId = this.#skillId(craft.skill);

    if (!abilityId) {
      throw new Error(
        `Unable to resolve crafting ability '${craft.ability ?? "unknown"}'.`
      );
    }

    const modifier = this.#modifier({
      crafter,
      abilityId,
      skillId,
      toolProficient: Boolean(toolStatus?.proficient)
    });

    const roll = await new Roll(`1d20 + ${modifier}`).evaluate();
    const target = Number(dc);
    const success = Number.isFinite(target)
      ? roll.total >= target
      : true;

    const checkLabel = [
      craft.ability,
      craft.skill ? `(${craft.skill})` : null
    ].filter(Boolean).join(" ");

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: crafter }),
      flavor: [
        `<strong>${recipe.name}</strong>`,
        `${checkLabel}${Number.isFinite(target) ? ` DC ${target}` : ""}`,
        success
          ? `<span class="success">Crafting Check: Success</span>`
          : `<span class="failure">Crafting Check: Failure</span>`
      ].join("<br>")
    });

    return {
      roll,
      total: roll.total,
      dc: Number.isFinite(target) ? target : null,
      modifier,
      abilityId,
      skillId,
      success
    };
  }

  #modifier({
    crafter,
    abilityId,
    skillId,
    toolProficient
  }) {
    const ability = crafter.system?.abilities?.[abilityId] ?? {};
    const abilityMod = this.#number(
      ability.mod,
      Math.floor((this.#number(ability.value, 10) - 10) / 2)
    );

    const proficiencyBonus = this.#number(
      crafter.system?.attributes?.prof,
      this.#number(crafter.system?.attributes?.proficiency, 0)
    );

    if (!skillId) {
      return abilityMod + (toolProficient ? proficiencyBonus : 0);
    }

    const skill = crafter.system?.skills?.[skillId] ?? {};
    const skillAbilityId = String(
      skill.ability ?? skill.abilityId ?? abilityId
    );

    // Use the system-prepared total only when it is based on the same ability
    // the recipe calls for. Otherwise calculate from the recipe ability.
    if (
      skillAbilityId === abilityId
      && Number.isFinite(Number(skill.total))
    ) {
      const preparedTotal = Number(skill.total);
      const skillProficiency = this.#skillProficiencyMultiplier(skill);

      // If the skill is not already proficient but the relevant crafting tool
      // is, apply one proficiency bonus. Never stack proficiency twice.
      return preparedTotal
        + (skillProficiency <= 0 && toolProficient ? proficiencyBonus : 0);
    }

    const skillProficiency = this.#skillProficiencyMultiplier(skill);
    const multiplier = Math.max(
      skillProficiency,
      toolProficient ? 1 : 0
    );

    return abilityMod + Math.floor(proficiencyBonus * multiplier);
  }

  #skillProficiencyMultiplier(skill) {
    const raw = skill.value
      ?? skill.proficient
      ?? skill.proficiency?.multiplier
      ?? skill.proficiency?.value
      ?? 0;

    const value = Number(raw);
    if (!Number.isFinite(value)) return 0;

    if (value >= 2) return 2;
    if (value >= 1) return 1;
    if (value > 0) return 0.5;
    return 0;
  }

  #abilityId(name) {
    if (!name) return null;
    const needle = String(name).trim().toLowerCase();

    const direct = {
      strength: "str",
      dexterity: "dex",
      constitution: "con",
      intelligence: "int",
      wisdom: "wis",
      charisma: "cha"
    }[needle];

    if (direct) return direct;

    for (const [id, config] of Object.entries(CONFIG.DND5E?.abilities ?? {})) {
      const label = game.i18n.localize(config?.label ?? config ?? "");
      if (String(label).toLowerCase() === needle) return id;
    }

    return null;
  }

  #skillId(name) {
    if (!name) return null;
    const needle = String(name).trim().toLowerCase();

    for (const [id, config] of Object.entries(CONFIG.DND5E?.skills ?? {})) {
      const label = game.i18n.localize(config?.label ?? config ?? "");
      if (String(label).toLowerCase() === needle) return id;
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

  #number(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }
}
