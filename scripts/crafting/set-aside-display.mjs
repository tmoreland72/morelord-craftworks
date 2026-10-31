export const SET_ASIDE_LABEL = "Set aside for this craft";
export const SET_ASIDE_NOTE = "Materials are set aside, not lost, until the craft finishes or is abandoned.";

function compact(value) {
  return String(value ?? "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function take(pools, row) {
  const materialId = String(row?.materialId ?? row?.match?.materialId ?? "").trim();
  const label = compact(row?.displayLabel ?? row?.display ?? "");
  const needed = Math.max(0, Number(row?.quantity ?? 0));
  const limit = needed > 0 ? needed : Number.POSITIVE_INFINITY;
  let taken = 0;
  for (const entry of pools) {
    if (taken >= limit || entry.quantity <= 0) continue;
    const idMatch = Boolean(materialId && entry.materialId && entry.materialId === materialId);
    const nameMatch = Boolean(label && entry.nameKeys.includes(label));
    if (!idMatch && !nameMatch) continue;
    const use = Math.min(entry.quantity, limit - taken);
    entry.quantity -= use;
    taken += use;
  }
  if (!taken) return row;
  return {
    ...row,
    setAside: true,
    setAsideQuantity: taken,
    setAsideLabel: SET_ASIDE_LABEL
  };
}

export function annotateSetAsideMaterials(groups = [], consumedMaterials = []) {
  const pools = (consumedMaterials ?? []).map(entry => ({
    materialId: String(entry?.materialId ?? "").trim(),
    nameKeys: [compact(entry?.name), compact(entry?.itemData?.name)].filter(Boolean),
    name: String(entry?.name ?? entry?.itemData?.name ?? "").trim() || "Material",
    quantity: Math.max(0, Number(entry?.quantity ?? 0))
  })).filter(entry => entry.quantity > 0);

  const requirementGroupRows = (groups ?? []).map(group => ({
    ...group,
    requirementRows: (group.requirementRows ?? []).map(row => {
      const alternativeRows = (row.alternativeRows ?? []).map(alternative => take(pools, alternative));
      const parent = alternativeRows.some(alternative => alternative.setAside) ? row : take(pools, row);
      return { ...parent, alternativeRows };
    })
  }));

  const setAsideExtras = pools
    .filter(entry => entry.quantity > 0)
    .map(entry => ({
      name: entry.name,
      quantity: entry.quantity,
      setAsideLabel: SET_ASIDE_LABEL
    }));
  const materialsSetAside = setAsideExtras.length > 0 || requirementGroupRows.some(group =>
    (group.requirementRows ?? []).some(row =>
      row.setAside || (row.alternativeRows ?? []).some(alternative => alternative.setAside)
    )
  );

  return {
    requirementGroupRows,
    materialsSetAside,
    setAsideExtras,
    setAsideNote: materialsSetAside ? SET_ASIDE_NOTE : ""
  };
}
