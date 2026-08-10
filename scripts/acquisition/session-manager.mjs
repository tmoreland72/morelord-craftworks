import { randomID } from "../core/util.mjs";

export class AcquisitionSessionManager {
  #sessions = new Map();

  create(data) {
    const session = {
      id: randomID(),
      createdAt: Date.now(),
      status: "open",
      ...foundry.utils.deepClone(data)
    };
    this.#sessions.set(session.id, session);
    return session;
  }

  import(session) {
    if (!session?.id) throw new Error("Cannot import an acquisition session without an id.");
    const copy = foundry.utils.deepClone(session);
    this.#sessions.set(copy.id, copy);
    return copy;
  }

  get(id) { return this.#sessions.get(id) ?? null; }

  update(id, patch) {
    const current = this.get(id);
    if (!current) return null;
    foundry.utils.mergeObject(current, patch, { inplace: true, recursive: true });
    return current;
  }

  delete(id) { return this.#sessions.delete(id); }

  list() { return [...this.#sessions.values()]; }
}
