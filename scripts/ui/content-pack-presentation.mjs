// Installation status is independent of subscription access and the saved pack toggle.
export function contentPackPresentation(pack, modules) {
  const status = id => {
    const module = modules.get(id);
    return { label: module?.active ? "Available" : module ? "Disabled" : "Not Installed", tone: module?.active ? "success" : "warning" };
  };
  const availability = pack.requiredModuleId ? status(pack.requiredModuleId) : {label:"Available",tone:"success"};
  return {
    label: pack.settingsLabel ?? pack.label,
    tierLabel: pack.sourceModules ? null : pack.accessLabel ?? (pack.premium ? "Premium" : "Standard"),
    tierTone: pack.premium ? "premium" : "muted",
    statusLabel: pack.sourceModules ? pack.accessLabel : availability.label,
    statusTone: pack.sourceModules ? "premium" : availability.tone,
    sourceModules: pack.sourceModules?.map(source => ({...source,...status(source.id),name:source.label})) ?? []
  };
}
