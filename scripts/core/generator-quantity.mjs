export function generatorQuantity(value = 1) {
  const quantity = Number(value);
  if (!Number.isSafeInteger(quantity) || quantity < 1) throw new Error("Quantity must be a positive whole number.");
  return quantity;
}
