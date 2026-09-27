// The art sheets the game uses. Each sheet is a grid of 16 × 16 pictures, numbered
// from 0 at the top left, counting left to right, then row by row.
//
// All three are CC0, so they're free to use. Crediting is optional but courteous:
//   Tiny Town and Tiny Dungeon by Kenney (kenney.nl)
//   Tiny Creatures by Clint Bellanger, made to match Tiny Dungeon
export const sheets = {
  town: './assets/tiles/tiny-town.png',             // 12 pictures per row: ground, trees, houses, props
  dungeon: './assets/sprites/tiny-dungeon.png',     // 12 per row: heroes, items, dungeon pieces, a few monsters
  creatures: './assets/sprites/tiny-creatures.png', // 10 per row: monsters and animals
};

// The hero's picture. Later, each class will have its own.
export const heroSprite = { sheet: 'dungeon', tile: 85 };
