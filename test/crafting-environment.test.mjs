import test from "node:test";
import assert from "node:assert/strict";
import {
  CraftingEnvironmentService,
  evaluateCraftingEnvironment,
  getCraftingFacilityOptions,
  normalizeCraftEnvironment
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
