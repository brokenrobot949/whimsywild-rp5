// Fights: making monsters, and trading blows.
import { monsters, families } from '../../data/monsters.js';
import { regions } from '../../data/regions.js';
import { encounters, blows } from '../../data/combat.js';
import { withArticle } from './text.js';

// Check the monster data once at startup, so a typo shows a clear message.
for (const kind of monsters) {
  const owner = `The monster "${kind.name}" in data/monsters.js`;
  if (kind.family && !(kind.family in families)) {
    throw new Error(`${owner} has the family "${kind.family}". Families must be one of: ${Object.keys(families).join(', ')}.`);
  }
  const move = kind.special;
  if (move) {
    if (!move.name || !(move.every > 0)) throw new Error(`${owner} needs a name and an "every" above 0 for its special move.`);
    if (!(move.strike > 0) && !(move.heal > 0)) throw new Error(`${owner} needs a strike or a heal for its special move.`);
  }
}

// Makes a monster from the given region, near the hero's level but within the region's levels.
// Story events can ask for a particular monster by name (`kindName`), and make it `extraLevels` stronger.
// Tonight's dream can make some monsters commoner (`weights`, by name) and all of them tougher (`strength`).
// `calm` makes the monsters of some regions weaker, by region: { tailwoods: 0.1 } (see castles.js).
// Castle bosses only come when asked for by name, and always fight at the top of their region's levels.
// `level` sets the monster's level exactly, whatever its region (for the finale's dreams).
export function createMonster(rng, regionId, heroLevel, { kindName, extraLevels = 0, weights = {}, strength = 0, calm = {}, level: exactLevel } = {}) {
  let kind = kindName ? monsters.find((option) => option.name === kindName) : null;
  if (!kind) {
    const kinds = monsters.filter((option) => option.region === regionId && !option.boss);
    if (kinds.length === 0) throw new Error(`No monsters live in the region "${regionId}". Add some in data/monsters.js.`);
    kind = rng.pickWeighted(kinds, (option) => (option.weight ?? 1) * (weights[option.name] ?? 1));
  }
  const [lowest, highest] = regions[kind.region].levels;
  const near = kind.boss ? highest : heroLevel + rng.pick(encounters.levelOffsets);
  const level = exactLevel ?? Math.min(highest, Math.max(lowest, near)) + extraLevels;
  const growth = (1 + encounters.monsterGrowth * (level - 1)) * (1 + strength) * (1 - (calm[kind.region] ?? 0));
  const stats = {
    maxHp: kind.stats.maxHp * growth,
    power: kind.stats.power * growth,
    defense: kind.stats.defense * growth,
    speed: kind.stats.speed,
    luck: kind.stats.luck,
  };
  return { kind, level, name: kind.name, stats, hp: stats.maxHp };
}

// Words for filling in lines: {a} "a Grumpy Badger", {the} "the Grumpy Badger". There's only one
// of each castle boss, so {a} is "the Glutton Lord", and a proper name like "Baron Goldtooth" is bare.
export function monsterWords(monster) {
  const { kind, name } = monster;
  if (kind.properName) return { a: name, the: name };
  return { a: kind.boss ? `the ${name}` : withArticle(name), the: `the ${name}` };
}

// Seconds between blows at a given speed (speed is blows every 10 seconds).
export function blowWait(speed) {
  return 10 / speed;
}

// One blow from the attacker at the defender. Returns { dodged, critical, damage }.
//   multiplier  scales the damage (skills strike harder)
//   critBonus   added to the critical hit multiplier
//   extraDodge  percent added to the defender's chance to dodge
export function strike(rng, attacker, defender, { multiplier = 1, critBonus = 0, extraDodge = 0 } = {}) {
  if (rng.chance((defender.luck / 2 + extraDodge) / 100)) return { dodged: true, critical: false, damage: 0 };
  const critical = rng.chance(attacker.luck / 100);
  const { power } = attacker;
  const base = (power * power) / (power + defender.defense);
  const spread = 1 + (rng.next() * 2 - 1) * blows.spread;
  const damage = Math.max(1, Math.round(base * spread * multiplier * (critical ? blows.critical + critBonus : 1)));
  return { dodged: false, critical, damage };
}
