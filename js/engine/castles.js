// Monster castles: checking the data, and which castles have been conquered. Conquered castles
// belong to the world, so they're saved with it and last across every hero:
// [{ place, hero, age }], oldest first. A castle is played room by room like a dungeon (see
// dungeons.js and life.js).
import { castleSettings } from '../../data/castles.js';
import { places, regions } from '../../data/regions.js';
import { sweetDreams } from '../../data/story.js';
import { monsters } from '../../data/monsters.js';

// Check the data once at startup, so a typo shows a clear message.
for (const place of places.filter((option) => option.kind === 'castle')) {
  const owner = `The castle "${place.name}" in data/regions.js`;
  const boss = monsters.find((kind) => kind.name === place.boss);
  if (!boss) throw new Error(`${owner} is held by "${place.boss}", which isn't in data/monsters.js.`);
  if (!boss.boss) throw new Error(`${owner} is held by "${place.boss}", which needs boss: true in data/monsters.js.`);
  if (place.rooms && !(place.rooms[0] >= 1 && place.rooms[1] >= place.rooms[0])) throw new Error(`${owner} needs rooms like [5, 7].`);
}

export function isConquered(world, placeName) {
  return world.conquered.some((entry) => entry.place === placeName);
}

// Who conquered a castle: { place, hero, age }, or null while its boss still holds it.
export function conquestOf(world, placeName) {
  return world.conquered.find((entry) => entry.place === placeName) ?? null;
}

// A castle's boss as named in a sentence: "Old Grizzlewick", or "the Glutton Lord".
export function bossTitle(place) {
  const boss = monsters.find((kind) => kind.name === place.boss);
  return boss.properName ? boss.name : `the ${boss.name}`;
}

// The castle's banner goes up, for good.
export function conquer(world, place, hero) {
  if (isConquered(world, place.name)) return;
  world.conquered.push({ place: place.name, hero: hero.name, age: hero.age });
}

// How much weaker each region's monsters are, now its castle has fallen: { tailwoods: 0.1 }.
// Once the dragon sleeps peacefully (Act 4), every region is calmer still (see story.js).
export function regionCalm(world) {
  const calm = {};
  for (const entry of world.conquered) {
    const place = places.find((option) => option.name === entry.place);
    if (place) calm[place.region] = castleSettings.calm;
  }
  if (world.finale) {
    for (const region of Object.keys(regions)) calm[region] = (calm[region] ?? 0) + sweetDreams.calm;
  }
  return calm;
}

// Conquered castles read from the save. Castles since removed from the data are dropped.
export function loadConquered(saved = []) {
  return saved.filter((entry) => places.some((place) => place.kind === 'castle' && place.name === entry.place));
}
