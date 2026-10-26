import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { STANDARD_ACQUISITION_IDS, standardMaterialAcquisition } from "../data/packs/standard/acquisition.mjs";

const seed = JSON.parse(await readFile(new URL("../data/standard-materials.seed.json", import.meta.url), "utf8"));
const ids = new Set(seed.map(material => material.materialId));
assert.equal(ids.size, seed.length, "Standard material IDs must be unique");
for (const [kind, referenced] of Object.entries(STANDARD_ACQUISITION_IDS)) {
  assert.deepEqual([...referenced].filter(id => !ids.has(id)), [], `${kind} references must resolve to a material`);
}
for (const material of seed) assert.deepEqual(material.acquisition, standardMaterialAcquisition(material.materialId), `${material.materialId}: acquisition flags must match rules`);
console.log(`Validated ${seed.length} materials against gathering, harvest, and loot rules.`);
