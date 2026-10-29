import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ARTISAN_TOOLS,
  CraftingEnvironmentService,
  canonicalArtisanToolName,
  craftingFacilityToolNames,
  evaluateCraftingEnvironment,
  facilityRuleForTool,
  getCraftingFacilityOptions,
  normalizeCraftEnvironment,
  recipeFacilityEnvironment
} from "../scripts/crafting/crafting-environment-service.mjs";

const tiers = ["common", "uncommon", "rare", "veryRare", "legendary"];
const locationApi = {
  evaluate(requirements, { location }) {
    const required = requirements[0];
    const actual = location.capabilities.find(capability => capability.type === required.type);
    return { passed: Boolean(actual && tiers.indexOf(actual.tier) >= tiers.indexOf(required.tier)) };
  }
};
const recipe = { craft: { environment: { facility: { type: "forge", tier: "rare" } } } };

test("all Drakkenheim recipes require an equal-or-higher Workshop regardless of tool settings", () => {
  for (const source of [{ packId: "monsters-of-drakkenheim" }, { source: { contentPackId: "monsters-of-drakkenheim" } }]) {
    const recipe = { ...source, output: { rarity: "rare" }, craft: { tool: null } };
    recipe.craft.environment = recipeFacilityEnvironment(recipe, { "": "", "Smith's Tools": "forge" });
    assert.deepEqual(recipe.craft.environment.facility, { type: "workshop", tier: "rare" });
    assert.equal(recipe.craft.environment.portable, false);
    for (const [capabilities, passed] of [[[], false], [[{ type: "workshop", tier: "uncommon" }], false], [[{ type: "workshop", tier: "rare" }], true], [[{ type: "workshop", tier: "veryRare" }], true]]) {
      assert.equal(evaluateCraftingEnvironment(recipe, { location: { capabilities } }, locationApi).passed, passed);
    }
  }
});

test("Smith's Tools is the only facility-list name and legacy Blacksmith's Tools rules still apply", () => {
  assert.equal(canonicalArtisanToolName("Smith's Tools"), "Smith's Tools");
  assert.equal(canonicalArtisanToolName("Blacksmith's Tools"), "Smith's Tools");
  assert.equal(canonicalArtisanToolName("Blacksmith\u2019s Tools"), "Smith's Tools");
  assert.equal(canonicalArtisanToolName(" Carpenter's Tools "), "Carpenter's Tools");

  const names = craftingFacilityToolNames([
    "Blacksmith's Tools",
    "Blacksmith\u2019s Tools",
    "Smith's Tools",
    "Alchemist's Supplies",
    "Herbalism Kit"
  ]);
  assert.equal(names.filter(name => name === "Smith's Tools").length, 1);
  assert.equal(names.includes("Blacksmith's Tools"), false);
  assert.equal(names.includes("Herbalism Kit"), true);
  assert.equal(names.filter(name => ARTISAN_TOOLS.includes(name)).length, ARTISAN_TOOLS.length);

  const smith = { craft: { tool: "Smith's Tools" }, output: { rarity: "common" } };
  assert.deepEqual(
    recipeFacilityEnvironment(smith, { "Blacksmith's Tools": "forge" }).facility,
    { type: "forge", tier: "common" }
  );
  assert.deepEqual(
    recipeFacilityEnvironment(
      { craft: { tool: "Blacksmith's Tools" }, rarity: "uncommon" },
      { "Smith's Tools": "forge" }
    ).facility,
    { type: "forge", tier: "uncommon" }
  );
  assert.deepEqual(
    recipeFacilityEnvironment(
      { craft: { tool: "Blacksmith\u2019s Tools" }, output: { rarity: "rare" } },
      { "Blacksmith\u2019s Tools": "forge" }
    ).facility,
    { type: "forge", tier: "rare" }
  );
  assert.equal(
    facilityRuleForTool({ "Smith's Tools": "", "Blacksmith's Tools": "forge" }, "Smith's Tools"),
    "forge"
  );
  assert.equal(
    facilityRuleForTool({ "Smith's Tools": "library", "Blacksmith's Tools": "forge" }, "Smith's Tools"),
    "library"
  );
  assert.equal(
    recipeFacilityEnvironment(
      { craft: { tool: "Alchemist's Supplies" }, rarity: "rare" },
      { "Blacksmith's Tools": "forge", "Alchemist's Supplies": "" }
    ).portable,
    true
  );
  const drakkenheim = {
    packId: "monsters-of-drakkenheim",
    output: { rarity: "uncommon" },
    craft: { tool: "Blacksmith's Tools" }
  };
  assert.deepEqual(
    recipeFacilityEnvironment(drakkenheim, { "Smith's Tools": "forge", "Blacksmith's Tools": "library" }).facility,
    { type: "workshop", tier: "uncommon" }
  );
});

