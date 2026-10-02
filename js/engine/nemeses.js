// Nemeses: monsters that felled a hero, remembered by name (see data/nemeses.js). They belong to
// the world, so they're saved with it: [{ id, name, kind, region, lair, level, victims, avengedBy }],
// where `kind` is the monster's name in monsters.js, `lair` the landmark it haunts, `victims` the
// full names of the heroes it felled (first one first), and `avengedBy` the hero who defeated it.
import { nemesisSettings, nemesisNames, nemesisText } from '../../data/nemeses.js';
import { monsters } from '../../data/monsters.js';
import { regions } from '../../data/regions.js';
import { finaleSettings } from '../../data/finale.js';
import { fill } from './text.js';

// Check the data once at startup, so a typo shows a clear message.
if (nemesisNames.length === 0) throw new Error('data/nemeses.js needs at least one name in nemesisNames.');

// "Honkwell the Indignant Goose"
export function nemesisTitle(nemesis) {
  return fill(nemesisText.title, { name: nemesis.name, kind: nemesis.kind });
}

// The nemesis haunting a region, if any (each region has at most one at a time).
export function nemesisIn(world, regionId) {
  return world.nemeses.find((nemesis) => !nemesis.avengedBy && nemesis.region === regionId) ?? null;
}

// The nemesis whose lair is at a place, if any.
export function nemesisAt(world, placeName) {
  return world.nemeses.find((nemesis) => !nemesis.avengedBy && nemesis.lair === placeName) ?? null;
}

export function nemesisById(world, id) {
  return world.nemeses.find((nemesis) => nemesis.id === id) ?? null;
}

// The first name of the first hero it felled: "Maude".
export function firstVictim(nemesis) {
  return nemesis.victims[0].split(' ')[0];
}

// Everyone it felled, by first name: "Maude, Wendel and Agnes".
export function victimList(nemesis) {
  const names = nemesis.victims.map((name) => name.split(' ')[0]);
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')}${nemesisText.and}${names.at(-1)}`;
}

// When a monster fells a hero: a nemesis grows stronger, and an ordinary monster may become one
// (if its region has no nemesis yet). Returns { nemesis, born } or null.
export function rememberKiller(world, rng, monster, hero, regionId) {
  if (monster.nemesis) {
    const nemesis = nemesisById(world, monster.nemesis);
    if (!nemesis) return null;
    nemesis.level += nemesisSettings.growth;
    nemesis.victims.push(hero.name);
    return { nemesis, born: false };
  }
  if (monster.kind.boss || !regionId || !regions[regionId] || nemesisIn(world, regionId)) return null;
  if (!rng.chance(nemesisSettings.chance)) return null;
  // Its lair: the nearest landmark in the region (never the way into the finale).
  const landmarks = world.places.filter((place) => place.kind === 'landmark' && place.region === regionId
    && place.name !== finaleSettings.entrance);
  if (landmarks.length === 0) return null;
  const lair = landmarks.reduce((best, place) => (Math.hypot(place.x - hero.x, place.y - hero.y)
    < Math.hypot(best.x - hero.x, best.y - hero.y) ? place : best));
  const taken = new Set(world.nemeses.filter((other) => !other.avengedBy).map((other) => other.name));
  const free = nemesisNames.filter((name) => !taken.has(name));
  const nemesis = {
    id: Math.max(0, ...world.nemeses.map((other) => other.id)) + 1,
    name: rng.pick(free.length > 0 ? free : nemesisNames),
    kind: monster.kind.name,
    region: regionId,
    lair: lair.name,
    level: monster.level + nemesisSettings.levels,
    victims: [hero.name],
    avengedBy: null,
  };
  world.nemeses.push(nemesis);
  return { nemesis, born: true };
}

// A nemesis is defeated, for good. Only the most recent few avenged nemeses are remembered.
export function markAvenged(world, nemesis, hero) {
  nemesis.avengedBy = hero.name;
  const avenged = world.nemeses.filter((other) => other.avengedBy);
  const forgotten = avenged.slice(0, Math.max(0, avenged.length - nemesisSettings.keepAvenged));
  world.nemeses = world.nemeses.filter((other) => !forgotten.includes(other));
}

// Nemeses read from the save. Any whose monster or lair has since been removed are dropped.
export function loadNemeses(saved = [], places = []) {
  return saved.filter((nemesis) => monsters.some((kind) => kind.name === nemesis.kind)
    && places.some((place) => place.name === nemesis.lair) && Array.isArray(nemesis.victims) && nemesis.victims.length > 0);
}
