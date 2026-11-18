import { assert } from "../../../morelord-core/scripts/testing/in-game.js";
import { SpecialTreasureService } from "../acquisition/special-treasure-service.mjs";

// Read-only: fresh service forces real compendium index requests without awarding Items.
export const specialTreasureCheck = {
  id: "morelord-craftworks.special-treasure-index",
  async run() {
    const service = new SpecialTreasureService();
    const status = await service.sourceStatus();
    assert(status.total > 0, "Expected magic items in the enabled Item compendiums; check Configure Sources.");
    const result = await service.rollForEncounter(13);
    assert(result.status === "item", result.detail ?? "Special treasure did not resolve an Item.");
    assert(game.modules.get("morelord-core").api.sources.isUuidAllowed(result.itemUuid),
      "Special treasure selected a disabled source.");
  }
};
