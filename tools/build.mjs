import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const required = [
  "module.json",
  "scripts/main.mjs",
  "styles/craftworks.css",
  "templates/harvest-prototype.hbs",
  "data/standard-materials.seed.json"
];

for (const rel of required) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${rel}`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "module.json"), "utf8"));
if (manifest.id !== "morelord-craftworks") throw new Error("Unexpected module id.");
console.log(`Morelord Craftworks ${manifest.version}: build validation passed.`);
