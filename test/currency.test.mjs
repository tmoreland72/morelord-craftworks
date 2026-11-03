import assert from "node:assert/strict";
import test from "node:test";
import { Dnd5eAdapter } from "../scripts/adapters/dnd5e-adapter.mjs";
import {
  coinEditorValues,
  updateResultCoins
} from "../scripts/ui/result-item-editor.mjs";
import * as currencyService from "../../morelord-core/scripts/services/currency-service.js";

// Core main publishes these functions on api.currency. The assertions below
// are the Craftworks results, not values read back out of Core.
const coreCurrency = Object.freeze({
  getCurrency: currencyService.getCurrency,
  currencyToCp: currencyService.currencyToCp,
  totalCp: currencyService.totalCp,
  cpToCurrency: currencyService.cpToCurrency,
  currencyFromCp: currencyService.currencyFromCp,
  copperRate: currencyService.copperRate,
  gpAmount: currencyService.gpAmount,
  formatCp: currencyService.formatCp,
  getCurrencyDisplay: currencyService.getCurrencyDisplay,
  getCurrencyCopper: currencyService.getCurrencyCopper,
  canAfford: currencyService.canAfford,
  setCurrency: currencyService.setCurrency,
  addCurrency: currencyService.addCurrency,
  deductCurrency: currencyService.deductCurrency,
  adjustCurrencyCopper: currencyService.adjustCurrencyCopper,
  applyGpDelta: currencyService.applyGpDelta
});

const LOOT_SETTINGS = {
  lootEnableMaterials: false,
  lootEnableCoin: true,
  lootEnableSpecial: false,
  lootMaterialChanceModifier: 0,
  lootCoinChanceModifier: 0,
  lootSpecialChanceModifier: 0,
  lootMaterialQuantityMultiplier: 1,
  lootCoinMultiplier: 1
};

function installCoreCurrency() {
  globalThis.MorelordCore = { currency: coreCurrency };
  const game = globalThis.game ?? {};
  game.modules = new Map([["morelord-core", { api: { currency: coreCurrency } }]]);
  globalThis.game = game;
}

function actorWith(currency, name = "Aric") {
  const actor = {
    name,
    system: { currency: { ...currency } },
    async update(change) {
      if (change["system.currency"]) {
        actor.system.currency = { ...change["system.currency"] };
        return;
      }
      for (const [key, value] of Object.entries(change)) {
        const prefix = "system.currency.";
        if (key.startsWith(prefix)) actor.system.currency[key.slice(prefix.length)] = value;
      }
    }
  };
  return actor;
}

const COIN_TABLE = Object.freeze([
  ["pp", 1000],
  ["gp", 100],
  ["ep", 50],
  ["sp", 10],
  ["cp", 1]
]);

function expectedLabel(copper) {
  let remaining = Math.max(0, Math.round(Number(copper ?? 0)));
  const parts = [];
  for (const [denomination, value] of COIN_TABLE) {
    const quantity = Math.floor(remaining / value);
    remaining %= value;
    if (quantity) parts.push(`${quantity} ${denomination}`);
  }
  return parts.length ? parts.join(", ") : "0 gp";
}

function expectedPurse(coppers) {
  const purse = { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };
  for (const copper of coppers) {
    let remaining = Math.max(0, Math.round(copper));
    for (const [denomination, value] of COIN_TABLE) {
      purse[denomination] += Math.floor(remaining / value);
      remaining %= value;
    }
  }
  return purse;
}

function expectedTotal(purse) {
  return COIN_TABLE.reduce((total, [denomination, value]) => total + purse[denomination] * value, 0);
}

