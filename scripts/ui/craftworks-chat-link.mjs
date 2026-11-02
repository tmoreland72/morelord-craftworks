import { isUuidAllowed } from "../core/allowed-packs.mjs";

const DISABLED_SOURCE = "That source is disabled in D&D5e Configure Sources.";

export async function openCraftworksChatLink(uuid) {
  if (!isUuidAllowed(uuid)) {
    ui.notifications.warn(DISABLED_SOURCE);
    return;
  }

  try {
    const document = await fromUuid(uuid);
    if (!document) throw new Error("Document not found");
    document.sheet?.render(true);
  } catch {
    ui.notifications.warn("The source Item could not be opened.");
  }
}

export async function handleCraftworksChatLinkClick(event) {
  const row = event.target.closest?.("[data-ml-craftworks-link-target]");
  if (!row) return;

  // Let Foundry handle its native UUID link so the normal document preview,
  // pinning, and click behavior remain available on the linked item name.
  if (event.target.closest?.(".content-link")) return;

  event.preventDefault();
  event.stopPropagation();

  const uuid = row.dataset.mlCraftworksLinkTarget;
  if (!uuid) return;
  await openCraftworksChatLink(uuid);
}
