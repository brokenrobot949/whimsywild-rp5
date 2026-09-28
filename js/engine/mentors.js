// Mentors: retired heroes who settle in a town, and the gifts they give heroes who start there.
// Like graves, mentors belong to the world, so they're saved with it and last across every hero.
// Each gift is drawn here; what it does to the new hero is worked out in life.js.
import { mentorSettings, gifts } from '../../data/mentors.js';
import { rarities } from '../../data/items.js';
import { classById, skillByName } from './skills.js';

const KINDS = ['lesson', 'perk', 'gold', 'potions', 'gear', 'level', 'skillRank', 'dud'];
// Effects that only mean something for an active skill, never passed on.
const SKIP = ['strike', 'hits', 'stun', 'drain', 'heal', 'when', 'cooldown'];

// Check the gift pool once at startup, so a typo shows a clear message.
const ids = new Set();
for (const gift of gifts) {
  const owner = `The mentor gift "${gift.id}" in data/mentors.js`;
  if (!gift.id || ids.has(gift.id)) throw new Error(`${owner} needs an id that no other gift uses.`);
  ids.add(gift.id);
  if (!KINDS.includes(gift.kind)) throw new Error(`${owner} has the kind "${gift.kind}". Kinds must be one of: ${KINDS.join(', ')}.`);
  if (!gift.text || !gift.line) throw new Error(`${owner} needs a text and a line.`);
  if (!(gift.weight >= 0)) throw new Error(`${owner} needs a weight of 0 or more.`);
  if (gift.kind === 'gear' && (!rarities.some((rarity) => rarity.id === gift.rarity) || !gift.itemName)) {
    throw new Error(`${owner} gives gear, so it needs a rarity from data/items.js and an itemName.`);
  }
  if (['gold', 'potions'].includes(gift.kind) && !(gift.amount > 0)) throw new Error(`${owner} needs an amount above 0.`);
  if (gift.kind === 'perk' && !(gift.share > 0)) throw new Error(`${owner} needs a share above 0.`);
}

// Settles a retiring hero in a town. Each town remembers its most recent retirees.
export function addMentor(world, hero, townName) {
  world.mentors.push({
    town: townName,
    name: hero.name,
    epithet: hero.epithet,
    level: hero.level,
    classId: hero.class,
    skill: signatureSkill(hero),
  });
  const inTown = world.mentors.filter((mentor) => mentor.town === townName);
  const forgotten = inTown.slice(0, Math.max(0, inTown.length - mentorSettings.residents));
  world.mentors = world.mentors.filter((mentor) => !forgotten.includes(mentor));
}

// The mentors who give gifts to heroes starting in a town, newest first.
export function mentorsFor(world, townName) {
  return residentsOf(world, townName).slice(0, mentorSettings.gifts);
}

// Everyone who has retired to a town, newest first.
export function residentsOf(world, townName) {
  return world.mentors.filter((mentor) => mentor.town === townName).reverse();
}

// Draws one gift from each mentor. Gifts a mentor can't give (a lesson from someone with no
// skills) are left out, and only one lesson is drawn per hero. Returns [{ mentor, gift }].
export function drawGifts(rng, mentors) {
  const drawn = [];
  for (const mentor of mentors) {
    const possible = gifts.filter((gift) => canGive(mentor, gift)
      && !(gift.kind === 'lesson' && drawn.some((other) => other.gift.kind === 'lesson')));
    const weightOf = (gift) => Math.max(0, gift.weight + (gift.perLevel ?? 0) * (mentor.level ?? 1));
    drawn.push({ mentor, gift: rng.pickWeighted(possible, weightOf) });
  }
  return drawn;
}

function canGive(mentor, gift) {
  if (gift.kind === 'lesson' || gift.kind === 'skillRank') return Boolean(mentor.skill && skillByName(mentor.skill));
  if (gift.kind === 'perk') return Object.keys(perkShare(mentor, gift.share)).length > 0;
  return true;
}

// A share of the mentor's class perk. All-or-nothing effects (like always striking first) aren't passed on.
export function perkShare(mentor, share) {
  const perk = classById(mentor.classId)?.perk.effects;
  return perk ? scaleEffects(perk, share) : {};
}

// A hero's highest-ranked skill (the first learned, on a tie), or null.
function signatureSkill(hero) {
  let best = null;
  for (const [name, rank] of Object.entries(hero.skills)) if (!best || rank > hero.skills[best]) best = name;
  return best;
}

function scaleEffects(effects, factor) {
  const scaled = {};
  for (const [key, value] of Object.entries(effects)) {
    if (SKIP.includes(key) || typeof value === 'boolean') continue;
    if (typeof value === 'object') {
      scaled[key] = Object.fromEntries(Object.entries(value).map(([name, amount]) => [name, round(amount * factor)]));
    } else {
      scaled[key] = round(value * factor);
    }
  }
  return scaled;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

// Mentors read from the save. Entries that don't make sense are dropped.
export function loadMentors(saved) {
  if (!Array.isArray(saved)) return [];
  return saved.filter((mentor) => typeof mentor?.town === 'string' && typeof mentor.name === 'string');
}
