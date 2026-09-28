// The story: which act the world is in, and the verses of the lullaby found so far.
// Found verses belong to the world, so they're saved with it and last across every hero:
// [{ id, hero, age }], oldest first. `world.actSeen` is the latest act whose interlude
// the player has seen.
import { storySettings, acts, sweetDreams } from '../../data/story.js';
import { verses, verseSettings } from '../../data/verses.js';
import { places, regions } from '../../data/regions.js';
import { checkEffects } from './skills.js';

// Check the data once at startup, so a typo shows a clear message.
for (const verse of verses) {
  const owner = `The verse "${verse.title ?? verse.id}" in data/verses.js`;
  const place = places.find((option) => option.name === verse.place);
  if (!place || !['dungeon', 'castle'].includes(place.kind)) throw new Error(`${owner} is hidden in "${verse.place}", which needs to be a dungeon or castle in data/regions.js.`);
  if (!regions[verse.region]) throw new Error(`${owner} is in the region "${verse.region}", which isn't in data/regions.js.`);
  if (!verse.lines?.length) throw new Error(`${owner} needs some lines.`);
  verse.skill.ranks.forEach((rank, i) => checkEffects(rank, `${owner} (rank ${i + 1})`));
  if (verses.filter((other) => other.id === verse.id).length > 1) throw new Error(`There are two verses with the id "${verse.id}" in data/verses.js.`);
}
for (const act of acts.slice(1)) {
  if (!act.interlude?.title || !act.interlude?.body) throw new Error(`Act ${act.act} in data/story.js needs an interlude with a title and a body.`);
}
for (const name of Object.keys(sweetDreams.rumors)) {
  if (!places.some((place) => place.name === name)) throw new Error(`sweetDreams in data/story.js has rumors for "${name}", which isn't a place in data/regions.js.`);
}

// The act the world is in, from what heroes have achieved. Once the lullaby has been sung
// (see finale.js), it's Act 4, Sweet Dreams, for good.
export function currentAct(world) {
  if (world.finale) return 4;
  if (world.conquered.length < storySettings.act2Castles) return 1;
  if (world.verses.length < storySettings.act3Verses) return 2;
  return 3;
}

export function actInfo(number) {
  return acts.find((act) => act.act === number);
}

// True while dream-mist covers a region: for good (`sealed`), or until the story reaches the
// act it opens in (`opensInAct`).
export function isSealed(world, regionId) {
  const region = regions[regionId];
  return Boolean(region.sealed) || (region.opensInAct ?? 0) > currentAct(world);
}

// The regions whose mist lifts when this act begins.
export function regionsOpeningIn(act) {
  return Object.values(regions).filter((region) => region.opensInAct === act && !region.sealed);
}

// The acts that have begun since the player last saw an interlude, oldest first.
export function unseenActs(world) {
  const now = currentAct(world);
  return acts.filter((act) => act.act > (world.actSeen ?? 1) && act.act <= now);
}

// ---- Verses ----

export function verseById(id) {
  return verses.find((verse) => verse.id === id) ?? null;
}

// The ids of the verses found so far.
export function foundVerseIds(world) {
  return world.verses.map((found) => found.id);
}

// The verse still waiting at a place, if the lullaby is known yet and it hasn't been found.
export function lostVerseAt(world, placeName) {
  if (currentAct(world) < verseSettings.findFromAct) return null;
  return verses.find((verse) => verse.place === placeName && !world.verses.some((found) => found.id === verse.id)) ?? null;
}

// Keeps a verse, for good.
export function keepVerse(world, verse, hero) {
  world.verses.push({ id: verse.id, hero: hero.name, age: hero.age });
}

// Debug: moves the story on to the next act, by conquering a castle (for Act 2) or finding
// verses (for Act 3, and then for the finale), or by singing the song (for Act 4), in the name
// of "Debug". This changes the save for good.
export function skipToNextAct(world) {
  const act = currentAct(world);
  if (act === 1) {
    const castle = places.find((place) => place.kind === 'castle' && !isSealed(world, place.region)
      && !world.conquered.some((entry) => entry.place === place.name));
    if (castle) world.conquered.push({ place: castle.name, hero: 'Debug', age: 0 });
  } else if (act === 2) {
    for (const verse of verses) {
      if (currentAct(world) === 3) break;
      if (!world.verses.some((found) => found.id === verse.id)) world.verses.push({ id: verse.id, hero: 'Debug', age: 0 });
    }
  } else if (act === 3 && world.verses.length < verses.length) {
    // In Act 3, the rest of the verses, which opens the way into the finale.
    for (const verse of verses) {
      if (!world.verses.some((found) => found.id === verse.id)) world.verses.push({ id: verse.id, hero: 'Debug', age: 0 });
    }
  } else if (act === 3) {
    // With every verse found, the song is sung, and Act 4 begins.
    world.finale = { hero: 'Debug', epithet: '', age: 0 };
  }
}

// Found verses read from the save. Verses since removed from the data are dropped.
export function loadVerses(saved = []) {
  return saved.filter((found) => verseById(found.id));
}
