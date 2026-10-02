// Epithets: working out which title a hero has earned from their deeds.
import { epithets, closeCallShare } from '../../data/epithets.js';
import { monsters } from '../../data/monsters.js';
import { places } from '../../data/regions.js';
import { rarities } from '../../data/items.js';

export { closeCallShare };

// Check the data once at startup, so a typo shows a clear message.
const KINDS = ['slain', 'slainTotal', 'closeCalls', 'potions', 'goldFound', 'visits', 'found', 'level', 'skillRank', 'respects', 'events', 'shards', 'dungeons', 'castles', 'verses', 'avenged', 'treasures', 'pets'];
for (const entry of epithets) {
  const owner = `The epithet "${entry.epithet}" in data/epithets.js`;
  const kind = Object.keys(entry.when).find((key) => KINDS.includes(key));
  if (!kind) throw new Error(`${owner} needs a "when" of one of: ${KINDS.join(', ')}.`);
  if (kind === 'slain' && !monsters.some((monster) => monster.name === entry.when.slain)) {
    throw new Error(`${owner} needs the monster "${entry.when.slain}", which isn't in data/monsters.js.`);
  }
  if (kind === 'visits' && !places.some((place) => place.name === entry.when.visits)) {
    throw new Error(`${owner} needs the place "${entry.when.visits}", which isn't in data/regions.js.`);
  }
  if (kind === 'found' && !rarities.some((rarity) => rarity.id === entry.when.found)) {
    throw new Error(`${owner} needs the rarity "${entry.when.found}", which isn't in data/items.js.`);
  }
}

// A fresh set of deed counters for a new life. (`met` counts the monsters fought, by kind, for
// the Bestiary.)
export function newTally() {
  return { slain: {}, met: {}, treasures: {}, pets: 0, closeCalls: 0, potions: 0, visits: {}, found: {}, respects: 0, events: 0, shards: 0, dungeons: 0, castles: 0, verses: 0, avenged: 0 };
}

// A grander epithet than the hero's current one, if their deeds have earned it; otherwise null.
// Among epithets of equal rank, the one the hero already has is kept.
export function newEpithet(life) {
  const current = epithets.find((entry) => entry.epithet === life.hero.epithet)?.rank ?? 0;
  let best = null;
  for (const entry of epithets) {
    if (entry.rank <= (best?.rank ?? current)) continue;
    if (earned(life, entry.when)) best = entry;
  }
  return best?.epithet ?? null;
}

// Every epithet the hero's deeds have earned, whatever its rank (for the Book of Epithets).
export function earnedEpithets(life) {
  return epithets.filter((entry) => earned(life, entry.when)).map((entry) => entry.epithet);
}

function earned(life, when) {
  const { hero, tally } = life;
  if ('slain' in when) return (tally.slain[when.slain] ?? 0) >= when.count;
  if ('slainTotal' in when) return life.monstersSlain >= when.slainTotal;
  if ('closeCalls' in when) return tally.closeCalls >= when.closeCalls;
  if ('potions' in when) return tally.potions >= when.potions;
  if ('goldFound' in when) return hero.goldFound >= when.goldFound;
  if ('visits' in when) return (tally.visits[when.visits] ?? 0) >= when.count;
  if ('found' in when) return (tally.found[when.found] ?? 0) > 0;
  if ('level' in when) return hero.level >= when.level;
  if ('respects' in when) return (tally.respects ?? 0) >= when.respects;
  if ('events' in when) return (tally.events ?? 0) >= when.events;
  if ('shards' in when) return (tally.shards ?? 0) >= when.shards;
  if ('dungeons' in when) return (tally.dungeons ?? 0) >= when.dungeons;
  if ('castles' in when) return (tally.castles ?? 0) >= when.castles;
  if ('verses' in when) return (tally.verses ?? 0) >= when.verses;
  if ('avenged' in when) return (tally.avenged ?? 0) >= when.avenged;
  if ('treasures' in when) return Object.keys(tally.treasures ?? {}).length >= when.treasures;
  if ('pets' in when) return (tally.pets ?? 0) >= when.pets;
  if ('skillRank' in when) return Math.max(0, ...Object.values(hero.skills)) >= when.skillRank;
  return false;
}
