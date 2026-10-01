// Skills and classes: what they do, what's offered at each choice, and how Auto-decide chooses.
// The skill list includes the verses of the lullaby (see data/verses.js): skills with no tag,
// offered only once their verse has been found.
import { tags, skills as taggedSkills, skillPicks, effectText } from '../../data/skills.js';
import { verses, verseSettings, verseText } from '../../data/verses.js';
import { classes, evolutions } from '../../data/classes.js';
import { statNames } from '../../data/items.js';
import { families } from '../../data/monsters.js';
import { quirks } from '../../data/quirks.js';
import { dreams } from '../../data/dreams.js';
import { moods } from '../../data/new-dream.js';
import { fill, capitalize } from './text.js';

const TAG_IDS = tags.map((tag) => tag.id);
// Effects that only mean something when an active skill is used, not as always-on bonuses.
const WHEN_USED = ['strike', 'hits', 'stun', 'drain', 'heal', 'when', 'cooldown'];

// Every skill: the tagged skills, then the verses. A verse's skill is named after the verse,
// and its flavor is the verse's first line, trailing off ("...silver stile…").
const skills = [
  ...taggedSkills,
  ...verses.map((verse) => ({ name: verse.title, tag: null, verse: verse.id, kind: verse.skill.kind, flavor: verse.lines[0].replace(/[;,.:]$/, '…'), ranks: verse.skill.ranks })),
];

// ---- Checking the data ----
// Runs once at startup, so a typo in a data file shows a clear message.

export function checkEffects(effects, owner) {
  for (const [key, value] of Object.entries(effects)) {
    if (!(key in effectText)) throw new Error(`${owner} has the effect "${key}", which isn't one of the effects listed in data/skills.js.`);
    if (key === 'boost') {
      for (const stat of Object.keys(value)) {
        if (!(stat in statNames)) throw new Error(`${owner} boosts "${stat}". Stats must be one of: ${Object.keys(statNames).join(', ')}.`);
      }
    }
    if (key === 'against') {
      for (const family of Object.keys(value)) {
        if (!(family in families)) throw new Error(`${owner} is against "${family}". Families must be one of: ${Object.keys(families).join(', ')}.`);
      }
    }
  }
}

