export class SystemAdapter {
  getActorForUser(_user) { return null; }
  getCreatureType(_actor) { return null; }
  getCreatureCR(_actor) { return 0; }
  getCreatureHarvestTraits(actor) {
    return {
      creatureType: this.getCreatureType(actor),
      cr: this.getCreatureCR(actor),
      size: "med",
      ac: 0,
      elementalResistance: false,
      incorporeal: false
    };
  }
  async rollSkill(_actor, _skillId, _options = {}) {
    throw new Error("rollSkill is not implemented for this game system.");
  }
  async addItemToActor(_actor, _itemData, _quantity = 1) {
    throw new Error("addItemToActor is not implemented for this game system.");
  }
}
