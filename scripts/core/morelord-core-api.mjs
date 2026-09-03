export function getMorelordCoreApi() {
  return game.modules.get("morelord-core")?.api
    ?? globalThis.MorelordCore
    ?? null;
}

export function getMorelordCoreService(serviceName) {
  return getMorelordCoreApi()?.[String(serviceName)] ?? null;
}
