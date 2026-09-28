// A hero's life: the clock, walking pace, and the lines the adventure log uses.
// All numbers are starting values to tune during Phase 1 playtests.

// The life clock.
export const lifeClock = {
  startAge: 18,          // every hero sets out at this age
  retireAge: 70,         // heroes retire automatically on reaching this age
  secondsPerSeason: 1.5, // real seconds per season at normal speed (a year is 4 seasons)
};

// Season names, in order. Each year starts in Spring.
export const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

// Walking and resting.
export const travel = {
  secondsPerTile: 0.4,    // seconds to cross one tile of normal ground (see "cost" in terrain.js)
  townRestSeasons: 2,     // seasons spent resting on reaching a town
  landmarkRestSeasons: 1, // seasons spent resting on reaching a landmark
};

// Wandering lines are small moments logged while the hero walks.
// The lines themselves live with each region in regions.js.
export const wandering = {
  minGapSeconds: 6,      // never two wandering lines closer together than this
  chancePerSecond: 0.12, // after the gap, the chance each second of walking that one appears
};

// ---- Log lines ----
// The log puts a stamp like "Autumn, age 34: " in front of each line, so keep
// lines under about 70 characters to stay within the 90-character limit.
// Words in {braces} are filled in automatically.

// When a hero first sets out. {town} is the starting town.
export const startLines = [
  'set out from {town} with a stout heart and a stale loaf.',
  'left {town} to seek fortune, glory, or at least lunch.',
  'waved goodbye to {town}. Nobody waved back, but it was early.',
];

// When a hero is the first ever to see a place. {place} is the place.
export const discoveryLines = [
  'spotted {place} for the very first time.',
  'discovered {place}, and made a careful note of it.',
  'came upon {place} as the fog lifted.',
];

// When a hero leaves a town. {town} is the town, {place} is where they are heading.
export const departLines = [
  'left {town}, bound for {place}.',
  'packed a lunch and set off from {town} toward {place}.',
  'bid {town} farewell and headed for {place}.',
];

// Birthdays worth a mention. The number is the age.
export const milestoneLines = {
  25: 'finally learned to fold a map properly.',
  30: 'found a first grey hair and named it Gerald.',
  40: 'began telling young adventurers about "the old days."',
  50: 'noticed their knees now forecast the weather.',
  60: 'started calling everyone under forty "young sprout."',
  65: 'took up whittling. Mostly spoons.',
};

// When a hero retires. {town} is the town they settle in.
export const retireLines = [
  'hung up their old boots and retired to {town}.',
  'retired to {town} to raise geese.',
  'settled in {town} to tell long stories to short children.',
];

// What the hero strip says the hero is doing. {a} is a monster, like "a Grumpy Badger".
export const statusLines = {
  walking: 'Walking to {place}',
  seeking: 'Following a rumor to the {direction}',
  resting: 'Resting at {place}',
  camping: 'Camping near {place}',
  fighting: 'Fighting {a}',
  retired: 'Retired to {town}',
  died: 'Fell to {a}',
};

// Heroes who start in a later town begin at its recruitment level (see regions.js), with
// modest gear, and make the skill and class choices they would have made on the way.
export const recruits = {
  gearSlots: ['weapon'],  // slots filled with Common gear of the town's level (not in a level 1 town)
  rerolls: 3,                     // how many times the player can reroll a new hero
  nameLength: 20,                 // the longest name the player can type
};

// The New Hero card, shown before each life. {words} are filled in automatically.
export const newHeroText = {
  title: 'A new hero',
  nameLabel: 'Name',
  about: '{epithet}, age {age}',
  reroll: 'Reroll ({left} left)',
  noRerolls: 'No rerolls left',
  townsLabel: 'Where will they begin?',
  town: '{town}',
  townDetail: 'Level {level} · {region}',
  begin: 'Begin',
};

// The card shown at the end of each life.
// {name}, {epithet}, {age}, {level}, {town}, {years} and {ending} are filled in automatically.
export const cards = {
  end: {
    title: '{name} {epithet}',
    body: '{ending} {years} years of adventure, ending at level {level}.',
    button: 'Next hero',
  },
};
