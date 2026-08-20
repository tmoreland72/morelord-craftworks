import { AwardChatCardService } from "../core/award-chat-card-service.mjs";

export class MaterialService {
  constructor({ registry, adapter, recipientResolver }) {
    this.registry = registry;
    this.adapter = adapter;
    this.recipientResolver = recipientResolver;
  }

  async getRecipient(fallbackActor = null, options = {}) {
    return this.recipientResolver.resolve(fallbackActor, options);
  }

  async getPartyRecipientInfo() {
    return this.recipientResolver.describe();
  }

  async award(
    actor,
    materialId,
    quantity = 1,
    { postChatCard = true, preferPartyRecipient = false } = {}
  ) {
    const source = await this.registry.resolveItem(materialId);
    if (!source) throw new Error(`Unknown Craftworks material '${materialId}'.`);

    const recipient = await this.getRecipient(actor, {
      preferParty: preferPartyRecipient
    });
    if (!recipient) throw new Error("No recipient Actor is available for this Craftworks material.");

    const item = await this.adapter.addItemToActor(
      recipient,
      source,
      quantity
    );

    if (postChatCard) {
      await AwardChatCardService.post({
        recipient,
        items: [{
          document: source,
          uuid: source.uuid,
          quantity,
          rarity: source.system?.rarity
        }],
        title: "Material Received"
      });
    }

    return { item, recipient };
  }
}
