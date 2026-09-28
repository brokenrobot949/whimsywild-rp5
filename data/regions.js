// Regions and places of Whimsywild. The dragon's shape is drawn in world.js.
//
// Each region:
//   letter          the character that marks it in the outline in world.js
//   name, levels    its name and the monster levels it's meant for
//   dreamTheme      what the dragon dreams of here
//   sealed          true means dream-mist covers it and heroes can't enter yet (a later phase)
//   ground          the terrain cleared around its towns and landmarks (see terrain.js)
//   terrain         what the land is made of: [terrain, share] pairs. Terrains next to each
//                   other in the list tend to sit next to each other on the map
//   wanderingLines  small moments logged while heroes walk here. Keep each line under
//                   about 70 characters (the log adds "Autumn, age 34: " in front)
export const regions = {
  tailwoods: {
    letter: 't', name: 'The Tailwoods', levels: [1, 6], dreamTheme: 'A lazy summer',
    ground: 'meadow',
    terrain: [['forest', 5], ['meadow', 4], ['flowers', 1], ['hills', 0.6]],
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
  hindhill: {
    letter: 'h', name: 'Hindhill Farms', levels: [5, 10], dreamTheme: 'Hunger',
    ground: 'meadow',
    terrain: [['forest', 1.5], ['meadow', 4], ['fields', 3.5], ['flowers', 1]],
    wanderingLines: [
      'ate an apple that was still arguing.',
      'helped a farmer pull up a very stubborn carrot.',
      'was offered pie by six different grandmothers.',
      'tiptoed past a field of suspiciously hungry cabbages.',
      'smelled baking bread for miles, but found no bakery.',
      'chased a runaway wheel of cheese down a hill.',
      'counted the scarecrows twice. There were more the second time.',
      'shared a picnic with a very polite pig.',
    ],
  },
  flank: {
    letter: 'g', name: 'The Glittering Flank', levels: [9, 14], dreamTheme: 'Gold',
    ground: 'goldGrass',
    terrain: [['goldWood', 3], ['goldGrass', 5], ['rocks', 1.5]],
    wanderingLines: [
      'found a gold coin, then another, then got suspicious.',
      'watched the grass glitter like spilled coins.',
      'was followed for miles by a magpie with expensive taste.',
      'polished a shiny stone for an hour. Still a stone.',
      'heard the ground jingle faintly with every step.',
      'traded a sandwich for a treasure map. The map was a sandwich.',
      'saw a goblin counting coins by the roadside.',
      'sneezed, and a nearby chest said "bless you".',
    ],
  },
  fens: {
    letter: 'w', name: 'The Wingshade Fens', levels: [13, 18], dreamTheme: 'Being small',
    ground: 'bog',
    terrain: [['water', 2.5], ['bog', 5], ['forest', 2.5]],
    wanderingLines: [
      'waded through reeds taller than a church steeple.',
      'sheltered from the rain under a single enormous leaf.',
      'was overtaken by a dragonfly the size of a pony.',
      'crossed a puddle. It took most of the afternoon.',
      'felt oddly small all day. The boots agreed.',
      'mistook a dandelion clock for a tree.',
      'heard a frog chorus sing in a very deep bass.',
      'climbed a toadstool to see the way. It was a long way.',
    ],
  },
  spine: {
    letter: 's', name: 'The Spine Peaks', levels: [17, 22], dreamTheme: 'Knights', sealed: true,
    ground: 'highland',
    terrain: [['forest', 1.5], ['highland', 4], ['rocks', 4.5]],
    wanderingLines: [],
  },
  claws: {
    letter: 'c', name: 'The Clawlands', levels: [21, 26], dreamTheme: 'An ancient war', sealed: true,
    ground: 'badlands',
    terrain: [['rocks', 2], ['badlands', 5], ['ash', 2]],
    wanderingLines: [],
  },
  smokecrown: {
    letter: 'k', name: 'Smokecrown', levels: [25, 30], dreamTheme: 'Loneliness', sealed: true,
    ground: 'ash',
    terrain: [['lava', 1.2], ['ash', 6], ['rocks', 2.5]],
    wanderingLines: [],
  },
};

// Towns and landmarks.
//   kind        'town' or 'landmark'
//   recruitLevel (towns) once discovered, heroes can start here at this level
//   region      which region it belongs to (from the list above)
//   at          where it stands: [tiles across, tiles down] from the top-left corner
//   name        the label shown on the map
//   logName     how the log names it in a sentence, e.g. 'the Old Mill'
//   ground      the terrain under a landmark (optional; the region's ground if left out)
//   sprite      the picture that marks it on the map (optional; see art.js)
//   arriveLines one is picked each time a hero arrives
//   rumors      what folk say about it, shown on rumor cards. Places without rumors are
//               never rumored. Keep each under about 60 characters
export const places = [
  // ---- The Tailwoods ----
  {
    kind: 'town', region: 'tailwoods', at: [102, 182], recruitLevel: 1,
    name: 'Tailsend', logName: 'Tailsend',
    arriveLines: [
      'returned to Tailsend. The inn still smelled of onions, happily.',
      'wandered back into Tailsend for a hot meal and a warm bed.',
      'reached Tailsend, where the baker waved a floury hand.',
    ],
    rumors: [
      "The baker in Tailsend is giving away yesterday's bread.",
      "Tailsend's inn has a new cook, and a new smell.",
    ],
  },
  {
    kind: 'landmark', region: 'tailwoods', at: [121, 179],
    name: "Tail's Tip", logName: "the Tail's Tip",
    sprite: { sheet: 'town', tile: 83 }, // a signpost
    arriveLines: [
      "climbed the Tail's Tip and gazed out over the endless woods.",
      "stood atop the Tail's Tip. The ground felt oddly warm.",
    ],
    rumors: [
      "From the Tail's Tip, they say, you can see the whole world.",
      "Something warm hums beneath the Tail's Tip.",
    ],
  },
  {
    kind: 'landmark', region: 'tailwoods', at: [69, 185],
    name: 'Drowsy Pond', logName: 'the Drowsy Pond', ground: 'flowers',
    sprite: { sheet: 'town', tile: 17 }, // reeds
    arriveLines: [
      'reached the Drowsy Pond and napped beside it until sundown.',
      'skipped stones across the Drowsy Pond. Personal best: four.',
    ],
    rumors: [
      'Nobody who naps by the Drowsy Pond wakes up grumpy.',
      'A frog at the Drowsy Pond knows everyone by name.',
    ],
  },
  {
    kind: 'landmark', region: 'tailwoods', at: [47, 176],
    name: 'Old Mill', logName: 'the Old Mill',
    sprite: { sheet: 'town', tile: 93 }, // a hay bale
    arriveLines: [
      'reached the Old Mill. The wheel turned, somewhat reluctantly.',
      'rested at the Old Mill and was mistaken for a sack of flour.',
    ],
    rumors: [
      "The miller's cat vanished near the Old Mill.",
      'The Old Mill grinds at night, with nobody inside.',
    ],
  },
  {
    kind: 'landmark', region: 'tailwoods', at: [26, 154],
    name: 'Hollow Oak', logName: 'the Hollow Oak',
    sprite: { sheet: 'town', tile: 15 }, // a big autumn tree
    arriveLines: [
      'sheltered inside the Hollow Oak, which creaked like a snore.',
      'carved a name into the Hollow Oak, beside a hundred others.',
    ],
    rumors: [
      'The Hollow Oak creaks like something breathing.',
      'Names carved in the Hollow Oak go back a thousand years.',
    ],
  },
  {
    kind: 'landmark', region: 'tailwoods', at: [18, 134],
    name: 'Badger Hollow', logName: 'Badger Hollow',
    sprite: { sheet: 'town', tile: 92 }, // a burrow mound
    arriveLines: [
      'passed through Badger Hollow. The badgers were grumpy, as ever.',
      'tiptoed through Badger Hollow without waking a single badger.',
    ],
    rumors: [
      'The badgers of Badger Hollow are holding a meeting.',
      'Something in Badger Hollow has upset the badgers.',
    ],
  },
  {
    kind: 'landmark', region: 'tailwoods', at: [26, 110],
    name: 'Mossy Stones', logName: 'the Mossy Stones',
    sprite: { sheet: 'dungeon', tile: 65 }, // a standing stone
    arriveLines: [
      'found the Mossy Stones. They were mossier than advertised.',
      'counted the Mossy Stones twice and got two different answers.',
    ],
    rumors: [
      'The Mossy Stones moved again last night.',
      'A hermit counts the Mossy Stones and never gets the same total.',
    ],
  },

  // ---- Hindhill Farms ----
  {
    kind: 'town', region: 'hindhill', at: [58, 126], recruitLevel: 4,
    name: 'Haunchford', logName: 'Haunchford',
    arriveLines: [
      'reached Haunchford, where every window smelled of pie.',
      'strolled into Haunchford and was handed a pie at the gate.',
    ],
    rumors: [
      'In Haunchford, they say, every window smells of pie.',
      'Haunchford pays well for anyone who can guard a harvest.',
    ],
  },
  {
    kind: 'landmark', region: 'hindhill', at: [46, 118],
    name: 'Great Haystack', logName: 'the Great Haystack',
    sprite: { sheet: 'farm', tile: 96 }, // a hay block
    arriveLines: [
      'climbed the Great Haystack and slid down the other side.',
      'searched the Great Haystack for a needle. Found three.',
    ],
    rumors: [
      'A haystack the size of a castle sits on the haunch.',
      'Children say something sleeps inside the Great Haystack.',
    ],
  },
  {
    kind: 'landmark', region: 'hindhill', at: [64, 142],
    name: 'Kneecap Barn', logName: 'the Kneecap Barn',
    sprite: { sheet: 'farm', tile: 97 }, // a red barn door
    arriveLines: [
      'reached the Kneecap Barn. It creaked when the ground shifted.',
      'sheltered in the Kneecap Barn with some opinionated cows.',
    ],
    rumors: [
      'A barn on the Kneecap creaks whenever the ground shifts.',
      'Scarecrows gather at the Kneecap Barn after dark.',
    ],
  },
  {
    kind: 'landmark', region: 'hindhill', at: [74, 160],
    name: 'Heelstone Orchard', logName: 'Heelstone Orchard',
    sprite: { sheet: 'farm', tile: 78 }, // a berry bush
    arriveLines: [
      'reached Heelstone Orchard and picked an apple that bit back.',
      'rested in Heelstone Orchard under a very ticklish tree.',
    ],
    rumors: [
      'The apples of Heelstone Orchard bite back.',
      'An orchard grows at the heel, where nothing should grow.',
    ],
  },
  {
    kind: 'landmark', region: 'hindhill', at: [90, 166],
    name: 'Giant Sunflower', logName: 'the Giant Sunflower',
    sprite: { sheet: 'farm', tile: 83 }, // a sunflower
    arriveLines: [
      'stood beneath the Giant Sunflower. It turned to look.',
      'caught a seed from the Giant Sunflower. It weighed a stone.',
    ],
    rumors: [
      'A sunflower taller than a tower watches travellers pass.',
      'The Giant Sunflower drops seeds the size of shields.',
    ],
  },

  // ---- The Glittering Flank ----
  {
    kind: 'town', region: 'flank', at: [98, 128], recruitLevel: 8,
    name: 'Scaleport', logName: 'Scaleport',
    arriveLines: [
      'reached Scaleport. Everything glittered, including the fish.',
      'walked into Scaleport and was charged a coin for the view.',
    ],
    rumors: [
      'Ships in Scaleport are paid in scales that glitter.',
      'Scaleport is hiring brave souls to guard its gold.',
    ],
  },
  {
    kind: 'landmark', region: 'flank', at: [80, 96],
    name: 'Ribcage Ridge', logName: 'Ribcage Ridge',
    sprite: { sheet: 'farm', tile: 89 }, // a pile of rocks
    arriveLines: [
      'climbed Ribcage Ridge, which curved like a giant rib.',
      'dug at Ribcage Ridge and found a very old spoon.',
    ],
    rumors: [
      'A ridge of white stone curves like the ribs of a giant.',
      'Treasure hunters dig at Ribcage Ridge. Some come back.',
    ],
  },
  {
    kind: 'landmark', region: 'flank', at: [120, 104],
    name: 'Gilded Scale', logName: 'the Gilded Scale',
    sprite: { sheet: 'dungeon', tile: 101 }, // a round shield
    arriveLines: [
      'touched the Gilded Scale and dreamed of gold for a moment.',
      'polished the Gilded Scale. It hummed with pleasure.',
    ],
    rumors: [
      'A golden scale the size of a house lies in a meadow.',
      'Whoever touches the Gilded Scale dreams of gold.',
    ],
  },
  {
    kind: 'landmark', region: 'flank', at: [78, 122],
    name: 'Belly Mine', logName: 'the Belly Mine',
    sprite: { sheet: 'dungeon', tile: 63 }, // a mine door
    arriveLines: [
      'peered into the Belly Mine. It rumbled back.',
      'reached the Belly Mine, abandoned with its lanterns still lit.',
    ],
    rumors: [
      'The Belly Mine rumbles, as if something is hungry.',
      'Miners fled the Belly Mine and left their gold behind.',
    ],
  },
  {
    kind: 'landmark', region: 'flank', at: [132, 92],
    name: "Dragon's Purse", logName: "the Dragon's Purse",
    sprite: { sheet: 'dungeon', tile: 89 }, // a treasure chest
    arriveLines: [
      "found the Dragon's Purse. It was locked, and snoring.",
      "sat on the Dragon's Purse, just to feel rich for a moment.",
    ],
    rumors: [
      "A chest in the hills holds a dragon's pocket money.",
      "The Dragon's Purse opens only for the bold.",
    ],
  },

  // ---- The Wingshade Fens: the dragon dreams of being small ----
  {
    kind: 'town', region: 'fens', at: [90, 46], recruitLevel: 12,
    name: 'Fenmoot', logName: 'Fenmoot',
    arriveLines: [
      'squelched into Fenmoot, where the houses stand on stilts.',
      'reached Fenmoot and dried off by a very tall fire.',
    ],
    rumors: [
      'Fenmoot is built on stilts, and the stilts keep growing.',
      'In Fenmoot, even the mayor feels small.',
    ],
  },
  {
    kind: 'landmark', region: 'fens', at: [52, 70],
    name: 'Featherwell', logName: 'the Featherwell',
    sprite: { sheet: 'town', tile: 104 }, // a well
    arriveLines: [
      'drank from the Featherwell. It tasted of clouds.',
      'watched feathers float up out of the Featherwell.',
    ],
    rumors: [
      'Feathers rise from a well where the fens begin.',
      'Drink from the Featherwell and feel light as air.',
    ],
  },
  {
    kind: 'landmark', region: 'fens', at: [60, 52],
    name: 'Rain Barrel', logName: 'the Rain Barrel',
    sprite: { sheet: 'farm', tile: 73 }, // a barrel of water
    arriveLines: [
      'reached the Rain Barrel and swam a lap of it.',
      'watched frogs sail across the Rain Barrel in walnut shells.',
    ],
    rumors: [
      'A rain barrel in the fens is big enough to sail on.',
      'Frogs row little boats across a giant rain barrel.',
    ],
  },
  {
    kind: 'landmark', region: 'fens', at: [118, 38],
    name: "Giant's Arrow", logName: "the Giant's Arrow",
    sprite: { sheet: 'town', tile: 119 }, // an arrow
    arriveLines: [
      "reached the Giant's Arrow. Nobody has found the giant.",
      "tried to pull out the Giant's Arrow. It did not budge.",
    ],
    rumors: [
      'An arrow as tall as a mast stands in the bog.',
      "Whoever shot the Giant's Arrow is still out there.",
    ],
  },
  {
    kind: 'landmark', region: 'fens', at: [44, 26],
    name: 'Fairy Ring', logName: 'the Fairy Ring',
    sprite: { sheet: 'dungeon', tile: 56 }, // a ring of stones
    arriveLines: [
      'stepped into the Fairy Ring and felt about an inch tall.',
      'danced once around the Fairy Ring, as custom demands.',
    ],
    rumors: [
      'Step in the Fairy Ring on the wingtip, and you shrink.',
      'A ring of stones at the edge of the fens hums at night.',
    ],
  },

  // ---- Towns of the sealed regions ----
  {
    kind: 'town', region: 'spine', at: [118, 74], recruitLevel: 16,
    name: 'Ridgehold', logName: 'Ridgehold',
    arriveLines: ['climbed into Ridgehold, perched on the ridge like a crown.'],
  },
  {
    kind: 'town', region: 'claws', at: [130, 142], recruitLevel: 20,
    name: 'Talonreach', logName: 'Talonreach',
    arriveLines: ['reached Talonreach, a town of old walls and older soldiers.'],
  },
  {
    kind: 'town', region: 'smokecrown', at: [166, 42], recruitLevel: 24,
    name: 'Lastlight', logName: 'Lastlight',
    arriveLines: ['reached Lastlight, where the lamps never go out.'],
  },

  // ---- Smokecrown ----
  {
    kind: 'landmark', region: 'smokecrown', at: [192, 54],
    name: 'The Smoking Nostril', logName: 'the Smoking Nostril',
    sprite: { sheet: 'creatures', tile: 55 }, // a flame
    arriveLines: ['stood at the rim of the Smoking Nostril. It breathed out.'],
  },
];
