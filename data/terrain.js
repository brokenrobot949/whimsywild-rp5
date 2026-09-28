// Terrain types for the map, and the pictures that draw them.
// Picture numbers count from 0 at the top left of the sheet (see art.js), 12 to a row.
//
//   walkable     false means heroes can never step here
//   cost         how slow it is to cross: 1 is normal, 2 is twice as slow, 0.5 is twice as fast
//   sheet        which art sheet the pictures come from (see art.js)
//   tiles        the picture for each square. With several, each square picks one
//                (list a number more than once to make it more common)
//   under        another terrain drawn first, to fill see-through parts (like the grass under trees)
//   edges        nine pictures that blend this terrain into its neighbors, in this order:
//                top-left, top, top-right, left, middle, right, bottom-left, bottom, bottom-right.
//                Strips only one square wide use `tiles` instead
//   joins        other terrains that count as this one when blending edges
//   above        pictures drawn in the square above, for tall things like house roofs.
//                Each one pairs with the picture in the same position in `tiles`
//   decor        small pictures sometimes drawn on top, like crops in a field
//   decorChance  how often a square gets one (0.5 is half the squares)
//   recolor      swaps colors in the pictures: { 'old color': 'new color' }

const dirtPath = [12, 13, 14, 24, 25, 26, 36, 37, 38];

// Tiny Town's grass colors, and some recolorings of them.
const grass = { main: '#84c669', dark: '#65a556', light: '#8bd87d' };
const regrass = (main, dark, light) => ({ [grass.main]: main, [grass.dark]: dark, [grass.light]: light });
const golden = regrass('#c8bf5e', '#a79a42', '#ddd57e');
const boggy = regrass('#6f9a5a', '#557a45', '#7fab69');
const highland = regrass('#9aa888', '#7d8a6c', '#aebb9c');
const ashen = regrass('#8e8984', '#716c69', '#a39e98');

// Tiny Town's dirt path colors, recolored for water, sea, badlands and lava.
const redirt = (main, dark, light) => ({ '#eaa56c': main, '#cf8254': dark, '#fec99c': light });

export const terrain = {
  meadow: { walkable: true, cost: 1, sheet: 'town', tiles: [0, 0, 0, 1] },

  flowers: { walkable: true, cost: 1, sheet: 'town', tiles: [2] },

  forest: {
    walkable: true, cost: 2, sheet: 'town', under: 'meadow',
    edges: [6, 7, 8, 18, 19, 20, 30, 31, 32],
    tiles: [16, 4, 28],
  },

  // Tiny Town has no hills, so these are rocky ground with autumn trees.
  hills: { walkable: true, cost: 2.5, sheet: 'town', under: 'meadow', tiles: [43, 43, 27, 3] },

  // Tiny Town has no water either, so this is its dirt path recolored blue.
  water: {
    walkable: false, cost: 1, sheet: 'town',
    edges: dirtPath, tiles: [25], joins: ['bridge', 'sea'],
    recolor: redirt('#5fa5dd', '#4382c4', '#b7e3f7'),
  },

  sea: {
    walkable: false, cost: 1, sheet: 'town',
    edges: dirtPath, tiles: [25], joins: ['water', 'bridge'],
    recolor: redirt('#3f78bf', '#2f62a3', '#8cbbe6'),
  },

  road: {
    walkable: true, cost: 0.4, sheet: 'town',
    edges: dirtPath, tiles: [25, 25, 39], joins: ['bridge'],
  },

  // A stone ledge from Tiny Dungeon.
  bridge: { walkable: true, cost: 0.4, sheet: 'dungeon', tiles: [37] },

  // A cottage wall, with its roof in the square above.
  houses: {
    walkable: false, cost: 1, sheet: 'town', under: 'meadow',
    tiles: [84, 88], above: [67, 63],
  },

  // ---- Hindhill Farms ----
  // Rows of tilled soil from Tiny Farm, with crops growing in most of them.
  fields: {
    walkable: true, cost: 1.2, sheet: 'farm', tiles: [49, 50, 61, 62],
    decor: [5, 6, 17, 18, 29, 30, 41, 42, 53, 54, 65, 66], decorChance: 0.75,
  },

  // ---- The Glittering Flank ----
  goldGrass: { walkable: true, cost: 1, sheet: 'town', tiles: [0, 0, 0, 1], recolor: golden },
  goldWood: {
    walkable: true, cost: 2, sheet: 'town', under: 'goldGrass',
    edges: [9, 10, 11, 21, 22, 23, 33, 34, 35],
    tiles: [15, 3, 27],
  },
  rocks: { walkable: true, cost: 2.5, sheet: 'town', tiles: [43, 43, 0], recolor: highland },

  // ---- The sealed regions ----
  bog: { walkable: true, cost: 1.5, sheet: 'town', tiles: [0, 0, 1], recolor: boggy, decor: [17, 29], decorChance: 0.12 },
  highland: { walkable: true, cost: 1.2, sheet: 'town', tiles: [0, 0, 1], recolor: highland },
  badlands: { walkable: true, cost: 1.3, sheet: 'town', tiles: [25, 25, 39], recolor: redirt('#b9724f', '#96573c', '#d4926c') },
  ash: { walkable: true, cost: 1, sheet: 'town', tiles: [0, 0, 1], recolor: ashen },
  lava: {
    walkable: false, cost: 1, sheet: 'town',
    edges: dirtPath, tiles: [25],
    recolor: { ...redirt('#e8622c', '#c2401e', '#ffc05a'), ...ashen },
  },
};
