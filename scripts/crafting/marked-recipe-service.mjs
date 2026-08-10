import { MODULE_ID } from "../constants.mjs";

const FLAG_KEY = "markedRecipes";

export class MarkedRecipeService {
  list(crafter) {
    if (!crafter) return [];

    const raw =
      crafter.flags?.[MODULE_ID]?.[FLAG_KEY];

    return Array.from(
      new Set(
        Array.isArray(raw)
          ? raw.map(String).filter(Boolean)
          : []
      )
    );
  }

  has(crafter, recipeId) {
    return this.list(crafter)
      .includes(String(recipeId));
  }

  async set(crafter, recipeId, marked) {
    if (!crafter) {
      throw new Error(
        "A crafter character is required to mark recipes."
      );
    }

    const recipeIds = new Set(this.list(crafter));
    const id = String(recipeId);

    if (marked) recipeIds.add(id);
    else recipeIds.delete(id);

    const next = [...recipeIds].sort();

    await crafter.setFlag(
      MODULE_ID,
      FLAG_KEY,
      next
    );

    return next;
  }

  async toggle(crafter, recipeId) {
    const marked = !this.has(crafter, recipeId);
    await this.set(crafter, recipeId, marked);
    return marked;
  }
}
