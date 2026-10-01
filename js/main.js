// Startup, the game loop, and saving.
import { buildWorld, refreshSeals } from './engine/map.js';
import {
  createLife, beginLife, stepLife, lifeRecord, lifeStatus, currentChoice, autoChoice, makeChoice,
  packLife, unpackLife, startingTowns, nameHero, addStoryLine,
} from './engine/life.js';
import { randomSeed } from './engine/rng.js';
import { loadSave, writeSave, clearSave, exportCode, importCode, newWorld } from './engine/save.js';
import { on } from './engine/game-events.js';
import { createMapView } from './engine/map-view.js';
import { createUi } from './engine/ui.js';
import { createScreens } from './engine/screens.js';
import { createSettingsPanel } from './engine/settings-panel.js';
import { createAudio } from './engine/audio.js';
import { createDebugPanel } from './engine/debug.js';
import { loadArt } from './engine/art.js';
import { packFog, unpackFog } from './engine/fog.js';
import { loadGraves } from './engine/graves.js';
import { loadMentors, mentorsFor } from './engine/mentors.js';
import { loadShards } from './engine/shards.js';
import { loadConquered } from './engine/castles.js';
import { loadVerses, unseenActs, skipToNextAct, currentAct, actInfo } from './engine/story.js';
import { turnOf, nextDream, pastDream } from './engine/new-dream.js';
import { fill } from './engine/text.js';
import { moods, newDreamText } from '../data/new-dream.js';
import { dreamById, rollDream } from './engine/dreams.js';
import { regionAt } from './engine/map.js';
import { regions } from '../data/regions.js';
import { cards, lifeClock } from '../data/life.js';
import { autoDecideSeconds } from '../data/skills.js';
import { keepLogs, resumeCard, settingsText } from '../data/records.js';
import { storyText } from '../data/story.js';

// The simulation moves forward in fixed steps of this many game seconds, so a life
// plays out exactly the same at any speed, and replays exactly from its seed
// (as long as the same choices are made, for example with Auto-decide on).
const STEP_SECONDS = 0.1;
// If the browser stalls (for example while switching tabs), don't try to catch up more than this.
const MAX_FRAME_SECONDS = 0.25;
// Routine autosaves happen at most this often (real time). Choices and endings save at once.
const AUTOSAVE_MS = 2000;

const params = new URLSearchParams(location.search);
const debugMode = params.has('debug');

const save = loadSave();
// New Game+: each new dream, the land lies a different way round (see new-dream.js).
const world = buildWorld(turnOf(save.world.cycle?.number ?? 1));
world.cycle = save.world.cycle ?? world.cycle;
// What earlier heroes explored. The first town is always known.
unpackFog(world, save.world.revealed);
world.discovered = new Set(save.world.discovered);
world.discovered.add(world.places.find((place) => place.kind === 'town' && !regions[place.region].sealed && !regions[place.region].opensInAct).name);
world.graves = loadGraves(save.world.graves);
world.mentors = loadMentors(save.world.mentors);
world.shards = loadShards(save.world.shards);
world.conquered = loadConquered(save.world.conquered);
world.verses = loadVerses(save.world.verses);
world.actSeen = save.world.actSeen ?? 1;
world.finale = save.world.finale ?? null; // who sang the dragon to sleep, once someone has
refreshSeals(world); // regions the story has opened
const art = await loadArt();
const ui = createUi(art);
const mapView = createMapView(document.getElementById('map'), world, art, {
  onPointerTile: (x, y) => debug?.showTile(x, y, regions[regionAt(world, x, y)]?.name ?? 'Sea'),
});

const pauses = new Set(); // reasons the clock is stopped: 'card', 'choice', 'settings' or 'hidden'
let life = null;
let speed = 1;
let leftover = 0;         // game seconds waiting to be simulated
let typedName = '';       // the name typed on the New Hero card; kept through rerolls
let savingOn = true;      // switched off just before the page reloads with a different save
let lastSaved = 0;
let warnedSaveFailed = false;

