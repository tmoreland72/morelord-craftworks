import { MODULE_ID } from "../constants.mjs";

const CORE_MODULE_ID = "morelord-core";
const TOOLS_CORE_VERSION = "0.6.0";
const INITIALIZING_WARNING = "Morelord Craftworks is still initializing.";

function versionParts(version) {
  return String(version ?? "").match(/\d+/g)?.map(Number) ?? [];
}

function isVersionBefore(version, minimum) {
  if (!String(version ?? "").trim()) return false;
  const left = versionParts(version);
  const right = versionParts(minimum);
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference < 0;
  }
  return false;
}

function coreModuleVersion(core) {
  return core?.version
    ?? core?.manifest?.version
    ?? core?.data?.version
    ?? "";
}

export function sceneControlToolName(id) {
  return String(id ?? "").replace(/[-_\s]+(.)/g, (_, character) => character.toUpperCase());
}

function isToolVisible(def) {
  const visible = def?.visible;
  if (typeof visible === "function") return visible() !== false;
  return visible !== false;
}

export function coreToolsApi(core) {
  const tools = core?.api?.tools;
  if (typeof tools?.register !== "function") return null;
  if (isVersionBefore(coreModuleVersion(core), TOOLS_CORE_VERSION)) return null;
  return tools;
}

export function applyLegacyTokenTool(controls, def) {
  const tokenTools = controls?.tokens?.tools;
  if (!tokenTools || !def?.id) return false;

  const name = sceneControlToolName(def.id);
  if (!name) return false;

  tokenTools[name] = {
    name,
    title: def.title,
    icon: def.icon,
    order: Object.keys(tokenTools).length,
    button: true,
    visible: isToolVisible(def),
    onChange: event => def.onClick?.(event)
  };
  return true;
}

export function addMorelordTool(def, dependencies = {}) {
  const hooks = dependencies.hooks ?? globalThis.Hooks;
  const getCoreModule = dependencies.getCoreModule
    ?? (() => globalThis.game?.modules?.get?.(CORE_MODULE_ID));

  hooks.once("setup", () => {
    const tools = coreToolsApi(getCoreModule());
    if (tools) {
      tools.register(def);
      return;
    }

    hooks.on("getSceneControlButtons", controls => {
      applyLegacyTokenTool(controls, def);
    });
  });
}

export function openCraftworksTool() {
  const api = globalThis.MorelordCraftworks
    ?? globalThis.game?.modules?.get?.(MODULE_ID)?.api;

  if (!api?.open) {
    globalThis.ui?.notifications?.warn?.(INITIALIZING_WARNING);
    return;
  }

  api.open();
}

export function createCraftworksToolDefinition() {
  return {
    id: "morelord-craftworks",
    title: "Morelord Craftworks",
    icon: "fa-solid fa-hammer",
    order: 30,
    visible: () => true,
    onClick: () => openCraftworksTool()
  };
}

export function registerCraftworksSceneTool(dependencies) {
  addMorelordTool(createCraftworksToolDefinition(), dependencies);
}
