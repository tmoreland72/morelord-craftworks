import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const publicRoot = process.argv[2] ?? process.env.FOUNDRY_PUBLIC_PATH;
assert(publicRoot, "Pass the Foundry public directory: npm run check:images -- <Foundry>/resources/app/public");
const moduleRoot = fileURLToPath(new URL("../", import.meta.url));
const missing = [];
let checked = 0;
for (const file of ["standard-materials.seed.json", "drakkenheim-materials.seed.json"]) {
  const entries = JSON.parse(await readFile(resolve(moduleRoot, "data", file), "utf8"));
  for (const entry of entries) {
    assert(entry.img && !/^https?:/i.test(entry.img), `${entry.materialId}: expected bundled artwork`);
    const path = entry.img.startsWith("icons/") ? resolve(publicRoot, entry.img)
      : resolve(moduleRoot, "../..", entry.img);
    try { await access(path); } catch { missing.push(`${entry.materialId}: ${entry.img}`); }
    checked++;
  }
}
assert.deepEqual(missing, [], "Material artwork must exist");
console.log(`Validated ${checked} material image references.`);
