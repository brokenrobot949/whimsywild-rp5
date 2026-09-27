// Lifetime records for the Chronicle, worked out from every finished life in the save.
import { lifeClock } from '../../data/life.js';

export function chronicleStats(lives) {
  const sum = (pick) => lives.reduce((total, life) => total + (pick(life) ?? 0), 0);
  const fell = lives.filter((life) => life.ending === 'died');
  const best = (pick) => lives.reduce((top, life) => (!top || pick(life) > pick(top) ? life : top), null);
  const oldest = best((life) => life.age);
  const strongest = best((life) => life.level);
  return {
    heroes: lives.length,
    years: sum((life) => life.age - lifeClock.startAge),
    monstersSlain: sum((life) => life.monstersSlain),
    goldFound: sum((life) => life.goldFound),
    retired: lives.length - fell.length,
    fell: fell.length,
    commonCause: mostCommon(fell.map((life) => life.cause)),
    commonClass: mostCommon(lives.map((life) => life.className)),
    longest: oldest && { name: oldest.name, years: oldest.age - lifeClock.startAge },
    highest: strongest && { name: strongest.name, level: strongest.level },
  };
}

// The value that appears most often, with its count: { name, count }. Ties go to the earliest.
function mostCommon(values) {
  const counts = new Map();
  for (const value of values) if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  let top = null;
  for (const [name, count] of counts) if (!top || count > top.count) top = { name, count };
  return top;
}
