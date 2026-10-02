// Rumors: which places are rumored, how dangerous and far away they sound, and how
// Auto-decide chooses between them.
import { rumorSettings, danger, directions, distances } from '../../data/rumors.js';
import { regions } from '../../data/regions.js';
import { dungeonSettings } from '../../data/dungeons.js';
import { castleSettings } from '../../data/castles.js';
import { isConquered } from './castles.js';
import { lostVerseAt, isSealed, currentAct } from './story.js';
import { sweetDreams } from '../../data/story.js';
import { verseSettings } from '../../data/verses.js';
import { isFinaleEntrance } from './finale.js';
import { finaleSettings, finaleText } from '../../data/finale.js';
import { nemesisAt, nemesisTitle, firstVictim } from './nemeses.js';
import { nemesisSettings, nemesisText } from '../../data/nemeses.js';
import { fill } from './text.js';

// How far a region's levels are from the hero's level: 0 when the hero's level is within them.
// Heroes count as ready for a region a few levels below its lowest (see readyBelow in rumors.js).
// `harder` shifts the region's levels up, for dungeons and castles (see placeHarder).
export function levelGap(level, regionId, harder = 0) {
  const [lowest, highest] = regions[regionId].levels;
  const low = lowest + harder - rumorSettings.readyBelow;
  const high = highest + harder;
  if (level < low) return low - level;
  if (level > high) return level - high;
  return 0;
}

// How many levels tougher than its region a place counts as: dungeons and castles are tougher,
// and so is the way into the finale's Nightmare while it's open (which needs the `world`).
export function placeHarder(place, world = null) {
  if (world && isFinaleEntrance(world, place)) return finaleSettings.harderBy;
  // A nemesis's lair is as dangerous as the nemesis.
  const nemesis = world && nemesisAt(world, place.name);
  if (nemesis) return Math.max(0, nemesis.level - regions[place.region].levels[0]);
  if (place.kind === 'dungeon') return dungeonSettings.harderBy;
  if (place.kind === 'castle') return castleSettings.harderBy;
  return 0;
}

// 1 to 3 danger skulls, from how far the region's lowest level is above the hero's.
export function skullsFor(level, regionId, harder = 0) {
  const above = regions[regionId].levels[0] + harder - level;
  if (above >= danger.threeSkulls) return 3;
  if (above >= danger.twoSkulls) return 2;
  return 1;
}

// The danger skulls on a rumor card for a place. Castles look more dangerous still.
export function placeSkulls(level, place, world = null) {
  const skulls = skullsFor(level, place.region, placeHarder(place, world));
  return place.kind === 'castle' ? Math.min(3, skulls + castleSettings.extraSkull) : skulls;
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
// and away from places the hero has just been. Conquered castles aren't rumored any more, and
// places hiding a lost verse of the lullaby come up more often, with a rumor of their own. In
// Act 4, some places have new rumors too.
// Returns [{ place, text }] in a shuffled order.
export function rumorOffers(rng, life) {
  const { hero, world } = life;
  const candidates = world.places.filter((place) => place !== life.at && place.rumors?.length && !isSealed(world, place.region)
    && !(place.kind === 'castle' && isConquered(world, place.name)));
  const weightOf = (place) => (world.discovered.has(place.name) ? 1 : rumorSettings.fogWeight)
    * (life.recent.includes(place.name) ? rumorSettings.recentWeight : 1)
    * (lostVerseAt(world, place.name) ? verseSettings.rumorWeight : 1)
    * (isFinaleEntrance(world, place) ? finaleSettings.rumorWeight : 1)
    * (nemesisAt(world, place.name) ? nemesisSettings.rumorWeight : 1);
  const rumorsOf = (place) => {
    if (isFinaleEntrance(world, place)) return finaleText.rumors;
    const nemesis = nemesisAt(world, place.name);
    if (nemesis) return nemesisText.rumors.map((line) => fill(line, { nemesis: nemesisTitle(nemesis), victim: firstVictim(nemesis), place: place.logName }));
    const sweet = currentAct(world) >= 4 ? sweetDreams.rumors[place.name] ?? [] : []; // Act 4's new rumors
    const verse = lostVerseAt(world, place.name);
    return [...place.rumors, ...sweet, ...(verse ? [verse.rumor] : [])];
  };
  const pool = [...candidates];
  const picks = [];
  const take = (place) => {
    picks.push(place);
    pool.splice(pool.indexOf(place), 1);
  };
  const suited = [...candidates].sort((a, b) => unsuited(life, a) - unsuited(life, b)).slice(0, rumorSettings.suitedPicks);
  take(rng.pickWeighted(suited, weightOf));
  while (picks.length < rumorSettings.options && pool.length > 0) take(rng.pickWeighted(pool, weightOf));
  return picks
    .map((place) => ({ place, text: rng.pick(rumorsOf(place)), roll: rng.next() }))
    .sort((a, b) => a.roll - b.roll)
    .map(({ place, text }) => ({ place, text }));
}

// Auto-decide: the rumor that best suits the hero, weighing the region's levels against the walk.
export function autoRumor(life, options) {
  let best = 0;
  options.forEach((option, index) => {
    if (unsuited(life, option.place) < unsuited(life, options[best].place)) best = index;
  });
  return best;
}

// How badly a place suits the hero, in tiles: the walk there, plus the level gap counted as tiles.
function unsuited({ hero, world }, place) {
  return levelGap(hero.level, place.region, placeHarder(place, world)) * rumorSettings.levelTiles + Math.hypot(place.x - hero.x, place.y - hero.y);
}
