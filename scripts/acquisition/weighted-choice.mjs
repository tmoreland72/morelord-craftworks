export function weightedDistinctSample(entries, count) {
  const pool = entries.filter(e => Number(e.weight ?? 0) > 0).map(e => ({ ...e }));
  const chosen = [];

  while (pool.length && chosen.length < count) {
    const total = pool.reduce((sum, e) => sum + Number(e.weight), 0);
    let roll = Math.random() * total;
    let index = 0;
    for (; index < pool.length; index += 1) {
      roll -= Number(pool[index].weight);
      if (roll <= 0) break;
    }
    index = Math.min(index, pool.length - 1);
    chosen.push(pool[index]);
    pool.splice(index, 1);
  }

  return chosen;
}
