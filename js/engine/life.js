// One hero's life: the clock, wandering between places, fights, the adventure log, and how it ends.
import {
  lifeClock, seasons, travel, wandering,
  startLines, departLines, milestoneLines, retireLines, statusLines,
} from '../../data/life.js';
import { experience, encounters, blows, healing, levelUpLines } from '../../data/combat.js';
import { slots, loot, potions, lootLines } from '../../data/items.js';
import { skills, skillPicks, skillLines } from '../../data/skills.js';
import { classes, classLines } from '../../data/classes.js';
import { monsters } from '../../data/monsters.js';
import { deedLines, deedRarities } from '../../data/records.js';
import { regions } from '../../data/regions.js';
import { createRng, drawFromDeck } from './rng.js';
import { createHero, tryLevelUp, equip, learnSkill, takeClass, refreshStats } from './hero.js';
import { createMonster, monsterWords, blowWait, strike } from './combat.js';
import { createItem, itemWorth, itemPrice, sellValue, itemWords, rarityOf } from './items.js';
import {
  activeSkills, evolutionAt, isSkillPickLevel, skillOffers, classOffers, autoPick, classById, skillByName,
} from './skills.js';
import { findPath, terrainAt } from './map.js';
import { emit } from './game-events.js';
import { fill, capitalize, withArticle } from './text.js';

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
    regionId: home.region,
    startTown: home,
    lastTown: home,     // the town the hero visited most recently
    at: home,           // the place the hero is at, or null while walking
    destination: null,  // where the hero is walking to
    path: [],           // tiles still to walk
    step: null,         // the step in progress: { from, to, progress (0 to 1), seconds }
    restLeft: 0,        // seconds of rest left before setting off again
    fight: null,        // the fight in progress, if any
    elapsed: 0,         // game seconds lived (at 1× speed, not counting pauses)
    seasonsPassed: 0,
    sinceWandering: 0,  // seconds of walking since the last wandering line
    sinceFight: 0,      // seconds of walking since the last fight
    choices: [],        // choices waiting for the player: { kind: 'skill' or 'class', level, options }
    begun: false,       // false until the player taps Begin
    monstersSlain: 0,
    deed: null,         // the greatest deed so far: { score, text }
    log: [],
    decks: {},          // shuffled decks of log lines, so lines don't repeat too soon
    ending: null,       // filled in when the life is over
  };
}

// Called when the player taps Begin.
export function beginLife(life) {
  life.begun = true;
  addLog(life, 'start', fill(life.rng.pick(startLines), { town: life.startTown.logName }));
  emit('life-start', { life });
  setOff(life, { announce: false });
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
  if (!life.destination) setOff(life, { announce: true });
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
    choice.options = choice.kind === 'class'
      ? classOffers(life.rng, life.hero, choice.tier)
      : skillOffers(life.rng, life.hero);
  }
  return choice;
}

// The option Auto-decide would take.
export function autoChoice(life) {
  return autoPick(life.hero, currentChoice(life));
}

export function makeChoice(life, index) {
  const choice = currentChoice(life);
  const option = choice.options[index];
  const { hero } = life;
  if (choice.kind === 'class') {
    takeClass(hero, option.id);
    addLog(life, 'class', fill(drawLine(life, 'class', classLines), { a: withArticle(option.name) }));
  } else {
    const rank = learnSkill(hero, option);
    const lines = rank === 1 ? skillLines.learned : skillLines.improved;
    addLog(life, 'skill', fill(drawLine(life, rank === 1 ? 'learned' : 'improved', lines), { skill: option.name, rank }));
  }
  life.choices.shift();
  emit('choice-made', { life, choice, option });
}

// What the hero strip says the hero is doing.
export function lifeStatus(life) {
  const { ending } = life;
  if (ending?.kind === 'died') return fill(statusLines.died, monsterWords(ending.monster));
  if (ending) return fill(statusLines.retired, { town: ending.town.logName });
  if (life.fight) return fill(statusLines.fighting, monsterWords(life.fight.monster));
  if (life.destination) return fill(statusLines.walking, { place: life.destination.logName });
  return fill(statusLines.resting, { place: life.at.logName });
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
    regionId: life.regionId,
    startTown: life.startTown.mark,
    lastTown: life.lastTown.mark,
    at: life.at?.mark ?? null,
    destination: life.destination?.mark ?? null,
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
    choices: life.choices.map((choice) => ({
      ...choice,
      options: choice.options?.map((option) => (choice.kind === 'class' ? option.id : option.name)),
    })),
    begun: life.begun,
    monstersSlain: life.monstersSlain,
    deed: life.deed,
    log: life.log,
    decks: life.decks,
  };
}

