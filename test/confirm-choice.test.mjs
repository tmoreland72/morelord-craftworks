import test from "node:test";
import assert from "node:assert/strict";
import { confirmChoice } from "../scripts/ui/confirm-choice.mjs";

test("confirmChoice uses MorelordCore.ui.confirm and treats close as No", async () => {
  const calls = [];
  globalThis.game = { modules: { get: () => null } };
  globalThis.MorelordCore = { ui: { confirm: async config => { calls.push(config); return config.title === "Delete Custom Recipe" ? undefined : true; } } };
  globalThis.foundry = { applications: { api: { DialogV2: { confirm() { throw new Error("fallback"); } } } } };
  assert.equal(await confirmChoice({
    title: "Delete Custom Recipe",
    content: "<p>Delete this custom recipe?</p>",
    yesLabel: "Delete",
    noLabel: "No",
    danger: true
  }), false);
  assert.equal(calls[0].yesLabel, "Delete");
  assert.equal(calls[0].danger, true);
  assert.equal(await confirmChoice({ title: "Assign Defaults", content: "<p>Replace?</p>" }), true);
});

test("confirmChoice falls back to DialogV2.confirm as a method when Core has no helper", async () => {
  const calls = [];
  globalThis.game = { modules: new Map() };
  globalThis.MorelordCore = { ui: {} };
  class DialogV2 {
    static async wait() { return true; }
    static async confirm(config) {
      if (this?.wait == null) throw new TypeError("Cannot read properties of undefined (reading 'wait')");
      calls.push(config);
      return this.wait();
    }
  }
  globalThis.foundry = { applications: { api: { DialogV2 } } };
  assert.equal(await confirmChoice({
    title: "Clear All",
    content: "<p>Clear every facility assignment that is already set?</p>",
    danger: true
  }), true);
  assert.equal(calls[0].window.title, "Clear All");
  assert.equal(calls[0].yes.default, false);
  assert.equal(calls[0].no.label, "No");
  assert.equal(calls[0].no.default, true);
  assert.match(calls[0].content, /ml-dialog-shell/);
});
