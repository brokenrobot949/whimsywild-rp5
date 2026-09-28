// A hero: who they are, how old and strong they are, what they know and carry, and where they stand.
import { firstNames, familyNames } from '../../data/names.js';
import { defaultEpithet } from '../../data/epithets.js';
import { lifeClock } from '../../data/life.js';
import { heroStats, experience } from '../../data/combat.js';
import { slots, potions } from '../../data/items.js';
import { tags } from '../../data/skills.js';
import { totalEffects } from './skills.js';

export function createHero(seed, rng) {
  const base = { ...heroStats.start };
  const hero = {
    seed,
    name: `${rng.pick(firstNames)} ${rng.pick(familyNames)}`,
    epithet: defaultEpithet,
    age: lifeClock.startAge,
    season: 0,  // position in the seasons list in data/life.js; 0 is Spring
    level: 1,
    xp: 0,      // experience towards the next level
    origin: null, // the id of their origin (see origins.js)
    quirk: null,  // the id of their quirk (see quirks.js)
    dream: null,  // the id of tonight's dream, which they live under (see dreams.js)
    mentors: [],  // what the retired heroes of their starting town taught them (see mentors.js)
    class: null, // the id of the hero's class, once they have one
    classPath: [], // the ids of every class they've taken, in order (the base class, then advanced)
    skills: {}, // skill name → rank
    tags: Object.fromEntries(tags.map((tag) => [tag.id, 0])), // one point per skill pick
    base,       // stats from levels alone
    stats: null, // stats with gear, skills and class added; this is what fights use
    effects: null, // always-on effects from skills, class and blessings (see skills.js)
    blessings: [], // from story events: { name, effects, until (the season count it ends at) }
    hp: base.maxHp,
    gear: Object.fromEntries(slots.map((slot) => [slot.id, null])),
    gold: 0,
    goldFound: 0, // all the gold found this life, spent or not
    potions: potions.start,
    x: 0,
    y: 0,
  };
  refreshStats(hero);
  return hero;
}

// Works out the hero's stats: their own, plus gear, then boosted by skills and class.
// Also used after loading a saved hero, in case the data files have changed since.
export function refreshStats(hero) {
  hero.effects = totalEffects(hero);
  const stats = { ...hero.base };
  for (const item of Object.values(hero.gear)) {
    if (!item) continue;
    for (const [stat, amount] of Object.entries(item.stats)) stats[stat] += amount;
  }
  for (const [stat, share] of Object.entries(hero.effects.boost)) stats[stat] *= 1 + share;
  hero.stats = stats;
  hero.hp = Math.min(hero.hp, stats.maxHp);
}

// Puts on an item, and returns whatever it replaced (or null).
export function equip(hero, item) {
  const replaced = hero.gear[item.slot];
  hero.gear[item.slot] = item;
  refreshStats(hero);
  return replaced;
}

// Learns a skill, or ranks it up if already known. Returns the new rank.
export function learnSkill(hero, skill) {
  const rank = (hero.skills[skill.name] ?? 0) + 1;
  hero.skills[skill.name] = rank;
  if (skill.tag) hero.tags[skill.tag] += 1; // (verses of the lullaby have no tag)
  const before = hero.stats.maxHp;
  refreshStats(hero);
  hero.hp += Math.max(0, hero.stats.maxHp - before); // extra max HP arrives full
  return rank;
}

// Takes a class. The perks of earlier classes stay with the hero.
export function takeClass(hero, classId) {
  hero.class = classId;
  hero.classPath.push(classId);
  const before = hero.stats.maxHp;
  refreshStats(hero);
  hero.hp += Math.max(0, hero.stats.maxHp - before);
}

// Brings a new hero up to a starting level, with the stats they'd have gained on the way.
export function raiseToLevel(hero, level) {
  while (hero.level < level) {
    hero.level += 1;
    for (const [stat, gain] of Object.entries(heroStats.perLevel)) hero.base[stat] += gain;
  }
  refreshStats(hero);
  hero.hp = hero.stats.maxHp;
}

// Experience needed to go up from `level` to the next one.
export function xpToNextLevel(level) {
  const { perLevel, perLevelSquared } = experience.toNextLevel;
  return Math.round(perLevel * level + perLevelSquared * level * level);
}

// Goes up one level if there's enough experience. Returns true if it did.
export function tryLevelUp(hero) {
  const needed = xpToNextLevel(hero.level);
  if (hero.xp < needed) return false;
  hero.xp -= needed;
  hero.level += 1;
  for (const [stat, gain] of Object.entries(heroStats.perLevel)) hero.base[stat] += gain;
  const before = hero.stats.maxHp;
  refreshStats(hero);
  hero.hp = Math.min(hero.stats.maxHp, hero.hp + (hero.stats.maxHp - before));
  return true;
}
