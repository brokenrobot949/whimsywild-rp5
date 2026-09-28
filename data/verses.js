// The lullaby that once sang the dragon to sleep. Its verses are hidden across the land, one in
// each region, in a dungeon or a monster castle. They can only be found once the lullaby is
// known, in Act 2 (see story.js). A hero who clears the dungeon may find its verse (see
// dungeonChance below); the hero who conquers the castle always does. Either way it's found
// for good. (If the castle had already fallen, the next hero to visit it finds the verse.)
//
// A found verse becomes a skill that every future hero may be offered at their skill picks.
// Verses don't belong to any of the five tags, so they suit any hero.
//
// Each verse:
//   id      a short name the game uses; don't change it once players have found the verse
//   title   the verse's name, which is also the name of its skill
//   region  the region it belongs to (from regions.js)
//   place   the dungeon or castle it's hidden in (from regions.js)
//   lines   the words of the verse, shown in the Chronicle. The first line is the skill's flavor
//   rumor   an extra rumor about the place, heard while the verse is still lost (under ~60 characters)
//   skill   what the skill does: kind 'active' or 'passive', and ranks, just like skills.js

export const verseSettings = {
  findFromAct: 2,     // verses can be found from this act on
  dungeonChance: 0.25, // a verse in a dungeon is well hidden: each hero who clears the dungeon has
                      // this chance to find it (0.25 is 1 in 4). A castle's verse is always found
                      // by the hero who conquers the castle
  offerWeight: 2,     // how likely a found verse is to be offered at a skill pick. A skill in a tag
                      // the hero has 2 points in has a weight of 4, one in a tag with none has 1.
                      // At 2, about half of heroes learn a verse once all are found (at 4, 9 in 10)
  autoBehind: 1,      // Auto-decide rates a verse this many points below the hero's strongest tag
  rumorWeight: 2,     // places hiding a lost verse come up this many times as often in rumors
  deedPerLevel: 6,    // how grand a deed finding a verse is: this times its region's top level
};

export const verses = [
  {
    id: 'hush', title: 'Hush, Little Hills', region: 'tailwoods', place: 'Snoring Burrow',
    lines: [
      'Hush now, little hills, and lay your heads down low;',
      "the summer's lazy river will rock you soft and slow.",
    ],
    rumor: 'A song is scratched on the walls of the Snoring Burrow.',
    skill: {
      kind: 'passive',
      ranks: [{ healing: 0.4 }, { healing: 0.7 }, { healing: 1 }],
    },
  },
  {
    id: 'warm-bread', title: 'Warm Bread, Warm Bed', region: 'hindhill', place: 'Root Cellar',
    lines: [
      'Warm bread upon the table, warm blankets on the bed;',
      'no hungry dream can find you, so rest your weary head.',
    ],
    rumor: 'An old lullaby is carved on a beam in the Root Cellar.',
    skill: {
      kind: 'passive',
      ranks: [{ boost: { maxHp: 0.06 } }, { boost: { maxHp: 0.1 } }, { boost: { maxHp: 0.14 } }],
    },
  },
  {
    id: 'golden-sheep', title: 'Count the Golden Sheep', region: 'flank', place: 'Goldrib Hall',
    lines: [
      'Count the golden sheep that leap the silver stile;',
      'the richest dream of all is one that makes you smile.',
    ],
    rumor: 'Baron Goldtooth keeps a song locked up with his gold.',
    skill: {
      kind: 'passive',
      ranks: [
        { gold: 0.15, boost: { luck: 0.06 } },
        { gold: 0.25, boost: { luck: 0.1 } },
        { gold: 0.35, boost: { luck: 0.14 } },
      ],
    },
  },
  {
    id: 'small-things', title: 'Small Things Sleep Soundly', region: 'fens', place: 'Pinion Tower',
    lines: [
      'The wren sleeps in the reeds, the beetle in the bark;',
      'the smallest things sleep soundest, safe inside the dark.',
    ],
    rumor: 'A lost verse grows in the moss of Pinion Tower.',
    skill: {
      kind: 'passive',
      ranks: [{ dodge: 4 }, { dodge: 6 }, { dodge: 8 }],
    },
  },
  {
    id: 'lance', title: 'The Knight Lays Down His Lance', region: 'spine', place: 'Barrow of Knights',
    lines: [
      'The knight lays down his lance, the banner folds away;',
      'there are no dragons left to fight at the end of the day.',
    ],
    rumor: 'The knights in the Barrow were buried with a song.',
    skill: {
      kind: 'active',
      ranks: [
        { strike: 1.2, stun: 1.5, cooldown: 8 },
        { strike: 1.4, stun: 2, cooldown: 7.5 },
        { strike: 1.6, stun: 2.5, cooldown: 7 },
      ],
    },
  },
  {
    id: 'drums', title: 'The Drums Grow Quiet', region: 'claws', place: 'Knucklebone Fortress',
    lines: [
      'The drums grow quiet one by one, the old war fades from view;',
      'lay down your shield, my darling, the night will watch for you.',
    ],
    rumor: 'The Bone Marshal hums a tune he cannot finish.',
    skill: {
      kind: 'active',
      ranks: [
        { heal: 0.25, when: 0.5, cooldown: 12 },
        { heal: 0.32, when: 0.5, cooldown: 11 },
        { heal: 0.4, when: 0.5, cooldown: 10 },
      ],
    },
  },
  {
    id: 'not-alone', title: 'You Are Not Alone', region: 'smokecrown', place: 'Hornhold',
    lines: [
      'Sleep now, old friend, you are not alone; we came so very far,',
      'and we will remember who you were, and love you as you are.',
    ],
    rumor: 'The king of Hornhold guards the last verse of a lullaby.',
    skill: {
      kind: 'passive',
      ranks: [
        { boost: { power: 0.04, defense: 0.04, maxHp: 0.04 } },
        { boost: { power: 0.06, defense: 0.06, maxHp: 0.06 } },
        { boost: { power: 0.08, defense: 0.08, maxHp: 0.08 } },
      ],
    },
  },
];

// Words on cards and in the Chronicle. {words} are filled in automatically.
export const verseText = {
  chip: 'Lullaby',            // the chip on a verse's skill, where other skills show their tag
  chipColor: '#8a5a9e',
  heading: 'The lullaby: {found} of {total} verses',
  foundBy: 'Found at {place} by {hero}, age {age}.',
  lost: 'Still lost: {count} verses.',
  lostOne: 'Still lost: 1 verse.',
};

// Log lines. {title} is the verse's title.
export const verseLines = {
  found: [
    'found a verse of the old lullaby: "{title}".',
    'learned a lost verse by heart: "{title}".',
  ],
};