test.describe("Craftworks currency", { concurrency: false }, () => {
  let previousConfig;

  test.before(() => {
    previousConfig = globalThis.CONFIG;
    delete globalThis.CONFIG;
    installCoreCurrency();
  });

  test.after(() => {
    if (previousConfig === undefined) delete globalThis.CONFIG;
    else globalThis.CONFIG = previousConfig;
  });

  test("coin values convert pp, gp, ep, sp, and cp to copper", () => {
    const adapter = new Dnd5eAdapter();
    const purse = currency => ({ system: { currency } });

    assert.equal(adapter.getCurrencyCopper(purse({ pp: 1 })), 1000);
    assert.equal(adapter.getCurrencyCopper(purse({ gp: 1 })), 100);
    assert.equal(adapter.getCurrencyCopper(purse({ ep: 1 })), 50);
    assert.equal(adapter.getCurrencyCopper(purse({ sp: 1 })), 10);
    assert.equal(adapter.getCurrencyCopper(purse({ cp: 1 })), 1);
    assert.equal(
      adapter.getCurrencyCopper(purse({ pp: 1, gp: 2, ep: 1, sp: 3, cp: 4 })),
      1284
    );
    assert.equal(adapter.getCurrencyCopper(purse({})), 0);
    assert.equal(adapter.getCurrencyCopper(null), 0);
  });

  test("gp conversion keeps fractional gold and rounds the copper total", () => {
    const adapter = new Dnd5eAdapter();
    const purse = currency => ({ system: { currency } });

    assert.equal(adapter.getCurrencyCopper(purse({ gp: 12, sp: 5 })), 1250);
    assert.equal(adapter.formatCopper(1250), "1 pp, 2 gp, 1 ep");
    assert.equal(adapter.formatCopper(100), "1 gp");
    assert.equal(adapter.formatCopper(50), "1 ep");
    assert.equal(adapter.formatCopper(10), "1 sp");
    assert.equal(adapter.formatCopper(15), "1 sp, 5 cp");
    assert.equal(adapter.formatCopper(4), "4 cp");
    assert.equal(adapter.formatCopper(10000), "10 pp");
    assert.equal(adapter.formatCopper(0), "0 gp");
    assert.equal(adapter.formatCopper(null), "0 gp");
    assert.equal(adapter.formatCopper(-20), "0 gp");
    assert.equal(adapter.formatCopper(10.4), "1 sp");
    assert.equal(adapter.formatCopper(10.5), "1 sp, 1 cp");
    assert.equal(adapter.formatCopper(50.4), "1 ep");
    assert.equal(adapter.formatCopper(50.6), "1 ep, 1 cp");
    assert.equal(adapter.formatCopper(99.5), "1 gp");
  });

  test("adjustCurrencyCopper normalizes a purse and refuses a short one", async () => {
    const adapter = new Dnd5eAdapter();
    const actor = actorWith({ gp: 1, sp: 5 });

    assert.deepEqual(
      await adapter.adjustCurrencyCopper(actor, 50),
      { pp: 0, gp: 2, ep: 0, sp: 0, cp: 0 }
    );
    assert.equal(adapter.getCurrencyCopper(actor), 200);

    assert.deepEqual(
      await adapter.adjustCurrencyCopper(actor, -40),
      { pp: 0, gp: 1, ep: 1, sp: 1, cp: 0 }
    );
    assert.equal(adapter.getCurrencyCopper(actor), 160);

    const empty = actorWith({});
    assert.deepEqual(
      await adapter.adjustCurrencyCopper(empty, 10.6),
      { pp: 0, gp: 0, ep: 0, sp: 1, cp: 1 }
    );
    assert.equal(adapter.formatCopper(adapter.getCurrencyCopper(empty)), "1 sp, 1 cp");

    await assert.rejects(
      () => adapter.adjustCurrencyCopper(actor, -1000),
      /Aric does not have enough currency\./
    );
    assert.equal(adapter.getCurrencyCopper(actor), 160);
    await assert.rejects(
      () => adapter.adjustCurrencyCopper(null, 1),
      /A currency Actor is required\./
    );
  });

  test("the coin editor splits and writes the same copper totals", () => {
    const adapter = new Dnd5eAdapter();

    assert.deepEqual(coinEditorValues({ coinTotalCopper: 1250 }), [
      { denomination: "pp", label: "PP", value: 1 },
      { denomination: "gp", label: "GP", value: 2 },
      { denomination: "ep", label: "EP", value: 1 },
      { denomination: "sp", label: "SP", value: 0 },
      { denomination: "cp", label: "CP", value: 0 }
    ]);
    assert.deepEqual(coinEditorValues({ coinCopper: 15 }), [
      { denomination: "pp", label: "PP", value: 0 },
      { denomination: "gp", label: "GP", value: 0 },
      { denomination: "ep", label: "EP", value: 0 },
      { denomination: "sp", label: "SP", value: 1 },
      { denomination: "cp", label: "CP", value: 5 }
    ]);
    assert.deepEqual(coinEditorValues({ coinTotalCopper: 10.6 }).map(row => row.value), [0, 0, 0, 1, 1]);

    const loot = { coinTotalCopper: 0, coins: {}, coinLabel: "", found: false };
    updateResultCoins(loot, { pp: 1, gp: "2.9", ep: -1, sp: 3, cp: 4 }, adapter);
    assert.deepEqual(loot.coins, { pp: 1, gp: 2, ep: 0, sp: 3, cp: 4 });
    assert.equal(loot.coinTotalCopper, 1234);
    assert.equal(loot.coinLabel, "1 pp, 2 gp, 3 sp, 4 cp");
    assert.equal(loot.found, true);

    const hoard = { coinCopper: 40, coinLabel: "4 sp", found: true };
    updateResultCoins(hoard, { gp: 1, sp: 5 }, adapter);
    assert.equal(hoard.coinCopper, 150);
    assert.equal(hoard.coinLabel, "1 gp, 1 ep");
    assert.equal(hoard.found, true);

    updateResultCoins(hoard, { gp: 0, sp: 0, cp: 0 }, adapter);
    assert.equal(hoard.coinCopper, 0);
    assert.equal(hoard.coinLabel, "0 gp");
    assert.equal(hoard.found, false);
  });

  test("encounter loot totals keep gp conversion, purse sums, and labels", async () => {
    globalThis.foundry = {
      applications: {
        api: {
          ApplicationV2: class {},
          HandlebarsApplicationMixin: Base => Base
        }
      },
      utils: {
        deepClone: value => structuredClone(value),
        randomID: () => "loot-session"
      }
    };
    globalThis.game = {
      user: { id: "gm" },
      modules: new Map([["morelord-core", { api: { currency: coreCurrency } }]]),
      settings: {
        get(_moduleId, key) {
          return LOOT_SETTINGS[key];
        }
      }
    };
    globalThis.MorelordCore = { currency: coreCurrency };
    globalThis.fromUuid = async () => ({
      async setFlag() {},
      async unsetFlag() {}
    });

    const { LootService } = await import("../scripts/acquisition/loot-service.mjs");
    const { AcquisitionSessionManager } = await import("../scripts/acquisition/session-manager.mjs");

    const previousCoin = {
      enabled: LOOT_SETTINGS.lootEnableCoin,
      modifier: LOOT_SETTINGS.lootCoinChanceModifier,
      multiplier: LOOT_SETTINGS.lootCoinMultiplier
    };

    async function rollLoot(creatures, { multiplier = 1, coin = true } = {}) {
      LOOT_SETTINGS.lootCoinMultiplier = multiplier;
      LOOT_SETTINGS.lootEnableCoin = coin;
      LOOT_SETTINGS.lootCoinChanceModifier = coin ? 100 : 0;
      const sessions = new AcquisitionSessionManager();
      const service = new LootService({
        adapter: new Dnd5eAdapter(),
        materialRegistry: { get() { return null; } },
        materialService: {},
        sessions,
        recipientResolver: { resolve: async () => null },
        specialTreasure: {},
        contentPacks: { enabled: () => [{ id: "standard-core" }] }
      });
      const session = await service.start({ creatureContexts: creatures });
      return service.roll(session.id);
    }

    function gpBounds(cr, multiplier) {
      const range = cr >= 17
        ? { minGp: 50, maxGp: 500 }
        : cr >= 5
          ? { minGp: 2, maxGp: 20 }
          : { minGp: 0.05, maxGp: 3 };
      const minCopper = Math.max(0, Math.round(range.minGp * 100 * multiplier));
      const maxCopper = Math.max(minCopper, Math.round(range.maxGp * 100 * multiplier));
      return [minCopper, maxCopper];
    }

    function assertHaul(result, creatures, multiplier) {
      const coppers = result.rolls.map((entry, index) => {
        const [minCopper, maxCopper] = gpBounds(creatures[index].cr, multiplier);
        assert.equal(entry.coin.copper >= minCopper && entry.coin.copper <= maxCopper, true);
        assert.equal(entry.coin.label, expectedLabel(entry.coin.copper));
        return entry.coin.copper;
      });
      const purse = expectedPurse(coppers);
      const total = coppers.reduce((sum, copper) => sum + copper, 0);
      assert.equal(expectedTotal(purse), total);
      assert.equal(result.coinTotalCopper, total);
      assert.deepEqual(result.coins, purse);
      assert.equal(result.coinLabel, expectedLabel(total));
    }

    try {
      const disabled = await rollLoot(
        [{ tokenUuid: "Token.a", name: "Bandit", cr: 0 }],
        { coin: false }
      );
      assert.equal(disabled.coinTotalCopper, 0);
      assert.equal(disabled.coinLabel, "0 gp");
      assert.deepEqual(disabled.coins, { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 });
      assert.equal(disabled.rolls[0].coin, null);

      const creatures = [
        { tokenUuid: "Token.b", name: "Bandit", cr: 0 },
        { tokenUuid: "Token.c", name: "Scout", cr: 0 },
        { tokenUuid: "Token.d", name: "Mage", cr: 5 },
        { tokenUuid: "Token.e", name: "Lich", cr: 17 }
      ];
      assertHaul(await rollLoot(creatures), creatures, 1);
      assertHaul(await rollLoot(creatures, { multiplier: 2 }), creatures, 2);
      assertHaul(await rollLoot(creatures, { multiplier: 1.5 }), creatures, 1.5);
    } finally {
      Object.assign(LOOT_SETTINGS, {
        lootEnableCoin: previousCoin.enabled,
        lootCoinChanceModifier: previousCoin.modifier,
        lootCoinMultiplier: previousCoin.multiplier
      });
    }
  });
});
