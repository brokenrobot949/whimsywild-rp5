// Collections: the Bestiary, the Book of Epithets and the Treasures (see data/collections.js). They're kept in
// the save beside the Hall of Champions, so they last through every dream of New Game+:
//   { monsters: { [name]: { met, slain, felled, firstBy } }, epithets: { [epithet]: { count, firstBy } },
//     treasures: { [id]: { count, firstBy } } }
// `met` counts every fight with that kind of monster, `slain` every win against it, `felled` the
// heroes it felled, and `firstBy` the hero who first beat it (or first earned the epithet, or
// first found the treasure).
import { monsters } from '../../data/monsters.js';
import { epithets } from '../../data/epithets.js';
import { finaleText } from '../../data/finale.js';
import { rarities } from '../../data/items.js';
import { verseSettings } from '../../data/verses.js';
import { places } from '../../data/regions.js';
import { eventText } from '../../data/events.js';
import { epithetHints } from '../../data/collections.js';
import { earnedEpithets, newTally } from './epithets.js';
import { fill, withArticle } from './text.js';

export function newCollections() {
  return { monsters: {}, epithets: {}, treasures: {} };
}

// Adds a hero's life to the collections. Called once, when the life ends.
export function collectLife(collections, life) {
  const hero = life.hero.name;
  for (const [name, count] of Object.entries(life.tally.met ?? {})) monsterEntry(collections, name).met += count;
  for (const [name, count] of Object.entries(life.tally.slain)) {
    const entry = monsterEntry(collections, name);
    entry.slain += count;
    entry.firstBy ??= hero;
  }
  if (life.ending?.monster) monsterEntry(collections, life.ending.monster.kind.name).felled += 1;
  const earned = earnedEpithets(life);
  if (life.hero.epithet === finaleText.epithet) earned.push(finaleText.epithet);
  for (const epithet of earned) addEpithet(collections, epithet, hero);
  collections.treasures ??= {}; // (collections from before treasures)
  for (const [id, count] of Object.entries(life.tally.treasures ?? {})) {
    collections.treasures[id] ??= { count: 0, firstBy: hero };
    collections.treasures[id].count += count;
  }
}

// The collections with the hero in progress added, for the Chronicle.
export function collectionsWithLife(collections, life) {
  const copy = structuredClone(collections);
  if (life?.begun && !life.ending) collectLife(copy, life);
  return copy;
}

function monsterEntry(collections, name) {
  collections.monsters[name] ??= { met: 0, slain: 0, felled: 0, firstBy: null };
  return collections.monsters[name];
}

function addEpithet(collections, epithet, hero) {
  collections.epithets[epithet] ??= { count: 0, firstBy: hero };
  collections.epithets[epithet].count += 1;
}

// ---- The Book of Epithets ----

// Every epithet in the book, humblest first, with the Lullaby-Singer last of all.
export function bookOfEpithets() {
  const ranked = [...epithets].sort((a, b) => a.rank - b.rank);
  return [...ranked, { epithet: finaleText.epithet, when: { finale: true } }];
}

// How to earn an epithet, like "Beat the Grumpy Badger 8 times in one life." Monsters no hero has
// met, places not yet discovered and verses before Act 2 are kept secret. `act` is the story's act.
export function epithetHint(entry, { world, collections, act }) {
  const kind = Object.keys(entry.when).find((key) => key !== 'count');
  const value = entry.when[kind];
  const count = entry.when.count ?? (typeof value === 'number' ? value : 1);
  if (kind === 'verses' && act < verseSettings.findFromAct) return epithetHints.secretStory;
  let template = epithetHints[kind];
  if (Array.isArray(template)) template = template[count === 1 ? 0 : 1];
  const words = { count: count.toLocaleString() };
  if (kind === 'slain') {
    const known = collections.monsters[value]?.met > 0 || collections.monsters[value]?.slain > 0;
    words.monster = known ? `the ${value}` : epithetHints.secretMonster;
  }
  if (kind === 'visits') {
    const place = world.places.find((option) => option.name === value);
    words.place = place && world.discovered.has(place.name) ? place.logName : epithetHints.secretPlace;
  }
  if (kind === 'found') words.rarity = withArticle(rarities.find((rarity) => rarity.id === value).name.toLowerCase());
  return fill(template, words);
}

