// One hero's life: the clock, wandering between places, fights, the adventure log, and how it ends.
import {
  lifeClock, seasons, travel, wandering,
  startLines, departLines, milestoneLines, retireLines, statusLines, discoveryLines, recruits,
} from '../../data/life.js';
import { worldSettings } from '../../data/world.js';
import { experience, encounters, blows, healing, levelUpLines } from '../../data/combat.js';
import { slots, loot, potions, lootLines } from '../../data/items.js';
import { skillPicks, skillLines } from '../../data/skills.js';
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
import { eventSettings, eventText } from '../../data/events.js';
import { eventById, pickEvent, optionChance, autoEventOption } from './events.js';
import { rollBackground, originById, originItem } from './background.js';
import { lostLines } from '../../data/quirks.js';
import { dreamById } from './dreams.js';
import { addMentor, mentorsFor, drawGifts, perkShare } from './mentors.js';
import { retirement, mentorLines } from '../../data/mentors.js';
import { unfoundShard } from './shards.js';
import { planRooms, prizeRarity, hasRooms, roomRules, visitKind } from './dungeons.js';
import { isFinaleOpen, isFinaleEntrance, dreamRegion } from './finale.js';
import { finaleSettings, finaleText, finaleLines } from '../../data/finale.js';
import { isConquered, conquer, regionCalm } from './castles.js';
import { castleLines } from '../../data/castles.js';
import { currentAct, actInfo, lostVerseAt, keepVerse, foundVerseIds, isSealed, regionsOpeningIn } from './story.js';
import { verses, verseSettings, verseLines } from '../../data/verses.js';
import { legendGift, moodById } from './new-dream.js';
import { storySettings, tavernLines } from '../../data/story.js';
import { dungeonSettings, dungeonLines } from '../../data/dungeons.js';
import { shardSettings, shardLines } from '../../data/shards.js';
import {
  activeSkills, evolutionAt, isSkillPickLevel, skillOffers, classOffers, autoPick, classById, skillByName, quirkById,
  skillRank, describeEffects,
} from './skills.js';
import { findPath, terrainAt, regionAt, isWalkable, refreshSeals } from './map.js';
import { revealAround } from './fog.js';
import { rumorOffers, autoRumor, directionTo, levelGap, placeHarder } from './rumors.js';
import { rumorSettings, rumorLines } from '../../data/rumors.js';
import { emit } from './game-events.js';
import { fill, capitalize, withArticle } from './text.js';

// The towns a new hero can start in: every town that's been discovered and isn't sealed.
export function startingTowns(world) {
  return world.places.filter((place) => place.kind === 'town' && world.discovered.has(place.name) && !isSealed(world, place.region));
}

// A new hero, not yet begun. `town` is where they start (the first town if left out);
// a later town starts them at its recruitment level, with modest gear. `dream` is the id of
// tonight's dream (see dreams.js), which belongs to the world rather than the hero's seed.
export function createLife(world, seed, { town, dream = null } = {}) {
  const rng = createRng(seed);
  const hero = createHero(seed, rng);
  hero.dream = dream;
  // The origin nudges one tag and gives a starting item; the quirk's effects apply from the start.
  Object.assign(hero, rollBackground(rng));
  const tremorsAt = scheduleTremors(rng);
  const origin = originById(hero.origin);
  hero.tags[origin.tag] += 1;
  const home = town ?? world.places.find((place) => place.kind === 'town' && !isSealed(world, place.region));
  hero.x = home.x;
  hero.y = home.y;
  // Each of the town's newest mentors gives a gift, drawn at random (see mentors.js).
  const gifts = drawGifts(rng, mentorsFor(world, home.name));
  const recruitLevel = home.recruitLevel ?? 1;
  const level = recruitLevel + gifts.filter(({ gift }) => gift.kind === 'level').length;
  raiseToLevel(hero, level);
  equip(hero, originItem(origin, level));
  if (recruitLevel > 1) {
    // Recruits' gear, unless the origin's item is better.
    for (const slot of recruits.gearSlots) {
      const item = createItem(rng, level, { slot, rarity: 'common' });
      if (!hero.gear[slot] || itemWorth(item) > itemWorth(hero.gear[slot])) equip(hero, item);
    }
  }
  hero.mentors = gifts.map(({ mentor, gift }) => giveGift(rng, hero, mentor, gift, level));
  // New Game+: every hero lives under this dream's mood, and carries the legend's gift.
  hero.mood = world.cycle?.mood ?? 'gentle';
  if (world.cycle?.legend) hero.mentors.unshift(legendGift(world.cycle.legend));
  refreshStats(hero);
  hero.hp = hero.stats.maxHp;
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
    sinceEvent: 0,      // seconds of walking since the last road event
    eventsSeen: [],     // ids of the story events this hero has had (each happens once a life)
    lessonOffered: false, // true once the first skill pick (with any mentor's lesson) has been drawn
    tremorsAt,          // the season counts at which the Sleeper stirs this life, soonest first
    dungeon: null,      // the dungeon or castle being explored: { place, rooms, index, timer, askedAt }
    dungeonsDone: [],   // names of the dungeons this hero has cleared (each once a life)
    conquered: null,    // the name of the castle this hero conquered, if any
    choices: [],       // choices waiting for the player: { kind: 'skill', 'class', 'rumor' or 'event', ... }
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
  const dream = dreamById(life.hero.dream);
  if (dream) addLog(life, 'dream', dream.line);
  for (const mentor of life.hero.mentors) if (mentor.line) addLog(life, 'mentor', mentor.line);
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
  // Retirement waits until any fight is over, and the hero is out of any dungeon or castle.
  if (life.hero.age >= lifeClock.retireAge && !life.dungeon) {
    retire(life);
    return;
  }
  // Inside a dungeon or castle the hero goes room by room, and doesn't heal on their own.
  if (life.dungeon) {
    stepDungeon(life, seconds);
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
  life.sinceEvent += seconds;
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
    else if (choice.kind === 'event') choice.options = eventById(choice.event).options;
    else if (choice.kind === 'retire') choice.options = [{ id: 'retire' }, { id: 'stay' }];
    else if (choice.kind === 'retreat') choice.options = [{ id: 'press' }, { id: 'retreat' }];
    else {
      // The first skill pick always offers the mentor's lesson, if the hero has one.
      const lesson = life.lessonOffered ? null : mentorLesson(life.hero);
      choice.options = skillOffers(life.rng, life.hero, lesson?.skill, foundVerseIds(life.world));
      if (lesson) choice.lesson = { skill: lesson.skill.name, mentor: lesson.mentor };
      life.lessonOffered = true;
    }
  }
  return choice;
}

