import { MODULE_ID, SCHEMA_VERSION } from "../constants.mjs";

const PACK_NAME = "morelord-craftworks-spell-scrolls";

export class SpellScrollCatalogInstaller {
  constructor({ spellScrollGenerator }) {
    this.spellScrollGenerator = spellScrollGenerator;
  }

  async install() {
    if (!game.user.isGM || game.system.id !== "dnd5e") return null;
    const spells = (await this.spellScrollGenerator.availableSpells({
      respectSourceConfiguration: false,
      dedupe: false
    }))
      .filter(spell => includedSource(spell.sourceLabel));
    const pack = await this.#getOrCreatePack();
    const flagPath = `flags.${MODULE_ID}.spellScrollCatalog.key`;
    const index = await pack.getIndex({ fields: [flagPath] });
    const existing = new Map([...index]
      .map(row => [foundry.utils.getProperty(row, flagPath), row])
      .filter(([key]) => Boolean(key)));
    const creates = [], updates = [], desired = new Set();

    for (const spell of spells) {
      const key = [spell.level, spell.name, spell.sourceLabel]
        .map(value => String(value).trim().toLowerCase()).join("|");
      desired.add(key);
      const generated = await this.spellScrollGenerator.createScrollItem({
        spellUuid: spell.uuid,
        level: spell.level
      });
      const data = generated.item.toObject();
      delete data._id;
      foundry.utils.setProperty(data, `flags.${MODULE_ID}.purchasable`, true);
      foundry.utils.setProperty(data, `flags.${MODULE_ID}.schemaVersion`, SCHEMA_VERSION);
      foundry.utils.setProperty(data, `flags.${MODULE_ID}.spellScrollCatalog`, {
        key,
        spellUuid: spell.uuid,
        spellName: spell.name,
        spellLevel: spell.level,
        sourceLabel: spell.sourceLabel,
        sourcePackId: spell.packId
      });
      const current = existing.get(key);
      if (current) {
        data._id = current._id;
        updates.push(data);
      } else creates.push(data);
    }

    const deletes = [...existing]
      .filter(([key]) => !desired.has(key)).map(([, row]) => row._id);
    const ItemClass = CONFIG.Item.documentClass ?? Item;
    if (deletes.length) await ItemClass.deleteDocuments(deletes, { pack: pack.collection });
    if (creates.length) await ItemClass.createDocuments(creates, { pack: pack.collection });
    if (updates.length) await ItemClass.updateDocuments(updates, {
      pack: pack.collection, diff: false, recursive: false
    });
    return { collection: pack.collection, creates: creates.length, updates: updates.length, deletes: deletes.length };
  }

  async #getOrCreatePack() {
    const collection = `world.${PACK_NAME}`;
    return game.packs.get(collection)
      ?? foundry.documents.collections.CompendiumCollection.createCompendium({
        name: PACK_NAME,
        label: "Morelord Craftworks — Spell Scrolls",
        type: "Item",
        package: "world",
        system: game.system.id
      });
  }
}

export function includedSource(label) {
  const value = String(label ?? "").toLowerCase().replace(/[’‘`]/g, "'");
  return value === "srd 5.1"
    || value === "srd 5.2"
    || /player'?s handbook/.test(value)
    || value.includes("dungeons of drakkenheim")
    || /sebastian crowe'?s guide/.test(value);
}