const screens = createScreens({
  art,
  world,
  getLife: () => life,
  getLives: () => save.lives,
  getPastDreams: () => save.pastDreams ?? [],
  getPendingDream: () => save.pendingDream ?? null,
  onNewDream: () => offerNewDream(),
});
const audio = createAudio(); // silent until the player's first tap
const settings = createSettingsPanel({
  getAutoDecide: () => save.settings.autoDecide,
  setAutoDecide,
  audio,
  makeCode: () => {
    saveProgress(true);
    return exportCode(save);
  },
  loadCode: (text) => {
    const loaded = importCode(text);
    if (!confirm(settingsText.confirmLoad)) return;
    savingOn = false;
    writeSave(loaded);
    location.reload();
  },
  onOpen: () => pauses.add('settings'),
  onClose: () => pauses.delete('settings'),
});
const debug = debugMode
  ? createDebugPanel({
    getLife: () => life,
    getLives: () => save.lives,
    onSpeed: (next) => { speed = next; },
    onShowAll: (on) => mapView.setShowAll(on),
    onReset: () => {
      savingOn = false;
      clearSave();
      location.reload();
    },
    getStory: () => (world.finale ? `Finished, sung by ${world.finale.hero}` : `Act ${currentAct(world)} · ${world.conquered.length} castles · ${world.verses.length} verses`),
    onNextAct: () => {
      skipToNextAct(world);
      refreshSeals(world);
      saveProgress(true);
      screens.refresh();
      debug.refresh();
    },
    onPreviewEnding: () => {
      pauses.add('ending');
      ui.showEnding(save.lives, () => {
        // The ending's closing card replaced whatever card was up, so put things back.
        pauses.delete('ending');
        restoreCards();
      }, { ...actInfo(4).interlude, button: storyText.interludeButton }); // Act 4's card, as in play
    },
  })
  : null;

function setAutoDecide(on) {
  if (save.settings.autoDecide === on) return;
  save.settings.autoDecide = on;
  settings.sync();
  ui.syncAutoDecide(on);
  saveProgress(true);
}

// ---- Saving ----

// Saves the hero in progress along with everything else. Routine saves are spaced out;
// `force` saves straight away.
function saveProgress(force = false) {
  if (!savingOn) return;
  const now = performance.now();
  if (!force && now - lastSaved < AUTOSAVE_MS) return;
  lastSaved = now;
  save.current = life && !life.ending ? packLife(life) : null;
  save.world = {
    revealed: packFog(world.fog),
    discovered: [...world.discovered],
    graves: world.graves,
    mentors: world.mentors,
    shards: world.shards,
    conquered: world.conquered,
    verses: world.verses,
    actSeen: world.actSeen,
    finale: world.finale,
    cycle: world.cycle,
  };
  if (!writeSave(save) && !warnedSaveFailed) {
    warnedSaveFailed = true;
    window.showStartupError?.(settingsText.saveFailed);
  }
}

for (const name of ['arrive', 'birthday', 'level-up']) on(name, () => saveProgress());
on('discovery', () => saveProgress(true));
on('respects', () => saveProgress(true));
on('shard', () => saveProgress(true));
on('castle-conquered', () => saveProgress(true));
on('verse', () => saveProgress(true));
on('finale-open', () => saveProgress(true));

// ---- Lives ----

// Rolls a new hero in the given town (or the town last started from) and shows the New Hero card.
// Tonight's dream stays the same through rerolls and changes of town; each new hero after a
// finished life gets a new one.
function startLife(seed, town = defaultTown(), rerollsLeft = null, dream = newDream()) {
  life = createLife(world, seed, { town, dream });
  if (rerollsLeft !== null) life.rerollsLeft = rerollsLeft;
  if (typedName) nameHero(life, typedName);
  showLife();
  saveProgress(true);
  showInterludes(showNewHeroCard);
}

