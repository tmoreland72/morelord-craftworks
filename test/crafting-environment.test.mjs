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
  canonicalFacilityRule,
  facilityChoicesForSelection,
  facilityRequirementPhrase,
  facilityRuleForTool,
  formatWorkshopSpecialty,
  getCraftingFacilityOptions,
  normalizeCraftEnvironment,
  parseFacilityRule,
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

test("facility choices offer a type or one Core specialty, and a saved type stays selected", () => {
  const options = getCraftingFacilityOptions({
    listCapabilities: () => [
      { id: "forge", name: "Forge", supportsSpecialty: true },
      { id: "workshop", name: "Workshop", supportsSpecialty: true },
      { id: "alchemist", name: "Alchemist" }
    ],
    listForgeSpecialties: () => [
      { id: "armor", label: "Armor", category: "Armor" },
      { id: "hvy", label: "Heavy Armor", category: "Armor" },
      { id: "weapon", label: "Weapons", category: "Weapons" },
      { id: "mar", label: "Martial Weapons", category: "Weapons" },
      { id: "martialM", label: "Martial Melee Weapons", category: "Weapons" },
      { id: "ammo", label: "Ammunition", category: "Weapons" }
    ],
    buildSpecialtyOptions(typeId) {
      if (typeId === "forge") return { groups: [
        { label: "Weapon Masteries", options: [{ value: "longsword", label: "Longsword" }] }
      ] };
      if (typeId === "workshop") return { groups: [
        { label: "", options: [{ value: "leatherworker", label: "Leatherworker's Tools" }] }
      ] };
      return null;
    }
  });
  const values = options.choices.flatMap(choice => choice.options.map(option => option.value));
  assert.equal(values.includes("forge"), true);
  assert.equal(values.includes("forge:longsword"), false);
  assert.equal(values.includes("forge:mar"), false);
  assert.equal(values.includes("forge:martialM"), false);
  assert.equal(values.includes("forge:hvy"), false);
  assert.equal(options.choices.some(choice => String(choice.group).startsWith("Forge:")), false);
  const workshop = options.choices.find(choice => choice.group === "Workshop");
  assert.deepEqual(workshop.options.map(option => option.value), ["workshop", "workshop:leatherworker"]);
  assert.equal(workshop.options[1].label, "Workshop: Leatherworker's Tools");
  assert.equal(canonicalFacilityRule("forge:longsword"), "forge");
  assert.equal(canonicalFacilityRule("forge:martialM"), "forge");
  assert.equal(canonicalFacilityRule("forge:plate"), "forge");
  assert.equal(canonicalFacilityRule("forge:not-a-weapon"), "forge");
  assert.equal(canonicalFacilityRule("workshop:leatherworker"), "workshop:leatherworker");

  const selected = facilityChoicesForSelection(options.choices, canonicalFacilityRule("forge:longsword"));
  assert.equal(selected.flatMap(choice => choice.options).find(option => option.value === "forge").selected, true);
  assert.equal(parseFacilityRule("workshop").specialty, "");
  assert.deepEqual(parseFacilityRule("workshop:leatherworker"), { type: "workshop", specialty: "leatherworker" });
  assert.deepEqual(parseFacilityRule("forge"), { type: "forge", specialty: "" });
});

test("Core activeContext supplies the crafting location", () => {
  const priorGame = globalThis.game;
  globalThis.game = {
    user: { id: "gm", viewedScene: "scene-town" },
    settings: { get: () => { throw new Error("local downtime lookup should not run"); } }
  };
  try {
    const service = new CraftingEnvironmentService();
    const town = { id: "town", capabilities: [{ type: "forge", tier: "legendary" }] };
    const road = { id: "road", name: "On the Road", settlementType: "road", capabilities: [], metadata: { virtual: true } };
    Object.defineProperty(service, "locationApi", {
      value: {
        ...locationApi,
        forScene: sceneId => sceneId === "scene-town" ? town : null,
        current: () => { throw new Error("the viewed scene association should win"); },
        activeContext(user) {
          assert.equal(user.id, "gm");
          return { location: road, source: "road", sessionId: "active" };
        }
      }
    });
    assert.equal(service.evaluate(recipe).passed, true);

    const explicit = new CraftingEnvironmentService();
    Object.defineProperty(explicit, "locationApi", {
      value: {
        ...locationApi,
        forScene: () => town,
        current: () => town,
        activeContext() {
          return { location: { id: "keep", capabilities: [] }, source: "downtime", sessionId: "active" };
        }
      }
    });
    const blocked = explicit.evaluate(recipe);
    assert.equal(blocked.passed, false);
    assert.equal(blocked.reasons[0], "Requires rare forge.");
  } finally {
    globalThis.game = priorGame;
  }
});

