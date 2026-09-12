import { renderPreservingScroll } from "../../../morelord-core/scripts/ui/scroll-preservation.js";

/**
 * Preserve all scrollable regions in a Craftworks ApplicationV2 across
 * template rerenders.
 */
export function ScrollPreservingApplicationMixin(Base) {
  return class ScrollPreservingApplication extends Base {
    async _onRender(context, options) {
      await super._onRender?.(context, options);

      this.element?.querySelector("[data-action='open-module-documentation']")
        ?.addEventListener("click", () => globalThis.MorelordCore?.ui?.documentation?.open("morelord-craftworks"));

      this.element?.querySelectorAll("[data-document-uuid]")
        .forEach(element => element.addEventListener("click", async event => {
          const nestedControl = event.target.closest("button, a, input, select, textarea");
          if (nestedControl && nestedControl !== event.currentTarget) return;
          event.preventDefault();
          const uuid = event.currentTarget.dataset.documentUuid;
          if (!uuid) return;
          try {
            const document = await fromUuid(uuid);
            if (!document) throw new Error("Document not found");
            document.sheet?.render(true);
          } catch {
            ui.notifications.warn("The source Item could not be opened.");
          }
        }));
    }

    render(options = {}) {
      return renderPreservingScroll(this, () => super.render(options), { selector: "*", deferred: true });
    }
  };
}