// The option Auto-decide would take.
export function autoChoice(life) {
  const choice = currentChoice(life);
  if (choice.kind === 'rumor') return autoRumor(life, choice.options);
  if (choice.kind === 'event') return autoEventOption(life.hero, eventById(choice.event));
  if (choice.kind === 'retire') return life.hero.age >= retirement.autoAt ? 0 : 1;
  if (choice.kind === 'retreat') {
    const rules = life.dungeon ? roomRules(visitKind(life.dungeon)) : dungeonSettings;
    return life.hero.hp < life.hero.stats.maxHp * rules.autoRetreatBelow ? 1 : 0;
  }
  return autoPick(life.hero, choice);
}

export function makeChoice(life, index) {
  const choice = currentChoice(life);
  const option = choice.options[index];
  const { hero } = life;
  if (choice.kind === 'rumor') {
    life.nextStop = option.place;
    life.exploring = 0;
    // A hero with a terrible sense of direction sometimes follows one of the other rumors
    // (though never to a region far beyond their level).
    const others = choice.options.filter((other) => other !== option && levelGap(hero.level, other.place.region, placeHarder(other.place, life.world)) <= 1);
    if (hero.effects.lostChance && others.length > 0 && life.rng.chance(hero.effects.lostChance)) {
      life.nextStop = life.rng.pick(others).place;
      addLog(life, 'depart', fill(drawLine(life, 'lost', lostLines), { place: life.nextStop.logName }));
    }
  } else if (choice.kind === 'event') {
    life.choices.shift();
    resolveEvent(life, eventById(choice.event), option);
    emit('choice-made', { life, choice, option });
    return;
  } else if (choice.kind === 'retire') {
    life.choices.shift();
    emit('choice-made', { life, choice, option });
    if (option.id === 'retire') retire(life); // the town they just arrived in is their last town
    else addLog(life, 'milestone', drawLine(life, 'stay', mentorLines.stay));
    return;
  } else if (choice.kind === 'retreat') {
    life.choices.shift();
    emit('choice-made', { life, choice, option });
    if (!life.dungeon) return;
    if (option.id === 'retreat') leaveDungeon(life, false);
    else addLog(life, 'milestone', drawLine(life, 'press-on', dungeonLines.pressOn));
    return;
  } else if (choice.kind === 'class') {
    takeClass(hero, option.id);
    addLog(life, 'class', fill(drawLine(life, 'class', classLines), { a: withArticle(option.name) }));
  } else {
    const rank = learnSkill(hero, option);
    if (choice.lesson?.skill === option.name) {
      addLog(life, 'skill', fill(drawLine(life, 'taught', mentorLines.taught), { skill: option.name, mentor: choice.lesson.mentor }));
    } else {
      const lines = rank === 1 ? skillLines.learned : skillLines.improved;
      addLog(life, 'skill', fill(drawLine(life, rank === 1 ? 'learned' : 'improved', lines), { skill: option.name, rank }));
    }
  }
  life.choices.shift();
  emit('choice-made', { life, choice, option });
  updateEpithet(life);
}

