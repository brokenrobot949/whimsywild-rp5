// Startup, the game loop, and saving.
import { buildWorld } from './engine/map.js';
import {
  createLife, beginLife, stepLife, lifeRecord, lifeStatus, currentChoice, autoChoice, makeChoice,
  packLife, unpackLife, startingTowns, nameHero,
} from './engine/life.js';
import { randomSeed } from './engine/rng.js';
import { loadSave, writeSave, clearSave, exportCode, importCode } from './engine/save.js';
import { on } from './engine/game-events.js';
import { createMapView } from './engine/map-view.js';
import { createUi } from './engine/ui.js';
import { createScreens } from './engine/screens.js';
import { createSettingsPanel } from './engine/settings-panel.js';
import { createDebugPanel } from './engine/debug.js';
import { loadArt } from './engine/art.js';
import { packFog, unpackFog } from './engine/fog.js';
import { loadGraves } from './engine/graves.js';
import { regionAt } from './engine/map.js';
import { regions } from '../data/regions.js';
import { cards, lifeClock } from '../data/life.js';
import { autoDecideSeconds } from '../data/skills.js';
import { keepLogs, resumeCard, settingsText } from '../data/records.js';

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
const world = buildWorld();
// What earlier heroes explored. The first town is always known.
unpackFog(world, save.world.revealed);
world.discovered = new Set(save.world.discovered);
world.discovered.add(world.places.find((place) => place.kind === 'town' && !regions[place.region].sealed).name);
world.graves = loadGraves(save.world.graves);
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

const screens = createScreens({ art, world, getLife: () => life, getLives: () => save.lives });
const settings = createSettingsPanel({
  getAutoDecide: () => save.settings.autoDecide,
  setAutoDecide,
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
  save.world = { revealed: packFog(world.fog), discovered: [...world.discovered], graves: world.graves };
  if (!writeSave(save) && !warnedSaveFailed) {
    warnedSaveFailed = true;
    window.showStartupError?.(settingsText.saveFailed);
  }
}

for (const name of ['arrive', 'birthday', 'level-up']) on(name, () => saveProgress());
on('discovery', () => saveProgress(true));
on('respects', () => saveProgress(true));

// ---- Lives ----

// Rolls a new hero in the given town (or the town last started from) and shows the New Hero card.
function startLife(seed, town = defaultTown(), rerollsLeft = null) {
  life = createLife(world, seed, { town });
  if (rerollsLeft !== null) life.rerollsLeft = rerollsLeft;
  if (typedName) nameHero(life, typedName);
  showLife();
  saveProgress(true);
  showNewHeroCard();
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
    showNewHeroCard();
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
    typed: typedName,
    onName: (text) => {
      typedName = text;
      nameHero(life, text);
      saveProgress();
    },
    onReroll: () => startLife(randomSeed(), life.startTown, life.rerollsLeft - 1),
    // The same hero, moved to another town.
    onTown: (town) => startLife(life.hero.seed, town, life.rerollsLeft),
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
  ui.showMessage(cards.end, cardValues(), () => startLife(randomSeed()));
}

// Shows the waiting skill or class choice. The clock stays stopped until every waiting choice is made.
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
      saveProgress(true);
      if (currentChoice(life)) offerChoice();
      else pauses.delete('choice');
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

// In debug mode, ?debug&seed=12345 starts the hero with that seed (replacing any hero in progress).
const seedParam = Number(params.get('seed'));
if (debugMode && params.has('seed') && Number.isInteger(seedParam)) startLife(seedParam >>> 0);
else if (!resumeLife()) startLife(randomSeed());
requestAnimationFrame(frame);
