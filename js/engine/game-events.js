// The engine announces what happens in the game by name, and the UI listens.
// In Phase 3, sound effects will listen to the same announcements.
//
// Announcements so far:
//   life-start  a hero sets out               { life }
//   season      the season changes            { hero }
//   birthday    the hero turns a year older   { hero }
//   depart      the hero heads somewhere      { hero, from, to }
//   arrive      the hero reaches a place      { hero, place }
//   fight-start a monster appears             { life, monster }
//   hit         a blow lands or is dodged     { life, by ('hero' or 'monster'), dodged, critical, damage }
//   fight-end   a fight is over               { life, monster, won }
//   level-up    the hero goes up a level      { hero }
//   skill       the hero uses an active skill { life, skill, damage or healed }
//   choice-made a skill or class was chosen   { life, choice, option }
//   potion      the hero drinks a potion      { life }
//   equip       the hero puts on an item      { hero, item }
//   shop        the hero has been shopping    { life, town }
//   death       the hero dies                 { life }
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
