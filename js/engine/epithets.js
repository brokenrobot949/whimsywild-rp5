// Epithets: working out which title a hero has earned from their deeds.
import { epithets, closeCallShare } from '../../data/epithets.js';
import { monsters } from '../../data/monsters.js';
import { places } from '../../data/regions.js';
import { rarities } from '../../data/items.js';

export { closeCallShare };

// Check the data once at startup, so a typo shows a clear message.
const KINDS = ['slain', 'slainTotal', 'closeCalls', 'potions', 'goldFound', 'visits', 'found', 'level', 'skillRank', 'respects'];
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

// A fresh set of deed counters for a new life.
export function newTally() {
  return { slain: {}, closeCalls: 0, potions: 0, visits: {}, found: {}, respects: 0 };
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
  if ('skillRank' in when) return Math.max(0, ...Object.values(hero.skills)) >= when.skillRank;
  return false;
}
