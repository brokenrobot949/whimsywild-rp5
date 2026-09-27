// Skills and classes: what they do, what's offered at each choice, and how Auto-decide chooses.
import { tags, skills, skillPicks, effectText } from '../../data/skills.js';
import { classes, evolutions } from '../../data/classes.js';
import { statNames } from '../../data/items.js';
import { fill, capitalize } from './text.js';

const TAG_IDS = tags.map((tag) => tag.id);
// Effects that only mean something when an active skill is used, not as always-on bonuses.
const WHEN_USED = ['strike', 'hits', 'stun', 'drain', 'heal', 'when', 'cooldown'];

// ---- Checking the data ----
// Runs once at startup, so a typo in a data file shows a clear message.

function checkEffects(effects, owner) {
  for (const [key, value] of Object.entries(effects)) {
    if (!(key in effectText)) throw new Error(`${owner} has the effect "${key}", which isn't one of the effects listed in data/skills.js.`);
    if (key !== 'boost') continue;
    for (const stat of Object.keys(value)) {
      if (!(stat in statNames)) throw new Error(`${owner} boosts "${stat}". Stats must be one of: ${Object.keys(statNames).join(', ')}.`);
    }
  }
}

for (const skill of skills) {
  const owner = `The skill "${skill.name}" in data/skills.js`;
  if (!TAG_IDS.includes(skill.tag)) throw new Error(`${owner} has the tag "${skill.tag}". Tags must be one of: ${TAG_IDS.join(', ')}.`);
  if (skill.kind !== 'active' && skill.kind !== 'passive') throw new Error(`${owner} must be 'active' or 'passive'.`);
  if (!skill.ranks?.length) throw new Error(`${owner} needs at least one rank.`);
  skill.ranks.forEach((rank, i) => {
    checkEffects(rank, `${owner} (rank ${i + 1})`);
    if (skill.kind === 'active' && !(rank.cooldown > 0)) throw new Error(`${owner} is active, so rank ${i + 1} needs a cooldown.`);
  });
}
for (const option of classes) {
  const owner = `The class "${option.name}" in data/classes.js`;
  for (const tag of option.tags) if (!TAG_IDS.includes(tag)) throw new Error(`${owner} has the tag "${tag}". Tags must be one of: ${TAG_IDS.join(', ')}.`);
  checkEffects(option.perk.effects, owner);
}

// ---- Looking things up ----

export function tagInfo(id) {
  return tags.find((tag) => tag.id === id);
}

export function classById(id) {
  return classes.find((option) => option.id === id);
}

export function skillByName(name) {
  return skills.find((skill) => skill.name === name);
}

// The hero's rank in a skill: 0 if they haven't learned it.
export function skillRank(hero, skill) {
  return hero.skills[skill.name] ?? 0;
}

// The hero's active skills, each with the effects of their current rank.
export function activeSkills(hero) {
  return skills
    .filter((skill) => skill.kind === 'active' && skillRank(hero, skill) > 0)
    .map((skill) => ({ skill, rank: skill.ranks[skillRank(hero, skill) - 1] }));
}

// ---- Effects ----

// Adds up the always-on effects of the hero's passive skills and class perk.
export function totalEffects(hero) {
  const total = { boost: {} };
  const add = (effects) => {
    for (const [key, value] of Object.entries(effects)) {
      if (key === 'boost') {
        for (const [stat, share] of Object.entries(value)) total.boost[stat] = (total.boost[stat] ?? 0) + share;
      } else if (typeof value === 'boolean') {
        total[key] = total[key] || value;
      } else if (!WHEN_USED.includes(key)) {
        total[key] = (total[key] ?? 0) + value;
      }
    }
  };
  for (const skill of skills) {
    const rank = skillRank(hero, skill);
    if (rank > 0 && skill.kind === 'passive') add(skill.ranks[rank - 1]);
  }
  if (hero.class) add(classById(hero.class).perk.effects);
  return total;
}

// "Strikes for 220% damage, every 7s"
export function describeEffects(effects) {
  const parts = [];
  const entries = Object.entries(effects).sort(([a], [b]) => (a === 'cooldown') - (b === 'cooldown'));
  for (const [key, value] of entries) {
    if (key === 'boost') {
      for (const [stat, share] of Object.entries(value)) parts.push(fill(effectText.boost, { percent: percent(share), stat: statNames[stat] }));
    } else {
      parts.push(fill(effectText[key], { percent: percent(value), value }));
    }
  }
  return capitalize(parts.join(', '));
}

function percent(share) {
  return Math.round(share * 100);
}

// ---- Choices ----

// The class tier offered at this level, if any classes of that tier exist yet.
export function evolutionAt(level) {
  return evolutions.find((entry) => entry.level === level && classes.some((option) => option.tier === entry.tier)) ?? null;
}

export function isSkillPickLevel(level) {
  return level % skillPicks.everyLevels === 0;
}

// Skills offered at a pick: weighted towards the hero's tags, with at least one
// from the hero's weakest tags so they can always change direction.
export function skillOffers(rng, hero) {
  const available = skills.filter((skill) => skillRank(hero, skill) < skill.ranks.length);
  const weightOf = (skill) => 1 + skillPicks.tagWeight * (hero.tags[skill.tag] ?? 0);
  const offers = [];
  const pool = [...available];
  while (offers.length < skillPicks.options && pool.length > 0) {
    const skill = rng.pickWeighted(pool, weightOf);
    offers.push(skill);
    pool.splice(pool.indexOf(skill), 1);
  }
  const fewest = Math.min(...TAG_IDS.map((tag) => hero.tags[tag] ?? 0));
  const offTag = (skill) => (hero.tags[skill.tag] ?? 0) === fewest;
  if (offers.length > 1 && !offers.some(offTag)) {
    const pivots = pool.filter(offTag);
    if (pivots.length > 0) offers[offers.length - 1] = rng.pick(pivots);
  }
  return offers;
}

// The two classes of a tier that best match the hero's tags. Ties are broken at random.
export function classOffers(rng, hero, tier) {
  const match = (option) => option.tags.reduce((sum, tag) => sum + (hero.tags[tag] ?? 0), 0);
  return classes
    .filter((option) => option.tier === tier)
    .map((option) => ({ option, roll: rng.next() }))
    .sort((a, b) => match(b.option) - match(a.option) || a.roll - b.roll)
    .slice(0, 2)
    .map((entry) => entry.option);
}

// Auto-decide: the option that best matches the hero's highest tags.
// For skills, a tie goes to one the hero already knows.
export function autoPick(hero, choice) {
  const score = (option) => {
    if (choice.kind === 'class') return option.tags.reduce((sum, tag) => sum + (hero.tags[tag] ?? 0), 0);
    return (hero.tags[option.tag] ?? 0) + (skillRank(hero, option) > 0 ? 0.5 : 0);
  };
  let best = 0;
  choice.options.forEach((option, index) => {
    if (score(option) > score(choice.options[best])) best = index;
  });
  return best;
}
