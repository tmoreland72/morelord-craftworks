import { assertSectionText } from "../../../morelord-core/scripts/testing/helper-text.js";

export const helperTextCheck = {
  id: "morelord-craftworks.helper-text",
  async run() {
    const render = foundry.applications.handlebars.renderTemplate;
    for (const name of ["craftworks-settings", "custom-recipe-editor", "hoard-gm", "harvest-prototype"]) {
      const html = await render(`modules/morelord-craftworks/templates/${name}.hbs`, { settings: { dc: {} }, access: {}, core: {}, packs: [], isPlanning: true, deadCreatures: [{ id: "fixture", name: "Fixture creature" }] });
      assertSectionText(html, '.ml-app p');
    }
  }
};