test("packaged recipe data uses Smith's Tools and keeps the smith-tool recipe id", () => {
  const dataDir = fileURLToPath(new URL("../data/", import.meta.url));
  const files = [];
  const walk = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".mjs") || entry.name.endsWith(".json")) files.push(full);
    }
  };
  walk(dataDir);
  const legacy = /Blacksmith['\u2019]s Tools|Blacksmith\\u2019s Tools/;
  const hits = files.filter(file => legacy.test(readFileSync(file, "utf8")));
  assert.deepEqual(hits, []);

  const expected = [
    ["data/kibbles-recipes.seed.mjs", "blacksmithing-blacksmiths-tools"],
    ["data/srd-5.1-recipes.mjs", "srd51-blacksmithing-blacksmiths-tools"],
    ["data/srd-5.2-recipes.mjs", "srd52-blacksmithing-blacksmiths-tools"]
  ];
  for (const [file, id] of expected) {
    const text = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    assert.match(text, new RegExp(`"id": "${id}"[\\s\\S]{0,800}"name": "Smith's Tools"`));
    assert.match(text, new RegExp(`"id": "${id}"[\\s\\S]{0,2500}"tool": "Smith's Tools"`));
    assert.match(text, new RegExp(`"id": "${id}"[\\s\\S]{0,4000}"label": "Smith's Tools"`));
  }
});

test("tool rules use the output rarity, allow higher facilities, and support no requirement", () => {
  const configured = { "Smith's Tools": "forge", "Alchemist's Supplies": "" };
  const smith = { rarity: "common", output: { rarity: "uncommon" }, craft: { tool: "Smith's Tools" } };
  smith.craft.environment = recipeFacilityEnvironment(smith, configured);
  assert.deepEqual(smith.craft.environment.facility, { type: "forge", tier: "uncommon" });
  assert.equal(evaluateCraftingEnvironment(smith, { location: { capabilities: [{ type: "forge", tier: "rare" }] } }, locationApi).passed, true);
  assert.equal(evaluateCraftingEnvironment(smith, { location: { capabilities: [{ type: "forge", tier: "common" }] } }, locationApi).passed, false);
  assert.equal(recipeFacilityEnvironment({ craft: { tool: "Alchemist's Supplies" }, rarity: "rare" }, configured).portable, true);
});

test("Rare Forge recipe fails in Emberwood and works in Neverwinter", () => {
  const emberwood = { settlementType: "village", capabilities: [{ type: "forge", tier: "common" }] };
  const neverwinter = { settlementType: "city", capabilities: [{ type: "forge", tier: "rare" }] };
  assert.equal(evaluateCraftingEnvironment(recipe, { location: emberwood }, locationApi).passed, false);
  assert.equal(evaluateCraftingEnvironment(recipe, { location: neverwinter }, locationApi).passed, true);
});

test("Very Rare Forge satisfies a Rare Forge recipe", () => {
  const fort = { settlementType: "road", capabilities: [{ type: "forge", tier: "veryRare" }] };
  assert.equal(evaluateCraftingEnvironment(recipe, { location: fort }, locationApi).passed, true);
});

test("portable recipes can be worked On the Road", () => {
  const portable = { craft: { environment: { portable: true } } };
  const road = { settlementType: "road", capabilities: [] };
  assert.equal(evaluateCraftingEnvironment(portable, { location: road }, locationApi).passed, true);
});

test("legacy recipes remain portable unless they declare a facility", () => {
  assert.equal(normalizeCraftEnvironment({}).portable, true);
  assert.equal(normalizeCraftEnvironment({ facilityType: "forge" }).portable, false);
});

test("facility options come from the Core location capability registry", () => {
  const options = getCraftingFacilityOptions({
    capabilityTiers: ["basic", "masterwork"],
    listCapabilities: () => [
      { id: "forge", name: "Forge", icon: "fa-solid fa-fire", supportsSpecialty: true },
      { id: "library", name: "Library" }
    ]
  });

  assert.deepEqual(options.tiers, ["basic", "masterwork"]);
  assert.deepEqual(options.types.map(type => type.id), ["forge", "library"]);
  assert.equal(options.types[0].supportsSpecialty, true);
});

test("Core activeContext supplies the crafting location", () => {
  const priorGame = globalThis.game;
  globalThis.game = {
    user: { id: "gm" },
    settings: { get: () => { throw new Error("local downtime lookup should not run"); } }
  };
  try {
    const service = new CraftingEnvironmentService();
    const road = { id: "road", name: "On the Road", settlementType: "road", capabilities: [] };
    Object.defineProperty(service, "locationApi", {
      value: {
        ...locationApi,
        current: () => ({ capabilities: [{ type: "forge", tier: "legendary" }] }),
        activeContext(user) {
          assert.equal(user.id, "gm");
          return { location: road, source: "road", sessionId: "active" };
        }
      }
    });
    assert.equal(service.evaluate(recipe).passed, false);
  } finally {
    globalThis.game = priorGame;
  }
});

test("an active On the Road downtime session overrides the scene location", () => {
  const priorGame = globalThis.game;
  globalThis.game = {
    settings: {
      get: () => ({ sessions: { active: { id: "active", status: "active", locationId: null } } })
    }
  };
  try {
    const service = new CraftingEnvironmentService();
    Object.defineProperty(service, "locationApi", {
      value: {
        ...locationApi,
        current: () => ({ capabilities: [{ type: "forge", tier: "legendary" }] })
      }
    });
    assert.equal(service.evaluate(recipe).passed, false);
  } finally {
    globalThis.game = priorGame;
  }
});
