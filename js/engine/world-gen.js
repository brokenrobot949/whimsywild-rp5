// Builds the world map from the outline in data/world.js: coasts and region borders,
// each region's land, lakes, rivers, towns and roads. The same seed always makes the
// same map, so every player shares one world.
import { worldSettings, outline, lakes, rivers, roads } from '../../data/world.js';
import { regions, places } from '../../data/regions.js';
import { terrain } from '../../data/terrain.js';
import { findRoute } from './path.js';

const WORLD_FILE = 'data/world.js';
const REGIONS_FILE = 'data/regions.js';

// Where a town's cottages stand, relative to its square (their roofs show in the square above).
const TOWN_HOUSES = [[-2, -1], [0, -1], [2, -1], [-2, 2], [0, 2], [2, 2]];
const TOWN_STREET = 3;         // the street runs this many tiles either side of the square
const TOWN_CLEARING = 4.5;     // land cleared around a town, in tiles
const LANDMARK_CLEARING = 1.5; // land cleared around a landmark
const ROAD_COST = 0.35;        // roads prefer to follow roads already laid
const BRIDGE_COST = 6;         // how much roads avoid crossing water
const OTHER_REGION_COST = 4;   // how much roads avoid regions other than those of the places they join

export function generateWorld() {
  checkData();
  const { blockSize, coastWiggle, seed } = worldSettings;
  const width = outline[0].length * blockSize;
  const height = outline.length * blockSize;
  const size = width * height;
  const regionByLetter = new Map(Object.entries(regions).map(([id, region]) => [region.letter, id]));
  const regionOf = new Array(size).fill(null); // region id, or null for sea
  const tiles = new Array(size).fill('sea');   // terrain id
  const index = (x, y) => y * width + x;
  const inside = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

  // 1. Coasts and borders: read the outline, nudged by noise so the edges wander.
  const wiggleX = noise(seed + 1, 6);
  const wiggleY = noise(seed + 2, 6);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ox = x + (wiggleX(x, y) - 0.5) * 2 * coastWiggle;
      const oy = y + (wiggleY(x, y) - 0.5) * 2 * coastWiggle;
      const letter = outline[Math.floor(oy / blockSize)]?.[Math.floor(ox / blockSize)] ?? '~';
      regionOf[index(x, y)] = regionByLetter.get(letter) ?? null;
    }
  }

  // 2. The land: each region's terrain mix, laid out along a smooth noise so that forest sits
  //    with forest and fields with fields. Each terrain gets its share of the region's land.
  const lay = fractal(seed + 3, 7);
  const landByRegion = new Map();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const region = regionOf[index(x, y)];
      if (!region) continue;
      if (!landByRegion.has(region)) landByRegion.set(region, []);
      landByRegion.get(region).push({ i: index(x, y), value: lay(x, y) });
    }
  }
  for (const [region, land] of landByRegion) {
    land.sort((a, b) => a.value - b.value);
    const mix = regions[region].terrain;
    const total = mix.reduce((sum, [, share]) => sum + share, 0);
    let start = 0;
    mix.forEach(([id, share], n) => {
      const end = n === mix.length - 1 ? land.length : Math.round(start + (land.length * share) / total);
      for (let k = start; k < end; k++) tiles[land[k].i] = id;
      start = end;
    });
  }

  // 3. Lakes and rivers.
  const flood = (x, y) => {
    if (inside(x, y) && regionOf[index(x, y)]) tiles[index(x, y)] = 'water';
  };
  for (const lake of lakes) {
    const [cx, cy] = lake.at;
    const [rx, ry] = lake.size;
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) flood(x, y);
      }
    }
  }
  for (const river of rivers) {
    for (let n = 1; n < river.length; n++) {
      const [ax, ay] = river[n - 1];
      const [bx, by] = river[n];
      const steps = Math.ceil(Math.hypot(bx - ax, by - ay) * 2);
      for (let s = 0; s <= steps; s++) {
        const x = Math.round(ax + ((bx - ax) * s) / steps);
        const y = Math.round(ay + ((by - ay) * s) / steps);
        flood(x, y);
        flood(x + 1, y);
        flood(x, y + 1);
        flood(x + 1, y + 1);
      }
    }
  }

  // 4. Towns and landmarks: clear the land around them, then lay out each town.
  const placed = places.map((place) => ({ ...place, x: place.at[0], y: place.at[1] }));
  for (const place of placed) {
    const ground = regions[place.region].ground;
    const radius = place.kind === 'town' ? TOWN_CLEARING : LANDMARK_CLEARING;
    for (let y = Math.floor(place.y - radius); y <= Math.ceil(place.y + radius); y++) {
      for (let x = Math.floor(place.x - radius); x <= Math.ceil(place.x + radius); x++) {
        if (inside(x, y) && regionOf[index(x, y)] && Math.hypot(x - place.x, y - place.y) <= radius) tiles[index(x, y)] = ground;
      }
    }
    if (place.kind === 'town') {
      for (let dx = -TOWN_STREET; dx <= TOWN_STREET; dx++) if (inside(place.x + dx, place.y)) tiles[index(place.x + dx, place.y)] = 'road';
      for (const [dx, dy] of TOWN_HOUSES) if (inside(place.x + dx, place.y + dy)) tiles[index(place.x + dx, place.y + dy)] = 'houses';
    } else {
      tiles[index(place.x, place.y)] = place.ground ?? ground;
    }
  }

  // 5. Roads: each finds the easiest way between its two places, following earlier roads,
  //    bridging water where it must, and keeping to the regions of its two places where it can
  //    (so a road between open regions doesn't wander through one still sealed).
  const byName = new Map(placed.map((place) => [place.name, place]));
  const baseCost = (i) => {
    const id = tiles[i];
    if (id === 'road' || id === 'bridge') return ROAD_COST;
    if (id === 'water') return BRIDGE_COST;
    return terrain[id].walkable ? terrain[id].cost : Infinity;
  };
  for (const [fromName, toName] of roads) {
    const from = byName.get(fromName);
    const to = byName.get(toName);
    const roadCost = (i) => baseCost(i) * (regionOf[i] === from.region || regionOf[i] === to.region ? 1 : OTHER_REGION_COST);
    const route = findRoute(width, height, roadCost, ROAD_COST, from, to);
    if (!route) throw new Error(`The road from ${fromName} to ${toName} in ${WORLD_FILE} can't find a way through. Check for sea in between.`);
    for (const { x, y } of route) {
      const i = index(x, y);
      if (tiles[i] === 'water') tiles[i] = 'bridge';
      else if (tiles[i] !== 'bridge') tiles[i] = 'road';
    }
  }
  // Landmarks keep their own ground, even where a road ends on them.
  for (const place of placed) if (place.kind !== 'town') tiles[index(place.x, place.y)] = place.ground ?? regions[place.region].ground;

  return { width, height, tiles, regionOf, places: placed };
}

