import assert from "node:assert/strict";
import test from "node:test";
import {
  addMorelordTool,
  applyLegacyTokenTool,
  coreToolsApi,
  createCraftworksToolDefinition,
  openCraftworksTool,
  sceneControlToolName
} from "../scripts/ui/morelord-tool.mjs";

function createHooks() {
  const listeners = new Map();
  return {
    once(name, fn) {
      const wrapped = (...args) => {
        const list = listeners.get(name) ?? [];
        const index = list.indexOf(wrapped);
        if (index >= 0) list.splice(index, 1);
        fn(...args);
      };
      const list = listeners.get(name) ?? [];
      list.push(wrapped);
      listeners.set(name, list);
    },
    on(name, fn) {
      const list = listeners.get(name) ?? [];
      list.push(fn);
      listeners.set(name, list);
    },
    emit(name, ...args) {
      for (const fn of [...(listeners.get(name) ?? [])]) fn(...args);
    },
    listenerCount(name) {
      return (listeners.get(name) ?? []).length;
    }
  };
}

function craftworksDef(onClick = () => {}) {
  return {
    id: "morelord-craftworks",
    title: "Morelord Craftworks",
    icon: "fa-solid fa-hammer",
    order: 30,
    visible: () => true,
    onClick
  };
}

test("scene control keys keep the historical Token tool name", () => {
  assert.equal(sceneControlToolName("morelord-craftworks"), "morelordCraftworks");
});

test("Craftworks tool stays visible to every user and opens through the init guard", () => {
  const def = createCraftworksToolDefinition();
  assert.deepEqual(
    {
      id: def.id,
      title: def.title,
      icon: def.icon,
      order: def.order,
      visible: def.visible()
    },
    {
      id: "morelord-craftworks",
      title: "Morelord Craftworks",
      icon: "fa-solid fa-hammer",
      order: 30,
      visible: true
    }
  );

  const warnings = [];
  const previous = {
    MorelordCraftworks: globalThis.MorelordCraftworks,
    game: globalThis.game,
    ui: globalThis.ui
  };
  try {
    globalThis.MorelordCraftworks = undefined;
    globalThis.game = { modules: { get: () => undefined } };
    globalThis.ui = { notifications: { warn: message => warnings.push(message) } };
    def.onClick();
    assert.deepEqual(warnings, ["Morelord Craftworks is still initializing."]);

    let opened = 0;
    globalThis.MorelordCraftworks = { open: () => { opened += 1; } };
    def.onClick();
    assert.equal(opened, 1);
    assert.equal(warnings.length, 1);
  } finally {
    globalThis.MorelordCraftworks = previous.MorelordCraftworks;
    globalThis.game = previous.game;
    globalThis.ui = previous.ui;
  }
});

test("openCraftworksTool uses the module api when the global is missing", () => {
  const previous = {
    MorelordCraftworks: globalThis.MorelordCraftworks,
    game: globalThis.game,
    ui: globalThis.ui
  };
  try {
    let opened = 0;
    globalThis.MorelordCraftworks = undefined;
    globalThis.game = {
      modules: {
        get(id) {
          assert.equal(id, "morelord-craftworks");
          return { api: { open: () => { opened += 1; } } };
        }
      }
    };
    globalThis.ui = { notifications: { warn() { throw new Error("should not warn"); } } };
    openCraftworksTool();
    assert.equal(opened, 1);
  } finally {
    globalThis.MorelordCraftworks = previous.MorelordCraftworks;
    globalThis.game = previous.game;
    globalThis.ui = previous.ui;
  }
});

test("core 0.6.0 with api.tools.register is used as the tools api", () => {
  const register = () => {};
  const tools = { register };
  assert.equal(coreToolsApi({ version: "0.6.0", api: { tools } }), tools);
  assert.equal(coreToolsApi({ version: "0.6.1", api: { tools } }), tools);
  assert.equal(coreToolsApi({ manifest: { version: "1.0.0" }, api: { tools } }), tools);
  assert.equal(coreToolsApi({ api: { tools } }), tools);
});

