export const SRD_51_RECIPES = [
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-antitoxin",
    "name": "Antitoxin",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 202,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 13",
      "value": "50 gp",
      "materialsText": "2 common curative reagent 1 common poisonous reagent 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Antitoxin",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-healing",
    "name": "Potion of Healing",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 202,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 13",
      "value": "50 gp",
      "materialsText": "3 common curative reagent 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "common-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Healing",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-firebreath",
    "name": "Potion of Firebreath",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 202,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "75 gp",
      "materialsText": "1 common reactive reagent 1 uncommon reactive reagent 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Firebreath",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 75.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-greater-healing",
    "name": "Potion of Greater Healing",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 202,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "120 gp",
      "materialsText": "1 common curative reagent 2 uncommon curative reagent 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-curative-reagent"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Greater Healing",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 120.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-resistance",
    "name": "Potion of Resistance",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 202,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "240 gp",
      "materialsText": "1 uncommon primal essence 1 uncommon reactive reagent 1 common curative reagent 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Resistance",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 240.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-hill-giant-strength",
    "name": "Potion of Hill Giant Strength",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 202,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "260 gp",
      "materialsText": "1 uncommon primal essence 1 uncommon reactive reagent 1 uncommon curative reagent"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-curative-reagent"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Hill Giant Strength",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 260.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-gaseous-form",
    "name": "Potion of Gaseous Form",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 202,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 16",
      "value": "560 gp",
      "materialsText": "2 uncommon reactive reagent 1 rare curative reagent 1 rare reactive reagent 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Gaseous Form",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "rare",
      "valueGp": 560.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-heroism",
    "name": "Potion of Heroism",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 202,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "480 gp",
      "materialsText": "1 uncommon curative reagent 1 uncommon reactive reagent 2 rare curative reagent 1 common divine essence 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Heroism",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "rare",
      "valueGp": 480.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-superior-healing",
    "name": "Potion of Superior Healing",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 203,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "525 gp",
      "materialsText": "2 uncommon curative reagent 2 rare curative reagent 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-curative-reagent"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Superior Healing",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "rare",
      "valueGp": 525.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-supreme-healing",
    "name": "Potion of Supreme Healing",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 203,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 18",
      "value": "5000 gp",
      "materialsText": "1 uncommon curative reagent 1 rare curative reagent 2 very rare curative reagent 1 uncommon divine essence 1 crystal vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-curative-reagent"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "crystal-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Supreme Healing",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "very-rare",
      "valueGp": 5000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potion-of-invisibility",
    "name": "Potion of Invisibility",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 203,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 19",
      "value": "5,200 gp",
      "materialsText": "2 uncommon reactive reagent 2 rare curative reagent 1 very rare reactive reagent 1 very rare curative reagent 1 crystal vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "crystal-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potion of Invisibility",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "very-rare",
      "valueGp": 5200.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-panacea",
    "name": "Panacea",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 203,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 24",
      "value": "54,000 gp",
      "materialsText": "1 legendary curative reagent 2 very rare curative reagents 1 legendary divine essence 1 crystal vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 24,
      "noToolDc": 29,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-curative-reagent"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "crystal-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Panacea",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "legendary",
      "valueGp": 54000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-alchemical-acid",
    "name": "Alchemical Acid",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 203,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 13",
      "value": "50 gp",
      "materialsText": "2 common reactive reagent 1 common poisonous reagent 1 glass flask"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-flask"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Alchemical Acid",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-alchemical-napalm",
    "name": "Alchemical Napalm",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 203,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "70 gp",
      "materialsText": "3 common reactive reagent 1 common curative reagent 1 glass flask"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-flask"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Alchemical Napalm",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "common",
      "valueGp": 70.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-potent-alchemical-acid",
    "name": "Potent Alchemical Acid",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 204,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "140 gp",
      "materialsText": "2 uncommon reactive reagent 1 uncommon poisonous reagent 1 glass flask"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-flask"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potent Alchemical Acid",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 140.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-sticky-goo-potion",
    "name": "Sticky Goo Potion",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 204,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "140 gp",
      "materialsText": "Either (a) 1 finely shredded scroll of web or (b) 2 uncommon poisonous reagents 1 uncommon reactive reagent 1 glass flask"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "alternatives": [
              {
                "quantity": 1,
                "match": {
                  "itemType": "spellScroll",
                  "spellName": "web"
                }
              },
              {
                "quantity": 2,
                "sameMaterial": true,
                "match": {
                  "materialId": "uncommon-poisonous-reagent"
                }
              }
            ]
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-flask"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Sticky Goo Potion",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 140.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-powerful-alchemical-fire",
    "name": "Powerful Alchemical Fire",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 204,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 17",
      "value": "690 gp",
      "materialsText": "3 rare reactive reagent 1 glass flask"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-flask"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Powerful Alchemical Fire",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "rare",
      "valueGp": 690.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-dust-of-disappearance",
    "name": "Dust of Disappearance",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 204,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "130 gp",
      "materialsText": "1 handful of sand 1 common arcane essence 2 common reactive reagent 1 common curative reagent"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "handful of sand"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-curative-reagent"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dust of Disappearance",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 130.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-dust-of-sneezing-and-choking",
    "name": "Dust of Sneezing and Choking",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 204,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "95 gp",
      "materialsText": "1 uncommon poisonous reagent 1 common reactive reagent 1 common poisonous reagent"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-poisonous-reagent"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dust of Sneezing and Choking",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 95.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-dwarven-alcohol",
    "name": "Dwarven Alcohol",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 204,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "20 gp",
      "materialsText": "1 flask of alcohol 1 common reactive reagents 1 sturdy metal flask"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "flask of alcohol"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "sturdy metal flask"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dwarven Alcohol",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-smoke-powder",
    "name": "Smoke Powder",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 204,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "40 gp",
      "materialsText": "2 common reactive reagent"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Smoke Powder",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "common",
      "valueGp": 40.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-grenade-casing",
    "name": "Grenade Casing",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 204,
      "craftingTime": "4 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "50 gp",
      "materialsText": "2 parts 1 fancy parts 1 glass flask"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-flask"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Grenade Casing",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-nail-bomb",
    "name": "Nail Bomb",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 204,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 17",
      "value": "275 gp",
      "materialsText": "3 parts 2 uncommon reactive reagent 1 packet of blasting powder"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "packet of blasting powder"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Nail Bomb",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 275.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-legendary-magical-ink",
    "name": "Legendary Magical Ink",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 205,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 18",
      "value": "5,000 gp",
      "materialsText": "1 legendary alchemical reagent 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "legendary alchemical reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Legendary Magical Ink",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "legendary",
      "valueGp": 5000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-burning-oil",
    "name": "Burning Oil",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 205,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 13",
      "value": "40 gp",
      "materialsText": "2 common reactive reagents 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Burning Oil",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "common",
      "valueGp": 40.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-silver-oil",
    "name": "Silver Oil",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 205,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "20 gp",
      "materialsText": "4 silver scraps 1 common reactive reagent 1 glass vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "silver-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Silver Oil",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-oil-of-sharpness",
    "name": "Oil of Sharpness",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 205,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 19",
      "value": "5,200 gp",
      "materialsText": "1 rare poisonous reagent 2 very rare reactive reagent 300 gp of precious metal flakes 1 crystal vial"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-poisonous-reagent"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-reactive-reagent"
            }
          },
          {
            "quantity": 300,
            "match": {
              "itemName": "gp of precious metal flakes"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "crystal-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Oil of Sharpness",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "very-rare",
      "valueGp": 5200.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-restorative-ointment",
    "name": "Restorative Ointment",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 205,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "250 gp",
      "materialsText": "1 common divine essence 2 uncommon curative reagent 3 common curative reagents"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-divine-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-curative-reagent"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "common-curative-reagent"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Restorative Ointment",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "uncommon",
      "valueGp": 250.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-alchemy-universal-solvent",
    "name": "Universal Solvent",
    "description": "",
    "category": "alchemy",
    "kind": "crafting",
    "tags": [
      "alchemy",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 205,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 22",
      "value": "25,000 gp",
      "materialsText": "1 legendary poisonous reagent 1 legendary reactive reagent 1 very rare primal essence"
    },
    "craft": {
      "tool": "Alchemist's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 22,
      "noToolDc": 27,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Universal Solvent",
      "img": "icons/consumables/potions/potion-bottle-corked-labeled-red.webp",
      "rarity": "legendary",
      "valueGp": 25000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-dizzying-touch",
    "name": "Dizzying Touch",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "45 gp",
      "materialsText": "1 common poisonous reagent 1 common arcane essence 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dizzying Touch",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "common",
      "valueGp": 45.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-simple-inhaled-poison",
    "name": "Simple Inhaled Poison",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "2 hour",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "60 gp",
      "materialsText": "2 common poisonous reagents 1 common reactive reagent 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Simple Inhaled Poison",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "common",
      "valueGp": 60.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-simple-ingested-poison",
    "name": "Simple Ingested Poison",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "2 hour",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "35 gp",
      "materialsText": "2 common poisonous reagents 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Simple Ingested Poison",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "common",
      "valueGp": 35.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-old-reliable",
    "name": "Old Reliable",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "70 gp",
      "materialsText": "1 uncommon poisonous reagent 1 common curative reagent 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Old Reliable",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "uncommon",
      "valueGp": 70.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-potent-inhaled-poison",
    "name": "Potent Inhaled Poison",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "140 gp",
      "materialsText": "2 uncommon poisonous reagents 1 uncommon reactive reagents 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potent Inhaled Poison",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "uncommon",
      "valueGp": 140.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-potent-ingested-poison",
    "name": "Potent Ingested Poison",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "2 hour",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "95 gp",
      "materialsText": "2 uncommon poisonous reagents 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Potent Ingested Poison",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "uncommon",
      "valueGp": 95.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-crawler-mucus",
    "name": "Crawler Mucus",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 16",
      "value": "250 gp",
      "materialsText": "1 rare poisonous reagents 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Crawler Mucus",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "rare",
      "valueGp": 250.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-essence-of-ether",
    "name": "Essence of Ether",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 17",
      "value": "270 gp",
      "materialsText": "1 rare poisonous reagent 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Essence of Ether",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "rare",
      "valueGp": 270.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-knockout-poison",
    "name": "Knockout Poison",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "4 hour",
      "checks": "2",
      "difficulty": "DC 17",
      "value": "760 gp",
      "materialsText": "3 rare poisonous reagents 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Knockout Poison",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "rare",
      "valueGp": 760.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-veins-of-tar",
    "name": "Veins of Tar",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "300 gp",
      "materialsText": "1 rare poisonous reagent 1 uncommon reactive reagent 1 uncommon supplies 1 glass vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-supplies"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Veins of Tar",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "rare",
      "valueGp": 300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-midnight-tears",
    "name": "Midnight Tears",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 213,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 16",
      "value": "2,300 gp",
      "materialsText": "1 very rare poisonous reagent 1 crystal vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "crystal-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Midnight Tears",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "very-rare",
      "valueGp": 2300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-grievous-injury-poison",
    "name": "Grievous Injury Poison",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 214,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 18",
      "value": "2,380 gp",
      "materialsText": "1 very rare poisonous reagent 1 crystal vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-poisonous-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "crystal-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Grievous Injury Poison",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "very-rare",
      "valueGp": 2380.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-poisoncraft-endless-dreams",
    "name": "Endless Dreams",
    "description": "",
    "category": "poisoncraft",
    "kind": "crafting",
    "tags": [
      "poisoncraft",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 214,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 20",
      "value": "11,000 gp",
      "materialsText": "1 legendary poisonous reagent 2 very rare curative reagents 1 crystal vial"
    },
    "craft": {
      "tool": "Poisoner's Kit",
      "ability": "Intelligence",
      "skill": null,
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-poisonous-reagent"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "crystal-vial"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Endless Dreams",
      "img": "icons/consumables/potions/bottle-bulb-corked-green.webp",
      "rarity": "legendary",
      "valueGp": 11000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-dagger",
    "name": "Dagger",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 10",
      "value": "3 gp",
      "materialsText": "0.5 ingot"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dagger",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 3.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-javelin",
    "name": "Javelin",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 9",
      "value": "3 gp",
      "materialsText": "1 ingot 1 short haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "short-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Javelin",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 3.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-mace",
    "name": "Mace",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 9",
      "value": "5 gp",
      "materialsText": "2 ingots 1 short haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "short-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Mace",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-spear",
    "name": "Spear",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 9",
      "value": "3 gp",
      "materialsText": "1 ingot 1 long haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "long-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Spear",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 3.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-battleaxe",
    "name": "Battleaxe",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "10 gp",
      "materialsText": "3 ingots 1 short haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "short-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Battleaxe",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-glaive",
    "name": "Glaive",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 13",
      "value": "20 gp",
      "materialsText": "4 ingots 1 long haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "long-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Glaive",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-greatsword",
    "name": "Greatsword",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "50 gp",
      "materialsText": "10 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 10,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Greatsword",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-longsword",
    "name": "Longsword",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "15 gp",
      "materialsText": "4 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Longsword",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 15.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-morning-star",
    "name": "Morning Star",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "15 gp",
      "materialsText": "4 ingots 1 short haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "short-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Morning Star",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 15.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-rapier",
    "name": "Rapier",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "25 gp",
      "materialsText": "1 ingot"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Rapier",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 25.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-shortsword",
    "name": "Shortsword",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "10 gp",
      "materialsText": "2 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Shortsword",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-war-hammer",
    "name": "War Hammer",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 219,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "15 gp",
      "materialsText": "4 ingots 1 short haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "short-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "War Hammer",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 15.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-chain-shirt",
    "name": "Chain Shirt",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "14 hours",
      "checks": "7",
      "difficulty": "DC 13",
      "value": "50 gp",
      "materialsText": "5 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 14
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 5,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Chain Shirt",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-breastplate",
    "name": "Breastplate",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "16 hours",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "400 gp",
      "materialsText": "10 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 10,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Breastplate",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-ring-mail",
    "name": "Ring mail",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "10 hours",
      "checks": "5",
      "difficulty": "DC 11",
      "value": "30 gp",
      "materialsText": "4 ingots 1 armor padding"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 11,
      "noToolDc": 16,
      "hoursRequired": 10
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "armor-padding"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring mail",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 30.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-splint",
    "name": "Splint",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "28 hours",
      "checks": "14",
      "difficulty": "DC 14",
      "value": "200 gp",
      "materialsText": "12 ingots 1 armor padding"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 28
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 12,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "armor-padding"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Splint",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 200.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-shield",
    "name": "Shield",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 10",
      "value": "10 gp",
      "materialsText": "2 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Shield",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-spiked-shield",
    "name": "Spiked Shield",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "40 gp",
      "materialsText": "3 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Spiked Shield",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 40.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-bell",
    "name": "Bell",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 9",
      "value": "1 gp",
      "materialsText": "2 metal scraps"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Bell",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 1.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-ring",
    "name": "Ring",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 8",
      "value": "2 gp",
      "materialsText": "1 ingot"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 2.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-chain-5-ft",
    "name": "Chain (5 ft)",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 10",
      "value": "3 gp",
      "materialsText": "1 ingot"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Chain (5 ft)",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 3.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-ball-bearings",
    "name": "Ball Bearings",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 8",
      "value": "1 gp",
      "materialsText": "1 iron ingot"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ball Bearings",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 1.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-20-x-pitons",
    "name": "20 x Pitons",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 8",
      "value": "1 gp",
      "materialsText": "1 iron ingot"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "20 x Pitons",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 1.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-manacles",
    "name": "Manacles",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "20 gp",
      "materialsText": "2 ingots 1 lock 1 chain (5 feet)"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "lock"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Chain"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Manacles",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-blacksmiths-tools",
    "name": "Blacksmith\u2019s Tools",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 220,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 11",
      "value": "20 gp",
      "materialsText": "4 ingots 2 parts"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 11,
      "noToolDc": 16,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Blacksmith\u2019s Tools",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-adamantine-ingot",
    "name": "Adamantine Ingot",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "60 gp",
      "materialsText": "1 steel ingot 1 adamant ingot requires magical forge"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "steel-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "adamant-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Adamantine Ingot",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "uncommon",
      "valueGp": 60.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-5-x-buckle",
    "name": "5 x Buckle",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 8",
      "value": "1 gp",
      "materialsText": "5 metal scraps"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "5 x Buckle",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 1.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-ingot",
    "name": "Ingot",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 5",
      "value": "2 gp",
      "materialsText": "20 metal scraps"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 5,
      "noToolDc": 10,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 20,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ingot",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 2.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-10-x-steel-ingotss",
    "name": "10 x Steel IngotsS",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 8",
      "value": "20 gp",
      "materialsText": "10 ore 1 supplies"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 10,
            "match": {
              "itemName": "ore"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "10 x Steel IngotsS",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-20-x-silver-scraps",
    "name": "20 x Silver Scraps",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 5",
      "value": "2 gp",
      "materialsText": "1 silver ingot"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 5,
      "noToolDc": 10,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "silver ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "20 x Silver Scraps",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 2.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-gold-ingot",
    "name": "Gold Ingot",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 5",
      "value": "20 gp",
      "materialsText": "20 gold scraps"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 5,
      "noToolDc": 10,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 20,
            "sameMaterial": true,
            "match": {
              "materialId": "gold-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Gold Ingot",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-mithril-ingots",
    "name": "Mithril IngotS",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "30 gp",
      "materialsText": "1 mithril ore"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "mithril ore"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Mithril IngotS",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "uncommon",
      "valueGp": 30.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-icesteel-ingots",
    "name": "Icesteel IngotS",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 16",
      "value": "60 gp",
      "materialsText": "1 icesteel ore 1 common primal essence"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "icesteel ore"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Icesteel IngotS",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "uncommon",
      "valueGp": 60.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-darksteel-ingots",
    "name": "Darksteel IngotS",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 16",
      "value": "60 gp",
      "materialsText": "1 darksteel ore 1 common arcane essence"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "darksteel ore"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Darksteel IngotS",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "uncommon",
      "valueGp": 60.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-10-x-thunder-cannon-ammo",
    "name": "10 x Thunder Cannon Ammo",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "20 gp",
      "materialsText": "2 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "10 x Thunder Cannon Ammo",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-pistol",
    "name": "Pistol",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "16 hours",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "250 gp",
      "materialsText": "3 ingots 4 parts 2 fancy parts"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Pistol",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "uncommon",
      "valueGp": 250.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-shotgun",
    "name": "Shotgun",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 221,
      "craftingTime": "32 hours",
      "checks": "16",
      "difficulty": "DC 19",
      "value": "2,425 gp",
      "materialsText": "8 ingots 4 parts 2 fancy parts 2 esoteric parts"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 32
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 8,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "esoteric-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Shotgun",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "uncommon",
      "valueGp": 2425.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-finesse-spear",
    "name": "Finesse Spear",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 223,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "13 gp",
      "materialsText": "1 ingot 1 long haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "long-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Finesse Spear",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 13.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-chain",
    "name": "Chain",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 223,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "5 gp",
      "materialsText": "2 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Chain",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-brass-knuckles",
    "name": "Brass Knuckles",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 223,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 13",
      "value": "10 gp",
      "materialsText": "1 ingot"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Brass Knuckles",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-war-spear",
    "name": "War Spear",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 223,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 16",
      "value": "110 gp",
      "materialsText": "4 ingots 1 long haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "long-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "War Spear",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 110.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-finesse-glaive",
    "name": "Finesse Glaive",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 223,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 21",
      "value": "450 gp",
      "materialsText": "1 ingot 1 long haft"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 21,
      "noToolDc": 26,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "long-haft"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Finesse Glaive",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 450.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-broadsword",
    "name": "Broadsword",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 223,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "42 gp",
      "materialsText": "3 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "match": {
              "materialId": "iron-ingot"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Broadsword",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 42.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-blacksmithing-cestus",
    "name": "Cestus",
    "description": "",
    "category": "blacksmithing",
    "kind": "crafting",
    "tags": [
      "blacksmithing",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 223,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 16",
      "value": "70 gp",
      "materialsText": "2 ingots"
    },
    "craft": {
      "tool": "Blacksmith's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Cestus",
      "img": "icons/weapons/swords/sword-guard-steel.webp",
      "rarity": "common",
      "valueGp": 70.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-common-feast-quality-meal",
    "name": "Common Feast (Quality Meal)",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 230,
      "craftingTime": "1 hour",
      "checks": "1",
      "difficulty": "DC 8",
      "value": "3 gp",
      "materialsText": "1 common fresh ingredient 1 common supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "common-fresh-ingredient"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "common supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Common Feast (Quality Meal)",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "common",
      "valueGp": 3.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-meat-feast",
    "name": "Meat Feast",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 230,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "15 gp",
      "materialsText": "1 uncommon meat 1 uncommon supplies 2 common supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "uncommon-meat"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-supplies"
            }
          },
          {
            "quantity": 2,
            "match": {
              "itemName": "common supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Meat Feast",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "uncommon",
      "valueGp": 15.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-seaworthy-bouillabaisse",
    "name": "Seaworthy Bouillabaisse",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 230,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "25 gp",
      "materialsText": "1 uncommon meat from a creature with a swimming speed greater than its walking speed 2 uncommon supplies 2 common supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "uncommon meat from a creature with a"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "swimming speed greater than its walking speed"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-supplies"
            }
          },
          {
            "quantity": 2,
            "match": {
              "itemName": "common supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Seaworthy Bouillabaisse",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "uncommon",
      "valueGp": 25.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-hearty-meat-feast",
    "name": "Hearty Meat Feast",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 230,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 16",
      "value": "150 gp",
      "materialsText": "1 rare meat 1 uncommon reagent (any) 1 rare supplies 1 uncommon supplies 2 common supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "rare-meat"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "uncommon-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "rare supplies"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-supplies"
            }
          },
          {
            "quantity": 2,
            "match": {
              "itemName": "common supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Hearty Meat Feast",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "rare",
      "valueGp": 150.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-heroes-feast",
    "name": "Heroes\u2019 Feast",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 230,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 18",
      "value": "1,500 gp",
      "materialsText": "4 rare curative reagent 2 uncommon divine essence 4 rare supplies 4 supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-curative-reagent"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          },
          {
            "quantity": 4,
            "match": {
              "itemName": "rare supplies"
            }
          },
          {
            "quantity": 4,
            "match": {
              "itemName": "supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Heroes\u2019 Feast",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "rare",
      "valueGp": 1500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-superb-meat-feast",
    "name": "Superb Meat Feast",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 230,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 18",
      "value": "300 gp",
      "materialsText": "1 very rare meat 1 rare reagent (any) 2 rare supplies 2 uncommon supplies 2 common supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "very-rare-meat"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "rare-curative-reagent"
            }
          },
          {
            "quantity": 2,
            "match": {
              "itemName": "rare supplies"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-supplies"
            }
          },
          {
            "quantity": 2,
            "match": {
              "itemName": "common supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Superb Meat Feast",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "very-rare",
      "valueGp": 300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-legendary-feast",
    "name": "Legendary Feast",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 231,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 20",
      "value": "3,000 gp",
      "materialsText": "1 legendary fresh ingredient 1 very rare reagent (any) 3 rare supplies 3 uncommon supplies 1 common supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "legendary fresh ingredient"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "very-rare-curative-reagent"
            }
          },
          {
            "quantity": 3,
            "match": {
              "itemName": "rare supplies"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-supplies"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "common supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Legendary Feast",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "legendary",
      "valueGp": 3000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-flame-breathing-jerky",
    "name": "Flame Breathing Jerky",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 231,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 15",
      "value": "250 gp",
      "materialsText": "1 uncommon or rarer meat from a creature that is immune to fire damage 2 uncommon reactive reagents 1 rare supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "uncommon or rarer meat from a"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "creature that is immune to fire damage"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-reactive-reagent"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "rare supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 5,
      "label": "Flame Breathing Jerky",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "uncommon",
      "valueGp": 250.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-morph-cookies",
    "name": "Morph Cookies",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 231,
      "craftingTime": "2 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "125 gp",
      "materialsText": "1 ingredient harvested from a shapeshifter 1 rare supplies 1 uncommon supplies 1 common supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "ingredient harvested from a"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "shapeshifter"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "rare supplies"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-supplies"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "common supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 5,
      "label": "Morph Cookies",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "uncommon",
      "valueGp": 125.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-quickening-candies",
    "name": "Quickening Candies",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 231,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 18",
      "value": "",
      "materialsText": "1 rare supplies 2 uncommon supplies 1 common supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "rare supplies"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-supplies"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "common supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 5,
      "label": "Quickening Candies",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "rare",
      "valueGp": 0.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cooking-elvish-bread",
    "name": "Elvish Bread",
    "description": "",
    "category": "cooking",
    "kind": "crafting",
    "tags": [
      "cooking",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 231,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 15",
      "value": "60 gp",
      "materialsText": "1 uncommon curative reagent 1 uncommon supplies 1 common supplies"
    },
    "craft": {
      "tool": "Cook's Utensils",
      "ability": "Wisdom",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-supplies"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "common supplies"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 10,
      "label": "Elvish Bread",
      "img": "icons/consumables/food/bowl-stew-tofu-potato-red.webp",
      "rarity": "uncommon",
      "valueGp": 60.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-doodle-ring",
    "name": "Doodle Ring",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 236,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "100 gp",
      "materialsText": "1 ring 1 scroll of illusory script 1 common magical ink"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "equipmentType": "ring"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "illusory script"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-magical-ink"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Doodle Ring",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "common",
      "valueGp": 100.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-bag-of-holding",
    "name": "Bag of Holding",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 236,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "1,000 gp",
      "materialsText": "1 bag 1 scroll of secret chest 2 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "bag"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "secret chest"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Bag of Holding",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 1000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-boots-of-elvenkind",
    "name": "Boots of Elvenkind",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 236,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "470 gp",
      "materialsText": "1 boots worth at least 50 gp 1 scroll of silence 1 scroll of pass without a trace 1 uncommon primal essence 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-boots-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "silence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "pass without a trace"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Boots of Elvenkind",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 470.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-boots-of-winterlands",
    "name": "Boots of Winterlands",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 236,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 15",
      "value": "760 gp",
      "materialsText": "1 boots 1 scroll of protection from energy 1 scroll of arctic breathK 2 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "type": "alternatives",
            "alternatives": [
            { "quantity": 1, "match": { "itemName": "Boots" } },
            { "quantity": 1, "match": { "itemName": "Boots of Elvenkind" } },
            { "quantity": 1, "match": { "itemName": "Boots of Striding and Springing" } },
            { "quantity": 1, "match": { "itemName": "Boots of the Winterlands" } },
            { "quantity": 1, "match": { "itemName": "Winged Boots" } }
            ]
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "protection from energy"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "arctic breath"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Boots of Winterlands",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 760.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-broom-of-flying",
    "name": "Broom of Flying",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 236,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "1,050 gp",
      "materialsText": "1 broom 1 scroll of levitate 1 scroll of fly 1 scroll of animate objectK 2 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "broom"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "levitate"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "fly"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "animate object"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Broom of Flying",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 1050.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-cloak-of-the-manta-ray",
    "name": "Cloak of the Manta Ray",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 236,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "600 gp",
      "materialsText": "1 cloak 1 scroll of water breathing 1 scroll of alter self 2 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "cloak"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "water breathing"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "alter self"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Cloak of the Manta Ray",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-circlet-of-blasting",
    "name": "Circlet of Blasting",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 237,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "250 gp",
      "materialsText": "1 circlet worth at least 50 gp 1 scroll of scorching ray 1 common arcane essence 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-circlet-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "scorching ray"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Circlet of Blasting",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 250.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-pearl-of-power",
    "name": "Pearl of Power",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 237,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "350 gp",
      "materialsText": "1 pearl worth at least 100 gp 5 common arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 100
            }
          },
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Pearl of Power",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 350.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-decanter-of-endless-water",
    "name": "Decanter of Endless Water",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 237,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "300 gp",
      "materialsText": "1 decanter 1 scroll of create or destroy water 1 uncommon primal essence 1 common divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "decanter"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "create or destroy water"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Decanter of Endless Water",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-efficient-quiver",
    "name": "Efficient Quiver",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 237,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "430 gp",
      "materialsText": "1 quiver worth 25 gp 1 scroll of secret chest 1 common arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-quiver-25"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "secret chest"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Efficient Quiver",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 430.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-eyes-of-charming",
    "name": "Eyes of Charming",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 237,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "300 gp",
      "materialsText": "1 crystal lenses (glasses) worth 50 gp 1 scroll of charm person 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 50
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "charm person"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Eyes of Charming",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-eyes-of-the-eagle",
    "name": "Eyes of the Eagle",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 237,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "190 gp",
      "materialsText": "1 crystal lenses 1 scroll of far sightK 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "crystal lenses"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "far sight"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Eyes of the Eagle",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 190.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-gauntlets-of-ogre-power",
    "name": "Gauntlets of Ogre Power",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 237,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 14",
      "value": "500 gp",
      "materialsText": "1 gauntlets worth 50 gp 1 scroll of enlarge/reduce 1 scroll of enhance ability 1 uncommon primal essence 1 common arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-gauntlets-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enlarge/reduce"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Gauntlets of Ogre Power",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-gloves-of-missile-snaring",
    "name": "Gloves of Missile Snaring",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 237,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "365 gp",
      "materialsText": "1 pair of gloves 1 scroll of attract/repel 1 uncommon arcane essence 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "pair of gloves"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "attract/repel"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Gloves of Missile Snaring",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 365.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-hat-of-disguise",
    "name": "Hat of Disguise",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 238,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "340 gp",
      "materialsText": "1 hat 1 scroll of disguise self 1 scroll of minor illusion 1 uncommon arcane essence 1 common arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "hat"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "disguise self"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "minor illusion"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Hat of Disguise",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 340.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-helm-of-comprehending-language",
    "name": "Helm of Comprehending Language",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 238,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 14",
      "value": "280 gp",
      "materialsText": "1 helm worth at least 25 gp 1 scroll of comprhend languages 1 common arcane essence 1 common divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-helm-25"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "comprhend languages"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Helm of Comprehending Language",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 280.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-luckstone",
    "name": "Luckstone",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 238,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "415 gp",
      "materialsText": "1 polished agate worth 50 gp 1 scroll of imbue luckK 1 uncommon divine essence 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 50
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "imbue luck"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Luckstone",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 415.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-pipes-of-haunting",
    "name": "Pipes of Haunting",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 238,
      "craftingTime": "8 hour",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "485 gp",
      "materialsText": "1 pipes worth at least 25 gp 1 scroll of frightenK 1 uncommon arcane essence 1 uncommon divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-pipes-25"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "frighten"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Pipes of Haunting",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 485.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-robe-of-useful-items-with-all-patches",
    "name": "Robe of Useful Items (with all patches)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 238,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "3,560 gp",
      "materialsText": "1 robe 100 gp 1 silver coffer worth 500 gp 1 iron door 10 gems worth 100 gp each 1 wooden ladder 1 picture of a horse worth 75 gp 1 saddle bag 1 scroll of create holeK 4 potions of healing 1 rowboat 1 1st level scroll 1 picture of mastiffs worth at least 25 gp 1 window 1 portable ram 13 common arcane essences"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-robe-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-silver-coffer-500"
            }
          },
          {"quantity": 1, "match": {"itemName": "Iron Door"}},
          {"quantity": 10, "match": {"lootTypes": ["Gemstone", "Art Object"], "minValueGp": 100}},
          {
            "quantity": 1,
            "match": {
              "itemName": "Ladder"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-picture-of-a-horse-75"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Saddlebags"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "create hole"
            }
          },
          {
            "quantity": 4,
            "match": {
              "itemName": "Potion of Healing"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rowboat"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellLevel": 1
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-picture-of-mastiffs-25"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "window"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Portable Ram"
            }
          },
          {
            "quantity": 13,
            "sameMaterial": true,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Robe of Useful Items (with all patches)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 3560.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-sending-stones",
    "name": "Sending Stones",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 239,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "380 gp",
      "materialsText": "1 set of the same kind of stones 1 scroll of sending 2 common arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "set of the same kind of stones"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "sending"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Sending Stones",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 380.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-slippers-of-spider-climbing",
    "name": "Slippers of Spider Climbing",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 239,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "225 gp",
      "materialsText": "1 slippers 1 scroll of spider climbing 1 common arcane essence 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "slippers"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "spider climbing"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Slippers of Spider Climbing",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 225.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-winged-boots",
    "name": "Winged Boots",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 239,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 15",
      "value": "1000 gp",
      "materialsText": "1 boots worth at least 50 gp 1 scroll of fly 1 scroll of levitate 1 scroll of feather fall 1 uncommon arcane essence 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-boots-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "fly"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "levitate"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "feather fall"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Winged Boots",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 1000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-belt-of-dwarvenkind",
    "name": "Belt of Dwarvenkind",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 239,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "2,400 gp",
      "materialsText": "1 belt worth at least 200 gp 200 gp worth of quality ale 1 rare primal essence 2 uncommon primal essences 1 scroll of stoneskin 1 scroll of alter self"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-belt-200"
            }
          },
          {
            "quantity": 200,
            "match": {
              "itemName": "gp worth of quality ale"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "stoneskin"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "alter self"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Belt of Dwarvenkind",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-boots-of-levitation",
    "name": "Boots of Levitation",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 239,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "2,600 gp",
      "materialsText": "1 boots worth at least 50 gp 1 scroll of levitate 2 rare arcane essence 2 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-boots-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "levitate"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Boots of Levitation",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-bracers-of-defense",
    "name": "Bracers of Defense",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 239,
      "craftingTime": "16 hours",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "2,300 gp",
      "materialsText": "1 set of bracers worth at least 200 gp 1 scroll of shield 1 scroll of shield of faith 1 rare divine essence 1 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-set-of-bracers-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield of faith"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Bracers of Defense",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-bowl-of-commanding-water-elementals",
    "name": "Bowl of Commanding Water Elementals",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 239,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "2,400 gp",
      "materialsText": "1 bowl worth 200 gp 1 scroll of conjure elemental 2 rare primal essences 2 rare curative reagents"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-bowl-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "conjure elemental"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-curative-reagent"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Bowl of Commanding Water Elementals",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-cape-of-mountebank",
    "name": "Cape of Mountebank",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 240,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "2,000 gp",
      "materialsText": "1 cape worth at least 200 gp 1 scroll of dimension door 1 scroll of pyrotechnics 1 rare arcane essence 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-cape-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "dimension door"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "pyrotechnics"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Cape of Mountebank",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-cloak-of-displacement",
    "name": "Cloak of Displacement",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 240,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "1,270 gp",
      "materialsText": "1 cloak worth 50 gp 1 scroll of mirror image 1 rare arcane essence 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-cloak-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "mirror image"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Cloak of Displacement",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1270.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-dimension-shackles",
    "name": "Dimension Shackles",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 240,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "4,900 gp",
      "materialsText": "1 set of manacles 1 scroll of hold monster 1 scroll of forbiddence 1 rare divine essence 1 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Manacles"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "hold monster"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "forbiddence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dimension Shackles",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 4900.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-feather-token-bird",
    "name": "Feather Token (Bird)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 240,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 17",
      "value": "770 gp",
      "materialsText": "1 fletching 1 scroll of conjure animals 2 scrolls of enlarge reduce 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fletching"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "conjure animals"
            }
          },
          {
            "quantity": 2,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enlarge/reduce"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Feather Token (Bird)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 770.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-feather-token-swan-boat",
    "name": "Feather Token (Swan Boat)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 240,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 16",
      "value": "4000 gp",
      "materialsText": "1 fletching 1 boat 50 feet long and 20 feet wide 1 scroll of dimension door 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fletching"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "boat 50 feet long and 20 feet wide"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "dimension door"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Feather Token (Swan Boat)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 4000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-feather-token-whip",
    "name": "Feather Token (Whip)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 240,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 14",
      "value": "275 gp",
      "materialsText": "1 fletching 1 whip 1 scroll of animate objects 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fletching"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "whip"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "animate objects"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Feather Token (Whip)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 275.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-figurine-of-wondrous-power-ebony-fly",
    "name": "Figurine of Wondrous Power (Ebony Fly)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 241,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "1,300 gp",
      "materialsText": "1 figurine of a fly worth at least 20 gp 1 scroll of giant insect 1 rare primal essence 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-figurine-of-a-fly-20"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "giant insect"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Figurine of Wondrous Power (Ebony Fly)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-figurine-of-wondrous-power-ivory-goats",
    "name": "Figurine of Wondrous Power (Ivory Goats)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 241,
      "craftingTime": "16 hours",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "1,700 gp",
      "materialsText": "3 figurines of a goat worth at least 20 gp 1 scroll of conjure animals 1 rare arcane essence 1 uncommon divine essence 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "match": {
              "materialId": "valued-component-figurines-of-a-goat-20"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "conjure animals"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Figurine of Wondrous Power (Ivory Goats)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1700.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-figurine-of-wondrous-power-onyx-dog",
    "name": "Figurine of Wondrous Power (Onyx Dog)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 241,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "515 gp",
      "materialsText": "1 figurine of a dog worth at least 20 gp 1 scroll of conjure animals 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-figurine-of-a-dog-20"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "conjure animals"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Figurine of Wondrous Power (Onyx Dog)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 515.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-figurine-of-wondrous-power-oynx-panther",
    "name": "Figurine of Wondrous Power (Oynx Panther)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 241,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "515 gp",
      "materialsText": "1 figurine of a panther worth at least 20 gp 1 scroll of conjure animals 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-figurine-of-a-panther-unpriced"
            }
          },
          {
            "quantity": 20,
            "match": {
              "itemName": "gp"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "conjure animals"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Figurine of Wondrous Power (Oynx Panther)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 515.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-handy-haversack",
    "name": "Handy Haversack",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 241,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "3,600 gp",
      "materialsText": "1 backpack 1 scroll of secret chest 1 instant summons 1 uncommon arcane essence 1 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "backpack"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "secret chest"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "instant summons"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Handy Haversack",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 3600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-horn-of-blasting",
    "name": "Horn of Blasting",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 241,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 17",
      "value": "3,370 gp",
      "materialsText": "1 horn worth at least 100 gp 1 scroll of shockwaveK 1 scroll of sonic shriekK"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-horn-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shockwave"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "sonic shriek"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Horn of Blasting",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 3370.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-horn-of-valhalla-brass",
    "name": "Horn of Valhalla (Brass)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 242,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 17",
      "value": "2,800 gp",
      "materialsText": "1 brass horn worth at least 50 gp 1 scroll of spirit guardians 1 scroll of guardian of faith 1 rare primal essence 1 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-brass-horn-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "spirit guardians"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "guardian of faith"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Horn of Valhalla (Brass)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2800.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-helm-of-heroes",
    "name": "Helm of Heroes",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 242,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "1,390 gp",
      "materialsText": "1 helm worth 50 gp 1 scroll of heroism 1 scroll of shield of faith 1 rare divine essence 1 uncommon divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-helm-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "heroism"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield of faith"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Helm of Heroes",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1390.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-mantle-of-spell-resistance",
    "name": "Mantle of Spell Resistance",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 242,
      "craftingTime": "16 hours (1.5 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "3,280 gp",
      "materialsText": "1 mantle worth at least 100 gp 1 scroll of dispel magic 3 rare arcane essence 1 uncommon divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-mantle-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "dispel magic"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Mantle of Spell Resistance",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 3280.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-robe-of-eyes",
    "name": "Robe of Eyes",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 242,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 17",
      "value": "2,170 gp",
      "materialsText": "1 robe worth at least 100 gp 1 scroll of darkvision 1 scroll of see invisibility 1 scroll of arcane eye 1 rare arcane essence 1 uncommon psionic essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-robe-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "darkvision"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "see invisibility"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "arcane eye"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "uncommon-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Robe of Eyes",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2170.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-stone-of-controlling-earth-elementals",
    "name": "Stone of Controlling Earth Elementals",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 242,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "2,400 gp",
      "materialsText": "1 stone worth 200 gp 1 scroll of conjure elemental 2 rare primal essences 2 rare poisonous reagent"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-stone-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "conjure elemental"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-poisonous-reagent"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Stone of Controlling Earth Elementals",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-wings-of-flying",
    "name": "Wings of Flying",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 242,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "3,000 gp",
      "materialsText": "1 cloak worth 50 gp 1 scroll of fly 1 scroll of polymorph 1 rare arcane essence 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-cloak-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "fly"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "polymorph"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wings of Flying",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 3000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-bag-of-devouring",
    "name": "Bag of Devouring",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 243,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "15,000 gp",
      "materialsText": "1 bag of holding 1 scroll of plane shift 1 scroll of hunger of hadar"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "bag of holding"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "plane shift"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "hunger of hadar"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Bag of Devouring",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 15000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-carpet-of-flying",
    "name": "Carpet of Flying",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 243,
      "craftingTime": "32 hours (4 days)",
      "checks": "16",
      "difficulty": "DC 19",
      "value": "20,000 gp",
      "materialsText": "1 fancy carpet worth 1000 gp 1 scroll of fly 1 scroll of levitate 1 scroll of animate objects 1 very rare arcane essence 1 very rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 32
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-fancy-carpet-1000"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "fly"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "levitate"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "animate objects"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Carpet of Flying",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 20000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-figurine-of-wondrous-power-obsidian-steed",
    "name": "Figurine of Wondrous Power (Obsidian Steed)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 243,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "10,250 gp",
      "materialsText": "1 figurine of a horse worth at least 50 gp 1 scroll of summon greater steed 1 very rare arcane essence 1 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-figurine-of-a-horse-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "summon greater steed"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Figurine of Wondrous Power (Obsidian Steed)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 10250.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-crystal-ball-of-mind-reading",
    "name": "Crystal Ball of Mind Reading",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 243,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 19",
      "value": "22,200 gp",
      "materialsText": "1 very rare magical crystal ball 1 scroll of detect thoughts 1 very rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "very rare magical crystal ball"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "detect thoughts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Crystal Ball of Mind Reading",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 22200.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-cube-of-force",
    "name": "Cube of Force",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 243,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "20,000 gp",
      "materialsText": "1 metal cube of mithril, adamantine, or gold 1 scroll of wall of force 1 scroll of antilife shell 1 scroll of gaseous form 1 scroll of antimagic field 2 rare arcane essence 3 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "metal cube of mithril, adamantine, or gold"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "wall of force"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "antilife shell"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "gaseous form"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "antimagic field"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Cube of Force",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 20000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-cubic-gate",
    "name": "Cubic Gate",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 243,
      "craftingTime": "32 hours (4 days)",
      "checks": "16",
      "difficulty": "DC 20",
      "value": "75,000 gp",
      "materialsText": "1 3 inch cube worth at least 500 gp 1 scroll of gate 1 scroll of plane shift 1 very rare arcane essence 1 very rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 32
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-3-inch-cube-500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "gate"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "plane shift"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Cubic Gate",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 75000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-horn-of-valhalla-bronze",
    "name": "Horn of Valhalla (Bronze)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 244,
      "craftingTime": "32 hours (4 days)",
      "checks": "16",
      "difficulty": "DC 19",
      "value": "5,600 gp",
      "materialsText": "1 bronze horn worth at least 100 gp 1 scroll of spirit guardians 1 scroll of guardian of faith 1 scroll of conjure celestial 2 rare primal essence 2 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 32
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-bronze-horn-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "spirit guardians"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "guardian of faith"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "conjure celestial"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Horn of Valhalla (Bronze)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 5600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-instant-fortress",
    "name": "Instant Fortress",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 244,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 18",
      "value": "42,000 gp",
      "materialsText": "1 admantine cube 100 adamantine ingots 1 scroll of magnificent mansion 2 very rare arcane essence 4 rare arcane essence 2 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Adamantine Cube"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magnificent mansion"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Instant Fortress",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 42000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-robe-of-scintillating-colors",
    "name": "Robe of Scintillating Colors",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 244,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 18",
      "value": "25,000 gp",
      "materialsText": "1 robe worth at least 200 gp 1 scroll of daylight 1 scroll of prismatic spray 1 scroll of wall of light 1 very rare arcane essence 1 rare arcane essence 1 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-robe-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "daylight"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "prismatic spray"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "wall of light"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Robe of Scintillating Colors",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 25000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-belt-of-stone-giant-strength",
    "name": "Belt of Stone Giant Strength",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 244,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 20",
      "value": "26,000 gp",
      "materialsText": "1 belt 1 scroll of enhance ability 1 scroll of enlarge/reduce 1 scroll of stoneskin 3 very rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "belt"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enlarge/reduce"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "stoneskin"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Belt of Stone Giant Strength",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 26000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-iron-flask-empty",
    "name": "Iron Flask (Empty)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 245,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 21",
      "value": "98,000 gp",
      "materialsText": "1 iron flask worth at least 200 gp 1 scroll of imprisonment 1 scroll of planar blinding 1 legendary arcane essence 1 very rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 21,
      "noToolDc": 26,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-iron-flask-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "imprisonment"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "planar blinding"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Iron Flask (Empty)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 98000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-deck-of-many-things",
    "name": "Deck of Many Things",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 245,
      "craftingTime": "22 hours",
      "checks": "11",
      "difficulty": "DC 100",
      "value": "???",
      "materialsText": "22 cards 1 tears of a dungeon master"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 100,
      "noToolDc": 105,
      "hoursRequired": 22
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 22,
            "match": {
              "itemName": "cards"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "tears of a dungeon master"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Deck of Many Things",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 0.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-belt-of-storm-giant-strength",
    "name": "Belt of Storm Giant Strength",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 245,
      "craftingTime": "48 hours (6 days)",
      "checks": "24",
      "difficulty": "DC 25",
      "value": "200,000 gp",
      "materialsText": "1 belt 1 scroll of enhance ability 1 scroll of transformation 1 scroll of invulnerability 1 very rare arcane essence 3 very rare primal essence 2 legendary primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 25,
      "noToolDc": 30,
      "hoursRequired": 48
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "belt"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "transformation"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "invulnerability"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "legendary-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Belt of Storm Giant Strength",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 200000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-robe-of-the-archmage",
    "name": "Robe of the Archmage",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 245,
      "craftingTime": "40 days (5 days)",
      "checks": "20",
      "difficulty": "DC 21",
      "value": "100,000 gp",
      "materialsText": "1 white, gray, or black robe worth at least 500 gp 1 scroll of mage armor 1 scroll of antimagic field 1 legendary arcane essence 5 very rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 21,
      "noToolDc": 26,
      "hoursRequired": 320
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-white-gray-or-black-robe-500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "mage armor"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "antimagic field"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-arcane-essence"
            }
          },
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Robe of the Archmage",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 100000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-well-of-many-worlds",
    "name": "Well of Many Worlds",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 245,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 20",
      "value": "75,000 gp",
      "materialsText": "1 fine block cloth worth 100 gp 1 scroll of plane shift 1 scroll of demiplane 1 legendary divine essence 1 very rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-fine-black-cloth-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "plane shift"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "demiplane"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Well of Many Worlds",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 75000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-vision-stone",
    "name": "Vision Stone",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 246,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 13",
      "value": "70 gp",
      "materialsText": "1 crystal worth at least 10 gp 1 common psion essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 10
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "common-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Vision Stone",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "common",
      "valueGp": 70.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-1-plus-psi-blade-crystal",
    "name": "1+ Psi Blade Crystal",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 246,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "320 gp",
      "materialsText": "1 crystal worth at least 20 gp 1 uncommon psionic essence 1 common psionic essence 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 20
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "uncommon-psionic-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "common-psionic-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "1+ Psi Blade Crystal",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 320.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-focusing-crystal",
    "name": "Focusing Crystal",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 246,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "460 gp",
      "materialsText": "1 crystal worth at least 20 gp 2 uncommon psionic essence 1 common psionic essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 20
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "uncommon-psionic-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "common-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Focusing Crystal",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 460.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-psionically-attuned-weapon",
    "name": "Psionically Attuned Weapon",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 246,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 13",
      "value": "220 gp",
      "materialsText": "1 weapon 1 uncommon psionic essence 1 common psionic essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          { "quantity": 1, "match": { "weaponType": "Simple" } },
          {
            "quantity": 1,
            "match": {
              "materialId": "uncommon-psionic-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "common-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Psionically Attuned Weapon",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 220.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-plus-2-amplifying-crystal",
    "name": "+2 Amplifying Crystal",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 246,
      "craftingTime": "12 hours",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "2,000 gp",
      "materialsText": "1 crystal worth at least 100 gp 2 rare psionic essence 1 uncommon psionic essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 100
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "rare-psionic-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "uncommon-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "+2 Amplifying Crystal",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-imprint-crystal",
    "name": "Imprint Crystal",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 246,
      "craftingTime": "12 hours",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "2,100 gp",
      "materialsText": "1 crystal worth at least 100 gp 2 rare psionic essences 2 uncommon psionic essences"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 100
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "rare-psionic-essence"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "uncommon-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Imprint Crystal",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2100.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-plus-3-amplying-crystal",
    "name": "+3 Amplying Crystal",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 246,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 18",
      "value": "33,000 gp",
      "materialsText": "1 crystal worth at least 200 gp 4 very rare psionic essence 2 rare psionic essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 200
            }
          },
          {
            "quantity": 4,
            "match": {
              "materialId": "very-rare-psionic-essence"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "rare-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "+3 Amplying Crystal",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 33000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-mind-shard",
    "name": "Mind Shard",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 246,
      "craftingTime": "32 hours (4 days)",
      "checks": "16",
      "difficulty": "DC 19",
      "value": "26,000 gp",
      "materialsText": "1 crystal worth at least 50 gp 3 very rare psionic essence 2 rare psionic essences"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 32
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 50
            }
          },
          {
            "quantity": 3,
            "match": {
              "materialId": "very-rare-psionic-essence"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "rare-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Mind Shard",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 26000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-plus-1-ammunition",
    "name": "+1 Ammunition",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 247,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "60 gp",
      "materialsText": "1 piece of ammunition 1 common arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "type": "alternatives",
            "alternatives": [
            { "quantity": 1, "match": { "itemName": "Arrow" } },
            { "quantity": 1, "match": { "itemName": "Bolt" } }
            ]
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "+1 Ammunition",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 60.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-berserker-axe",
    "name": "Berserker Axe",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 247,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "500* gp",
      "materialsText": "1 axe 1 scroll of crown of madness 1 scroll of magic weapon 1 scroll of aid 2 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "axe"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "crown of madness"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic weapon"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "aid"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Berserker Axe",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 0.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-javelin-of-lightning",
    "name": "Javelin of Lightning",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 247,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "400 gp",
      "materialsText": "1 javalin 1 scroll of lightning bolt 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Javelin"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "lightning bolt"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Javelin of Lightning",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-trident-of-fish-command",
    "name": "Trident of Fish Command",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 247,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "560 gp",
      "materialsText": "1 trident 1 scroll of dominate beast 1 common primal essence 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "trident"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "dominate beast"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Trident of Fish Command",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 560.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-plus-2-weapon",
    "name": "+2 Weapon",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 247,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "5,300* gp",
      "materialsText": "1 weapon 1 scroll of magic weapon 2 uncommon arcane essence 2 rare arcane essence 2 rare divine essence 2 rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          { "quantity": 1, "match": { "weaponType": "Simple" } },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic weapon"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "+2 Weapon",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 0.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-flametongue-weapon",
    "name": "Flametongue Weapon",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 247,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "5,800* gp",
      "materialsText": "1 weapon 1 scroll of prismatic weaponK 1 flametongue oilK 5 rare primal essence 1 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          { "quantity": 1, "match": { "weaponType": "Simple" } },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "prismatic weapon"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Flametongue Oil"
            }
          },
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Flametongue Weapon",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 0.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-mace-of-disruption",
    "name": "Mace of Disruption",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 248,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "2,400 gp",
      "materialsText": "1 mace 1 scroll of banishment 2 rare divine essence 1 uncommon divine essence 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "mace"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "banishment"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Mace of Disruption",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-mace-of-smiting",
    "name": "Mace of Smiting",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 248,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "1,500 gp",
      "materialsText": "1 mace 1 scroll of dispel constructK 1 rare arcane essence 1 uncommon arcane essence 1 uncommon divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "mace"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "dispel construct"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Mace of Smiting",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-sun-blade",
    "name": "Sun Blade",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 248,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 17",
      "value": "5,500 gp",
      "materialsText": "1 sword hilt worth 200 gp 1 scroll of vorpal weaponK 1 scroll of magic weapon 1 scroll of daylight 3 rare divine essence 2 uncommon arcane essence 2 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-sword-hilt-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "vorpal weapon"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic weapon"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "daylight"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Sun Blade",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 5500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-sword-of-life-stealing",
    "name": "Sword of Life Stealing",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 248,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "1,800 gp",
      "materialsText": "1 sword worth at least 200 gp 1 scroll of vampiric touch 1 rare arcane essence 2 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-sword-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "vampiric touch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Sword of Life Stealing",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1800.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-javelin-of-the-harpy-eagle",
    "name": "Javelin of the Harpy Eagle",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 248,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "1,300 gp",
      "materialsText": "1 javalin worth at least 100 gp 1 scroll of returning weaponK 1 rare primal essence 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-javelin-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "returning weapon"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Javelin of the Harpy Eagle",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-plus-3-weapon",
    "name": "+3 Weapon",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 248,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 18",
      "value": "26,000 gp",
      "materialsText": "1 weapon worth at least 1,000 gp 1 scroll of magic weapon 1 scroll of prismatic weaponK 1 scroll of vorpal weaponK 1 very rare arcane essence 1 very rare divine essence 1 very rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-weapon-1000"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic weapon"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "prismatic weapon"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "vorpal weapon"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "+3 Weapon",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 26000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-dancing-sword",
    "name": "Dancing Sword",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 249,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "18,500 gp",
      "materialsText": "1 sword worth 100 gp 1 scroll of animate objects 2 very rare arcane essence 4 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-sword-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "animate objects"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dancing Sword",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 18500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-bow-of-magic-missilestag",
    "name": "Bow of Magic MissilesTAG",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 249,
      "craftingTime": "16 hours (1.5 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "10,000 gp",
      "materialsText": "1 bow (short or long) 1 scroll of magic missile 1 scroll of magic weapon 3 rare arcane essence 1 very rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Shortbow"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic missile"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic weapon"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Bow of Magic MissilesTAG",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 10000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-nine-lives-stealer",
    "name": "Nine Lives Stealer",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 249,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "46,600 gp",
      "materialsText": "1 sword worth at least 500 gp 1 scroll of power word kill 1 scroll of magic jar"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-sword-500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "power word kill"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic jar"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Nine Lives Stealer",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 46600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-scimitar-of-speed",
    "name": "Scimitar of Speed",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 249,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "10,000 gp",
      "materialsText": "1 scimitar worth 500 gp 1 scroll of haste 1 very rare arcane essence 1 rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-scimitar-500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "haste"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Scimitar of Speed",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 10000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-holy-avenger",
    "name": "Holy Avenger",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 249,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 22",
      "value": "158,000 gp",
      "materialsText": "1 weapon worth at least 10,000 gp 3 legendary divine essence 1 scroll of holy weapon 1 scroll of holy aura 1 scroll of magic weapon 3 very rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 22,
      "noToolDc": 27,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-weapon-10000"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "legendary-divine-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "holy weapon"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "holy aura"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic weapon"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Holy Avenger",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 158000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-hammer-of-thunderbolts",
    "name": "Hammer of Thunderbolts",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 249,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 20",
      "value": "64,000 gp",
      "materialsText": "1 maul worth at least 1,000 gp 1 legendary primal essence 2 very rare primal essence 1 scroll of thunderwave"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-maul-1000"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-primal-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "thunderwave"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Hammer of Thunderbolts",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 64000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-dragon-tamer-lance",
    "name": "Dragon Tamer Lance",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 249,
      "craftingTime": "32 hours (4 days)",
      "checks": "16",
      "difficulty": "DC 20",
      "value": "50,000 gp",
      "materialsText": "1 lance worth 1,000 gp 1 scroll of summon dragon 1 scroll of chromatic orb 1 legendary primal essence 2 very rare primal essence 8 uncommon primal essences"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 32
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-lance-1000"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "summon dragon"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "chromatic orb"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-primal-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          },
          {
            "quantity": 8,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dragon Tamer Lance",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 50000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-shield-plus-1",
    "name": "Shield +1",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 250,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "500 gp",
      "materialsText": "1 shield 1 scroll of shield 1 scroll of shield of faith 1 uncommon arcane essence 1 uncommon divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Shield"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield of faith"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Shield +1",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-armor-of-resistance",
    "name": "Armor of Resistance",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 250,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "2,400* gp",
      "materialsText": "1 set of armor 1 scroll of protection from energy 2 rare primal essence 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Chain Mail"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "protection from energy"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Armor of Resistance",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 0.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-shield-plus-2",
    "name": "Shield +2",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 250,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "3,200 gp",
      "materialsText": "1 shield 1 scroll of shield 1 scroll of shield of faith 1 scroll of glyph of warding 2 rare arcane essence 1 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Shield"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield of faith"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "glyph of warding"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Shield +2",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 3200.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-shield-of-missile-attraction",
    "name": "Shield of Missile Attraction",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 250,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "1,200 gp",
      "materialsText": "1 shield 1 scroll of warding wind 1 rare arcane essence 1 uncommon primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Shield"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "warding wind"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Shield of Missile Attraction",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1200.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-captains-coat",
    "name": "Captain\u2019s Coat",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 250,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "1,400 gp",
      "materialsText": "1 fine longcoat worth 100 gp 1 scroll of enhance ability 1 scroll of vicious mockery 1 scroll of dancing waveK 1 rare primal essence 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-fine-longcoat-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "vicious mockery"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "dancing wave"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Captain\u2019s Coat",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-shield-plus-3",
    "name": "Shield +3",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 251,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 20",
      "value": "24,000 gp",
      "materialsText": "1 shield worth at least 1,000 gp 1 scroll of wall of stone 1 scroll of wall of force 1 scroll of wind wall 1 scroll of shield 1 scroll of shield of faith 1 very rare arcane essence 1 very rare divine essence 2 rare arcane essence 2 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-shield-1000"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "wall of stone"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "wall of force"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "wind wall"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield of faith"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Shield +3",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 24000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-demon-armor",
    "name": "Demon Armor",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 251,
      "craftingTime": "16 hours (2days)",
      "checks": "8",
      "difficulty": "DC 15",
      "value": "4,000 gp",
      "materialsText": "1 plate armor worth at least 1,500 gp 1 scroll of summon fiend 1 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-plate-armor-1500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "summon fiend"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Demon Armor",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 4000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-spellguard-shield",
    "name": "Spellguard Shield",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 251,
      "craftingTime": "32 hours (4 days)",
      "checks": "16",
      "difficulty": "DC 20",
      "value": "28,000 gp",
      "materialsText": "1 shield worth at least 200 gp 1 scroll of antimagic field 1 very rare divine essence 1 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 32
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-shield-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "antimagic field"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Spellguard Shield",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 28000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-dark-fathom-armor",
    "name": "Dark Fathom Armor",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 251,
      "craftingTime": "24 hours",
      "checks": "12",
      "difficulty": "DC 18",
      "value": "11,000 gp",
      "materialsText": "1 set of studded leather armor 1 scroll of mage armor 1 scroll of shield 1 scroll of black tentacles 1 very rare arcane essence 2 rare primal essence 1 scroll of water breathing"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Studded Leather Armor"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "mage armor"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "shield"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "black tentacles"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "water breathing"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dark Fathom Armor",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 11000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-armor-of-invulnerability",
    "name": "Armor of Invulnerability",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 251,
      "craftingTime": "48 hours (6 days)",
      "checks": "24",
      "difficulty": "DC 23",
      "value": "125,000 gp",
      "materialsText": "1 set of plate armor worth at least 4,000 gp 1 scroll of invulnerability 1 scroll of stone skin 1 legendary divine essence 2 very rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 23,
      "noToolDc": 28,
      "hoursRequired": 48
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-set-of-plate-armor-4000"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "invulnerability"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "stone skin"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-divine-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Armor of Invulnerability",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 125000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-jumping",
    "name": "Ring of Jumping",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 252,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "140 gp",
      "materialsText": "1 ring worth at least 10 gp 1 scroll of jump 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-ring-10"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "jump"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Jumping",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 140.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-swimming",
    "name": "Ring of Swimming",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 252,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "150 gp",
      "materialsText": "1 ring 1 scroll of alter self 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "equipmentType": "ring"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "alter self"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Swimming",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 150.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-waterwalking",
    "name": "Ring of Waterwalking",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 252,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "400 gp",
      "materialsText": "1 ring worth at least 10 gp 1 scroll of water walking 2 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-ring-10"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "water walking"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Waterwalking",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-evasion",
    "name": "Ring of Evasion",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 252,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "2,600 gp",
      "materialsText": "1 ring worth at least 400 gp 1 scroll of haste 1 rare primal essence 1 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-ring-400"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "haste"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Evasion",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-free-action",
    "name": "Ring of Free Action",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 252,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 17",
      "value": "5000 gp",
      "materialsText": "1 ring worth at least 200 gp 1 scroll of freedom of movement 2 rare divine essence 2 rare arcane essence 1 rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-ring-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "freedom of movement"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Free Action",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 5000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-animal-influence",
    "name": "Ring of Animal Influence",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 252,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "1,600 gp",
      "materialsText": "1 ring worth at least 200 gp 1 scroll of animal friendship 1 scroll of fear 1 scroll of speak with animals 1 rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-ring-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "animal friendship"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "fear"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "speak with animals"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Animal Influence",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 1600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-x-ray-vision",
    "name": "Ring of X-Ray Vision",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 253,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "2,300 gp",
      "materialsText": "1 ring worth at least 200 gp 1 scroll of true seeing 1 scroll of find traps 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-ring-200"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "true seeing"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "find traps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of X-Ray Vision",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-regeneration",
    "name": "Ring of Regeneration",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 253,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "16,600 gp",
      "materialsText": "1 ring worth at least 400 gp 1 scroll of regeneration 1 rare divine essence 1 rare arcane essence 1 rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-ring-400"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "regeneration"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Regeneration",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 16600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-telekinesis",
    "name": "Ring of Telekinesis",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 253,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 19",
      "value": "18,250 gp",
      "materialsText": "1 ringer worth at least 400 gp 1 scroll of telekinesis 1 very rare arcane essence 1 very rare psionic essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-ring-400"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "telekinesis"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "very-rare-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Telekinesis",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 18250.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-three-wishes",
    "name": "Ring of Three Wishes",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 253,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "133,333 gp",
      "materialsText": "1 ring 3 scrolls of wish"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "equipmentType": "ring"
            }
          },
          {
            "quantity": 3,
            "match": {
              "itemType": "spellScroll",
              "spellName": "wish"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Three Wishes",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 133333.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ring-of-elemental-command",
    "name": "Ring of Elemental Command",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 253,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "55,000 gp",
      "materialsText": "1 ring worth at least 400 gp 1 scroll of dominate monster 1 scroll of conjure elemental 1 legendary primal essence 3 very rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-ring-400"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "dominate monster"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "conjure elemental"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-primal-essence"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ring of Elemental Command",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 55000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-amulet-of-proof-against-detection-and-location",
    "name": "Amulet of Proof against Detection and Location",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 253,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "350 gp",
      "materialsText": "1 amulet 1 scroll of nondetection"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Amulet"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "nondetection"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Amulet of Proof against Detection and Location",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 350.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-medallion-of-thoughts",
    "name": "Medallion of Thoughts",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 254,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "500 gp",
      "materialsText": "1 medallion worth 25 gp 1 scroll of detect thoughts 1 uncommon arcane essence 1 uncommon psionic essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-medallion-25"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "detect thoughts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "uncommon-psionic-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Medallion of Thoughts",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-periapt-of-health",
    "name": "Periapt of Health",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 254,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 12",
      "value": "325 gp",
      "materialsText": "1 necklace worth 50 gp 1 scroll of purify food and drink 1 scroll of lesser restoration 2 common divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-necklace-50"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "purify food and drink"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "lesser restoration"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Periapt of Health",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 325.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-savage-talisman",
    "name": "Savage Talisman",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 254,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "550 gp",
      "materialsText": "1 necklace worth at least 10 gp 1 scroll of alter self 2 common arcane essence 2 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-necklace-10"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "alter self"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Savage Talisman",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 550.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-necklace-of-prayer-beads",
    "name": "Necklace of Prayer Beads*",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 254,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "10,000 gp",
      "materialsText": "6 gems worth 50 gp each 1 scroll of planar ally 1 scroll of wind walk 1 scroll of branding smite 1 greater restoration 1 cure wounds 1 scroll of lesser restoration 1 scroll of bless 6 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 6,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 50
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "planar ally"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "wind walk"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "branding smite"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "greater restoration"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "cure wounds"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "lesser restoration"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "bless"
            }
          },
          {
            "quantity": 6,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Necklace of Prayer Beads*",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 10000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-scarab-of-protection",
    "name": "Scarab of Protection",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 254,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "25,000 gp",
      "materialsText": "1 scarab shaped medallion worth at least 500 gp 1 scroll of holy aura 1 very rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-scarab-shaped-medallion-unpriced"
            }
          },
          {
            "quantity": 500,
            "match": {
              "itemName": "gp"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "holy aura"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Scarab of Protection",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 25000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-talisman-of-ultimate-evil",
    "name": "Talisman of Ultimate Evil",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 254,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 21",
      "value": "88,000 gp",
      "materialsText": "1 talisman woth at least 1,000 gp 1 legendary divine essence from an evil-aligned source 1 scroll of fissureK 1 scroll of gate"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 21,
      "noToolDc": 26,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-talisman-1000"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "legendary divine essence from an evil-aligned source"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "fissure"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "gate"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Talisman of Ultimate Evil",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 88000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-staff-of-the-python",
    "name": "Staff of the Python",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 255,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "350 gp",
      "materialsText": "1 uncommon branch 1 scroll of conjure animals 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-branch"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "conjure animals"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Staff of the Python",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 350.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-staff-of-healing",
    "name": "Staff of Healing",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 255,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 18",
      "value": "5,000 gp",
      "materialsText": "1 rare branch 3 rare divine essence 3 uncommon divine essence 1 scroll of mass cure wounds 1 scroll of cure wounds 1 scroll of lesser restoration"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-branch"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "mass cure wounds"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "cure wounds"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "lesser restoration"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Staff of Healing",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 5000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-staff-of-withering",
    "name": "Staff of Withering",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 255,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "780 gp",
      "materialsText": "1 rare branch 1 uncommon primal essence 1 uncommon arcane essence 1 scroll of blight"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "blight"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Staff of Withering",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 780.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-staff-of-fire",
    "name": "Staff of Fire",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 255,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 19",
      "value": "31,000 gp",
      "materialsText": "1 very rare branch 1 ruby worth 500 gp 3 very rare primal essence 6 rare primal essence 1 scroll of burning hands 1 scroll of fireball 1 scroll of wall of fire"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-branch"
            }
          },
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 500
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          },
          {
            "quantity": 6,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "burning hands"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "fireball"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "wall of fire"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Staff of Fire",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 31000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-staff-of-power",
    "name": "Staff of Power",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 255,
      "craftingTime": "32 hours (4 days)",
      "checks": "16",
      "difficulty": "DC 20",
      "value": "50,000 gp",
      "materialsText": "1 +2 quarterstaff 1 diamond worth 500 gp 1 legendary arcane essence 1 scroll of cone of cold 1 scroll of fireball 1 scroll of globe of invulnerability 1 scroll of hold monster 1 scroll of levitate 1 scroll of lightning bolt 1 scroll of magic missile 1 scroll of ray of enfeeblement 1 scroll of wall of force 10 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 32
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "+2 quarterstaff"
            }
          },
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 500
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "cone of cold"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "fireball"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "globe of invulnerability"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "hold monster"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "levitate"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "lightning bolt"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic missile"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "ray of enfeeblement"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "wall of force"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Staff of Power",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 50000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-staff-of-thunder-and-lightning",
    "name": "Staff of Thunder and Lightning",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 256,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "9,300 gp",
      "materialsText": "1 very rare branch 1 very rare primal essence 1 scroll of lightning bolt 1 scroll of thunder pulseK"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "lightning bolt"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "thunder pulse"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Staff of Thunder and Lightning",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 9300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-immovable-rod",
    "name": "Immovable Rod",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 256,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "800 gp",
      "materialsText": "1 rod worth at least 100 gp 1 scroll of gravity surgeK 4 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-rod-100"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "gravity surge"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Immovable Rod",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 800.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-rod-of-rulership",
    "name": "Rod of Rulership",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 256,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "3,100 gp",
      "materialsText": "1 rod worth at least 500 gp 1 scroll of command 1 scroll of charm person 1 scroll of suggestion 1 scroll of charm monster 2 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-rod-500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "command"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "charm person"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "suggestion"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "charm monster"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Rod of Rulership",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 3100.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-tentacle-rod",
    "name": "Tentacle Rod",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 256,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 16",
      "value": "2500 gp",
      "materialsText": "1 rod worth at least 500 gp 1 scroll of black tentacle 3 tentacles at least 5 feet long 2 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-rod-500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "black tentacle"
            }
          },
          {
            "quantity": 3,
            "match": {
              "itemName": "tentacles at least 5 feet long"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Tentacle Rod",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-rod-of-alertness",
    "name": "Rod of Alertness",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 256,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "6,400 gp",
      "materialsText": "1 rod worth at least 3,000 gp 1 scroll of alarm 1 scroll of detect evil and good 1 scroll of detect magic 1 scroll of detect poison and disease 1 scroll of see invisibility 3 rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-rod-3000"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "alarm"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "detect evil and good"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "detect magic"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "detect poison and disease"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "see invisibility"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Rod of Alertness",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 6400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-rod-of-the-pact-keeper-plus-3",
    "name": "Rod of the Pact Keeper +3",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 256,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "38,000 gp",
      "materialsText": "1 rod worth at least 5,000 gp (a) 1 entrapped soul of a devil or demon CR 15 or higher 2 very rare arcane essence, or (b) 4 very rare arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "entrapped-soul",
        "requirements": [
          { "quantity": 1, "match": { "materialId": "valued-component-rod-5000" } },
          { "quantity": 1, "match": { "itemName": "Entrapped Soul of a Devil or Demon (CR 15+)" } },
          { "quantity": 2, "sameMaterial": true, "match": { "materialId": "very-rare-arcane-essence" } }
        ]
      },
      {
        "id": "arcane-essence",
        "requirements": [
          { "quantity": 1, "match": { "materialId": "valued-component-rod-5000" } },
          { "quantity": 4, "sameMaterial": true, "match": { "materialId": "very-rare-arcane-essence" } }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Rod of the Pact Keeper +3",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 38000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-rod-of-resurrection",
    "name": "Rod of Resurrection",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 257,
      "craftingTime": "80 hours (10 days)",
      "checks": "40",
      "difficulty": "DC 24",
      "value": "120,000 gp",
      "materialsText": "1 rod worth at least 10,000 gp 1 scroll of revivify 1 scroll of raise dead 1 scroll of resurrection 1 scroll of true resurrection 1 very rare divine essence 1 legendary divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 24,
      "noToolDc": 29,
      "hoursRequired": 80
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-rod-10000"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "revivify"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "raise dead"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "resurrection"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "true resurrection"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Rod of Resurrection",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 120000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-manual-of-bodily-health",
    "name": "Manual of Bodily Health",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 257,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 21",
      "value": "68,500 gp",
      "materialsText": "1 blank book worth 500 gp 1 scroll of enhance ability 1 legendary primal essence 1 legendary divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 21,
      "noToolDc": 26,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-blank-book-500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Manual of Bodily Health",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 68500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-manual-of-golems",
    "name": "Manual of Golems*",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 257,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "12,400 gp",
      "materialsText": "1 blank book worth 250 gp 1 scroll of awaken 1 scroll of scroll of animate objects 2 very rare arcane essence 1 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-blank-book-250"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "awaken"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "scroll of animate objects"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Manual of Golems*",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 12400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-tome-of-clear-thought",
    "name": "Tome of Clear Thought",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 257,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 21",
      "value": "68,500 gp",
      "materialsText": "1 blank book worth 500 gp 1 scroll of enhance ability 2 legendary arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 21,
      "noToolDc": 26,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-blank-book-500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "legendary-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Tome of Clear Thought",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 68500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-tome-of-understanding",
    "name": "Tome of Understanding",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 257,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 21",
      "value": "68,500 gp",
      "materialsText": "1 blank book worth 500 gp 1 scroll of enhance ability 1 legendary divine essence 1 legendary primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 21,
      "noToolDc": 26,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-blank-book-500"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Tome of Understanding",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 68500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ioun-stone-protection",
    "name": "Ioun Stone (Protection)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 258,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "3,800 gp",
      "materialsText": "1 rose gem worth at least 200 gp 1 scroll of mage armor 3 rare arcane essence 1 rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 200
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "mage armor"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ioun Stone (Protection)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 3800.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ioun-stone-sustenance",
    "name": "Ioun Stone (Sustenance)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 258,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 16",
      "value": "2,290 gp",
      "materialsText": "1 clear gem worth at least 200 gp 1 scroll of create food and water 2 rare divine essence 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 200
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "create food and water"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ioun Stone (Sustenance)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "rare",
      "valueGp": 2290.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ioun-stone-strength",
    "name": "Ioun Stone (Strength)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 258,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "33,000 gp",
      "materialsText": "1 pale blue gem at least 500 gp 1 scroll of enhance ability 4 very rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 500
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ioun Stone (Strength)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 33000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ioun-stone-agility",
    "name": "Ioun Stone (Agility)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 258,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "33,000 gp",
      "materialsText": "1 deep red gem worth at least 500 gp 1 scroll of enhance ability 2 very rare primal essence 2 very rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 500
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ioun Stone (Agility)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 33000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ioun-stone-insight",
    "name": "Ioun Stone (Insight)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 258,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "33,000 gp",
      "materialsText": "1 incandescent blue worth at least 500 gp 1 scroll of enhance ability 2 very rare divine essence 2 very rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 500
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ioun Stone (Insight)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 33000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ioun-stone-leadership",
    "name": "Ioun Stone (Leadership)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 258,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "33,000 gp",
      "materialsText": "1 pink gem at least 500 gp 1 scroll of enhance ability 4 very rare divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 500
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ioun Stone (Leadership)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "very-rare",
      "valueGp": 33000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-ioun-stone-mastery",
    "name": "Ioun Stone (Mastery)",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 258,
      "craftingTime": "40 hours (5 days)",
      "checks": "20",
      "difficulty": "DC 21",
      "value": "55,800 gp",
      "materialsText": "1 green gem worth at least 1,000 gp 1 scroll of enhance ability 1 legendary divine essence 1 very rare arcane essence 1 very rare primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 21,
      "noToolDc": 26,
      "hoursRequired": 40
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 1000
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enhance ability"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ioun Stone (Mastery)",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "legendary",
      "valueGp": 55800.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-brilliant-diamond",
    "name": "Brilliant Diamond",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 259,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "95 gp",
      "materialsText": "1 diamond worth at least 25 gp 1 common arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 25
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Brilliant Diamond",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "common",
      "valueGp": 95.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-flickering-ruby",
    "name": "Flickering Ruby",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 259,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "125 gp",
      "materialsText": "1 ruby worth at least 50 gp 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 50
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Flickering Ruby",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "common",
      "valueGp": 125.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-glittering-garnet",
    "name": "Glittering Garnet",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 259,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 16",
      "value": "420 gp",
      "materialsText": "1 garnet worth at least 100 gp 1 common divine essence 1 uncommon arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 100
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Glittering Garnet",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 420.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-enchanting-perfect-infusion",
    "name": "Perfect Infusion",
    "description": "",
    "category": "enchanting",
    "kind": "crafting",
    "tags": [
      "enchanting",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 259,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 18",
      "value": "400 gp",
      "materialsText": "1 cut gem worth at least 50 gp 1 common arcane essence 1 common primal essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": "Arcana",
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 50
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Perfect Infusion",
      "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp",
      "rarity": "uncommon",
      "valueGp": 400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-lesser-wand-of-cantrip",
    "name": "Lesser Wand of Cantrip",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 274,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "30 gp",
      "materialsText": "1 scroll of the spell 1 common branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "the spell"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lesser Wand of Cantrip",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "common",
      "valueGp": 30.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-lesser-wand-of-2nd-level-spell",
    "name": "Lesser Wand of 2nd-Level Spell",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 274,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "160 gp",
      "materialsText": "1 common essence 1 scroll of the spell 1 common branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "rarity": "Common",
              "tags": ["essence"]
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "the spell"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lesser Wand of 2nd-Level Spell",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "uncommon",
      "valueGp": 160.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-lesser-wand-of-4th-level-spell",
    "name": "Lesser Wand of 4th-Level Spell",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 274,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 16",
      "value": "600 gp",
      "materialsText": "1 uncommon essence 1 scroll of the spell 1 uncommon branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "rarity": "Uncommon",
              "tags": ["essence"]
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "the spell"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lesser Wand of 4th-Level Spell",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "rare",
      "valueGp": 600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-lesser-wand-of-6th-level-spell",
    "name": "Lesser Wand of 6th-Level Spell",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 274,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 17",
      "value": "2700 gp",
      "materialsText": "1 rare essence 1 scroll of the spell 1 rare branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "rarity": "Rare",
              "tags": ["essence"]
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "the spell"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lesser Wand of 6th-Level Spell",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "rare",
      "valueGp": 2700.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-lesser-wand-of-8th-level-spell",
    "name": "Lesser Wand of 8th-Level Spell",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 274,
      "craftingTime": "16 hours",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "32,000 gp",
      "materialsText": "1 very rare essence 1 scroll of the spell 1 very rare branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "rarity": "Very Rare",
              "tags": ["essence"]
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "the spell"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lesser Wand of 8th-Level Spell",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "very-rare",
      "valueGp": 32000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-blast-stick",
    "name": "Blast Stick",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 274,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "215 gp",
      "materialsText": "2 common arcane essence 1 common branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Blast Stick",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "common",
      "valueGp": 215.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-magicians-wand",
    "name": "Magician\u2019s Wand",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 274,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "165 gp",
      "materialsText": "1 scroll of minor illlusion 1 hat worth at least 5 gp 2 common arcane essence 1 common branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "minor illlusion"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-hat-5"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Magician\u2019s Wand",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "common",
      "valueGp": 165.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-whisperstick",
    "name": "Whisperstick",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 274,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "190 gp",
      "materialsText": "1 scroll of message 1 common arcane essence 1 common psionic essence 1 common branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "message"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "common-psionic-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Whisperstick",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "common",
      "valueGp": 190.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-wand-of-magic-missiles",
    "name": "Wand of Magic Missiles",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 275,
      "craftingTime": "12 hours",
      "checks": "6",
      "difficulty": "DC 17",
      "value": "950 gp",
      "materialsText": "1 scroll of magic missile 3 uncommon arcane essence 1 gem worth 50 gp 1 uncommon branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "magic missile"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 50
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wand of Magic Missiles",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "uncommon",
      "valueGp": 950.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-wand-of-web",
    "name": "Wand of Web",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 275,
      "craftingTime": "12 hours",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "600 gp",
      "materialsText": "1 scroll of web 1 uncommon arcane essence 1 uncommon primal essence 1 uncommon branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "web"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wand of Web",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "uncommon",
      "valueGp": 600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-wand-of-binding",
    "name": "Wand of Binding",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 275,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 17",
      "value": "4,600 gp",
      "materialsText": "1 scroll of hold monster 1 scroll of hold person 4 rare arcane essence 1 rare branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "hold monster"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "hold person"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wand of Binding",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "rare",
      "valueGp": 4600.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-wand-of-fear",
    "name": "Wand of Fear",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 275,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "2,400 gp",
      "materialsText": "1 scroll of fear 2 rare arcane essence 1 uncommon divine essence 1 rare branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "fear"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wand of Fear",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "rare",
      "valueGp": 2400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-wand-of-lightning-bolts",
    "name": "Wand of Lightning Bolts",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 275,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 18",
      "value": "5,300 gp",
      "materialsText": "1 scroll of lightning bolt 2 rare arcane essence 3 rare primal essence 1 topaz worth 500 gp 1 rare branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "lightning bolt"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 500
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wand of Lightning Bolts",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "rare",
      "valueGp": 5300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-wand-of-wonder",
    "name": "Wand of Wonder",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 275,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "2,100 gp",
      "materialsText": "1 scroll of prestidigitation 1 scroll of faerie fire 1 scroll of stinking cloud 1 scroll of darkness 1 scroll of enlarge/reduce 1 scroll of invisibility 1 scroll of lightning bolt A handful of colorful gems worth 250 gp 1 uncommon primal essence 1 uncommon divine essence 1 uncommon arcane essence 1 rare branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "prestidigitation"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "faerie fire"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "stinking cloud"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "darkness"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "enlarge/reduce"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "invisibility"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "lightning bolt"
            }
          },
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 250
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wand of Wonder",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "rare",
      "valueGp": 2100.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-wandwhittling-wand-of-polymorph",
    "name": "Wand of Polymorph",
    "description": "",
    "category": "wandwhittling",
    "kind": "crafting",
    "tags": [
      "wandwhittling",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 276,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 18",
      "value": "25,000 gp",
      "materialsText": "1 scroll of polymorph 2 very rare arcane essence 1 very rare primal essence 1 very rare branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "polymorph"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wand of Polymorph",
      "img": "icons/weapons/wands/wand-gem-violet.webp",
      "rarity": "very-rare",
      "valueGp": 25000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-carapace-breastplate-1-breastplate",
    "name": "Carapace Breastplate (-1 breastplate)",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "50 gp",
      "materialsText": "1 large carapace 2 leather (any) 2 buckles"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "large-carapace"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "buckle"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Carapace Breastplate (-1 breastplate)",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-hide-armor",
    "name": "Hide Armor",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 10",
      "value": "10 gp",
      "materialsText": "2 rawhide leather 1 hide 2 buckles"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rawhide-leather"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "hide"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "buckle"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Hide Armor",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-leather-buckler",
    "name": "Leather Buckler",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 10",
      "value": "10 gp",
      "materialsText": "2 boiled leather 2 leather scraps"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "boiled-leather"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Leather Buckler",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-scale-mail",
    "name": "Scale Mail",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 12",
      "value": "50 gp",
      "materialsText": "25 scales 5 leather scraps 1 armor padding"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 25,
            "sameMaterial": true,
            "match": {
              "materialId": "scales"
            }
          },
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "armor-padding"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Scale Mail",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-whip",
    "name": "Whip",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 9",
      "value": "4 gp",
      "materialsText": "1 tanned leather"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Whip",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 4.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-rawhide",
    "name": "Rawhide*",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 6",
      "value": "2 gp",
      "materialsText": "1 hide"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 6,
      "noToolDc": 11,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "hide"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Rawhide*",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 2.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-boiled-leather",
    "name": "Boiled Leather",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "16 hours",
      "checks": "8",
      "difficulty": "DC 6",
      "value": "3 gp",
      "materialsText": "1 hide or rawhide"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 6,
      "noToolDc": 11,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "tags": ["hide"]
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Boiled Leather",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 3.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-hide",
    "name": "Hide",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 10",
      "value": "2 gp",
      "materialsText": "20 hide scraps"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 20,
            "sameMaterial": true,
            "match": {
              "materialId": "hide-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Hide",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 2.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-belt",
    "name": "Belt",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 9",
      "value": "1 gp",
      "materialsText": "4 leather scraps 1 buckle"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "buckle"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Belt",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 1.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-sheath",
    "name": "Sheath",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 9",
      "value": "6 sp",
      "materialsText": "4 leather scraps"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Sheath",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 0.6000000000000001,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-waterskin",
    "name": "Waterskin",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 278,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 8",
      "value": "2 sp",
      "materialsText": "2 leather scraps"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Waterskin",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 0.2,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-bag",
    "name": "Bag",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 279,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 10",
      "value": "2 gp",
      "materialsText": "10 leather scraps 1 buckles"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "buckle"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Bag",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 2.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-uncommon-parchment",
    "name": "Uncommon Parchment",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 279,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "40 gp",
      "materialsText": "1 tanned leather 2 common alchemical reagents (any)"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "common-reactive-reagent"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Uncommon Parchment",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "uncommon",
      "valueGp": 40.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-very-rare-parchment",
    "name": "Very Rare Parchment",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 279,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 18",
      "value": "2,000 gp",
      "materialsText": "1 tough leather 1 rare arcane essence 2 uncommon arcane essence"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tough-leather"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Very Rare Parchment",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "very-rare",
      "valueGp": 2000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-armor-padding",
    "name": "Armor Padding",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 279,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 10",
      "value": "5 gp",
      "materialsText": "1 tanned leather 2 buckles"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "buckle"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Armor Padding",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-saddle-exotic",
    "name": "Saddle, Exotic",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 279,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 14",
      "value": "60 gp",
      "materialsText": "4 rawhide 4 tanned leather 2 parts 1 fancy parts"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "match": {
              "materialId": "rawhide-leather"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Saddle, Exotic",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 60.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-saddle-pack",
    "name": "Saddle, Pack",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 279,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 10",
      "value": "5 gp",
      "materialsText": "1 tanned leather 2 leather scraps"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Saddle, Pack",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-saddlebag",
    "name": "Saddlebag",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 279,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 10",
      "value": "4 gp",
      "materialsText": "1 tanned leather"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Saddlebag",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 4.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-leatherworking-throwing-bandolier",
    "name": "Throwing Bandolier",
    "description": "",
    "category": "leatherworking",
    "kind": "crafting",
    "tags": [
      "leatherworking",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 279,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "12",
      "value": "20",
      "materialsText": "1 tanned leather 3 leather scraps 1 buckle"
    },
    "craft": {
      "tool": "Leatherworker's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "buckle"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Throwing Bandolier",
      "img": "icons/equipment/chest/breastplate-leather-brown.webp",
      "rarity": "common",
      "valueGp": 0.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-lantern-bullseye",
    "name": "Lantern (Bullseye)",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 282,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 11",
      "value": "10 gp",
      "materialsText": "3 metal scraps 2 parts 1 glass flask"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 11,
      "noToolDc": 16,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "glass-flask"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lantern (Bullseye)",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-lamp",
    "name": "Lamp",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 282,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 10",
      "value": "5 sp",
      "materialsText": "2 metal scraps"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lamp",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 0.5,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-grappling-hook",
    "name": "Grappling Hook",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 282,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "7 gp",
      "materialsText": "1 rope 2 metal scraps 1 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "rope"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Grappling Hook",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 7.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-merchants-scale",
    "name": "Merchant\u2019s Scale",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 282,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 10",
      "value": "5 gp",
      "materialsText": "1 metal scraps 2 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Merchant\u2019s Scale",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-spyglass",
    "name": "Spyglass",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 282,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 18",
      "value": "1,000 gp",
      "materialsText": "2 metal scraps 2 fancy parts 5 esoteric parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "esoteric-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Spyglass",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 1000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-clockwork-toy",
    "name": "Clockwork Toy",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 282,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "10 gp",
      "materialsText": "2 metal scraps 3 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Clockwork Toy",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-underwater-breathing-apparatus",
    "name": "Underwater Breathing Apparatus",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 282,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 16",
      "value": "300 gp",
      "materialsText": "4 metal scraps 3 common primal essence 2 fancy parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "common-primal-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Underwater Breathing Apparatus",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "uncommon",
      "valueGp": 300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-miscellaneous-parts",
    "name": "Miscellaneous Parts",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 282,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "2 gp",
      "materialsText": "5 metal scraps"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Miscellaneous Parts",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 2.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-noise-trap",
    "name": "Noise Trap",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 13",
      "value": "10 gp",
      "materialsText": "2 metal scraps 2 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Noise Trap",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-trip-wire",
    "name": "Trip Wire",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "5 gp",
      "materialsText": "2 metal scraps 1 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Trip Wire",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-alchemists-supplies",
    "name": "Alchemist\u2019s Supplies",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "50 gp",
      "materialsText": "4 metal scraps 2 fancy parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Alchemist\u2019s Supplies",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-calligrapher-s-tools",
    "name": "Calligrapher's Tools",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 11",
      "value": "10 gp",
      "materialsText": "5 metal scraps 2 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 11,
      "noToolDc": 16,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Calligrapher's Tools",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-cobblers-tools",
    "name": "Cobbler\u2019s Tools",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "5 gp",
      "materialsText": "3 metal scraps 1 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Cobbler\u2019s Tools",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-glassblowers-tools",
    "name": "Glassblower\u2019s Tools",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 12",
      "value": "30 gp",
      "materialsText": "3 metal scraps 2 fancy parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Glassblower\u2019s Tools",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 30.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-leatherworkers-tools",
    "name": "Leatherworker\u2019s Tools",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "5 gp",
      "materialsText": "4 metal scraps 1 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Leatherworker\u2019s Tools",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-poisoner-s-kit",
    "name": "Poisoner's Kit",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 13",
      "value": "50 gp",
      "materialsText": "3 glass vial 3 parts 1 fancy parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "glass-vial"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Poisoner's Kit",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-weavers-tools",
    "name": "Weaver\u2019s Tools",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "1 gp",
      "materialsText": "4 metal scraps"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Weaver\u2019s Tools",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 1.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-navigators-tools",
    "name": "Navigator\u2019s Tools",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 12",
      "value": "25 gp",
      "materialsText": "3 metal scraps 2 parts 1 fancy parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Navigator\u2019s Tools",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 25.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-herbalism-kit",
    "name": "Herbalism Kit",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "5 gp",
      "materialsText": "4 metal scraps 1 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Herbalism Kit",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-horn",
    "name": "Horn",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 283,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 10",
      "value": "4 gp",
      "materialsText": "4 metal scraps 1 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Horn",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 4.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-light-crossbow",
    "name": "Light Crossbow",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 284,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 13",
      "value": "25 gp",
      "materialsText": "1 wooden stock 4 metal scraps 6 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "wooden-stock"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 6,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Light Crossbow",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 25.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-heavy-crossbow",
    "name": "Heavy Crossbow",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 284,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 13",
      "value": "50 gp",
      "materialsText": "1 wooden stock 8 metal scraps 6 parts 2 fancy parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "wooden-stock"
            }
          },
          {
            "quantity": 8,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 6,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Heavy Crossbow",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-lantern-shield",
    "name": "Lantern Shield",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 284,
      "craftingTime": "16 hours",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "1700 gp",
      "materialsText": "1 shield 1 hooded lantern 1 +1 shortsword 3 esoteric parts 5 fancy parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Shield"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "hooded lantern"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "+1 shortsword"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "esoteric-parts"
            }
          },
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lantern Shield",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "very-rare",
      "valueGp": 1700.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-whistling-shot",
    "name": "Whistling Shot",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 284,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "8 gp",
      "materialsText": "1 piece of ammunition 2 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "type": "alternatives",
            "alternatives": [
            { "quantity": 1, "match": { "itemName": "Arrow" } },
            { "quantity": 1, "match": { "itemName": "Bolt" } }
            ]
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Whistling Shot",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 8.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-payload-shot",
    "name": "Payload Shot",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 284,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 16",
      "value": "35 gp",
      "materialsText": "1 piece of ammunition 1 item weighing less than 2 lb. 1 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "type": "alternatives",
            "alternatives": [
            { "quantity": 1, "match": { "itemName": "Arrow" } },
            { "quantity": 1, "match": { "itemName": "Bolt" } }
            ]
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "item weighing less than 2 lb"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Payload Shot",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 35.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-spell-shot",
    "name": "Spell Shot",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 284,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "80 gp",
      "materialsText": "1 piece of ammunition 1 fancy parts (a) 1 scroll of fog cloud, or (b) 1 scroll of entangle, or (c) 1 scroll of multishot"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "type": "alternatives",
            "alternatives": [
            { "quantity": 1, "match": { "itemName": "Arrow" } },
            { "quantity": 1, "match": { "itemName": "Bolt" } }
            ]
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "alternatives": [
              {
                "quantity": 1,
                "match": {
                  "itemType": "spellScroll",
                  "spellName": "fog cloud"
                }
              },
              {
                "quantity": 1,
                "match": {
                  "itemType": "spellScroll",
                  "spellName": "entangle"
                }
              },
              {
                "quantity": 1,
                "match": {
                  "itemType": "spellScroll",
                  "spellName": "multishot"
                }
              }
            ]
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Spell Shot",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "uncommon",
      "valueGp": 80.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-bouncing-shot",
    "name": "Bouncing Shot",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 284,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 15",
      "value": "30 gp",
      "materialsText": "1 piece of ammunition 1 fancy parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "type": "alternatives",
            "alternatives": [
            { "quantity": 1, "match": { "itemName": "Arrow" } },
            { "quantity": 1, "match": { "itemName": "Bolt" } }
            ]
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Bouncing Shot",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 30.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-basic-leg-prosthetics",
    "name": "Basic Leg Prosthetics",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 285,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 10",
      "value": "5 gp",
      "materialsText": "8 metal scraps 1 parts"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 8,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Basic Leg Prosthetics",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-mechanical-leg",
    "name": "Mechanical Leg",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 285,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "125 gp",
      "materialsText": "8 metal scraps 4 parts 2 fancy parts 1 common arcane essence"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 8,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Mechanical Leg",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "common",
      "valueGp": 125.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-specialized-mechanical-arm",
    "name": "Specialized Mechanical Arm",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 285,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 15",
      "value": "270 gp",
      "materialsText": "1 tool of your choice 6 metal scraps 4 fancy parts 1 esoteric parts 1 common arcane essence"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Tinker's Tools"
            }
          },
          {
            "quantity": 6,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "esoteric-parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Specialized Mechanical Arm",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "uncommon",
      "valueGp": 270.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-tinkering-folding-boat",
    "name": "Folding Boat",
    "description": "",
    "category": "tinkering",
    "kind": "crafting",
    "tags": [
      "tinkering",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 285,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 17",
      "value": "1,800 gp",
      "materialsText": "1 boat (not inluded in cost) 10 parts 3 esoteric parts 2 uncommon primal essence 1 rare arcane essence"
    },
    "craft": {
      "tool": "Tinker's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "Rowboat"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "esoteric-parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Folding Boat",
      "img": "icons/commodities/tech/cog-steel-grey.webp",
      "rarity": "rare",
      "valueGp": 1800.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-shortbow",
    "name": "Shortbow",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 289,
      "craftingTime": "12 hours",
      "checks": "6",
      "difficulty": "DC 12",
      "value": "25 gp",
      "materialsText": "1 quality branch 1 leather scraps 1 length of string"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "leather-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "length-of-string"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Shortbow",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 25.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-composite-bow",
    "name": "Composite Bow",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 289,
      "craftingTime": "24 hours",
      "checks": "12",
      "difficulty": "DC 12",
      "value": "50 gp",
      "materialsText": "1 common branch 4 leather scraps 1 length of string"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "length-of-string"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Composite Bow",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-wooden-shield",
    "name": "Wooden Shield",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 290,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "10 gp",
      "materialsText": "4 common branches 1 metal scraps 1 leather scraps"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "common-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "leather-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wooden Shield",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 10.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-flute",
    "name": "Flute",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 290,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 9",
      "value": "4 gp",
      "materialsText": "1 quality branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "quality-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Flute",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 4.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-lute",
    "name": "Lute",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 290,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 13",
      "value": "35 gp",
      "materialsText": "2 quality branches 2 lengths of string 1 fancy parts"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "length-of-string"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lute",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 35.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-dulcimer",
    "name": "Dulcimer",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 290,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 11",
      "value": "25 gp",
      "materialsText": "2 quality branches 2 lengths of string 1 fancy parts"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 11,
      "noToolDc": 16,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "length-of-string"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Dulcimer",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 25.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-pan-flute",
    "name": "Pan Flute",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 290,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 11",
      "value": "12 gp",
      "materialsText": "1 quality branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 11,
      "noToolDc": 16,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "quality-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Pan Flute",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 12.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-viol",
    "name": "Viol",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 290,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "30 gp",
      "materialsText": "3 quality branches 2 lengths of string 1 fancy parts"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "length-of-string"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Viol",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 30.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-10-x-arrow",
    "name": "10 x Arrow",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 290,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 10",
      "value": "5 sp",
      "materialsText": "1 common branch 1 metal scraps 1 fletching"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "metal-scraps"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "fletching"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "10 x Arrow",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 0.5,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-short-haft",
    "name": "Short Haft",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 290,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 8",
      "value": "1 sp",
      "materialsText": "1 common branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Short Haft",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 0.1,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-wooden-stock",
    "name": "Wooden Stock",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 290,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 9",
      "value": "5 sp",
      "materialsText": "1 common branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wooden Stock",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 0.5,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-fishing-pole",
    "name": "Fishing Pole",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 291,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 8",
      "value": "5 gp",
      "materialsText": "1 quality branch 1 parts 3 lengths of string"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 3,
            "match": {
              "materialId": "length-of-string"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Fishing Pole",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 5.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-quality-figurine",
    "name": "Quality Figurine",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 291,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "50 gp",
      "materialsText": "1 quality branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "quality-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Quality Figurine",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-5-x-wood-scraps",
    "name": "5 x Wood Scraps",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 291,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 5",
      "value": "1 sp",
      "materialsText": "1 common branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 5,
      "noToolDc": 10,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "5 x Wood Scraps",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 0.1,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-quality-branch",
    "name": "Quality Branch",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 291,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 9",
      "value": "2 gp",
      "materialsText": "1 common branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 9,
      "noToolDc": 14,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Quality Branch",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "common",
      "valueGp": 2.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-rare-branch",
    "name": "Rare Branch",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 291,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 15",
      "value": "70 gp",
      "materialsText": "1 uncommon branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Rare Branch",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "rare",
      "valueGp": 70.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-woodcarving-legendary-branch",
    "name": "Legendary Branch",
    "description": "",
    "category": "woodcarving",
    "kind": "crafting",
    "tags": [
      "woodcarving",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 291,
      "craftingTime": "12 hours (1.5 days)",
      "checks": "6",
      "difficulty": "DC 20",
      "value": "2,000 gp",
      "materialsText": "1 very rare branch"
    },
    "craft": {
      "tool": "Woodcarver's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-branch"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Legendary Branch",
      "img": "icons/commodities/wood/kindling-stick-tan.webp",
      "rarity": "legendary",
      "valueGp": 2000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-light",
    "name": "Light",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 293,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "70 gp",
      "materialsText": "1 common primal essence 1 common magical ink"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-magical-ink"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Light",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "common",
      "valueGp": 70.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-lightning",
    "name": "Lightning",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 293,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 14",
      "value": "330 gp",
      "materialsText": "1 uncommon primal essence 1 uncommon magical ink 1 common primal essence 1 common arcane essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Lightning",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "uncommon",
      "valueGp": 330.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-vision",
    "name": "Vision",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 293,
      "craftingTime": "6 hours",
      "checks": "3",
      "difficulty": "DC 14",
      "value": "330 gp",
      "materialsText": "1 uncommon primal essence 1 uncommon magical ink 1 common arcane essence 1 common divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Vision",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "uncommon",
      "valueGp": 330.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-vigor",
    "name": "Vigor",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 293,
      "craftingTime": "12 hours",
      "checks": "6",
      "difficulty": "DC 15",
      "value": "1,900 gp",
      "materialsText": "1 rare primal essence 1 uncommon magical ink 4 rare curative reagents 1 uncommon divine essence"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-magical-ink"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-curative-reagent"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Vigor",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "rare",
      "valueGp": 1900.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-brutality",
    "name": "Brutality",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 293,
      "craftingTime": "12 hours",
      "checks": "6",
      "difficulty": "DC 16",
      "value": "3,300 gp",
      "materialsText": "3 rare primal ressences 1 rare magical ink"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "match": {
              "materialId": "rare-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-magical-ink"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Brutality",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "rare",
      "valueGp": 3300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-death",
    "name": "Death",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "legendary"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 293,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 19",
      "value": "65,000 gp",
      "materialsText": "1 legendary divine essence 1 legendary primal essence 1 legendary magical ink 4 rare primal essences"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 19,
      "noToolDc": 24,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-primal-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-magical-ink"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-primal-essence"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Death",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "legendary",
      "valueGp": 65000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-color",
    "name": "Color",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 294,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 13",
      "value": "20 gp",
      "materialsText": "1 common magical ink"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-magical-ink"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Color",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-connection",
    "name": "Connection",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 294,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "390 gp",
      "materialsText": "1 scroll of detect thoughts 1 scroll of calm emotions 1 uncommon divine essence 1 uncommon magical ink"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "detect thoughts"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "calm emotions"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-divine-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-magical-ink"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Connection",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "uncommon",
      "valueGp": 390.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-gravity",
    "name": "Gravity",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "uncommon"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 294,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "320 gp",
      "materialsText": "1 uncommon arcane essence 1 uncommon magical ink 1 scroll of levitate"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-magical-ink"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "levitate"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Gravity",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "uncommon",
      "valueGp": 320.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-blood",
    "name": "Blood",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 294,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 16",
      "value": "1,400 gp",
      "materialsText": "1 rare arcane essence 1 scroll of vampiric touch 1 rare magical ink"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "vampiric touch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-magical-ink"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Blood",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "rare",
      "valueGp": 1400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-space",
    "name": "Space",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 294,
      "craftingTime": "10 hours",
      "checks": "5",
      "difficulty": "DC 17",
      "value": "2,000 gp",
      "materialsText": "1 rare arcane essence 1 scroll of dimension door 2 uncommon arcane essence 1 rare magical ink"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 10
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "dimension door"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-magical-ink"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Space",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "rare",
      "valueGp": 2000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-runecarving-reality",
    "name": "Reality",
    "description": "",
    "category": "runecarving",
    "kind": "crafting",
    "tags": [
      "runecarving",
      "very-rare"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 294,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 18",
      "value": "14,000 gp",
      "materialsText": "1 scroll of major image 1 scroll of creation 1 very rare arcane essence 2 rare arcane essence 1 very rare magical ink"
    },
    "craft": {
      "tool": null,
      "ability": "Intelligence",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "major image"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemType": "spellScroll",
              "spellName": "creation"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-arcane-essence"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-arcane-essence"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-magical-ink"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Reality",
      "img": "icons/commodities/stone/stone-carved-rune-pink.webp",
      "rarity": "very-rare",
      "valueGp": 14000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-ballista-large",
    "name": "Ballista (Large)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 300,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 16",
      "value": "150 gp",
      "materialsText": "2 units of lumber 4 quality branches 10 parts 5 leather scraps rope (20 ft.)"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 5,
            "match": {
              "materialId": "leather-scraps"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ballista (Large)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 150.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-ram-large",
    "name": "Ram (Large)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 300,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 14",
      "value": "65 gp",
      "materialsText": "4 units of lumber 10 rawhide leather 10 parts 2 ingots rope (20 ft.)"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "rawhide-leather"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 2,
            "match": {
              "materialId": "iron-ingot"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Ram (Large)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 65.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-siege-tower-gargantuan",
    "name": "Siege Tower (Gargantuan)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 300,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 16",
      "value": "120 gp",
      "materialsText": "10 units of lumber 20 parts 10 rawhide leather rope (60 ft.)"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 10,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 20,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 10,
            "match": {
              "materialId": "rawhide-leather"
            }
          },
          {
            "quantity": 2,
            "match": {
              "itemName": "Rope"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Siege Tower (Gargantuan)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 120.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-low-stone-wall-per-10-ft",
    "name": "Low Stone Wall (per 10 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 300,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 10",
      "value": "8 gp",
      "materialsText": "1 units of stone 1 bucket of cement"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "materialId": "unit-of-stone"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "bucket of cement"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Low Stone Wall (per 10 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 8.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-palisade-per-10-ft",
    "name": "Palisade (per 10 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 300,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 10",
      "value": "2 gp",
      "materialsText": "2 units of lumber"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "itemName": "units of lumber"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Palisade (per 10 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 2.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-wooden-battlement-per-10-ft",
    "name": "Wooden Battlement (per 10 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 300,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 12",
      "value": "50 gp",
      "materialsText": "5 units of lumber 4 parts 4 metal scraps"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 5,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "metal-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wooden Battlement (per 10 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 50.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-narrow-wooden-bridge-per-10-ft",
    "name": "Narrow Wooden Bridge (per 10 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 300,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "25 gp",
      "materialsText": "1 units of lumber 2 parts"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Narrow Wooden Bridge (per 10 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 25.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-huge-wooden-bridge-per-10-ft",
    "name": "Huge Wooden Bridge (per 10 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 300,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 15",
      "value": "165 gp",
      "materialsText": "5 units of lumber 10 parts"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 5,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Huge Wooden Bridge (per 10 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 165.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-large-stone-bridge-per-10-ft",
    "name": "Large Stone Bridge (per 10 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 301,
      "craftingTime": "16 hours (2 days)",
      "checks": "8",
      "difficulty": "DC 15",
      "value": "160 gp",
      "materialsText": "3 units of stone 3 buckets of cement"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "match": {
              "materialId": "unit-of-stone"
            }
          },
          {
            "quantity": 3,
            "match": {
              "itemName": "buckets of cement"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Large Stone Bridge (per 10 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 160.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-basic-shelter-10-ft-x-10-ft",
    "name": "Basic Shelter (10 ft x 10 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 301,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 8",
      "value": "3 gp",
      "materialsText": "1 unit of lumber 1 parts"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "match": {
              "itemName": "unit of lumber"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Basic Shelter (10 ft x 10 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 3.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-small-house-25-ft-x-25-ft",
    "name": "Small House (25 ft x 25 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 301,
      "craftingTime": "8 hours (2 days) With 5 laborers",
      "checks": "4",
      "difficulty": "DC 12",
      "value": "100 gp",
      "materialsText": "6 units of lumber 6 parts"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 6,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 6,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Small House (25 ft x 25 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 100.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-large-house-35-ft-x-35-ft",
    "name": "Large House (35 ft x 35 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 301,
      "craftingTime": "24 hours (3 days) With 10 laborers",
      "checks": "12",
      "difficulty": "DC 15",
      "value": "2,400 gp",
      "materialsText": "10 units of lumber 5 units of stone 10 parts 5 buckets of cement 5 fancy parts"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 10,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 5,
            "match": {
              "materialId": "unit-of-stone"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 5,
            "match": {
              "itemName": "buckets of cement"
            }
          },
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Large House (35 ft x 35 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 2400.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-cathedral-50-ft-x-100-ft",
    "name": "Cathedral (50 ft x 100 ft)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 301,
      "craftingTime": "160 hours (20 days) With 10 laborers",
      "checks": "80",
      "difficulty": "DC 17",
      "value": "40,000 gp",
      "materialsText": "50 units of lumber 50 units of stone 20 parts 20 buckets of cement 10 fancy parts 2 esoteric parts"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 160
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 50,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 50,
            "match": {
              "materialId": "unit-of-stone"
            }
          },
          {
            "quantity": 20,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 20,
            "match": {
              "itemName": "buckets of cement"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "esoteric-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Cathedral (50 ft x 100 ft)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 40000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-carriage-large",
    "name": "Carriage (Large)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 301,
      "craftingTime": "16 hours",
      "checks": "8",
      "difficulty": "DC 13",
      "value": "100 gp",
      "materialsText": "3 units of lumber 2 quality branch 1 tanned leather 5 parts 2 fancy parts"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 13,
      "noToolDc": 18,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Carriage (Large)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 100.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-chariot-large",
    "name": "Chariot (Large)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 302,
      "craftingTime": "20 hours",
      "checks": "10",
      "difficulty": "DC 14",
      "value": "250 gp",
      "materialsText": "2 units of lumber 2 quality branches 2 tanned leather 4 parts 2 fancy parts"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 20
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Chariot (Large)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 250.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-wagon-large",
    "name": "Wagon (Large)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 302,
      "craftingTime": "10 hours",
      "checks": "5",
      "difficulty": "DC 12",
      "value": "35 gp",
      "materialsText": "3 units of lumber 2 quality branches 4 parts 4 leather scraps"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 10
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "leather-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Wagon (Large)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 35.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-galley-gargantuan",
    "name": "Galley (Gargantuan)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 302,
      "craftingTime": "160 hours (20 days) With 10 laborers",
      "checks": "80",
      "difficulty": "DC 16",
      "value": "26,000 gp",
      "materialsText": "100 units of lumber 20 quality branches 100 parts 10 fancy parts Rope (600 ft.)"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 160
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 100,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 20,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 100,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope (600 ft.)"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Galley (Gargantuan)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 26000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-longship-gargantuan",
    "name": "Longship (Gargantuan)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 302,
      "craftingTime": "80 hours (10 days) With 10 laborers",
      "checks": "40",
      "difficulty": "DC 15",
      "value": "8,000 gp",
      "materialsText": "40 units of lumber 10 quality branches 100 parts 5 fancy parts Rope (500 ft.)"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 80
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 40,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 100,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 5,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope (500 ft.)"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Longship (Gargantuan)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 8000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-engineering-sailing-ship-gargantuan",
    "name": "Sailing Ship (Gargantuan)",
    "description": "",
    "category": "engineering",
    "kind": "crafting",
    "tags": [
      "engineering",
      "common"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 302,
      "craftingTime": "80 hours (10 days) With 10 laborers",
      "checks": "40",
      "difficulty": "DC 15",
      "value": "8,000 gp",
      "materialsText": "60 units of lumber 10 quality branches 100 parts 10 fancy parts Rope (2,000 ft.)"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 80
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 60,
            "match": {
              "itemName": "units of lumber"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "quality-branch"
            }
          },
          {
            "quantity": 100,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 10,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 1,
            "match": {
              "itemName": "Rope (2,000 ft.)"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Sailing Ship (Gargantuan)",
      "img": "icons/environment/settlement/watchtower-wood.webp",
      "rarity": "common",
      "valueGp": 8000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cobbling-boots",
    "name": "Boots",
    "description": "",
    "category": "cobbling",
    "kind": "crafting",
    "tags": [
      "cobbling",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 303,
      "checks": "1",
      "difficulty": "DC 10",
      "value": "5 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Cobbler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "buckle"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Boots",
      "img": "icons/equipment/feet/boots-leather-brown.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cobbling-nice-boots",
    "name": "Nice Boots",
    "description": "",
    "category": "cobbling",
    "kind": "crafting",
    "tags": [
      "cobbling",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 303,
      "checks": "3",
      "difficulty": "DC 16",
      "value": "100 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Cobbler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "buckle"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Nice Boots",
      "img": "icons/equipment/feet/boots-leather-brown.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-cobbling-fancy-boots",
    "name": "Fancy Boots",
    "description": "",
    "category": "cobbling",
    "kind": "crafting",
    "tags": [
      "cobbling",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 303,
      "checks": "4",
      "difficulty": "DC 16",
      "value": "240 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Cobbler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "tanned-leather"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "buckle"
            }
          },
          {
            "quantity": 1,
            "match": {
              "materialId": "valued-component-rare-materials-50"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Fancy Boots",
      "img": "icons/equipment/feet/boots-leather-brown.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-masonry-simple-statue",
    "name": "Simple Statue",
    "description": "",
    "category": "masonry",
    "kind": "crafting",
    "tags": [
      "masonry",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 303,
      "checks": "8",
      "difficulty": "DC 12",
      "value": "35 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Mason's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "unit-of-stone"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Simple Statue",
      "img": "icons/commodities/stone/stone-pile-grey.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-masonry-masterwork-statue",
    "name": "Masterwork Statue",
    "description": "",
    "category": "masonry",
    "kind": "crafting",
    "tags": [
      "masonry",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 303,
      "checks": "8",
      "difficulty": "DC 18",
      "value": "670 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Mason's Tools",
      "ability": "Strength",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 16
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "unit-of-stone"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Masterwork Statue",
      "img": "icons/commodities/stone/stone-pile-grey.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-jewelcrafting-common-ring",
    "name": "Common Ring",
    "description": "",
    "category": "jewelcrafting",
    "kind": "crafting",
    "tags": [
      "jewelcrafting",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "4",
      "difficulty": "DC 12",
      "value": "20 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Jeweler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "silver-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Common Ring",
      "img": "icons/commodities/gems/gem-faceted-round-white.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-jewelcrafting-valuable-ring",
    "name": "Valuable Ring",
    "description": "",
    "category": "jewelcrafting",
    "kind": "crafting",
    "tags": [
      "jewelcrafting",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "6",
      "difficulty": "DC 16",
      "value": "200 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Jeweler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "gold-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Valuable Ring",
      "img": "icons/commodities/gems/gem-faceted-round-white.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-jewelcrafting-socketed-ring",
    "name": "Socketed Ring",
    "description": "",
    "category": "jewelcrafting",
    "kind": "crafting",
    "tags": [
      "jewelcrafting",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "4",
      "difficulty": "DC 14",
      "value": "45 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Jeweler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "silver-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Socketed Ring",
      "img": "icons/commodities/gems/gem-faceted-round-white.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-jewelcrafting-common-amulet",
    "name": "Common Amulet",
    "description": "",
    "category": "jewelcrafting",
    "kind": "crafting",
    "tags": [
      "jewelcrafting",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "4",
      "difficulty": "DC 15",
      "value": "150 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Jeweler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 3,
            "sameMaterial": true,
            "match": {
              "materialId": "gold-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Common Amulet",
      "img": "icons/commodities/gems/gem-faceted-round-white.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-jewelcrafting-valuable-amulet",
    "name": "Valuable Amulet",
    "description": "",
    "category": "jewelcrafting",
    "kind": "crafting",
    "tags": [
      "jewelcrafting",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "6",
      "difficulty": "DC 16",
      "value": "250 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Jeweler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 12
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "gold-scraps"
            }
          },
          {
            "quantity": 1,
            "match": {
              "lootTypes": ["Gemstone", "Art Object"],
              "minValueGp": 50
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Valuable Amulet",
      "img": "icons/commodities/gems/gem-faceted-round-white.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-jewelcrafting-basic-glasses",
    "name": "Basic Glasses",
    "description": "",
    "category": "jewelcrafting",
    "kind": "crafting",
    "tags": [
      "jewelcrafting",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "2",
      "difficulty": "DC 12",
      "value": "10 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Jeweler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "metal-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Basic Glasses",
      "img": "icons/commodities/gems/gem-faceted-round-white.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-jewelcrafting-quality-glasses",
    "name": "Quality Glasses",
    "description": "",
    "category": "jewelcrafting",
    "kind": "crafting",
    "tags": [
      "jewelcrafting",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "3",
      "difficulty": "DC 14",
      "value": "50 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Jeweler's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 6
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "fancy-parts"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "silver-scraps"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Quality Glasses",
      "img": "icons/commodities/gems/gem-faceted-round-white.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-carpentry-chairs",
    "name": "Chairs",
    "description": "",
    "category": "carpentry",
    "kind": "crafting",
    "tags": [
      "carpentry",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "2",
      "difficulty": "DC 8",
      "value": "1 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "common-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 4,
      "label": "Chairs",
      "img": "icons/environment/settlement/house-wood.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-carpentry-table",
    "name": "Table",
    "description": "",
    "category": "carpentry",
    "kind": "crafting",
    "tags": [
      "carpentry",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "2",
      "difficulty": "DC 8",
      "value": "3 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 8,
      "noToolDc": 13,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 8,
            "sameMaterial": true,
            "match": {
              "materialId": "common-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Table",
      "img": "icons/environment/settlement/house-wood.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-carpentry-door",
    "name": "Door",
    "description": "",
    "category": "carpentry",
    "kind": "crafting",
    "tags": [
      "carpentry",
      "minor-craft"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 305,
      "checks": "2",
      "difficulty": "DC 10",
      "value": "6 gp",
      "materialsText": "Minor branch example recipe"
    },
    "craft": {
      "tool": "Carpenter's Tools",
      "ability": "Dexterity",
      "skill": null,
      "dc": 10,
      "noToolDc": 15,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 4,
            "sameMaterial": true,
            "match": {
              "materialId": "common-branch"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parts"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Door",
      "img": "icons/environment/settlement/house-wood.webp",
      "rarity": "common",
      "valueGp": 0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-0",
    "name": "Cantrip",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "common",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "20 gp",
      "materialsText": "1 common magical ink 1 common parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "Cantrip",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "common",
      "valueGp": 20.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-1",
    "name": "1st-Level Spell",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "uncommon",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 12",
      "value": "65 gp",
      "materialsText": "1 common essence 1 common magical ink 1 common parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 12,
      "noToolDc": 17,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "rarity": "common",
              "category": "essences"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "common-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "1st-Level Spell",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "uncommon",
      "valueGp": 65.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-2",
    "name": "2nd-Level Spell",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "uncommon",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "2 hours",
      "checks": "1",
      "difficulty": "DC 14",
      "value": "90 gp",
      "materialsText": "1 common essence 2 common magical ink 1 common parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 2
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "rarity": "common",
              "category": "essences"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "common-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "2nd-Level Spell",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "uncommon",
      "valueGp": 90.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-3",
    "name": "3rd-Level Spell",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "rare",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "250 gp",
      "materialsText": "1 uncommon essence 1 uncommon magical ink 1 uncommon parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "rarity": "uncommon",
              "category": "essences"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "3rd-Level Spell",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "rare",
      "valueGp": 250.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-4",
    "name": "4th-Level Spell",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "rare",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 14",
      "value": "300 gp",
      "materialsText": "1 uncommon essence 2 uncommon magical ink 1 uncommon parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 14,
      "noToolDc": 19,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "rarity": "uncommon",
              "category": "essences"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "uncommon-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "uncommon-parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "4th-Level Spell",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "rare",
      "valueGp": 300.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-5",
    "name": "5th-Level Spell",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "rare",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 15",
      "value": "1,200 gp",
      "materialsText": "1 rare essence 1 rare magical ink 1 rare parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 15,
      "noToolDc": 20,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "rarity": "rare",
              "category": "essences"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "5th-Level Spell",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "rare",
      "valueGp": 1200.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-6",
    "name": "6th-Level Spell",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "rare",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "4 hours",
      "checks": "2",
      "difficulty": "DC 16",
      "value": "1,500 gp",
      "materialsText": "1 rare essence 2 rare magical ink 1 rare parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 16,
      "noToolDc": 21,
      "hoursRequired": 4
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "rarity": "rare",
              "category": "essences"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "rare-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "rare-parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "6th-Level Spell",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "rare",
      "valueGp": 1500.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-7",
    "name": "7th-Level Spell",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "very-rare",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 17",
      "value": "12,000 gp",
      "materialsText": "1 very rare essence 1 very rare magical ink 1 very rare parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 17,
      "noToolDc": 22,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "rarity": "very-rare",
              "category": "essences"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "7th-Level Spell",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "very-rare",
      "valueGp": 12000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-8",
    "name": "8th-Level Spell",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "very-rare",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "8 hours",
      "checks": "4",
      "difficulty": "DC 18",
      "value": "14,000 gp",
      "materialsText": "1 very rare essence 2 very rare magical ink 1 very rare parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 18,
      "noToolDc": 23,
      "hoursRequired": 8
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "rarity": "very-rare",
              "category": "essences"
            }
          },
          {
            "quantity": 2,
            "sameMaterial": true,
            "match": {
              "materialId": "very-rare-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "very-rare-parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "8th-Level Spell",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "very-rare",
      "valueGp": 14000.0,
      "itemType": "loot"
    }
  },
  {
    "schemaVersion": 1,
    "packId": "srd-5.1",
    "id": "srd51-scrollscribing-spell-scroll-level-9",
    "name": "9th-Level Spell",
    "description": "",
    "category": "scrollscribing",
    "kind": "crafting",
    "tags": [
      "scrollscribing",
      "legendary",
      "spell-scroll"
    ],
    "source": {
      "title": "Kibbles' Compendium of Craft and Creation",
      "version": "1.1.3",
      "page": 271,
      "craftingTime": "24 hours (3 days)",
      "checks": "12",
      "difficulty": "DC 20",
      "value": "40,000 gp",
      "materialsText": "1 legendary essence 1 legendary magical ink 1 legendary parchment"
    },
    "craft": {
      "tool": "Calligrapher's Supplies",
      "ability": "Intelligence",
      "skill": null,
      "dc": 20,
      "noToolDc": 25,
      "hoursRequired": 24
    },
    "requirementGroups": [
      {
        "id": "default",
        "requirements": [
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "rarity": "legendary",
              "category": "essences"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-magical-ink"
            }
          },
          {
            "quantity": 1,
            "sameMaterial": false,
            "match": {
              "materialId": "legendary-parchment"
            }
          }
        ]
      }
    ],
    "output": {
      "type": "catalog-item",
      "quantity": 1,
      "label": "9th-Level Spell",
      "img": "icons/sundries/scrolls/scroll-bound-sealed-red.webp",
      "rarity": "legendary",
      "valueGp": 40000.0,
      "itemType": "loot"
    }
  }
];
