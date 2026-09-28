// The world of Whimsywild: a colossal dragon, asleep. This outline is its shape.
// The generator fills it in with forests, fields, hills and so on (see each region's
// terrain in regions.js), so every player gets the same map.
//
// Tip: add ?debug to the address and tick "Show whole map" to see the result, and
// hover over the map to read tile positions for placing things.

export const worldSettings = {
  seed: 20260927,   // changes the generated details (not the outline); the same for every player
  blockSize: 4,     // each character of the outline covers this many tiles each way (50 × 4 = 200 tiles)
  coastWiggle: 3,   // how far, in tiles, coasts and borders wander from the outline's straight edges
  fogRadius: 4,     // how many tiles around a hero the fog clears
};

// The dragon, seen from above, lying curled with its head to the north-east.
// Every row must be the same length. Key:
//   ~  sea
//   t  the Tailwoods (tail)          h  Hindhill Farms (hind legs)
//   g  the Glittering Flank (side)   w  the Wingshade Fens (folded wing)
//   s  the Spine Peaks (spine)       c  the Clawlands (forelegs)
//   k  Smokecrown (head)
export const outline = [
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~k~~~~~~',
  '~~~~~~~~~~~~ww~~~~~~~~~~~~~~~~~~~~~~~kk~~~~kk~~~~~',
  '~~~~~~~~~~~www~~~~~~~~~~~~~~~~~~~~~~~kk~~~kkk~~~~~',
  '~~~~~~~~~~wwww~~~~~~~~~~~~~~~~~~~~~~~~kk~~kk~~~~~~',
  '~~~~~~~~~wwww~~~~~~~~~~~~~~~~~~~~~~~~~kkkkkkk~~~~~',
  '~~~~~~~~~wwwww~~~~~~~wwwwwww~~~~~~~~kkkkkkkkkk~~~~',
  '~~~~~~~~~~wwwww~~wwwwwwwwwwwwww~~~~~kkkkkkkkkkk~~~',
  '~~~~~~~~~~wwwwwwwwwwwwwwwwwwwwww~~~kkkkkkkkkkkk~~~',
  '~~~~~~~~~~~wwwwwwwwwwwwwwwwwwwwww~~kkkkkkkkkkkkk~~',
  '~~~~~~~~~~~~wwwwwwwwwwwwwwwwwwwww~~~kkkkkkkkkkkkk~',
  '~~~~~~~~~~~~wwwwwwwwwwwwwwwwwwwww~~skkkkkkkkkkkkkk',
  '~~~~~~~~~~~~wwwwwwwwwwwwwwwwwwww~~~sskkkkkkkkkkkkk',
  '~~~~~~~~~~~~wwwwwwwwwwwwwwwwwww~~~sssskkkkkkkkkkkk',
  '~~~~~~~~~~~~~wwwwwwwwwwssssssw~~~ssssssss~~~~~kk~~',
  '~~~~~~~~~~~~~wwwwwwwssssssssssssssssssss~~~~~~~~~~',
  '~~~~~~~~~~~wwwwwwwwsssssssssssssssssssss~~~~~~~~~~',
  '~~~~~~~~~~wwwwwwwssssssssssssssssssssss~~~~~~~~~~~',
  '~~~~~~~~~wwwwwwsssssssssssssssssssssss~~~~~~~~~~~~',
  '~~~~~~~~~wwwwwwsssssssssssssssssssss~~~~~~~~~~~~~~',
  '~~~~~~~~~wwwwwwssgggggggggggggsssssg~~~~~~~~~~~~~~',
  '~~~~~~~~ttggggggggggggggggggggggggggg~~~~~~~~~~~~~',
  '~~~~~~~ttttttgggggggggggggggggggggggg~~~~~~~~~~~~~',
  '~~~~~~~tttthhgggggggggggggggggggggggg~~~~~~~~~~~~~',
  '~~~~~~tttthhhgggggggggggggggggggggggg~~~~~~~~~~~~~',
  '~~~~~ttttthhhgggggggggggggggggggggcccc~~~~~~~~~~~~',
  '~~~~ttttthhhhggggggggggggggggcccgcccccc~~~~~~~~~~~',
  '~~~~ttttthhhhgggggggggggggggccccccccccc~~~~~~~~~~~',
  '~~~~ttttthhhhhggggggggggggggcccccccccccc~~~~~~~~~~',
  '~~~tttttthhhhhhhggggggggggggcccccccccccc~~~~~~~~~~',
  '~~~ttttttthhhhhhhgggggggggggcccccccccccc~~~~~~~~~~',
  '~~~tttttttthhhhhhhhhhgggggg~cccccc~cccccc~~~~~~~~~',
  '~~~tttttttt~hhhhhhhh~~~~~~~~cccccc~~ccccc~~~~~~~~~',
  '~~tttttttt~~~hhhhhh~~~~~~~~~~ccccc~~cccccc~~~~~~~~',
  '~~tttttttt~~~hhhhhh~~~~~~~~~~cccccc~~ccccccc~~~~~~',
  '~~~ttttttt~~~hhhhhhh~~~~~~~~~cccccc~~~ccccccc~~~~~',
  '~~~ttttttt~~~~hhhhhh~~~~~~~~~~ccccc~~~cccccccc~~~~',
  '~~~tttttttt~~~hhhhhhh~~~~~~~~~cccccc~~~cccccc~~~~~',
  '~~~~tttttttt~~hhhhhhhhhh~~~~~~cccccccc~~~ccc~~~~~~',
  '~~~~ttttttttt~~hhhhhhhhhh~~~~~cccccccc~~~~~~~~~~~~',
  '~~~~~ttttttttt~~hhhhhhhhh~~~~~~ccccccc~~~~~~~~~~~~',
  '~~~~~ttttttttttt~hhhhhhhh~~~~~~~~ccc~~~~~~~~~~~~~~',
  '~~~~~~tttttttttttthhhhh~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~tttttttttttttttttttttttt~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~tttttttttttttttttttttt~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~tttttttttttttttttttt~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~~~tttttttttttttttt~~~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~~~~~~~~~ttttt~~~~~~~~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
];

