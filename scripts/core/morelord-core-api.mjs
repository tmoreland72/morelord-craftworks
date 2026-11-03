export function getMorelordCoreApi() {
  return game.modules.get("morelord-core")?.api
    ?? globalThis.MorelordCore
    ?? null;
}

export function getMorelordCoreService(serviceName) {
  return getMorelordCoreApi()?.[String(serviceName)] ?? null;
}

export function getMorelordCurrency() {
  const currency = getMorelordCoreService("currency");
  if (!currency?.adjustCurrencyCopper
    || !currency?.copperRate
    || !currency?.cpToCurrency
    || !currency?.currencyToCp
    || !currency?.getCurrencyCopper) {
    throw new Error("Morelord Core currency services are unavailable.");
  }
  return currency;
}
