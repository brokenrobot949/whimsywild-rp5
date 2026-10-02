// Gear: making items, comparing them, and pricing them.
import { slots, rarities, baseItems, statWorth, statNames, itemGrowth, loot } from '../../data/items.js';
import { treasures } from '../../data/treasures.js';
import { withArticle } from './text.js';

// Stats that grow with the item's level. Speed and luck grow only with rarity.
const GROWING_STATS = ['maxHp', 'power', 'defense'];

// Check the item data once at startup, so a typo shows a clear message.
for (const base of baseItems) {
  if (!slots.some((slot) => slot.id === base.slot)) {
    throw new Error(`The item "${base.name}" has the slot "${base.slot}", which isn't one of the slots in data/items.js.`);
  }
  for (const stat of Object.keys(base.stats)) {
    if (!(stat in statWorth)) {
      throw new Error(`The item "${base.name}" has the stat "${stat}". Stats must be one of: ${Object.keys(statWorth).join(', ')}.`);
    }
  }
}
for (const slot of slots) {
  if (!baseItems.some((base) => base.slot === slot.id)) throw new Error(`data/items.js has no items for the ${slot.name} slot.`);
}
for (const rarity of rarities) {
  if ((rarity.dropWeight > 0 || rarity.shopWeight > 0) && !rarity.prefixes?.length) {
    throw new Error(`The rarity "${rarity.name}" in data/items.js can drop or be sold, so it needs some prefixes.`);
  }
}

// Makes a random item of the given level. `slot` picks the slot (any if left out).
// The rarity is either given (like 'common'), or drawn using `weightKey`:
// 'dropWeight' for monster drops, 'shopWeight' for shops.
export function createItem(rng, level, { slot, weightKey, rarity: rarityId }) {
  const rarity = rarityId ? rarities.find((option) => option.id === rarityId) : rng.pickWeighted(rarities, (option) => option[weightKey]);
  const base = rng.pick(slot ? baseItems.filter((option) => option.slot === slot) : baseItems);
  const growth = 1 + itemGrowth * (level - 1);
  const stats = {};
  for (const [stat, amount] of Object.entries(base.stats)) {
    stats[stat] = amount * rarity.strength * (GROWING_STATS.includes(stat) ? growth : 1);
  }
  return {
    name: `${rng.pick(rarity.prefixes)} ${base.name}`,
    baseName: base.name,
    slot: base.slot,
    tag: base.tag,
    rarity: rarity.id,
    level,
    stats,
  };
}

// A treasure (see data/treasures.js) made at the given level: as strong as any item of the
// Treasure rarity, with its own name and effects. `treasure` keeps its id, so it stays one of a kind.
export function createTreasure(treasure, level) {
  const rarity = rarities.find((option) => option.id === 'treasure');
  const growth = 1 + itemGrowth * (level - 1);
  const stats = {};
  for (const [stat, amount] of Object.entries(treasure.stats)) {
    stats[stat] = amount * rarity.strength * (GROWING_STATS.includes(stat) ? growth : 1);
  }
  return {
    name: treasure.name,
    baseName: treasure.name,
    slot: treasure.slot,
    tag: treasure.tag,
    rarity: rarity.id,
    level,
    stats,
    effects: structuredClone(treasure.effects ?? {}),
    treasure: treasure.id,
  };
}

// The same item remade at another level, as heirlooms are for the hero who finds them:
// same name and rarity, with HP, power and defense grown (or shrunk) to suit the new level.
export function scaleItem(item, level) {
  const change = (1 + itemGrowth * (level - 1)) / (1 + itemGrowth * (item.level - 1));
  const stats = {};
  for (const [stat, amount] of Object.entries(item.stats)) stats[stat] = amount * (GROWING_STATS.includes(stat) ? change : 1);
  return { ...item, level, stats };
}

export function rarityOf(item) {
  return rarities.find((rarity) => rarity.id === item.rarity);
}

// How good an item is, for comparing it with what the hero already wears. (Treasures count for
// more than their stats, so heroes hold on to them.)
export function itemWorth(item) {
  const worth = Object.entries(item.stats).reduce((sum, [stat, amount]) => sum + amount * statWorth[stat], 0);
  return worth * (rarityOf(item)?.keepWorth ?? 1);
}

export function itemPrice(item) {
  return Math.max(1, Math.round(itemWorth(item) * loot.priceFactor));
}

export function sellValue(item) {
  return Math.round(itemPrice(item) * loot.sellShare);
}

// Words for filling in lines: {a} "a Mildly Enchanted Cudgel", {the} "the Mildly Enchanted Cudgel".
// A treasure goes by its own name: {a} and {the} are both "the Bottomless Spoon".
export function itemWords(item) {
  const treasure = item.treasure && treasures.find((option) => option.id === item.treasure && option.name === item.name);
  if (treasure) return { a: treasure.logName, the: treasure.logName };
  return { a: withArticle(item.name), the: `the ${item.name}` };
}

// "+4.1 power, +1 luck"
export function itemStatsText(item) {
  return Object.entries(item.stats)
    .map(([stat, amount]) => `+${Number(amount.toFixed(1))} ${statNames[stat] ?? stat}`)
    .join(', ');
}

// "Mildly Enchanted Cudgel (Uncommon, level 4): +4.1 power"
export function describeItem(item) {
  return `${item.name} (${rarityOf(item).name}, level ${item.level}): ${itemStatsText(item)}`;
}
