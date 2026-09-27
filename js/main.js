// Startup and the game loop.
import { buildWorld } from './engine/map.js';
import { createLife, beginLife, stepLife, lifeRecord } from './engine/life.js';
import { randomSeed } from './engine/rng.js';
import { loadSave, writeSave } from './engine/save.js';
import { createMapView } from './engine/map-view.js';
import { createUi } from './engine/ui.js';
import { createDebugPanel } from './engine/debug.js';
import { cards, lifeClock } from '../data/life.js';

// The simulation moves forward in fixed steps of this many game seconds, so a life
// plays out exactly the same at any speed, and replays exactly from its seed.
const STEP_SECONDS = 0.1;
// If the browser stalls (for example while switching tabs), don't try to catch up more than this.
const MAX_FRAME_SECONDS = 0.25;

const params = new URLSearchParams(location.search);
const debugMode = params.has('debug');

const save = loadSave();
const world = buildWorld();
const ui = createUi();
const mapView = createMapView(document.getElementById('map'), world);

const pauses = new Set(); // reasons the clock is stopped: 'card' or 'hidden'
let life = null;
let speed = 1;
let leftover = 0;         // game seconds waiting to be simulated

const debug = debugMode
  ? createDebugPanel({ getLife: () => life, getLives: () => save.lives, onSpeed: (next) => { speed = next; } })
  : null;

function startLife(seed) {
  life = createLife(world, seed);
  leftover = 0;
  ui.setLife(life);
  debug?.refresh();
  pauses.add('card');
  ui.showCard(cards.start, cardValues(), () => {
    pauses.delete('card');
    beginLife(life);
  });
}

function finishLife() {
  save.lives.push(lifeRecord(life));
  writeSave(save);
  debug?.refresh();
  pauses.add('card');
  ui.showCard(cards.end, cardValues(), () => startLife(randomSeed()));
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
    }
  }
  mapView.draw(life, leftover);
  requestAnimationFrame(frame);
}

// Pause while the tab or app is hidden.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauses.add('hidden');
  else pauses.delete('hidden');
});

// In debug mode, ?debug&seed=12345 replays the hero with that seed.
const seedParam = Number(params.get('seed'));
const firstSeed = debugMode && params.has('seed') && Number.isInteger(seedParam) ? seedParam >>> 0 : randomSeed();
startLife(firstSeed);
requestAnimationFrame(frame);
