import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  KIBBLES_BASIC_HARVEST,
  KIBBLES_EXOTIC_TABLES,
  KIBBLES_MEAT_RARITIES,
  KIBBLES_REMNANT_TABLES,
  KIBBLES_SPECIAL_MATERIALS
} from "../data/packs/standard/kibbles-harvest-tables.mjs";
import {
  resolveKibblesHarvest,
  rollQuantity
} from "../scripts/acquisition/kibbles-harvest-resolver.mjs";

const seed = JSON.parse(await readFile(new URL("../data/standard-materials.seed.json", import.meta.url)));
const materialIds = new Set(seed.map(material => material.materialId));
assert.equal(materialIds.size, seed.length, "Standard material IDs must be unique");
const referencedIds = new Set();

for (const entry of Object.values(KIBBLES_BASIC_HARVEST)) {
  if (!entry) continue;
  for (const result of entry.hide ?? []) referencedIds.add(result.materialId);
  if (entry.meat) referencedIds.add(entry.meat.materialId);
}
for (const table of [...KIBBLES_EXOTIC_TABLES, ...KIBBLES_REMNANT_TABLES]) {
  assert.equal(table.rows.at(-1)?.max, 100, "Every d100 table must end at 100");
  assert(table.rows.every((row, index) => index === 0 || row.max > table.rows[index - 1].max),
    "d100 row ceilings must be strictly increasing");
  for (const row of table.rows) {
    for (const result of Object.values(row.results)) referencedIds.add(result.materialId);
  }
}
for (const result of KIBBLES_SPECIAL_MATERIALS) referencedIds.add(result.materialId);
for (const result of KIBBLES_MEAT_RARITIES) referencedIds.add(result.materialId);
referencedIds.add("common-fresh-ingredient");

assert.deepEqual(
  [...referencedIds].filter(materialId => !materialIds.has(materialId)),
  [],
  "Every Kibbles harvest result must resolve to a standard material"
);

assert.equal(rollQuantity("2d6", () => 0), 2);
assert.equal(rollQuantity("2d6", () => 0.999), 12);

const dragon = resolveKibblesHarvest({
  creatureType: "dragon", cr: 14, size: "med", ac: 18,
  elementalResistance: true, incorporeal: false
}, { random: () => 0.5 });
assert(dragon.some(result => result.kind === "basic-hide"));
assert(dragon.some(result => result.kind === "basic-meat"));
assert(dragon.some(result => result.kind === "exotic-harvest"));
assert(dragon.some(result => result.materialId === "tough-hide"));
assert(dragon.some(result => result.materialId === "resistant-hide"));
assert(dragon.some(result => result.materialId === "dragon-scales"));
assert(dragon.some(result => result.materialId === "rare-meat"));

const elemental = resolveKibblesHarvest({
  creatureType: "elemental", cr: 8, size: "lg"
}, { random: () => 0.99 });
assert(elemental.some(result => result.kind === "exotic-remnant"));

const corporealUndead = resolveKibblesHarvest({
  creatureType: "undead", cr: 8, size: "med", incorporeal: false
}, { random: () => 0.99 });
assert(corporealUndead.some(result => result.kind === "exotic-harvest"));

const incorporealUndead = resolveKibblesHarvest({
  creatureType: "undead", cr: 8, size: "med", incorporeal: true
}, { random: () => 0.99 });
assert(incorporealUndead.some(result => result.kind === "exotic-remnant"));

const plant = resolveKibblesHarvest({
  creatureType: "plant", cr: 3, size: "med"
}, { random: () => 0.5 });
assert(plant.some(result => result.materialId === "common-fresh-ingredient"));
assert(plant.some(result => result.kind === "exotic-harvest"));

console.log(`Validated ${referencedIds.size} Kibbles material references and all four harvest paths.`);
