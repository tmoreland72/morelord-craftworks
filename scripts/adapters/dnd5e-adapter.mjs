import { SystemAdapter } from "../core/system-adapter.mjs";
import { getMorelordCoreService } from "../core/morelord-core-api.mjs";

export class Dnd5eAdapter extends SystemAdapter {
  constructor({ sourceFilter = null } = {}) {
    super();
    this.sourceFilter = sourceFilter;
  }

  getActorForUser(user) {
    const controlled = canvas?.tokens?.controlled ?? [];
    const ownedControlled = controlled.find(t => t.actor?.isOwner);
    if (ownedControlled?.actor) return ownedControlled.actor;
    return user?.character ?? null;
  }

  getCreatureType(actor) {
    const type = actor?.system?.details?.type;
    if (typeof type === "string") return type.toLowerCase();
    return (type?.value ?? type?.custom ?? "").toString().toLowerCase();
  }

  getCreatureCR(actor) {
    const raw = actor?.system?.details?.cr;
    if (typeof raw === "number") return raw;
    if (raw && typeof raw === "object") {
      const value = Number(raw.value ?? raw.challenge ?? 0);
      return Number.isFinite(value) ? value : 0;
    }
    const value = Number(raw ?? 0);
    return Number.isFinite(value) ? value : 0;
  }

  getCreatureHarvestTraits(actor) {
    const creatureType = this.getCreatureType(actor);
    const cr = this.getCreatureCR(actor);
    const size = String(actor?.system?.traits?.size ?? "med").toLowerCase();
    const ac = Number(actor?.system?.attributes?.ac?.value ?? 0);
    const damageResistances = actor?.system?.traits?.dr?.value;
    const resistanceValues = damageResistances instanceof Set
      ? [...damageResistances]
      : Array.isArray(damageResistances)
        ? damageResistances
        : [];
    const elementalResistance = resistanceValues.some(value =>
      ["acid", "cold", "fire", "lightning", "thunder"].includes(String(value).toLowerCase())
    );
    const typeDetails = actor?.system?.details?.type;
    const customType = typeof typeDetails === "object"
      ? String(typeDetails?.custom ?? "")
      : "";
    const incorporeal = /incorporeal/i.test(customType)
      || /\b(banshee|ghost|poltergeist|shadow|specter|spectre|wraith|will[- ]o['’]?-wisp)\b/i.test(actor?.name ?? "");

    return {
      creatureType,
      cr,
      size,
      ac: Number.isFinite(ac) ? ac : 0,
      elementalResistance,
      incorporeal
    };
  }

  isDeadCreatureToken(token) {
    const actor = token?.actor;
    if (!actor) return false;

    // D&D5e represents monsters, ordinary NPCs, and many hazards with the
    // same `npc` Actor type. Restrict automatic candidates to NPC Actors,
    // then let the GM make the authoritative harvestability choice during
    // Harvest preflight instead of relying on unreliable name/type heuristics.
    if (actor.type !== "npc") return false;

    const hp = Number(actor.system?.attributes?.hp?.value);
    const hpDead = Number.isFinite(hp) && hp <= 0;

    const combatant = game.combat?.combatants?.find(c => c.tokenId === token.id);
    const defeated = Boolean(combatant?.defeated);

    return hpDead || defeated;
  }

  getDeadCreatureTokens() {
    const placeables = canvas?.tokens?.placeables ?? [];
    return placeables.filter(token => this.isDeadCreatureToken(token));
  }

  async rollSkill(
    actor,
    skillId,
    {
      dc,
      flavor,
      configure = true
    } = {}
  ) {
    const coreRolls = getMorelordCoreService("rolls");
    if (!coreRolls?.skill) throw new Error("Morelord Core skill-roll services are unavailable.");
    return coreRolls.skill(actor, skillId, { dc, flavor, configure, create: true });
  }

  getCurrencyCopper(actor) {
    const currency = actor?.system?.currency ?? {};
    const values = { pp: 1000, gp: 100, ep: 50, sp: 10, cp: 1 };
    return Object.entries(values).reduce(
      (total, [denom, multiplier]) => total + Number(currency[denom] ?? 0) * multiplier,
      0
    );
  }

  formatCopper(copper) {
    let remaining = Math.max(0, Math.round(Number(copper ?? 0)));
    const parts = [];
    for (const [denom, value] of [["pp", 1000], ["gp", 100], ["ep", 50], ["sp", 10], ["cp", 1]]) {
      const quantity = Math.floor(remaining / value);
      remaining %= value;
      if (quantity) parts.push(`${quantity} ${denom}`);
    }
    return parts.length ? parts.join(", ") : "0 gp";
  }

  async adjustCurrencyCopper(actor, deltaCopper) {
    if (!actor) throw new Error("A currency Actor is required.");
    const current = this.getCurrencyCopper(actor);
    const next = current + Math.round(Number(deltaCopper ?? 0));
    if (next < 0) throw new Error(`${actor.name} does not have enough currency.`);

    let remaining = next;
    const currency = {};
    for (const [denom, value] of [["pp", 1000], ["gp", 100], ["ep", 50], ["sp", 10], ["cp", 1]]) {
      currency[denom] = Math.floor(remaining / value);
      remaining %= value;
    }

    await actor.update({ "system.currency": currency });
    return currency;
  }

  async addItemToActor(actor, sourceItem, quantity = 1) {
    if (!actor || !sourceItem) throw new Error("Actor and source Item are required.");

    if (
      sourceItem.pack
      && this.sourceFilter
      && !this.sourceFilter.isPackEnabled(sourceItem.pack)
    ) {
      throw new Error(
        `${sourceItem.name} cannot be awarded because its compendium is disabled in D&D5e Configure Sources.`
      );
    }

    const materialId = sourceItem.getFlag?.("morelord-craftworks", "materialId");
    const existing = actor.items.find(item =>
      materialId && item.getFlag?.("morelord-craftworks", "materialId") === materialId
    );

    if (existing) {
      const current = Number(existing.system?.quantity ?? 1);
      await existing.update({ "system.quantity": current + quantity });
      return existing;
    }

    const data = sourceItem.toObject();
    delete data._id;
    foundry.utils.setProperty(data, "system.quantity", quantity);
    const [created] = await actor.createEmbeddedDocuments("Item", [data]);
    return created;
  }
}
