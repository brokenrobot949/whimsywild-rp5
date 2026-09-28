// The engine announces what happens in the game by name, and the UI listens.
// In Phase 3, sound effects will listen to the same announcements.
//
// Announcements so far:
//   life-start  a hero sets out               { life }
//   season      the season changes            { hero }
//   birthday    the hero turns a year older   { hero }
//   depart      the hero heads somewhere      { hero, from, to }
//   arrive      the hero reaches a place      { hero, place }
//   discovery   a place is seen for the first time ever { life, place }
//   fight-start a monster appears             { life, monster }
//   hit         a blow lands or is dodged     { life, by ('hero' or 'monster'), dodged, critical, damage }
//   fight-end   a fight is over               { life, monster, won }
//   level-up    the hero goes up a level      { hero }
//   skill       the hero uses an active skill { life, skill, damage or healed }
//   choice-made a skill or class was chosen   { life, choice, option }
//   epithet     the hero earns a new epithet  { hero }
//   potion      the hero drinks a potion      { life }
//   equip       the hero puts on an item      { hero, item }
//   shop        the hero has been shopping    { life, town }
//   respects    the hero takes a grave's heirloom { life, grave }
//   story-event a story event plays out       { life, event, option, worked }
//   tremor      the Sleeper stirs and the ground shakes { life, event }
//   shard       a dream shard is found        { life, shard }
//   dungeon-enter  the hero goes into a dungeon or castle { life }
//   dungeon-room   the hero enters the next room { life, room }
//   dungeon-leave  the hero comes out            { life, place, cleared }
//   boss-move      a castle boss uses its special move { life, move, damage or healed }
//   castle-conquered  a castle falls, for good  { life, place }
//   verse       a verse of the lullaby is found, for good { life, verse }
//   act         a new act of the story begins  { life, act }
//   finale-open the last verse is found, and the way into the Nightmare opens { life }
//   song-verse  a verse is sung, in the finale  { life, verse }
//   finale      the song is finished, and the story with it { life }
//   death       the hero dies (and life.ending.grave is their grave) { life }
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
