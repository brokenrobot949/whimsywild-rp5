// The world map: which terrain is where, where the places are, and how to walk between them.
import { terrain } from '../../data/terrain.js';
import { regions, places, placeholderMap } from '../../data/regions.js';

const MAP_FILE = 'data/regions.js';

// Reads the map drawing from the data files, and checks it for mistakes so that
// a typo shows a clear message instead of a broken game.
export function buildWorld() {
  const rows = placeholderMap;
  const height = rows.length;
  const width = rows[0].length;
  const terrainBySymbol = new Map(Object.entries(terrain).map(([id, type]) => [type.symbol, id]));
  const placeByMark = new Map(places.map((place) => [place.mark, place]));
  const tiles = new Array(width * height);
  const found = [];

  rows.forEach((row, y) => {
    if (row.length !== width) {
      throw new Error(`Map row ${y + 1} in ${MAP_FILE} is ${row.length} characters long, but row 1 is ${width}. Every row must be the same length.`);
    }
    [...row].forEach((symbol, x) => {
      const place = placeByMark.get(symbol);
      if (place) {
        if (!terrain[place.ground]) throw new Error(`${place.name} has ground "${place.ground}", which is not a terrain in data/terrain.js.`);
        tiles[y * width + x] = place.ground;
        found.push({ ...place, x, y });
        return;
      }
      const id = terrainBySymbol.get(symbol);
      if (!id) throw new Error(`Unknown map symbol "${symbol}" at row ${y + 1}, column ${x + 1} in ${MAP_FILE}.`);
      tiles[y * width + x] = id;
    });
  });

  for (const place of places) {
    const count = found.filter((spot) => spot.mark === place.mark).length;
    if (count !== 1) throw new Error(`${place.name} (mark "${place.mark}") appears ${count} times on the map in ${MAP_FILE}. It should appear once.`);
    if (!regions[place.region]) throw new Error(`${place.name} is in region "${place.region}", which is not in the regions list in ${MAP_FILE}.`);
    if (!terrain[place.ground].walkable) throw new Error(`${place.name} stands on ${place.ground}, which heroes can't walk on.`);
  }

  const walkableCosts = Object.values(terrain).filter((type) => type.walkable).map((type) => type.cost);
  const world = { width, height, tiles, places: found, cheapestCost: Math.min(...walkableCosts) };

  const town = found.find((place) => place.kind === 'town');
  if (!town) throw new Error(`The map in ${MAP_FILE} needs at least one town.`);
  for (const place of found) {
    if (place !== town && !findPath(world, town, place)) {
      throw new Error(`${place.name} can't be reached from ${town.name} on the map in ${MAP_FILE}. Check for water blocking the way.`);
    }
  }
  return world;
}

export function terrainAt(world, x, y) {
  return terrain[world.tiles[y * world.width + x]];
}

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// Finds the quickest walking route between two tiles (A* search).
// Returns the tiles to step on in order, not counting the start, or null if there is no way through.
export function findPath(world, from, to) {
  const { width, height } = world;
  const start = from.y * width + from.x;
  const goal = to.y * width + to.x;
  const cost = new Float64Array(width * height).fill(Infinity);
  const cameFrom = new Int32Array(width * height).fill(-1);
  const done = new Uint8Array(width * height);
  const open = new MinHeap();
  cost[start] = 0;
  open.push(start, 0);

  while (open.size > 0) {
    const current = open.pop();
    if (current === goal) break;
    if (done[current]) continue;
    done[current] = 1;
    const cx = current % width;
    const cy = (current - cx) / width;
    for (const [dx, dy] of DIRECTIONS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const next = ny * width + nx;
      const type = terrain[world.tiles[next]];
      if (!type.walkable) continue;
      const nextCost = cost[current] + type.cost;
      if (nextCost < cost[next]) {
        cost[next] = nextCost;
        cameFrom[next] = current;
        const guess = (Math.abs(nx - to.x) + Math.abs(ny - to.y)) * world.cheapestCost;
        open.push(next, nextCost + guess);
      }
    }
  }

  if (cost[goal] === Infinity) return null;
  const path = [];
  for (let i = goal; i !== start; i = cameFrom[i]) path.push({ x: i % width, y: Math.floor(i / width) });
  return path.reverse();
}

// A queue that always hands back the item with the lowest priority first.
class MinHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(value, priority) {
    const items = this.items;
    items.push({ value, priority });
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (items[parent].priority <= items[i].priority) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }

  pop() {
    const items = this.items;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      let i = 0;
      for (;;) {
        const left = 2 * i + 1;
        const right = left + 1;
        let smallest = i;
        if (left < items.length && items[left].priority < items[smallest].priority) smallest = left;
        if (right < items.length && items[right].priority < items[smallest].priority) smallest = right;
        if (smallest === i) break;
        [items[smallest], items[i]] = [items[i], items[smallest]];
        i = smallest;
      }
    }
    return top.value;
  }
}
