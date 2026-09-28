// Dungeons, castles and the finale's Nightmare: checking the data, and planning the rooms of
// each visit. All three are played the same way, each with its own settings (data/dungeons.js,
// data/castles.js and data/finale.js). What happens in each room is worked out in life.js, and
// the panel that shows the rooms is in ui.js.
import { dungeonSettings } from '../../data/dungeons.js';
import { castleSettings } from '../../data/castles.js';
import { finaleSettings } from '../../data/finale.js';
import { nightmareRooms } from './finale.js';
import { places } from '../../data/regions.js';
import { monsters } from '../../data/monsters.js';
import { rarities } from '../../data/items.js';

const ROOM_KINDS = ['fight', 'treasure', 'event', 'rest'];

// Check the data once at startup, so a typo shows a clear message.
for (const [file, settings] of [['data/dungeons.js', dungeonSettings], ['data/castles.js', castleSettings]]) {
  for (const kind of Object.keys(settings.roomWeights)) {
    if (!ROOM_KINDS.includes(kind)) throw new Error(`${file} has the room "${kind}" in roomWeights. Rooms must be one of: ${ROOM_KINDS.join(', ')}.`);
  }
  for (const rarity of Object.keys(settings.prizeRarities)) {
    if (!rarities.some((option) => option.id === rarity)) throw new Error(`${file} has the rarity "${rarity}" in prizeRarities, which isn't in data/items.js.`);
  }
}
for (const place of places.filter((option) => option.kind === 'dungeon')) {
  const owner = `The dungeon "${place.name}" in data/regions.js`;
  const guardian = monsters.find((kind) => kind.name === place.guardian);
  if (!guardian) throw new Error(`${owner} is guarded by "${place.guardian}", which isn't in data/monsters.js.`);
  if (place.rooms && !(place.rooms[0] >= 1 && place.rooms[1] >= place.rooms[0])) throw new Error(`${owner} needs rooms like [3, 5].`);
}

// True for places explored room by room: dungeons and castles. (The finale's Nightmare is
// entered from a landmark; see finale.js.)
export function hasRooms(place) {
  return place.kind === 'dungeon' || place.kind === 'castle';
}

// What kind of visit this is: 'dungeon', 'castle' or 'nightmare'. (Saves from before the finale
// don't say, and were always the kind of their place.)
export function visitKind(visit) {
  return visit.kind ?? visit.place.kind;
}

// The settings for a kind of visit.
export function roomRules(kind) {
  if (kind === 'nightmare') return finaleSettings;
  return kind === 'castle' ? castleSettings : dungeonSettings;
}

// The rooms of one visit: a few random rooms, then the guardian (or boss), then the treasure.
// The Nightmare's rooms are always the same: a dream from each region, then the song.
export function planRooms(rng, place, kind = place.kind) {
  if (kind === 'nightmare') return nightmareRooms();
  const rules = roomRules(kind);
  const [fewest, most] = place.rooms ?? rules.rooms;
  const weights = rules.roomWeights;
  const kinds = Object.keys(weights);
  const rooms = Array.from({ length: rng.int(fewest, most) }, () => rng.pickWeighted(kinds, (room) => weights[room]));
  return [...rooms, 'guardian', 'prize'];
}

// The rarity of a dungeon's treasure, or a castle's hoard.
export function prizeRarity(rng, kind) {
  const weights = roomRules(kind).prizeRarities;
  return rng.pickWeighted(Object.keys(weights), (rarity) => weights[rarity]);
}
