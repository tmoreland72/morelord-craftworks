export function bindMultiselectBehavior(
  app,
  {
    stateKey = "openFilterKey"
  } = {}
) {
  if (!app?.element) return;

  const details = Array.from(
    app.element.querySelectorAll(".ml-craftworks-multiselect")
  );

  for (const detail of details) {
    detail.addEventListener("toggle", () => {
      if (!detail.open) {
        if (
          app[stateKey]
          === detail.dataset.filter
        ) {
          app[stateKey] = null;
        }
        return;
      }

      for (const other of details) {
        if (other !== detail) other.open = false;
      }

      app[stateKey] =
        detail.dataset.filter
        ?? null;
    });
  }

  app.element.addEventListener(
    "pointerdown",
    event => {
      const inside = event.target.closest(
        ".ml-craftworks-multiselect"
      );

      if (inside) return;

      for (const detail of details) {
        detail.open = false;
      }

      app[stateKey] = null;
    },
    { capture: true }
  );
}
