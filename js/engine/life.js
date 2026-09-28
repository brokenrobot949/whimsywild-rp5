// One hero's life: the clock, wandering between places, fights, the adventure log, and how it ends.
import {
  lifeClock, seasons, travel, wandering,
  startLines, departLines, milestoneLines, retireLines, statusLines, discoveryLines, recruits,
} from '../../data/life.js';
import { worldSettings } from '../../data/world.js';
import { experience, encounters, blows, healing, levelUpLines } from '../../data/combat.js';
import { slots, loot, potions, lootLines } from '../../data/items.js';
import { skills, skillPicks, skillLines } from '../../data/skills.js';
import { classes, classLines } from '../../data/classes.js';
import { monsters } from '../../data/monsters.js';
import { deedLines, deedRarities } from '../../data/records.js';
import { epithetLines } from '../../data/epithets.js';
import { newTally, newEpithet, closeCallShare } from './epithets.js';
import { regions } from '../../data/regions.js';
import { createRng, drawFromDeck } from './rng.js';
import { createHero, tryLevelUp, equip, learnSkill, takeClass, refreshStats, raiseToLevel } from './hero.js';
import { createMonster, monsterWords, blowWait, strike } from './combat.js';
import { createItem, itemWorth, itemPrice, sellValue, itemWords, rarityOf, scaleItem } from './items.js';
import { addGrave, graveNear } from './graves.js';
import { graveLines } from '../../data/graves.js';
import {
  activeSkills, evolutionAt, isSkillPickLevel, skillOffers, classOffers, autoPick, classById, skillByName,
} from './skills.js';
import { findPath, terrainAt, regionAt, isWalkable } from './map.js';
import { revealAround } from './fog.js';
import { rumorOffers, autoRumor, directionTo } from './rumors.js';
import { rumorSettings, rumorLines } from '../../data/rumors.js';
import { emit } from './game-events.js';
import { fill, capitalize, withArticle } from './text.js';

// The towns a new hero can start in: every town that's been discovered and isn't sealed.
export function startingTowns(world) {
  return world.places.filter((place) => place.kind === 'town' && world.discovered.has(place.name) && !regions[place.region].sealed);
}

// A new hero, not yet begun. `town` is where they start (the first town if left out);
// a later town starts them at its recruitment level, with modest gear.
export function createLife(world, seed, { town } = {}) {
  const rng = createRng(seed);
  const hero = createHero(seed, rng);
  const home = town ?? world.places.find((place) => place.kind === 'town' && !regions[place.region].sealed);
  hero.x = home.x;
  hero.y = home.y;
  const level = home.recruitLevel ?? 1;
  if (level > 1) {
    raiseToLevel(hero, level);
    for (const slot of recruits.gearSlots) equip(hero, createItem(rng, level, { slot, rarity: 'common' }));
    hero.hp = hero.stats.maxHp;
  }
  revealAround(world, home.x, home.y, worldSettings.fogRadius); // the hero can see their home town
  return {
    world,
    rng,
    hero,
    rolledName: hero.name, // the name the dice gave, kept in case the player types their own
    rerollsLeft: recruits.rerolls,
    regionId: home.region,
    startTown: home,
    lastTown: home,     // the town the hero visited most recently
    at: home,           // the place the hero is at, or null while walking
    destination: null,  // where the hero is walking to
    nextStop: null,     // where the hero will head next: a rumor chosen, or a town on the way home
    camping: false,     // true while camped out after a rumor, far from any town
    exploring: 0,       // nearby places explored since the last rumor's end
    recent: [],         // names of the last few places reached, newest first
    path: [],           // tiles still to walk
    step: null,         // the step in progress: { from, to, progress (0 to 1), seconds }
    restLeft: 0,        // seconds of rest left before setting off again
    fight: null,        // the fight in progress, if any
    elapsed: 0,         // game seconds lived (at 1× speed, not counting pauses)
    seasonsPassed: 0,
    sinceWandering: 0,  // seconds of walking since the last wandering line
    sinceFight: 0,      // seconds of walking since the last fight
    choices: [],        // choices waiting for the player: { kind: 'skill', 'class' or 'rumor', options, ... }
    begun: false,       // false until the player taps Begin
    monstersSlain: 0,
    tally: newTally(),  // counts of deeds, for epithets (see epithets.js)
    deed: null,         // the greatest deed so far: { score, text }
    log: [],
    decks: {},          // shuffled decks of log lines, so lines don't repeat too soon
    ending: null,       // filled in when the life is over
  };
}