// Lakes, carved into the land. `at` is the centre tile [across, down]; `size` is how far
// the lake reaches each way, in tiles.
export const lakes = [
  { name: 'The Closed Eye', at: [170, 38], size: [5, 1.4] },
  { name: 'The Drowsy Pond', at: [64, 187], size: [3.5, 2.2] },
];

// Rivers, drawn through these tiles in order, two tiles wide.
export const rivers = [
  [[66, 163], [58, 170], [53, 178], [52, 186], [51, 196]], // across the tail, by the Old Mill
];

// Roads, each joining two places by name (see regions.js). They find their own way,
// following earlier roads where they can and crossing water by bridge.
export const roads = [
  ['Tailsend', "Tail's Tip"],
  ['Tailsend', 'Drowsy Pond'],
  ['Drowsy Pond', 'Old Mill'],
  ['Old Mill', 'Hollow Oak'],
  ['Hollow Oak', 'Badger Hollow'],
  ['Badger Hollow', 'Mossy Stones'],
  ['Mossy Stones', 'Haunchford'],
  ['Haunchford', 'Great Haystack'],
  ['Haunchford', 'Kneecap Barn'],
  ['Kneecap Barn', 'Heelstone Orchard'],
  ['Heelstone Orchard', 'Giant Sunflower'],
  ['Haunchford', 'Scaleport'],
  ['Scaleport', 'Belly Mine'],
  ['Belly Mine', 'Ribcage Ridge'],
  ['Scaleport', 'Gilded Scale'],
  ['Gilded Scale', "Dragon's Purse"],
  ['Ribcage Ridge', 'Featherwell'],
  ['Featherwell', 'Rain Barrel'],
  ['Rain Barrel', 'Fenmoot'],
  ['Rain Barrel', 'Fairy Ring'],
  ['Fenmoot', "Giant's Arrow"],
  ['Scaleport', 'Talonreach'],
  ['Talonreach', 'Great Furrows'],
  ['Talonreach', 'Old Battlefield'],
  ['Old Battlefield', 'War Anvil'],
  ['War Anvil', 'Rusted Gate'],
  ['Scaleport', 'Ridgehold'],
  ['Ridgehold', 'Fenmoot'],
  ['Ridgehold', "Hunters' Cairn"],
  ['Ridgehold', 'Vertebra Pass'],
  ['Ridgehold', "Knight's Rest"],
  ["Knight's Rest", 'Old Watchtower'],
  ['Ridgehold', 'Lastlight'],
  ['Lastlight', 'Lidwater'],
  ['Lidwater', 'The Whisker Stones'],
  ['The Whisker Stones', 'The Smoking Nostril'],
  ['Lastlight', 'Jawbone Ridge'],
];
