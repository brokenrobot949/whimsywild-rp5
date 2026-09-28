// Dungeons: pockets of dream that heroes explore room by room. A dungeon is a place on the
// map (see `kind: 'dungeon'` in regions.js) that rumors can lead to. Inside, the hero goes
// through the rooms one after another, shown in a panel over the map; the last room holds the
// dungeon's treasure, and a guardian stands before it. A badly hurt hero may retreat.
// Each hero can clear each dungeon once in their life.

export const dungeonSettings = {
  rooms: [4, 6],        // how many rooms before the guardian and the treasure (a dungeon can set its own)
  roomSeconds: 1.5,     // time spent in each room that isn't a fight
  // How often each kind of room comes up, before the guardian and the treasure.
  roomWeights: { fight: 5, treasure: 2, event: 2.5, rest: 1.5 },
  fightLevels: 0,       // monsters in dungeons are this many levels above those outside
  guardianLevels: 0,    // and the guardian this many (guardians are chosen to be tough already)
  harderBy: 2,          // rumors and Auto-decide treat a dungeon as this many levels above its region,
                        // so heroes are steered to them once they've grown into the region
  restHeals: 0.4,       // a quiet room heals this share of max HP (heroes don't heal otherwise inside)
  treasureGold: 3,      // a treasure chest holds gold worth this many fights at the hero's level
  treasureItemChance: 0.5, // and this chance of an item as well
  prizeGold: 6,         // the dungeon's treasure: gold worth this many fights, and an item of one
  prizeRarities: { rare: 70, epic: 25, legendary: 5 }, // of these rarities (by weight)
  retreatBelow: 0.5,    // between rooms, a hero below this share of max HP may retreat
  autoRetreatBelow: 0.4, // Auto-decide retreats below this share, and presses on otherwise
  deedPerLevel: 2,      // how grand a deed clearing a dungeon is: this times its region's top level
};

// Words in the dungeon panel and on cards. {words} are filled in automatically.
export const dungeonText = {
  rooms: {
    fight: 'Something lurks here',
    treasure: 'A treasure chest',
    event: 'A strange room',
    rest: 'A quiet alcove',
    guardian: 'The guardian',
    prize: 'The treasure',
  },
  progress: 'Room {room} of {rooms}',
  retreatTitle: 'Press on?',
  retreatBody: '{first} is badly hurt, with {left} rooms still to go in {place}.',
  pressOn: 'Press on',
  pressOnDetail: 'The treasure is close',
  retreat: 'Retreat',
  retreatDetail: 'Live to delve another day',
  rumorNote: 'Dungeon', // shown on rumor cards that lead to a dungeon
};

// Log lines. {place}, {a} and {gold} are filled in automatically. (Going in is logged with the
// dungeon's own arriveLines, in regions.js.)
export const dungeonLines = {
  treasure: ['opened a chest and found {gold} gold.', 'found a chest with {gold} gold in it.'],
  treasureItem: ['found {a} in a dusty chest.', 'pried open a chest and took out {a}.'],
  rest: ['rested in a quiet alcove and bound their wounds.', 'found a dry corner and caught their breath.'],
  guardian: ['faced the guardian of the treasure: {a}.', 'found {a} guarding the treasure.'],
  prize: ['claimed the treasure of {place}, and {gold} gold with it.', 'reached the heart of {place}. Treasure!'],
  prizeItem: ["took {a} from the dungeon's hoard.", 'lifted {a} out of the hoard.'],
  cleared: ['climbed out of {place}, blinking in the light.', 'left {place} richer, and a little dustier.'],
  retreat: ['retreated from {place}, bruised but alive.', 'turned back from {place} while they still could.'],
  pressOn: ['gritted their teeth and pressed on.', 'decided the treasure was worth it.'],
  alreadyCleared: ['looked into {place}. Nothing stirred.'],
};
