// Rumors: which places are rumored, how dangerous and far away they sound, and how
// Auto-decide chooses between them.
import { rumorSettings, danger, directions, distances } from '../../data/rumors.js';
import { regions } from '../../data/regions.js';

// How far a region's levels are from the hero's level: 0 when the hero's level is within them.
// Heroes count as ready for a region a few levels below its lowest (see readyBelow in rumors.js).
export function levelGap(level, regionId) {
  const [lowest, high] = regions[regionId].levels;
  const low = lowest - rumorSettings.readyBelow;
  if (level < low) return low - level;
  if (level > high) return level - high;
  return 0;
}

// 1 to 3 danger skulls, from how far the region's lowest level is above the hero's.
export function skullsFor(level, regionId) {
  const above = regions[regionId].levels[0] - level;
  if (above >= danger.threeSkulls) return 3;
  if (above >= danger.twoSkulls) return 2;
  return 1;
}

// "north-east", from one tile to another.
export function directionTo(from, to) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const step = Math.round(angle / (Math.PI / 4));
  return directions[((step % 8) + 8) % 8];
}

// "A fair walk", from one tile to another as the crow flies.
export function distanceWord(from, to) {
  const tiles = Math.hypot(to.x - from.x, to.y - from.y);
  return distances.find(([limit]) => tiles <= limit)[1];
}

// The rumors heard at a town or camp: one about a place that suits the hero (near, and in a
// region that fits their level), and the rest at random, leaning towards undiscovered places
// and away from places the hero has just been. Returns [{ place, text }] in a shuffled order.
export function rumorOffers(rng, life) {
  const { hero, world } = life;
  const candidates = world.places.filter((place) => place !== life.at && place.rumors?.length && !regions[place.region].sealed);
  const weightOf = (place) => (world.discovered.has(place.name) ? 1 : rumorSettings.fogWeight)
    * (life.recent.includes(place.name) ? rumorSettings.recentWeight : 1);
  const pool = [...candidates];
  const picks = [];
  const take = (place) => {
    picks.push(place);
    pool.splice(pool.indexOf(place), 1);
  };
  const suited = [...candidates].sort((a, b) => unsuited(hero, a) - unsuited(hero, b)).slice(0, rumorSettings.suitedPicks);
  take(rng.pickWeighted(suited, weightOf));
  while (picks.length < rumorSettings.options && pool.length > 0) take(rng.pickWeighted(pool, weightOf));
  return picks
    .map((place) => ({ place, text: rng.pick(place.rumors), roll: rng.next() }))
    .sort((a, b) => a.roll - b.roll)
    .map(({ place, text }) => ({ place, text }));
}

// Auto-decide: the rumor that best suits the hero, weighing the region's levels against the walk.
export function autoRumor(life, options) {
  const { hero } = life;
  let best = 0;
  options.forEach((option, index) => {
    if (unsuited(hero, option.place) < unsuited(hero, options[best].place)) best = index;
  });
  return best;
}

// How badly a place suits the hero, in tiles: the walk there, plus the level gap counted as tiles.
function unsuited(hero, place) {
  return levelGap(hero.level, place.region) * rumorSettings.levelTiles + Math.hypot(place.x - hero.x, place.y - hero.y);
}
