const entries = [
  {collection:'world.morelord-craftworks-standard-materials', label:'Craftworks Materials'},
  {collection:'world.morelord-craftworks-materials-monsters-of-drakkenheim', label:'Craftworks Drakkenheim Materials'},
  {collection:'world.morelord-craftworks-spell-scrolls', label:'Craftworks Spell Scrolls'},
  {collection:'world.morelord-craftworks-custom-recipes', label:'Craftworks Custom Recipes'}
];
export function organizeCraftworksCompendiums() {
  return globalThis.MorelordCore?.compendiums?.organize(entries, ['Morelord Gaming', 'Craftworks']);
}