// Called when the player taps Begin. A hero starting above level 1 first makes the skill
// and class choices they'd have made on the way, then hears the town's rumors.
export function beginLife(life) {
  life.begun = true;
  addLog(life, 'start', fill(life.rng.pick(startLines), { town: life.startTown.logName }));
  emit('life-start', { life });
  lookAround(life);
  for (let level = 2; level <= life.hero.level; level++) queueLevelChoices(life, level);
  askForRumor(life);
}

// The name typed on the New Hero card. An empty name goes back to the rolled one.
export function nameHero(life, typed) {
  const name = typed.trim().slice(0, recruits.nameLength);
  life.hero.name = name || life.rolledName;
}

// Moves the life forward by a few game seconds. Nothing happens while a choice is waiting.
export function stepLife(life, seconds) {
  if (life.ending || life.choices.length > 0) return;
  life.elapsed += seconds;
  advanceClock(life);
  if (life.fight) {
    fight(life, seconds);
    return;
  }
  // Retirement waits until any fight is over.
  if (life.hero.age >= lifeClock.retireAge) {
    retire(life);
    return;
  }
  heal(life, seconds);
  if (life.restLeft > 0) {
    life.restLeft = Math.max(0, life.restLeft - seconds);
    return;
  }
  if (!life.destination) {
    // Rested and ready: follow the next stop, or hear some rumors to choose one.
    if (!life.nextStop) {
      askForRumor(life);
      return;
    }
    setOff(life);
  }
  life.sinceFight += seconds;
  maybeWander(life, seconds);
  walk(life, seconds);
}

// ---- Choices ----

// The choice waiting for the player, if any. Its options are drawn when it's first looked at.
export function currentChoice(life) {
  const choice = life.choices[0];
  if (!choice) return null;
  if (!choice.options) {
    if (choice.kind === 'class') choice.options = classOffers(life.rng, life.hero, choice.tier);
    else if (choice.kind === 'rumor') choice.options = rumorOffers(life.rng, life);
    else choice.options = skillOffers(life.rng, life.hero);
  }
  return choice;
}

// The option Auto-decide would take.
export function autoChoice(life) {
  const choice = currentChoice(life);
  return choice.kind === 'rumor' ? autoRumor(life, choice.options) : autoPick(life.hero, choice);
}

export function makeChoice(life, index) {
  const choice = currentChoice(life);
  const option = choice.options[index];
  const { hero } = life;
  if (choice.kind === 'rumor') {
    life.nextStop = option.place;
    life.exploring = 0;
  } else if (choice.kind === 'class') {
    takeClass(hero, option.id);
    addLog(life, 'class', fill(drawLine(life, 'class', classLines), { a: withArticle(option.name) }));
  } else {
    const rank = learnSkill(hero, option);
    const lines = rank === 1 ? skillLines.learned : skillLines.improved;
    addLog(life, 'skill', fill(drawLine(life, rank === 1 ? 'learned' : 'improved', lines), { skill: option.name, rank }));
  }
  life.choices.shift();
  emit('choice-made', { life, choice, option });
  updateEpithet(life);
}

// What the hero strip says the hero is doing.
export function lifeStatus(life) {
  const { ending } = life;
  if (ending?.kind === 'died') return fill(statusLines.died, monsterWords(ending.monster));
  if (ending) return fill(statusLines.retired, { town: ending.town.logName });
  if (life.fight) return fill(statusLines.fighting, monsterWords(life.fight.monster));
  const { destination } = life;
  if (destination && !life.world.discovered.has(destination.name)) {
    return fill(statusLines.seeking, { direction: directionTo(life.hero, destination) });
  }
  if (destination) return fill(statusLines.walking, { place: destination.logName });
  return fill(life.camping ? statusLines.camping : statusLines.resting, { place: life.at.logName });
}

