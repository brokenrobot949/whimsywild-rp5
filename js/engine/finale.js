// The finale: when the way into the Deepest Nightmare is open, and the rooms inside. What
// happens in each room is worked out in life.js; the ending's scroll of heroes is in ui.js.
// Once the song is sung, `world.finale` records who sang it: { hero, epithet, age }.
import { finaleSettings } from '../../data/finale.js';
import { places, regions } from '../../data/regions.js';
import { monsters } from '../../data/monsters.js';
import { verses } from '../../data/verses.js';

// Check the data once at startup, so a typo shows a clear message.
const FILE = 'data/finale.js';
if (!places.some((place) => place.name === finaleSettings.entrance)) {
  throw new Error(`The entrance "${finaleSettings.entrance}" in ${FILE} isn't a place in data/regions.js.`);
}
for (const region of finaleSettings.dreams) {
  if (!regions[region]) throw new Error(`${FILE} has a dream of the region "${region}", which isn't in data/regions.js.`);
}
if (!monsters.some((kind) => kind.name === finaleSettings.nightmare && kind.song)) {
  throw new Error(`The nightmare "${finaleSettings.nightmare}" in ${FILE} needs to be a monster in data/monsters.js with song: true.`);
}

// True once every verse has been found, until the song has been sung.
export function isFinaleOpen(world) {
  return !world.finale && verses.every((verse) => world.verses.some((found) => found.id === verse.id));
}

// True for the place the way in opens from, while it's open.
export function isFinaleEntrance(world, place) {
  return place.name === finaleSettings.entrance && isFinaleOpen(world);
}

// The rooms of the Nightmare: a dream from each region, then the song.
export function nightmareRooms() {
  return [...finaleSettings.dreams.map((region) => `dream-${region}`), 'song'];
}

// The region a dream room belongs to ('dream-tailwoods' → 'tailwoods'), or null.
export function dreamRegion(room) {
  return room.startsWith('dream-') ? room.slice('dream-'.length) : null;
}
