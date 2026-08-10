import { SETTINGS, getSetting } from "../core/settings.mjs";

export function getHarvestDC(cr) {
  const base = cr >= 17 ? 15 : cr >= 11 ? 12 : cr >= 5 ? 10 : 8;
  return base + Number(getSetting(SETTINGS.HARVEST_DC_MODIFIER) ?? 0);
}

export function getHarvestChoiceCount() {
  let min = Number(getSetting(SETTINGS.HARVEST_CHOICES_MIN) ?? 3);
  let max = Number(getSetting(SETTINGS.HARVEST_CHOICES_MAX) ?? 6);
  min = Math.clamp(min, 3, 6);
  max = Math.clamp(max, 3, 6);
  if (max < min) [min, max] = [max, min];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