// A summary of a finished life, kept in the save for the Hall of Champions,
// the Chronicle and the debug playtest log.
export function lifeRecord(life) {
  const { hero, ending } = life;
  return {
    name: hero.name,
    epithet: hero.epithet,
    seed: hero.seed,
    startTown: life.startTown.name,
    ending: ending.kind,
    endingText: ending.text,
    cause: ending.monster?.kind.name ?? null,
    age: hero.age,
    level: hero.level,
    className: hero.class ? classById(hero.class).name : null,
    skills: { ...hero.skills },
    monstersSlain: life.monstersSlain,
    goldFound: hero.goldFound,
    deed: life.deed?.text ?? deedLines.none,
    gameSeconds: Math.round(life.elapsed * 10) / 10,
    endedAt: new Date().toISOString(),
    // The whole adventure log, kept compact: [kind, stamp, text, color].
    log: life.log.map((entry) => [entry.kind, entry.stamp, entry.text, entry.color ?? null]),
  };
}

// ---- Saving a life in progress ----

// Turns a life into plain data for the save. Places, monsters, skills and classes are saved
// by name, so the save stays small and still makes sense after the data files change.
export function packLife(life) {
  const { fight } = life;
  return {
    rngState: life.rng.state,
    hero: life.hero,
    rolledName: life.rolledName,
    rerollsLeft: life.rerollsLeft,
    regionId: life.regionId,
    startTown: life.startTown.name,
    lastTown: life.lastTown.name,
    at: life.at?.name ?? null,
    destination: life.destination?.name ?? null,
    nextStop: life.nextStop?.name ?? null,
    camping: life.camping,
    exploring: life.exploring,
    recent: life.recent,
    path: life.path,
    step: life.step,
    restLeft: life.restLeft,
    fight: fight && {
      ...fight,
      monster: { ...fight.monster, kind: fight.monster.kind.name },
      cooldowns: [...fight.cooldowns],
    },
    elapsed: life.elapsed,
    seasonsPassed: life.seasonsPassed,
    sinceWandering: life.sinceWandering,
    sinceFight: life.sinceFight,
    choices: life.choices.map((choice) => ({ ...choice, options: choice.options?.map(packOption(choice.kind)) })),
    begun: life.begun,
    monstersSlain: life.monstersSlain,
    tally: life.tally,
    deed: life.deed,
    log: life.log,
    decks: life.decks,
  };
}

// How each kind of choice's options are saved: classes by id, skills by name, rumors by place.
function packOption(kind) {
  if (kind === 'class') return (option) => option.id;
  if (kind === 'rumor') return (option) => ({ place: option.place.name, text: option.text });
  return (option) => option.name;
}

