// Monsters: the dragon's dreams, leaking into the world.
//
//   name        what the monster is called
//   region      where it lives (from regions.js)
//   sprite      its picture (see art.js)
//   weight      how common it is next to the others in its region (2 is twice as common as 1)
//   stats       its stats at level 1 (combat.js explains what each one does)
//   xp          experience for beating it: 1 is normal, 1.5 is half as much again
//   meetLines   logged when a fight starts
//   defeatLines logged when the hero wins
//   deathLines  logged, and shown on the end card, when the monster wins
//
// In the lines, {a} becomes "a Grumpy Badger" and {the} becomes "the Grumpy Badger".
// Keep lines under about 60 characters, since titles like "Ancient" make names longer.

// Monsters above their region's levels earn a title. `from` is the monster level it starts at.
export const levelTitles = [
  { from: 7, title: 'Burly' },
  { from: 12, title: 'Elder' },
  { from: 17, title: 'Ancient' },
];

export const monsters = [
  {
    name: 'Grumpy Badger', region: 'tailwoods', weight: 3, xp: 1,
    sprite: { sheet: 'creatures', tile: 178 },
    stats: { maxHp: 20, power: 5, defense: 3, speed: 7, luck: 3 },
    meetLines: ['woke {a}. It was not pleased.', 'was confronted by {a} about the noise.'],
    defeatLines: ['sent {the} back to its sett, grumbling.', 'out-grumped {the}.'],
    deathLines: ['was flattened by {a}.', 'lost a grudge match with {a}.'],
  },
  {
    name: 'Slime Puddle', region: 'tailwoods', weight: 3, xp: 0.8,
    sprite: { sheet: 'dungeon', tile: 108 },
    stats: { maxHp: 14, power: 4, defense: 1, speed: 8, luck: 3 },
    meetLines: ['stepped in {a}. It stepped back.', 'was ambushed by {a} posing as rain.'],
    defeatLines: ['mopped up {the}.', 'evaporated {the} through sheer determination.'],
    deathLines: ['was slowly absorbed by {a}.', 'slipped on {a} and never got up.'],
  },
  {
    name: 'Indignant Goose', region: 'tailwoods', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 150 },
    stats: { maxHp: 12, power: 5, defense: 1, speed: 11, luck: 6 },
    meetLines: ['was honked at by {a}.', 'made eye contact with {a}. A mistake.'],
    defeatLines: ['out-honked {the}.', 'sent {the} flapping off in a huff.'],
    deathLines: ['was pecked into legend by {a}.', 'was chased off a bridge by {a}.'],
  },
  {
    name: 'Dozy Bumblebee', region: 'tailwoods', weight: 2, xp: 0.8,
    sprite: { sheet: 'creatures', tile: 140 },
    stats: { maxHp: 10, power: 4, defense: 1, speed: 12, luck: 8 },
    meetLines: ['disturbed {a} mid-snooze.', 'was buzzed by {a}, freshly woken.'],
    defeatLines: ['swatted {the} back to sleep.', 'lulled {the} into a deep nap.'],
    deathLines: ['was stung silly by {a}.', 'was buzzed to bits by {a}.'],
  },
  {
    name: 'Truffle Boar', region: 'tailwoods', weight: 1, xp: 1.4,
    sprite: { sheet: 'creatures', tile: 160 },
    stats: { maxHp: 22, power: 6, defense: 3, speed: 7, luck: 3 },
    meetLines: ['was charged by {a} guarding its truffles.', 'stood between {a} and a truffle.'],
    defeatLines: ['toppled {the} and kept the truffle.', 'sent {the} snorting into the bracken.'],
    deathLines: ['was trampled by {a} over a truffle.', 'was gored by {a}. Not worth the truffle.'],
  },
  {
    name: 'Wandering Toadstool', region: 'tailwoods', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 13 },
    stats: { maxHp: 18, power: 4, defense: 3, speed: 6, luck: 2 },
    meetLines: ['bumped into {a} on its stroll.', 'was blocked by {a}, which would not budge.'],
    defeatLines: ['picked {the} and had it for supper.', 'toppled {the}. Spores everywhere.'],
    deathLines: ['was spored into a stupor by {a}.', 'was befuddled to death by {a}.'],
  },
];
