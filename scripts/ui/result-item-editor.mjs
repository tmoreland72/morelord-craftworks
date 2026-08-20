const MAX_RESULTS = 20;
const COIN_VALUES = Object.freeze({ pp: 1000, gp: 100, ep: 50, sp: 10, cp: 1 });

export function coinEditorValues(result) {
  let remaining = Math.max(0, Math.round(Number(
    result?.coinTotalCopper ?? result?.coinCopper ?? 0
  )));
  return Object.entries(COIN_VALUES).map(([denomination, copper]) => {
    const value = Math.floor(remaining / copper);
    remaining %= copper;
    return { denomination, label: denomination.toUpperCase(), value };
  });
}

export function updateResultCoins(result, values, adapter) {
  if (!result) return;
  const coins = {};
  let totalCopper = 0;
  for (const [denomination, copper] of Object.entries(COIN_VALUES)) {
    const value = Math.max(0, Math.floor(Number(values?.[denomination] ?? 0)));
    coins[denomination] = value;
    totalCopper += value * copper;
  }

  if ("coinTotalCopper" in result) {
    result.coins = coins;
    result.coinTotalCopper = totalCopper;
  } else {
    result.coinCopper = totalCopper;
  }
  result.coinLabel = adapter.formatCopper(totalCopper);
  refreshResultFound(result);
}

export async function searchItemsByName(query, { sourceFilter = null } = {}) {
  const needle = String(query ?? "").trim().toLocaleLowerCase();
  if (needle.length < 2) return [];

  const results = [];
  const seen = new Set();
  const add = entry => {
    if (!entry?.uuid || seen.has(entry.uuid)) return;
    if (!String(entry.name ?? "").toLocaleLowerCase().includes(needle)) return;
    seen.add(entry.uuid);
    results.push(entry);
  };

  const packs = (sourceFilter?.enabledPacks?.({ documentName: "Item" })
    ?? Array.from(game.packs ?? []).filter(pack => pack.documentName === "Item"))
    .filter(pack => pack.visible !== false)
    .filter(pack => sourceFilter?.isPackEnabled(pack) ?? true);

  for (const pack of packs) {
    let index;
    try {
      index = await pack.getIndex({ fields: ["img", "type"] });
    } catch {
      continue;
    }

    for (const item of index ?? []) {
      add({
        uuid: item.uuid ?? `Compendium.${pack.collection}.Item.${item._id}`,
        name: item.name,
        img: item.img,
        type: item.type,
        sourceLabel: sourceFilter?.sourceLabelForPack(pack)
          ?? pack.metadata?.label
          ?? pack.title
          ?? pack.collection
      });
    }
  }

  return results
    .sort((a, b) => {
      const aStarts = a.name.toLocaleLowerCase().startsWith(needle) ? 0 : 1;
      const bStarts = b.name.toLocaleLowerCase().startsWith(needle) ? 0 : 1;
      return aStarts - bStarts || a.name.localeCompare(b.name)
        || a.sourceLabel.localeCompare(b.sourceLabel);
    })
    .slice(0, MAX_RESULTS);
}

export function addCustomItem(result, item) {
  if (!result || !item?.uuid) return;
  result.customItems ??= [];
  result.customItems.push({
    uuid: item.uuid,
    name: item.name,
    img: item.img,
    type: item.type,
    sourceLabel: item.sourceLabel,
    quantity: 1
  });
  refreshResultFound(result);
}

export function deleteSelectedResultItems(result, selections) {
  if (!result) return 0;

  let deleted = 0;
  const grouped = new Map();
  for (const selection of selections) {
    if (selection === "lootSpecial") {
      if (result.special?.itemUuid) {
        result.special.itemUuid = null;
        result.special.itemName = null;
        result.special.itemImg = null;
        result.special.status = "unresolved-result";
        deleted += 1;
      }
      continue;
    }
    const [collection, rawIndex] = String(selection).split(":");
    const index = Number(rawIndex);
    if (!Number.isInteger(index)) continue;
    if (!grouped.has(collection)) grouped.set(collection, []);
    grouped.get(collection).push(index);
  }

  const collections = {
    materials: result.materials,
    potions: result.potions,
    spellScrolls: result.spellScrolls,
    specialItems: result.special?.items,
    customItems: result.customItems
  };

  for (const [collection, indices] of grouped) {
    const values = collections[collection];
    if (!Array.isArray(values)) continue;
    for (const index of [...new Set(indices)].sort((a, b) => b - a)) {
      if (index < 0 || index >= values.length) continue;
      values.splice(index, 1);
      deleted += 1;
    }
  }

  if (result.special?.triggered && Array.isArray(result.special.items)) {
    result.special.status = result.special.items.length ? "items" : "unresolved-result";
  }
  refreshResultFound(result);
  return deleted;
}

export function refreshResultFound(result) {
  const coin = Number(result.coinTotalCopper ?? result.coinCopper ?? 0);
  const specialCount = Array.isArray(result.special?.items)
    ? result.special.items.length
    : Number(Boolean(result.special?.itemUuid));
  result.found = Boolean(
    result.materials?.length
    || result.potions?.length
    || result.spellScrolls?.length
    || result.customItems?.length
    || specialCount
    || coin > 0
  );
}
