// Regions and places of Whimsywild. The dragon's shape is drawn in world.js.
//
// Each region:
//   letter          the character that marks it in the outline in world.js
//   name, levels    its name and the monster levels it's meant for
//   dreamTheme      what the dragon dreams of here
//   sealed          true means dream-mist covers it and heroes can't enter yet (a later phase)
//   opensInAct      dream-mist covers it until the story reaches this act (see story.js)
//   openLine        logged in the life of the hero whose deed lifts the mist (under ~70 characters)
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
    letter: 's', name: 'The Spine Peaks', levels: [17, 22], dreamTheme: 'Knights',
    ground: 'highland',
    terrain: [['forest', 1.5], ['highland', 4], ['rocks', 4.5]],
    wanderingLines: [
      'passed an old tourney ground, its banners faded to grey.',
      'found a helmet on a rock, still polished.',
      'heard hoofbeats echo through the pass. Nobody came.',
      'climbed a ridge that curved like a great back.',
      'shared a fire with a knight who would not say his quest.',
      'watched eagles circle the high peaks.',
      'found a lance snapped clean in two, as if on something hard.',
    ],
  },
  claws: {
    letter: 'c', name: 'The Clawlands', levels: [21, 26], dreamTheme: 'An ancient war',
    ground: 'badlands',
    terrain: [['rocks', 2], ['badlands', 5], ['ash', 2]],
    wanderingLines: [
      'walked past rusted swords, still stuck in the ground.',
      'heard a distant war horn. Nobody else did.',
      'found an old battle map. Both sides had lost.',
      'saw the ground scored by five great furrows.',
      'picked a flower growing out of an old helmet.',
      'marched in step for a mile before noticing.',
      'found an arrowhead the size of a spade.',
    ],
  },
  smokecrown: {
    letter: 'k', name: 'Smokecrown', levels: [25, 30], dreamTheme: 'Loneliness', opensInAct: 3,
    openLine: 'saw the mist over Smokecrown lift, far to the north.',
    ground: 'ash',
    terrain: [['lava', 1.2], ['ash', 6], ['rocks', 2.5]],
    wanderingLines: [
      'found a child\'s shoe in the ash, and wondered whose it was.',
      'heard an echo answer a question nobody had asked.',
      'passed a house with a lamp lit in the window, and nobody home.',
      'watched the smoke drift up like a long, slow sigh.',
      'found a note that said "back soon". The ink had faded.',
      'sat on a bench built for two, and felt the empty half.',
      'heard the ground breathing, very slowly, underfoot.',
    ],
  },
};

