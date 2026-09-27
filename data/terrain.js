// Terrain types for the map, and the pictures that draw them.
// Picture numbers count from 0 at the top left of the sheet (see art.js);
// open assets/tiles/tiny-town.png to see them, 12 to a row.
//
//   symbol    the character that draws this terrain in the map in regions.js
//   walkable  false means heroes can never step here
//   cost      how slow it is to cross: 1 is normal, 2 is twice as slow, 0.5 is twice as fast
//   sheet     which art sheet the pictures come from (see art.js)
//   tiles     the picture for each square. With several, each square picks one
//             (list a number more than once to make it more common)
//   under     another terrain drawn first, to fill see-through parts (like the grass under trees)
//   edges     nine pictures that blend this terrain into its neighbors, in this order:
//             top-left, top, top-right, left, middle, right, bottom-left, bottom, bottom-right.
//             Strips only one square wide use `tiles` instead
//   joins     other terrains that count as this one when blending edges
//   above     pictures drawn in the square above, for tall things like house roofs.
//             Each one pairs with the picture in the same position in `tiles`
//   recolor   swaps colors in the pictures: { 'old color': 'new color' }

const dirtPath = [12, 13, 14, 24, 25, 26, 36, 37, 38];

export const terrain = {
  meadow: { symbol: '.', walkable: true, cost: 1, sheet: 'town', tiles: [0, 0, 0, 1] },

  flowers: { symbol: ',', walkable: true, cost: 1, sheet: 'town', tiles: [2] },

  forest: {
    symbol: 'T', walkable: true, cost: 2, sheet: 'town', under: 'meadow',
    edges: [6, 7, 8, 18, 19, 20, 30, 31, 32],
    tiles: [16, 4, 28],
  },

  // Tiny Town has no hills, so these are rocky ground with autumn trees.
  hills: { symbol: '^', walkable: true, cost: 2.5, sheet: 'town', under: 'meadow', tiles: [43, 43, 27, 3] },

  // Tiny Town has no water either, so this is its dirt path recolored blue.
  water: {
    symbol: '~', walkable: false, cost: 1, sheet: 'town',
    edges: dirtPath,
    tiles: [25],
    joins: ['bridge'],
    recolor: { '#eaa56c': '#5fa5dd', '#cf8254': '#4382c4', '#fec99c': '#b7e3f7' },
  },

  road: {
    symbol: '=', walkable: true, cost: 0.6, sheet: 'town',
    edges: dirtPath,
    tiles: [25, 25, 39],
    joins: ['bridge'],
  },

  // A stone ledge from Tiny Dungeon.
  bridge: { symbol: '#', walkable: true, cost: 0.6, sheet: 'dungeon', tiles: [37] },

  // A cottage wall, with its roof in the square above.
  houses: {
    symbol: 'H', walkable: false, cost: 1, sheet: 'town', under: 'meadow',
    tiles: [84, 88],
    above: [67, 63],
  },
};