// Rebuilds a life from saved data. Anything the data files no longer have (a renamed skill,
// a removed place) is quietly dropped rather than breaking the game.
export function unpackLife(world, data) {
  const placeByName = (name) => world.places.find((place) => place.name === name) ?? null;
  const firstTown = world.places.find((place) => place.kind === 'town' && !regions[place.region].sealed);
  const hero = structuredClone(data.hero);
  for (const name of Object.keys(hero.skills)) if (!skillByName(name)) delete hero.skills[name];
  if (hero.class && !classById(hero.class)) hero.class = null;
  refreshStats(hero);

  let destination = placeByName(data.destination);
  let at = placeByName(data.at) ?? (destination ? null : firstTown);
  // If the map has changed since the save (say, a lake where a road was), find a new way there,
  // or if there's none, go back to the last town.
  let path = destination ? data.path : [];
  let step = destination ? data.step : null;
  const blocked = (spot) => !isWalkable(world, spot.y * world.width + spot.x);
  if (destination && (path.some(blocked) || (step && blocked(step.to)))) {
    path = findPath(world, hero, destination);
    step = null;
    if (!path) {
      at = placeByName(data.lastTown) ?? firstTown;
      destination = null;
      path = [];
      hero.x = at.x;
      hero.y = at.y;
    }
  }
  const kind = data.fight && monsters.find((option) => option.name === data.fight.monster.kind);
  const fight = kind
    ? {
      ...data.fight,
      monster: { ...data.fight.monster, kind },
      cooldowns: new Map(data.fight.cooldowns),
    }
    : null;
  const unpackOption = {
    class: (id) => classes.find((option) => option.id === id),
    skill: (name) => skills.find((option) => option.name === name),
    rumor: ({ place, text }) => {
      const found = placeByName(place);
      return found && !regions[found.region].sealed ? { place: found, text } : null;
    },
  };
  const choices = data.choices.map((choice) => {
    const options = choice.options?.map(unpackOption[choice.kind]);
    return { ...choice, options: options?.every(Boolean) ? options : undefined }; // redrawn if any went missing
  });

  return {
    world,
    rng: createRng(data.rngState),
    hero,
    rolledName: data.rolledName ?? hero.name,
    rerollsLeft: data.rerollsLeft ?? 0,
    regionId: regions[data.regionId] ? data.regionId : firstTown.region,
    startTown: placeByName(data.startTown) ?? firstTown,
    lastTown: placeByName(data.lastTown) ?? firstTown,
    at,
    destination,
    nextStop: placeByName(data.nextStop),
    camping: data.camping ?? false,
    exploring: data.exploring ?? 0,
    recent: data.recent ?? [],
    path,
    step,
    restLeft: data.restLeft,
    fight,
    elapsed: data.elapsed,
    seasonsPassed: data.seasonsPassed,
    sinceWandering: data.sinceWandering,
    sinceFight: data.sinceFight,
    choices,
    begun: data.begun,
    monstersSlain: data.monstersSlain,
    tally: { ...newTally(), ...data.tally }, // saves from before epithets have no tally
    deed: data.deed,
    log: data.log,
    decks: data.decks,
    ending: null,
  };
}

// ---- The clock ----

function advanceClock(life) {
  // The tiny extra allows for rounding in the running total of seconds.
  const due = Math.floor(life.elapsed / lifeClock.secondsPerSeason + 1e-9);
  while (life.seasonsPassed < due) {
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
}

// Heroes who reach retirement age away from a town settle in the last town they visited.
function retire(life) {
  const town = life.lastTown;
  const text = fill(life.rng.pick(retireLines), { town: town.logName });
  addLog(life, 'end', text);
  life.ending = { kind: 'retired', text: capitalize(text), town };
  emit('life-end', { life });
}

// ---- Travel ----

// Heroes pick where to go from rumors, in a town or at camp. The clock stops until they choose.
function askForRumor(life) {
  const town = life.at?.kind === 'town' ? life.at : null;
  life.choices.push({ kind: 'rumor', town: town?.name ?? null });
}

// Heads off to the next stop, logging the departure from a town or camp.
function setOff(life) {
  const { hero, world } = life;
  const from = life.at;
  const destination = life.nextStop;
  const direction = directionTo(hero, destination);
  const known = world.discovered.has(destination.name);
  if (life.camping) {
    addLog(life, 'depart', fill(drawLine(life, 'break-camp', rumorLines.breakCamp), { direction }));
  } else if (from?.kind === 'town') {
    const line = known ? drawLine(life, 'depart', departLines) : drawLine(life, 'into-fog', rumorLines.intoFog);
    addLog(life, 'depart', fill(line, { town: from.logName, place: destination.logName, direction }));
  }
  life.path = findPath(world, hero, destination);
  life.destination = destination;
  life.nextStop = null;
  life.camping = false;
  life.at = null;
  emit('depart', { hero, from, to: destination });
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
    lookAround(life);
    visitGrave(life);
    if (life.path.length === 0) {
      arrive(life);
      return;
    }
    if (maybeStartFight(life, step.seconds)) return;
  }
}

