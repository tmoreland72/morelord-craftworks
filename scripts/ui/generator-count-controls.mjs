export function bindGeneratorCountControls(root, {
  inputSelector,
  onChange
}) {
  root.querySelectorAll("[data-count-adjust]").forEach(button =>
    button.addEventListener("click", event => {
      event.preventDefault();
      const stepper = event.currentTarget.closest("[data-count-stepper]");
      const input = stepper?.querySelector(inputSelector);
      if (!input) return;

      const minimum = Number(input.min || 0);
      const maximum = input.max === "" ? Number.POSITIVE_INFINITY : Number(input.max);
      const delta = Number(event.currentTarget.dataset.countAdjust ?? 0);
      const next = Math.min(
        maximum,
        Math.max(minimum, Math.floor(Number(input.value ?? 0)) + delta)
      );

      input.value = String(next);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      onChange?.(input, next);
    })
  );
}
