// Fights: making monsters, and trading blows.
import { monsters, levelTitles } from '../../data/monsters.js';
import { encounters, blows } from '../../data/combat.js';
import { withArticle } from './text.js';

// Makes a monster from the given region, at about the hero's level (Phase 1; see DESIGN.md).
export function createMonster(rng, regionId, heroLevel) {
  const kinds = monsters.filter((kind) => kind.region === regionId);
  if (kinds.length === 0) throw new Error(`No monsters live in the region "${regionId}". Add some in data/monsters.js.`);
  const kind = rng.pickWeighted(kinds, (option) => option.weight ?? 1);
  const level = Math.max(1, heroLevel + rng.pick(encounters.levelOffsets));
  const growth = 1 + encounters.monsterGrowth * (level - 1);
  const title = levelTitles.filter((entry) => level >= entry.from).at(-1)?.title;
  const stats = {
    maxHp: kind.stats.maxHp * growth,
    power: kind.stats.power * growth,
    defense: kind.stats.defense * growth,
    speed: kind.stats.speed,
    luck: kind.stats.luck,
  };
  return { kind, level, name: title ? `${title} ${kind.name}` : kind.name, stats, hp: stats.maxHp };
}

// Words for filling in lines: {a} "an Elder Grumpy Badger", {the} "the Elder Grumpy Badger".
export function monsterWords(monster) {
  return { a: withArticle(monster.name), the: `the ${monster.name}` };
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