function arrive(life) {
  const place = life.destination;
  life.destination = null;
  life.at = place;
  addLog(life, 'arrive', drawLine(life, `arrive-${place.name}`, place.arriveLines));
  life.tally.visits[place.name] = (life.tally.visits[place.name] ?? 0) + 1;
  updateEpithet(life);
  life.recent = [place.name, ...life.recent.filter((name) => name !== place.name)].slice(0, rumorSettings.recentCount);
  let restSeasons = travel.landmarkRestSeasons;
  if (place.kind === 'town') {
    life.lastTown = place;
    life.hero.hp = life.hero.stats.maxHp;
    visitShop(life, place);
    restSeasons = travel.townRestSeasons;
  } else {
    // A rumor's end: explore somewhere nearby, then back to the nearest town if one is close,
    // otherwise make camp here.
    const nearby = life.exploring < rumorSettings.exploreNearby ? nearbyPlace(life, place) : null;
    const town = nearestTown(life, place);
    if (nearby) {
      life.exploring += 1;
      life.nextStop = nearby;
      addLog(life, 'depart', fill(drawLine(life, 'explore', rumorLines.explore), { place: nearby.logName }));
    } else if (town && Math.hypot(town.x - place.x, town.y - place.y) <= rumorSettings.campBeyond) {
      life.nextStop = town;
      addLog(life, 'depart', fill(drawLine(life, 'homeward', rumorLines.homeward), { town: town.logName }));
    } else {
      life.camping = true;
      addLog(life, 'camp', drawLine(life, 'camp', rumorLines.camp));
      restSeasons = rumorSettings.campSeasons;
    }
  }
  life.restLeft = restSeasons * lifeClock.secondsPerSeason;
  emit('arrive', { hero: life.hero, place });
}

// A discovered landmark close by, in the same region, that the hero hasn't just visited.
function nearbyPlace(life, from) {
  const close = life.world.places.filter((place) => place.kind === 'landmark'
    && place.region === from.region && life.world.discovered.has(place.name)
    && !life.recent.includes(place.name)
    && Math.hypot(place.x - from.x, place.y - from.y) <= rumorSettings.nearbyWithin);
  return close.length > 0 ? life.rng.pick(close) : null;
}

// The closest discovered town heroes can reach, as the crow flies.
function nearestTown(life, from) {
  const towns = life.world.places.filter((place) => place.kind === 'town'
    && life.world.discovered.has(place.name) && !regions[place.region].sealed);
  return towns.reduce((best, town) => (!best || Math.hypot(town.x - from.x, town.y - from.y) < Math.hypot(best.x - from.x, best.y - from.y) ? town : best), null);
}

function heal(life, seconds) {
  const hero = life.hero;
  const rate = healing.perSecond * (1 + (hero.effects.healing ?? 0));
  hero.hp = Math.min(hero.stats.maxHp, hero.hp + hero.stats.maxHp * rate * seconds);
}

// Lifts the fog around the hero, and logs any place seen for the first time ever.
// (The line is picked without the life's random numbers, so a life plays out the same
// however much of the world earlier heroes have explored.)
function lookAround(life) {
  const { hero, world } = life;
  for (const place of revealAround(world, hero.x, hero.y, worldSettings.fogRadius)) {
    const line = discoveryLines[world.discovered.size % discoveryLines.length];
    addLog(life, 'discovery', fill(line, { place: place.logName }));
    emit('discovery', { life, place });
  }
}

// Passing close to a grave whose heirloom still waits, the hero pays respects and takes it,
// remade for their own level. They wear it if it's better, or sell it if not.
function visitGrave(life) {
  const { hero, world } = life;
  const grave = graveNear(world, hero.x, hero.y);
  if (!grave) return;
  grave.claimedBy = hero.name;
  life.tally.respects += 1;
  const fallen = `${grave.name.split(' ')[0]} ${grave.epithet}`;
  addLog(life, 'grave', fill(drawLine(life, 'respects', graveLines.respects), { fallen }));
  const item = scaleItem(grave.heirloom, hero.level);
  const current = hero.gear[item.slot];
  if (!current || itemWorth(item) > itemWorth(current)) {
    takeItem(life, item, drawLine(life, 'heirloom-kept', graveLines.kept), {});
  } else {
    hero.gold += sellValue(item);
    addLog(life, 'loot', fill(drawLine(life, 'heirloom-sold', graveLines.sold), itemWords(item)), rarityOf(item).color);
  }
  emit('respects', { life, grave });
  updateEpithet(life);
}

