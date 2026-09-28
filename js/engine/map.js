// The world map: which terrain and region is where, where the places are, and how to walk
// between them. The map itself is generated in world-gen.js.
import { terrain } from '../../data/terrain.js';
import { regions } from '../../data/regions.js';
import { generateWorld } from './world-gen.js';
import { findRoute } from './path.js';

const REGIONS_FILE = 'data/regions.js';

// Builds the world, and checks the places make sense on it, so that a typo shows a clear
// message instead of a broken game.
export function buildWorld() {
  const world = generateWorld();
  const size = world.width * world.height;
  // Tiles in regions not yet open to heroes, covered in dream-mist.
  world.sealed = Uint8Array.from(world.regionOf, (region) => (region && regions[region].sealed ? 1 : 0));
  world.cheapestCost = Math.min(...Object.values(terrain).filter((type) => type.walkable).map((type) => type.cost));
  world.fog = new Uint8Array(size); // 1 where the fog has lifted
  world.discovered = new Set();     // names of places heroes have seen
  world.graves = [];                // where heroes fell (see graves.js)
  world.landTiles = world.regionOf.filter(Boolean).length;

  for (const place of world.places) {
    const region = world.regionOf[place.y * world.width + place.x];
    if (!region) throw new Error(`${place.name} is at [${place.x}, ${place.y}], which is in the sea. Move it onto land in ${REGIONS_FILE}.`);
    if (region !== place.region) {
      throw new Error(`${place.name} belongs to ${regions[place.region].name}, but [${place.x}, ${place.y}] is in ${regions[region].name}. Move it, or change its region, in ${REGIONS_FILE}.`);
    }
  }
  const home = world.places.find((place) => place.kind === 'town' && !regions[place.region].sealed);
  if (!home) throw new Error(`${REGIONS_FILE} needs at least one town in a region that isn't sealed.`);
  for (const place of world.places) {
    if (place === home || regions[place.region].sealed) continue;
    if (!findPath(world, home, place)) throw new Error(`${place.name} can't be reached from ${home.name} on foot. Check for sea or sealed regions in the way.`);
  }
  return world;
}

export function terrainAt(world, x, y) {
  return terrain[world.tiles[y * world.width + x]];
}

export function regionAt(world, x, y) {
  return world.regionOf[y * world.width + x];
}

// Heroes can walk on a tile if its terrain allows it and dream-mist doesn't cover it.
export function isWalkable(world, index) {
  return terrain[world.tiles[index]].walkable && !world.sealed[index];
}

// The quickest walking route between two tiles, or null if there's no way through.
export function findPath(world, from, to) {
  const costOf = (index) => (isWalkable(world, index) ? terrain[world.tiles[index]].cost : Infinity);
  return findRoute(world.width, world.height, costOf, world.cheapestCost, from, to);
}
