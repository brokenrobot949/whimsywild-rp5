// A hero's background: the origin and quirk they're rolled with.
// A quirk's effects are added up with the hero's other effects in skills.js.
import { origins } from '../../data/origins.js';
import { quirks } from '../../data/quirks.js';
import { tags } from '../../data/skills.js';
import { slots, statWorth } from '../../data/items.js';
import { scaleItem } from './items.js';

const TAG_IDS = tags.map((tag) => tag.id);

// Check the data once at startup, so a typo shows a clear message.
for (const [list, file] of [[origins, 'origins'], [quirks, 'quirks']]) {
  const ids = new Set();
  for (const entry of list) {
    if (!entry.id || ids.has(entry.id)) throw new Error(`"${entry.name}" in data/${file}.js needs an id that no other entry uses.`);
    ids.add(entry.id);
  }
}
for (const origin of origins) {
  const owner = `The origin "${origin.name}" in data/origins.js`;
  if (!TAG_IDS.includes(origin.tag)) throw new Error(`${owner} has the tag "${origin.tag}". Tags must be one of: ${TAG_IDS.join(', ')}.`);
  const { item } = origin;
  if (!item?.name || !slots.some((slot) => slot.id === item.slot)) {
    throw new Error(`${owner} needs an item with a name and a slot: one of ${slots.map((slot) => slot.id).join(', ')}.`);
  }
  for (const stat of Object.keys(item.stats ?? {})) {
    if (!(stat in statWorth)) throw new Error(`${owner} gives an item with the stat "${stat}". Stats must be one of: ${Object.keys(statWorth).join(', ')}.`);
  }
}

// Rolls an origin and a quirk.
export function rollBackground(rng) {
  return { origin: rng.pick(origins).id, quirk: rng.pick(quirks).id };
}

export function originById(id) {
  return origins.find((origin) => origin.id === id) ?? null;
}

// The origin's starting item, made at the given level. It's a Common item.
export function originItem(origin, level) {
  const { name, slot, stats } = origin.item;
  const item = { name, baseName: name, slot, tag: origin.tag, rarity: 'common', level: 1, stats: { ...stats } };
  return scaleItem(item, level);
}
