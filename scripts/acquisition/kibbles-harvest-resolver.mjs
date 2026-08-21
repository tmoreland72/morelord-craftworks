import {
  KIBBLES_BASIC_HARVEST,
  KIBBLES_EXOTIC_COLUMNS,
  KIBBLES_EXOTIC_TABLES,
  KIBBLES_MEAT_RARITIES,
  KIBBLES_REMNANT_COLUMNS,
  KIBBLES_REMNANT_TABLES,
  KIBBLES_SPECIAL_MATERIALS
} from "../../data/packs/standard/kibbles-harvest-tables.mjs";

const ORGANIC_TYPES = new Set([
  "beast", "dragon", "giant", "humanoid", "monstrosity", "plant"
]);
const HIDE_AND_MEAT_TYPES = new Set([
  "beast", "dragon", "giant", "humanoid", "monstrosity"
]);

export function resolveKibblesHarvest(traits, { random = Math.random } = {}) {
  const normalized = normalizeTraits(traits);
  const components = [];

  components.push(...resolveBasicHarvest(normalized, random));
  components.push(...resolveExoticHarvest(normalized, random));
  components.push(...resolveSpecialHarvest(normalized, random));

  return components.map((component, index) => ({
    ...component,
    id: component.id ?? `${component.kind}::${index}::${component.materialId}`
  }));
}

export function rollQuantity(formula = "1", random = Math.random) {
  const text = String(formula ?? "1").trim().toLowerCase();
  const match = /^(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?$/.exec(text);
  if (!match) {
    const fixed = Number(text);
    return Number.isFinite(fixed) ? Math.max(0, Math.floor(fixed)) : 1;
  }

  const count = Number(match[1]);
  const faces = Number(match[2]);
  let total = 0;
  for (let i = 0; i < count; i += 1) {
    total += Math.floor(random() * faces) + 1;
  }

  const modifier = Number(match[4] ?? 0) * (match[3] === "-" ? -1 : 1);
  return Math.max(0, total + modifier);
}

function resolveBasicHarvest(traits, random) {
  if (!ORGANIC_TYPES.has(traits.creatureType)) return [];
  const entry = KIBBLES_BASIC_HARVEST[traits.size];
  if (!entry) return [];

  if (traits.creatureType === "plant") {
    if (!entry.meat) return [];
    return [makeComponent("basic-ingredient", {
      materialId: "common-fresh-ingredient",
      quantity: entry.meat.quantity
    }, entry.dc, random, {
      categoryLabel: "Basic Fresh Ingredient Harvest"
    })];
  }

  const components = (entry.hide ?? []).map((result, index) =>
    makeComponent("basic-hide", result, entry.dc, random, {
      id: `basic-hide::${index}::${result.materialId}`,
      categoryLabel: "Basic Hide Harvest"
    })
  );

  if (entry.meat) {
    components.push(makeComponent("basic-meat", entry.meat, entry.dc, random, {
      categoryLabel: "Basic Meat Harvest"
    }));
  }

  return components;
}

function resolveExoticHarvest(traits, random) {
  const useRemnants = KIBBLES_REMNANT_COLUMNS[traits.creatureType]
    && (traits.creatureType !== "undead" || traits.incorporeal);
  const columns = useRemnants ? KIBBLES_REMNANT_COLUMNS : KIBBLES_EXOTIC_COLUMNS;
  const tables = useRemnants ? KIBBLES_REMNANT_TABLES : KIBBLES_EXOTIC_TABLES;
  const column = columns[traits.creatureType];
  if (!column) return [];

  const table = tables.find(entry => traits.cr >= entry.minCR && traits.cr <= entry.maxCR);
  if (!table) return [];

  const d100 = Math.floor(random() * 100) + 1;
  const selectedRow = table.rows.find(entry => d100 <= entry.max);
  const result = selectedRow?.results?.[column];
  if (!result) return [];

  return [makeComponent(
    useRemnants ? "exotic-remnant" : "exotic-harvest",
    result,
    table.dc ?? null,
    random,
    {
      categoryLabel: useRemnants ? "Exotic Remnant" : "Exotic Harvest",
      sourceRoll: d100
    }
  )];
}

function resolveSpecialHarvest(traits, random) {
  if (!HIDE_AND_MEAT_TYPES.has(traits.creatureType)) return [];
  const components = [];
  const baseDc = KIBBLES_BASIC_HARVEST[traits.size]?.dc ?? 10;

  for (const special of KIBBLES_SPECIAL_MATERIALS) {
    if (traits.cr < special.minCR || !meetsRequirement(special.requires, traits)) continue;
    components.push(makeComponent("special-hide", special, baseDc + special.dcModifier, random, {
      categoryLabel: "Special Hide Harvest"
    }));
  }

  const meat = KIBBLES_MEAT_RARITIES.find(entry => traits.cr >= entry.minCR);
  if (meat) {
    const baseMeat = KIBBLES_BASIC_HARVEST[traits.size]?.meat;
    if (baseMeat) {
      components.push(makeComponent("special-meat", {
        materialId: meat.materialId,
        quantity: baseMeat.quantity
      }, baseDc + meat.dcModifier, random, {
        categoryLabel: "Special Meat Harvest"
      }));
    }
  }

  return components;
}

function meetsRequirement(requirement, traits) {
  if (requirement === "ac16") return traits.ac >= 16;
  if (requirement === "elementalResistance") return traits.elementalResistance;
  if (requirement === "dragon") return traits.creatureType === "dragon";
  return false;
}

function makeComponent(kind, result, dc, random, extra = {}) {
  const quantityFormula = result.quantity ?? "1";
  return {
    kind,
    materialId: result.materialId,
    quantityFormula,
    quantity: rollQuantity(quantityFormula, random),
    dc,
    ...extra
  };
}

function normalizeTraits(traits = {}) {
  return {
    creatureType: String(traits.creatureType ?? "").trim().toLowerCase(),
    cr: finiteNumber(traits.cr),
    size: String(traits.size ?? "med").trim().toLowerCase(),
    ac: finiteNumber(traits.ac),
    elementalResistance: Boolean(traits.elementalResistance),
    incorporeal: Boolean(traits.incorporeal)
  };
}

function finiteNumber(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}
