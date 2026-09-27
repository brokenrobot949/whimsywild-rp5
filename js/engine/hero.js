// A hero: who they are, how old they are, and where they stand.
import { firstNames, familyNames, defaultEpithet } from '../../data/names.js';
import { lifeClock } from '../../data/life.js';

export function createHero(seed, rng) {
  return {
    seed,
    name: `${rng.pick(firstNames)} ${rng.pick(familyNames)}`,
    epithet: defaultEpithet,
    age: lifeClock.startAge,
    season: 0, // position in the seasons list in data/life.js; 0 is Spring
    level: 1,
    x: 0,
    y: 0,
  };
}
