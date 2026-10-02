// Graves: tombstones where heroes fell, and the heirlooms left beside them.
// Graves belong to the world, so they're saved with the fog and last across every hero.
import { graveSettings } from '../../data/graves.js';
import { slots, rarities } from '../../data/items.js';
import { isWalkable } from './map.js';
import { itemWorth } from './items.js';

const SPOT_RANGE = 2; // a grave can move this many tiles from where the hero fell, to find a free square

// Lays a fallen hero to rest where they fell, with their best item as an heirloom.
// Returns the new grave.
export function addGrave(world, hero) {
  const gear = Object.values(hero.gear).filter(Boolean);
  const heirloom = gear.reduce((best, item) => (!best || itemWorth(item) > itemWorth(best) ? item : best), null);
  const spot = freeSpot(world, hero.x, hero.y);
  const grave = {
    id: Math.max(0, ...world.graves.map((other) => other.id)) + 1,
    name: hero.name,
    epithet: hero.epithet,
    level: hero.level,
    x: spot.x,
    y: spot.y,
    heirloom: heirloom && structuredClone(heirloom),
    claimedBy: null, // the name of the hero who took the heirloom
    pet: hero.pet ?? null, // the hero's pet, waiting by the grave (see pets.js)
  };
  world.graves.push(grave);
  if (world.graves.length > graveSettings.keep) world.graves.splice(0, world.graves.length - graveSettings.keep);
  return grave;
}

// The closest grave within reach whose heirloom is still waiting (or, if `wantsPet`, where a pet
// is waiting), or null.
export function graveNear(world, x, y, { wantsPet = false } = {}) {
  let best = null;
  let bestDistance = Infinity;
  for (const grave of world.graves) {
    const waiting = (grave.heirloom && !grave.claimedBy) || (wantsPet && grave.pet);
    if (!waiting) continue;
    const distance = Math.hypot(grave.x - x, grave.y - y);
    if (distance <= graveSettings.respectRange && distance < bestDistance) {
      best = grave;
      bestDistance = distance;
    }
  }
  return best;
}

// Graves read from the save. Heirlooms that no longer make sense (a removed slot or rarity)
// are dropped, but the grave stays.
export function loadGraves(saved) {
  if (!Array.isArray(saved)) return [];
  return saved
    .filter((grave) => Number.isInteger(grave?.x) && Number.isInteger(grave?.y) && Number.isInteger(grave.id))
    .map((grave) => {
      const item = grave.heirloom;
      const valid = item && slots.some((slot) => slot.id === item.slot) && rarities.some((rarity) => rarity.id === item.rarity);
      return { ...grave, heirloom: valid ? item : null };
    });
}

// The nearest walkable square to where the hero fell that has no grave or place on it already,
// so tombstones don't pile up on top of one another. If there's none, the spot where they fell.
function freeSpot(world, x, y) {
  let best = { x, y };
  let bestDistance = Infinity;
  for (let ty = y - SPOT_RANGE; ty <= y + SPOT_RANGE; ty++) {
    for (let tx = x - SPOT_RANGE; tx <= x + SPOT_RANGE; tx++) {
      if (tx < 0 || ty < 0 || tx >= world.width || ty >= world.height) continue;
      if (!isWalkable(world, ty * world.width + tx)) continue;
      if (world.graves.some((grave) => grave.x === tx && grave.y === ty)) continue;
      if (world.places.some((place) => place.x === tx && place.y === ty)) continue;
      const distance = Math.hypot(tx - x, ty - y);
      if (distance < bestDistance) {
        best = { x: tx, y: ty };
        bestDistance = distance;
      }
    }
  }
  return best;
}