function maybeWander(life, seconds) {
  life.sinceWandering += seconds;
  if (life.sinceWandering < wandering.minGapSeconds) return;
  if (!life.rng.chance(wandering.chancePerSecond * seconds)) return;
  life.sinceWandering = 0;
  const region = regionAt(life.world, life.hero.x, life.hero.y);
  const lines = regions[region]?.wanderingLines ?? [];
  if (lines.length > 0) addLog(life, 'wander', drawLine(life, `wander-${region}`, lines));
}

// ---- Fights ----

// Checked each time the hero finishes a step. Longer steps (slow ground) are likelier to meet something.
function maybeStartFight(life, stepSeconds) {
  if (life.sinceFight < encounters.minGapSeconds) return false;
  if (!life.rng.chance(encounters.chancePerSecond * stepSeconds)) return false;
  const { hero } = life;
  // Monsters come from the region the hero is walking through.
  const monster = createMonster(life.rng, regionAt(life.world, hero.x, hero.y) ?? life.regionId, hero.level);
  const spot = life.path[0]; // the monster stands on the next tile along the way
  life.fight = {
    monster,
    x: spot.x,
    y: spot.y,
    elapsed: 0,
    heroWait: hero.effects.firstStrike ? 0 : blowWait(hero.stats.speed) * blows.firstBlowWait,
    monsterWait: blowWait(monster.stats.speed) * blows.firstBlowWait,
    // Seconds until each active skill is ready. They start part-way charged.
    cooldowns: new Map(activeSkills(hero).map(({ skill, rank }) => [skill.name, rank.cooldown * (1 - skillPicks.startCharge)])),
    lastBlow: null,
  };
  addLog(life, 'fight', fill(drawLine(life, `meet-${monster.kind.name}`, monster.kind.meetLines), monsterWords(monster)));
  emit('fight-start', { life, monster });
  return true;
}

function fight(life, seconds) {
  const current = life.fight;
  current.elapsed += seconds;
  current.heroWait -= seconds;
  current.monsterWait -= seconds;
  for (const [name, wait] of current.cooldowns) current.cooldowns.set(name, wait - seconds);
  // Blows land in order of whose wait ran out first.
  while (life.fight && !life.ending && (current.heroWait <= 0 || current.monsterWait <= 0)) {
    if (current.heroWait <= current.monsterWait) {
      current.heroWait += blowWait(life.hero.stats.speed);
      heroTurn(life);
    } else {
      current.monsterWait += blowWait(current.monster.stats.speed);
      monsterStrike(life);
    }
  }
}

// On the hero's turn: a potion if badly hurt, otherwise a ready skill, otherwise a plain blow.
function heroTurn(life) {
  const { hero } = life;
  if (hero.potions > 0 && hero.hp < hero.stats.maxHp * potions.drinkBelow) {
    drinkPotion(life);
    return;
  }
  const skill = readySkill(life);
  if (skill) useSkill(life, skill);
  else heroStrike(life, 1);
}

// Heals come first when the hero is hurt enough; otherwise the ready attack with the
// longest cooldown (usually the biggest) goes first.
function readySkill(life) {
  const { hero } = life;
  const ready = activeSkills(hero).filter(({ skill }) => life.fight.cooldowns.get(skill.name) <= 0);
  const heal = ready.find(({ rank }) => rank.heal && hero.hp < hero.stats.maxHp * (rank.when ?? 0.6));
  if (heal) return heal;
  return ready.filter(({ rank }) => rank.strike).sort((a, b) => b.rank.cooldown - a.rank.cooldown)[0] ?? null;
}

