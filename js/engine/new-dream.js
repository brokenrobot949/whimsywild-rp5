// New Game+: letting Sominus dream again. The world's dream is saved with it as `world.cycle`:
// { number, mood, legend }, where `number` counts the dreams (1 is the first), `mood` is
// 'gentle' or 'restless', and `legend` is the hero who last sang the lullaby ({ name, epithet }),
// or null in the first dream. The words and numbers are in data/new-dream.js.
import { moods, legend, turns, newDreamText } from '../../data/new-dream.js';
import { checkEffects } from './skills.js';
import { fill } from './text.js';

// Check the data once at startup, so a typo shows a clear message.
for (const [id, mood] of Object.entries(moods)) {
  if (!mood.name) throw new Error(`The mood "${id}" in data/new-dream.js needs a name.`);
  if (mood.effects) checkEffects(mood.effects, `The mood "${id}" in data/new-dream.js`);
}
checkEffects(legend.effects, 'The legend in data/new-dream.js');
if (!turns.length || turns.some((turn) => ![0, 1, 2, 3].includes(turn))) {
  throw new Error('The turns in data/new-dream.js must each be 0, 1, 2 or 3.');
}

// The first dream, for a brand-new world.
export const FIRST_DREAM = { number: 1, mood: 'gentle', legend: null };

export function moodById(id) {
  return moods[id] ?? moods.gentle;
}

// Which way the map lies in a dream: 0 as first made, 1 mirrored, 2 upside down, 3 both.
export function turnOf(dreamNumber) {
  return turns[(dreamNumber - 1) % turns.length];
}

// "first", "second", ... for a dream's number.
export function ordinal(number) {
  return newDreamText.ordinals[number - 1] ?? fill(newDreamText.ordinalBeyond, { n: number });
}

// The legend's gift to a new hero, shaped like a mentor's (see giveGift in life.js).
export function legendGift(info) {
  const first = info.name.split(' ')[0];
  const words = { name: `${info.name} ${info.epithet}`.trim(), first };
  return {
    name: info.name,
    gift: 'legend',
    legend: true,
    text: fill(legend.text, words),
    line: fill(legend.line, words),
    effects: legend.effects,
    skill: null,
  };
}

// The next dream: one number on, with the chosen mood, and the singer of this one as its legend.
export function nextDream(world, mood) {
  const finale = world.finale;
  return {
    number: (world.cycle?.number ?? 1) + 1,
    mood,
    legend: finale ? { name: finale.hero, epithet: finale.epithet } : world.cycle?.legend ?? null,
  };
}

// A record of a finished dream, for the Chronicle's "Past dreams".
export function pastDream(world, heroes) {
  const finale = world.finale;
  return {
    number: world.cycle?.number ?? 1,
    mood: world.cycle?.mood ?? 'gentle',
    singer: finale ? { name: finale.hero, epithet: finale.epithet, age: finale.age } : null,
    heroes,
  };
}