// ---- Checking the data ----
// Runs before building, so a typo in a data file shows a clear message.

function checkData() {
  const width = outline[0].length;
  const letters = new Set(['~', ...Object.values(regions).map((region) => region.letter)]);
  outline.forEach((row, y) => {
    if (row.length !== width) throw new Error(`Row ${y + 1} of the outline in ${WORLD_FILE} is ${row.length} characters long, but row 1 is ${width}. Every row must be the same length.`);
    [...row].forEach((letter, x) => {
      if (!letters.has(letter)) throw new Error(`The outline in ${WORLD_FILE} has "${letter}" at row ${y + 1}, column ${x + 1}, which isn't a region letter.`);
    });
  });
  for (const [id, region] of Object.entries(regions)) {
    const owner = `The region "${id}" in ${REGIONS_FILE}`;
    if (!terrain[region.ground]?.walkable) throw new Error(`${owner} has the ground "${region.ground}", which must be a walkable terrain from data/terrain.js.`);
    for (const [kind] of region.terrain) if (!terrain[kind]) throw new Error(`${owner} uses the terrain "${kind}", which isn't in data/terrain.js.`);
  }
  const mapWidth = width * worldSettings.blockSize;
  const mapHeight = outline.length * worldSettings.blockSize;
  const names = new Set();
  for (const place of places) {
    const owner = `${place.name} in ${REGIONS_FILE}`;
    if (names.has(place.name)) throw new Error(`There are two places called ${place.name} in ${REGIONS_FILE}. Each needs its own name.`);
    names.add(place.name);
    if (!regions[place.region]) throw new Error(`${owner} is in the region "${place.region}", which isn't in the regions list.`);
    const [x, y] = place.at ?? [];
    if (!(x >= 0 && y >= 0 && x < mapWidth && y < mapHeight)) throw new Error(`${owner} needs an "at" position inside the map, from [0, 0] to [${mapWidth - 1}, ${mapHeight - 1}].`);
    if (place.ground && !terrain[place.ground]?.walkable) throw new Error(`${owner} stands on "${place.ground}", which heroes can't walk on.`);
  }
  for (const [from, to] of roads) {
    for (const name of [from, to]) if (!names.has(name)) throw new Error(`A road in ${WORLD_FILE} goes to "${name}", which isn't a place in ${REGIONS_FILE}.`);
  }
}

// ---- Noise ----
// Smooth random values between 0 and 1 that change gently across the map.
// `scale` is roughly how many tiles it takes to change.

function noise(seed, scale) {
  const lattice = (x, y) => {
    let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const smooth = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const fx = x / scale;
    const fy = y / scale;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = smooth(fx - x0);
    const ty = smooth(fy - y0);
    const a = lattice(x0, y0);
    const b = lattice(x0 + 1, y0);
    const c = lattice(x0, y0 + 1);
    const d = lattice(x0 + 1, y0 + 1);
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };
}

// Two layers of noise, for shapes with both broad patches and smaller detail.
function fractal(seed, scale) {
  const broad = noise(seed, scale);
  const fine = noise(seed + 17, scale / 2.5);
  return (x, y) => broad(x, y) * 0.7 + fine(x, y) * 0.3;
}
