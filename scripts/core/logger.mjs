import { MODULE_TITLE } from "../constants.mjs";

export const log = (...args) => console.log(`${MODULE_TITLE} |`, ...args);
export const warn = (...args) => console.warn(`${MODULE_TITLE} |`, ...args);
export const error = (...args) => console.error(`${MODULE_TITLE} |`, ...args);