// Rebuilds a life from saved data. Anything the data files no longer have (a renamed skill,
// a removed place) is quietly dropped rather than breaking the game.
export function unpackLife(world, data) {
  const placeByMark = (mark) => world.places.find((place) => place.mark === mark) ?? null;
  const firstTown = world.places.find((place) => place.kind === 'town');
  const hero = structuredClone(data.hero);
  for (const name of Object.keys(hero.skills)) if (!skillByName(name)) delete hero.skills[name];
  if (hero.class && !classById(hero.class)) hero.class = null;
  refreshStats(hero);

  const destination = placeByMark(data.destination);
  const at = placeByMark(data.at) ?? (destination ? null : firstTown);
  const kind = data.fight && monsters.find((option) => option.name === data.fight.monster.kind);
  const fight = kind
    ? {
      ...data.fight,
      monster: { ...data.fight.monster, kind },
      cooldowns: new Map(data.fight.cooldowns),
    }
    : null;
  const choices = data.choices.map((choice) => {
    const options = choice.options?.map((name) => (choice.kind === 'class'
      ? classes.find((option) => option.id === name)
      : skills.find((option) => option.name === name)));
    return { ...choice, options: options?.every(Boolean) ? options : undefined }; // redrawn if any went missing
  });

  return {
    world,
    rng: createRng(data.rngState),
    hero,
    regionId: regions[data.regionId] ? data.regionId : firstTown.region,
    startTown: placeByMark(data.startTown) ?? firstTown,
    lastTown: placeByMark(data.lastTown) ?? firstTown,
    at,
    destination,
    path: destination ? data.path : [],
    step: destination ? data.step : null,
    restLeft: data.restLeft,
    fight,
    elapsed: data.elapsed,
    seasonsPassed: data.seasonsPassed,
    sinceWandering: data.sinceWandering,
    sinceFight: data.sinceFight,
    choices,
    begun: data.begun,
    monstersSlain: data.monstersSlain,
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
  addLog(life, 'arrive', drawLine(life, `arrive-${place.mark}`, place.arriveLines));
  if (place.kind === 'town') {
    life.lastTown = place;
    life.hero.hp = life.hero.stats.maxHp;
    visitShop(life, place);
  }
  const restSeasons = place.kind === 'town' ? travel.townRestSeasons : travel.landmarkRestSeasons;
  life.restLeft = restSeasons * lifeClock.secondsPerSeason;
  emit('arrive', { hero: life.hero, place });
}

function heal(life, seconds) {
  const hero = life.hero;
  const rate = healing.perSecond * (1 + (hero.effects.healing ?? 0));
  hero.hp = Math.min(hero.stats.maxHp, hero.hp + hero.stats.maxHp * rate * seconds);
}

function maybeWander(life, seconds) {
  life.sinceWandering += seconds;
  if (life.sinceWandering < wandering.minGapSeconds) return;
  if (!life.rng.chance(wandering.chancePerSecond * seconds)) return;
  life.sinceWandering = 0;
  addLog(life, 'wander', drawLine(life, 'wander', regions[life.regionId].wanderingLines));
}

// ---- Fights ----

// Checked each time the hero finishes a step. Longer steps (slow ground) are likelier to meet something.
function maybeStartFight(life, stepSeconds) {
  if (life.sinceFight < encounters.minGapSeconds) return false;
  if (!life.rng.chance(encounters.chancePerSecond * stepSeconds)) return false;
  const { hero } = life;
  const monster = createMonster(life.rng, life.regionId, hero.level);
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
  noteDeed(life, monster.level * (monster.kind.xp ?? 1), fill(deedLines.slew, monsterWords(monster)));
  const gold = Math.round(loot.goldPerMonsterLevel * monster.level * (0.5 + life.rng.next()) * (1 + (effects.gold ?? 0)));
  hero.gold += gold;
  hero.goldFound += gold;
  if (life.rng.chance(loot.dropChance + (effects.loot ?? 0))) {
    const item = createItem(life.rng, monster.level, { weightKey: 'dropWeight' });
    if (deedRarities.includes(item.rarity)) noteDeed(life, item.level * rarityOf(item).strength, fill(deedLines.found, itemWords(item)));
    takeItem(life, item, drawLine(life, 'found', lootLines.found), {});
  }
  if (hero.potions < potions.carry && life.rng.chance(loot.potionDropChance + (effects.potionFind ?? 0))) hero.potions += 1;
  emit('fight-end', { life, monster, won: true });
  hero.xp += Math.round(experience.perMonsterLevel * monster.level * (monster.kind.xp ?? 1) * (1 + (effects.xp ?? 0)));
  while (tryLevelUp(hero)) {
    addLog(life, 'level', fill(drawLine(life, 'level-up', levelUpLines), { level: hero.level }));
    emit('level-up', { hero });
    const evolution = evolutionAt(hero.level);
    if (evolution) life.choices.push({ kind: 'class', level: hero.level, tier: evolution.tier });
    if (isSkillPickLevel(hero.level)) life.choices.push({ kind: 'skill', level: hero.level });
  }
}

function die(life) {
  const { monster } = life.fight;
  const text = fill(drawLine(life, `death-${monster.kind.name}`, monster.kind.deathLines), monsterWords(monster));
  addLog(life, 'end', text);
  life.ending = { kind: 'died', text: capitalize(text), monster };
  emit('fight-end', { life, monster, won: false });
  emit('death', { life });
  emit('life-end', { life });
}

function drinkPotion(life) {
  const { hero } = life;
  hero.potions -= 1;
  const heals = potions.heals * (1 + (hero.effects.potionHealing ?? 0));
  hero.hp = Math.min(hero.stats.maxHp, hero.hp + hero.stats.maxHp * heals);
  addLog(life, 'potion', drawLine(life, 'drank', lootLines.drank));
  emit('potion', { life });
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
