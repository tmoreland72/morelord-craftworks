import { Dnd5eAdapter } from "../adapters/dnd5e-adapter.mjs";
import { SystemAdapter } from "./system-adapter.mjs";

export function createSystemAdapter() {
  if (game.system.id === "dnd5e") return new Dnd5eAdapter();
  return new SystemAdapter();
}