for (const skill of skills) {
  const owner = skill.verse ? `The verse "${skill.name}" in data/verses.js` : `The skill "${skill.name}" in data/skills.js`;
  if (!skill.verse && !TAG_IDS.includes(skill.tag)) throw new Error(`${owner} has the tag "${skill.tag}". Tags must be one of: ${TAG_IDS.join(', ')}.`);
  if (skills.filter((other) => other.name === skill.name).length > 1) throw new Error(`There are two skills called "${skill.name}". Each skill and verse needs its own name.`);
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
for (const quirk of quirks) checkEffects(quirk.effects, `The quirk "${quirk.name}" in data/quirks.js`);

// ---- Looking things up ----

export function tagInfo(id) {
  return tags.find((tag) => tag.id === id);
}

// The chip shown with a skill: its tag, or "Lullaby" for a verse.
export function skillChip(skill) {
  return skill.verse ? { id: verseText.chip, color: verseText.chipColor } : tagInfo(skill.tag);
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

// Adds up the always-on effects of the hero's passive skills, class perks, blessings, mentors,
// quirk, tonight's dream, and a restless New Game+ dream.
export function totalEffects(hero) {
  const total = { boost: {}, against: {} };
  const add = (effects) => {
    for (const [key, value] of Object.entries(effects)) {
      if (key === 'boost' || key === 'against') {
        for (const [name, share] of Object.entries(value)) total[key][name] = (total[key][name] ?? 0) + share;
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
  for (const heroClass of classPath(hero)) add(heroClass.perk.effects);
  for (const blessing of hero.blessings ?? []) add(blessing.effects);
  for (const mentor of hero.mentors ?? []) add(mentor.effects);
  const quirk = quirkById(hero.quirk);
  if (quirk) add(quirk.effects);
  const dream = dreams.find((option) => option.id === hero.dream); // tonight's dream (see dreams.js)
  if (dream?.effects) add(dream.effects);
  const mood = moods[hero.mood]; // a restless New Game+ dream (see new-dream.js)
  if (mood?.effects) add(mood.effects);
  return total;
}

export function quirkById(id) {
  return quirks.find((quirk) => quirk.id === id) ?? null;
}

// Every class the hero has taken, oldest first.
export function classPath(hero) {
  return (hero.classPath ?? []).map(classById).filter(Boolean);
}

// "Strikes for 220% damage, every 7s"
export function describeEffects(effects) {
  const parts = [];
  const entries = Object.entries(effects).sort(([a], [b]) => (a === 'cooldown') - (b === 'cooldown'));
  for (const [key, value] of entries) {
    if (key === 'boost') {
      for (const [stat, share] of Object.entries(value)) parts.push(fill(effectText.boost, { percent: percent(share), stat: statNames[stat] }));
    } else if (key === 'against') {
      for (const [family, share] of Object.entries(value)) parts.push(fill(effectText.against, { percent: percent(share), family: families[family] }));
    } else {
      parts.push(fill(effectText[key], { percent: percent(value), value }));
    }
  }
  // "+-25%" reads better as "-25%".
  return capitalize(parts.join(', ').replaceAll('+-', '-'));
}

// 0.15 → 15, and small shares keep one decimal (0.0025 → 0.3), so they don't show as 0.
function percent(share) {
  return Math.abs(share) < 0.1 ? Math.round(share * 1000) / 10 : Math.round(share * 100);
}

// ---- Choices ----

// The class tier offered at this level, if any classes of that tier exist yet.
export function evolutionAt(level) {
  return evolutions.find((entry) => entry.level === level && classes.some((option) => option.tier === entry.tier)) ?? null;
}

export function isSkillPickLevel(level) {
  return level % skillPicks.everyLevels === 0;
}

// The skills of the verses found so far, given the ids of the found verses.
export function verseSkills(foundIds) {
  return skills.filter((skill) => skill.verse && foundIds.includes(skill.verse));
}

// Skills offered at a pick: weighted towards the hero's tags, with at least one
// from the hero's weakest tags so they can always change direction.
// `mustOffer` is a skill that has to be among them (a mentor's lesson), if any.
// `foundVerses` are the ids of the verses found so far, whose skills can be offered too.
export function skillOffers(rng, hero, mustOffer = null, foundVerses = []) {
  const available = skills.filter((skill) => (!skill.verse || foundVerses.includes(skill.verse)) && skillRank(hero, skill) < skill.ranks.length);
  const weightOf = (skill) => (skill.verse ? verseSettings.offerWeight : 1 + skillPicks.tagWeight * (hero.tags[skill.tag] ?? 0));
  const offers = [];
  const pool = [...available];
  while (offers.length < skillPicks.options && pool.length > 0) {
    const skill = rng.pickWeighted(pool, weightOf);
    offers.push(skill);
    pool.splice(pool.indexOf(skill), 1);
  }
  const fewest = Math.min(...TAG_IDS.map((tag) => hero.tags[tag] ?? 0));
  const offTag = (skill) => !skill.verse && (hero.tags[skill.tag] ?? 0) === fewest;
  if (offers.length > 1 && !offers.some(offTag)) {
    const pivots = pool.filter(offTag);
    if (pivots.length > 0) offers[offers.length - 1] = rng.pick(pivots);
  }
  // The mentor's lesson takes the place of the first option, keeping the off-tag one.
  if (mustOffer && !offers.includes(mustOffer)) {
    const lastOffTag = offers.findLastIndex(offTag);
    offers[lastOffTag === 0 && offers.length > 1 ? 1 : 0] = mustOffer;
  }
  return offers;
}

// The two classes of a tier that best match the hero's tags. On a tie, a two-tag class
// comes before a single-tag one (so a hero strong in two tags is offered their blend),
// and any tie left is broken at random.
export function classOffers(rng, hero, tier) {
  const match = (option) => option.tags.reduce((sum, tag) => sum + (hero.tags[tag] ?? 0), 0);
  const blend = (option) => new Set(option.tags).size;
  return classes
    .filter((option) => option.tier === tier)
    .map((option) => ({ option, roll: rng.next() }))
    .sort((a, b) => match(b.option) - match(a.option) || blend(b.option) - blend(a.option) || a.roll - b.roll)
    .slice(0, 2)
    .map((entry) => entry.option);
}

// Auto-decide: the option that best matches the hero's highest tags.
// For skills, a tie goes to one the hero already knows. A verse suits any hero, so it's rated
// a little below the hero's strongest tag.
export function autoPick(hero, choice) {
  const strongest = Math.max(...TAG_IDS.map((tag) => hero.tags[tag] ?? 0));
  const score = (option) => {
    if (choice.kind === 'class') return option.tags.reduce((sum, tag) => sum + (hero.tags[tag] ?? 0), 0);
    const fit = option.verse ? strongest - verseSettings.autoBehind : (hero.tags[option.tag] ?? 0);
    return fit + (skillRank(hero, option) > 0 ? 0.5 : 0);
  };
  let best = 0;
  choice.options.forEach((option, index) => {
    if (score(option) > score(choice.options[best])) best = index;
  });
  return best;
}