test("core older than 0.6.0 or without register falls back", () => {
  const tools = { register() {} };
  assert.equal(coreToolsApi({ version: "0.5.1", api: { tools } }), null);
  assert.equal(coreToolsApi({ version: "0.5.9", api: { tools } }), null);
  assert.equal(coreToolsApi({ data: { version: "0.5.1" }, api: { tools } }), null);
  assert.equal(coreToolsApi({ version: "0.6.0", api: {} }), null);
  assert.equal(coreToolsApi(undefined), null);
});

test("registers with core tools and does not add the Token button", () => {
  const hooks = createHooks();
  const registered = [];
  const def = craftworksDef();
  addMorelordTool(def, {
    hooks,
    getCoreModule: () => ({
      version: "0.6.0",
      api: { tools: { register: tool => registered.push(tool) } }
    })
  });

  const controls = { tokens: { tools: { select: { name: "select" } } } };
  hooks.emit("getSceneControlButtons", controls);
  assert.equal(controls.tokens.tools.morelordCraftworks, undefined);

  hooks.emit("setup");
  hooks.emit("setup");
  assert.deepEqual(registered, [def]);
  hooks.emit("getSceneControlButtons", controls);
  assert.equal(controls.tokens.tools.morelordCraftworks, undefined);
  assert.equal(hooks.listenerCount("getSceneControlButtons"), 0);
});

test("core before 0.6.0 keeps the Token palette button", () => {
  const hooks = createHooks();
  const events = [];
  const def = craftworksDef(event => events.push(event));
  addMorelordTool(def, {
    hooks,
    getCoreModule: () => ({
      version: "0.5.1",
      api: { tools: { register() { throw new Error("old core must not register"); } } }
    })
  });

  hooks.emit("setup");
  const controls = { tokens: { tools: { select: { name: "select" }, target: { name: "target" } } } };
  hooks.emit("getSceneControlButtons", controls);

  assert.deepEqual(controls.tokens.tools.morelordCraftworks, {
    name: "morelordCraftworks",
    title: "Morelord Craftworks",
    icon: "fa-solid fa-hammer",
    order: 2,
    button: true,
    visible: true,
    onChange: controls.tokens.tools.morelordCraftworks.onChange
  });

  controls.tokens.tools.morelordCraftworks.onChange({ type: "click" });
  assert.deepEqual(events, [{ type: "click" }]);
});

test("missing core keeps the Token palette button", () => {
  const hooks = createHooks();
  addMorelordTool(craftworksDef(), {
    hooks,
    getCoreModule: () => undefined
  });
  hooks.emit("setup");
  const controls = { tokens: { tools: {} } };
  hooks.emit("getSceneControlButtons", controls);
  assert.equal(controls.tokens.tools.morelordCraftworks.name, "morelordCraftworks");
  assert.equal(controls.tokens.tools.morelordCraftworks.order, 0);
  assert.equal(controls.tokens.tools.morelordCraftworks.visible, true);
});

test("legacy registration ignores controls without token tools", () => {
  assert.equal(applyLegacyTokenTool(undefined, craftworksDef()), false);
  assert.equal(applyLegacyTokenTool({}, craftworksDef()), false);
  assert.equal(applyLegacyTokenTool({ tokens: {} }, craftworksDef()), false);
});

test("legacy visibility is evaluated each time controls are built", () => {
  let shown = false;
  const def = craftworksDef();
  def.visible = () => shown;
  const controls = { tokens: { tools: {} } };
  applyLegacyTokenTool(controls, def);
  assert.equal(controls.tokens.tools.morelordCraftworks.visible, false);
  shown = true;
  applyLegacyTokenTool(controls, def);
  assert.equal(controls.tokens.tools.morelordCraftworks.visible, true);
});
