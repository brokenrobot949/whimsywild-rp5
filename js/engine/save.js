// Saving and loading, using the browser's localStorage.
// Every key starts with "whimsywild-rp5:" so it can't collide with Rob's other games,
// which share the same github.io address.
//
// The save holds:
//   lives     a record of every finished life (Hall of Champions, Chronicle, playtest log)
//   current   the hero in the middle of their life, or null between heroes
//   world     what heroes have left behind: the fog lifted, the places discovered, and graves
//   settings  the player's settings, like Auto-decide

const PREFIX = 'whimsywild-rp5:';
const SAVE_KEY = `${PREFIX}save`;
const CODE_PREFIX = 'WWRP5:'; // the start of every save code

// Raise this whenever the save format changes, and add a matching step to `upgrades`.
export const SAVE_VERSION = 4;

// Each step upgrades a save from one version to the next, so old saves keep working.
const upgrades = {
  // Version 2 adds the hero in progress, player settings, and more detail in each life's record.
  1: (save) => ({
    ...save,
    lives: save.lives.map((life) => ({ monstersSlain: 0, deed: null, cause: null, log: null, ...life })),
    current: null,
    settings: { autoDecide: read(`${PREFIX}auto-decide`) === 'yes' },
  }),
  // Version 3 is the dragon-shaped world, and adds the fog and discovered places. A hero
  // in progress on the old placeholder map has no place on the new one, so they're let go.
  2: (save) => ({ ...save, current: null, world: newWorld() }),
  // Version 4 adds graves where heroes fell. Heroes who fell before graves existed have none.
  3: (save) => ({ ...save, world: { ...save.world, graves: [] } }),
};

function newSave() {
  return { version: SAVE_VERSION, lives: [], current: null, world: newWorld(), settings: { autoDecide: false } };
}

function newWorld() {
  return { revealed: '', discovered: [], graves: [] };
}

export function loadSave() {
  const raw = read(SAVE_KEY);
  if (!raw) return newSave();
  try {
    return upgrade(JSON.parse(raw));
  } catch (error) {
    // Put the unreadable save aside rather than overwriting it, in case it can be rescued.
    write(`${PREFIX}save-unreadable`, raw);
    console.error('Could not read the save, so a new one was started.', error);
    return newSave();
  }
}

// Returns false if the browser wouldn't store it (for example, if storage is full).
export function writeSave(save) {
  return write(SAVE_KEY, JSON.stringify(save));
}

// Erases everything this game has stored in this browser: the save and all settings.
export function clearSave() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(PREFIX)) localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Could not clear the save.', error);
  }
}

// Small settings kept outside the main save, such as the debug speed.
export function loadSetting(name, fallback) {
  const value = read(PREFIX + name);
  return value === null ? fallback : value;
}

export function saveSetting(name, value) {
  write(PREFIX + name, String(value));
}

// ---- Save codes ----
// The whole save as one line of text, for backing up or moving to another device.

export function exportCode(save) {
  const bytes = new TextEncoder().encode(JSON.stringify(save));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return CODE_PREFIX + btoa(binary);
}

// Reads a save code. Throws an error with a friendly message if it can't.
export function importCode(code) {
  const text = code.trim();
  if (!text.startsWith(CODE_PREFIX)) throw new Error("That doesn't look like a Whimsywild RP5 save code. It should start with WWRP5:");
  let save;
  try {
    const binary = atob(text.slice(CODE_PREFIX.length).replace(/\s+/g, ''));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    save = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error('That save code is damaged or incomplete. Try copying it again.');
  }
  if (!Array.isArray(save?.lives)) throw new Error("That save code doesn't contain a Whimsywild RP5 save.");
  return upgrade(save);
}

function upgrade(save) {
  if (!save || typeof save.version !== 'number') throw new Error('The save has no version number.');
  if (save.version > SAVE_VERSION) throw new Error(`The save is from a newer version (${save.version}) of the game.`);
  while (save.version < SAVE_VERSION) {
    const from = save.version;
    if (!upgrades[from]) throw new Error(`No way to upgrade a version ${from} save.`);
    save = upgrades[from](save);
    save.version = from + 1;
  }
  return save;
}

// localStorage can be switched off (private browsing, strict settings), so never let it crash the game.
function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('Could not save.', error);
    return false;
  }
}
