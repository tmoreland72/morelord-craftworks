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
    const abilityId =
      this.#abilityId(craft.ability);
    const skillId =
      this.#skillId(craft.skill);
    const toolId =
      this.#toolId(
        craft.tool,
        toolStatus
      );

    if (!abilityId) {
      throw new Error(
        `Unable to resolve crafting ability '${
          craft.ability ?? "unknown"
        }'.`
      );
    }

    const target = Number(dc);
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
      `1d20 + ${modifier}`
    ).evaluate();

    const success = Number.isFinite(dc)
      ? roll.total >= dc
      : true;

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({
        actor: crafter
      }),
      flavor:
        `<strong>${recipe.name}</strong>`
        + `<br>Crafting Check`
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

  #toolId(name, toolStatus) {
    if (!name) return null;

    const needle = this.#normalizeTool(name);

    const candidateIds = [
      toolStatus?.toolId,
      toolStatus?.matchedToolId
    ]
      .filter(Boolean);

    if (candidateIds.length) {
      return String(candidateIds[0]);
    }

    const configSources = [
      CONFIG.DND5E?.tools,
      CONFIG.DND5E?.toolIds
    ].filter(Boolean);

    for (const source of configSources) {
      for (
        const [id, config]
        of Object.entries(source)
      ) {
        const values = [
          id,
          config?.label,
          config?.name,
          config
        ]
          .filter(value =>
            typeof value === "string"
          )
          .map(value =>
            this.#normalizeTool(
              game.i18n.localize(value)
            )
          );

        if (
          values.some(value =>
            value === needle
          )
        ) {
          return id;
        }
      }
    }

    // Some D&D5e tool Items expose the system tool key/type directly.
    const matchedItemUuid =
      toolStatus?.matchedItemUuid;

    if (matchedItemUuid) {
      const matchedItem =
        globalThis.fromUuidSync?.(matchedItemUuid);

      const embeddedCandidates = [
        matchedItem?.system?.tool,
        matchedItem?.system?.type?.value,
        matchedItem?.system?.identifier,
        matchedItem?.system?.source?.identifier
      ]
        .filter(Boolean)
        .map(String);

      const configuredKeys = new Set(
        configSources.flatMap(source =>
          Object.keys(source)
        )
      );

      const configured = embeddedCandidates.find(
        candidate =>
          configuredKeys.has(candidate)
      );

      if (configured) return configured;
    }

    return null;
  }

  #normalizeTool(value) {
    return String(value ?? "")
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/\btools?\b/g, "")
      .replace(/\bsupplies\b/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
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