function useSkill(life, { skill, rank }) {
  const { hero } = life;
  const current = life.fight;
  current.cooldowns.set(skill.name, rank.cooldown);
  if (rank.heal) {
    const amount = Math.min(hero.stats.maxHp - hero.hp, hero.stats.maxHp * rank.heal);
    hero.hp += amount;
    emit('skill', { life, skill, healed: Math.round(amount) });
    return;
  }
  let damage = 0;
  const multiplier = rank.strike * (1 + (hero.effects.skillDamage ?? 0));
  for (let hit = 0; hit < (rank.hits ?? 1) && life.fight; hit++) {
    const result = heroStrike(life, multiplier);
    damage += result.damage;
    if (rank.drain) hero.hp = Math.min(hero.stats.maxHp, hero.hp + result.damage * rank.drain);
  }
  if (life.fight && rank.stun) current.monsterWait += rank.stun;
  emit('skill', { life, skill, damage });
}

function heroStrike(life, multiplier) {
  const { hero } = life;
  const current = life.fight;
  const { monster } = current;
  const result = strike(life.rng, hero.stats, monster.stats, { multiplier, critBonus: hero.effects.critDamage ?? 0 });
  monster.hp = Math.max(0, monster.hp - result.damage);
  if (hero.effects.lifesteal) hero.hp = Math.min(hero.stats.maxHp, hero.hp + result.damage * hero.effects.lifesteal);
  current.lastBlow = { by: 'hero', at: current.elapsed, ...result };
  emit('hit', { life, by: 'hero', ...result });
  if (monster.hp <= 0) winFight(life);
  return result;
}

function monsterStrike(life) {
  const { hero } = life;
  const current = life.fight;
  const { monster } = current;
  const result = strike(life.rng, monster.stats, hero.stats, { extraDodge: hero.effects.dodge ?? 0 });
  hero.hp = Math.max(0, hero.hp - result.damage);
  if (hero.effects.thorns) monster.hp = Math.max(0, monster.hp - result.damage * hero.effects.thorns);
  current.lastBlow = { by: 'monster', at: current.elapsed, ...result };
  emit('hit', { life, by: 'monster', ...result });
  if (hero.hp <= 0) die(life);
  else if (monster.hp <= 0) winFight(life);
}

function winFight(life) {
  const { monster } = life.fight;
  const { hero } = life;
  const { effects } = hero;
  addLog(life, 'victory', fill(drawLine(life, `defeat-${monster.kind.name}`, monster.kind.defeatLines), monsterWords(monster)));
  life.fight = null;
  life.sinceFight = 0;
  life.monstersSlain += 1;
  life.tally.slain[monster.kind.name] = (life.tally.slain[monster.kind.name] ?? 0) + 1;
  if (hero.hp < hero.stats.maxHp * closeCallShare) life.tally.closeCalls += 1;
  noteDeed(life, monster.level * (monster.kind.xp ?? 1), fill(deedLines.slew, monsterWords(monster)));
  const gold = Math.round(loot.goldPerMonsterLevel * monster.level * (0.5 + life.rng.next())
    * (monster.kind.gold ?? 1) * (1 + (effects.gold ?? 0)));
  hero.gold += gold;
  hero.goldFound += gold;
  if (life.rng.chance(loot.dropChance + (effects.loot ?? 0))) {
    const item = createItem(life.rng, monster.level, { weightKey: 'dropWeight' });
    life.tally.found[item.rarity] = (life.tally.found[item.rarity] ?? 0) + 1;
    if (deedRarities.includes(item.rarity)) noteDeed(life, item.level * rarityOf(item).strength, fill(deedLines.found, itemWords(item)));
    takeItem(life, item, drawLine(life, 'found', lootLines.found), {});
  }
  if (hero.potions < potions.carry && life.rng.chance(loot.potionDropChance + (effects.potionFind ?? 0))) hero.potions += 1;
  emit('fight-end', { life, monster, won: true });
  hero.xp += Math.round(experience.perMonsterLevel * monster.level * (monster.kind.xp ?? 1) * (1 + (effects.xp ?? 0)));
  while (tryLevelUp(hero)) {
    addLog(life, 'level', fill(drawLine(life, 'level-up', levelUpLines), { level: hero.level }));
    emit('level-up', { hero });
    queueLevelChoices(life, hero.level);
  }
  updateEpithet(life);
}

// The class and skill choices that come with reaching a level.
function queueLevelChoices(life, level) {
  const evolution = evolutionAt(level);
  if (evolution) life.choices.push({ kind: 'class', level, tier: evolution.tier });
  if (isSkillPickLevel(level)) life.choices.push({ kind: 'skill', level });
}

