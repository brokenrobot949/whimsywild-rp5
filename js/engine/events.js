// Story events: checking the data, choosing which event happens, and the odds of each option.
// What an option does to the hero is worked out in life.js.
import { events, eventSettings, eventText } from '../../data/events.js';
import { tags } from '../../data/skills.js';
import { regions } from '../../data/regions.js';
import { monsters } from '../../data/monsters.js';
import { slots, rarities } from '../../data/items.js';
import { treasures } from '../../data/treasures.js';
import { pets } from '../../data/pets.js';
import { quirks } from '../../data/quirks.js';
import { fill } from './text.js';
import { checkEffects } from './skills.js';
import { currentAct } from './story.js';

const TAG_IDS = tags.map((tag) => tag.id);
const OUTCOME_KEYS = ['line', 'gold', 'xp', 'hp', 'potions', 'item', 'treasure', 'pet', 'fight', 'blessing', 'rest', 'reveal'];
const WHERE = ['road', 'town', 'dungeon', 'tremor'];

// ---- Checking the data ----
// Runs once at startup, so a typo in data/events.js shows a clear message.

const seenIds = new Set();
for (const event of events) {
  const owner = `The event "${event.title ?? event.id}" in data/events.js`;
  if (!event.id || seenIds.has(event.id)) throw new Error(`${owner} needs an id that no other event uses.`);
  seenIds.add(event.id);
  if (!WHERE.includes(event.where)) throw new Error(`${owner} needs where: 'road', 'town', 'dungeon' or 'tremor'.`);
  if (event.where === 'tremor' && !event.opening) throw new Error(`${owner} is a tremor, so it needs an opening line.`);
  for (const id of event.regions ?? []) if (!regions[id]) throw new Error(`${owner} lists the region "${id}", which isn't in data/regions.js.`);
  if (event.quirk && !quirks.some((quirk) => quirk.id === event.quirk)) throw new Error(`${owner} is for the quirk "${event.quirk}", which isn't in data/quirks.js.`);
  if (!event.title || !event.text) throw new Error(`${owner} needs a title and a text.`);
  if (!(event.options?.length >= 2)) throw new Error(`${owner} needs at least 2 options.`);
  event.options.forEach((option, index) => {
    const which = `${owner}, option ${index + 1}`;
    if (!TAG_IDS.includes(option.tag)) throw new Error(`${which} needs a tag: one of ${TAG_IDS.join(', ')}.`);
    if (!option.success) throw new Error(`${which} needs a success.`);
    if (option.chance !== undefined && !option.failure) throw new Error(`${which} has a chance, so it needs a failure too.`);
    for (const outcome of [option.success, option.failure].filter(Boolean)) checkOutcome(outcome, event, which);
  });
}

function checkOutcome(outcome, event, owner) {
  if (!outcome.line) throw new Error(`${owner} needs a line for the log.`);
  for (const key of Object.keys(outcome)) {
    if (!OUTCOME_KEYS.includes(key)) throw new Error(`${owner} has "${key}", which isn't one of: ${OUTCOME_KEYS.join(', ')}.`);
  }
  if (outcome.fight) {
    if (event.where === 'town') throw new Error(`${owner} starts a fight, which town events can't do.`);
    const name = typeof outcome.fight === 'string' ? outcome.fight : outcome.fight.monster;
    if (name && !monsters.some((kind) => kind.name === name)) throw new Error(`${owner} fights "${name}", which isn't in data/monsters.js.`);
  }
  if ('reveal' in outcome && !(outcome.reveal > 0)) throw new Error(`${owner} needs a reveal above 0 (tiles).`);
  if (outcome.pet && !pets.some((pet) => pet.id === outcome.pet)) throw new Error(`${owner} gives the pet "${outcome.pet}", which isn't in data/pets.js.`);
  if (outcome.treasure && !treasures.some((treasure) => treasure.id === outcome.treasure)) throw new Error(`${owner} gives the treasure "${outcome.treasure}", which isn't in data/treasures.js.`);
  if (outcome.item && outcome.item !== 'drop') {
    const { rarity, slot } = outcome.item;
    if (rarity && !rarities.some((option) => option.id === rarity)) throw new Error(`${owner} gives an item of rarity "${rarity}", which isn't in data/items.js.`);
    if (slot && !slots.some((option) => option.id === slot)) throw new Error(`${owner} gives an item for the slot "${slot}", which isn't in data/items.js.`);
  }
  if (outcome.blessing) {
    const { name, effects, seasons } = outcome.blessing;
    if (!name || !effects || !(seasons > 0)) throw new Error(`${owner} has a blessing that needs a name, effects and seasons.`);
    checkEffects(effects, `${owner} (its blessing)`);
  }
}

// ---- Choosing an event ----

export function eventById(id) {
  return events.find((event) => event.id === id) ?? null;
}

// An event that can happen here and now, or null. Each event happens at most once a life.
//   where   'road', 'town', 'dungeon' or 'tremor'
//   region  the region the hero is in
export function pickEvent(rng, life, where, region) {
  const { level } = life.hero;
  const act = currentAct(life.world);
  const possible = events.filter((event) => event.where === where
    && (!event.regions || event.regions.includes(region))
    && (!event.quirk || event.quirk === life.hero.quirk)
    && (!event.levels || (level >= event.levels[0] && level <= event.levels[1]))
    && (event.fromAct ?? 1) <= act && act <= (event.untilAct ?? Infinity)
    && !life.eventsSeen.includes(event.id)
    && !(life.hero.pet && givesPet(event))); // one pet per hero
  return possible.length > 0 ? rng.pickWeighted(possible, (event) => event.weight ?? 1) : null;
}

// Whether any of an event's options can give the hero a pet.
function givesPet(event) {
  return event.options.some((option) => option.success?.pet || option.failure?.pet);
}

// ---- Odds ----

// The chance an option works for this hero: its own chance, plus a bonus for each point in its
// tag (and a Silver Tongue's bonus). Options without a chance always work.
export function optionChance(hero, option) {
  if (option.chance === undefined) return 1;
  const chance = option.chance + eventSettings.tagBonus * (hero.tags[option.tag] ?? 0) + (hero.effects.eventLuck ?? 0);
  return Math.min(eventSettings.bestChance, chance);
}

// "Likely", "Risky" and so on, for the card. Nothing for options that always work.
// A hero who talks to their sword hears the exact odds.
export function oddsWord(hero, option) {
  if (option.chance === undefined) return '';
  const chance = optionChance(hero, option);
  if (hero.effects.swordHints) return fill(eventText.swordOdds, { percent: Math.round(chance * 100) });
  return eventText.odds.find(([least]) => chance >= least)[1];
}

// Auto-decide: the option matching the hero's strongest tag; on a tie, the likelier one.
export function autoEventOption(hero, event) {
  const score = (option) => (hero.tags[option.tag] ?? 0) + optionChance(hero, option) / 10;
  let best = 0;
  event.options.forEach((option, index) => {
    if (score(option) > score(event.options[best])) best = index;
  });
  return best;
}