// Before a new hero, the interlude of each act that has begun since the player last saw one.
function showInterludes(then) {
  // A new dream begins with its own card (see New Game+ below).
  if (save.rollOver) {
    pauses.add('card');
    screens.show('adventure');
    const legend = world.cycle?.legend;
    const values = {
      legend: legend ? `${legend.name} ${legend.epithet}`.trim() : '',
      mood: newDreamText.moodLines[world.cycle?.mood] ?? '',
    };
    ui.showMessage({ title: newDreamText.rollOverTitle, body: newDreamText.rollOverBody, button: storyText.interludeButton }, values, () => {
      delete save.rollOver;
      saveProgress(true);
      showInterludes(then);
    });
    return;
  }
  const [act] = unseenActs(world);
  if (!act) {
    then();
    return;
  }
  pauses.add('card');
  screens.show('adventure');
  ui.showMessage({ ...act.interlude, button: storyText.interludeButton }, {}, () => {
    world.actSeen = act.act;
    saveProgress(true);
    showInterludes(then);
  });
}

// A dream for the next hero, never the same as the last hero's.
function newDream() {
  return rollDream(Math.random, life?.hero.dream, currentAct(world));
}

// The town the last hero started from, if it's still a starting town, or else the first town.
function defaultTown() {
  const towns = startingTowns(world);
  return towns.find((town) => town.name === save.settings.startTown) ?? towns[0];
}

// Picks up the hero from the save. Returns false if there's none, or it can't be read.
function resumeLife() {
  if (!save.current) return false;
  try {
    life = unpackLife(world, save.current);
  } catch (error) {
    console.error('Could not pick up the saved hero, so a new one was rolled.', error);
    return false;
  }
  showLife();
  if (!life.begun) {
    typedName = life.hero.name === life.rolledName ? '' : life.hero.name;
    showInterludes(showNewHeroCard);
    return true;
  }
  pauses.add('card');
  screens.show('adventure');
  ui.showMessage(resumeCard, { ...cardValues(), status: lifeStatus(life) }, () => pauses.delete('card'));
  return true;
}

function showLife() {
  leftover = 0;
  ui.setLife(life);
  screens.refresh();
  debug?.refresh();
}

// The New Hero card: name, rerolls and starting town, then Begin. The map shows the towns.
function showNewHeroCard() {
  const towns = startingTowns(world);
  pauses.add('card');
  screens.show('adventure');
  mapView.showStartingTowns({ towns, chosen: life.startTown });
  ui.showNewHero({
    towns,
    mentorCount: (town) => mentorsFor(world, town.name).length,
    typed: typedName,
    onName: (text) => {
      typedName = text;
      nameHero(life, text);
      saveProgress();
    },
    onReroll: () => startLife(randomSeed(), life.startTown, life.rerollsLeft - 1, life.hero.dream),
    // The same hero, moved to another town.
    onTown: (town) => startLife(life.hero.seed, town, life.rerollsLeft, life.hero.dream),
    onBegin: () => {
      mapView.showStartingTowns(null);
      pauses.delete('card');
      typedName = '';
      save.settings.startTown = life.startTown.name;
      beginLife(life);
      saveProgress(true);
    },
  });
}

function finishLife() {
  save.lives.push(lifeRecord(life));
  // Older heroes let their full logs go, to save space in the browser.
  for (const record of save.lives.slice(0, -keepLogs)) record.log = null;
  saveProgress(true);
  debug?.refresh();
  screens.refresh();
  pauses.add('card');
  screens.show('adventure');
  showEndCard();
}

// The card at the end of a life. The hero who sang the dragon to sleep gets the ending after it.
function showEndCard() {
  const next = life.ending.kind === 'sang' ? () => ui.showEnding(save.lives, nextHero) : nextHero;
  ui.showMessage(cards.end, cardValues(), next);
}

// After a life: the next hero, or a new dream if the player asked for one during this life.
function nextHero() {
  if (save.pendingDream) rollOver(save.pendingDream);
  else startLife(randomSeed());
}

// Puts back whatever card was up before another card (like the new dream's) took its place.
function restoreCards() {
  if (!life.begun) showNewHeroCard();
  else if (life.ending) showEndCard();
  else {
    pauses.delete('card');
    if (currentChoice(life)) offerChoice();
  }
}

// ---- New Game+: letting Sominus dream again (see new-dream.js) ----

