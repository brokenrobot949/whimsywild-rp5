// The world map: which terrain and region is where, where the places are, and how to walk
// between them. The map itself is generated in world-gen.js.
import { terrain } from '../../data/terrain.js';
import { regions } from '../../data/regions.js';
import { travel } from '../../data/life.js';
import { generateWorld } from './world-gen.js';
import { findRoute } from './path.js';
import { isSealed } from './story.js';

const REGIONS_FILE = 'data/regions.js';

// Builds the world, and checks the places make sense on it, so that a typo shows a clear
// message instead of a broken game.
export function buildWorld() {
  const world = generateWorld();
  const size = world.width * world.height;
  // Only regions sealed for good are left out here, so the checks below include every region
  // the story will open. refreshSeals then covers the ones still waiting for their act.
  world.sealed = Uint8Array.from(world.regionOf, (region) => (region && regions[region].sealed ? 1 : 0));
  world.sealVersion = 0;
  world.cheapestCost = Math.min(...Object.values(terrain).filter((type) => type.walkable).map((type) => type.cost));
  world.fog = new Uint8Array(size); // 1 where the fog has lifted
  world.discovered = new Set();     // names of places heroes have seen
  world.graves = [];                // where heroes fell (see graves.js)
  world.mentors = [];               // retired heroes, and the towns they settled in (see mentors.js)
  world.shards = [];                // dream shards found so far: { id, hero } (see shards.js)
  world.conquered = [];             // monster castles conquered so far: { place, hero, age } (see castles.js)
  world.verses = [];                // verses of the lullaby found so far: { id, hero, age } (see story.js)
  world.actSeen = 1;                // the latest act whose interlude the player has seen
  world.finale = null;              // once the song is sung: { hero, epithet, age } (see finale.js)
  world.landTiles = world.regionOf.filter(Boolean).length;

  for (const place of world.places) {
    const region = world.regionOf[place.y * world.width + place.x];
    if (!region) throw new Error(`${place.name} is at [${place.x}, ${place.y}], which is in the sea. Move it onto land in ${REGIONS_FILE}.`);
    if (region !== place.region) {
      throw new Error(`${place.name} belongs to ${regions[place.region].name}, but [${place.x}, ${place.y}] is in ${regions[region].name}. Move it, or change its region, in ${REGIONS_FILE}.`);
    }
  }
  const home = world.places.find((place) => place.kind === 'town' && !isSealed(world, place.region));
  if (!home) throw new Error(`${REGIONS_FILE} needs at least one town in a region that's open from the start.`);
  for (const place of world.places) {
    if (place === home || regions[place.region].sealed) continue;
    if (!findPath(world, home, place)) throw new Error(`${place.name} can't be reached from ${home.name} on foot. Check for sea or sealed regions in the way.`);
  }
  refreshSeals(world);
  return world;
}

// Covers each region still waiting for its act in dream-mist, and lifts it from the rest.
// Call it again whenever the story moves on.
export function refreshSeals(world) {
  const before = world.sealed;
  world.sealed = Uint8Array.from(world.regionOf, (region) => (region && isSealed(world, region) ? 1 : 0));
  if (before.some((value, i) => value !== world.sealed[i])) world.sealVersion += 1;
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
// A hero's `level` makes them steer around regions far too dangerous for them (see travel in
// life.js), unless there's no other way, or that's where they're going.
export function findPath(world, from, to, level = null) {
  const target = world.regionOf[to.y * world.width + to.x];
  const tooDangerous = new Set(Object.keys(regions).filter((id) => level !== null && id !== target
    && regions[id].levels[0] > level + travel.avoidRegionsAbove));
  const costOf = (index) => {
    if (!isWalkable(world, index)) return Infinity;
    const cost = terrain[world.tiles[index]].cost;
    return tooDangerous.has(world.regionOf[index]) ? cost * travel.dangerCost : cost;
  };
  return findRoute(world.width, world.height, costOf, world.cheapestCost, from, to);
}
