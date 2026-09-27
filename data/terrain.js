// Terrain types for the map.
//
//   symbol   the character that draws this terrain in the map in regions.js
//   walkable false means heroes can never step here
//   cost     how slow it is to cross: 1 is normal, 2 is twice as slow, 0.5 is twice as fast
//   color, detail   placeholder colors until the Kenney tiles are added
//   pattern  placeholder decoration: speckle, flowers, tree, hills, waves, planks or house

export const terrain = {
  meadow:  { symbol: '.', walkable: true,  cost: 1,   color: '#7cb04f', detail: '#5f9440', pattern: 'speckle' },
  flowers: { symbol: ',', walkable: true,  cost: 1,   color: '#7cb04f', detail: '#f2d45c', pattern: 'flowers' },
  forest:  { symbol: 'T', walkable: true,  cost: 2,   color: '#3d6e30', detail: '#5c9c40', pattern: 'tree' },
  hills:   { symbol: '^', walkable: true,  cost: 2.5, color: '#a3ad62', detail: '#7d8a45', pattern: 'hills' },
  water:   { symbol: '~', walkable: false, cost: 1,   color: '#3f7fc1', detail: '#8fc3ea', pattern: 'waves' },
  road:    { symbol: '=', walkable: true,  cost: 0.6, color: '#c9a66b', detail: '#a8844e', pattern: 'speckle' },
  bridge:  { symbol: '#', walkable: true,  cost: 0.6, color: '#9a6a3c', detail: '#6a4424', pattern: 'planks' },
  houses:  { symbol: 'H', walkable: true,  cost: 1,   color: '#7cb04f', detail: '#b8483a', pattern: 'house' },
};
