// Treasures: one-of-a-kind items with names of their own. Each castle's lord guards one, a few
// dungeons sometimes hide one, and one is given out on the road. A treasure is as strong as a
// Legendary item of the hero's level (see the Treasure rarity in items.js) and has something
// special about it besides. The Chronicle lists every treasure ever found.
//
//   id       a short name for the save (keep it the same once players have it)
//   name     its name, shown on the Hero tab; logName is how the log names it in a sentence
//   slot     weapon, armor, helm or trinket
//   tag      the kind of hero it suits: Might, Arcane, Faith, Cunning or Wild
//   stats    its stats at level 1, before the Treasure rarity's strength (like the base items)
//   effects  what's special about it, like a skill's effects (see skills.js)
//   flavor   a line about it, for the Hero tab and the Chronicle
//   from     where it's found, one of:
//              { castle: 'Stumptail Keep' }   won by the hero who conquers that castle
//              { dungeon: 'Snoring Burrow' }  sometimes at the end of that dungeon (see `dungeonChance`)
//              { event: 'puddle-lady' }       given out by that story event (see events.js)

export const treasureSettings = {
  dungeonChance: 0.2, // the chance a dungeon with a treasure gives it up when it's cleared
};

export const treasures = [
  // ---- Guarded by the lords of the monster castles ----
  {
    id: 'nightcap', name: "Grizzlewick's Nightcap", logName: "Grizzlewick's Nightcap",
    slot: 'helm', tag: 'Wild', stats: { defense: 0.4, maxHp: 3 }, effects: { healing: 0.3 },
    flavor: 'Still warm, and smells faintly of badger. Its wearer always wakes well rested.',
    from: { castle: 'Stumptail Keep' },
  },
  {
    id: 'bottomless-spoon', name: 'The Bottomless Spoon', logName: 'the Bottomless Spoon',
    slot: 'trinket', tag: 'Faith', stats: { maxHp: 3 }, effects: { potionHealing: 0.3 },
    flavor: 'However much you eat with it, there is always a little more.',
    from: { castle: 'Castle Hock' },
  },
  {
    id: 'gold-tooth', name: "Baron Goldtooth's Gold Tooth", logName: "Baron Goldtooth's Gold Tooth",
    slot: 'trinket', tag: 'Cunning', stats: { luck: 2.5 }, effects: { gold: 0.25 },
    flavor: 'Worn on a string around the neck. It still bites, now and then.',
    from: { castle: 'Goldrib Hall' },
  },
  {
    id: 'moss-shawl', name: "Mossmother's Shawl", logName: "Mossmother's Shawl",
    slot: 'armor', tag: 'Wild', stats: { defense: 0.6, maxHp: 4 }, effects: { lifesteal: 0.05 },
    flavor: 'Soft, green and slightly alive. It mends its wearer as they fight.',
    from: { castle: 'Pinion Tower' },
  },
  {
    id: 'grimsby-lance', name: "Sir Grimsby's Lance", logName: "Sir Grimsby's Lance",
    slot: 'weapon', tag: 'Might', stats: { power: 1.4, defense: 0.3 }, effects: { firstStrike: true },
    flavor: 'Made for one thing: charging first, and asking questions never.',
    from: { castle: 'Crookback Castle' },
  },
  {
    id: 'warhorn', name: "The Marshal's Warhorn", logName: "the Marshal's Warhorn",
    slot: 'trinket', tag: 'Might', stats: { power: 0.5 }, effects: { against: { undead: 0.25, spirit: 0.25 } },
    flavor: 'One blast, and the dead remember they are meant to be resting.',
    from: { castle: 'Knucklebone Fortress' },
  },
  {
    id: 'forgotten-crown', name: 'The Forgotten Crown', logName: 'the Forgotten Crown',
    slot: 'helm', tag: 'Arcane', stats: { defense: 0.3, luck: 2 }, effects: { xp: 0.2 },
    flavor: 'Nobody remembers whose it was. It remembers everything.',
    from: { castle: 'Hornhold' },
  },

  // ---- Sometimes hidden at the end of a dungeon ----
  {
    id: 'league-socks', name: 'Seven-League Socks', logName: 'the Seven-League Socks',
    slot: 'trinket', tag: 'Cunning', stats: { speed: 0.3, luck: 1 }, effects: { travelSpeed: 0.2 },
    flavor: 'Mismatched, darned at the heel, and astonishingly quick.',
    from: { dungeon: 'Snoring Burrow' },
  },
  {
    id: 'many-pockets', name: 'The Cloak of Many Pockets', logName: 'the Cloak of Many Pockets',
    slot: 'armor', tag: 'Cunning', stats: { defense: 0.7, speed: 0.4 }, effects: { loot: 0.1, potionCarry: 1 },
    flavor: 'Nobody has found the last pocket. Several people have found the first one twice.',
    from: { dungeon: 'Counting House' },
  },
  {
    id: 'humwhistle', name: 'Humwhistle, the Singing Sword', logName: 'Humwhistle, the Singing Sword',
    slot: 'weapon', tag: 'Arcane', stats: { power: 1.4, luck: 1 }, effects: { skillDamage: 0.2 },
    flavor: 'It hums when it is happy, and sings when it is swung. It is always happy.',
    from: { dungeon: 'Frozen Tunnel' },
  },

  // ---- Given out on the road ----
  {
    id: 'puddlebrand', name: 'Puddlebrand', logName: 'Puddlebrand',
    slot: 'weapon', tag: 'Faith', stats: { power: 1.3, maxHp: 2 }, effects: { critDamage: 0.3 },
    flavor: 'Handed over by a lady in a puddle. It is still slightly damp.',
    from: { event: 'puddle-lady' },
  },
];

// Log lines when a treasure is found. {the} is the treasure and {place} where it was found.
export const treasureLines = {
  castle: ['claimed {the} from the hoard of {place}.', 'found {the} in the hoard of {place}.'],
  dungeon: ['found {the} at the bottom of {place}!', 'dug {the} out of the treasure of {place}.'],
  event: ['was given {the}, a treasure of old.'],
};

// Words in the Chronicle and on the Hero tab. {region} is a region's name.
export const treasureText = {
  heading: 'Treasures: {found} of {total} found',
  about: 'One-of-a-kind items, each with something special about it.',
  firstFound: ['First found by {hero}.', 'First found by {hero}. Found {count} times in all.'],
  // How to find a treasure no hero has found yet
  hints: {
    castle: 'Guarded by the lord of a castle in {region}.',
    dungeon: 'Hidden, now and then, at the end of a dungeon in {region}.',
    event: 'Given to a worthy hero somewhere in {region}.',
    anywhere: 'Given to a worthy hero, somewhere on the road.', // (an event that can happen anywhere)
  },
  secretRegion: 'a land beyond the mist', // in place of a region still under the mist
};
