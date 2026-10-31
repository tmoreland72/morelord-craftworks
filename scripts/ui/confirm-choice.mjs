import { getMorelordCoreApi } from "../core/morelord-core-api.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function confirmContent(message) {
  return `<p>${escapeHtml(message)}</p>`;
}

// Core's compact Yes/No dialog. Closing the window is No.
// Older Core builds fall back to DialogV2.confirm.
export async function confirmChoice({
  title = "Confirm",
  content = "",
  yesLabel = "Yes",
  noLabel = "No",
  danger = false
} = {}) {
  const coreConfirm = getMorelordCoreApi()?.ui?.confirm;
  if (typeof coreConfirm === "function") {
    return await coreConfirm({ title, content, yesLabel, noLabel, danger }) === true;
  }
  const dialog = globalThis.foundry?.applications?.api?.DialogV2;
  if (typeof dialog?.confirm !== "function") {
    const text = String(content ?? "").replace(/<[^>]*>/g, "");
    return globalThis.confirm?.(text) !== false;
  }
  return await dialog.confirm({
    classes: ["ml-window", "ml-craftworks-module"],
    window: { title: String(title || "Confirm") },
    rejectClose: false,
    content: `<div><div class="ml-app ml-app-shell ml-dialog-shell">${content}</div></div>`,
    yes: { label: String(yesLabel || "Yes"), default: danger !== true },
    no: { label: String(noLabel || "No"), default: danger === true }
  }) === true;
}