// ---- Saves from before collections ----

// Collections worked out from the Hall of Champions. Heroes who still have their full log give
// the most: every monster they fought and beat, and their deeds, from which their epithets are
// worked out again. Heroes whose logs have faded give how they ended, and the deeds in their record.
export function collectionsFromRecords(lives = []) {
  const collections = newCollections();
  // Longest names first, so "Nightmare Charger" isn't mistaken for something shorter.
  const names = monsters.filter((kind) => !kind.song).map((kind) => kind.name).sort((a, b) => b.length - a.length);
  const song = monsters.find((kind) => kind.song);
  const titles = bookOfEpithets().map((entry) => entry.epithet).sort((a, b) => b.length - a.length);
  // Which place each arrival line belongs to, and which loot color is which rarity.
  const arrivals = new Map(places.flatMap((place) => (place.arriveLines ?? []).map((line) => [line, place.name])));
  const rarityByColor = new Map(rarities.map((rarity) => [rarity.color, rarity.id]));
  const faded = new RegExp(`^${eventText.blessingFaded.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace('{blessing}', '.*')}$`);
  for (const record of lives) {
    const met = {};
    const slain = {};
    const tally = newTally();
    const earned = new Set();
    const add = (counts, name) => { counts[name] = (counts[name] ?? 0) + 1; };
    for (const line of record.log ?? []) {
      if (!Array.isArray(line)) continue;
      const [kind, , text = '', color] = line;
      if (kind === 'epithet') {
        const title = titles.find((option) => text.includes(option));
        if (title) earned.add(title);
      } else if (kind === 'fight' || kind === 'victory') {
        const name = names.find((option) => text.includes(option));
        if (name) add(kind === 'fight' ? met : slain, name);
      } else if (kind === 'arrive' && arrivals.has(text)) add(tally.visits, arrivals.get(text));
      else if (kind === 'loot' && rarityByColor.has(color)) add(tally.found, rarityByColor.get(color));
      else if (kind === 'potion') tally.potions += 1;
      else if (kind === 'grave') tally.respects += 1;
      else if (kind === 'shard') tally.shards += 1;
      else if (kind === 'event' && !faded.test(text)) tally.events += 1;
    }
    // Every epithet the hero's deeds earned, worked out again (the log only names the grandest).
    const hero = { level: record.level ?? 1, goldFound: record.goldFound ?? 0, skills: record.skills ?? {} };
    Object.assign(tally, { slain, dungeons: record.dungeonsCleared ?? 0, castles: record.castleConquered ? 1 : 0, verses: record.versesFound ?? 0 });
    for (const epithet of earnedEpithets({ hero, tally, monstersSlain: record.monstersSlain ?? 0 })) earned.add(epithet);
    if (titles.includes(record.epithet)) earned.add(record.epithet);
    if (record.ending === 'sang' && song) {
      add(met, song.name);
      add(slain, song.name);
    }
    const killer = record.ending === 'died' && monsters.find((kind) => kind.name === record.cause);
    for (const name of new Set([...Object.keys(met), ...Object.keys(slain), ...(killer ? [killer.name] : [])])) {
      const entry = monsterEntry(collections, name);
      // (A fight's opening line isn't always logged, so a hero met at least what they beat.)
      entry.met += Math.max(met[name] ?? 0, slain[name] ?? 0, killer?.name === name ? 1 : 0);
      entry.slain += slain[name] ?? 0;
      if (slain[name]) entry.firstBy ??= record.name;
    }
    if (killer) monsterEntry(collections, killer.name).felled += 1;
    for (const epithet of earned) addEpithet(collections, epithet, record.name);
  }
  return collections;
}
