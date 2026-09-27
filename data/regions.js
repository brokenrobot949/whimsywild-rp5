// Regions and places of Whimsywild.
// Phase 1 has one region, the Tailwoods, drawn on a small placeholder map.
// Phase 2 replaces the placeholder with the full dragon-shaped world.

// Each region's name, level range, dream theme and wandering lines.
// Wandering lines show up in the log while a hero walks through the region.
// Keep each line under about 70 characters (the log adds "Autumn, age 34: " in front).
export const regions = {
  tailwoods: {
    name: 'The Tailwoods',
    levels: [1, 6],
    dreamTheme: 'A lazy summer',
    wanderingLines: [
      'shared a sandwich with a suspicious squirrel.',
      'stepped in a slime puddle. The boots never fully recovered.',
      'was glared at by a badger for no clear reason.',
      'napped under an oak for most of an afternoon.',
      'found a four-leaf clover, then lost it immediately.',
      'helped a farmer chase a runaway turnip.',
      'hummed a lullaby nobody could remember the words to.',
      'got lost for an hour in a very small wood.',
      'traded a button for a slightly better button.',
      'watched clouds drift by, each one shaped like a sheep.',
      'counted bees, lost count, and started again.',
      'was chased a short way by an indignant goose.',
      'rescued a beetle from a puddle. It did not say thank you.',
      'picked blackberries and ate most of them on the spot.',
    ],
  },
};

// Towns and landmarks.
//   mark        the digit that shows where the place sits on the map below
//   kind        'town' or 'landmark'
//   region      which region it belongs to (from the list above)
//   name        the label shown on the map
//   logName     how the log names it in a sentence, e.g. 'the Old Mill'
//   ground      the terrain under the place (from terrain.js)
//   sprite      the picture that marks the place on the map (optional; see art.js)
//   arriveLines one is picked each time a hero arrives
export const places = [
  {
    mark: '1', kind: 'town', region: 'tailwoods',
    name: 'Tailsend', logName: 'Tailsend', ground: 'road',
    arriveLines: [
      'returned to Tailsend. The inn still smelled of onions, happily.',
      'wandered back into Tailsend for a hot meal and a warm bed.',
      'reached Tailsend, where the baker waved a floury hand.',
    ],
  },
  {
    mark: '2', kind: 'landmark', region: 'tailwoods',
    name: 'Old Mill', logName: 'the Old Mill', ground: 'meadow',
    sprite: { sheet: 'town', tile: 93 }, // a hay bale
    arriveLines: [
      'reached the Old Mill. The wheel turned, somewhat reluctantly.',
      'rested at the Old Mill and was mistaken for a sack of flour.',
    ],
  },
  {
    mark: '3', kind: 'landmark', region: 'tailwoods',
    name: 'Mossy Stones', logName: 'the Mossy Stones', ground: 'meadow',
    sprite: { sheet: 'dungeon', tile: 65 }, // a standing stone
    arriveLines: [
      'found the Mossy Stones. They were mossier than advertised.',
      'counted the Mossy Stones twice and got two different answers.',
    ],
  },
  {
    mark: '4', kind: 'landmark', region: 'tailwoods',
    name: 'Badger Hollow', logName: 'Badger Hollow', ground: 'meadow',
    sprite: { sheet: 'town', tile: 92 }, // a burrow mound
    arriveLines: [
      'passed through Badger Hollow. The badgers were grumpy, as ever.',
      'tiptoed through Badger Hollow without waking a single badger.',
    ],
  },
  {
    mark: '5', kind: 'landmark', region: 'tailwoods',
    name: 'Drowsy Pond', logName: 'the Drowsy Pond', ground: 'flowers',
    sprite: { sheet: 'town', tile: 17 }, // reeds
    arriveLines: [
      'reached the Drowsy Pond and napped beside it until sundown.',
      'skipped stones across the Drowsy Pond. Personal best: four.',
    ],
  },
  {
    mark: '6', kind: 'landmark', region: 'tailwoods',
    name: 'Hollow Oak', logName: 'the Hollow Oak', ground: 'meadow',
    sprite: { sheet: 'town', tile: 15 }, // a big autumn tree
    arriveLines: [
      'sheltered inside the Hollow Oak, which creaked like a snore.',
      'carved a name into the Hollow Oak, beside a hundred others.',
    ],
  },
  {
    mark: '7', kind: 'landmark', region: 'tailwoods',
    name: "Tail's Tip", logName: "the Tail's Tip", ground: 'meadow',
    sprite: { sheet: 'town', tile: 83 }, // a signpost
    arriveLines: [
      "climbed the Tail's Tip and gazed out over the endless woods.",
      "stood atop the Tail's Tip. The ground felt oddly warm.",
    ],
  },
];

// Placeholder map of the Tailwoods. Every row must be the same length.
// Key:  .  meadow    ,  flowers   T  forest   ^  hills
//       ~  water     =  road      #  bridge   H  a house (its roof shows in the square above)
//       1-9  the places listed above
export const placeholderMap = [
  'TTTTTTTTTTTTTT~~TTTTTTTTTTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTT~~TTTTTTTTTTTTTTTTT^^^TTTT',
  'TTT......TTTT.~~.TTT......TTTTT^^^^^^^TT',
  'TT..,,,...TT..~~..T........TTT^^^^^^^^^T',
  'TT.,,,,.......~~........3..TT^^^^^^^^^^T',
  'T.............~~........=..T^^^^^^^7^^^T',
  'T.............~~........=...T^^^^^^=^^^T',
  'TT..,,......2.~~........=......=====^^^T',
  'TT..........=.~~........=......=..^^^^TT',
  'TT...,,.....=.~~....TTT.=......=....^^TT',
  'TTT.........=.~~...TTTT.=.,,...=......TT',
  'TTT.........=.~~....TT..=......=.....TTT',
  'TT..........=.~~........=......=....TTTT',
  'TT...H.H.H..=.~~........=......=...TTTTT',
  'TT.....1======##================...TTTTT',
  'TT............~~........=...........TTTT',
  'TTT..H.H.H....~~........=...TT.......TTT',
  'TTT.,,........~~...,,...=..TTTT.....TTTT',
  'TTTT..........~~........=...TT......TTTT',
  'TTTTTT........~~.....5===...........TTTT',
  'TTTTTTTT......~~...~~~~~.......TT...TTTT',
  'TTTTTTTT......~~...~~~~~~......T....TTTT',
  'TTTTTTTTT.....~~..~~~~~~.......TT6..TTTT',
  'TTTT4TTTTT....~~..~~~~.........TTT...TTT',
  'TTTTTTTTTTT...~~......TTTT.....TTTTTTTTT',
  'TTTTTTTTTTTT..~~TTTTTTTTTTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTT.~~TTTTTTTTTTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTT~~TTTTTTTTTTTTTTTTTTTTTTTT',
];
