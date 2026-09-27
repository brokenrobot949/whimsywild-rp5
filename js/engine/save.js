// Saving and loading, using the browser's localStorage.
// Every key starts with "whimsywild-rp5:" so it can't collide with Rob's other games,
// which share the same github.io address.

const PREFIX = 'whimsywild-rp5:';
const SAVE_KEY = `${PREFIX}save`;

// Raise this whenever the save format changes, and add a matching step to `upgrades`.
export const SAVE_VERSION = 1;

// Each step upgrades a save from one version to the next, so old saves keep working.
// Example for a future version 2:
//   1: (save) => ({ ...save, graves: [] }),
const upgrades = {};

function newSave() {
  return { version: SAVE_VERSION, lives: [] };
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

export function writeSave(save) {
  write(SAVE_KEY, JSON.stringify(save));
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
  } catch (error) {
    console.error('Could not save.', error);
  }
}
