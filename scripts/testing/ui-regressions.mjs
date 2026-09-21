import { runInGameTests, assert } from "../../../morelord-core/scripts/testing/in-game.js";
import { CustomRecipeEditorApp } from "../ui/custom-recipe-editor-app.mjs";

export async function runCraftworksUiTests({ onRendered = async () => {} } = {}) {
  return runInGameTests({ checks: [{ id: "craftworks.harvest-ui", async run() {
    const render = foundry.applications.handlebars.renderTemplate;
    const longName = "Spell Scroll (Cantrip or 1st Level) with an exceptionally long recipe name";
    const harvest = await render("modules/morelord-craftworks/templates/harvest-player.hbs", {
      actor: {name:"UI fixture"}, creatures: [{ name:"Fixture", displayComponents:[{materialId:"fixture",componentName:"Fixture material",neededForCrafting:true,visibleRecipes:[{name:longName,available:2,required:4}]}]}]
    });
    const selection = await render("modules/morelord-craftworks/templates/harvest-prototype.hbs", {
      deadCreatures:[{name:"Fixture creature",tokenUuid:"fixture",img:"icons/svg/mystery-man.svg",cr:1,dc:8}]
    });
    let dialog;
    try {
      dialog = new foundry.applications.api.DialogV2({ window:{title:"Craftworks UI regression"}, classes:["ml-window","ml-craftworks","ml-craftworks-harvest-modern"], position:{width:800,height:700}, content:`<div>${harvest}${selection}</div>`, buttons:[{action:"close",label:"Close"}] });
      await dialog.render({force:true});
      const badge = dialog.element.querySelector(".ml-craftworks-harvest-recipe-tag");
      const label = badge?.querySelector(".ml-badge__label");
      const value = badge?.querySelector(".ml-badge__value");
      assert(label && value, "Recipe pills must separate the name from the amount.");
      assert(label.textContent === longName && badge.title.includes(longName), "Full recipe name must remain available on hover.");
      assert(label.scrollWidth > label.clientWidth && getComputedStyle(label).textOverflow === "ellipsis", "Long recipe names must truncate with an ellipsis.");
      assert(value.textContent === "2/4" && value.getBoundingClientRect().right <= badge.getBoundingClientRect().right, "The complete quantity must remain inside the pill.");
      const checkbox = dialog.element.querySelector("[data-harvest-creature-select]");
      const row = checkbox?.closest(".ml-actor-choice");
      assert(row?.tagName === "LABEL", "Harvest must use the same whole-row Core choice label as Loot.");
      let changes = 0;
      checkbox.addEventListener("change",()=>changes++);
      for (const target of [row.querySelector("strong"),row.querySelector("img"),row,checkbox]) {
        const before = checkbox.checked;
        target.click();
        assert(checkbox.checked !== before, "Every part of the creature row must toggle selection.");
      }
      assert(changes === 4, "Each click must toggle exactly once.");
      await onRendered(dialog,"harvest");
      dialog.setPosition({width:460});
      await onRendered(dialog,"harvest-compact");
      assert(value.getBoundingClientRect().right <= badge.getBoundingClientRect().right, "Compact pills must preserve quantities.");
    } finally { await dialog?.close(); }
  } }, { id:"craftworks.drakkenheim-callout", async run() {
    const app = new CustomRecipeEditorApp(game.modules.get("morelord-craftworks").api,{drakkenheim:true});
    try {
      await app.render({force:true});
      const section = [...app.element.querySelectorAll("section")].find(el=>el.querySelector("h2")?.textContent === "Crafting Check");
      assert(section?.querySelector(".ml-callout")?.textContent.includes("No skill check or crafting time"), "Drakkenheim must explain its exemption in a Core callout.");
      assert(section.querySelector(".ml-section-heading p").textContent === "Check requirements for this recipe.", "The subtitle must describe the section.");
      assert(!section.querySelector('[name="dc"]'), "Drakkenheim must not request a check DC.");
      await onRendered(app,"editor");
    } finally { await app.close(); }
  } }] });
}