function die(life) {
  const { monster } = life.fight;
  const text = fill(drawLine(life, `death-${monster.kind.name}`, monster.kind.deathLines), monsterWords(monster));
  addLog(life, 'end', text);
  const grave = addGrave(life.world, life.hero);
  life.ending = { kind: 'died', text: capitalize(text), monster, grave };
  emit('fight-end', { life, monster, won: false });
  emit('death', { life });
  emit('life-end', { life });
}

function drinkPotion(life) {
  const { hero } = life;
  hero.potions -= 1;
  const heals = potions.heals * (1 + (hero.effects.potionHealing ?? 0));
  hero.hp = Math.min(hero.stats.maxHp, hero.hp + hero.stats.maxHp * heals);
  life.tally.potions += 1;
  addLog(life, 'potion', drawLine(life, 'drank', lootLines.drank));
  emit('potion', { life });
  updateEpithet(life);
}

// Gives the hero a new epithet if their deeds have earned a grander one.
function updateEpithet(life) {
  const { hero } = life;
  const earned = newEpithet(life);
  if (!earned) return;
  hero.epithet = earned;
  const first = hero.name.split(' ')[0];
  addLog(life, 'epithet', fill(drawLine(life, 'epithet', epithetLines), { first, epithet: earned }));
  emit('epithet', { hero });
}

// ---- Gear and shopping ----

// The hero wears an item if it's better than what's in that slot, and sells whatever
// they don't keep (they carry it to the next market, so the gold comes straight away).
function takeItem(life, item, line, values) {
  const { hero } = life;
  const current = hero.gear[item.slot];
  if (current && itemWorth(item) <= itemWorth(current)) {
    hero.gold += sellValue(item);
    return;
  }
  const replaced = equip(hero, item);
  if (replaced) hero.gold += sellValue(replaced);
  addLog(life, 'loot', fill(line, { ...itemWords(item), ...values }), rarityOf(item).color);
  emit('equip', { hero, item });
}

// In town the hero tops up on potions, then buys the best upgrades they can afford.
function visitShop(life, town) {
  const { hero, rng } = life;
  const potionPrice = potions.pricePerLevel * hero.level;
  let bought = 0;
  while (hero.potions < potions.carry && hero.gold >= potionPrice) {
    hero.gold -= potionPrice;
    hero.potions += 1;
    bought += 1;
  }
  if (bought > 0) addLog(life, 'shop', fill(drawLine(life, 'potions-bought', lootLines.potionsBought), { town: town.logName }));

  // The shop stocks one item for each slot.
  const gain = (item) => itemWorth(item) - (hero.gear[item.slot] ? itemWorth(hero.gear[item.slot]) : 0);
  const stock = slots.map((slot) => createItem(rng, hero.level, { slot: slot.id, weightKey: 'shopWeight' }));
  for (;;) {
    const best = stock
      .filter((item) => gain(item) > 0 && itemPrice(item) <= hero.gold)
      .sort((a, b) => gain(b) - gain(a))[0];
    if (!best) break;
    stock.splice(stock.indexOf(best), 1);
    hero.gold -= itemPrice(best);
    takeItem(life, best, drawLine(life, 'bought', lootLines.bought), { town: town.logName });
  }
  emit('shop', { life, town });
}

// ---- The log ----

function drawLine(life, deckName, lines) {
  life.decks[deckName] ??= { pile: [], last: -1 };
  return lines[drawFromDeck(life.rng, life.decks[deckName], lines.length)];
}

// Keeps the greatest deed of the life: the one with the highest score.
function noteDeed(life, score, text) {
  if (!life.deed || score > life.deed.score) life.deed = { score, text };
}

// `color` is optional, for lines that should stand out (like rare finds).
function addLog(life, kind, text, color) {
  const { hero } = life;
  const stamp = `${seasons[hero.season]}, age ${hero.age}`;
  const entry = { kind, stamp, text, line: `${stamp}: ${text}`, color };
  life.log.push(entry);
  emit('log', { entry });
}
