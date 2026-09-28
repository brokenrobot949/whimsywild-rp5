// Quirks: one odd little trait per hero, rolled with them (rerolling changes it).
// A quirk has a small effect, and some quirks unlock their own story events (see
// `quirk` in events.js).
//
//   id       a short name for the save (keep it the same once players have it)
//   name     shown on the New Hero card and the Hero tab
//   about    a short description for the New Hero card
//   effects  like a skill's (see skills.js). Effects only quirks use:
//              against: { bird: -0.25 }  25% less damage to birds (families are in monsters.js)
//              swordHints: true          their sword tells them the exact odds on story events
//              lostChance: 0.25          a 25% chance of following the wrong rumor
//              eventLuck: 0.1            +10% chance on every chancy story event option
//              travelSpeed: 0.1          walks 10% faster (-0.1 is slower)
//              potionCarry: 1            carries 1 more potion than usual

export const quirks = [
  {
    id: 'afraid-of-geese', name: 'Afraid of Geese',
    about: 'Weaker against birds. The geese know.',
    effects: { against: { bird: -0.25 } },
  },
  {
    id: 'talks-to-sword', name: 'Talks to Their Sword',
    about: 'The sword offers the exact odds in story events. It is rarely wrong.',
    effects: { swordHints: true },
  },
  {
    id: 'collects-spoons', name: 'Collects Spoons',
    about: 'Rummages through everything, and finds a little more loot.',
    effects: { loot: 0.06 },
  },
  {
    id: 'no-sense-of-direction', name: 'Terrible Sense of Direction',
    about: 'Sometimes follows the wrong rumor, but learns a lot on the way.',
    effects: { lostChance: 0.2, xp: 0.1 },
  },
  {
    id: 'early-riser', name: 'Early Riser',
    about: 'Up before everyone, monsters included. Always strikes first.',
    effects: { firstStrike: true },
  },
  {
    id: 'no-vegetables', name: 'Refuses to Eat Vegetables',
    about: 'Holds a grudge against every plant, and hits them harder.',
    effects: { against: { plant: 0.3 } },
  },
  {
    id: 'lucky-socks', name: 'Wears Lucky Socks',
    about: 'The same pair, every day, for luck. It works, somehow.',
    effects: { boost: { luck: 0.25 } },
  },
  {
    id: 'enormous-appetite', name: 'Enormous Appetite',
    about: 'Hearty and hale, but spends a fortune on snacks.',
    effects: { boost: { maxHp: 0.1 }, gold: -0.1 },
  },
  {
    id: 'iron-stomach', name: 'Iron Stomach',
    about: 'Can drink anything. Potions work especially well.',
    effects: { potionHealing: 0.3 },
  },
  {
    id: 'light-sleeper', name: 'Light Sleeper',
    about: 'Wakes at the slightest sound, and dodges a little more.',
    effects: { dodge: 5 },
  },
  {
    id: 'sings-badly', name: 'Sings Badly and Often',
    about: 'Hums through every fight. Monsters find it unbearable.',
    effects: { thorns: 0.1 },
  },
  {
    id: 'silver-tongue', name: 'Silver Tongue',
    about: 'Can talk their way into, and out of, almost anything.',
    effects: { eventLuck: 0.1 },
  },
  {
    id: 'bookworm', name: 'Bookworm',
    about: 'Reads everything, including signposts, very slowly. Learns faster.',
    effects: { xp: 0.1 },
  },
  {
    id: 'jumpy', name: 'Jumpy',
    about: 'Leaps at every shadow, which is good for dodging and bad for aim.',
    effects: { dodge: 8, boost: { power: -0.05 } },
  },
  {
    id: 'stubborn', name: 'Stubborn as a Mule',
    about: 'Will not budge, from a fight or an opinion.',
    effects: { boost: { defense: 0.1, speed: -0.05 } },
  },
  {
    id: 'sleepwalker', name: 'Sleepwalker',
    about: 'Covers a little extra ground every night.',
    effects: { travelSpeed: 0.1 },
  },
  {
    id: 'pack-rat', name: 'Pack Rat',
    about: 'Has a pocket for everything, including one more potion.',
    effects: { potionCarry: 1 },
  },
  {
    id: 'sticky-fingers', name: 'Coins Stick to Them',
    about: 'Nobody knows how. Finds more gold.',
    effects: { gold: 0.15 },
  },
  {
    id: 'squashes-bugs', name: 'Squashes Every Bug',
    about: 'Cannot abide a creepy-crawly, and hits them harder.',
    effects: { against: { bug: 0.3 } },
  },
  {
    id: 'always-snacking', name: 'Always Snacking',
    about: 'Never without a bun in hand. Heals faster on the road.',
    effects: { healing: 0.25 },
  },
];

// Logged when a hero with a terrible sense of direction follows the wrong rumor.
// {place} is where they're going instead.
export const lostLines = [
  'misread the rumor, and set off for {place} instead.',
  'got the directions backwards, and headed for {place}.',
];
