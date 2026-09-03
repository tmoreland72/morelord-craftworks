export const CRAFTWORKS_DOCUMENTATION = Object.freeze({
  id: "morelord-craftworks",
  title: "Morelord Craftworks",
  subtitle: "Materials, recipes, acquisition, and persistent crafting workflows for the Morelord suite.",
  icon: "fa-solid fa-hammer",
  sections: [
    { id: "overview", title: "Overview", icon: "fa-solid fa-compass", introduction: "Craftworks connects acquired materials to recipes and persistent projects that turn them into useful items.", bullets: [
      "Players browse materials and recipes, mark crafting goals, and work on persistent jobs.",
      "GMs run Harvest, Gather, Loot, Hoard, and supported setting-specific acquisition workflows.",
      "Materials are normal dnd5e Items stored on a character or eligible shared Group actor.",
      "Content Packs control active catalogs; premium content also requires its entitlement and supported source module."
    ] },
    { id: "crafting", title: "Crafting", icon: "fa-solid fa-hammer", introduction: "The Craft workspace combines marked recipes and active jobs for the selected crafter.", bullets: [
      "The Crafter supplies tools, proficiency, and checks; the selected Inventory supplies ingredients and receives the output.",
      "Eligible Group actors can provide shared inventory when the crafter is a member.",
      "Jobs retain progress. Failed checks spend time but do not consume additional recipe materials.",
      "Recipes can require a Core Location capability such as a forge. Projects pause while the facility is unavailable and resume when it returns.",
      "Focused Craft windows open directly to one recipe, including projects launched from Morelord Downtime."
    ] },
    { id: "harvest", title: "Harvest", icon: "fa-solid fa-skull", introduction: "Harvest creates a synchronized component-claim session from defeated creatures on the current scene.", steps: [
      { title: "Prepare", body: "Select defeated creatures and participating characters. Defaults follow the primary party, then player-owned characters; the last successful selection is remembered." },
      { title: "Choose checks", body: "The session-wide Skip Skill Checks option sends every included character directly to component choices." },
      { title: "Resolve", body: "Each selected connected character receives independent roll state and claims, including multiple characters controlled by one user." },
      { title: "Finalize", body: "Claims reserve components. Finalizing awards them to resolved recipients and posts the outcome." }
    ], callouts: [{ tone: "info", icon: "fa-solid fa-window-restore", title: "Stable working view", body: "Claimed creatures remain expanded unless manually collapsed, preventing list jumps during large harvests." }] },
    { id: "acquisition", title: "Gather, Loot, and Hoards", icon: "fa-solid fa-seedling", bullets: [
      "Gather uses the same party-priority picker as Harvest and gives each selected connected character an independent scene-tracked terrain opportunity, including multiple characters owned by one user.",
      "Loot generates encounter materials, currency, and special treasure using configured acquisition rules.",
      "Hoard builds a larger lair, vault, or cache reward for a character or Group recipient.",
      "Delerium Search appears when its supported content and access are available."
    ] },
    { id: "content", title: "Content and Sources", icon: "fa-solid fa-books", bullets: [
      "Standard Craftworks and SRD catalogs work without premium content. Source filtering respects dnd5e Configure Sources.",
      "When entitled and enabled, PHB and DMG documents are preferred over SRD fallbacks.",
      "Monsters of Drakkenheim adds material families, creature-specific components, special instructions, and recipes, including Appendix E SRD recipes.",
      "Enhanced armor, shield, and weapon recipes create the generic +1, +2, or +3 item; the GM configures its final equipment form.",
      "Craftworks Settings manages access, Content Packs, acquisition rules, and compendium synchronization."
    ] },
    { id: "generators", title: "Item Generators", icon: "fa-solid fa-wand-magic-sparkles", introduction: "Entitled GMs can generate, review, reroll, and award source-aware potions, spell scrolls, and spellbooks. Responsive quantity grids include visible up/down controls. Potion and scroll drafts can also be displayed in chat without awarding Items, which is useful for shops and public offers." },
    { id: "troubleshooting", title: "Troubleshooting", icon: "fa-solid fa-life-ring", bullets: [
      "For missing content, confirm the Content Pack, entitlement, source module, and Configure Sources selection, then Sync with Compendiums.",
      "If a character receives no acquisition window, confirm the GM included it and a connected user has Owner permission.",
      "Offline included characters receive no window during the session.",
      "Harvest claims remain reservations until the GM finalizes the session.",
      "For paused crafting, inspect ingredient/tool status and the required Location facility."
    ] }
  ]
});