test("a Downtime session with No Location uses the scene-associated Alchemist", () => {
  const priorGame = globalThis.game;
  const alchemist = {
    id: "phandalin",
    name: "Phandalin",
    settlementType: "village",
    sceneIds: ["scene-town"],
    capabilities: [{ type: "alchemist", tier: "common" }]
  };
  const antitoxin = {
    craft: {
      tool: "Alchemist's Supplies",
      environment: { facility: { type: "alchemist", tier: "common" } }
    }
  };
  globalThis.game = {
    user: { id: "darro", viewedScene: "scene-town" },
    settings: { get: () => { throw new Error("local downtime lookup should not run"); } }
  };
  try {
    const service = new CraftingEnvironmentService();
    Object.defineProperty(service, "locationApi", {
      value: {
        ...locationApi,
        forScene: sceneId => sceneId === "scene-town" ? alchemist : null,
        current: () => null,
        activeContext(user) {
          assert.equal(user.viewedScene, "scene-town");
          return {
            location: { id: "road", name: "On the Road", settlementType: "road", capabilities: [], metadata: { virtual: true } },
            source: "road",
            sessionId: "week"
          };
        }
      }
    });
    const allowed = service.evaluate(antitoxin);
    assert.equal(allowed.passed, true);
    assert.equal(allowed.location.id, "phandalin");

    const nowhere = new CraftingEnvironmentService();
    Object.defineProperty(nowhere, "locationApi", {
      value: {
        ...locationApi,
        forScene: () => null,
        current: () => null,
        activeContext() {
          return {
            location: { id: "road", name: "On the Road", settlementType: "road", capabilities: [], metadata: { virtual: true } },
            source: "road",
            sessionId: "week"
          };
        }
      }
    });
    const blocked = nowhere.evaluate(antitoxin);
    assert.equal(blocked.passed, false);
    assert.equal(blocked.reasons[0], "Requires common alchemist.");
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

function storedSpecialtyKeys(value) {
  const raw = Array.isArray(value) ? value : [value];
  const keys = [];
  const seen = new Set();
  for (const entry of raw) {
    const key = String(entry ?? "").trim();
    if (!key || key.toLowerCase() === "any" || seen.has(key)) continue;
    seen.add(key);
    keys.push(key);
  }
  return keys;
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
        const requested = String(toolKey ?? "").trim();
        if (!requested || requested.toLowerCase() === "any") return true;
        return matches.some(capability => {
          const keys = storedSpecialtyKeys(capability.specialty);
          return !keys.length || keys.includes(requested);
        });
      }
    } : {})
  };
  return api;
}

function workshopRecipe(tool, tier = "rare", facility = "workshop", specialty = "") {
  const facilityObject = { type: facility, tier };
  if (specialty) facilityObject.specialty = specialty;
  return { craft: { tool, environment: { facility: facilityObject } } };
}

