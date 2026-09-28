// Rumors: how heroes choose where to go next.
// In a town, or at camp, the player picks one of a few rumors. Each rumor is about a place
// (see `rumors` on each place in regions.js); the hero walks there, then heads back to the
// nearest town to rest, or makes camp if no town is near.
// All numbers are starting values to tune during playtests.

export const rumorSettings = {
  options: 3,         // rumors offered at each choice
  fogWeight: 2,       // places nobody has discovered yet are this many times likelier to be rumored
  recentWeight: 0.2,  // places among the hero's last few destinations are rumored this much as often
  recentCount: 3,     // how many recent destinations count as "recent"
  exploreNearby: 2,   // after a rumor's end, heroes explore up to this many nearby places on their own
  nearbyWithin: 40,   // ...in the same region, if one they haven't just visited lies within this many tiles
  campBeyond: 50,     // then they walk back to a town within this many tiles; beyond that, they camp
  campSeasons: 2,     // seasons spent resting at camp
  levelTiles: 30,     // how well a rumor suits the hero: each level the hero is outside its region's
                      // levels counts as much as walking this many tiles. One of the rumors offered
                      // is among the best suited, and Auto-decide picks the best suited
  suitedPicks: 3,     // the rumor that suits the hero is drawn from this many best-suited places
  readyBelow: 1,      // heroes count as ready for a region this many levels below its lowest level
                      // (so a town's new recruits, who start 1 level below, adventure in its region)
};

// Danger skulls: how far the place's region's lowest level is above the hero's level.
// Below `twoSkulls` levels above: 1 skull. From `twoSkulls`: 2 skulls. From `threeSkulls`: 3.
export const danger = { twoSkulls: 2, threeSkulls: 4, skull: '☠' };

// Compass directions, clockwise from east.
export const directions = ['east', 'south-east', 'south', 'south-west', 'west', 'north-west', 'north', 'north-east'];

// How far away, as [up to this many tiles, word].
export const distances = [[25, 'Near'], [70, 'A fair walk'], [Infinity, 'Far']];

// Text on the rumor cards. {words} are filled in automatically.
export const rumorText = {
  townTitle: 'Rumors in {town}',
  campTitle: 'Rumors around the campfire',
  detail: '{distance} to the {direction} · {region}',
  unexplored: 'unexplored',
};

// Log lines. {town}, {place} and {direction} are filled in automatically.
export const rumorLines = {
  // Leaving a town for a place nobody has discovered yet.
  intoFog: [
    'left {town} to chase a rumor to the {direction}.',
    'set out from {town} after a rumor, heading {direction}.',
  ],
  // Leaving camp.
  breakCamp: [
    'broke camp and headed {direction}.',
    'packed up camp and followed a rumor {direction}.',
  ],
  // Making camp far from any town.
  camp: [
    'made camp under the stars.',
    'built a small fire and made camp.',
    'camped out, listening to the owls argue.',
  ],
  // Exploring a nearby place after reaching a rumor's end.
  explore: [
    'decided to have a look at {place} while nearby.',
    'spotted {place} nearby, and went for a look.',
  ],
  // Heading back to a town after reaching a rumor's end.
  homeward: [
    'turned back toward {town} for a hot meal.',
    'headed back to {town} to rest and resupply.',
  ],
};
