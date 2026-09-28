// Monster castles: nightmares that took root. Each region has one, held by a boss. A castle
// plays like a dungeon (see dungeons.js), room by room, but it's longer and harder, and ends
// with the boss and its hoard. Once any hero beats the boss, the castle is conquered for good:
// its banner flies on the map for every hero after, and the monsters of its region are a
// little weaker from then on. A hero who retreats or falls leaves the castle as it was, and
// the boss is back to full strength for the next hero.
//
// The castles are places in regions.js (`kind: 'castle'`), and their bosses are monsters in
// monsters.js (`boss: true`), each with a special move.

export const castleSettings = {
  rooms: [5, 7],        // how many rooms before the boss and the hoard (a castle can set its own)
  roomSeconds: 1.5,     // time spent in each room that isn't a fight
  // How often each kind of room comes up, before the boss and the hoard.
  roomWeights: { fight: 6, treasure: 1.5, event: 1.5, rest: 2 },
  fightLevels: 1,       // monsters in castles are this many levels above those outside
  guardianLevels: 1,    // the boss always fights at the top of its region's levels, plus this many
  harderBy: 3,          // rumors and Auto-decide treat a castle as this many levels above its region
  extraSkull: 1,        // and rumor cards show it with this many more danger skulls (3 at most)
  restHeals: 0.4,       // a quiet room heals this share of max HP (heroes don't heal otherwise inside)
  treasureGold: 3,      // a treasure chest holds gold worth this many fights at the hero's level
  treasureItemChance: 0.5, // and this chance of an item as well
  prizeGold: 15,        // the hoard: gold worth this many fights, and an item of one
  prizeRarities: { epic: 75, legendary: 25 }, // of these rarities (by weight)
  retreatBelow: 0.6,    // between rooms, a hero below this share of max HP may retreat
  autoRetreatBelow: 0.5, // Auto-decide retreats below this share, and presses on otherwise
  deedPerLevel: 10,     // how grand a deed conquering a castle is: this times its region's top level
  calm: 0.03,           // once a region's castle falls, its monsters are this much weaker (0.03 is 3%).
                        // Small changes matter: with every castle fallen, 3% makes about 6 heroes in
                        // 100 die instead of 10, and 10% makes it about 2
};

// Words in the castle panel, on cards and in the Chronicle. {words} are filled in automatically.
export const castleText = {
  rooms: {
    fight: 'Something lurks here',
    treasure: 'A treasure chest',
    event: 'A strange room',
    rest: 'A quiet corner',
    guardian: 'The lord of the castle',
    prize: 'The hoard',
  },
  rumorNote: 'Castle', // shown on rumor cards that lead to a castle
  bossMove: '{move}! {damage}',       // on the fight card, when a boss uses its special move
  bossHeal: '{move}: +{healed} HP',   // the same, for a move that heals the boss
  chronicleHeading: 'Monster castles: {conquered} of {total} conquered',
  held: 'Held by {boss}.',
  conquered: 'Conquered by {hero}, age {age}.',
  hidden: 'Hidden in the fog: {count} more.',
  hiddenOne: 'Hidden in the fog: 1 more.',
};

// Log lines. {place}, {a} and {gold} are filled in automatically. (Going in is logged with the
// castle's own arriveLines, in regions.js.)
export const castleLines = {
  boss: ['stood before {a}, lord of {place}.', 'reached the throne room, where {a} was waiting.'],
  prize: ["claimed the hoard of {place}: {gold} gold, and more.", 'threw open the doors of the hoard. {gold} gold!'],
  prizeItem: ['took {a} from the hoard.', 'lifted {a} from the pile of treasure.'],
  conquered: [
    'raised their banner over {place}. The land breathes easier.',
    'flew their banner over {place}. The nightmare is over.',
  ],
  alreadyConquered: ['walked the quiet halls of {place}. The banner still flies.'],
};