// What the hero strip says the hero is doing.
export function lifeStatus(life) {
  const { ending } = life;
  if (ending?.kind === 'died') return ending.monster ? fill(statusLines.died, monsterWords(ending.monster)) : statusLines.fell;
  if (ending?.kind === 'sang') return statusLines.sang;
  if (ending) return fill(statusLines.retired, { town: ending.town.logName });
  if (life.fight) return fill(statusLines.fighting, monsterWords(life.fight.monster));
  if (life.dungeon) {
    const { index, rooms } = life.dungeon;
    const kind = visitKind(life.dungeon);
    const line = kind === 'nightmare' ? statusLines.nightmare : kind === 'castle' ? statusLines.castle : statusLines.dungeon;
    return fill(line, { place: visitName(life.dungeon), room: Math.max(1, index), rooms: rooms.length });
  }
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
    cause: ending.monster?.kind.name ?? ending.cause ?? null, // a monster's name, or a story event's title
    age: hero.age,
    level: hero.level,
    className: hero.class ? classById(hero.class).name : null,
    classPath: hero.classPath.map((id) => classById(id).name), // like ['Fighter', 'Paladin']
    origin: originById(hero.origin)?.name ?? null,
    quirk: quirkById(hero.quirk)?.name ?? null,
    dream: dreamById(hero.dream)?.name ?? null,
    retiredTo: ending.town?.name ?? null,
    dungeonsCleared: life.dungeonsDone.length,
    castleConquered: life.conquered ?? null, // the castle this hero conquered, if any
    cycle: life.world.cycle?.number ?? 1,     // which dream they lived in (New Game+)
    versesFound: life.tally.verses ?? 0,
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
    sinceEvent: life.sinceEvent,
    eventsSeen: life.eventsSeen,
    lessonOffered: life.lessonOffered,
    tremorsAt: life.tremorsAt,
    dungeon: life.dungeon && { ...life.dungeon, place: life.dungeon.place.name },
    dungeonsDone: life.dungeonsDone,
    conquered: life.conquered,
    // Story event, retirement and retreat options never change, so they aren't saved.
    choices: life.choices.map((choice) => ({
      ...choice,
      options: ['event', 'retire', 'retreat'].includes(choice.kind) ? undefined : choice.options?.map(packOption(choice.kind)),
    })),
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
  const firstTown = world.places.find((place) => place.kind === 'town' && !isSealed(world, place.region));
  const hero = structuredClone(data.hero);
  for (const name of Object.keys(hero.skills)) if (!skillByName(name)) delete hero.skills[name];
  hero.classPath ??= hero.class ? [hero.class] : []; // saves from before advanced classes
  hero.classPath = hero.classPath.filter((id) => classById(id));
  hero.class = hero.classPath.at(-1) ?? null;
  hero.blessings ??= []; // saves from before story events
  hero.mentors ??= [];   // saves from before mentors
  hero.mood ??= 'gentle'; // saves from before New Game+
  if (!originById(hero.origin)) hero.origin = null; // saves from before origins, or one since removed
  if (!quirkById(hero.quirk)) hero.quirk = null;
  if (!dreamById(hero.dream)) hero.dream = null; // saves from before dreams, or one since removed
  refreshStats(hero);

  let destination = placeByName(data.destination);
  let at = placeByName(data.at) ?? (destination ? null : firstTown);
  // If the map has changed since the save (say, a lake where a road was), find a new way there,
  // or if there's none, go back to the last town.
  let path = destination ? data.path : [];
  let step = destination ? data.step : null;
  const blocked = (spot) => !isWalkable(world, spot.y * world.width + spot.x);
  if (destination && (path.some(blocked) || (step && blocked(step.to)))) {
    path = findPath(world, hero, destination, hero.level);
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
    skill: (name) => skillByName(name),
    rumor: ({ place, text }) => {
      const found = placeByName(place);
      return found && !isSealed(world, found.region) ? { place: found, text } : null;
    },
  };
  const choices = data.choices
    .filter((choice) => choice.kind !== 'event' || eventById(choice.event)) // an event since removed from the data
    .map((choice) => {
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
    sinceEvent: data.sinceEvent ?? 0,
    eventsSeen: data.eventsSeen ?? [],
    lessonOffered: data.lessonOffered ?? true, // heroes from before lessons have had their chance
    tremorsAt: data.tremorsAt ?? [],           // heroes from before tremors have none
    dungeon: data.dungeon && placeByName(data.dungeon.place) ? { ...data.dungeon, place: placeByName(data.dungeon.place) } : null,
    dungeonsDone: data.dungeonsDone ?? [],
    conquered: data.conquered ?? null,
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
    endBlessings(life);
  }
}

// Blessings from story events last a set number of seasons.
function endBlessings(life) {
  const { hero } = life;
  const ended = hero.blessings.filter((blessing) => blessing.until <= life.seasonsPassed);
  if (ended.length === 0) return;
  hero.blessings = hero.blessings.filter((blessing) => blessing.until > life.seasonsPassed);
  refreshStats(hero);
  for (const blessing of ended) addLog(life, 'event', fill(eventText.blessingFaded, { blessing: blessing.name }));
}

function haveBirthday(life) {
  const hero = life.hero;
  hero.age += 1;
  emit('birthday', { hero });
  if (milestoneLines[hero.age]) addLog(life, 'milestone', milestoneLines[hero.age]);
}

// A hero retires to the last town they visited, and settles there as a mentor. (Heroes choose
// to retire on arriving in a town; those who reach retirement age on the road go back to the last one.)
function retire(life) {
  const town = life.lastTown;
  const text = fill(life.rng.pick(retireLines), { town: town.logName });
  addLog(life, 'end', text);
  addMentor(life.world, life.hero, town.name);
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
  life.path = findPath(world, hero, destination, hero.level);
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
      life.step = { from: { x: hero.x, y: hero.y }, to, progress: 0, seconds: (travel.secondsPerTile * cost) / (1 + (hero.effects.travelSpeed ?? 0)) };
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
    if (maybeTremor(life)) return;
    if (maybeRoadEvent(life, step.seconds)) return;
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
  if (place.kind === 'town') {
    life.lastTown = place;
    life.hero.hp = life.hero.stats.maxHp;
    overhearTavernTalk(life);
    visitShop(life, place);
    life.restLeft = travel.townRestSeasons * lifeClock.secondsPerSeason;
  } else if (hasRooms(place) && !isDone(life, place)) {
    enterDungeon(life, place);
  } else if (isFinaleEntrance(life.world, place)) {
    enterDungeon(life, place, 'nightmare');
  } else {
    if (place.kind === 'dungeon') addLog(life, 'arrive', fill(drawLine(life, 'already-cleared', dungeonLines.alreadyCleared), { place: place.logName }));
    if (place.kind === 'castle') addLog(life, 'arrive', fill(drawLine(life, 'already-conquered', castleLines.alreadyConquered), { place: place.logName }));
    // A castle can still hold its verse if it fell before the lullaby was known.
    if (place.kind === 'castle') maybeFindVerse(life, place);
    maybeFindShard(life, place);
    moveOn(life, place);
  }
  emit('arrive', { hero: life.hero, place });
  if (place.kind !== 'town') return;
  // Old enough to settle down: the player chooses whether to retire here. Otherwise, perhaps an event.
  if (life.hero.age >= retirement.offerFrom) life.choices.push({ kind: 'retire', town: place.name });
  else if (life.rng.chance(eventSettings.townChance * dreamOf(life).eventRate)) queueEvent(life, 'town', place.region);
}

// At a rumor's end (a landmark, or a dungeon once it's done): explore somewhere nearby, then
// back to the nearest town if one is close, otherwise make camp here. Then a rest.
function moveOn(life, place) {
  let restSeasons = travel.landmarkRestSeasons;
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
  life.restLeft = restSeasons * lifeClock.secondsPerSeason;
}

// ---- Dungeons and castles ----
// Both are explored room by room. Castles have their own settings (see data/castles.js), end
// with a boss rather than a guardian, and once conquered stay conquered for every hero.

// True once this hero has cleared the dungeon, or anyone has conquered the castle.
function isDone(life, place) {
  return place.kind === 'castle' ? isConquered(life.world, place.name) : life.dungeonsDone.includes(place.name);
}

// `kind` is 'nightmare' for the finale, entered from its landmark; otherwise the place's own kind.
function enterDungeon(life, place, kind = place.kind) {
  life.dungeon = { place, kind, rooms: planRooms(life.rng, place, kind), index: 0, timer: 0, askedAt: null };
  life.restLeft = 0;
  if (kind === 'nightmare') addLog(life, 'story', drawLine(life, 'nightmare-enter', finaleLines.enter));
  emit('dungeon-enter', { life });
}

// How a visit is named in a sentence: "the Snoring Burrow", or "the Deepest Nightmare".
export function visitName(visit) {
  return visitKind(visit) === 'nightmare' ? finaleText.logName : visit.place.logName;
}

// Room by room: each takes a moment, and fights take as long as they take. Between rooms, a
// badly hurt hero is asked whether to press on.
function stepDungeon(life, seconds) {
  const { hero } = life;
  const dungeon = life.dungeon;
  const rules = roomRules(visitKind(dungeon));
  dungeon.timer += seconds;
  if (dungeon.timer < rules.roomSeconds) return;
  dungeon.timer = 0;
  if (dungeon.index >= dungeon.rooms.length) {
    leaveDungeon(life, true);
    return;
  }
  // (Once the guardian is beaten, the treasure is theirs: no need to ask.)
  const nextIsPrize = dungeon.rooms[dungeon.index] === 'prize';
  if (dungeon.index > 0 && !nextIsPrize && dungeon.askedAt !== dungeon.index && hero.hp < hero.stats.maxHp * rules.retreatBelow) {
    dungeon.askedAt = dungeon.index;
    life.choices.push({ kind: 'retreat', place: dungeon.place.name, left: dungeon.rooms.length - dungeon.index });
    return;
  }
  const room = dungeon.rooms[dungeon.index];
  dungeon.index += 1;
  enterRoom(life, room);
  emit('dungeon-room', { life, room });
}

function enterRoom(life, room) {
  const { hero, rng } = life;
  const { place } = life.dungeon;
  const kind = visitKind(life.dungeon);
  if (kind === 'nightmare') {
    enterDream(life, room);
    return;
  }
  const rules = roomRules(kind);
  const castle = kind === 'castle';
  const level = hero.level;
  if (room === 'fight' || room === 'guardian') {
    const guardian = room === 'guardian';
    const monster = createMonster(rng, place.region, level, {
      ...monsterOptions(life),
      kindName: guardian ? (castle ? place.boss : place.guardian) : undefined,
      extraLevels: guardian ? rules.guardianLevels : rules.fightLevels,
    });
    const lines = !guardian ? monster.kind.meetLines : castle ? castleLines.boss : dungeonLines.guardian;
    const words = { ...monsterWords(monster), place: place.logName };
    addLog(life, 'fight', fill(drawLine(life, guardian ? (castle ? 'boss' : 'guardian') : `meet-${monster.kind.name}`, lines), words));
    startFight(life, monster);
  } else if (room === 'treasure' || (room === 'event' && !queueEvent(life, 'dungeon', place.region))) {
    // (A strange room with no story event left to tell is just another treasure chest.)
    const gold = Math.round(rules.treasureGold * loot.goldPerMonsterLevel * level * (0.5 + rng.next()));
    hero.gold += gold;
    hero.goldFound += gold;
    addLog(life, 'loot', fill(drawLine(life, 'chest', dungeonLines.treasure), { gold }));
    if (rng.chance(rules.treasureItemChance)) {
      findItem(life, createItem(rng, level + rules.fightLevels, { weightKey: 'dropWeight' }), 'chest-item', dungeonLines.treasureItem);
    }
  } else if (room === 'rest') {
    hero.hp = Math.min(hero.stats.maxHp, hero.hp + hero.stats.maxHp * rules.restHeals);
    addLog(life, 'milestone', drawLine(life, 'alcove', dungeonLines.rest));
  } else if (room === 'prize') {
    const gold = Math.round(rules.prizeGold * loot.goldPerMonsterLevel * level);
    hero.gold += gold;
    hero.goldFound += gold;
    const lines = castle ? castleLines : dungeonLines;
    addLog(life, 'loot', fill(drawLine(life, castle ? 'hoard' : 'prize', lines.prize), { place: place.logName, gold }));
    findItem(life, createItem(rng, level + rules.guardianLevels, { rarity: prizeRarity(rng, kind) }), castle ? 'hoard-item' : 'prize-item', lines.prizeItem);
  }
}

// An item found in a dungeon: counted for epithets and deeds, and worn if it's better.
function findItem(life, item, deckName, lines) {
  life.tally.found[item.rarity] = (life.tally.found[item.rarity] ?? 0) + 1;
  if (deedRarities.includes(item.rarity)) noteDeed(life, item.level * rarityOf(item).strength, fill(deedLines.found, itemWords(item)));
  takeItem(life, item, drawLine(life, deckName, lines), {});
}

// The Deepest Nightmare, room by room: a dream from each region, where the hero gets their
// breath back and meets one of its monsters at their own level, then the song.
function enterDream(life, room) {
  const { hero, rng } = life;
  const region = dreamRegion(room);
  const options = monsterOptions(life);
  if (region) {
    hero.hp = Math.min(hero.stats.maxHp, hero.hp + hero.stats.maxHp * finaleSettings.dreamHeal);
    const theme = regions[region].dreamTheme.charAt(0).toLowerCase() + regions[region].dreamTheme.slice(1);
    addLog(life, 'dream', fill(drawLine(life, 'nightmare-dream', finaleLines.dream), { theme }));
    startFight(life, createMonster(rng, region, hero.level, { ...options, level: hero.level + finaleSettings.dreamLevels }));
  } else {
    addLog(life, 'story', finaleLines.song);
    startFight(life, createMonster(rng, life.dungeon.place.region, hero.level, {
      ...options, kindName: finaleSettings.nightmare, level: hero.level + finaleSettings.songLevels,
    }));
  }
}

// The song: as the Nightmare weakens, the hero sings the lullaby, a verse at a time. The last
// verse is saved for the end (see finishSong).
function singVerses(life, upTo = null) {
  const current = life.fight;
  const { monster } = current;
  const due = upTo ?? Math.min(verses.length - 1, Math.floor((1 - monster.hp / monster.stats.maxHp) * verses.length));
  while ((current.versesSung ?? 0) < due) {
    const verse = verses[current.versesSung ?? 0];
    current.versesSung = (current.versesSung ?? 0) + 1;
    addLog(life, 'verse', fill(finaleLines.sang, { title: verse.title }));
    emit('song-verse', { life, verse });
  }
}

// The last verse is sung, and the story ends: the dragon sleeps, and so does the hero's tale.
function finishSong(life) {
  const { hero, world } = life;
  const { monster } = life.fight;
  singVerses(life, verses.length);
  life.fight = null;
  life.dungeon = null;
  addLog(life, 'finale', finaleLines.slept);
  hero.epithet = finaleText.epithet;
  addLog(life, 'epithet', fill(finaleLines.remembered, { first: hero.name.split(' ')[0], epithet: hero.epithet }));
  emit('epithet', { hero });
  noteDeed(life, Number.MAX_SAFE_INTEGER, finaleText.deed);
  world.finale = { hero: hero.name, epithet: hero.epithet, age: hero.age };
  life.ending = { kind: 'sang', text: finaleText.ending };
  emit('fight-end', { life, monster, won: true });
  emit('finale', { life });
  emit('life-end', { life });
}

function leaveDungeon(life, cleared) {
  const { place } = life.dungeon;
  const kind = visitKind(life.dungeon);
  const name = visitName(life.dungeon);
  const rules = roomRules(kind);
  life.dungeon = null;
  const deed = regions[place.region].levels[1] * (rules.deedPerLevel ?? 0);
  const actBefore = currentAct(life.world);
  if (kind === 'nightmare') {
    // (The Nightmare is only ever left by turning back: finishing the song ends the life.)
    addLog(life, 'depart', drawLine(life, 'nightmare-retreat', finaleLines.retreat));
  } else if (cleared && kind === 'castle') {
    // The castle falls, for good.
    conquer(life.world, place, life.hero);
    life.conquered = place.name;
    life.tally.castles += 1;
    noteDeed(life, deed, fill(deedLines.conquered, { place: place.logName }));
    addLog(life, 'conquest', fill(drawLine(life, 'conquered', castleLines.conquered), { place: place.logName }));
    emit('castle-conquered', { life, place });
    noteNewAct(life, actBefore);
    maybeFindVerse(life, place);
    updateEpithet(life);
  } else if (cleared) {
    life.dungeonsDone.push(place.name);
    life.tally.dungeons += 1;
    noteDeed(life, deed, fill(deedLines.cleared, { place: place.logName }));
    addLog(life, 'arrive', fill(drawLine(life, 'cleared', dungeonLines.cleared), { place: place.logName }));
    maybeFindVerse(life, place);
    updateEpithet(life);
  } else {
    addLog(life, 'depart', fill(drawLine(life, 'retreat', dungeonLines.retreat), { place: name }));
  }
  emit('dungeon-leave', { life, place, kind, cleared });
  moveOn(life, place);
}

// ---- The story ----

// Once the lullaby is known (Act 2), a hero who clears a dungeon may find the verse hidden there,
// and a hero who conquers a castle always does. It's found for good.
function maybeFindVerse(life, place) {
  const verse = lostVerseAt(life.world, place.name);
  if (!verse) return;
  if (place.kind === 'dungeon' && !life.rng.chance(verseSettings.dungeonChance)) return;
  const actBefore = currentAct(life.world);
  keepVerse(life.world, verse, life.hero);
  life.tally.verses += 1;
  noteDeed(life, regions[place.region].levels[1] * verseSettings.deedPerLevel, fill(deedLines.verse, { title: verse.title }));
  addLog(life, 'verse', fill(drawLine(life, 'verse', verseLines.found), { title: verse.title }));
  if (isFinaleOpen(life.world)) {
    // The last verse: the way into the dragon's dream opens.
    addLog(life, 'story', finaleLines.opened);
    emit('finale-open', { life });
  }
  emit('verse', { life, verse });
  noteNewAct(life, actBefore);
  updateEpithet(life);
}

// When something a hero does begins a new act, the moment is marked in their log. (The act's
// interlude is shown before the next hero.)
function noteNewAct(life, actBefore) {
  const now = currentAct(life.world);
  if (now === actBefore) return;
  refreshSeals(life.world); // a new act can lift the mist from a region
  for (let act = actBefore + 1; act <= now; act++) {
    const info = actInfo(act);
    if (info?.omen) addLog(life, 'story', info.omen);
    for (const region of regionsOpeningIn(act)) if (region.openLine) addLog(life, 'story', region.openLine);
    emit('act', { life, act });
  }
}

// In town, a hero sometimes overhears what folk are saying, which changes with the story.
function overhearTavernTalk(life) {
  const act = currentAct(life.world);
  const lines = tavernLines[act] ?? [];
  if (lines.length === 0 || !life.rng.chance(storySettings.tavernChance)) return;
  addLog(life, 'tavern', drawLine(life, `tavern-${act}`, lines));
}

// At a landmark whose dream shard nobody has found yet, the hero may find it (though each hero
// finds only so many). It's kept for good.
function maybeFindShard(life, place) {
  if (life.tally.shards >= shardSettings.perLife) return;
  const shard = unfoundShard(life.world, place.name);
  if (!shard || !life.rng.chance(shardSettings.findChance)) return;
  life.world.shards.push({ id: shard.id, hero: life.hero.name });
  life.tally.shards += 1;
  addLog(life, 'shard', fill(drawLine(life, 'shard', shardLines), { title: shard.title }));
  emit('shard', { life, shard });
  updateEpithet(life);
}

// A discovered landmark close by, in the same region, that the hero hasn't just visited. (Never
// the way into the finale: only a rumor, chosen on purpose, leads a hero into the Nightmare.)
function nearbyPlace(life, from) {
  const close = life.world.places.filter((place) => place.kind === 'landmark'
    && place.region === from.region && life.world.discovered.has(place.name)
    && !life.recent.includes(place.name) && !isFinaleEntrance(life.world, place)
    && Math.hypot(place.x - from.x, place.y - from.y) <= rumorSettings.nearbyWithin);
  return close.length > 0 ? life.rng.pick(close) : null;
}

// The closest discovered town heroes can reach, as the crow flies, leaving out towns in regions
// far too dangerous for the hero (unless there are no others).
function nearestTown(life, from) {
  const open = life.world.places.filter((place) => place.kind === 'town'
    && life.world.discovered.has(place.name) && !isSealed(life.world, place.region));
  const safe = open.filter((town) => regions[town.region].levels[0] <= life.hero.level + travel.avoidRegionsAbove);
  const towns = safe.length > 0 ? safe : open;
  return towns.reduce((best, town) => (!best || Math.hypot(town.x - from.x, town.y - from.y) < Math.hypot(best.x - from.x, best.y - from.y) ? town : best), null);
}

function heal(life, seconds) {
  const hero = life.hero;
  const rate = healing.perSecond * (1 + (hero.effects.healing ?? 0));
  hero.hp = Math.min(hero.stats.maxHp, hero.hp + hero.stats.maxHp * rate * seconds);
}

// Lifts the fog around the hero (further, for a view from a height), and logs any place seen
// for the first time ever. (The line is picked without the life's random numbers, so a life
// plays out the same however much of the world earlier heroes have explored.)
function lookAround(life, radius = worldSettings.fogRadius) {
  const { hero, world } = life;
  for (const place of revealAround(world, hero.x, hero.y, radius)) {
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

// ---- Mentors ----

// Gives a new hero one mentor's gift (drawn in mentors.js), at the hero's starting level.
// Returns what the hero keeps of it: { name, gift, text, line, effects, skill }, where `effects`
// last all life and `skill` is a lesson promised for the first skill pick.
function giveGift(rng, hero, mentor, gift, level) {
  const first = mentor.name.split(' ')[0];
  const words = { first, skill: mentor.skill, class: classById(mentor.classId)?.name ?? '' };
  let effects = {};
  if (gift.kind === 'perk') {
    effects = perkShare(mentor, gift.share);
    const described = describeEffects(effects);
    words.effects = described.charAt(0).toLowerCase() + described.slice(1);
  } else if (gift.kind === 'gold') {
    words.gold = Math.round(gift.amount * loot.goldPerMonsterLevel * level);
    hero.gold += words.gold;
  } else if (gift.kind === 'potions') {
    words.count = gift.amount;
    hero.potions = Math.min(potionLimit(hero), hero.potions + gift.amount);
  } else if (gift.kind === 'gear') {
    const item = mentorItem(rng, hero, gift, first, level);
    Object.assign(words, { item: item.name, a: withArticle(item.name) });
  } else if (gift.kind === 'skillRank') {
    learnSkill(hero, skillByName(mentor.skill));
  }
  return {
    name: mentor.name,
    gift: gift.id,
    text: fill(gift.text, words),
    line: fill(gift.line, words),
    effects,
    skill: gift.kind === 'lesson' ? mentor.skill : null,
  };
}

// A mentor's old item, for an empty slot if there is one. The hero wears it if it's better
// than what they have, or sells it at the first market.
function mentorItem(rng, hero, gift, first, level) {
  const empty = slots.filter((slot) => !hero.gear[slot.id]);
  const slot = rng.pick(empty.length > 0 ? empty : slots).id;
  const item = createItem(rng, level, { slot, rarity: gift.rarity });
  item.name = fill(gift.itemName, { first, base: item.baseName });
  if (!hero.gear[slot] || itemWorth(item) > itemWorth(hero.gear[slot])) equip(hero, item);
  else hero.gold += sellValue(item);
  return item;
}

// The skill a mentor promised to teach, if the hero could still learn it.
function mentorLesson(hero) {
  const mentor = hero.mentors.find((option) => option.skill);
  const skill = mentor && skillByName(mentor.skill);
  if (!skill || skillRank(hero, skill) >= skill.ranks.length) return null;
  return { skill, mentor: mentor.name };
}

// ---- Tonight's dream ----

// What tonight's dream changes, with everything it leaves alone filled in.
function dreamOf(life) {
  const dream = dreamById(life.hero.dream);
  return {
    monsters: dream?.monsters ?? {},
    monsterStrength: dream?.monsterStrength ?? 0,
    fightRate: dream?.fightRate ?? 1,
    eventRate: dream?.eventRate ?? 1,
  };
}

// What shapes the monsters a hero meets: tonight's dream, and the regions whose castles have fallen.
function monsterOptions(life) {
  const dream = dreamOf(life);
  const restless = moodById(life.hero.mood).monsterStrength ?? 0; // a restless New Game+ dream
  return { weights: dream.monsters, strength: dream.monsterStrength + restless, calm: regionCalm(life.world) };
}

// A line in the log about the story, from outside the life (like choosing to let Sominus dream
// again, in the middle of a hero's life).
export function addStoryLine(life, text) {
  addLog(life, 'story', text);
}

// ---- Story events ----

// Checked each time the hero finishes a step, like fights.
function maybeRoadEvent(life, stepSeconds) {
  if (life.sinceEvent < eventSettings.roadMinGapSeconds) return false;
  if (!life.rng.chance(eventSettings.roadChancePerSecond * dreamOf(life).eventRate * stepSeconds)) return false;
  const { hero } = life;
  return queueEvent(life, 'road', regionAt(life.world, hero.x, hero.y) ?? life.regionId);
}

// ---- Tremors ----

// When the Sleeper will stir this life: one or two season counts at random ages, soonest first.
function scheduleTremors(rng) {
  const [fewest, most] = eventSettings.tremorsPerLife;
  const [earliest, latest] = eventSettings.tremorAges.map((age) => (age - lifeClock.startAge) * seasons.length);
  return Array.from({ length: rng.int(fewest, most) }, () => rng.int(earliest, latest)).sort((a, b) => a - b);
}

// Checked each time the hero finishes a step: once a tremor is due, the ground shakes and a
// tremor event follows.
function maybeTremor(life) {
  if (life.tremorsAt.length === 0 || life.seasonsPassed < life.tremorsAt[0]) return false;
  life.tremorsAt.shift();
  const { hero } = life;
  const event = pickEvent(life.rng, life, 'tremor', regionAt(life.world, hero.x, hero.y) ?? life.regionId);
  if (!event) return false;
  addLog(life, 'tremor', event.opening);
  emit('tremor', { life, event });
  life.eventsSeen.push(event.id);
  life.choices.push({ kind: 'event', event: event.id });
  return true;
}

// Picks an event that can happen here and waits for the player to choose. Returns true if one did.
function queueEvent(life, where, region) {
  const event = pickEvent(life.rng, life, where, region);
  if (!event) return false;
  life.sinceEvent = 0;
  life.eventsSeen.push(event.id);
  life.choices.push({ kind: 'event', event: event.id });
  return true;
}

// What happens after the player picks an option: it works or it doesn't, and then the outcome.
function resolveEvent(life, event, option) {
  const { hero } = life;
  const worked = option.chance === undefined || life.rng.chance(optionChance(hero, option));
  const outcome = worked ? option.success : option.failure;
  const fightLevel = hero.level; // before any experience from the outcome
  addLog(life, 'event', outcome.line);
  life.tally.events += 1;
  if (outcome.gold) {
    const gold = Math.round(outcome.gold * loot.goldPerMonsterLevel * hero.level);
    hero.gold = Math.max(0, hero.gold + gold);
    if (gold > 0) hero.goldFound += gold;
  }
  if (outcome.potions) hero.potions = Math.min(potionLimit(hero), hero.potions + outcome.potions);
  if (outcome.blessing) {
    const { name, effects, seasons: lasts } = outcome.blessing;
    hero.blessings = [...hero.blessings.filter((blessing) => blessing.name !== name), { name, effects, until: life.seasonsPassed + lasts }];
    refreshStats(hero);
  }
  if (outcome.item) {
    const { rarity, slot } = outcome.item === 'drop' ? {} : outcome.item;
    const item = createItem(life.rng, hero.level, { slot, rarity, weightKey: 'dropWeight' });
    life.tally.found[item.rarity] = (life.tally.found[item.rarity] ?? 0) + 1;
    if (deedRarities.includes(item.rarity)) noteDeed(life, item.level * rarityOf(item).strength, fill(deedLines.found, itemWords(item)));
    takeItem(life, item, drawLine(life, 'event-item', eventText.newItem), {});
  }
  if (outcome.rest) life.restLeft += outcome.rest * lifeClock.secondsPerSeason;
  if (outcome.hp) {
    hero.hp = Math.min(hero.stats.maxHp, hero.hp + hero.stats.maxHp * outcome.hp);
    if (hero.hp <= 0) {
      dieFromEvent(life, event);
      return;
    }
  }
  if (outcome.xp) gainXp(life, Math.round(outcome.xp * experience.perMonsterLevel * hero.level * (1 + (hero.effects.xp ?? 0))));
  if (outcome.reveal) lookAround(life, outcome.reveal);
  if (outcome.fight) {
    // A named monster, or one from the region the hero is in.
    const { monster: kindName, levels = 0 } = typeof outcome.fight === 'string' ? { monster: outcome.fight } : outcome.fight;
    const region = regionAt(life.world, hero.x, hero.y) ?? life.regionId;
    startFight(life, createMonster(life.rng, region, fightLevel, { ...monsterOptions(life), kindName, extraLevels: levels }));
  }
  emit('story-event', { life, event, option, worked });
  updateEpithet(life);
}

function dieFromEvent(life, event) {
  life.hero.hp = 0;
  const text = fill(eventText.died, { event: event.title.charAt(0).toLowerCase() + event.title.slice(1) });
  addLog(life, 'end', text);
  const grave = addGrave(life.world, life.hero);
  life.ending = { kind: 'died', text: capitalize(text), cause: event.title, grave };
  emit('death', { life });
  emit('life-end', { life });
}

// ---- Fights ----

// Checked each time the hero finishes a step. Longer steps (slow ground) are likelier to meet something.
function maybeStartFight(life, stepSeconds) {
  if (life.sinceFight < encounters.minGapSeconds) return false;
  if (!life.rng.chance(encounters.chancePerSecond * dreamOf(life).fightRate * stepSeconds)) return false;
  const { hero } = life;
  // Monsters come from the region the hero is walking through (and tonight's dream).
  const monster = createMonster(life.rng, regionAt(life.world, hero.x, hero.y) ?? life.regionId, hero.level, monsterOptions(life));
  addLog(life, 'fight', fill(drawLine(life, `meet-${monster.kind.name}`, monster.kind.meetLines), monsterWords(monster)));
  startFight(life, monster);
  return true;
}

// The monster stands on the next tile along the way (or, in a dungeon, beside the hero).
function startFight(life, monster) {
  const { hero } = life;
  const spot = life.path[0] ?? { x: hero.x + 1, y: hero.y };
  life.fight = {
    monster,
    x: spot.x,
    y: spot.y,
    elapsed: 0,
    heroWait: hero.effects.firstStrike ? 0 : blowWait(hero.stats.speed) * blows.firstBlowWait,
    monsterWait: blowWait(monster.stats.speed) * blows.firstBlowWait,
    // Seconds until each active skill is ready. They start part-way charged.
    cooldowns: new Map(activeSkills(hero).map(({ skill, rank }) => [skill.name, rank.cooldown * (1 - skillPicks.startCharge)])),
    // Seconds until a boss's special move is ready (the first comes about halfway through).
    specialWait: monster.kind.special ? monster.kind.special.every / 2 : null,
    versesSung: 0,       // verses of the lullaby sung so far, in the finale's song
    lastBlow: null,
  };
  emit('fight-start', { life, monster });
}

function fight(life, seconds) {
  const current = life.fight;
  current.elapsed += seconds;
  current.heroWait -= seconds;
  current.monsterWait -= seconds;
  for (const [name, wait] of current.cooldowns) current.cooldowns.set(name, wait - seconds);
  if (current.specialWait !== null && current.specialWait !== undefined) current.specialWait -= seconds;
  // Blows land in order of whose wait ran out first.
  while (life.fight && !life.ending && (current.heroWait <= 0 || current.monsterWait <= 0)) {
    if (current.heroWait <= current.monsterWait) {
      current.heroWait += blowWait(life.hero.stats.speed);
      heroTurn(life);
    } else {
      current.monsterWait += blowWait(current.monster.stats.speed);
      if (specialReady(current)) bossSpecial(life);
      else monsterStrike(life);
    }
  }
}

// A boss's special move is ready once its wait runs out (and, for a heal, once it's hurt enough).
function specialReady(current) {
  const move = current.monster.kind.special;
  if (!move || current.specialWait > 0) return false;
  return !move.heal || current.monster.hp < current.monster.stats.maxHp * (move.when ?? 1);
}

// The boss's special move, in place of a plain blow: a heal, or blows that may stun the hero
// (making them wait longer for their next blow) or heal the boss.
function bossSpecial(life) {
  const current = life.fight;
  const { monster } = current;
  const move = monster.kind.special;
  current.specialWait = move.every;
  if (move.heal) {
    const healed = Math.min(monster.stats.maxHp - monster.hp, monster.stats.maxHp * move.heal);
    monster.hp += healed;
    emit('boss-move', { life, move, healed: Math.round(healed) });
    return;
  }
  let damage = 0;
  for (let hit = 0; hit < (move.hits ?? 1) && life.fight && !life.ending; hit++) {
    const result = monsterStrike(life, move.strike);
    damage += result.damage;
    if (!life.fight || life.ending) return; // the fight is over
    if (move.drain) monster.hp = Math.min(monster.stats.maxHp, monster.hp + result.damage * move.drain);
  }
  if (move.stun) current.heroWait += move.stun;
  emit('boss-move', { life, move, damage });
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
  const against = 1 + (hero.effects.against[monster.kind.family] ?? 0); // quirks like Afraid of Geese
  const result = strike(life.rng, hero.stats, monster.stats, { multiplier: multiplier * against, critBonus: hero.effects.critDamage ?? 0 });
  monster.hp = Math.max(0, monster.hp - result.damage);
  if (hero.effects.lifesteal) hero.hp = Math.min(hero.stats.maxHp, hero.hp + result.damage * hero.effects.lifesteal);
  current.lastBlow = { by: 'hero', at: current.elapsed, ...result };
  emit('hit', { life, by: 'hero', ...result });
  if (monster.hp <= 0) winFight(life);
  else if (monster.kind.song) singVerses(life);
  return result;
}

// `multiplier` scales the damage, for a boss's special move.
function monsterStrike(life, multiplier = 1) {
  const { hero } = life;
  const current = life.fight;
  const { monster } = current;
  const result = strike(life.rng, monster.stats, hero.stats, { multiplier, extraDodge: hero.effects.dodge ?? 0 });
  hero.hp = Math.max(0, hero.hp - result.damage);
  if (hero.effects.thorns) monster.hp = Math.max(0, monster.hp - result.damage * hero.effects.thorns);
  current.lastBlow = { by: 'monster', at: current.elapsed, ...result };
  emit('hit', { life, by: 'monster', ...result });
  if (hero.hp <= 0) die(life);
  else if (monster.hp <= 0) winFight(life);
  return result;
}

function winFight(life) {
  const { monster } = life.fight;
  if (monster.kind.song) {
    finishSong(life);
    return;
  }
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
  if (hero.potions < potionLimit(hero) && life.rng.chance(loot.potionDropChance + (effects.potionFind ?? 0))) hero.potions += 1;
  emit('fight-end', { life, monster, won: true });
  gainXp(life, Math.round(experience.perMonsterLevel * monster.level * (monster.kind.xp ?? 1) * (1 + (effects.xp ?? 0))));
  updateEpithet(life);
}

function gainXp(life, amount) {
  const { hero } = life;
  hero.xp += amount;
  while (tryLevelUp(hero)) {
    addLog(life, 'level', fill(drawLine(life, 'level-up', levelUpLines), { level: hero.level }));
    emit('level-up', { hero });
    queueLevelChoices(life, hero.level);
  }
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

// The most potions the hero will carry (a Pack Rat carries more).
function potionLimit(hero) {
  return potions.carry + (hero.effects.potionCarry ?? 0);
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
  while (hero.potions < potionLimit(hero) && hero.gold >= potionPrice) {
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
