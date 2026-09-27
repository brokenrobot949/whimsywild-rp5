// One hero's life: the clock, wandering between places, the adventure log, and how it ends.
import {
  lifeClock, seasons, travel, wandering,
  startLines, departLines, milestoneLines, retireLines, statusLines,
} from '../../data/life.js';
import { regions } from '../../data/regions.js';
import { createRng, createDeck } from './rng.js';
import { createHero } from './hero.js';
import { findPath, terrainAt } from './map.js';
import { emit } from './game-events.js';
import { fill, capitalize } from './text.js';

export function createLife(world, seed) {
  const rng = createRng(seed);
  const hero = createHero(seed, rng);
  const home = world.places.find((place) => place.kind === 'town');
  hero.x = home.x;
  hero.y = home.y;
  return {
    world,
    rng,
    hero,
    region: regions[home.region],
    startTown: home,
    lastTown: home,     // the town the hero visited most recently
    at: home,           // the place the hero is at, or null while walking
    destination: null,  // where the hero is walking to
    path: [],           // tiles still to walk
    step: null,         // the step in progress: { from, to, progress (0 to 1), seconds }
    restLeft: 0,        // seconds of rest left before setting off again
    elapsed: 0,         // game seconds lived (at 1× speed, not counting pauses)
    seasonsPassed: 0,
    sinceWandering: 0,  // seconds of walking since the last wandering line
    log: [],
    decks: new Map(),   // shuffled decks of log lines, so lines don't repeat too soon
    ending: null,       // filled in when the life is over
  };
}

// Called when the player taps Begin.
export function beginLife(life) {
  addLog(life, 'start', fill(life.rng.pick(startLines), { town: life.startTown.logName }));
  emit('life-start', { life });
  setOff(life, { announce: false });
}

// Moves the life forward by a few game seconds.
export function stepLife(life, seconds) {
  if (life.ending) return;
  life.elapsed += seconds;
  advanceClock(life);
  if (life.ending) return;
  if (life.restLeft > 0) {
    life.restLeft = Math.max(0, life.restLeft - seconds);
    return;
  }
  if (!life.destination) setOff(life, { announce: true });
  maybeWander(life, seconds);
  walk(life, seconds);
}

// What the hero strip says the hero is doing.
export function lifeStatus(life) {
  if (life.ending) return fill(statusLines.retired, { town: life.ending.town.logName });
  if (life.destination) return fill(statusLines.walking, { place: life.destination.logName });
  return fill(statusLines.resting, { place: life.at.logName });
}

// A short summary of a finished life, kept in the save for the playtest log
// (and, later, the Hall of Champions).
export function lifeRecord(life) {
  const { hero, ending } = life;
  return {
    name: hero.name,
    epithet: hero.epithet,
    seed: hero.seed,
    startTown: life.startTown.name,
    ending: ending.kind,
    endingText: ending.text,
    age: hero.age,
    level: hero.level,
    gameSeconds: Math.round(life.elapsed * 10) / 10,
    endedAt: new Date().toISOString(),
  };
}

// ---- The clock ----

function advanceClock(life) {
  // The tiny extra allows for rounding in the running total of seconds.
  const due = Math.floor(life.elapsed / lifeClock.secondsPerSeason + 1e-9);
  while (life.seasonsPassed < due && !life.ending) {
    life.seasonsPassed += 1;
    const hero = life.hero;
    hero.season = (hero.season + 1) % seasons.length;
    if (hero.season === 0) haveBirthday(life);
    emit('season', { hero });
  }
}

function haveBirthday(life) {
  const hero = life.hero;
  hero.age += 1;
  emit('birthday', { hero });
  if (milestoneLines[hero.age]) addLog(life, 'milestone', milestoneLines[hero.age]);
  if (hero.age >= lifeClock.retireAge) retire(life);
}

function retire(life) {
  const town = life.lastTown;
  const text = fill(life.rng.pick(retireLines), { town: town.logName });
  addLog(life, 'end', text);
  life.ending = { kind: 'retired', text: capitalize(text), town };
  emit('life-end', { life });
}

// ---- Travel ----

function setOff(life, { announce }) {
  const from = life.at;
  const destination = life.rng.pick(life.world.places.filter((place) => place !== from));
  life.path = findPath(life.world, life.hero, destination);
  life.destination = destination;
  life.at = null;
  if (announce && from.kind === 'town') {
    addLog(life, 'depart', fill(drawLine(life, 'depart', departLines), { town: from.logName, place: destination.logName }));
  }
  emit('depart', { hero: life.hero, from, to: destination });
}

function walk(life, seconds) {
  const hero = life.hero;
  let time = seconds;
  while (time > 0 && life.destination) {
    if (!life.step) {
      const to = life.path.shift();
      const cost = terrainAt(life.world, to.x, to.y).cost;
      life.step = { from: { x: hero.x, y: hero.y }, to, progress: 0, seconds: travel.secondsPerTile * cost };
    }
    const step = life.step;
    const needed = (1 - step.progress) * step.seconds;
    if (time < needed) {
      step.progress += time / step.seconds;
      return;
    }
    time -= needed;
    hero.x = step.to.x;
    hero.y = step.to.y;
    life.step = null;
    if (life.path.length === 0) arrive(life);
  }
}

function arrive(life) {
  const place = life.destination;
  life.destination = null;
  life.at = place;
  if (place.kind === 'town') life.lastTown = place;
  addLog(life, 'arrive', drawLine(life, `arrive-${place.mark}`, place.arriveLines));
  const restSeasons = place.kind === 'town' ? travel.townRestSeasons : travel.landmarkRestSeasons;
  life.restLeft = restSeasons * lifeClock.secondsPerSeason;
  emit('arrive', { hero: life.hero, place });
}

function maybeWander(life, seconds) {
  life.sinceWandering += seconds;
  if (life.sinceWandering < wandering.minGapSeconds) return;
  if (!life.rng.chance(wandering.chancePerSecond * seconds)) return;
  life.sinceWandering = 0;
  addLog(life, 'wander', drawLine(life, 'wander', life.region.wanderingLines));
}

// ---- The log ----

function drawLine(life, deckName, lines) {
  if (!life.decks.has(deckName)) life.decks.set(deckName, createDeck(life.rng, lines));
  return life.decks.get(deckName)();
}

function addLog(life, kind, text) {
  const { hero } = life;
  const stamp = `${seasons[hero.season]}, age ${hero.age}`;
  const entry = { kind, stamp, text, line: `${stamp}: ${text}` };
  life.log.push(entry);
  emit('log', { entry });
}
