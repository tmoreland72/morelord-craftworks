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
  describeWorkshopSpecialty,
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
    const actual = (location.capabilities ?? [])
      .filter(capability => capability.type === required.type)
      .sort((left, right) => tiers.indexOf(right.tier) - tiers.indexOf(left.tier))[0];
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

const WORKSHOP_SPECIALTIES = [
  ["brewer", "Brewer's Supplies"],
  ["calligrapher", "Calligrapher's Supplies"],
  ["carpenter", "Carpenter's Tools"],
  ["cartographer", "Cartographer's Tools"],
  ["cobbler", "Cobbler's Tools"],
  ["cook", "Cook's Utensils"],
  ["glassblower", "Glassblower's Tools"],
  ["jeweler", "Jeweler's Tools"],
  ["leatherworker", "Leatherworker's Tools"],
  ["mason", "Mason's Tools"],
  ["painter", "Painter's Supplies"],
  ["potter", "Potter's Tools"],
  ["tinker", "Tinker's Tools"],
  ["weaver", "Weaver's Tools"],
  ["woodcarver", "Woodcarver's Tools"]
].map(([id, label]) => ({ id, label }));

function coreToolCapabilityType(tool) {
  const key = String(tool ?? "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (key === "smith" || key === "smithstools" || key === "blacksmithstools") return "forge";
  if (key === "alchemist" || key === "alchemistssupplies") return "alchemist";
  if (WORKSHOP_SPECIALTIES.some(entry => entry.id === key || entry.label.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g, "") === key)) return "workshop";
  return null;
}

function specialtyApi({ locationAllowsSpecialty = true, listSpecialties = true } = {}) {
  const calls = [];
  const api = {
    ...locationApi,
    calls,
    toolCapabilityType: coreToolCapabilityType,
    ...(listSpecialties ? { listWorkshopSpecialties: () => WORKSHOP_SPECIALTIES } : {}),
    ...(locationAllowsSpecialty ? {
      locationAllowsSpecialty(location, type, toolKey) {
        calls.push({ type, toolKey, capabilities: location.capabilities.map(capability => ({
          type: capability.type,
          tier: capability.tier,
          specialty: capability.specialty ?? null
        })) });
        const matches = (location.capabilities ?? []).filter(capability => capability.type === type);
        if (!matches.length) return false;
        if (!String(toolKey ?? "").trim()) return true;
        return matches.some(capability => {
          const stored = String(capability.specialty ?? "").trim().toLowerCase();
          return stored === "" || stored === "any" || String(capability.specialty).trim() === toolKey;
        });
      }
    } : {})
  };
  return api;
}

function workshopRecipe(tool, tier = "rare", facility = "workshop") {
  return { craft: { tool, environment: { facility: { type: facility, tier } } } };
}

test("a Workshop-mapped tool needs that specialty or Any at the required tier", () => {
  const api = specialtyApi();
  const carpenter = workshopRecipe("Carpenter's Tools", "rare");
  const location = capabilities => ({ capabilities });
  assert.equal(evaluateCraftingEnvironment(carpenter, { location: location([{ type: "workshop", tier: "rare", specialty: "carpenter" }]) }, api).passed, true);
  assert.deepEqual(api.calls[0], {
    type: "workshop",
    toolKey: "carpenter",
    capabilities: [{ type: "workshop", tier: "rare", specialty: "carpenter" }]
  });
  for (const specialty of [null, "", "Any", " any "]) {
    assert.equal(
      evaluateCraftingEnvironment(carpenter, { location: location([{ type: "workshop", tier: "veryRare", specialty }]) }, api).passed,
      true,
      `specialty ${JSON.stringify(specialty)}`
    );
  }
  const wrong = evaluateCraftingEnvironment(carpenter, { location: location([{ type: "workshop", tier: "legendary", specialty: "weaver" }]) }, api);
  assert.equal(wrong.passed, false);
  assert.equal(wrong.reasons[0], "Requires rare workshop whose specialty is Carpenter's Tools or Any.");
  assert.equal(
    evaluateCraftingEnvironment(carpenter, { location: location([
      { type: "workshop", tier: "common", specialty: null },
      { type: "workshop", tier: "rare", specialty: "weaver" }
    ]) }, api).passed,
    false
  );
  assert.deepEqual(api.calls.at(-1).capabilities, [{ type: "workshop", tier: "rare", specialty: "weaver" }]);
  assert.equal(
    evaluateCraftingEnvironment(carpenter, { location: location([
      { type: "workshop", tier: "common", specialty: "carpenter" },
      { type: "workshop", tier: "rare", specialty: "weaver" }
    ]) }, api).passed,
    false
  );
  assert.equal(
    evaluateCraftingEnvironment(carpenter, { location: location([
      { type: "workshop", tier: "rare", specialty: "weaver" },
      { type: "workshop", tier: "legendary", specialty: "" }
    ]) }, api).passed,
    true
  );
});

