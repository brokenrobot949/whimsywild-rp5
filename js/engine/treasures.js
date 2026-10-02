// Treasures: one-of-a-kind items with names of their own (see data/treasures.js). Making them is
// in items.js; finding them is in life.js.
import { treasures, treasureText } from '../../data/treasures.js';
import { slots, statWorth } from '../../data/items.js';
import { tags } from '../../data/skills.js';
import { places, regions } from '../../data/regions.js';
import { events } from '../../data/events.js';
import { checkEffects } from './skills.js';
import { isSealed } from './story.js';
import { fill } from './text.js';

// Check the data once at startup, so a typo shows a clear message.
const seen = new Set();
for (const treasure of treasures) {
  const owner = `The treasure "${treasure.name ?? treasure.id}" in data/treasures.js`;
  if (!treasure.id || seen.has(treasure.id)) throw new Error(`${owner} needs an id that no other treasure uses.`);
  seen.add(treasure.id);
  if (!treasure.name || !treasure.logName || !treasure.flavor) throw new Error(`${owner} needs a name, a logName and a flavor line.`);
  if (!slots.some((slot) => slot.id === treasure.slot)) throw new Error(`${owner} has the slot "${treasure.slot}", which isn't one of the slots in data/items.js.`);
  if (!tags.some((tag) => tag.id === treasure.tag)) throw new Error(`${owner} has the tag "${treasure.tag}". Tags must be one of: ${tags.map((tag) => tag.id).join(', ')}.`);
  for (const stat of Object.keys(treasure.stats ?? {})) {
    if (!(stat in statWorth)) throw new Error(`${owner} has the stat "${stat}". Stats must be one of: ${Object.keys(statWorth).join(', ')}.`);
  }
  checkEffects(treasure.effects ?? {}, owner);
  const { castle, dungeon, event } = treasure.from ?? {};
  const place = places.find((option) => option.name === (castle ?? dungeon));
  if (castle && place?.kind !== 'castle') throw new Error(`${owner} is from the castle "${castle}", which isn't a castle in data/regions.js.`);
  if (dungeon && place?.kind !== 'dungeon') throw new Error(`${owner} is from the dungeon "${dungeon}", which isn't a dungeon in data/regions.js.`);
  if (event && !events.some((option) => option.id === event)) throw new Error(`${owner} is from the event "${event}", which isn't in data/events.js.`);
  if (!castle && !dungeon && !event) throw new Error(`${owner} needs a "from": a castle, a dungeon or an event.`);
}

export function treasureById(id) {
  return treasures.find((treasure) => treasure.id === id) ?? null;
}

// The treasure a castle's lord guards, or a dungeon hides, if any.
export function treasureAt(place) {
  return treasures.find((treasure) => treasure.from.castle === place.name || treasure.from.dungeon === place.name) ?? null;
}

// Whether the hero already wears this treasure (so they can't find a second one).
export function carriesTreasure(hero, id) {
  return Object.values(hero.gear).some((item) => item?.treasure === id);
}

// Where to look for a treasure no hero has found yet, for the Chronicle. A region still under
// the mist keeps its name secret.
export function treasureHint(treasure, world) {
  const { castle, dungeon, event } = treasure.from;
  const how = castle ? 'castle' : dungeon ? 'dungeon' : 'event';
  const regionId = event
    ? events.find((option) => option.id === event)?.regions?.[0]
    : places.find((place) => place.name === (castle ?? dungeon))?.region;
  if (!regionId) return treasureText.hints.anywhere;
  const name = isSealed(world, regionId) ? treasureText.secretRegion : regions[regionId].name.replace(/^The /, 'the ');
  return fill(treasureText.hints[how], { region: name });
}
