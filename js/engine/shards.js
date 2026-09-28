// Dream shards: which shards are still waiting at a landmark, and which have been found.
// Found shards belong to the world, so they're saved with it: [{ id, hero }], oldest first.
import { shards } from '../../data/shards.js';
import { places } from '../../data/regions.js';

// Check the data once at startup, so a typo shows a clear message.
const ids = new Set();
for (const shard of shards) {
  const owner = `The dream shard "${shard.title ?? shard.id}" in data/shards.js`;
  if (!shard.id || ids.has(shard.id)) throw new Error(`${owner} needs an id that no other shard uses.`);
  ids.add(shard.id);
  if (!places.some((place) => place.name === shard.place && place.kind === 'landmark')) {
    throw new Error(`${owner} is found at "${shard.place}", which isn't a landmark in data/regions.js.`);
  }
  if (!shard.title || !shard.text) throw new Error(`${owner} needs a title and a text.`);
}

export function shardById(id) {
  return shards.find((shard) => shard.id === id) ?? null;
}

// A shard at this place that nobody has found yet, or null.
export function unfoundShard(world, placeName) {
  return shards.find((shard) => shard.place === placeName && !world.shards.some((found) => found.id === shard.id)) ?? null;
}

// Found shards read from the save. Shards since removed from the data are dropped.
export function loadShards(saved) {
  if (!Array.isArray(saved)) return [];
  return saved.filter((found) => shardById(found?.id));
}
