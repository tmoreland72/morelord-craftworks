import assert from "node:assert/strict";
import { includedSource } from "../scripts/scrolls/spell-scroll-catalog-installer.mjs";

for (const source of [
  "SRD 5.1",
  "SRD 5.2",
  "Player's Handbook",
  "Dungeons of Drakkenheim",
  "Sebastian Crowe's Guide to Drakkenheim"
]) assert.equal(includedSource(source), true, source);

for (const source of [
  "Dungeon Master's Guide",
  "Monsters of Drakkenheim",
  "Unknown Source"
]) assert.equal(includedSource(source), false, source);

console.log("Spell scroll catalog source checks passed.");
