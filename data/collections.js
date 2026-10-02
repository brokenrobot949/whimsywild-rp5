// Collections, in the Chronicle: the Bestiary (every monster, and how heroes have fared against
// it) and the Book of Epithets (every title a hero can earn). Both are kept forever, through
// every dream of New Game+. {words} are filled in automatically. Where a pair is given, the
// first is used for one and the second for more than one.

export const collectionText = {
  heading: 'Collections',

  // The Bestiary
  bestiary: 'Bestiary: {found} of {total} beaten',
  bestiaryAbout: 'Every monster in Whimsywild. Shadows are monsters no hero has met yet.',
  unknownName: '???',
  unknownRegion: 'Beyond the mist',  // a region heading, while that region is sealed and unmet
  beaten: ['Beaten once', 'Beaten {count} times'],
  felled: ['felled 1 hero', 'felled {count} heroes'],
  firstBeaten: 'First beaten by {hero}.', // {hero} is their first name
  metOnly: 'Never beaten',
  boss: 'Castle boss',
  song: 'The last dream',            // the Nightmare, at the end of the story

  // The Book of Epithets
  epithets: 'Epithets: {found} of {total} earned',
  epithetsAbout: 'Titles heroes earn from their deeds. A title counts once a hero has earned it, '
    + 'even if a grander one took its place.',
  firstEarned: ['First earned by {hero}.', 'First earned by {hero}, and by {more} more since.'],
};

// What each kind of monster is called in the Bestiary (see `families` in monsters.js).
export const familyNames = {
  beast: 'Beast', bird: 'Bird', bug: 'Bug', plant: 'Plant', slime: 'Slime', construct: 'Construct',
  goblin: 'Goblin', reptile: 'Reptile', amphibian: 'Amphibian', spirit: 'Spirit', undead: 'Undead',
  dragon: 'Dragon', giant: 'Giant',
};

// How to earn each kind of epithet (see data/epithets.js), shown in the Book of Epithets.
// {count} is the number needed, {monster} the monster, {place} the place and {rarity} the rarity.
// Monsters no hero has met, and places not yet discovered, are kept secret.
export const epithetHints = {
  slain: 'Beat {monster} {count} times in one life.',
  slainTotal: 'Beat {count} monsters in one life.',
  closeCalls: ['Win a fight by a whisker.', 'Win {count} fights by a whisker in one life.'],
  potions: 'Drink {count} potions in one life.',
  goldFound: 'Find {count} gold in one life.',
  visits: 'Visit {place} {count} times in one life.',
  found: 'Find {rarity} item.',      // {rarity} comes with its article: "a legendary"
  level: 'Reach level {count}.',
  skillRank: 'Raise a skill to rank {count}.',
  respects: ['Pay respects at a grave.', 'Pay respects at {count} graves in one life.'],
  events: 'Take part in {count} story events in one life.',
  shards: ['Find a dream shard.', 'Find {count} dream shards in one life.'],
  dungeons: ['Clear a dungeon.', 'Clear {count} dungeons in one life.'],
  castles: ['Conquer a monster castle.', 'Conquer {count} monster castles in one life.'],
  verses: ['Find a verse of the lullaby.', 'Find {count} verses of the lullaby in one life.'],
  avenged: ['Defeat a nemesis.', 'Defeat {count} nemeses in one life.'],
  treasures: ['Find a treasure.', 'Find {count} different treasures in one life.'],
  pets: ['Adopt a pet.', 'Adopt {count} pets in one life.'],
  finale: 'Finish the story.',       // the Lullaby-Singer
  secretMonster: 'a certain monster', // in place of a monster no hero has met
  secretPlace: 'a certain place',     // in place of a place not yet discovered
  secretStory: 'Something the story has yet to reveal.', // for verses, before Act 2
};
