import { getMorelordCoreApi } from "./morelord-core-api.mjs";
import { isUuidAllowed } from "./allowed-packs.mjs";

const CHANNEL = "morelord-craftworks.party-inventory";
const requests = new Map();
let channel = null;
let writer = null;

export function needsGmForInventoryWrite(actor, user = game.user) {
  return Boolean(
    actor
    && user
    && !user.isGM
    && actor.type === "group"
    && actor.testUserPermission?.(user, "OWNER") !== true
  );
}

export function startCraftworksPartyInventoryRelay(adapter) {
  writer = adapter;
  const socket = getMorelordCoreApi()?.socket;
  if (!socket?.createChannel || channel) return channel;
  channel = socket.createChannel(CHANNEL);
  channel.on(
    "add-item",
    (data, execution) => resolvePartyInventoryAdd(data, execution?.senderUserId),
    { serialize: data => data?.actorUuid || CHANNEL }
  );
  return channel;
}

export function resolvePartyInventoryAdd(data, userId) {
  const requestId = data?.requestId;
  if (typeof requestId !== "string" || !requestId) {
    throw new Error("Invalid party inventory request.");
  }
  const key = `${userId}:${requestId}`;
  if (!requests.has(key)) {
    if (requests.size >= 1000) requests.delete(requests.keys().next().value);
    requests.set(key, executePartyInventoryAdd(data, userId));
  }
  return requests.get(key);
}

async function executePartyInventoryAdd({ actorUuid, sourceUuid, quantity }, userId) {
  if (!game.user?.isGM) {
    return { ok: false, error: "A connected Game Master is required for party inventory." };
  }
  try {
    const user = game.users.get(userId);
    const actor = await fromUuid(actorUuid);
    const source = sourceUuid && isUuidAllowed(sourceUuid) ? await fromUuid(sourceUuid) : null;
    const amount = Math.floor(Number(quantity));
    const allowed = getMorelordCoreApi()?.ui?.participation?.canUseActorInventory?.(actor, user) === true;
    if (
      !user?.active
      || !actor
      || actor.type !== "group"
      || !allowed
      || !source
      || source.documentName !== "Item"
      || !Number.isInteger(amount)
      || amount < 1
    ) {
      throw new Error("You cannot place that item in the party inventory.");
    }
    const item = await writer.addItemToActor(actor, source, amount);
    return { ok: true, itemUuid: item?.uuid ?? null };
  } catch (error) {
    return { ok: false, error: error.message ?? String(error) };
  }
}

export async function addItemAsGm(actor, sourceItem, quantity) {
  if (!channel) startCraftworksPartyInventoryRelay(writer);
  if (!channel?.executeAsGM) {
    throw new Error("Morelord Core's GM relay is not ready.");
  }
  const sourceUuid = sourceItem?.uuid;
  if (!sourceUuid) throw new Error("The item source could not be resolved.");
  const requestId = globalThis.foundry?.utils?.randomID?.(24)
    ?? globalThis.crypto?.randomUUID?.();
  if (!requestId) throw new Error("Craftworks could not identify this party inventory request.");
  const result = await channel.executeAsGM("add-item", {
    requestId,
    actorUuid: actor.uuid,
    sourceUuid,
    quantity: Math.floor(Number(quantity))
  });
  if (!result?.ok) {
    throw new Error(result?.error ?? "The GM could not place the item in the party inventory.");
  }
  const created = result.itemUuid ? await fromUuid(result.itemUuid) : null;
  return created ?? { uuid: result.itemUuid, name: sourceItem.name };
}
