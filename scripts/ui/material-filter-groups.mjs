export function buildMaterialTagGroups(
  tags = [],
  { included = [], excluded = [] } = {}
) {
  const includedSet = new Set(included);
  const excludedSet = new Set(excluded);
  const unique = [...new Set(tags.map(tag => String(tag).toLowerCase()))];

  const drakkenheim = unique
    .filter(tag => tag.startsWith("drakkenheim-family-"))
    .map(tag => option(tag, tag.slice("drakkenheim-family-".length), includedSet, excludedSet));

  const craftworks = unique
    .filter(tag => !tag.startsWith("drakkenheim"))
    .map(tag => option(tag, tag, includedSet, excludedSet));

  return [
    { id: "craftworks", label: "Craftworks Materials", options: sortOptions(craftworks) },
    { id: "drakkenheim", label: "Drakkenheim", options: sortOptions(drakkenheim) }
  ].filter(group => group.options.length);
}

function option(id, labelSource, included, excluded) {
  return {
    id,
    label: titleCase(labelSource),
    state: included.has(id) ? 1 : excluded.has(id) ? -1 : 0,
    included: included.has(id),
    excluded: excluded.has(id)
  };
}

function titleCase(value) {
  return String(value)
    .split("-")
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sortOptions(options) {
  return options.sort((a, b) => a.label.localeCompare(b.label));
}
