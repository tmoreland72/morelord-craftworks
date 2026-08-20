const DRAKKENHEIM_FAMILIES = new Set([
  "animus",
  "bones",
  "dust",
  "fluid",
  "hair",
  "hide",
  "natural-weapons",
  "organs"
]);

export function materialTagsSatisfy(requiredTags = [], availableTags = []) {
  const available = new Set(
    Array.from(availableTags ?? [], tag => String(tag).toLowerCase())
  );

  return requiredTags.every(rawTag => {
    const tag = String(rawTag).toLowerCase();
    if (available.has(tag)) return true;

    const prefix = "drakkenheim-component-";
    if (!tag.startsWith(prefix)) return false;

    const family = tag.slice(prefix.length);
    if (DRAKKENHEIM_FAMILIES.has(family)
      && available.has(`drakkenheim-family-${family}`)) {
      return true;
    }

    // Component tags form a hierarchy. For example, a requirement for
    // `bones-spine` accepts `bones-spine-from-a-monstrosity`, but does not
    // accept the sibling `bones-ribs` branch.
    const descendantPrefix = `${tag}-`;
    return Array.from(available).some(candidate => candidate.startsWith(descendantPrefix));
  });
}
