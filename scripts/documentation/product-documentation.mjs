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
      "The Crafter supplies tools, proficiency, and checks. Players automatically combine their character and member Group inventories; GMs retain an explicit inventory selector.",
      "Ingredients can be split across personal and party inventories. Cancellation returns each ingredient to its original inventory.",
      "Jobs retain progress. Failed checks spend time but do not consume additional recipe materials. Tool checks keep the recipe DC and have disadvantage when the crafter lacks the tool or proficiency. Drakkenheim recipes require materials and a Workshop of the item’s rarity or higher, independent of tool settings. Choose Craft Item to complete them without a roll or tracked crafting time. Every catalog filter shows its count.",
      "Settings configures required Core Location activities by artisan tool. Recipe cards show the item-rarity minimum; higher-tier facilities also qualify. Projects pause while the facility is unavailable and resume when it returns.",
      "The recipe editor starts with Item to Be Crafted. Required groups combine with AND; material choices within each group combine with OR. Focused Craft windows open directly to one recipe, including projects launched from Morelord Downtime."
    ] },
    { id: "harvest", title: "Harvest", icon: "fa-solid fa-skull", introduction: "Harvest creates a synchronized component-claim session from defeated creatures on the current scene.", steps: [
      { title: "Prepare", body: "Select defeated creatures and participating characters. Defaults follow the primary party, then player-owned characters; the last successful selection is remembered." },
      { title: "Choose checks", body: "The session-wide Skip Skill Checks option sends every included character directly to component choices." },
      { title: "Resolve", body: "Each character receives independent roll state and claims. Connected players use their own windows; offline characters open on the GM’s client and can be reopened with Roll as GM." },
      { title: "Finalize", body: "Claims reserve components. Finalizing awards them to resolved recipients and posts the outcome." }
    ], callouts: [{ tone: "info", icon: "fa-solid fa-window-restore", title: "Stable working view", body: "Claimed creatures remain expanded unless manually collapsed, preventing list jumps during large harvests." }] },
    { id: "acquisition", title: "Gather, Loot, and Hoards", icon: "fa-solid fa-seedling", bullets: [
      "Gather uses the same party-priority picker as Harvest and gives each selected character an independent scene-tracked terrain opportunity. The GM can roll for offline characters.",
      "Loot generates encounter materials, currency, and special treasure using configured acquisition rules.",
      "Hoard builds a larger lair, vault, or cache reward for a character or Group recipient.",
      "Delerium Search uses Arcana, Investigation, or Survival. Save as Default remembers the search area and selected characters. Rewards accumulate: 3 successes earn 3d6 chips, 4 also earn 1d6 fragments, and 5 or more also earn a shard. Finalize the search, choose a character or party Recipient, then Roll & Award All Delerium using original Monsters of Drakkenheim items. The Party Finds dice buttons are reference rolls; the award rolls its own quantities."
    ] },
    { id: "content", title: "Content and Sources", icon: "fa-solid fa-books", bullets: [
      "Standard Craftworks and SRD catalogs work without premium content. Source filtering respects dnd5e Configure Sources.",
      "When entitled and enabled, PHB and DMG documents are preferred over SRD fallbacks.",
      "Monsters of Drakkenheim adds material families, creature-specific components, special instructions, and recipes, including Appendix E SRD recipes.",
      "Enhanced armor, shield, and weapon recipes create the generic +1, +2, or +3 item; the GM configures its final equipment form.",
      "Craftworks Settings manages access, Content Packs, acquisition rules, and compendium synchronization."
    ] },
    { id: "generators", title: "Item Generators", icon: "fa-solid fa-wand-magic-sparkles", introduction: "Entitled GMs can generate, review, reroll, and award source-aware potions, spell scrolls, and spellbooks. Responsive quantity grids include visible up/down controls. Available counts update when categories or schools change. Potion and scroll drafts support removing individual entries and adding entries with the full catalog picker, including source, level or rarity, and school or category filters. Each result defaults to quantity one; change Quantity to share or award multiple copies. Each result defaults to quantity one; change Quantity to share or award multiple copies. Reroll replaces edits; sharing and awarding use the edited draft. Potion and scroll drafts can also be displayed in chat without awarding Items, which is useful for shops and public offers." },
    { id: "troubleshooting", title: "Troubleshooting", icon: "fa-solid fa-life-ring", bullets: [
      "For missing content, confirm the Content Pack, entitlement, source module, and Configure Sources selection, then Sync with Compendiums.",
      "If a character receives no acquisition window, confirm the GM included it and a connected user has Owner permission.",
      "For offline characters, use Roll as GM to open their character-specific Harvest or Gather window.",
      "Harvest claims remain reservations until the GM finalizes the session.",
      "For paused crafting, inspect ingredient/tool status and the required Location facility."
    ] }
  ]
});