test("Smith's Tools stay on Forge and Alchemist's Supplies stay on Alchemist without a specialty gate", () => {
  const api = specialtyApi();
  api.locationAllowsSpecialty = () => { throw new Error("Forge and Alchemist specialties must not be checked."); };
  const smith = workshopRecipe("Smith's Tools", "rare", "forge");
  const swordForge = { capabilities: [{ type: "forge", tier: "rare", specialty: "longsword" }] };
  assert.equal(evaluateCraftingEnvironment(smith, { location: swordForge }, api).passed, true);
  assert.equal(describeWorkshopSpecialty("Smith's Tools", api), null);
  assert.equal(describeWorkshopSpecialty("Blacksmith's Tools", api), null);

  const alchemist = workshopRecipe("Alchemist's Supplies", "uncommon", "alchemist");
  assert.equal(evaluateCraftingEnvironment(alchemist, { location: { capabilities: [{ type: "alchemist", tier: "rare", specialty: "potion" }] } }, api).passed, true);
  assert.equal(describeWorkshopSpecialty("Alchemist's Supplies", api), null);

  const smithAtWorkshop = workshopRecipe("Smith's Tools", "common", "workshop");
  assert.equal(
    evaluateCraftingEnvironment(smithAtWorkshop, { location: { capabilities: [{ type: "workshop", tier: "common", specialty: "cobbler" }] } }, api).passed,
    true
  );
});

test("the GM facility rule still chooses the activity, including a legacy Blacksmith's Tools rule", () => {
  const api = specialtyApi();
  api.locationAllowsSpecialty = () => { throw new Error("A non-Workshop facility must not check Workshop specialty."); };
  const carpenterAtForge = { craft: { tool: "Carpenter's Tools" }, rarity: "common" };
  carpenterAtForge.craft.environment = recipeFacilityEnvironment(carpenterAtForge, { "Carpenter's Tools": "forge" });
  assert.equal(evaluateCraftingEnvironment(carpenterAtForge, { location: { capabilities: [{ type: "forge", tier: "common", specialty: "longsword" }] } }, api).passed, true);
  assert.equal(recipeFacilityEnvironment({ craft: { tool: "Carpenter's Tools" }, rarity: "rare" }, { "Carpenter's Tools": "" }).portable, true);

  const legacy = { craft: { tool: "Blacksmith's Tools" }, output: { rarity: "uncommon" } };
  legacy.craft.environment = recipeFacilityEnvironment(legacy, { "Blacksmith's Tools": "forge" });
  assert.deepEqual(legacy.craft.environment.facility, { type: "forge", tier: "uncommon" });
  assert.equal(evaluateCraftingEnvironment(legacy, { location: { capabilities: [{ type: "forge", tier: "rare", specialty: "maul" }] } }, api).passed, true);
});

test("Workshop specialty falls back locally when locationAllowsSpecialty is absent", () => {
  const api = specialtyApi({ locationAllowsSpecialty: false, listSpecialties: false });
  const weaver = workshopRecipe("Weaver's Tools", "uncommon");
  assert.deepEqual(describeWorkshopSpecialty("Weaver's Tools", api), { toolKey: "weaver", label: "Weaver's Tools" });
  assert.equal(evaluateCraftingEnvironment(weaver, { location: { capabilities: [{ type: "workshop", tier: "rare", specialty: "weaver" }] } }, api).passed, true);
  for (const specialty of [null, "", "Any", " any "]) {
    assert.equal(evaluateCraftingEnvironment(weaver, { location: { capabilities: [{ type: "workshop", tier: "rare", specialty }] } }, api).passed, true);
  }
  assert.equal(evaluateCraftingEnvironment(weaver, { location: { capabilities: [{ type: "workshop", tier: "rare", specialty: "potter" }] } }, api).passed, false);
  assert.equal(describeWorkshopSpecialty("Carpenter's Tools", { evaluate() { return { passed: true }; } }), null);
  const untyped = workshopRecipe("Carpenter's Tools", "common");
  assert.equal(evaluateCraftingEnvironment(untyped, { location: { capabilities: [{ type: "workshop", tier: "common", specialty: "weaver" }] } }, locationApi).passed, true);
});

test("a Drakkenheim recipe with no tool accepts any Workshop specialty", () => {
  const api = specialtyApi();
  const recipe = {
    packId: "monsters-of-drakkenheim",
    output: { rarity: "rare" },
    craft: { tool: null }
  };
  recipe.craft.environment = recipeFacilityEnvironment(recipe, { "Carpenter's Tools": "forge" });
  assert.equal(evaluateCraftingEnvironment(recipe, { location: { capabilities: [{ type: "workshop", tier: "rare", specialty: "cobbler" }] } }, api).passed, true);
  assert.equal(api.calls.length, 0);
  const tooled = {
    source: { contentPackId: "monsters-of-drakkenheim" },
    output: { rarity: "rare" },
    craft: { tool: "Carpenter's Tools" }
  };
  tooled.craft.environment = recipeFacilityEnvironment(tooled, {});
  assert.equal(evaluateCraftingEnvironment(tooled, { location: { capabilities: [{ type: "workshop", tier: "rare", specialty: "cobbler" }] } }, api).passed, false);
  assert.equal(evaluateCraftingEnvironment(tooled, { location: { capabilities: [{ type: "workshop", tier: "rare", specialty: "carpenter" }] } }, api).passed, true);
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