test("a type-only facility ignores specialties and an assigned specialty uses Core's match", () => {
  const api = specialtyApi();
  const typeOnly = workshopRecipe("Carpenter's Tools", "rare");
  const weaverPlace = { capabilities: [{ type: "workshop", tier: "rare", specialty: "weaver" }] };
  assert.equal(evaluateCraftingEnvironment(typeOnly, { location: weaverPlace }, api).passed, true);
  assert.equal(api.calls.length, 0);
  assert.equal(
    evaluateCraftingEnvironment(typeOnly, { location: weaverPlace }, api).reasons.length,
    0
  );

  const carpenter = workshopRecipe("Carpenter's Tools", "rare", "workshop", "carpenter");
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
  assert.equal(wrong.reasons[0], "Requires rare workshop (Carpenter's Tools or Any).");
  assert.equal(facilityRequirementPhrase({ tier: "common", type: "workshop" }, "Leatherworker's Tools"), "common workshop (Leatherworker's Tools or Any)");
  assert.equal(facilityRequirementPhrase({ tier: "common", type: "workshop" }), "common workshop");
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

test("a saved type-only rule stays type-only and a specialty rule names that specialty", () => {
  const leather = { craft: { tool: "Leatherworker's Tools" }, output: { rarity: "common" } };
  leather.craft.environment = recipeFacilityEnvironment(leather, { "Leatherworker's Tools": "workshop" });
  assert.deepEqual(leather.craft.environment.facility, { type: "workshop", tier: "common" });
  const api = specialtyApi();
  api.locationAllowsSpecialty = () => { throw new Error("A type-only rule must not check specialty."); };
  assert.equal(evaluateCraftingEnvironment(leather, {
    location: { capabilities: [{ type: "workshop", tier: "common", specialty: "weaver" }] }
  }, api).passed, true);

  const named = { craft: { tool: "Leatherworker's Tools" }, output: { rarity: "common" } };
  named.craft.environment = recipeFacilityEnvironment(named, { "Leatherworker's Tools": "workshop:leatherworker" });
  assert.deepEqual(named.craft.environment.facility, { type: "workshop", tier: "common", specialty: "leatherworker" });
  const matching = specialtyApi();
  assert.equal(evaluateCraftingEnvironment(named, {
    location: { capabilities: [{ type: "workshop", tier: "rare", specialty: "leatherworker" }] }
  }, matching).passed, true);
  const legacy = evaluateCraftingEnvironment(named, {
    location: { capabilities: [{ type: "workshop", tier: "common", specialty: "leatherworker" }] }
  }, matching);
  assert.equal(legacy.passed, true);
  const storedString = evaluateCraftingEnvironment(workshopRecipe("Leatherworker's Tools", "common", "workshop", "leatherworker"), {
    location: { capabilities: [{ type: "workshop", tier: "common", specialty: "leatherworker" }] }
  }, specialtyApi({ locationAllowsSpecialty: false }));
  assert.equal(storedString.passed, true);
  assert.equal(evaluateCraftingEnvironment(named, {
    location: { capabilities: [{ type: "workshop", tier: "common", specialty: "cobbler" }] }
  }, matching).reasons[0], "Requires common workshop (Leatherworker's Tools or Any).");

  const sword = {
    name: "Longsword",
    craft: { tool: "Smith's Tools" },
    output: { rarity: "common", label: "Longsword" }
  };
  sword.craft.environment = recipeFacilityEnvironment(sword, { "Smith's Tools": "forge:longsword" });
  assert.deepEqual(sword.craft.environment.facility, { type: "forge", tier: "common" });
  const forgeApi = specialtyApi({ locationAllowsSpecialty: false });
  for (const specialty of ["weapon", "mar", "martialM", "Any", ""]) {
    assert.equal(evaluateCraftingEnvironment(sword, {
      location: { capabilities: [{ type: "forge", tier: "common", specialty }] }
    }, forgeApi).passed, true, specialty || "empty");
  }
  const blocked = evaluateCraftingEnvironment(sword, {
    location: { capabilities: [{ type: "forge", tier: "common", specialty: "simpleM" }] }
  }, forgeApi);
  assert.equal(blocked.passed, false);
  assert.equal(blocked.reasons[0], "Requires common forge (Martial Melee Weapons or Any).");
  const splint = { name: "Splint", craft: { tool: "Smith's Tools" }, output: { rarity: "common", label: "Splint" } };
  splint.craft.environment = recipeFacilityEnvironment(splint, { "Smith's Tools": "forge" });
  assert.equal(evaluateCraftingEnvironment(splint, {
    location: { capabilities: [{ type: "forge", tier: "common", specialty: "armor" }] }
  }, forgeApi).passed, true);
  assert.equal(evaluateCraftingEnvironment(splint, {
    location: { capabilities: [{ type: "forge", tier: "common", specialty: "hvy" }] }
  }, forgeApi).passed, true);
  assert.equal(evaluateCraftingEnvironment(splint, {
    location: { capabilities: [{ type: "forge", tier: "common", specialty: "lgt" }] }
  }, forgeApi).reasons[0], "Requires common forge (Heavy Armor or Any).");
  const tongs = { name: "Tongs", craft: { tool: "Smith's Tools" }, output: { rarity: "common", label: "Tongs", itemType: "loot" } };
  tongs.craft.environment = recipeFacilityEnvironment(tongs, { "Smith's Tools": "forge:martialM" });
  assert.equal(tongs.craft.environment.facility.specialty, undefined);
  assert.equal(evaluateCraftingEnvironment(tongs, {
    location: { capabilities: [{ type: "forge", tier: "common", specialty: "shl" }] }
  }, forgeApi).passed, true);
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
  const weaver = workshopRecipe("Weaver's Tools", "uncommon", "workshop", "weaver");
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
  assert.deepEqual(tooled.craft.environment.facility, { type: "workshop", tier: "rare" });
  assert.equal(evaluateCraftingEnvironment(tooled, { location: { capabilities: [{ type: "workshop", tier: "rare", specialty: "cobbler" }] } }, api).passed, true);
});

test("Workshop specialty arrays, empty lists, and legacy strings match the same way", () => {
  const carpenter = workshopRecipe("Carpenter's Tools", "rare", "workshop", "carpenter");
  const location = capabilities => ({ capabilities });
  const shapes = [
    ["several keys", ["cobbler", "carpenter", "weaver"], true],
    ["several keys without the tool", ["cobbler", "weaver"], false],
    ["empty array", [], true],
    ["legacy string", "carpenter", true],
    ["other legacy string", "weaver", false]
  ];
  for (const useApi of [true, false]) {
    const api = specialtyApi({ locationAllowsSpecialty: useApi, listSpecialties: useApi });
    for (const [name, specialty, passed] of shapes) {
      const result = evaluateCraftingEnvironment(carpenter, {
        location: location([{ type: "workshop", tier: "rare", specialty }])
      }, api);
      assert.equal(result.passed, passed, `${useApi ? "api" : "fallback"} ${name}`);
      if (useApi) {
        assert.deepEqual(api.calls.at(-1).capabilities[0].specialty, specialty ?? null);
      }
    }
    const trimmed = evaluateCraftingEnvironment(carpenter, {
      location: location([{ type: "workshop", tier: "rare", specialty: ["weaver", "Any", "weaver", " carpenter "] }])
    }, api);
    assert.equal(trimmed.passed, true, `${useApi ? "api" : "fallback"} trims a mixed list`);
    const onlyAny = evaluateCraftingEnvironment(carpenter, {
      location: location([{ type: "workshop", tier: "rare", specialty: ["Any"] }])
    }, api);
    assert.equal(onlyAny.passed, true, `${useApi ? "api" : "fallback"} Any in a list is unrestricted`);
  }
  assert.equal(formatWorkshopSpecialty(["carpenter", "weaver"]), "Carpenter's Tools, Weaver's Tools");
  assert.equal(formatWorkshopSpecialty([]), "Any");
  assert.equal(formatWorkshopSpecialty("carpenter"), "Carpenter's Tools");
  assert.equal(formatWorkshopSpecialty(["Any", ""]), "Any");
  assert.equal(formatWorkshopSpecialty(" weaver "), "Weaver's Tools");
});

test("a Downtime session with No Location falls back to the active scene", () => {
  const priorGame = globalThis.game;
  const sessions = { active: { id: "active", status: "active", locationId: null } };
  globalThis.game = {
    user: { id: "darro" },
    settings: { get: () => ({ sessions }) }
  };
  try {
    const service = new CraftingEnvironmentService();
    const town = { id: "town", capabilities: [{ type: "alchemist", tier: "common" }] };
    const antitoxin = { craft: { environment: { facility: { type: "alchemist", tier: "common" } } } };
    Object.defineProperty(service, "locationApi", {
      value: {
        ...locationApi,
        current: () => town,
        get: () => ({ id: "wilderness", capabilities: [] })
      }
    });
    const allowed = service.evaluate(antitoxin);
    assert.equal(allowed.passed, true);
    assert.equal(allowed.location.id, "town");

    sessions.active.locationId = "wilderness";
    const blocked = service.evaluate(antitoxin);
    assert.equal(blocked.passed, false);
    assert.equal(blocked.reasons[0], "Requires common alchemist.");
  } finally {
    globalThis.game = priorGame;
  }
});