// Towns, landmarks, dungeons and monster castles.
//   kind        'town', 'landmark', 'dungeon' (see dungeons.js) or 'castle' (see castles.js)
//   recruitLevel (towns) once discovered, heroes can start here at this level
//   guardian    (dungeons) the monster guarding the treasure, from monsters.js
//   boss        (castles) the boss who holds the castle, from monsters.js (with boss: true)
//   rooms       (dungeons and castles, optional) [fewest, most] rooms before the guardian or boss
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

  {
    kind: 'dungeon', region: 'tailwoods', at: [32, 142], guardian: 'Grumpy Badger', rooms: [3, 4],
    name: 'Snoring Burrow', logName: 'the Snoring Burrow',
    sprite: { sheet: 'dungeon', tile: 55 }, // steps going down
    arriveLines: [
      'crawled into the Snoring Burrow. Something below snored.',
      'squeezed down into the Snoring Burrow, lantern first.',
    ],
    rumors: [
      'A burrow in the west snores louder than any badger.',
      'Treasure, they say, at the bottom of the Snoring Burrow.',
    ],
  },
  {
    kind: 'dungeon', region: 'tailwoods', at: [84, 184], guardian: 'Wandering Toadstool', rooms: [3, 4],
    name: 'Mushroom Cellar', logName: 'the Mushroom Cellar',
    sprite: { sheet: 'dungeon', tile: 54 }, // stone steps
    arriveLines: [
      'went down into the Mushroom Cellar. It smelled of soup.',
      'opened the Mushroom Cellar. The mushrooms turned to look.',
    ],
    rumors: [
      'The old Mushroom Cellar grows things that walk.',
      'A cellar near Tailsend is full of mushrooms, and worse.',
    ],
  },

  {
    kind: 'castle', region: 'tailwoods', at: [60, 173], boss: 'Old Grizzlewick',
    name: 'Stumptail Keep', logName: 'Stumptail Keep',
    sprite: { sheet: 'town', tile: 112 }, // a castle gate
    arriveLines: [
      'tiptoed through the gate of Stumptail Keep. Something snored.',
      'crept into Stumptail Keep, where even the guards were napping.',
    ],
    rumors: [
      'A great bear sleeps in Stumptail Keep. Nobody wakes it.',
      'Stumptail Keep has been snoring for a hundred years.',
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

  {
    kind: 'dungeon', region: 'hindhill', at: [70, 150], guardian: 'Pie Golem',
    name: 'Root Cellar', logName: 'the Root Cellar',
    sprite: { sheet: 'town', tile: 85 }, // a cellar door
    arriveLines: [
      'lifted the door of the Root Cellar. Something inside was chewing.',
      'went down into the Root Cellar, where the turnips whisper.',
    ],
    rumors: [
      'Something in the Root Cellar has eaten the whole harvest.',
      'The Root Cellar hums at night, like a hungry stomach.',
    ],
  },

  {
    kind: 'castle', region: 'hindhill', at: [48, 105], boss: 'Glutton Lord',
    name: 'Castle Hock', logName: 'Castle Hock',
    sprite: { sheet: 'town', tile: 112 }, // a castle gate
    arriveLines: [
      'marched up to Castle Hock. It smelled of gravy.',
      'slipped into Castle Hock across a moat of soup.',
    ],
    rumors: [
      'The Glutton Lord of Castle Hock eats a harvest a day.',
      'Carts of pies go into Castle Hock. None come out.',
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

  {
    kind: 'dungeon', region: 'flank', at: [92, 108], guardian: 'Mimic',
    name: 'Counting House', logName: 'the Counting House',
    sprite: { sheet: 'town', tile: 90 }, // a stone door
    arriveLines: [
      'let themselves into the Counting House. The coins were still counting.',
      'stepped into the Counting House, where the ledgers never close.',
    ],
    rumors: [
      'The old Counting House is still counting, all by itself.',
      'Nobody who went into the Counting House came out poor.',
    ],
  },
  {
    kind: 'dungeon', region: 'flank', at: [66, 104], guardian: 'Gilded Golem',
    name: 'Sunken Vault', logName: 'the Sunken Vault',
    sprite: { sheet: 'town', tile: 89 }, // a door in a stone wall
    arriveLines: [
      'found the door of the Sunken Vault, and went down.',
      'went down into the Sunken Vault. Gold glittered below.',
    ],
    rumors: [
      'A vault sank into the ground, gold and all.',
      'The Sunken Vault is guarded by something golden.',
    ],
  },

  {
    kind: 'castle', region: 'flank', at: [104, 95], boss: 'Baron Goldtooth',
    name: 'Goldrib Hall', logName: 'Goldrib Hall',
    sprite: { sheet: 'town', tile: 112 }, // a castle gate
    arriveLines: [
      'paid no toll at the gate of Goldrib Hall, and went in.',
      'strode into Goldrib Hall. Even the floors were gilded.',
    ],
    rumors: [
      'Baron Goldtooth taxes all who pass Goldrib Hall.',
      'Goldrib Hall glitters on its hill, and it bites.',
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

  {
    kind: 'dungeon', region: 'fens', at: [74, 40], guardian: 'Enormous Beetle',
    name: 'Hollow Log', logName: 'the Hollow Log',
    sprite: { sheet: 'dungeon', tile: 45 }, // a door
    arriveLines: [
      'crawled into the Hollow Log, which went on for miles.',
      'entered the Hollow Log. From inside, it was a great hall.',
    ],
    rumors: [
      'A hollow log in the fens is bigger inside than out.',
      'Something lives deep inside the Hollow Log. Something big.',
    ],
  },

  {
    kind: 'castle', region: 'fens', at: [101, 31], boss: 'Mossmother',
    name: 'Pinion Tower', logName: 'Pinion Tower',
    sprite: { sheet: 'town', tile: 112 }, // a castle gate
    arriveLines: [
      'pushed through the mossy door of Pinion Tower.',
      'began the long, damp climb up Pinion Tower.',
    ],
    rumors: [
      'Pinion Tower is choked in moss, and the moss is hungry.',
      'Something ancient grows at the top of Pinion Tower.',
    ],
  },

  // ---- The Spine Peaks: the dragon dreams of knights ----
  {
    kind: 'town', region: 'spine', at: [118, 74], recruitLevel: 16,
    name: 'Ridgehold', logName: 'Ridgehold',
    arriveLines: [
      'climbed into Ridgehold, perched on the ridge like a crown.',
      'reached Ridgehold, where the knights still polish their armor.',
    ],
    rumors: [
      "Ridgehold's knights still train for a dragon hunt.",
      'The bells of Ridgehold ring whenever the mountain shivers.',
    ],
  },
  {
    kind: 'landmark', region: 'spine', at: [84, 70],
    name: 'Vertebra Pass', logName: 'Vertebra Pass',
    sprite: { sheet: 'town', tile: 111 }, // a stone arch
    arriveLines: [
      'crossed Vertebra Pass, between ridges like great bones.',
      'reached Vertebra Pass, where the wind whistles a tune.',
    ],
    rumors: [
      'Vertebra Pass climbs between ridges shaped like bones.',
      'The wind through Vertebra Pass hums an old tune.',
    ],
  },
  {
    kind: 'landmark', region: 'spine', at: [138, 66],
    name: "Knight's Rest", logName: "Knight's Rest",
    sprite: { sheet: 'dungeon', tile: 41 }, // a stone knight
    arriveLines: [
      "reached Knight's Rest, where old knights lie in stone.",
      "bowed at Knight's Rest, among the stone knights.",
    ],
    rumors: [
      'Stone knights lie at rest, still facing their foe.',
      "Knight's Rest holds the tombs of the dragon-hunters.",
    ],
  },
  {
    kind: 'landmark', region: 'spine', at: [106, 78],
    name: "Hunters' Cairn", logName: "the Hunters' Cairn",
    sprite: { sheet: 'dungeon', tile: 24 }, // a pile of stones
    arriveLines: [
      "reached the Hunters' Cairn and added a stone.",
      "read the names on the Hunters' Cairn. None came home.",
    ],
    rumors: [
      'A cairn of stones for hunters who never returned.',
      "Every stone on the Hunters' Cairn is a hunter's name.",
    ],
  },
  {
    kind: 'landmark', region: 'spine', at: [146, 70],
    name: 'Old Watchtower', logName: 'the Old Watchtower',
    sprite: { sheet: 'town', tile: 103 }, // a tower door
    arriveLines: [
      'climbed the Old Watchtower. Every window faces the peaks.',
      'reached the Old Watchtower, kept now by one old owl.',
    ],
    rumors: [
      'An old watchtower keeps watch over something vast.',
      'The Old Watchtower was built to see something wake.',
    ],
  },

  {
    kind: 'dungeon', region: 'spine', at: [126, 82], guardian: 'Rusted Knight',
    name: 'Barrow of Knights', logName: 'the Barrow of Knights',
    sprite: { sheet: 'dungeon', tile: 47 }, // a heavy door
    arriveLines: [
      'pushed open the Barrow of Knights. Armor stirred inside.',
      'went down into the Barrow of Knights, very quietly.',
    ],
    rumors: [
      'The knights in the old barrow do not rest easy.',
      'A barrow full of knights, and one who still keeps watch.',
    ],
  },
  {
    kind: 'dungeon', region: 'spine', at: [100, 68], guardian: 'Grumbling Yeti',
    name: 'Frozen Tunnel', logName: 'the Frozen Tunnel',
    sprite: { sheet: 'dungeon', tile: 46 }, // a wide door
    arriveLines: [
      'went into the Frozen Tunnel. Their breath turned to frost.',
      'entered the Frozen Tunnel, which groaned like old ice.',
    ],
    rumors: [
      'A tunnel runs through the mountain, frozen solid.',
      'Something big and grumbling lives in the Frozen Tunnel.',
    ],
  },

  {
    kind: 'castle', region: 'spine', at: [139, 81], boss: 'Sir Grimsby the Unyielding',
    name: 'Crookback Castle', logName: 'Crookback Castle',
    sprite: { sheet: 'town', tile: 112 }, // a castle gate
    arriveLines: [
      'rode up to Crookback Castle. The drawbridge creaked down.',
      'answered the challenge at the gates of Crookback Castle.',
    ],
    rumors: [
      'Sir Grimsby holds Crookback Castle, and never yields.',
      'A knight at Crookback Castle has jousted for centuries.',
    ],
  },

  // ---- The Clawlands: the dragon dreams of an ancient war ----
  {
    kind: 'town', region: 'claws', at: [130, 142], recruitLevel: 20,
    name: 'Talonreach', logName: 'Talonreach',
    arriveLines: [
      'reached Talonreach, a town of old walls and older soldiers.',
      'marched into Talonreach, where everyone stands up straight.',
    ],
    rumors: [
      'Talonreach remembers a war nobody else does.',
      'Old soldiers in Talonreach swap stories of the long war.',
    ],
  },
  {
    kind: 'landmark', region: 'claws', at: [134, 118],
    name: 'Old Battlefield', logName: 'the Old Battlefield',
    sprite: { sheet: 'dungeon', tile: 102 }, // a fallen shield
    arriveLines: [
      'crossed the Old Battlefield, where the shields still lie.',
      'reached the Old Battlefield. The grass grows in ranks.',
    ],
    rumors: [
      'A battlefield where the war never quite finished.',
      'Shields still lie on the Old Battlefield, uncollected.',
    ],
  },
  {
    kind: 'landmark', region: 'claws', at: [150, 126],
    name: 'War Anvil', logName: 'the War Anvil',
    sprite: { sheet: 'dungeon', tile: 74 }, // an anvil
    arriveLines: [
      'struck the War Anvil once. It rang for an hour.',
      'reached the War Anvil, where every sword was forged.',
    ],
    rumors: [
      'An anvil that forged every sword of the long war.',
      'Strike the War Anvil, they say, and it remembers.',
    ],
  },
  {
    kind: 'landmark', region: 'claws', at: [166, 146],
    name: 'Rusted Gate', logName: 'the Rusted Gate',
    sprite: { sheet: 'town', tile: 125 }, // a stone gate
    arriveLines: [
      'passed through the Rusted Gate. There is no wall.',
      'reached the Rusted Gate, standing alone in a field.',
    ],
    rumors: [
      'A gate stands in an empty field, locked from both sides.',
      'Nobody knows what the Rusted Gate once kept out.',
    ],
  },
  {
    kind: 'landmark', region: 'claws', at: [130, 158],
    name: 'Great Furrows', logName: 'the Great Furrows',
    sprite: { sheet: 'farm', tile: 88 }, // a curved hook, like a claw
    arriveLines: [
      'walked the Great Furrows, each as deep as a riverbed.',
      'reached the Great Furrows. Something enormous dug them.',
    ],
    rumors: [
      'Great furrows cut across the land, like a scratch.',
      'The Great Furrows were dug by nobody, all at once.',
    ],
  },

  {
    kind: 'dungeon', region: 'claws', at: [118, 130], guardian: 'Buried Legionnaire',
    name: 'Old Armory', logName: 'the Old Armory',
    sprite: { sheet: 'town', tile: 86 }, // a wooden door
    arriveLines: [
      'broke into the Old Armory. The racks were not empty.',
      'stepped into the Old Armory. Rusty blades rattled.',
    ],
    rumors: [
      'The old army armory still has weapons, and guards.',
      'The Old Armory was sealed at the end of the war. Nearly.',
    ],
  },
  {
    kind: 'dungeon', region: 'claws', at: [154, 134], guardian: 'Siege Ogre',
    name: 'Siege Tunnels', logName: 'the Siege Tunnels',
    sprite: { sheet: 'dungeon', tile: 55 }, // steps going down
    arriveLines: [
      'went down into the Siege Tunnels, dug for a war long over.',
      'crept into the Siege Tunnels. Something heavy was digging.',
    ],
    rumors: [
      'Tunnels dug beneath the old war, still being dug.',
      'The Siege Tunnels run deep, and something still digs.',
    ],
  },

  {
    kind: 'castle', region: 'claws', at: [147, 161], boss: 'Bone Marshal',
    name: 'Knucklebone Fortress', logName: 'Knucklebone Fortress',
    sprite: { sheet: 'town', tile: 112 }, // a castle gate
    arriveLines: [
      'stormed the gate of Knucklebone Fortress.',
      'marched into Knucklebone Fortress. The dead stood to attention.',
    ],
    rumors: [
      'The Bone Marshal still musters an army at Knucklebone.',
      'Drums beat in Knucklebone Fortress, for a war long lost.',
    ],
  },

  // ---- Smokecrown: the dragon dreams of loneliness (opens in Act 3) ----
  {
    kind: 'town', region: 'smokecrown', at: [166, 42], recruitLevel: 24,
    name: 'Lastlight', logName: 'Lastlight',
    arriveLines: [
      'reached Lastlight, where the lamps never go out.',
      'came to Lastlight. Every window had a candle in it, just in case.',
      'walked into Lastlight, and the lamplighter waved.',
    ],
    rumors: [
      'Lastlight keeps a lamp lit for every lost traveler.',
      'Nobody who reaches Lastlight is ever quite alone again.',
    ],
  },
  {
    kind: 'landmark', region: 'smokecrown', at: [192, 54],
    name: 'The Smoking Nostril', logName: 'the Smoking Nostril',
    sprite: { sheet: 'creatures', tile: 55 }, // a flame
    arriveLines: [
      'stood at the rim of the Smoking Nostril. It breathed out.',
      'reached the Smoking Nostril, and felt a warm, slow breath.',
    ],
    rumors: [
      'The mountain at the edge of Smokecrown breathes in and out.',
      'Smoke rises from the Nostril, in, and out, and in again.',
    ],
  },
  {
    kind: 'landmark', region: 'smokecrown', at: [177, 38],
    name: 'Lidwater', logName: 'Lidwater',
    sprite: { sheet: 'dungeon', tile: 56 }, // a still, round pool
    arriveLines: [
      'looked into Lidwater. For a moment, something looked back.',
      'reached Lidwater, the lake that never ripples.',
    ],
    rumors: [
      'Lidwater never ripples, not even in a storm.',
      'The lake by Lastlight is shaped like a closed eye.',
    ],
  },
  {
    kind: 'landmark', region: 'smokecrown', at: [180, 56],
    name: 'Jawbone Ridge', logName: 'Jawbone Ridge',
    sprite: { sheet: 'dungeon', tile: 43 }, // an arch of stone teeth
    arriveLines: [
      'climbed Jawbone Ridge, a line of stones like enormous teeth.',
      'reached Jawbone Ridge. The wind whistled through the gaps.',
    ],
    rumors: [
      'Jawbone Ridge looks like teeth, if you squint.',
      'The wind on Jawbone Ridge sounds like someone humming.',
    ],
  },
  {
    kind: 'landmark', region: 'smokecrown', at: [186, 44],
    name: 'The Whisker Stones', logName: 'the Whisker Stones',
    sprite: { sheet: 'town', tile: 43 }, // a ring of grey stones
    arriveLines: [
      'reached the Whisker Stones, long and thin and pointing north.',
      'walked among the Whisker Stones. They twitched. Probably.',
    ],
    rumors: [
      'The Whisker Stones twitch when a storm is coming.',
      "Long grey stones stand in a row near Smokecrown's snout.",
    ],
  },
  {
    kind: 'dungeon', region: 'smokecrown', at: [152, 20], guardian: 'Forgotten Doll',
    name: 'The Forgotten Attic', logName: 'the Forgotten Attic',
    sprite: { sheet: 'dungeon', tile: 66 }, // an old wooden door
    arriveLines: [
      'climbed into the Forgotten Attic. Dust, and dolls, and silence.',
      'opened the Forgotten Attic. Everything in it was waiting.',
    ],
    rumors: [
      'An attic full of things nobody came back for.',
      'Toys wait in the Forgotten Attic for children long grown.',
    ],
  },
  {
    kind: 'castle', region: 'smokecrown', at: [172, 14], boss: 'Forgotten King',
    name: 'Hornhold', logName: 'Hornhold',
    sprite: { sheet: 'town', tile: 112 }, // a castle gate
    arriveLines: [
      'climbed the horn to Hornhold. The gate stood open, expecting someone.',
      'reached Hornhold, a castle on the very tip of the horn.',
    ],
    rumors: [
      'A king rules Hornhold alone. Nobody remembers his name.',
      'Hornhold stands on the horn of the world, and waits.',
    ],
  },
];