// Offered from the Chronicle in Act 4: a gentle dream, a restless one, or not yet. A hero in the
// middle of their adventure finishes it first; otherwise the world turns over straight away.
function offerNewDream() {
  if (save.pendingDream || !world.finale) return;
  pauses.add('new-dream');
  screens.show('adventure');
  const ids = Object.keys(moods);
  const singer = `${world.finale.hero} ${world.finale.epithet}`.trim();
  ui.showPrompt({
    title: newDreamText.promptTitle,
    body: fill(newDreamText.promptBody, { singer }),
    options: [
      ...ids.map((id) => ({ title: moods[id].name, detail: moods[id].detail })),
      { title: newDreamText.notYet, detail: newDreamText.notYetDetail },
    ],
    onPick: (index) => {
      pauses.delete('new-dream');
      const mood = ids[index];
      if (mood && (!life.begun || life.ending)) {
        rollOver(mood);
        return;
      }
      if (mood) {
        save.pendingDream = mood;
        addStoryLine(life, newDreamText.pendingLine);
        saveProgress(true);
        screens.refresh();
      }
      restoreCards();
    },
  });
}

// The dragon rolls over: this dream goes into the Chronicle's past dreams, and a new world begins,
// turned a new way, with the singer as its legend. The page reloads to build the new world.
function rollOver(mood) {
  const number = world.cycle?.number ?? 1;
  const heroes = save.lives.filter((record) => (record.cycle ?? 1) === number).length;
  save.pastDreams = [...(save.pastDreams ?? []), pastDream(world, heroes)];
  save.world = newWorld(nextDream(world, mood));
  save.current = null;
  delete save.pendingDream;
  save.rollOver = true; // the card that begins the new dream, shown after the reload
  savingOn = false;     // so the old world isn't saved over the new one as the page reloads
  writeSave(save);
  location.reload();
}

// Shows the waiting choice (a skill, class, rumor or story event). The clock stays stopped
// until every waiting choice is made.
function offerChoice() {
  pauses.add('choice');
  saveProgress(true);
  screens.show('adventure');
  ui.showChoice(currentChoice(life), life, {
    auto: {
      enabled: save.settings.autoDecide,
      pickIndex: autoChoice(life),
      delayMs: (autoDecideSeconds * 1000) / speed,
      onToggle: setAutoDecide,
    },
    onPick: (index) => {
      makeChoice(life, index);
      pauses.delete('choice');
      if (life.ending) finishLife(); // a story event can end a life
      else if (currentChoice(life)) offerChoice();
      else saveProgress(true);
    },
  });
}

function cardValues() {
  const { hero } = life;
  return {
    name: hero.name,
    epithet: hero.epithet,
    age: hero.age,
    level: hero.level,
    town: life.startTown.name,
    years: hero.age - lifeClock.startAge,
    ending: life.ending?.text ?? '',
  };
}

// ---- The game loop ----

let lastFrame = performance.now();
function frame(now) {
  const realSeconds = Math.min((now - lastFrame) / 1000, MAX_FRAME_SECONDS);
  lastFrame = now;
  if (pauses.size === 0 && !life.ending) {
    leftover += realSeconds * speed;
    while (leftover >= STEP_SECONDS) {
      leftover -= STEP_SECONDS;
      stepLife(life, STEP_SECONDS);
      if (life.ending) {
        leftover = 0;
        finishLife();
        break;
      }
      if (currentChoice(life)) {
        leftover = 0;
        offerChoice();
        break;
      }
    }
  }
  mapView.draw(life, leftover);
  ui.update();
  requestAnimationFrame(frame);
}

// Pause while the tab or app is hidden, and save in case it doesn't come back.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauses.add('hidden');
    saveProgress(true);
  } else {
    pauses.delete('hidden');
  }
});
window.addEventListener('pagehide', () => saveProgress(true));

// In debug mode, ?debug&seed=12345 starts the hero with that seed (replacing any hero in progress),
// and &dream=gold gives them that dream, so a life can be replayed exactly.
const seedParam = Number(params.get('seed'));
const dreamParam = dreamById(params.get('dream'))?.id;
if (debugMode && params.has('seed') && Number.isInteger(seedParam)) startLife(seedParam >>> 0, undefined, null, dreamParam ?? newDream());
else if (!resumeLife()) startLife(randomSeed());
requestAnimationFrame(frame);
