// The Chronicle, the Hall of Champions, and coming back to a hero mid-life.

// How many of the most recent heroes keep their full adventure log in the Hall of Champions.
// Older heroes keep their card, but their log is let go to save space in the browser.
export const keepLogs = 50;

// Greatest deeds. {a} is a monster or item, like "an Elder Truffle Boar".
// The greatest is the toughest monster slain, unless the hero found a better item.
export const deedLines = {
  slew: 'Slew {a}.',
  found: 'Found {a}.',
  cleared: 'Cleared {place}.',
  conquered: 'Conquered {place}.',
  verse: 'Found the verse "{title}".',
  avenged: 'Avenged {victim}.',
  none: 'Set out bravely, which counts for something.',
};

// Items of these rarities count as deeds when found.
export const deedRarities = ['epic', 'legendary'];

// Hall of Champions text. {words} are filled in automatically.
export const hallText = {
  title: 'Hall of Champions',
  ageLine: 'Age {age} · from {town}',
  deed: 'Greatest deed: {deed}',
  empty: 'No heroes yet. Every hero who finishes a life gets a card here.',
  fadedLog: 'This tale has faded with time. Only the card remains.',
  back: 'Back to the Hall',
  tapHint: 'Tap a hero to read their whole adventure.',
};

// Chronicle text.
export const chronicleText = {
  title: 'Chronicle',
  heroes: 'Heroes',
  years: 'Years adventured',
  monsters: 'Monsters slain',
  gold: 'Gold found',
  retired: 'Retired',
  fell: 'Fell in battle',
  heirlooms: 'Heirlooms at graves',
  heirloomsValue: '{waiting} waiting, {claimed} claimed',
  cause: 'Most common cause of death',
  commonClass: 'Most-played class',
  longest: 'Longest life',
  highest: 'Highest level',
  none: '-',
  countValue: '{name} ({count})',
  longestValue: '{name}, {years} years',
  highestValue: '{name}, level {level}',
  mapRevealed: 'Map revealed',
  townsFound: 'Towns found',
  townsValue: '{found} of {total}',
  castlesConquered: 'Castles conquered',
  versesFound: 'Verses found',
  shardsFound: 'Dream shards found',
  worldHeading: 'The world',
  heroesHeading: 'Heroes',
  mentorsHeading: 'Mentors',
  empty: 'The Chronicle is empty. It fills up as heroes finish their lives.',
};

// Hero tab text. {level} is filled in automatically.
export const heroTabText = {
  stats: 'Stats',
  gold: 'Gold',
  potions: 'Potions',
  path: 'Class',
  notYet: 'Not yet chosen',
  unknown: '?',
  background: 'Background',
  blessings: 'Blessings',
  blessingLeft: '{seasons} seasons left',
  tags: 'Tags',
  skills: 'Skills',
  noSkills: 'No skills yet. The first comes at level {level}.',
  gear: 'Gear',
};

// Settings messages.
export const settingsText = {
  copied: 'Copied! Paste it somewhere safe, like a note or an email to yourself.',
  selectToCopy: 'Select the code above and copy it.',
  confirmLoad: 'Replace all progress in this browser with this save? This cannot be undone.',
  emptyPaste: 'Paste a save code into the box first.',
  saveFailed: "Couldn't save your progress. The browser's storage may be full or switched off.",
};

// Shown when you come back to a hero in the middle of their life.
export const resumeCard = {
  title: '{name} {epithet}',
  body: 'Age {age}. {status}. Ready to carry on?',
  button: 'Continue',
};
