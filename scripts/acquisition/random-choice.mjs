export function weightedPick(entries) {
  const pool = entries.filter(entry => Number(entry.weight ?? 0) > 0);
  if (!pool.length) return null;

  const total = pool.reduce((sum, entry) => sum + Number(entry.weight ?? 0), 0);
  let roll = Math.random() * total;

  for (const entry of pool) {
    roll -= Number(entry.weight ?? 0);
    if (roll <= 0) return entry;
  }
  return pool.at(-1) ?? null;
}

export function randomInt(min, max) {
  const lo = Math.ceil(Number(min ?? 1));
  const hi = Math.floor(Number(max ?? lo));
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}
