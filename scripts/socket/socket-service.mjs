import { MODULE_ID } from "../constants.mjs";
import { log, warn } from "../core/logger.mjs";

/**
 * Cross-client messaging for Craftworks.
 *
 * Uses socketlib instead of Foundry's raw game.socket module channel. This gives
 * us explicit user targeting and a well-defined registration lifecycle.
 */
export class SocketService {
  constructor() {
    this.handlers = new Map();
    this.pending = new Map();
    this.socket = null;
    this.started = false;
    this.ready = false;
  }

  start() {
    if (this.started) return;
    this.started = true;

    Hooks.once("socketlib.ready", () => {
      try {
        if (!globalThis.socketlib) throw new Error("socketlib global was not available during socketlib.ready.");
        this.socket = globalThis.socketlib.registerModule(MODULE_ID);
        this.socket.register("dispatch", async payload => this.#receive(payload));
        this.ready = true;
        log("Socketlib transport ready.");
      } catch (err) {
        this.ready = false;
        warn("Failed to initialize socketlib transport.", err);
        ui.notifications?.error?.(`Morelord Craftworks socket initialization failed: ${err.message ?? String(err)}`);
      }
    });
  }

  on(type, handler) {
    this.handlers.set(type, handler);

    const queued = this.pending.get(type) ?? [];
    if (!queued.length) return;

    this.pending.delete(type);
    log(`Delivering ${queued.length} queued '${type}' socket message${queued.length === 1 ? "" : "s"}.`);

    queueMicrotask(async () => {
      for (const entry of queued) {
        try {
          await handler(entry.data ?? {}, entry.payload);
        } catch (err) {
          warn(`Queued socket handler '${type}' failed.`, err);
          ui.notifications?.error?.(
            `Morelord Craftworks socket error: ${err.message ?? String(err)}`
          );
        }
      }
    });
  }

  async emit(type, data = {}, { targetUserId = null } = {}) {
    if (!this.ready || !this.socket) {
      const message = "Craftworks socket transport is not ready.";
      warn(`${message} Attempted to send '${type}'.`);
      ui.notifications?.warn?.(message);
      return;
    }

    const payload = {
      type,
      data: foundry.utils.deepClone(data),
      targetUserId,
      senderUserId: game.user.id,
      sentAt: Date.now()
    };

    try {
      if (targetUserId) {
        log(`SOCKETLIB SEND ${type} -> ${targetUserId}`);
        await this.socket.executeAsUser("dispatch", targetUserId, payload);
      } else {
        log(`SOCKETLIB SEND ${type} -> other connected users`);
        await this.socket.executeForOthers("dispatch", payload);
      }
    } catch (err) {
      warn(`Socketlib send '${type}' failed.`, err);
      ui.notifications?.error?.(`Morelord Craftworks socket send failed: ${err.message ?? String(err)}`);
    }
  }

  async ping(targetUserId = null) {
    return this.emit("debug.ping", { message: `Ping from ${game.user.name}` }, { targetUserId });
  }

  async #receive(payload) {
    if (!payload?.type) return;

    log(`SOCKETLIB RECEIVE ${payload.type} from ${payload.senderUserId ?? "unknown"}${payload.targetUserId ? ` -> ${payload.targetUserId}` : ""}`);

    // executeAsUser already targets a single user. Keep this guard so imported or
    // future broadcast payloads cannot accidentally execute for the wrong user.
    if (payload.targetUserId && payload.targetUserId !== game.user.id) {
      log(`SOCKETLIB IGNORE ${payload.type}; packet targets another user.`);
      return;
    }

    const handler = this.handlers.get(payload.type);
    if (!handler) {
      const queued = this.pending.get(payload.type) ?? [];
      queued.push({
        data: foundry.utils.deepClone(payload.data ?? {}),
        payload: foundry.utils.deepClone(payload)
      });
      this.pending.set(payload.type, queued);

      log(
        `Queued '${payload.type}' socket message until its handler is registered `
        + `(queue length ${queued.length}).`
      );
      return;
    }

    try {
      return await handler(payload.data ?? {}, payload);
    } catch (err) {
      warn(`Socket handler '${payload.type}' failed.`, err);
      ui.notifications?.error?.(`Morelord Craftworks socket error: ${err.message ?? String(err)}`);
    }
  }
}
