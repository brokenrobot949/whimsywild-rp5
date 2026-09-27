// The engine announces what happens in the game by name, and the UI listens.
// In Phase 3, sound effects will listen to the same announcements.
//
// Announcements so far:
//   life-start  a hero sets out               { life }
//   season      the season changes            { hero }
//   birthday    the hero turns a year older   { hero }
//   depart      the hero heads somewhere      { hero, from, to }
//   arrive      the hero reaches a place      { hero, place }
//   log         a new adventure log line      { entry }
//   life-end    the life is over              { life }

const listeners = new Map();

export function on(name, listener) {
  if (!listeners.has(name)) listeners.set(name, []);
  listeners.get(name).push(listener);
}

export function emit(name, detail) {
  for (const listener of listeners.get(name) ?? []) listener(detail);
}
